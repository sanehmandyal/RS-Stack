import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { Lead } from '../models/crm.js';
import { User } from '../models/auth.js';
import { clearDb, loginAs, makeUser, PASSWORD, startTestApp, stopTestApp, validLead } from './helpers.js';
let app;
beforeAll(async () => { app = await startTestApp(); });
afterAll(stopTestApp);
beforeEach(clearDb);
const make = async () => ({
    superA: await makeUser('super_admin'),
    admin: await makeUser('admin'),
    marketing: await makeUser('marketing_manager'),
    sales: await makeUser('sales_manager'),
});
describe('role-based access control (enforced on the server)', () => {
    it('only Super Admin can manage users and see the audit log', async () => {
        await make();
        for (const [role, expected] of [['super_admin', 200], ['admin', 403], ['marketing_manager', 403], ['sales_manager', 403]]) {
            const s = await loginAs(app, `${role}@example.com`);
            expect((await s.get('/api/admin/users')).status).toBe(expected);
            expect((await s.get('/api/admin/audit-log')).status).toBe(expected);
            expect((await s.get('/api/admin/integrations')).status).toBe(expected);
        }
    });
    it('content endpoints follow the permission matrix', async () => {
        await make();
        const admin = await loginAs(app, 'admin@example.com');
        const mkt = await loginAs(app, 'marketing_manager@example.com');
        const sales = await loginAs(app, 'sales_manager@example.com');
        expect((await admin.get('/api/admin/services')).status).toBe(200);
        expect((await mkt.get('/api/admin/services')).status).toBe(403); // services need content:manage
        expect((await mkt.get('/api/admin/blog-posts')).status).toBe(200);
        expect((await mkt.get('/api/admin/page-seo')).status).toBe(200);
        expect((await mkt.get('/api/admin/campaigns')).status).toBe(200);
        expect((await sales.get('/api/admin/blog-posts')).status).toBe(403);
        expect((await sales.get('/api/admin/campaigns')).status).toBe(403);
        expect((await sales.get('/api/admin/settings')).status).toBe(403);
        expect((await mkt.get('/api/admin/settings')).status).toBe(403);
        expect((await mkt.get('/api/admin/clients')).status).toBe(403);
    });
    it('marketing managers cannot read leads', async () => {
        await make();
        const mkt = await loginAs(app, 'marketing_manager@example.com');
        expect((await mkt.get('/api/admin/leads')).status).toBe(403);
        expect((await mkt.get('/api/admin/leads/export.csv')).status).toBe(403);
    });
    it('sales managers only see leads assigned to them (others look like 404)', async () => {
        const { sales } = await make();
        const mine = await Lead.create({ ...validLead(), businessType: 'cleaning_services', assignedTo: sales._id });
        const other = await Lead.create({ ...validLead({ email: 'o@example.com' }), businessType: 'cleaning_services' });
        const s = await loginAs(app, 'sales_manager@example.com');
        const list = await s.get('/api/admin/leads');
        expect(list.status).toBe(200);
        expect(list.body.items.map((l) => String(l._id))).toEqual([String(mine._id)]);
        expect((await s.get(`/api/admin/leads/${mine._id}`)).status).toBe(200);
        expect((await s.get(`/api/admin/leads/${other._id}`)).status).toBe(404);
        expect((await s.patch(`/api/admin/leads/${other._id}`, { status: 'won' })).status).toBe(404);
        expect((await s.post(`/api/admin/leads/${other._id}/notes`, { body: 'hi' })).status).toBe(404);
    });
    it('sales managers can update status and add notes but cannot assign or export', async () => {
        const { sales } = await make();
        const lead = await Lead.create({ ...validLead(), assignedTo: sales._id });
        const s = await loginAs(app, 'sales_manager@example.com');
        expect((await s.patch(`/api/admin/leads/${lead._id}`, { status: 'contacted' })).status).toBe(200);
        expect((await s.post(`/api/admin/leads/${lead._id}/notes`, { body: 'Called, will follow up' })).status).toBe(201);
        expect((await s.patch(`/api/admin/leads/${lead._id}`, { assignedTo: String(sales._id) })).status).toBe(403);
        expect((await s.get('/api/admin/leads/export.csv')).status).toBe(403);
    });
    it('admins can assign leads, but only to eligible active users', async () => {
        const { sales, marketing } = await make();
        const lead = await Lead.create(validLead());
        const a = await loginAs(app, 'admin@example.com');
        expect((await a.patch(`/api/admin/leads/${lead._id}`, { assignedTo: String(sales._id) })).status).toBe(200);
        expect((await a.patch(`/api/admin/leads/${lead._id}`, { assignedTo: String(marketing._id) })).status).toBe(400);
    });
    it('ignores any role supplied by the client', async () => {
        await make();
        const sales = await loginAs(app, 'sales_manager@example.com');
        // Unknown keys are rejected by strict schemas; the role in the cookie-bound session comes from the DB only.
        const res = await sales.post('/api/admin/auth/change-password', { currentPassword: PASSWORD, newPassword: 'Fresh-Passw0rd-Now', role: 'super_admin' });
        expect(res.status).toBe(400);
        expect((await User.findOne({ email: 'sales_manager@example.com' })).role).toBe('sales_manager');
    });
    it('Super Admin cannot demote or delete themselves, nor remove the last Super Admin', async () => {
        const { superA, admin } = await make();
        const s = await loginAs(app, 'super_admin@example.com');
        expect((await s.patch(`/api/admin/users/${superA._id}`, { role: 'admin' })).status).toBe(400);
        expect((await s.del(`/api/admin/users/${superA._id}`)).status).toBe(400);
        // Promote another, then demoting the first is allowed.
        expect((await s.patch(`/api/admin/users/${admin._id}`, { role: 'super_admin' })).status).toBe(200);
    });
    it('role changes revoke the affected user’s sessions immediately', async () => {
        const { admin } = await make();
        const su = await loginAs(app, 'super_admin@example.com');
        const adm = await loginAs(app, 'admin@example.com');
        expect((await adm.get('/api/admin/auth/me')).status).toBe(200);
        expect((await su.patch(`/api/admin/users/${admin._id}`, { role: 'sales_manager' })).status).toBe(200);
        expect((await adm.get('/api/admin/auth/me')).status).toBe(401);
    });
    it('new users must change their temporary password', async () => {
        await make();
        const su = await loginAs(app, 'super_admin@example.com');
        const created = await su.post('/api/admin/users', { email: 'new@example.com', name: 'New Person', role: 'sales_manager', password: 'Temporary-Passw0rd' });
        expect(created.status).toBe(201);
        expect(created.body.mustChangePassword).toBe(true);
        expect(JSON.stringify(created.body)).not.toMatch(/passwordHash|argon2/);
    });
});
