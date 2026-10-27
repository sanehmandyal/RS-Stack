import { Types } from 'mongoose';
import { badRequest } from './errors.js';

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);

export function parsePagination(query: Record<string, unknown>, defaultLimit = 20, maxLimit = 100) {
  const page = Math.max(1, parseInt(String(query.page ?? '1'), 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, parseInt(String(query.limit ?? defaultLimit), 10) || defaultLimit));
  return { page, limit, skip: (page - 1) * limit };
}

export function pageMeta(total: number, page: number, limit: number) {
  return { total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) };
}

/** Query-string values must be plain strings (blocks ?status[$ne]=x style operator injection). */
export const qs = (v: unknown): string | undefined => (typeof v === 'string' && v.length <= 200 ? v : undefined);

export function parseObjectId(id: unknown): Types.ObjectId {
  if (typeof id !== 'string' || !Types.ObjectId.isValid(id) || String(new Types.ObjectId(id)) !== id) {
    throw badRequest('Invalid id');
  }
  return new Types.ObjectId(id);
}

export function parseDate(v: unknown): Date | undefined {
  const s = qs(v);
  if (!s) return undefined;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? undefined : d;
}
