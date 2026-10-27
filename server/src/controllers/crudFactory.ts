import { Router, type Request } from 'express';
import type { Model } from 'mongoose';
import type { ZodObject, ZodRawShape } from 'zod';
import type { Permission } from '../config/permissions.js';
import { requirePermission } from '../middleware/auth.js';
import { audit } from '../services/auditService.js';
import { asyncHandler, notFound } from '../utils/errors.js';
import { pageMeta, parseObjectId, parsePagination, qs } from '../utils/misc.js';
import { escapeRegex } from '../utils/security.js';

export interface CrudOptions {
  name: string; // audit prefix, e.g. "service"
  model: Model<any>;
  permission: Permission;
  schema: ZodObject<ZodRawShape>;
  searchFields?: string[];
  filterFields?: string[]; // equality filters allowed from the query string
  defaultSort?: Record<string, 1 | -1>;
  populate?: string;
  /** Normalise / sanitise validated data before it is written. `existing` is set on update. */
  beforeSave?: (data: any, req: Request, existing?: any) => any | Promise<any>;
  /** Block deletion when referenced elsewhere, etc. */
  beforeDelete?: (doc: any, req: Request) => Promise<void>;
}

/**
 * Generic, permission-guarded CRUD router. Every route requires the configured permission; payloads are
 * validated against a strict zod schema (unknown keys rejected); query filters accept plain strings only.
 */
export function crudRouter(opts: CrudOptions) {
  const r = Router();
  r.use(requirePermission(opts.permission));
  const sort = opts.defaultSort ?? { createdAt: -1 };

  r.get(
    '/',
    asyncHandler(async (req, res) => {
      const { page, limit, skip } = parsePagination(req.query as any, 25);
      const filter: Record<string, unknown> = {};
      for (const f of opts.filterFields ?? []) {
        const v = qs((req.query as any)[f]);
        if (v !== undefined) filter[f] = v === 'true' ? true : v === 'false' ? false : v;
      }
      const search = qs((req.query as any).q);
      if (search && opts.searchFields?.length) {
        const rx = new RegExp(escapeRegex(search), 'i');
        filter.$or = opts.searchFields.map((f) => ({ [f]: rx }));
      }
      let query: any = opts.model.find(filter).sort(sort).skip(skip).limit(limit);
      if (opts.populate) query = query.populate(opts.populate);
      const [items, total] = await Promise.all([query.lean(), opts.model.countDocuments(filter)]);
      res.json({ items, ...pageMeta(total, page, limit) });
    }),
  );

  r.post(
    '/',
    asyncHandler(async (req, res) => {
      let data: any = opts.schema.parse(req.body);
      if (opts.beforeSave) data = await opts.beforeSave(data, req);
      const doc = await opts.model.create(data);
      await audit(req, `${opts.name}.created`, { type: opts.name, id: doc._id });
      res.status(201).json(doc.toObject());
    }),
  );

  r.get(
    '/:id',
    asyncHandler(async (req, res) => {
      let q: any = opts.model.findById(parseObjectId(req.params.id));
      if (opts.populate) q = q.populate(opts.populate);
      const doc = await q.lean();
      if (!doc) throw notFound();
      res.json(doc);
    }),
  );

  r.patch(
    '/:id',
    asyncHandler(async (req, res) => {
      const doc = await opts.model.findById(parseObjectId(req.params.id));
      if (!doc) throw notFound();
      let data: any = opts.schema.partial().parse(req.body);
      if (opts.beforeSave) data = await opts.beforeSave(data, req, doc);
      doc.set(data);
      await doc.save(); // runs schema validators
      await audit(req, `${opts.name}.updated`, { type: opts.name, id: doc._id }, { fields: Object.keys(data) });
      res.json(doc.toObject());
    }),
  );

  r.delete(
    '/:id',
    asyncHandler(async (req, res) => {
      const doc = await opts.model.findById(parseObjectId(req.params.id));
      if (!doc) throw notFound();
      if (opts.beforeDelete) await opts.beforeDelete(doc, req);
      await doc.deleteOne();
      await audit(req, `${opts.name}.deleted`, { type: opts.name, id: doc._id });
      res.json({ ok: true });
    }),
  );

  return r;
}
