import argon2 from 'argon2';
import { env } from '../config/env.js';
import { PasswordResetToken, Session, User } from '../models/auth.js';
import { hashIp, randomToken, sha256 } from '../utils/security.js';
const ARGON_OPTS = { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 };
export const hashPassword = (pw) => argon2.hash(pw, ARGON_OPTS);
let dummyHash = null;
/** Verifies against a dummy hash so unknown emails take about as long as known ones. */
async function burnTime(pw) {
    dummyHash ??= argon2.hash('not-a-real-password-for-timing', ARGON_OPTS);
    await argon2.verify(await dummyHash, pw).catch(() => false);
}
const MAX_FAILED = 5;
const LOCK_MINUTES = 15;
export async function verifyLogin(emailRaw, password) {
    const email = emailRaw.toLowerCase();
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
        await burnTime(password);
        return { ok: false, reason: 'unknown', email };
    }
    if (user.lockUntil && user.lockUntil > new Date()) {
        await burnTime(password);
        return { ok: false, reason: 'locked', email };
    }
    const valid = await argon2.verify(user.passwordHash, password).catch(() => false);
    if (!valid) {
        user.failedLogins = (user.failedLogins ?? 0) + 1;
        if (user.failedLogins >= MAX_FAILED) {
            user.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60_000);
            user.failedLogins = 0;
        }
        await user.save();
        return { ok: false, reason: 'invalid', email };
    }
    if (!user.active)
        return { ok: false, reason: 'inactive', email };
    user.failedLogins = 0;
    user.lockUntil = undefined;
    user.lastLoginAt = new Date();
    // Opportunistic upgrade if parameters changed.
    if (argon2.needsRehash(user.passwordHash, ARGON_OPTS))
        user.passwordHash = await hashPassword(password);
    await user.save();
    return {
        ok: true,
        user: { id: String(user._id), email: user.email, name: user.name, role: user.role, mustChangePassword: user.mustChangePassword },
    };
}
export async function createSession(userId, req) {
    const token = randomToken(32);
    const csrfToken = randomToken(24);
    const expiresAt = new Date(Date.now() + env.SESSION_TTL_HOURS * 3600_000);
    await Session.create({
        user: userId,
        tokenHash: sha256(token),
        csrfToken,
        expiresAt,
        ipHash: hashIp(req.ip),
        userAgent: (req.get('user-agent') ?? '').slice(0, 300),
    });
    return { token, csrfToken, expiresAt };
}
export const revokeSessionByToken = (token) => Session.updateOne({ tokenHash: sha256(token), revokedAt: { $exists: false } }, { $set: { revokedAt: new Date() } });
export const revokeAllSessions = (userId, exceptSessionId) => Session.updateMany({ user: userId, revokedAt: { $exists: false }, ...(exceptSessionId ? { _id: { $ne: exceptSessionId } } : {}) }, { $set: { revokedAt: new Date() } });
export async function createResetToken(userId) {
    const token = randomToken(32);
    await PasswordResetToken.deleteMany({ user: userId, usedAt: { $exists: false } });
    await PasswordResetToken.create({ user: userId, tokenHash: sha256(token), expiresAt: new Date(Date.now() + 30 * 60_000) });
    return token;
}
/** Consumes a reset token (single use). Returns the user id or null. */
export async function consumeResetToken(token) {
    const doc = await PasswordResetToken.findOneAndUpdate({ tokenHash: sha256(token), usedAt: { $exists: false }, expiresAt: { $gt: new Date() } }, { $set: { usedAt: new Date() } }, { new: true });
    return doc ? String(doc.user) : null;
}
export async function setPassword(userId, newPassword, mustChange = false) {
    const passwordHash = await hashPassword(newPassword);
    await User.updateOne({ _id: userId }, { $set: { passwordHash, passwordChangedAt: new Date(), mustChangePassword: mustChange, failedLogins: 0 }, $unset: { lockUntil: 1 } });
    await revokeAllSessions(userId);
}
export async function verifyCurrentPassword(userId, password) {
    const user = await User.findById(userId).select('+passwordHash');
    if (!user)
        return false;
    return argon2.verify(user.passwordHash, password).catch(() => false);
}
