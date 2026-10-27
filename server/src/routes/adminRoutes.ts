import { Router } from 'express';
import { getSettings, integrationsStatus, updateSettings } from '../controllers/adminMiscController.js';
import * as authC from '../controllers/authController.js';
import { auditLog, dashboard } from '../controllers/dashboardController.js';
import { crudRouter } from '../controllers/crudFactory.js';
import * as leadC from '../controllers/leadController.js';
import * as mediaC from '../controllers/mediaController.js';
import * as userC from '../controllers/userController.js';
import { blockIfMustChangePassword, requireAuth, requirePermission } from '../middleware/auth.js';
import { loginLimiter, resetLimiter } from '../middleware/security.js';
import { uploadMiddleware } from '../middleware/upload.js';
import { BusinessProfileTask, Campaign, Client, DirectoryListing, DomainHosting } from '../models/crm.js';
import { BlogCategory, BlogPost, FAQ, PageSeo, Project, Redirect, Service, Testimonial } from '../models/content.js';
import { allowedRedirectHosts, clearRedirectCache } from '../services/seoService.js';
import { asyncHandler, badRequest, conflict } from '../utils/errors.js';
import { readingTimeMinutes, sanitizeRichText } from '../utils/security.js';
import * as S from '../validators/schemas.js';

export const adminRouter = Router();

/* ---------- unauthenticated auth endpoints ---------- */
adminRouter.post('/auth/login', loginLimiter, asyncHandler(authC.login));
adminRouter.post('/auth/forgot-password', resetLimiter, asyncHandler(authC.forgotPassword));
adminRouter.post('/auth/reset-password', resetLimiter, asyncHandler(authC.resetPassword));

/* ---------- everything below needs a valid session ---------- */
adminRouter.use(requireAuth);
adminRouter.get('/auth/me', asyncHandler(authC.me));
adminRouter.post('/auth/logout', asyncHandler(authC.logout));
adminRouter.post('/auth/change-password', asyncHandler(authC.changePassword));

// Accounts flagged mustChangePassword can reach nothing else until they change it.
adminRouter.use(blockIfMustChangePassword);

adminRouter.get('/dashboard', requirePermission('dashboard:view'), asyncHandler(dashboard));

/* ---------- leads ---------- */
const leads = Router();
leads.get('/', requirePermission('leads:read_all', 'leads:read_assigned'), asyncHandler(leadC.listLeads));
leads.get('/export.csv', requirePermission('leads:export'), asyncHandler(leadC.exportLeads));
leads.get('/:id', requirePermission('leads:read_all', 'leads:read_assigned'), asyncHandler(leadC.getLead));
leads.patch('/:id', requirePermission('leads:write', 'leads:assign'), asyncHandler(leadC.updateLead));
leads.post('/:id/notes', requirePermission('leads:write'), asyncHandler(leadC.addNote));
adminRouter.use('/leads', leads);

/* ---------- users & audit (Super Admin) ---------- */
const users = Router();
users.use(requirePermission('users:manage'));
users.get('/', asyncHandler(userC.listUsers));
users.post('/', asyncHandler(userC.createUser));
users.patch('/:id', asyncHandler(userC.updateUser));
users.post('/:id/revoke-sessions', asyncHandler(userC.revokeUserSessions));
users.delete('/:id', asyncHandler(userC.deleteUser));
adminRouter.use('/users', users);
adminRouter.get('/audit-log', requirePermission('audit:view'), asyncHandler(auditLog));

/* ---------- settings / integrations ---------- */
adminRouter.get('/settings', requirePermission('settings:manage'), asyncHandler(getSettings));
adminRouter.put('/settings', requirePermission('settings:manage'), asyncHandler(updateSettings));
adminRouter.get('/integrations', requirePermission('integrations:manage'), integrationsStatus);

/* ---------- media ---------- */
const media = Router();
media.use(requirePermission('media:manage'));
media.get('/', asyncHandler(mediaC.listMedia));
media.post('/', uploadMiddleware, asyncHandler(mediaC.uploadMedia));
media.patch('/:id', asyncHandler(mediaC.updateMediaAlt));
media.delete('/:id', asyncHandler(mediaC.deleteMedia));
adminRouter.use('/media', media);

/* ---------- content resources (generic CRUD) ---------- */
adminRouter.use('/services', crudRouter({
  name: 'Service', model: Service, permission: 'content:manage', schema: S.serviceSchema,
  searchFields: ['title', 'slug'], filterFields: ['published', 'category'], defaultSort: { order: 1, title: 1 },
}));

adminRouter.use('/projects', crudRouter({
  name: 'Project', model: Project, permission: 'content:manage', schema: S.projectSchema,
  searchFields: ['title', 'industry'], filterFields: ['published', 'category'], defaultSort: { order: 1, createdAt: -1 },
}));

adminRouter.use('/testimonials', crudRouter({
  name: 'Testimonial', model: Testimonial, permission: 'content:manage', schema: S.testimonialSchema,
  searchFields: ['authorName', 'businessName'], filterFields: ['published', 'verified'],
  beforeSave: (data, _req, existing) => {
    // A testimonial can only go live if it is verified AND has a record of the client's permission.
    const verified = data.verified ?? existing?.verified ?? false;
    const published = data.published ?? existing?.published ?? false;
    const consentRef = data.consentReference ?? existing?.consentReference ?? '';
    if (published && !verified) throw badRequest('Only verified testimonials can be published');
    if (published && !String(consentRef).trim()) throw badRequest('Add a consent reference before publishing a testimonial');
    return data;
  },
}));

adminRouter.use('/faqs', crudRouter({
  name: 'FAQ', model: FAQ, permission: 'content:manage', schema: S.faqSchema,
  searchFields: ['question', 'scope'], filterFields: ['scope', 'published'], defaultSort: { scope: 1, order: 1 },
}));

adminRouter.use('/blog-posts', crudRouter({
  name: 'BlogPost', model: BlogPost, permission: 'blog:manage', schema: S.blogPostSchema,
  searchFields: ['title', 'slug', 'tags'], filterFields: ['status', 'category', 'featured'], defaultSort: { updatedAt: -1 },
  beforeSave: (data, _req, existing) => {
    const out = { ...data };
    if (typeof out.bodyHtml === 'string') {
      out.bodyHtml = sanitizeRichText(out.bodyHtml); // server-side allow-list sanitising on every write
      out.readingMinutes = readingTimeMinutes(out.bodyHtml);
    }
    if (out.publishedAt !== undefined) out.publishedAt = out.publishedAt ? new Date(out.publishedAt) : undefined;
    const status = out.status ?? existing?.status;
    // Publishing without a date publishes now; a future date schedules the post (public queries check publishedAt <= now).
    if (status === 'published' && !out.publishedAt && !existing?.publishedAt) out.publishedAt = new Date();
    return out;
  },
}));

adminRouter.use('/blog-categories', crudRouter({
  name: 'BlogCategory', model: BlogCategory, permission: 'blog:manage', schema: S.blogCategorySchema,
  searchFields: ['name', 'slug'], defaultSort: { name: 1 },
  beforeDelete: async (doc) => {
    if (await BlogPost.exists({ category: doc.slug })) throw conflict('Category is used by blog posts');
  },
}));

/* ---------- SEO administration ---------- */
adminRouter.use('/page-seo', crudRouter({
  name: 'PageSeo', model: PageSeo, permission: 'seo:manage', schema: S.pageSeoSchema,
  searchFields: ['path', 'title'], defaultSort: { path: 1 },
}));

adminRouter.use('/redirects', (() => {
  const router = crudRouter({
    name: 'Redirect', model: Redirect, permission: 'seo:manage', schema: S.redirectSchema,
    searchFields: ['from', 'to'], defaultSort: { from: 1 },
    beforeSave: async (data, _req, existing) => {
      const from: string = data.from ?? existing?.from;
      const to: string = data.to ?? existing?.to;
      if (to && /^https?:\/\//i.test(to)) {
        // Open-redirect protection: absolute destinations must be on an allow-listed host.
        if (!allowedRedirectHosts().has(new URL(to).host)) throw badRequest('Redirect destination host is not allowed');
      }
      if (from && to) {
        const target = /^https?:\/\//i.test(to) ? new URL(to).pathname.replace(/\/+$/, '') || '/' : to.replace(/\/+$/, '') || '/';
        if (target === from) throw badRequest('Redirect cannot point to itself');
        // Follow the chain of existing redirects to detect loops.
        const seen = new Set<string>([from]);
        let cursor = target;
        for (let i = 0; i < 10; i++) {
          if (seen.has(cursor)) throw badRequest('This redirect would create a loop');
          seen.add(cursor);
          const next: any = await Redirect.findOne({ from: cursor, active: true }).select('to').lean();
          if (!next) break;
          cursor = (/^https?:\/\//i.test(next.to) ? new URL(next.to).pathname : next.to).replace(/\/+$/, '') || '/';
        }
      }
      clearRedirectCache();
      return data;
    },
    beforeDelete: async () => clearRedirectCache(),
  });
  return router;
})());

/* ---------- local visibility, campaigns, hosting (manual record-keeping) ---------- */
adminRouter.use('/clients', crudRouter({
  name: 'Client', model: Client, permission: 'local:manage', schema: S.clientSchema,
  searchFields: ['businessName', 'contactName', 'contactEmail'], filterFields: ['archived', 'authorizationStatus'], defaultSort: { businessName: 1 },
}));
adminRouter.use('/gbp-tasks', crudRouter({
  name: 'BusinessProfileTask', model: BusinessProfileTask, permission: 'local:manage', schema: S.gbpTaskSchema,
  searchFields: ['title'], filterFields: ['status', 'type', 'client'], populate: 'client owner', defaultSort: { updatedAt: -1 },
}));
adminRouter.use('/directory-listings', crudRouter({
  name: 'DirectoryListing', model: DirectoryListing, permission: 'local:manage', schema: S.listingSchema,
  searchFields: ['directoryName'], filterFields: ['status', 'client', 'napConsistent'], populate: 'client', defaultSort: { updatedAt: -1 },
}));
adminRouter.use('/campaigns', crudRouter({
  name: 'Campaign', model: Campaign, permission: 'campaigns:manage', schema: S.campaignSchema,
  searchFields: ['name'], filterFields: ['platform', 'status', 'client'], populate: 'client', defaultSort: { updatedAt: -1 },
  beforeSave: (data) => {
    if (data.clientApproved === true && !data.approvedAt) data.approvedAt = new Date();
    return data;
  },
}));
adminRouter.use('/domains', crudRouter({
  name: 'DomainHosting', model: DomainHosting, permission: 'hosting:manage', schema: S.domainSchema,
  searchFields: ['domain', 'registrar', 'hostingProvider'], filterFields: ['status', 'client', 'managedBy'], populate: 'client', defaultSort: { renewalDate: 1 },
}));

