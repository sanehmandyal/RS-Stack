import type { Request, Response } from 'express';
import { env } from '../config/env.js';
import { permissionsFor, type Role } from '../config/permissions.js';
import { User } from '../models/auth.js';
import { audit, auditAnonymous } from '../services/auditService.js';
import {
  consumeResetToken,
  createResetToken,
  createSession,
  revokeAllSessions,
  revokeSessionByToken,
  setPassword,
  verifyCurrentPassword,
  verifyLogin,
} from '../services/authService.js';
import { sendPasswordReset } from '../services/mailService.js';
import { cookieOptions } from '../middleware/auth.js';
import { badRequest, unauthorized } from '../utils/errors.js';
import { changePasswordSchema, forgotSchema, loginSchema, resetSchema } from '../validators/schemas.js';

const publicUser = (u: { id?: string; _id?: unknown; email: string; name: string; role: string; mustChangePassword?: boolean }) => ({
  id: String(u.id ?? u._id),
  email: u.email,
  name: u.name,
  role: u.role,
  mustChangePassword: Boolean(u.mustChangePassword),
  permissions: permissionsFor(u.role as Role),
});

export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body);
  const result = await verifyLogin(email, password);
  if (!result.ok) {
    // Failure monitoring: every failed attempt is audited (reason is logged, never returned to the client).
    await auditAnonymous(req, 'auth.login_failed', { email: result.email, reason: result.reason });
    throw unauthorized('Invalid email or password');
  }
  const session = await createSession(result.user.id, req);
  res.cookie(env.cookieName, session.token, cookieOptions(session.expiresAt));
  req.auth = {
    userId: result.user.id,
    email: result.user.email,
    name: result.user.name,
    role: result.user.role as Role,
    sessionId: '',
    csrfToken: session.csrfToken,
  };
  await audit(req, 'auth.login', { type: 'User', id: result.user.id });
  res.json({ user: publicUser(result.user), csrfToken: session.csrfToken, token: session.token });
}

export async function me(req: Request, res: Response) {
  const user = await User.findById(req.auth!.userId);
  if (!user) throw unauthorized();
  res.json({ user: publicUser(user), csrfToken: req.auth!.csrfToken });
}

export async function logout(req: Request, res: Response) {
  const token = req.cookies?.[env.cookieName];
  if (typeof token === 'string') await revokeSessionByToken(token);
  await audit(req, 'auth.logout', { type: 'User', id: req.auth!.userId });
  res.clearCookie(env.cookieName, cookieOptions());
  res.json({ ok: true });
}

export async function changePassword(req: Request, res: Response) {
  const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
  // Re-authentication for a sensitive account change.
  if (!(await verifyCurrentPassword(req.auth!.userId, currentPassword))) throw badRequest('Current password is incorrect');
  if (currentPassword === newPassword) throw badRequest('New password must be different');
  await setPassword(req.auth!.userId, newPassword); // also revokes every session
  await audit(req, 'auth.password_changed', { type: 'User', id: req.auth!.userId });
  res.clearCookie(env.cookieName, cookieOptions());
  res.json({ ok: true, message: 'Password changed. Please sign in again.' });
}

export async function forgotPassword(req: Request, res: Response) {
  const { email } = forgotSchema.parse(req.body);
  const user = await User.findOne({ email, active: true });
  if (user) {
    const token = await createResetToken(String(user._id));
    void sendPasswordReset(user.email, token);
    await auditAnonymous(req, 'auth.reset_requested', { email });
  }
  // Same response whether or not the account exists (no user enumeration).
  res.json({ ok: true, message: 'If that account exists, a reset link has been sent.' });
}

export async function resetPassword(req: Request, res: Response) {
  const { token, password } = resetSchema.parse(req.body);
  const userId = await consumeResetToken(token);
  if (!userId) throw badRequest('This reset link is invalid or has expired');
  await setPassword(userId, password);
  await revokeAllSessions(userId);
  await auditAnonymous(req, 'auth.password_reset', { userId });
  res.json({ ok: true });
}
