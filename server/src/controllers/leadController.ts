import type { Request, Response } from 'express';
import type { FilterQuery } from 'mongoose';
import { can } from '../config/permissions.js';
import { User } from '../models/auth.js';
import { ContactConsent, Lead, LeadNote } from '../models/crm.js';
import { audit } from '../services/auditService.js';
import { sendLeadNotification } from '../services/mailService.js';
import { logger } from '../config/logger.js';
import { toCsv } from '../utils/csv.js';
import { forbidden, notFound, badRequest } from '../utils/errors.js';
import { pageMeta, parseDate, parseObjectId, parsePagination, qs } from '../utils/misc.js';
import { escapeRegex, hashIp } from '../utils/security.js';
import { leadCreateSchema, leadUpdateSchema, noteSchema } from '../validators/schemas.js';

const CONSENT_TEXT = 'I agree to RS Stack contacting me about my enquiry and storing my details as described in the Privacy Policy.';
const MIN_FILL_MS = 2500;

/** PUBLIC: contact / service inquiry form. */
export async function createLead(req: Request, res: Response) {
  const data = leadCreateSchema.parse(req.body);

  // Spam traps: honeypot field filled, or form submitted impossibly fast. Pretend success so bots learn nothing.
  const tooFast = data.formStartedAt !== undefined && Date.now() - data.formStartedAt < MIN_FILL_MS;
  if ((data.website && data.website.length > 0) || tooFast) {
    logger.info({ requestId: req.requestId }, 'lead dropped by spam trap');
    return res.status(201).json({ ok: true });
  }

  const ipHash = hashIp(req.ip);
  const userAgent = (req.get('user-agent') ?? '').slice(0, 300);
  const consent = await ContactConsent.create({ email: data.email, consentText: CONSENT_TEXT, ipHash, userAgent });
  const lead = await Lead.create({
    name: data.name,
    businessName: data.businessName || undefined,
    email: data.email,
    phone: data.phone || undefined,
    businessType: data.businessType,
    services: data.services,
    budgetRange: data.budgetRange,
    message: data.message,
    preferredContact: data.preferredContact,
    source: data.source ?? 'website',
    utm: data.utm,
    consent: consent._id,
    ipHash,
    userAgent,
  });
  void sendLeadNotification({
    name: data.name,
    email: data.email,
    businessName: data.businessName,
    phone: data.phone,
    businessType: data.businessType,
    services: data.services,
    message: data.message,
    preferredContact: data.preferredContact,
  });
  res.status(201).json({ ok: true, id: String(lead._id) });
}

/** Leads a given user is allowed to see: Sales Managers see only leads assigned to them. */
function scopeFor(req: Request): FilterQuery<any> {
  const a = req.auth!;
  if (can(a.role, 'leads:read_all')) return {};
  if (can(a.role, 'leads:read_assigned')) return { assignedTo: a.userId };
  throw forbidden();
}

function buildFilter(req: Request): FilterQuery<any> {
  const q = req.query as Record<string, unknown>;
  const f: FilterQuery<any> = { ...scopeFor(req) };
  const status = qs(q.status);
  if (status) f.status = status;
  const service = qs(q.service);
  if (service) f.services = service;
  const source = qs(q.source);
  if (source) f.source = source;
  const assigned = qs(q.assignedTo);
  if (assigned && can(req.auth!.role, 'leads:read_all')) f.assignedTo = assigned === 'unassigned' ? null : parseObjectId(assigned);
  f.archived = qs(q.archived) === 'true';
  const spam = qs(q.spam);
  f.isSpam = spam === 'true';
  const from = parseDate(q.from);
  const to = parseDate(q.to);
  if (from || to) f.createdAt = { ...(from ? { $gte: from } : {}), ...(to ? { $lte: to } : {}) };
  const search = qs(q.q);
  if (search) {
    const rx = new RegExp(escapeRegex(search), 'i');
    f.$or = [{ name: rx }, { email: rx }, { businessName: rx }, { message: rx }];
  }
  return f;
}

const SORTS: Record<string, any> = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  followup: { followUpAt: 1 },
  status: { status: 1, createdAt: -1 },
};

export async function listLeads(req: Request, res: Response) {
  const { page, limit, skip } = parsePagination(req.query as any, 20);
  const filter = buildFilter(req);
  const sort = SORTS[qs(req.query.sort) ?? 'newest'] ?? SORTS.newest;
  const [items, total] = await Promise.all([
    Lead.find(filter).sort(sort).skip(skip).limit(limit).populate('assignedTo', 'name email').lean(),
    Lead.countDocuments(filter),
  ]);
  res.json({ items, ...pageMeta(total, page, limit) });
}

async function loadScopedLead(req: Request) {
  const id = parseObjectId(req.params.id);
  // 404 (not 403) when out of scope, so lead existence is not revealed.
  const lead = await Lead.findOne({ _id: id, ...scopeFor(req) });
  if (!lead) throw notFound();
  return lead;
}

export async function getLead(req: Request, res: Response) {
  const lead = await loadScopedLead(req);
  const [populated, notes, consent] = await Promise.all([
    lead.populate('assignedTo', 'name email'),
    LeadNote.find({ lead: lead._id }).sort({ createdAt: -1 }).populate('author', 'name').lean(),
    lead.consent ? ContactConsent.findById(lead.consent).lean() : null,
  ]);
  res.json({ lead: populated.toObject(), notes, consent });
}

export async function updateLead(req: Request, res: Response) {
  const lead = await loadScopedLead(req);
  const data = leadUpdateSchema.parse(req.body);
  const role = req.auth!.role;

  if (data.assignedTo !== undefined) {
    if (!can(role, 'leads:assign')) throw forbidden('You cannot assign leads');
    if (data.assignedTo) {
      const target = await User.findOne({ _id: data.assignedTo, active: true });
      if (!target || !['sales_manager', 'admin', 'super_admin'].includes(target.role)) throw badRequest('Cannot assign to that user');
    }
  }
  if ((data.isSpam !== undefined || data.archived !== undefined) && !can(role, 'leads:write')) throw forbidden();

  const before = { status: lead.status, assignedTo: lead.assignedTo ? String(lead.assignedTo) : null };
  if (data.status) lead.status = data.status;
  if (data.assignedTo !== undefined) lead.assignedTo = (data.assignedTo ?? undefined) as any;
  if (data.followUpAt !== undefined) lead.followUpAt = data.followUpAt ? new Date(data.followUpAt) : undefined;
  if (data.isSpam !== undefined) lead.isSpam = data.isSpam;
  if (data.archived !== undefined) lead.archived = data.archived;
  await lead.save();
  await audit(req, 'lead.updated', { type: 'Lead', id: lead._id }, { fields: Object.keys(data), before });
  res.json({ lead: lead.toObject() });
}

export async function addNote(req: Request, res: Response) {
  const lead = await loadScopedLead(req);
  const { body } = noteSchema.parse(req.body);
  const note = await LeadNote.create({ lead: lead._id, author: req.auth!.userId, body });
  await audit(req, 'lead.note_added', { type: 'Lead', id: lead._id });
  res.status(201).json({ note });
}

export async function exportLeads(req: Request, res: Response) {
  const filter = buildFilter(req);
  const leads = await Lead.find(filter).sort({ createdAt: -1 }).limit(5000).populate('assignedTo', 'name').lean();
  const headers = ['Created', 'Name', 'Business', 'Email', 'Phone', 'Business type', 'Services', 'Budget', 'Status', 'Assigned to', 'Source', 'Follow-up', 'Message'];
  const rows = leads.map((l: any) => [
    l.createdAt, l.name, l.businessName, l.email, l.phone, l.businessType, l.services, l.budgetRange, l.status,
    l.assignedTo?.name, l.source, l.followUpAt, l.message,
  ]);
  await audit(req, 'lead.exported', { type: 'Lead' }, { count: leads.length });
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="rs-stack-leads.csv"');
  res.setHeader('Cache-Control', 'no-store');
  res.send('﻿' + toCsv(headers, rows));
}
