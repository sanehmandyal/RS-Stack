import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { env, isAllowedOrigin } from './config/env.js';
import { dbReady } from './config/db.js';
import { logger } from './config/logger.js';
import { apiLimiter, errorHandler, notFoundHandler, requestId, sanitizeInput } from './middleware/security.js';
import { uploadDir } from './middleware/upload.js';
import { adminRouter } from './routes/adminRoutes.js';
import { publicRouter } from './routes/publicRoutes.js';
import { buildSitemap, injectHead, normalizePath, redirectMiddleware, resolveRoute, robotsTxt, SEO_PLACEHOLDER } from './services/seoService.js';
import { asyncHandler } from './utils/errors.js';
function cspDirectives() {
    const script = ["'self'"];
    const connect = ["'self'"];
    const img = ["'self'", 'data:', 'https://images.unsplash.com'];
    if (env.GA_MEASUREMENT_ID || env.GTM_ID) {
        script.push('https://www.googletagmanager.com');
        connect.push('https://www.google-analytics.com', 'https://*.google-analytics.com', 'https://*.analytics.google.com', 'https://www.googletagmanager.com');
        img.push('https://www.google-analytics.com', 'https://www.googletagmanager.com');
    }
    if (env.META_PIXEL_ID) {
        script.push('https://connect.facebook.net');
        connect.push('https://www.facebook.com');
        img.push('https://www.facebook.com');
    }
    return {
        defaultSrc: ["'self'"],
        scriptSrc: script,
        styleSrc: ["'self'", "'unsafe-inline'"], // Tailwind/Framer Motion set inline styles
        imgSrc: img,
        fontSrc: ["'self'", 'data:'],
        connectSrc: connect,
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
        formAction: ["'self'"],
    };
}
export function createApp() {
    const app = express();
    app.disable('x-powered-by');
    app.set('trust proxy', env.TRUST_PROXY);
    app.use(requestId);
    const pinoHttpFn = (typeof pinoHttp === 'function' ? pinoHttp : pinoHttp.default || pinoHttp);
    const httpLogger = pinoHttpFn({ logger, genReqId: (req) => req.requestId, autoLogging: !env.isTest });
    app.use(httpLogger);
    app.use(helmet({
        contentSecurityPolicy: { useDefaults: false, directives: cspDirectives() },
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
        xContentTypeOptions: true,
        xFrameOptions: { action: 'deny' },
    }));
    app.use(compression());
    // CORS: only approved browser origins, with credentials for the session.
    app.use('/api', cors({
        origin: (origin, cb) => cb(null, isAllowedOrigin(origin)),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'Authorization'],
        maxAge: 600,
    }));
    app.use(express.json({ limit: '200kb' }));
    app.use(cookieParser());
    app.use(sanitizeInput);
    app.get('/healthz', (_req, res) => res.json({ status: 'ok' }));
    app.get('/readyz', (_req, res) => (dbReady() ? res.json({ status: 'ready' }) : res.status(503).json({ status: 'database_unavailable' })));
    app.get('/', (_req, res) => res.json({ status: 'ok', name: 'RS Stack API', documentation: '/api/public/settings' }));
    // Uploaded images: static, never executable, never sniffed.
    app.use('/uploads', express.static(uploadDir, {
        index: false,
        dotfiles: 'deny',
        maxAge: '7d',
        immutable: true,
        setHeaders: (res) => {
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self'; sandbox");
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        },
    }));
    app.get('/robots.txt', (_req, res) => res.type('text/plain').send(robotsTxt()));
    app.get('/sitemap.xml', asyncHandler(async (_req, res) => {
        res.type('application/xml').send(await buildSitemap());
    }));
    app.use('/api', apiLimiter);
    app.use('/api/public', publicRouter);
    app.use('/api/admin', adminRouter);
    app.use('/api', notFoundHandler);
    // Optionally serve the built SPA with server-injected SEO metadata and correct status codes.
    if (env.SERVE_CLIENT) {
        const dist = path.resolve(env.CLIENT_DIST_DIR);
        const indexFile = path.join(dist, 'index.html');
        app.use(asyncHandler(async (req, res, next) => redirectMiddleware(req, res, next)));
        app.use(express.static(dist, { index: false, maxAge: '1y', immutable: true, setHeaders: (res, p) => { if (p.endsWith('.html'))
                res.setHeader('Cache-Control', 'no-cache'); } }));
        app.get('*', asyncHandler(async (req, res) => {
            if (!fs.existsSync(indexFile))
                return res.status(503).send('Client build not found');
            const original = req.path;
            const normalized = normalizePath(original);
            // One canonical URL per page: strip trailing slashes with a permanent redirect.
            if (original.length > 1 && original.endsWith('/'))
                return res.redirect(301, normalized);
            const meta = await resolveRoute(normalized);
            const template = fs.readFileSync(indexFile, 'utf8');
            const html = template.includes(SEO_PLACEHOLDER) ? injectHead(template, meta) : template;
            res.status(meta.status).setHeader('Cache-Control', 'no-cache').type('html').send(html);
        }));
    }
    app.use(errorHandler);
    return app;
}
