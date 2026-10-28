import { User } from '../models/auth.js';
import { audit } from '../services/auditService.js';
import { hashPassword, revokeAllSessions } from '../services/authService.js';
import { badRequest, conflict, notFound } from '../utils/errors.js';
import { pageMeta, parseObjectId, parsePagination } from '../utils/misc.js';
import { userCreateSchema, userUpdateSchema } from '../validators/schemas.js';
const view = (u) => ({
    id: String(u._id),
    email: u.email,
    name: u.name,
    role: u.role,
    active: u.active,
    mustChangePassword: u.mustChangePassword,
    lastLoginAt: u.lastLoginAt,
    createdAt: u.createdAt,
});
async function activeSuperAdminCount(excludeId) {
    return User.countDocuments({ role: 'super_admin', active: true, ...(excludeId ? { _id: { $ne: excludeId } } : {}) });
}
export async function listUsers(req, res) {
    const { page, limit, skip } = parsePagination(req.query, 25);
    const [items, total] = await Promise.all([User.find().sort({ createdAt: -1 }).skip(skip).limit(limit), User.countDocuments()]);
    res.json({ items: items.map(view), ...pageMeta(total, page, limit) });
}
export async function createUser(req, res) {
    const data = userCreateSchema.parse(req.body);
    if (await User.exists({ email: data.email }))
        throw conflict('A user with that email already exists');
    const user = await User.create({
        email: data.email,
        name: data.name,
        role: data.role,
        passwordHash: await hashPassword(data.password),
        mustChangePassword: true, // the new user must choose their own password at first sign-in
    });
    await audit(req, 'user.created', { type: 'User', id: user._id }, { role: data.role });
    res.status(201).json(view(user));
}
export async function updateUser(req, res) {
    const id = parseObjectId(req.params.id);
    const data = userUpdateSchema.parse(req.body);
    const user = await User.findById(id);
    if (!user)
        throw notFound();
    const self = String(id) === req.auth.userId;
    if (self && (data.role !== undefined || data.active === false))
        throw badRequest('You cannot change your own role or deactivate yourself');
    const losesSuper = user.role === 'super_admin' && ((data.role && data.role !== 'super_admin') || data.active === false);
    if (losesSuper && (await activeSuperAdminCount(String(id))) === 0)
        throw badRequest('At least one active Super Admin is required');
    const roleChanged = data.role !== undefined && data.role !== user.role;
    user.set(data);
    await user.save();
    // Role change or deactivation takes effect immediately.
    if (roleChanged || data.active === false)
        await revokeAllSessions(String(id));
    await audit(req, 'user.updated', { type: 'User', id }, { fields: Object.keys(data) });
    res.json(view(user));
}
export async function revokeUserSessions(req, res) {
    const id = parseObjectId(req.params.id);
    if (!(await User.exists({ _id: id })))
        throw notFound();
    await revokeAllSessions(String(id));
    await audit(req, 'user.sessions_revoked', { type: 'User', id });
    res.json({ ok: true });
}
export async function deleteUser(req, res) {
    const id = parseObjectId(req.params.id);
    if (String(id) === req.auth.userId)
        throw badRequest('You cannot delete your own account');
    const user = await User.findById(id);
    if (!user)
        throw notFound();
    if (user.role === 'super_admin' && (await activeSuperAdminCount(String(id))) === 0)
        throw badRequest('At least one active Super Admin is required');
    await revokeAllSessions(String(id));
    await user.deleteOne();
    await audit(req, 'user.deleted', { type: 'User', id }, { email: user.email });
    res.json({ ok: true });
}
