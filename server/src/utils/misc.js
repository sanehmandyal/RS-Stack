import { Types } from 'mongoose';
import { badRequest } from './errors.js';
export const slugify = (s) => s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
export function parsePagination(query, defaultLimit = 20, maxLimit = 100) {
    const page = Math.max(1, parseInt(String(query.page ?? '1'), 10) || 1);
    const limit = Math.min(maxLimit, Math.max(1, parseInt(String(query.limit ?? defaultLimit), 10) || defaultLimit));
    return { page, limit, skip: (page - 1) * limit };
}
export function pageMeta(total, page, limit) {
    return { total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) };
}
/** Query-string values must be plain strings (blocks ?status[$ne]=x style operator injection). */
export const qs = (v) => (typeof v === 'string' && v.length <= 200 ? v : undefined);
export function parseObjectId(id) {
    if (typeof id !== 'string' || !Types.ObjectId.isValid(id) || String(new Types.ObjectId(id)) !== id) {
        throw badRequest('Invalid id');
    }
    return new Types.ObjectId(id);
}
export function parseDate(v) {
    const s = qs(v);
    if (!s)
        return undefined;
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? undefined : d;
}
