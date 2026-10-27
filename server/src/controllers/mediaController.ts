import type { Request, Response } from 'express';
import { deleteStoredFile, processAndStoreImage } from '../middleware/upload.js';
import { MediaAsset } from '../models/content.js';
import { audit } from '../services/auditService.js';
import { badRequest, notFound } from '../utils/errors.js';
import { pageMeta, parseObjectId, parsePagination } from '../utils/misc.js';
import { plain } from '../validators/common.js';

export async function uploadMedia(req: Request, res: Response) {
  if (!req.file) throw badRequest('No file uploaded');
  const alt = req.body?.alt ? plain(200).parse(String(req.body.alt)) : '';
  const stored = await processAndStoreImage(req.file.buffer);
  const asset = await MediaAsset.create({
    filename: stored.filename,
    originalName: req.file.originalname.replace(/[^\w.\- ]/g, '_').slice(0, 200),
    mime: stored.mime,
    size: stored.size,
    width: stored.width,
    height: stored.height,
    alt,
    uploadedBy: req.auth!.userId,
  });
  await audit(req, 'media.uploaded', { type: 'MediaAsset', id: asset._id });
  res.status(201).json({ ...asset.toObject(), url: `/uploads/${asset.filename}` });
}

export async function listMedia(req: Request, res: Response) {
  const { page, limit, skip } = parsePagination(req.query as any, 24, 100);
  const [items, total] = await Promise.all([
    MediaAsset.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    MediaAsset.countDocuments(),
  ]);
  res.json({ items: items.map((m: any) => ({ ...m, url: `/uploads/${m.filename}` })), ...pageMeta(total, page, limit) });
}

export async function updateMediaAlt(req: Request, res: Response) {
  const asset = await MediaAsset.findById(parseObjectId(req.params.id));
  if (!asset) throw notFound();
  asset.alt = plain(200).parse(String(req.body?.alt ?? ''));
  await asset.save();
  await audit(req, 'media.updated', { type: 'MediaAsset', id: asset._id });
  res.json(asset.toObject());
}

export async function deleteMedia(req: Request, res: Response) {
  const asset = await MediaAsset.findById(parseObjectId(req.params.id));
  if (!asset) throw notFound();
  await deleteStoredFile(asset.filename);
  await asset.deleteOne();
  await audit(req, 'media.deleted', { type: 'MediaAsset', id: asset._id });
  res.json({ ok: true });
}
