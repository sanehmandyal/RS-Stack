import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { env, isAllowedOrigin } from '../config/env.js';
import { can, type Permission } from '../config/permissions.js';
import { Session } from '../models/auth.js';
import { asyncHandler, forbidden, unauthorized } from '../utils/errors.js';
import { safeEqual, sha256 } from '../utils/security.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export function cookieOptions(expires?: Date) {
  return {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.COOKIE_SAMESITE,
    path: '/',
    domain: env.COOKIE_DOMAIN || undefined,
    ...(expires ? { expires } : {}),
  } as const;
}

/**
 * Authenticates the request from the HttpOnly session cookie. The role is always loaded from the
 * database — nothing role-related is read from the request. State-changing requests additionally
 * require a matching CSRF token (header) and an allow-listed Origin.
 */
export const requireAuth: RequestHandler = asyncHandler(async (req, _res, next) => {
  const cookieToken = req.cookies?.[env.cookieName];
  const authHeader = req.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;
  const token = (typeof cookieToken === 'string' && cookieToken.length >= 20)
    ? cookieToken
    : (typeof bearerToken === 'string' && bearerToken.length >= 20 ? bearerToken : undefined);

  if (!token) throw unauthorized();

  const session = await Session.findOne({
    tokenHash: sha256(token),
    revokedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  }).populate<{ user: any }>('user');
  const user = session?.user;
  if (!session || !user || !user.active) throw unauthorized();

  if (!SAFE_METHODS.has(req.method)) {
    const origin = req.get('origin');
    if (origin && !isAllowedOrigin(origin)) throw forbidden('Origin not allowed');
    // If authenticated via cookie, enforce strict CSRF header check.
    // If authenticated via explicit Bearer header, browser does not send it automatically,
    // but if CSRF token header is present, we validate it.
    const header = req.get('x-csrf-token');
    if (cookieToken && (!header || !safeEqual(header, session.csrfToken))) {
      throw forbidden('Invalid CSRF token');
    }
  }

  req.auth = {
    userId: String(user._id),
    email: user.email,
    name: user.name,
    role: user.role,
    sessionId: String(session._id),
    csrfToken: session.csrfToken,
  };
  next();
});

/** Use after requireAuth. Passes if the user's role has ANY of the listed permissions. */
export const requirePermission =
  (...perms: Permission[]): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) return next(unauthorized());
    if (!perms.some((p) => can(req.auth!.role, p))) return next(forbidden());
    next();
  };

/** Users who must change their password may only reach the change-password / me / logout endpoints. */
export const blockIfMustChangePassword: RequestHandler = asyncHandler(async (req, _res, next) => {
  const { User } = await import('../models/auth.js');
  const u = await User.findById(req.auth!.userId).select('mustChangePassword');
  if (u?.mustChangePassword) throw forbidden('Password change required');
  next();
});
