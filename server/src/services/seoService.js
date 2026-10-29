import { env } from '../config/env.js';
import { INDUSTRY_SLUGS, STATIC_PUBLIC_ROUTES } from '../config/permissions.js';
import { BlogPost, PageSeo, Project, Redirect, Service, SiteSettings } from '../models/content.js';
import { escapeHtml, stripHtml } from '../utils/security.js';
const SITE = 'Growora';
export const INDUSTRY_NAMES = {
    'cleaning-services': 'Cleaning Services',
    'travel-agencies': 'Travel Agencies & Tour Operators',
    'cafes-restaurants': 'Cafes & Restaurants',
    hotels: 'Hotels & Hospitality',
    salons: 'Salons & Beauty Businesses',
    'local-businesses': 'Local Shops & Retailers',
    'professional-services': 'Professional Services',
};
const STATIC_META = {
    '/': {
        title: 'Growora | Websites, Local SEO & Digital Marketing for Small Businesses',
        description: 'Growora builds websites, improves local visibility, manages digital advertising and sets up the digital infrastructure small and medium-sized businesses need to grow.',
    },
    '/services': { title: 'Services | Growora', description: 'Web development, SEO, Google Business Profile, Google & Meta Ads, hosting and maintenance for small and medium-sized businesses.' },
    '/industries': { title: 'Industries We Serve | Growora', description: 'Digital solutions tailored to cleaning services, travel agencies, cafes, hotels, salons, local shops and professional services.' },
    '/portfolio': { title: 'Portfolio | Growora', description: 'Selected projects and case studies from Growora.' },
    '/about': { title: 'About Growora', description: 'Our mission, approach and how we help small businesses establish and grow their online presence.' },
    '/blog': { title: 'Blog & Resources | Growora', description: 'Practical guides on websites, local SEO and digital marketing for small business owners.' },
    '/contact': { title: 'Contact Growora | Free Consultation', description: 'Tell us about your business and goals. Request a free consultation with Growora.' },
    '/privacy-policy': { title: 'Privacy Policy | Growora', description: 'How Growora collects, uses and protects your personal information.' },
    '/terms-of-service': { title: 'Terms of Service | Growora', description: 'The terms that apply when you use the Growora website and services.' },
    '/cookie-policy': { title: 'Cookie Policy | Growora', description: 'How Growora uses cookies and similar technologies.' },
    '/refund-policy': { title: 'Refund & Cancellation Policy | Growora', description: 'Refund and cancellation terms for Growora services.' },
};
export function normalizePath(p) {
    const path = (p.split('?')[0] ?? '/').split('#')[0] || '/';
    return path.length > 1 ? path.replace(/\/+$/, '') : '/';
}
const abs = (pathOrUrl) => (/^https?:\/\//i.test(pathOrUrl) ? pathOrUrl : `${env.siteUrl}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`);
const breadcrumb = (items) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })),
});
export async function resolveRoute(rawPath) {
    const path = normalizePath(rawPath);
    const base = {
        status: 200,
        title: STATIC_META['/'].title,
        description: STATIC_META['/'].description,
        canonical: abs(path),
        noindex: false,
        ogType: 'website',
        jsonLd: [],
    };
    if (path === '/admin' || path.startsWith('/admin/')) {
        return { ...base, title: 'Admin | Growora', description: 'Growora administration', noindex: true };
    }
    const seg = path.split('/').filter(Boolean);
    let meta = base;
    if (STATIC_PUBLIC_ROUTES.includes(path)) {
        const m = STATIC_META[path];
        meta = { ...base, title: m.title, description: m.description };
        if (path === '/') {
            const s = await SiteSettings.findOne({ key: 'main' }).lean();
            const org = { '@context': 'https://schema.org', '@type': 'Organization', name: SITE, url: env.siteUrl };
            if (s?.contactEmail)
                org.email = s.contactEmail;
            if (s?.phone)
                org.telephone = s.phone;
            meta.jsonLd.push(org);
        }
    }
    else if (seg[0] === 'services' && seg.length === 2) {
        const s = await Service.findOne({ slug: seg[1], published: true }).lean();
        if (!s)
            return { ...base, status: 404, title: 'Page not found | Growora', description: 'This page could not be found.', noindex: true };
        meta = { ...base, title: s.metaTitle || `${s.title} | ${SITE}`, description: s.metaDescription || s.summary };
        meta.jsonLd.push({ '@context': 'https://schema.org', '@type': 'Service', name: s.title, description: s.summary, provider: { '@type': 'Organization', name: SITE, url: env.siteUrl } }, breadcrumb([['Home', '/'], ['Services', '/services'], [s.title, path]]));
    }
    else if (seg[0] === 'industries' && seg.length === 2 && INDUSTRY_SLUGS.includes(seg[1])) {
        const name = INDUSTRY_NAMES[seg[1]];
        meta = { ...base, title: `Websites & Digital Marketing for ${name} | ${SITE}`, description: `How ${name.toLowerCase()} can attract more customers with a professional website, local visibility and digital marketing from Growora.` };
        meta.jsonLd.push(breadcrumb([['Home', '/'], ['Industries', '/industries'], [name, path]]));
    }
    else if (seg[0] === 'portfolio' && seg.length === 2) {
        const p = await Project.findOne({ slug: seg[1], published: true }).lean();
        if (!p)
            return { ...base, status: 404, title: 'Page not found | Growora', description: 'This page could not be found.', noindex: true };
        meta = { ...base, title: p.metaTitle || `${p.title} | Case Study | ${SITE}`, description: p.metaDescription || p.summary || STATIC_META['/portfolio'].description, ogImage: p.thumbnail ? abs(p.thumbnail) : undefined };
        meta.jsonLd.push(breadcrumb([['Home', '/'], ['Portfolio', '/portfolio'], [p.title, path]]));
    }
    else if (seg[0] === 'blog' && seg.length === 2) {
        const post = await BlogPost.findOne({ slug: seg[1], status: 'published', publishedAt: { $lte: new Date() } }).lean();
        if (!post)
            return { ...base, status: 404, title: 'Page not found | Growora', description: 'This page could not be found.', noindex: true };
        meta = {
            ...base,
            title: post.metaTitle || `${post.title} | ${SITE}`,
            description: post.metaDescription || post.excerpt || stripHtml(post.bodyHtml ?? '').slice(0, 160),
            canonical: post.canonicalUrl || abs(path),
            ogType: 'article',
            ogImage: post.coverImage ? abs(post.coverImage) : undefined,
        };
        meta.jsonLd.push({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: meta.description,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            author: { '@type': 'Organization', name: post.authorName || SITE },
            publisher: { '@type': 'Organization', name: SITE, url: env.siteUrl },
            mainEntityOfPage: abs(path),
            ...(meta.ogImage ? { image: meta.ogImage } : {}),
        }, breadcrumb([['Home', '/'], ['Blog', '/blog'], [post.title, path]]));
    }
    else {
        return { ...base, status: 404, title: 'Page not found | Growora', description: 'This page could not be found.', noindex: true };
    }
    // Admin-managed overrides (SEO administration).
    const override = await PageSeo.findOne({ path }).lean();
    if (override) {
        if (override.title)
            meta.title = override.title;
        if (override.description)
            meta.description = override.description;
        if (override.canonical)
            meta.canonical = override.canonical;
        if (override.ogImage)
            meta.ogImage = abs(override.ogImage);
        if (override.noindex)
            meta.noindex = true;
    }
    return meta;
}
const a = escapeHtml;
export function renderHead(m) {
    const tags = [
        `<title data-rh="true">${a(m.title)}</title>`,
        `<meta data-rh="true" name="description" content="${a(m.description)}" />`,
        `<link data-rh="true" rel="canonical" href="${a(m.canonical)}" />`,
        `<meta data-rh="true" name="robots" content="${m.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}" />`,
        `<meta data-rh="true" property="og:site_name" content="${SITE}" />`,
        `<meta data-rh="true" property="og:type" content="${m.ogType}" />`,
        `<meta data-rh="true" property="og:title" content="${a(m.title)}" />`,
        `<meta data-rh="true" property="og:description" content="${a(m.description)}" />`,
        `<meta data-rh="true" property="og:url" content="${a(m.canonical)}" />`,
        ...(m.ogImage ? [`<meta data-rh="true" property="og:image" content="${a(m.ogImage)}" />`] : []),
        `<meta data-rh="true" name="twitter:card" content="${m.ogImage ? 'summary_large_image' : 'summary'}" />`,
        `<meta data-rh="true" name="twitter:title" content="${a(m.title)}" />`,
        `<meta data-rh="true" name="twitter:description" content="${a(m.description)}" />`,
    ];
    if (env.GOOGLE_SITE_VERIFICATION)
        tags.push(`<meta name="google-site-verification" content="${a(env.GOOGLE_SITE_VERIFICATION)}" />`);
    for (const ld of m.jsonLd) {
        // "<" is escaped so the JSON can never close the script element.
        tags.push(`<script type="application/ld+json" class="ssr-jsonld">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`);
    }
    return tags.join('\n    ');
}
export const SEO_PLACEHOLDER = '<!--SEO_HEAD-->';
export function injectHead(template, meta) {
    return template.replace(SEO_PLACEHOLDER, renderHead(meta));
}
export async function buildSitemap() {
    const [services, projects, posts, overrides] = await Promise.all([
        Service.find({ published: true }).select('slug updatedAt').lean(),
        Project.find({ published: true }).select('slug updatedAt').lean(),
        BlogPost.find({ status: 'published', publishedAt: { $lte: new Date() } }).select('slug updatedAt').lean(),
        PageSeo.find({ $or: [{ sitemap: false }, { noindex: true }] }).select('path').lean(),
    ]);
    const excluded = new Set(overrides.map((o) => o.path));
    const entries = [
        ...STATIC_PUBLIC_ROUTES.map((p) => ({ loc: p })),
        ...INDUSTRY_SLUGS.map((s) => ({ loc: `/industries/${s}` })),
        ...services.map((s) => ({ loc: `/services/${s.slug}`, lastmod: s.updatedAt })),
        ...projects.map((s) => ({ loc: `/portfolio/${s.slug}`, lastmod: s.updatedAt })),
        ...posts.map((s) => ({ loc: `/blog/${s.slug}`, lastmod: s.updatedAt })),
    ].filter((e) => !excluded.has(e.loc));
    const body = entries
        .map((e) => `  <url><loc>${a(abs(e.loc === '/' ? '/' : e.loc))}</loc>${e.lastmod ? `<lastmod>${new Date(e.lastmod).toISOString()}</lastmod>` : ''}</url>`)
        .join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}
export const robotsTxt = () => `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${env.siteUrl}/sitemap.xml\n`;
/* ---------- redirects ---------- */
let redirectCache = null;
export const clearRedirectCache = () => {
    redirectCache = null;
};
async function loadRedirects() {
    if (redirectCache && Date.now() - redirectCache.at < 15_000)
        return redirectCache.map;
    const rows = await Redirect.find({ active: true }).select('from to statusCode').lean();
    const map = new Map(rows.map((r) => [r.from, { to: r.to, code: r.statusCode }]));
    redirectCache = { at: Date.now(), map };
    return map;
}
export async function redirectMiddleware(req, res, next) {
    if ((req.method !== 'GET' && req.method !== 'HEAD') || req.path.startsWith('/api') || req.path.startsWith('/uploads'))
        return next();
    try {
        const hit = (await loadRedirects()).get(normalizePath(req.path));
        if (hit)
            return res.redirect(hit.code, hit.to);
    }
    catch {
        /* never block a page because the redirect table could not be read */
    }
    next();
}
export function allowedRedirectHosts() {
    const hosts = new Set([new URL(env.siteUrl).host]);
    for (const o of env.clientOrigins) {
        try {
            hosts.add(new URL(o).host);
        }
        catch {
            /* ignore */
        }
    }
    return hosts;
}
