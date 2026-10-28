import { z } from 'zod';
import { BUSINESS_TYPES, LEAD_STATUSES, ROLES } from '../config/permissions.js';
import { canonicalUrl, email, httpsUrl, idString, optPlain, password, pathOrHttps, phone, plain, slug, stringList } from './common.js';
/* ---------- auth ---------- */
export const loginSchema = z.object({ email, password: z.string().min(1).max(128) }).strict();
export const forgotSchema = z.object({ email }).strict();
export const resetSchema = z.object({ token: z.string().min(20).max(200), password }).strict();
export const changePasswordSchema = z.object({ currentPassword: z.string().min(1).max(128), newPassword: password }).strict();
/* ---------- users ---------- */
export const userCreateSchema = z
    .object({ email, name: plain(100, 1), role: z.enum(ROLES), password })
    .strict();
export const userUpdateSchema = z
    .object({ name: plain(100, 1), role: z.enum(ROLES), active: z.boolean(), mustChangePassword: z.boolean() })
    .partial()
    .strict();
/* ---------- leads ---------- */
export const BUDGETS = ['under_25k', '25k_50k', '50k_1l', '1l_3l', 'above_3l', 'not_sure'];
export const leadCreateSchema = z
    .object({
    name: plain(100, 2),
    businessName: optPlain(150),
    email,
    phone: phone.optional().or(z.literal('')),
    businessType: z.enum(BUSINESS_TYPES),
    services: z.array(z.string().regex(/^[a-z0-9-]{2,90}$/)).max(25).default([]),
    budgetRange: z.enum(BUDGETS).optional(),
    message: plain(3000, 10),
    preferredContact: z.enum(['email', 'phone', 'whatsapp']).default('email'),
    consent: z.literal(true, { errorMap: () => ({ message: 'Consent is required' }) }),
    source: z.string().regex(/^[a-z0-9_ -]{1,60}$/i).optional(),
    utm: z
        .object({ source: z.string().max(100).optional(), medium: z.string().max(100).optional(), campaign: z.string().max(100).optional() })
        .strict()
        .optional(),
    // anti-spam
    website: z.string().max(200).optional(), // honeypot: real users never fill this
    formStartedAt: z.number().int().optional(), // epoch ms when the form was rendered
})
    .strict();
export const leadUpdateSchema = z
    .object({
    status: z.enum(LEAD_STATUSES),
    assignedTo: idString.nullable(),
    followUpAt: z.string().datetime().nullable(),
    isSpam: z.boolean(),
    archived: z.boolean(),
})
    .partial()
    .strict();
export const noteSchema = z.object({ body: plain(2000, 1) }).strict();
/* ---------- content resources ---------- */
const faqItem = z.object({ q: plain(300, 1), a: plain(2000, 1) }).strict();
const seoFields = { metaTitle: optPlain(70), metaDescription: optPlain(170) };
export const serviceSchema = z
    .object({
    slug,
    title: plain(150, 2),
    category: z.enum(['development', 'seo', 'local', 'ads', 'infrastructure', 'content']),
    image: optPlain(400),
    imageAlt: optPlain(200),
    summary: plain(300, 10),
    description: plain(5000),
    audience: stringList(),
    problems: stringList(),
    deliverables: stringList(),
    benefits: stringList(),
    limitations: stringList(),
    process: stringList(),
    timeline: optPlain(300),
    delivery: z.enum(['direct', 'mixed', 'third_party_required']),
    thirdPartyNote: optPlain(600),
    faqs: z.array(faqItem).max(20),
    relatedSlugs: z.array(slug).max(10),
    order: z.number().int().min(0).max(10000),
    published: z.boolean(),
    ...seoFields,
})
    .partial({ image: true, imageAlt: true, description: true, audience: true, problems: true, deliverables: true, benefits: true, limitations: true, process: true, timeline: true, delivery: true, thirdPartyNote: true, faqs: true, relatedSlugs: true, order: true, published: true, metaTitle: true, metaDescription: true, category: true })
    .strict();
export const projectSchema = z
    .object({
    slug,
    title: plain(150, 2),
    industry: optPlain(100),
    category: z.enum(['websites', 'local_seo', 'ecommerce', 'digital_marketing']),
    thumbnail: pathOrHttps,
    thumbnailAlt: optPlain(200),
    summary: optPlain(400),
    problem: optPlain(2000),
    solution: optPlain(3000),
    technologies: stringList(60, 30),
    services: z.array(slug).max(25),
    results: stringList(300, 15),
    liveUrl: httpsUrl,
    isDemo: z.boolean(),
    order: z.number().int().min(0).max(10000),
    published: z.boolean(),
    ...seoFields,
})
    .partial({ industry: true, category: true, thumbnail: true, thumbnailAlt: true, summary: true, problem: true, solution: true, technologies: true, services: true, results: true, liveUrl: true, isDemo: true, order: true, published: true, metaTitle: true, metaDescription: true })
    .strict();
export const blogPostSchema = z
    .object({
    slug,
    title: plain(160, 2),
    excerpt: optPlain(400),
    bodyHtml: z.string().max(100_000),
    category: z.string().max(60).optional(),
    tags: z.array(plain(40, 1)).max(15),
    featured: z.boolean(),
    status: z.enum(['draft', 'published']),
    publishedAt: z.string().datetime().nullable(),
    authorName: plain(100, 1),
    coverImage: pathOrHttps,
    coverImageAlt: optPlain(200),
    canonicalUrl: canonicalUrl,
    ...seoFields,
})
    .partial({ excerpt: true, bodyHtml: true, category: true, tags: true, featured: true, status: true, publishedAt: true, authorName: true, coverImage: true, coverImageAlt: true, canonicalUrl: true, metaTitle: true, metaDescription: true })
    .strict();
export const blogCategorySchema = z.object({ slug, name: plain(80, 1), description: optPlain(300) }).partial({ description: true }).strict();
export const testimonialSchema = z
    .object({
    authorName: plain(100, 1),
    authorRole: optPlain(100),
    businessName: optPlain(150),
    quote: plain(1000, 10),
    verified: z.boolean(),
    consentReference: optPlain(300),
    published: z.boolean(),
})
    .partial({ authorRole: true, businessName: true, verified: true, consentReference: true, published: true })
    .strict();
export const faqSchema = z
    .object({ scope: z.string().max(90), question: plain(300, 3), answer: plain(2000, 3), order: z.number().int().min(0).max(10000), published: z.boolean() })
    .partial({ scope: true, order: true, published: true })
    .strict();
export const pageSeoSchema = z
    .object({
    path: z.string().trim().regex(/^\/[^\s<>"']*$/, 'Path must start with /').max(200),
    title: optPlain(70),
    description: optPlain(170),
    canonical: canonicalUrl,
    ogImage: pathOrHttps,
    noindex: z.boolean(),
    sitemap: z.boolean(),
})
    .partial({ title: true, description: true, canonical: true, ogImage: true, noindex: true, sitemap: true })
    .strict();
export const redirectSchema = z
    .object({
    from: z.string().trim().regex(/^\/(?!\/)[^\s<>"'?#]*$/, 'Source must be a path starting with /').max(300),
    to: pathOrHttps.refine((v) => v !== '', 'Destination is required'),
    statusCode: z.union([z.literal(301), z.literal(302)]),
    active: z.boolean(),
})
    .partial({ statusCode: true, active: true })
    .strict();
export const settingsSchema = z
    .object({
    businessName: plain(100, 1),
    tagline: optPlain(150),
    contactEmail: z.union([email, z.literal('')]),
    phone: z.union([phone, z.literal('')]),
    whatsappNumber: z.string().regex(/^\d{8,15}$/, 'Digits only, including country code').or(z.literal('')),
    address: optPlain(300),
    social: z
        .object({ facebook: httpsUrl, instagram: httpsUrl, linkedin: httpsUrl, x: httpsUrl, youtube: httpsUrl })
        .partial()
        .strict(),
    home: z
        .object({
        heroHeadline: optPlain(150),
        heroSubheadline: optPlain(400),
        primaryCta: optPlain(60),
        secondaryCta: optPlain(60),
        finalCtaTitle: optPlain(150),
        finalCtaText: optPlain(300),
    })
        .partial()
        .strict(),
})
    .partial()
    .strict();
/* ---------- local SEO / campaigns / hosting ---------- */
const optDate = z.string().datetime().nullable().optional();
export const clientSchema = z
    .object({
    businessName: plain(150, 1),
    contactName: optPlain(100),
    contactEmail: z.union([email, z.literal('')]),
    phone: z.union([phone, z.literal('')]),
    website: httpsUrl,
    category: optPlain(100),
    address: optPlain(300),
    hours: optPlain(500),
    serviceAreas: stringList(100, 30),
    authorizationStatus: z.enum(['none', 'requested', 'granted', 'revoked']),
    authorizationNote: optPlain(500),
    notes: optPlain(2000),
    archived: z.boolean(),
})
    .partial({ contactName: true, contactEmail: true, phone: true, website: true, category: true, address: true, hours: true, serviceAreas: true, authorizationStatus: true, authorizationNote: true, notes: true, archived: true })
    .strict();
export const gbpTaskSchema = z
    .object({
    client: idString,
    title: plain(200, 2),
    type: z.enum(['profile_setup', 'optimization', 'nap_check', 'review_response', 'recommendation', 'access', 'approval']),
    status: z.enum(['todo', 'in_progress', 'waiting_client', 'done']),
    owner: idString.nullable(),
    dueDate: optDate,
    clientApproval: z
        .object({ approved: z.boolean(), approvedBy: optPlain(150), approvedAt: optDate, note: optPlain(500) })
        .partial()
        .strict(),
    notes: optPlain(2000),
})
    .partial({ type: true, status: true, owner: true, dueDate: true, clientApproval: true, notes: true })
    .strict();
export const listingSchema = z
    .object({
    client: idString,
    directoryName: plain(150, 1),
    listingUrl: httpsUrl,
    status: z.enum(['planned', 'submitted', 'pending_verification', 'live', 'rejected']),
    napConsistent: z.enum(['unchecked', 'consistent', 'inconsistent']),
    submittedAt: optDate,
    verifiedAt: optDate,
    notes: optPlain(1000),
})
    .partial({ listingUrl: true, status: true, napConsistent: true, submittedAt: true, verifiedAt: true, notes: true })
    .strict();
export const campaignSchema = z
    .object({
    client: idString,
    platform: z.enum(['google_ads', 'meta_ads']),
    name: plain(200, 2),
    objective: optPlain(300),
    budget: z
        .object({ amount: z.number().min(0).max(1e9), currency: z.string().length(3).toUpperCase(), period: z.enum(['daily', 'monthly', 'total']) })
        .partial()
        .strict(),
    startDate: optDate,
    endDate: optDate,
    status: z.enum(['draft', 'pending_approval', 'active', 'paused', 'completed']),
    landingPage: httpsUrl,
    conversionTracking: z.enum(['not_set_up', 'in_progress', 'verified']),
    reportingNotes: optPlain(3000),
    clientApproved: z.boolean(),
    approvedAt: optDate,
})
    .partial({ objective: true, budget: true, startDate: true, endDate: true, status: true, landingPage: true, conversionTracking: true, reportingNotes: true, clientApproved: true, approvedAt: true })
    .strict();
export const domainSchema = z
    .object({
    client: idString,
    domain: z.string().trim().toLowerCase().regex(/^(?=.{3,253}$)([a-z0-9-]+\.)+[a-z]{2,}$/, 'Enter a valid domain, e.g. example.com'),
    registrar: optPlain(100),
    hostingProvider: optPlain(100),
    managedBy: z.enum(['rs_stack', 'client']),
    renewalDate: optDate,
    hostingRenewalDate: optDate,
    sslExpiry: optDate,
    status: z.enum(['active', 'expiring', 'expired', 'transferred', 'inactive']),
    recurringCostNote: optPlain(300),
    notes: optPlain(1000),
})
    .partial({ registrar: true, hostingProvider: true, managedBy: true, renewalDate: true, hostingRenewalDate: true, sslExpiry: true, status: true, recurringCostNote: true, notes: true })
    .strict();
