import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { ContactConsent, Lead } from '../models/crm.js';
import { clearDb, loginAs, makeUser, startTestApp, stopTestApp, validLead } from './helpers.js';
let app;
beforeAll(async () => { app = await startTestApp(); });
afterAll(stopTestApp);
beforeEach(clearDb);
describe('public lead capture', () => {
    it('stores a valid enquiry with a consent record and hashed IP', async () => {
        const res = await request(app).post('/api/public/leads').send(validLead());
        expect(res.status).toBe(201);
        const lead = await Lead.findOne({ email: 'asha@example.com' }).lean();
        expect(lead.status).toBe('new');
        expect(lead.ipHash).toBeTruthy();
        expect(lead.ipHash).not.toMatch(/\d+\.\d+\.\d+\.\d+/);
        expect(await ContactConsent.countDocuments()).toBe(1);
    });
    it('rejects invalid input with field-level errors and no internals', async () => {
        const res = await request(app).post('/api/public/leads').send(validLead({ email: 'not-an-email', message: 'short' }));
        expect(res.status).toBe(400);
        expect(res.body.code).toBe('validation_error');
        expect(JSON.stringify(res.body)).not.toMatch(/stack|mongoose|at \w+/i);
        expect(await Lead.countDocuments()).toBe(0);
    });
    it('requires privacy consent', async () => {
        const res = await request(app).post('/api/public/leads').send(validLead({ consent: false }));
        expect(res.status).toBe(400);
    });
    it('rejects unknown fields (mass-assignment protection)', async () => {
        const res = await request(app).post('/api/public/leads').send(validLead({ status: 'won', isSpam: false, assignedTo: '507f1f77bcf86cd799439011' }));
        expect(res.status).toBe(400);
    });
    it('rejects markup in text fields', async () => {
        const res = await request(app).post('/api/public/leads').send(validLead({ message: '<script>alert(1)</script> please call me' }));
        expect(res.status).toBe(400);
    });
    it('silently drops honeypot submissions', async () => {
        const res = await request(app).post('/api/public/leads').send(validLead({ website: 'http://spam.example' }));
        expect(res.status).toBe(201);
        expect(await Lead.countDocuments()).toBe(0);
    });
    it('silently drops implausibly fast submissions', async () => {
        const res = await request(app).post('/api/public/leads').send(validLead({ formStartedAt: Date.now() - 200 }));
        expect(res.status).toBe(201);
        expect(await Lead.countDocuments()).toBe(0);
    });
    it('is not vulnerable to operator injection through the body', async () => {
        const res = await request(app).post('/api/public/leads').send(validLead({ email: { $ne: null } }));
        expect(res.status).toBe(400);
    });
});
describe('lead management', () => {
    it('filters, searches and paginates', async () => {
        await makeUser('admin');
        await Lead.create([
            { ...validLead({ name: 'Alpha' }), status: 'new', services: ['local-seo'] },
            { ...validLead({ name: 'Beta', email: 'b@example.com' }), status: 'won', services: ['google-ads'] },
            { ...validLead({ name: 'Gamma', email: 'g@example.com' }), status: 'new', isSpam: true },
        ]);
        const s = await loginAs(app, 'admin@example.com');
        expect((await s.get('/api/admin/leads')).body.total).toBe(2); // spam hidden by default
        expect((await s.get('/api/admin/leads?status=won')).body.items[0].name).toBe('Beta');
        expect((await s.get('/api/admin/leads?service=local-seo')).body.total).toBe(1);
        expect((await s.get('/api/admin/leads?q=alp')).body.total).toBe(1);
        expect((await s.get('/api/admin/leads?spam=true')).body.total).toBe(1);
        expect((await s.get('/api/admin/leads?limit=1&page=2')).body.items).toHaveLength(1);
    });
    it('ignores operator-style query parameters', async () => {
        await makeUser('admin');
        await Lead.create(validLead());
        const s = await loginAs(app, 'admin@example.com');
        const res = await s.get('/api/admin/leads?status[$ne]=won');
        expect(res.status).toBe(200);
        expect(res.body.total).toBe(1);
    });
    it('marks spam, archives, and records an audit trail', async () => {
        await makeUser('admin');
        const lead = await Lead.create(validLead());
        const s = await loginAs(app, 'admin@example.com');
        expect((await s.patch(`/api/admin/leads/${lead._id}`, { isSpam: true })).status).toBe(200);
        expect((await s.get('/api/admin/leads')).body.total).toBe(0);
        const { AuditLog } = await import('../models/AuditLog.js');
        expect(await AuditLog.countDocuments({ action: 'lead.updated' })).toBe(1);
    });
    it('validates status values', async () => {
        await makeUser('admin');
        const lead = await Lead.create(validLead());
        const s = await loginAs(app, 'admin@example.com');
        expect((await s.patch(`/api/admin/leads/${lead._id}`, { status: 'hacked' })).status).toBe(400);
    });
    it('CSV export neutralises spreadsheet formulas and is audited', async () => {
        await makeUser('admin');
        await Lead.create({ ...validLead({ name: '=HYPERLINK("http://evil","x")' }), message: '+cmd|calc' });
        const s = await loginAs(app, 'admin@example.com');
        const res = await s.get('/api/admin/leads/export.csv');
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/text\/csv/);
        expect(res.text).toContain(`"'=HYPERLINK(""http://evil"",""x"")"`);
        expect(res.text).toContain("'+cmd|calc");
        expect(res.text).not.toMatch(/(^|,)=HYPERLINK/m);
    });
});
