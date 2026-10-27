import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import multer from 'multer';
import sharp from 'sharp';
import { env } from '../config/env.js';
import { badRequest } from '../utils/errors.js';

export const uploadDir = path.resolve(env.UPLOAD_DIR);

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.MAX_UPLOAD_MB * 1024 * 1024, files: 1, fields: 5 },
  fileFilter: (_req, file, cb) => {
    // First gate only; the real check is the magic-byte signature below.
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)) {
      return cb(badRequest('Only JPEG, PNG, WebP or GIF images are allowed'));
    }
    cb(null, true);
  },
}).single('file');

/** Detects the real image type from file signature bytes (ignores client-supplied type and name). */
export function detectImageType(buf: Buffer): 'jpeg' | 'png' | 'webp' | 'gif' | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpeg';
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (buf.subarray(0, 4).toString('ascii') === 'GIF8') return 'gif';
  if (buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP') return 'webp';
  return null;
}

/**
 * Validates, re-encodes (strips metadata, bounds dimensions, converts to WebP) and stores the image.
 * Re-encoding also neutralises polyglot files. Output name is random — user input never touches the path.
 */
export async function processAndStoreImage(buf: Buffer) {
  const type = detectImageType(buf);
  if (!type) throw badRequest('File content is not a supported image');

  let out: { data: Buffer; info: sharp.OutputInfo };
  try {
    out = await sharp(buf, { limitInputPixels: 40_000_000 })
      .rotate()
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
  } catch {
    throw badRequest('Image could not be processed');
  }

  await fs.mkdir(uploadDir, { recursive: true });
  const filename = `${crypto.randomUUID()}.webp`;
  await fs.writeFile(path.join(uploadDir, filename), out.data, { flag: 'wx', mode: 0o640 });
  return { filename, size: out.data.length, width: out.info.width, height: out.info.height, mime: 'image/webp' };
}

export async function deleteStoredFile(filename: string) {
  // filename comes from our own DB, but guard anyway.
  if (!/^[a-f0-9-]{36}\.webp$/.test(filename)) return;
  await fs.rm(path.join(uploadDir, filename), { force: true });
}
