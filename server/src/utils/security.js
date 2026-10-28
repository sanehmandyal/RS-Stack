import crypto from 'node:crypto';
import sanitizeHtml from 'sanitize-html';
import { env } from '../config/env.js';
export const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
export const randomToken = (bytes = 32) => crypto.randomBytes(bytes).toString('base64url');
/** Salted hash so raw IPs are never stored with leads / audit entries. */
export const hashIp = (ip) => ip ? crypto.createHmac('sha256', env.IP_HASH_SALT).update(ip).digest('hex').slice(0, 32) : undefined;
export function safeEqual(a, b) {
    const ab = Buffer.from(a);
    const bb = Buffer.from(b);
    if (ab.length !== bb.length)
        return false;
    return crypto.timingSafeEqual(ab, bb);
}
export const escapeHtml = (s) => String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
export const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** Allow-list sanitiser for admin-authored rich text (blog posts, case studies). */
export function sanitizeRichText(html) {
    return sanitizeHtml(html, {
        allowedTags: [
            'h2', 'h3', 'h4', 'p', 'br', 'hr', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'u',
            'blockquote', 'code', 'pre', 'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'figure', 'figcaption',
        ],
        allowedAttributes: {
            a: ['href', 'title', 'target', 'rel'],
            img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
            th: ['scope'],
        },
        allowedSchemes: ['http', 'https', 'mailto', 'tel'],
        allowedSchemesByTag: { img: ['http', 'https'] },
        allowProtocolRelative: false,
        transformTags: {
            a: (tagName, attribs) => ({
                tagName,
                attribs: { ...attribs, rel: 'noopener noreferrer nofollow', ...(attribs.target ? { target: '_blank' } : {}) },
            }),
            img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: 'lazy' } }),
        },
    });
}
export const stripHtml = (html) => sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} });
export function readingTimeMinutes(html) {
    const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
}
/** Recursively removes keys that could be interpreted as Mongo operators ($...) or dotted paths. */
export function stripMongoOperators(input) {
    if (Array.isArray(input))
        return input.map(stripMongoOperators);
    if (input && typeof input === 'object') {
        const out = {};
        for (const [k, v] of Object.entries(input)) {
            if (k.startsWith('$') || k.includes('.'))
                continue;
            out[k] = stripMongoOperators(v);
        }
        return out;
    }
    return input;
}
