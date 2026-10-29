import { BlogCategory, BlogPost, FAQ, Project, Redirect, Service, SiteSettings } from '../models/content.js';
import { serviceSeed } from './services.js';
import { readingTimeMinutes, sanitizeRichText } from '../utils/security.js';
import { User } from '../models/auth.js';
import { hashPassword } from '../services/authService.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
async function upsert(model, key, doc) {
    const res = await model.updateOne(key, { $setOnInsert: { ...key, ...doc } }, { upsert: true });
    return res.upsertedCount > 0;
}
export async function autoSeedAndBootstrap() {
    try {
        // 1. Auto-bootstrap super admin if none exists
        const superAdminExists = await User.exists({ role: 'super_admin' });
        if (!superAdminExists) {
            const email = env.BOOTSTRAP_ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'admin@growora.com';
            const password = env.BOOTSTRAP_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || 'RsStackAdmin@2026!#Secure';
            const name = env.BOOTSTRAP_ADMIN_NAME || process.env.ADMIN_NAME || 'Growora Admin';
            await User.create({
                email: email.trim().toLowerCase(),
                name: name.trim(),
                role: 'super_admin',
                passwordHash: await hashPassword(password),
                mustChangePassword: false,
            });
            logger.info(`Auto-bootstrapped initial Super Admin account: ${email}`);
        }
        // 2. Ensure starter services, categories, posts, settings exist
        for (const s of serviceSeed) {
            await upsert(Service, { slug: s.slug }, s);
        }
        const demoProjects = [
            {
                slug: 'demo-local-service-website',
                title: 'Local Service Business Website',
                industry: 'Cleaning services',
                category: 'websites',
                summary: 'Demonstration project: a quote-request website for a cleaning company.',
                problem: 'A typical cleaning business relies on word of mouth and has no easy way to request quotes online.',
                solution: 'A mobile-first site with service pages, service-area information and a quote-request form that emails the business.',
                technologies: ['React', 'Node.js', 'MongoDB'],
                services: ['website-development', 'landing-pages'],
                results: [],
            },
            {
                slug: 'demo-cafe-local-presence',
                title: 'Cafe Local Visibility Package',
                industry: 'Cafes & restaurants',
                category: 'local_seo',
                summary: 'Demonstration project: menu website plus Google Business Profile task plan for a cafe.',
                problem: 'A neighbourhood cafe has inconsistent opening hours and details across the web.',
                solution: 'A menu and location website, and a checklist-driven plan to keep listings accurate with the owner’s approval.',
                technologies: ['React', 'Local SEO'],
                services: ['local-seo', 'google-business-profile'],
                results: [],
            },
            {
                slug: 'demo-travel-enquiry-site',
                title: 'Travel Agency Enquiry Website',
                industry: 'Travel agencies',
                category: 'digital_marketing',
                summary: 'Demonstration project: tour listing pages with enquiry forms and ad-ready landing pages.',
                problem: 'A tour operator needs enquiries from ad campaigns to land on focused pages rather than a generic home page.',
                solution: 'Tour pages with enquiry forms, WhatsApp click-to-chat and consent-aware conversion tracking.',
                technologies: ['React', 'Google Analytics 4'],
                services: ['landing-pages', 'google-ads', 'analytics-tracking'],
                results: [],
            },
        ];
        for (const [i, p] of demoProjects.entries()) {
            await upsert(Project, { slug: p.slug }, { ...p, thumbnail: '', thumbnailAlt: '', isDemo: true, published: true, order: (i + 1) * 10 });
        }
        const cats = [
            { slug: 'local-seo', name: 'Local SEO', description: 'Getting found by nearby customers.' },
            { slug: 'websites', name: 'Websites', description: 'Planning and building business websites.' },
            { slug: 'digital-marketing', name: 'Digital Marketing', description: 'Advertising and measurement basics.' },
        ];
        for (const c of cats) {
            await upsert(BlogCategory, { slug: c.slug }, c);
        }
        const posts = [
            {
                slug: 'what-a-small-business-website-needs',
                title: 'What Does a Small Business Website Actually Need?',
                category: 'websites',
                tags: ['website', 'small business'],
                excerpt: 'A practical checklist of the pages and features that matter most when you are getting started.',
                bodyHtml: '<h2>Start with the customer’s questions</h2><p>Visitors usually want to know what you do, where you work, how to contact you and why they should trust you. Build those answers into your first version.</p><h2>The essentials</h2><ul><li>A clear home page that says what you do and who you help</li><li>One page per main service</li><li>An easy enquiry form and a phone or WhatsApp link</li><li>Accurate contact details and service areas</li><li>A page that explains how you work</li></ul><h2>What can wait</h2><p>Blogs, online payments and advanced integrations can be added once the basics are working and you know what your customers respond to.</p>',
            },
            {
                slug: 'google-business-profile-basics',
                title: 'Google Business Profile Basics for Local Businesses',
                category: 'local-seo',
                tags: ['google business profile', 'local seo'],
                excerpt: 'What the profile is, what to keep accurate and why you should never share your password to get help.',
                bodyHtml: '<h2>What it is</h2><p>Your Business Profile is the listing that can appear in Google Search and Maps with your hours, contact details and photos. It is separate from your website, Search Console and Analytics.</p><h2>Keep these accurate</h2><ul><li>Business name, address (if customers visit you) and phone number</li><li>Opening hours, including holidays</li><li>Categories and services</li></ul><h2>Getting help safely</h2><p>Never share your Google password. Invite a helper as a manager from the profile’s own settings so you can remove access at any time.</p>',
            },
        ];
        for (const p of posts) {
            const bodyHtml = sanitizeRichText(p.bodyHtml);
            await upsert(BlogPost, { slug: p.slug }, { ...p, bodyHtml, readingMinutes: readingTimeMinutes(bodyHtml), status: 'published', publishedAt: new Date(), authorName: 'Growora' });
        }
        const faqs = [
            ['Do you guarantee search rankings or leads?', 'No. Nobody can honestly guarantee rankings, leads or ad results. We focus on doing the work properly and reporting transparently.'],
            ['What costs are not included in your fees?', 'Domain registration, hosting, advertising spend and some third-party tools are billed by their providers and are separate from our fees.'],
            ['Will I own my website?', 'Ownership and handover terms are set out in your agreement before work begins.'],
            ['How do we get started?', 'Request a free consultation. We discuss your business and goals, then send a written scope and quote.'],
        ];
        for (const [i, [question, answer]] of faqs.entries()) {
            await upsert(FAQ, { scope: 'global', question }, { answer, order: (i + 1) * 10, published: true });
        }
        await upsert(SiteSettings, { key: 'main' }, {
            businessName: 'Growora',
            tagline: 'We Build Digital. You Grow Business.',
            contactEmail: 'contact@growora.com',
            phone: '+91 98057 20962',
            whatsappNumber: '+91 98057 20962',
            address: 'Phase 5, Mohali, SAS Nagar, Punjab 160059, India',
        });
        await upsert(Redirect, { from: '/services/hosting-maintenance' }, { to: '/services/website-maintenance', statusCode: 301, active: true });
        logger.info('Auto-seed check completed successfully.');
    }
    catch (err) {
        logger.warn({ err }, 'Auto seed/bootstrap encountered an issue; continuing.');
    }
}
