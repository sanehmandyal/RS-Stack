import { Router } from 'express';
import * as pub from '../controllers/publicController.js';
import { createLead } from '../controllers/leadController.js';
import { contactLimiter } from '../middleware/security.js';
import { asyncHandler } from '../utils/errors.js';

export const publicRouter = Router();

publicRouter.get('/settings', asyncHandler(pub.publicSettings));
publicRouter.get('/services', asyncHandler(pub.listServices));
publicRouter.get('/services/:slug', asyncHandler(pub.getService));
publicRouter.get('/projects', asyncHandler(pub.listProjects));
publicRouter.get('/projects/:slug', asyncHandler(pub.getProject));
publicRouter.get('/posts', asyncHandler(pub.listPosts));
publicRouter.get('/posts/:slug', asyncHandler(pub.getPost));
publicRouter.get('/categories', asyncHandler(pub.listCategories));
publicRouter.get('/testimonials', asyncHandler(pub.listTestimonials));
publicRouter.get('/faqs', asyncHandler(pub.listFaqs));
publicRouter.get('/page-seo', asyncHandler(pub.pageSeo));
publicRouter.post('/leads', contactLimiter, asyncHandler(createLead));
