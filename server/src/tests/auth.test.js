import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { PasswordResetToken, Session, User } from '../models/auth.js';
import { AuditLog } from '../models/AuditLog.js';
import { createResetToken } from '../services/authService.js';
import { clearDb, loginAs, makeUser, PASSWORD, startTestApp, stopTestApp } from './helpers.js';
let app;
beforeAll(async () => { app = await startTestApp(); });
afterAll(stopTestApp);
beforeEach(clearDb);
describe('authentication', () => {
    it('logs in with an HttpOnly session cookie and never exposes the password hash', async () => {
        await makeUser('admin', 'a@example.com');
        const res = await request(app).post('/api/admin/auth/login').send({ email: 'a@example.com', password: PASSWORD });
        expect(res.status).toBe(200);
        const cookie = String(res.headers['set-cookie']);
        expect(cookie).toMatch(/rs_sid=/);
        expect(cookie).toMatch(/HttpOnly/i);
        expect(cookie).toMatch(/SameSite=Lax/i);
        expect(JSON.stringify(res.body)).not.toMatch(/passwordHash|\$argon2/);
        expect(res.body.csrfToken).toBeTruthy();
    });
    it('returns the same generic error for unknown email and wrong password', async () => {
        await makeUser('admin', 'a@example.com');
        const wrong = await request(app).post('/api/admin/auth/login').send({ email: 'a@example.com', password: 'nope-nope-nope' });
        const unknown = await request(app).post('/api/admin/auth/login').send({ email: 'x@example.com', password: 'nope-nope-nope' });
        expect(wrong.status).toBe(401);
        expect(unknown.status).toBe(401);
        expect(wrong.body.error).toBe(unknown.body.error);
    });
    it('audits failed logins and locks the account after repeated failures', async () => {
        await makeUser('admin', 'a@example.com');
        for (let i = 0; i < 5; i++)
            await request(app).post('/api/admin/auth/login').send({ email: 'a@example.com', password: 'wrong-wrong-1' });
        // Correct password is now rejected while locked.
        const locked = await request(app).post('/api/admin/auth/login').send({ email: 'a@example.com', password: PASSWORD });
        expect(locked.status).toBe(401);
        expect(await AuditLog.countDocuments({ action: 'auth.login_failed' })).toBeGreaterThanOrEqual(5);
    });
    it('rejects inactive users', async () => {
        await makeUser('admin', 'a@example.com', { active: false });
        const res = await request(app).post('/api/admin/auth/login').send({ email: 'a@example.com', password: PASSWORD });
        expect(res.status).toBe(401);
    });
    it('requires authentication for admin endpoints', async () => {
        for (const url of ['/api/admin/dashboard', '/api/admin/leads', '/api/admin/users', '/api/admin/services', '/api/admin/settings']) {
            expect((await request(app).get(url)).status).toBe(401);
        }
    });
    it('requires a valid CSRF token for state-changing requests', async () => {
        await makeUser('admin', 'a@example.com');
        const s = await loginAs(app, 'a@example.com');
        const noToken = await s.agent.post('/api/admin/faqs').send({ question: 'Q?', answer: 'An answer' });
        expect(noToken.status).toBe(403);
        const badToken = await s.agent.post('/api/admin/faqs').set('X-CSRF-Token', 'x'.repeat(32)).send({ question: 'Q?', answer: 'An answer' });
        expect(badToken.status).toBe(403);
        const ok = await s.post('/api/admin/faqs', { question: 'Q?', answer: 'An answer' });
        expect(ok.status).toBe(201);
    });
    it('rejects state-changing requests from a disallowed Origin', async () => {
        await makeUser('admin', 'a@example.com');
        const s = await loginAs(app, 'a@example.com');
        const res = await s.agent.post('/api/admin/faqs').set('Origin', 'https://evil.example').set('X-CSRF-Token', s.csrf).send({ question: 'Q?', answer: 'An answer' });
        expect(res.status).toBe(403);
    });
    it('logout revokes the session server-side', async () => {
        await makeUser('admin', 'a@example.com');
        const s = await loginAs(app, 'a@example.com');
        const cookie = String(s.res.headers['set-cookie']);
        expect((await s.get('/api/admin/auth/me')).status).toBe(200);
        await s.post('/api/admin/auth/logout');
        // Replaying the old cookie must fail even though it has not expired.
        const replay = await request(app).get('/api/admin/auth/me').set('Cookie', cookie.split(';')[0]);
        expect(replay.status).toBe(401);
    });
    it('rejects expired sessions', async () => {
        await makeUser('admin', 'a@example.com');
        const s = await loginAs(app, 'a@example.com');
        await Session.updateMany({}, { $set: { expiresAt: new Date(Date.now() - 1000) } });
        expect((await s.get('/api/admin/auth/me')).status).toBe(401);
    });
    it('deactivating a user takes effect immediately', async () => {
        const u = await makeUser('admin', 'a@example.com');
        const s = await loginAs(app, 'a@example.com');
        await User.updateOne({ _id: u._id }, { active: false });
        expect((await s.get('/api/admin/auth/me')).status).toBe(401);
    });
});
describe('password change & reset', () => {
    it('change-password requires the current password and revokes all sessions', async () => {
        await makeUser('admin', 'a@example.com');
        const s = await loginAs(app, 'a@example.com');
        const wrong = await s.post('/api/admin/auth/change-password', { currentPassword: 'incorrect-Pass1', newPassword: 'Another-Strong-Pass-9' });
        expect(wrong.status).toBe(400);
        const ok = await s.post('/api/admin/auth/change-password', { currentPassword: PASSWORD, newPassword: 'Another-Strong-Pass-9' });
        expect(ok.status).toBe(200);
        expect((await s.get('/api/admin/auth/me')).status).toBe(401);
        await loginAs(app, 'a@example.com', 'Another-Strong-Pass-9');
    });
    it('rejects weak new passwords', async () => {
        await makeUser('admin', 'a@example.com');
        const s = await loginAs(app, 'a@example.com');
        const res = await s.post('/api/admin/auth/change-password', { currentPassword: PASSWORD, newPassword: 'short' });
        expect(res.status).toBe(400);
    });
    it('forgot-password answers identically for known and unknown emails', async () => {
        await makeUser('admin', 'a@example.com');
        const a = await request(app).post('/api/admin/auth/forgot-password').send({ email: 'a@example.com' });
        const b = await request(app).post('/api/admin/auth/forgot-password').send({ email: 'nobody@example.com' });
        expect(a.status).toBe(200);
        expect(b.status).toBe(200);
        expect(a.body).toEqual(b.body);
    });
    it('reset tokens are single-use and set a new password', async () => {
        const u = await makeUser('admin', 'a@example.com');
        const token = await createResetToken(String(u._id));
        const first = await request(app).post('/api/admin/auth/reset-password').send({ token, password: 'Brand-New-Passw0rd' });
        expect(first.status).toBe(200);
        const second = await request(app).post('/api/admin/auth/reset-password').send({ token, password: 'Different-Passw0rd-2' });
        expect(second.status).toBe(400);
        await loginAs(app, 'a@example.com', 'Brand-New-Passw0rd');
    });
    it('rejects expired reset tokens', async () => {
        const u = await makeUser('admin', 'a@example.com');
        const token = await createResetToken(String(u._id));
        await PasswordResetToken.updateMany({}, { $set: { expiresAt: new Date(Date.now() - 1000) } });
        const res = await request(app).post('/api/admin/auth/reset-password').send({ token, password: 'Brand-New-Passw0rd' });
        expect(res.status).toBe(400);
    });
    it('users flagged mustChangePassword cannot use other endpoints', async () => {
        await makeUser('admin', 'a@example.com', { mustChangePassword: true });
        const s = await loginAs(app, 'a@example.com');
        expect((await s.get('/api/admin/dashboard')).status).toBe(403);
        const change = await s.post('/api/admin/auth/change-password', { currentPassword: PASSWORD, newPassword: 'Fresh-Passw0rd-Now' });
        expect(change.status).toBe(200);
    });
});
