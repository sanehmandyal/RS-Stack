import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { createApp } from '../app.js';
import { User } from '../models/auth.js';
import { hashPassword } from '../services/authService.js';
export const PASSWORD = 'Str0ng-Passphrase-123';
let mongod;
export async function startTestApp() {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    await Promise.all(Object.values(mongoose.models).map((m) => m.init()));
    return createApp();
}
export async function stopTestApp() {
    await mongoose.disconnect();
    await mongod.stop();
}
export async function clearDb() {
    await Promise.all(Object.values(mongoose.connection.collections).map((c) => c.deleteMany({})));
}
export async function makeUser(role, email = `${role}@example.com`, extra = {}) {
    return User.create({ email, name: `Test ${role}`, role, passwordHash: await hashPassword(PASSWORD), ...extra });
}
/** Logs in and returns a supertest agent (keeps the cookie) plus helpers that attach the CSRF header. */
export async function loginAs(app, email, password = PASSWORD) {
    const agent = request.agent(app);
    const res = await agent.post('/api/admin/auth/login').send({ email, password });
    if (res.status !== 200)
        throw new Error(`login failed: ${res.status} ${JSON.stringify(res.body)}`);
    const csrf = res.body.csrfToken;
    return {
        agent,
        csrf,
        res,
        get: (url) => agent.get(url),
        post: (url, body) => agent.post(url).set('X-CSRF-Token', csrf).send(body),
        patch: (url, body) => agent.patch(url).set('X-CSRF-Token', csrf).send(body),
        put: (url, body) => agent.put(url).set('X-CSRF-Token', csrf).send(body),
        del: (url) => agent.delete(url).set('X-CSRF-Token', csrf),
    };
}
export const validLead = (over = {}) => ({
    name: 'Asha Verma',
    businessName: 'Verma Cleaners',
    email: 'asha@example.com',
    phone: '+91 98765 43210',
    businessType: 'cleaning_services',
    services: ['local-seo'],
    message: 'I would like help getting more local customers.',
    preferredContact: 'email',
    consent: true,
    ...over,
});
