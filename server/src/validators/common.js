import { z } from 'zod';
import { env } from '../config/env.js';
/** Plain text: trimmed, bounded, and no angle brackets (prevents markup/script injection in meta & title fields). */
export const plain = (max, min = 0) => z
    .string()
    .trim()
    .min(min)
    .max(max)
    .refine((v) => !/[<>]/.test(v), 'Angle brackets are not allowed');
export const optPlain = (max) => plain(max).optional().or(z.literal(''));
export const slug = z
    .string()
    .trim()
    .toLowerCase()
    .min(2)
    .max(90)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens');
export const password = z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .max(128)
    .refine((v) => /[a-z]/.test(v) && /[A-Z]/.test(v) && /\d/.test(v), 'Use upper-case, lower-case and a number');
export const email = z.string().trim().toLowerCase().email().max(254);
export const phone = z
    .string()
    .trim()
    .regex(/^\+?[\d][\d\s().-]{6,19}$/, 'Enter a valid phone number');
export const stringList = (itemMax = 300, maxItems = 40) => z.array(plain(itemMax, 1)).max(maxItems);
/** https URL (or empty). */
export const httpsUrl = z
    .string()
    .trim()
    .max(400)
    .refine((v) => v === '' || /^https:\/\/[^\s<>"']+$/i.test(v), 'Must be an https:// URL');
/** Site-relative path ("/x") or https URL. Blocks protocol-relative and javascript: URLs. */
export const pathOrHttps = z
    .string()
    .trim()
    .max(400)
    .refine((v) => v === '' || (/^\/(?!\/)[^\s<>"'\\]*$/.test(v)) || /^https:\/\/[^\s<>"']+$/i.test(v), 'Must be a site path starting with / or an https:// URL');
/** Canonical URLs must stay on the configured site host. */
export const canonicalUrl = z
    .string()
    .trim()
    .max(400)
    .refine((v) => {
    if (v === '')
        return true;
    try {
        const u = new URL(v);
        return (u.protocol === 'https:' || u.protocol === 'http:') && u.host === new URL(env.siteUrl).host;
    }
    catch {
        return false;
    }
}, 'Canonical URL must be on the configured site domain');
export const idString = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');
