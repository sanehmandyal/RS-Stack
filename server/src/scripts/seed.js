/**
 * Idempotent starter-content seed. Run: npm run seed --workspace server
 * - Uses $setOnInsert so re-running NEVER overwrites content you have edited in the admin panel.
 * - Creates NO users (see bootstrapAdmin.ts) and NO fake testimonials, clients or statistics.
 * - Demo portfolio projects are flagged isDemo=true and are shown as "Demonstration project" on the site.
 */
import { connectDb, disconnectDb } from '../config/db.js';
import { BlogCategory, BlogPost, FAQ, Project, Redirect, Service, SiteSettings } from '../models/content.js';
import { serviceSeed } from '../seed/services.js';
import { readingTimeMinutes, sanitizeRichText } from '../utils/security.js';
async function upsert(model, key, doc) {
    const res = await model.updateOne(key, { $setOnInsert: { ...key, ...doc } }, { upsert: true });
    return res.upsertedCount > 0;
}
async function main() {
    await connectDb();
    let created = 0;
    for (const s of serviceSeed)
        if (await upsert(Service, { slug: s.slug }, s))
            created++;
    const demoProjects = [
        {
            slug: 'demo-local-service-website', title: 'Local Service Business Website', industry: 'Cleaning services', category: 'websites',
            summary: 'Demonstration project: a quote-request website for a cleaning company.',
            problem: 'A typical cleaning business relies on word of mouth and has no easy way to request quotes online.',
            solution: 'A mobile-first site with service pages, service-area information and a quote-request form that emails the business.',
            technologies: ['React', 'Node.js', 'MongoDB'], services: ['website-development', 'landing-pages'], results: [],
        },
        {
            slug: 'demo-cafe-local-presence', title: 'Cafe Local Visibility Package', industry: 'Cafes & restaurants', category: 'local_seo',
            summary: 'Demonstration project: menu website plus Google Business Profile task plan for a cafe.',
            problem: 'A neighbourhood cafe has inconsistent opening hours and details across the web.',
            solution: 'A menu and location website, and a checklist-driven plan to keep listings accurate with the owner’s approval.',
            technologies: ['React', 'Local SEO'], services: ['local-seo', 'google-business-profile'], results: [],
        },
        {
            slug: 'demo-travel-enquiry-site', title: 'Travel Agency Enquiry Website', industry: 'Travel agencies', category: 'digital_marketing',
            summary: 'Demonstration project: tour listing pages with enquiry forms and ad-ready landing pages.',
            problem: 'A tour operator needs enquiries from ad campaigns to land on focused pages rather than a generic home page.',
            solution: 'Tour pages with enquiry forms, WhatsApp click-to-chat and consent-aware conversion tracking.',
            technologies: ['React', 'Google Analytics 4'], services: ['landing-pages', 'google-ads', 'analytics-tracking'], results: [],
        },
    ];
    for (const [i, p] of demoProjects.entries()) {
        if (await upsert(Project, { slug: p.slug }, { ...p, thumbnail: '', thumbnailAlt: '', isDemo: true, published: true, order: (i + 1) * 10 }))
            created++;
    }
    const cats = [
        { slug: 'local-seo', name: 'Local SEO', description: 'Getting found by nearby customers.' },
        { slug: 'websites', name: 'Websites', description: 'Planning and building business websites.' },
        { slug: 'digital-marketing', name: 'Digital Marketing', description: 'Advertising and measurement basics.' },
    ];
    for (const c of cats)
        if (await upsert(BlogCategory, { slug: c.slug }, c))
            created++;
    const posts = [
        {
            slug: 'what-a-small-business-website-needs', title: 'What Does a Small Business Website Actually Need?', category: 'websites', tags: ['website', 'small business'],
            excerpt: 'A practical checklist of the pages and features that matter most when you are getting started.',
            bodyHtml: '<h2>Start with the customer’s questions</h2><p>Visitors usually want to know what you do, where you work, how to contact you and why they should trust you. Build those answers into your first version.</p><h2>The essentials</h2><ul><li>A clear home page that says what you do and who you help</li><li>One page per main service</li><li>An easy enquiry form and a phone or WhatsApp link</li><li>Accurate contact details and service areas</li><li>A page that explains how you work</li></ul><h2>What can wait</h2><p>Blogs, online payments and advanced integrations can be added once the basics are working and you know what your customers respond to.</p>',
        },
        {
            slug: 'google-business-profile-basics', title: 'Google Business Profile Basics for Local Businesses', category: 'local-seo', tags: ['google business profile', 'local seo'],
            excerpt: 'What the profile is, what to keep accurate and why you should never share your password to get help.',
            bodyHtml: '<h2>What it is</h2><p>Your Business Profile is the listing that can appear in Google Search and Maps with your hours, contact details and photos. It is separate from your website, Search Console and Analytics.</p><h2>Keep these accurate</h2><ul><li>Business name, address (if customers visit you) and phone number</li><li>Opening hours, including holidays</li><li>Categories and services</li></ul><h2>Getting help safely</h2><p>Never share your Google password. Invite a helper as a manager from the profile’s own settings so you can remove access at any time.</p>',
        },
    ];
    for (const p of posts) {
        const bodyHtml = sanitizeRichText(p.bodyHtml);
        if (await upsert(BlogPost, { slug: p.slug }, { ...p, bodyHtml, readingMinutes: readingTimeMinutes(bodyHtml), status: 'published', publishedAt: new Date(), authorName: 'Growora' }))
            created++;
    }
    const faqs = [
        ['Do you guarantee search rankings or leads?', 'No. Nobody can honestly guarantee rankings, leads or ad results. We focus on doing the work properly and reporting transparently.'],
        ['What costs are not included in your fees?', 'Domain registration, hosting, advertising spend and some third-party tools are billed by their providers and are separate from our fees.'],
        ['Will I own my website?', 'Ownership and handover terms are set out in your agreement before work begins.'],
        ['How do we get started?', 'Request a free consultation. We discuss your business and goals, then send a written scope and quote.'],
    ];
    for (const [i, [question, answer]] of faqs.entries())
        if (await upsert(FAQ, { scope: 'global', question }, { answer, order: (i + 1) * 10, published: true }))
            created++;
    if (await upsert(SiteSettings, { key: 'main' }, {}))
        created++;
    if (await upsert(Redirect, { from: '/services/hosting-maintenance' }, { to: '/services/website-maintenance', statusCode: 301, active: true }))
        created++;
    console.log(`Seed complete. ${created} new record(s) created; existing records were left untouched.`);
    await disconnectDb();
}
main().catch(async (err) => {
    console.error(err);
    await disconnectDb().catch(() => undefined);
    process.exit(1);
});
