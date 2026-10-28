import crypto from 'node:crypto';
import rateLimit from 'express-rate-limit';
import { ZodError } from 'zod';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { AppError } from '../utils/errors.js';
import { stripMongoOperators } from '../utils/security.js';
export const requestId = (req, res, next) => {
    const id = crypto.randomUUID();
    req.requestId = id;
    res.setHeader('X-Request-Id', id);
    next();
};
/** Removes $-prefixed / dotted keys from body, query and params before anything reads them (NoSQL injection). */
export const sanitizeInput = (req, _res, next) => {
    if (req.body)
        req.body = stripMongoOperators(req.body);
    // req.query is a getter in Express 5 but a plain property in Express 4.
    const q = stripMongoOperators(req.query);
    Object.keys(req.query).forEach((k) => delete req.query[k]);
    Object.assign(req.query, q);
    next();
};
const limiter = (windowMs, max, message) => rateLimit({
    windowMs,
    max: env.isTest ? 10_000 : max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: message, code: 'rate_limited' },
});
export const apiLimiter = limiter(60_000, 300, 'Too many requests, please slow down.');
export const loginLimiter = limiter(15 * 60_000, 10, 'Too many login attempts. Try again later.');
export const resetLimiter = limiter(60 * 60_000, 5, 'Too many reset requests. Try again later.');
export const contactLimiter = limiter(60 * 60_000, 5, 'Too many submissions. Please try again later.');
export const notFoundHandler = (_req, res) => {
    res.status(404).json({ error: 'Not found', code: 'not_found' });
};
export const errorHandler = (err, req, res, _next) => {
    if (err instanceof ZodError) {
        return res.status(400).json({
            error: 'Validation failed',
            code: 'validation_error',
            issues: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
        });
    }
    if (err instanceof AppError) {
        return res.status(err.status).json({ error: err.message, code: err.code, ...(err.details ? { details: err.details } : {}) });
    }
    if (err?.code === 11000) {
        return res.status(409).json({ error: 'A record with that unique value already exists', code: 'duplicate' });
    }
    if (err?.name === 'ValidationError' || err?.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid data', code: 'validation_error' });
    }
    if (err?.type === 'entity.too.large') {
        return res.status(413).json({ error: 'Request body too large', code: 'too_large' });
    }
    if (err?.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Malformed JSON', code: 'bad_json' });
    }
    if (err?.name === 'MulterError') {
        return res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'File too large' : 'Upload error', code: 'upload_error' });
    }
    logger.error({ err, requestId: req.requestId, path: req.path }, 'Unhandled error');
    // Never leak internals in responses.
    res.status(500).json({ error: 'Something went wrong', code: 'internal_error', requestId: req.requestId });
};
