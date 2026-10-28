import { describe, expect, it } from 'vitest';
import { can, ROLE_PERMISSIONS } from '../config/permissions.js';
import { csvCell, toCsv } from '../utils/csv.js';
import { detectImageType } from '../middleware/upload.js';
import { readingTimeMinutes, sanitizeRichText, stripMongoOperators } from '../utils/security.js';
import { leadCreateSchema } from '../validators/schemas.js';
import { pathOrHttps, password } from '../validators/common.js';
describe('csv', () => {
    it.each(['=1+1', '+1', '-1', '@SUM(A1)', '\t=x', '\r=x'])('prefixes %j to block formulas', (v) => {
        expect(csvCell(v).replace(/^"/, '').startsWith("'")).toBe(true);
    });
    it('quotes commas, quotes and newlines', () => {
        expect(csvCell('a,b')).toBe('"a,b"');
        expect(csvCell('say "hi"')).toBe('"say ""hi"""');
        expect(csvCell('l1\nl2')).toBe('"l1\nl2"');
    });
    it('serialises arrays/dates/nullish', () => {
        expect(csvCell(['a', 'b'])).toBe('a; b');
        expect(csvCell(null)).toBe('');
        expect(csvCell(new Date('2026-01-01T00:00:00Z'))).toBe('2026-01-01T00:00:00.000Z');
        expect(toCsv(['h'], [['v']])).toBe('h\r\nv\r\n');
    });
});
describe('permissions matrix', () => {
    it('matches the specified role boundaries', () => {
        expect(can('super_admin', 'users:manage')).toBe(true);
        expect(can('admin', 'users:manage')).toBe(false);
        expect(can('admin', 'integrations:manage')).toBe(false);
        expect(can('admin', 'content:manage')).toBe(true);
        expect(can('marketing_manager', 'users:manage')).toBe(false);
        expect(can('marketing_manager', 'leads:read_all')).toBe(false);
        expect(can('marketing_manager', 'seo:manage')).toBe(true);
        expect(can('sales_manager', 'leads:read_assigned')).toBe(true);
        expect(can('sales_manager', 'leads:read_all')).toBe(false);
        expect(can('sales_manager', 'settings:manage')).toBe(false);
        expect(ROLE_PERMISSIONS.sales_manager.has('leads:export')).toBe(false);
    });
});
describe('security helpers', () => {
    it('strips mongo operators and dotted keys recursively', () => {
        expect(stripMongoOperators({ a: 1, $ne: 2, 'b.c': 3, n: { $gt: 1, ok: [{ $where: 'x', y: 1 }] } })).toEqual({ a: 1, n: { ok: [{ y: 1 }] } });
    });
    it('sanitises rich text', () => {
        const out = sanitizeRichText('<h2>T</h2><iframe src="https://x"></iframe><p style="x">p</p><a href="data:text/html,x">d</a>');
        expect(out).toContain('<h2>T</h2>');
        expect(out).not.toMatch(/iframe|style=|data:/);
    });
    it('estimates reading time', () => {
        expect(readingTimeMinutes('<p>' + 'word '.repeat(450) + '</p>')).toBe(3);
        expect(readingTimeMinutes('<p>short</p>')).toBe(1);
    });
    it('detects images by signature, not by name', () => {
        expect(detectImageType(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]))).toBe('png');
        expect(detectImageType(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0]))).toBe('jpeg');
        expect(detectImageType(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>'))).toBeNull();
        expect(detectImageType(Buffer.from('<?php system($_GET[0]); ?>........'))).toBeNull();
    });
});
describe('validators', () => {
    it('password policy', () => {
        expect(password.safeParse('short1A').success).toBe(false);
        expect(password.safeParse('alllowercase1234').success).toBe(false);
        expect(password.safeParse('Valid-Passphrase-1').success).toBe(true);
    });
    it('pathOrHttps blocks dangerous URLs', () => {
        for (const bad of ['//evil.com', 'javascript:alert(1)', 'http://insecure.example', 'data:text/html,x'])
            expect(pathOrHttps.safeParse(bad).success).toBe(false);
        for (const good of ['/about', 'https://example.com/x', ''])
            expect(pathOrHttps.safeParse(good).success).toBe(true);
    });
    it('lead schema is strict', () => {
        const base = { name: 'Ann Lee', email: 'ann@example.com', businessType: 'other', message: 'Hello there, I need a site.', consent: true };
        expect(leadCreateSchema.safeParse(base).success).toBe(true);
        expect(leadCreateSchema.safeParse({ ...base, extra: 1 }).success).toBe(false);
        expect(leadCreateSchema.safeParse({ ...base, businessType: 'weapons' }).success).toBe(false);
    });
});
