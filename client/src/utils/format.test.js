import { describe, expect, it } from 'vitest';
import { contactSchema } from '../schemas/contact';
import { slugify } from './slug';
import { whatsappLink } from './format';
describe('whatsappLink', () => {
    it('returns null without a valid number', () => {
        expect(whatsappLink(undefined)).toBeNull();
        expect(whatsappLink('abc')).toBeNull();
    });
    it('builds a digits-only wa.me link', () => {
        expect(whatsappLink('+91 98765 43210')).toContain('https://wa.me/919876543210?text=');
    });
});
describe('slugify', () => {
    it('lowercases and hyphenates', () => expect(slugify('  Local SEO & Maps! ')).toBe('local-seo-maps'));
});
describe('contactSchema', () => {
    const ok = { name: 'Asha', email: 'a@b.co', businessType: 'cafe_restaurant', services: [], message: 'We need a new website please', preferredContact: 'email', consent: true };
    it('accepts a valid enquiry', () => expect(contactSchema.safeParse(ok).success).toBe(true));
    it('requires consent', () => expect(contactSchema.safeParse({ ...ok, consent: false }).success).toBe(false));
    it('rejects markup characters', () => expect(contactSchema.safeParse({ ...ok, name: '<script>' }).success).toBe(false));
});
