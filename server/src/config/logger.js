import pino from 'pino';
import { env } from './env.js';
export const logger = pino({
    level: env.isTest ? 'silent' : env.isProd ? 'info' : 'debug',
    redact: {
        paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'res.headers["set-cookie"]',
            'password',
            '*.password',
            'token',
            '*.token',
        ],
        censor: '[redacted]',
    },
});
