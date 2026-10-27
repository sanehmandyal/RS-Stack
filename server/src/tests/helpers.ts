import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { createApp } from '../app.js';
import { User } from '../models/auth.js';
import { hashPassword } from '../services/authService.js';
import type { Role } from '../config/permissions.js';

export const PASSWORD = 'Str0ng-Passphrase-123';
let mongod: MongoMemoryServer;

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

export async function makeUser(role: Role, email = `${role}@example.com`, extra: Record<string, unknown> = {}) {
  return User.create({ email, name: `Test ${role}`, role, passwordHash: await hashPassword(PASSWORD), ...extra });
}

/** Logs in and returns a supertest agent (keeps the cookie) plus helpers that attach the CSRF header. */
export async function loginAs(app: ReturnType<typeof createApp>, email: string, password = PASSWORD) {
  const agent = request.agent(app);
  const res = await agent.post('/api/admin/auth/login').send({ email, password });
  if (res.status !== 200) throw new Error(`login failed: ${res.status} ${JSON.stringify(res.body)}`);
  const csrf: string = res.body.csrfToken;
  return {
    agent,
    csrf,
    res,
    get: (url: string) => agent.get(url),
    post: (url: string, body?: unknown) => agent.post(url).set('X-CSRF-Token', csrf).send(body as object),
    patch: (url: string, body?: unknown) => agent.patch(url).set('X-CSRF-Token', csrf).send(body as object),
    put: (url: string, body?: unknown) => agent.put(url).set('X-CSRF-Token', csrf).send(body as object),
    del: (url: string) => agent.delete(url).set('X-CSRF-Token', csrf),
  };
}

export const validLead = (over: Record<string, unknown> = {}) => ({
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
