import { env } from '../config/env.js';
import { BlogCategory, BlogPost, FAQ, PageSeo, Project, Service, SiteSettings, Testimonial } from '../models/content.js';
import { notFound } from '../utils/errors.js';
import { pageMeta, parsePagination, qs } from '../utils/misc.js';
import { escapeRegex } from '../utils/security.js';
const cache = (res) => res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
export async function getOrCreateSettings() {
    return SiteSettings.findOneAndUpdate({ key: 'main' }, { $setOnInsert: { key: 'main' } }, { upsert: true, new: true, setDefaultsOnInsert: true });
}
export async function publicSettings(_req, res) {
    const s = (await getOrCreateSettings()).toObject();
    cache(res, 60);
    res.json({
        businessName: s.businessName,
        tagline: s.tagline,
        contactEmail: s.contactEmail,
        phone: s.phone,
        whatsappNumber: s.whatsappNumber,
        address: s.address,
        social: s.social ?? {},
        home: s.home ?? {},
        // Public tracking IDs: the browser loads them only after the visitor consents to cookies.
        tracking: { ga: env.GA_MEASUREMENT_ID || null, gtm: env.GTM_ID || null, metaPixel: env.META_PIXEL_ID || null },
    });
}
export async function listServices(_req, res) {
    let items = await Service.find({ published: true })
        .sort({ order: 1, title: 1 })
        .select('slug title category summary delivery order image imageAlt')
        .lean();
    if (!items.length) {
        try {
            const { autoSeedAndBootstrap } = await import('../seed/autoSeed.js');
            await autoSeedAndBootstrap();
            items = await Service.find({ published: true })
                .sort({ order: 1, title: 1 })
                .select('slug title category summary delivery order image imageAlt')
                .lean();
        } catch { }
    }
    cache(res);
    res.json({ items });
}
export async function getService(req, res) {
    const service = await Service.findOne({ slug: String(req.params.slug), published: true }).lean();
    if (!service)
        throw notFound();
    const related = service.relatedSlugs?.length
        ? await Service.find({ slug: { $in: service.relatedSlugs }, published: true }).select('slug title summary').lean()
        : [];
    cache(res);
    res.json({ service, related });
}
export async function listProjects(req, res) {
    const filter = { published: true };
    const category = qs(req.query.category);
    if (category)
        filter.category = category;
    let items = await Project.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .select('slug title industry category thumbnail thumbnailAlt summary technologies services results isDemo liveUrl')
        .lean();
    if (!items.length && !category) {
        try {
            const { autoSeedAndBootstrap } = await import('../seed/autoSeed.js');
            await autoSeedAndBootstrap();
            items = await Project.find(filter)
                .sort({ order: 1, createdAt: -1 })
                .select('slug title industry category thumbnail thumbnailAlt summary technologies services results isDemo liveUrl')
                .lean();
        } catch { }
    }
    cache(res);
    res.json({ items });
}
export async function getProject(req, res) {
    const project = await Project.findOne({ slug: String(req.params.slug), published: true }).lean();
    if (!project)
        throw notFound();
    cache(res);
    res.json({ project });
}
const publishedPost = () => ({ status: 'published', publishedAt: { $lte: new Date() } });
export async function listPosts(req, res) {
    const { page, limit, skip } = parsePagination(req.query, 9, 30);
    const filter = publishedPost();
    const category = qs(req.query.category);
    if (category)
        filter.category = category;
    const tag = qs(req.query.tag);
    if (tag)
        filter.tags = tag;
    const search = qs(req.query.q);
    if (search) {
        const rx = new RegExp(escapeRegex(search), 'i');
        filter.$or = [{ title: rx }, { excerpt: rx }, { tags: rx }];
    }
    const [items, total, featured] = await Promise.all([
        BlogPost.find(filter).sort({ publishedAt: -1 }).skip(skip).limit(limit)
            .select('slug title excerpt category tags featured publishedAt authorName coverImage coverImageAlt readingMinutes').lean(),
        BlogPost.countDocuments(filter),
        page === 1 && !search && !category && !tag
            ? BlogPost.find({ ...publishedPost(), featured: true }).sort({ publishedAt: -1 }).limit(3)
                .select('slug title excerpt category publishedAt readingMinutes').lean()
            : [],
    ]);
    cache(res, 30);
    res.json({ items, featured, ...pageMeta(total, page, limit) });
}
export async function getPost(req, res) {
    const post = await BlogPost.findOne({ slug: String(req.params.slug), ...publishedPost() }).lean();
    if (!post)
        throw notFound();
    const related = await BlogPost.find({
        ...publishedPost(),
        slug: { $ne: post.slug },
        $or: [{ category: post.category }, { tags: { $in: post.tags ?? [] } }],
    })
        .sort({ publishedAt: -1 })
        .limit(3)
        .select('slug title excerpt publishedAt readingMinutes')
        .lean();
    cache(res, 30);
    res.json({ post, related });
}
export async function listCategories(_req, res) {
    const items = await BlogCategory.find().sort({ name: 1 }).select('slug name description').lean();
    cache(res, 120);
    res.json({ items });
}
/** Only testimonials that are BOTH published and marked verified (real client + permission) are exposed. */
export async function listTestimonials(_req, res) {
    let items = await Testimonial.find({ published: true, verified: true })
        .sort({ createdAt: -1 })
        .select('authorName authorRole businessName quote avatar')
        .lean();
    if (!items.length) {
        try {
            const { autoSeedAndBootstrap } = await import('../seed/autoSeed.js');
            await autoSeedAndBootstrap();
            items = await Testimonial.find({ published: true, verified: true })
                .sort({ createdAt: -1 })
                .select('authorName authorRole businessName quote avatar')
                .lean();
        } catch { }
    }
    cache(res, 120);
    res.json({ items });
}
export async function listFaqs(req, res) {
    const scope = qs(req.query.scope) ?? 'global';
    let items = await FAQ.find({ published: true, scope }).sort({ order: 1 }).select('question answer').lean();
    if (!items.length && scope === 'global') {
        try {
            const { autoSeedAndBootstrap } = await import('../seed/autoSeed.js');
            await autoSeedAndBootstrap();
            items = await FAQ.find({ published: true, scope }).sort({ order: 1 }).select('question answer').lean();
        } catch { }
    }
    cache(res, 120);
    res.json({ items });
}
export async function pageSeo(req, res) {
    const path = qs(req.query.path);
    const doc = path ? await PageSeo.findOne({ path }).select('title description canonical ogImage noindex').lean() : null;
    cache(res, 60);
    res.json({ seo: doc });
}
