import { Schema, model } from 'mongoose';
const faqSub = new Schema({ q: { type: String, maxlength: 300 }, a: { type: String, maxlength: 2000 } }, { _id: false });
const serviceSchema = new Schema({
    slug: { type: String, required: true, unique: true, lowercase: true, maxlength: 90 },
    title: { type: String, required: true, maxlength: 150 },
    category: { type: String, enum: ['development', 'seo', 'local', 'ads', 'infrastructure', 'content'], default: 'development' },
    image: { type: String, maxlength: 400 },
    imageAlt: { type: String, maxlength: 200 },
    summary: { type: String, required: true, maxlength: 300 },
    description: { type: String, maxlength: 5000 },
    audience: { type: [String], default: [] },
    problems: { type: [String], default: [] },
    deliverables: { type: [String], default: [] },
    benefits: { type: [String], default: [] },
    limitations: { type: [String], default: [] },
    process: { type: [String], default: [] },
    timeline: { type: String, maxlength: 300 },
    delivery: { type: String, enum: ['direct', 'mixed', 'third_party_required'], default: 'direct' },
    thirdPartyNote: { type: String, maxlength: 600 },
    faqs: { type: [faqSub], default: [] },
    relatedSlugs: { type: [String], default: [] },
    metaTitle: { type: String, maxlength: 70 },
    metaDescription: { type: String, maxlength: 170 },
    order: { type: Number, default: 100 },
    published: { type: Boolean, default: true, index: true },
}, { timestamps: true });
export const Service = model('Service', serviceSchema);
const projectSchema = new Schema({
    slug: { type: String, required: true, unique: true, lowercase: true, maxlength: 90 },
    title: { type: String, required: true, maxlength: 150 },
    industry: { type: String, maxlength: 100 },
    category: { type: String, enum: ['websites', 'local_seo', 'ecommerce', 'digital_marketing'], default: 'websites' },
    thumbnail: { type: String, maxlength: 400 },
    thumbnailAlt: { type: String, maxlength: 200 },
    summary: { type: String, maxlength: 400 },
    problem: { type: String, maxlength: 2000 },
    solution: { type: String, maxlength: 3000 },
    technologies: { type: [String], default: [] },
    services: { type: [String], default: [] },
    // Only add results that are backed by real, verifiable data.
    results: { type: [String], default: [] },
    liveUrl: { type: String, maxlength: 300 },
    isDemo: { type: Boolean, default: true },
    metaTitle: { type: String, maxlength: 70 },
    metaDescription: { type: String, maxlength: 170 },
    order: { type: Number, default: 100 },
    published: { type: Boolean, default: false, index: true },
}, { timestamps: true });
export const Project = model('Project', projectSchema);
const categorySchema = new Schema({
    slug: { type: String, required: true, unique: true, lowercase: true, maxlength: 60 },
    name: { type: String, required: true, maxlength: 80 },
    description: { type: String, maxlength: 300 },
}, { timestamps: true });
export const BlogCategory = model('BlogCategory', categorySchema);
const postSchema = new Schema({
    slug: { type: String, required: true, unique: true, lowercase: true, maxlength: 100 },
    title: { type: String, required: true, maxlength: 160 },
    excerpt: { type: String, maxlength: 400 },
    bodyHtml: { type: String, default: '' }, // sanitised on write
    category: { type: String, maxlength: 60, index: true },
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    publishedAt: Date,
    authorName: { type: String, default: 'RS Stack', maxlength: 100 },
    coverImage: { type: String, maxlength: 400 },
    coverImageAlt: { type: String, maxlength: 200 },
    readingMinutes: { type: Number, default: 1 },
    metaTitle: { type: String, maxlength: 70 },
    metaDescription: { type: String, maxlength: 170 },
    canonicalUrl: { type: String, maxlength: 400 },
}, { timestamps: true });
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ title: 'text', excerpt: 'text' });
export const BlogPost = model('BlogPost', postSchema);
const mediaSchema = new Schema({
    filename: { type: String, required: true, unique: true },
    originalName: { type: String, maxlength: 200 },
    mime: { type: String, required: true },
    size: { type: Number, required: true },
    width: Number,
    height: Number,
    alt: { type: String, maxlength: 200 },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
export const MediaAsset = model('MediaAsset', mediaSchema);
const testimonialSchema = new Schema({
    authorName: { type: String, required: true, maxlength: 100 },
    authorRole: { type: String, maxlength: 100 },
    businessName: { type: String, maxlength: 150 },
    quote: { type: String, required: true, maxlength: 1000 },
    // Must be true only when the client really gave this review AND permission to publish it.
    verified: { type: Boolean, default: false },
    consentReference: { type: String, maxlength: 300 },
    published: { type: Boolean, default: false },
}, { timestamps: true });
export const Testimonial = model('Testimonial', testimonialSchema);
const faqSchema = new Schema({
    scope: { type: String, default: 'global', maxlength: 90, index: true },
    question: { type: String, required: true, maxlength: 300 },
    answer: { type: String, required: true, maxlength: 2000 },
    order: { type: Number, default: 100 },
    published: { type: Boolean, default: true },
}, { timestamps: true });
export const FAQ = model('FAQ', faqSchema);
const social = { type: String, maxlength: 300 };
const settingsSchema = new Schema({
    key: { type: String, default: 'main', unique: true },
    businessName: { type: String, default: 'RS Stack', maxlength: 100 },
    tagline: { type: String, default: 'We Build Digital. You Grow Business.', maxlength: 150 },
    contactEmail: { type: String, maxlength: 254 },
    phone: { type: String, maxlength: 30 },
    whatsappNumber: { type: String, maxlength: 20 }, // digits only, with country code
    address: { type: String, maxlength: 300 },
    social: { facebook: social, instagram: social, linkedin: social, x: social, youtube: social },
    home: {
        heroHeadline: { type: String, maxlength: 150 },
        heroSubheadline: { type: String, maxlength: 400 },
        primaryCta: { type: String, maxlength: 60 },
        secondaryCta: { type: String, maxlength: 60 },
        finalCtaTitle: { type: String, maxlength: 150 },
        finalCtaText: { type: String, maxlength: 300 },
    },
}, { timestamps: true });
export const SiteSettings = model('SiteSettings', settingsSchema);
const pageSeoSchema = new Schema({
    path: { type: String, required: true, unique: true, maxlength: 200 },
    title: { type: String, maxlength: 70 },
    description: { type: String, maxlength: 170 },
    canonical: { type: String, maxlength: 400 },
    ogImage: { type: String, maxlength: 400 },
    noindex: { type: Boolean, default: false },
    sitemap: { type: Boolean, default: true },
}, { timestamps: true });
export const PageSeo = model('PageSeo', pageSeoSchema);
const redirectSchema = new Schema({
    from: { type: String, required: true, unique: true, maxlength: 300 },
    to: { type: String, required: true, maxlength: 400 },
    statusCode: { type: Number, enum: [301, 302], default: 301 },
    active: { type: Boolean, default: true },
}, { timestamps: true });
export const Redirect = model('Redirect', redirectSchema);
