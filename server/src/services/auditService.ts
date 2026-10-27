import type { Request } from 'express';
import { AuditLog } from '../models/AuditLog.js';
import { logger } from '../config/logger.js';
import { hashIp } from '../utils/security.js';

/** Records an administrative action. Never throws — auditing must not break the request. */
export async function audit(
  req: Request,
  action: string,
  target?: { type?: string; id?: unknown },
  meta?: Record<string, unknown>,
) {
  try {
    await AuditLog.create({
      actor: req.auth?.userId,
      actorEmail: req.auth?.email,
      action,
      targetType: target?.type,
      targetId: target?.id ? String(target.id) : undefined,
      meta,
      ipHash: hashIp(req.ip),
      requestId: req.requestId,
    });
  } catch (err) {
    logger.error({ err, action }, 'failed to write audit log');
  }
}

/** Variant for flows where there is no authenticated actor (e.g. failed logins). */
export async function auditAnonymous(req: Request, action: string, meta?: Record<string, unknown>) {
  return audit(req, action, undefined, meta);
}
