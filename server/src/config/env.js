import 'dotenv/config';
import { z } from 'zod';
const bool = z
    .enum(['true', 'false', '1', '0'])
    .default('false')
    .transform((v) => v === 'true' || v === '1');
const schema = z
    .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(4000),
    MONGODB_URI: z.string().optional(),
    CLIENT_ORIGINS: z.string().default('http://localhost:5173,https://rs-stack.vercel.app'),
    SITE_URL: z.string().url().default('http://localhost:5173'),
    SESSION_TTL_HOURS: z.coerce.number().positive().default(12),
    COOKIE_SAMESITE: z.enum(['lax', 'strict', 'none']).default(process.env.NODE_ENV === 'production' ? 'none' : 'lax'),
    COOKIE_DOMAIN: z.string().optional(),
    IP_HASH_SALT: z.string().min(16).default('dev-only-salt-change-me-please'),
    TRUST_PROXY: z.coerce.number().int().min(0).default(1),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().default(587),
    SMTP_SECURE: bool,
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    MAIL_FROM: z.string().default('Growora <no-reply@localhost>'),
    LEAD_NOTIFY_EMAIL: z.string().optional(),
    UPLOAD_DIR: z.string().default('uploads'),
    MAX_UPLOAD_MB: z.coerce.number().positive().default(5),
    SERVE_CLIENT: bool,
    CLIENT_DIST_DIR: z.string().default('../client/dist'),
    GA_MEASUREMENT_ID: z.string().optional(),
    GTM_ID: z.string().optional(),
    META_PIXEL_ID: z.string().optional(),
    GOOGLE_SITE_VERIFICATION: z.string().optional(),
    BOOTSTRAP_ADMIN_EMAIL: z.string().optional(),
    BOOTSTRAP_ADMIN_NAME: z.string().optional(),
    BOOTSTRAP_ADMIN_PASSWORD: z.string().optional(),
})
    .superRefine((env, ctx) => {
    if (env.NODE_ENV === 'production') {
        if (env.IP_HASH_SALT.length < 32 || env.IP_HASH_SALT.startsWith('dev-only')) {
            ctx.addIssue({ code: 'custom', path: ['IP_HASH_SALT'], message: 'Set a random IP_HASH_SALT (>= 32 chars) in production' });
        }
        if (!env.MONGODB_URI) {
            ctx.addIssue({ code: 'custom', path: ['MONGODB_URI'], message: 'MONGODB_URI is required in production' });
        }
    }
    if (env.COOKIE_SAMESITE === 'none' && env.NODE_ENV !== 'production') {
        // SameSite=None requires Secure; browsers reject it over plain http. Allowed but warned in docs.
    }
});
const parsed = schema.safeParse(process.env);
if (!parsed.success) {
    // Print variable names only — never values.
    const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Invalid environment configuration:\n${issues}`);
}
const e = parsed.data;
export const env = {
    ...e,
    isProd: e.NODE_ENV === 'production',
    isTest: e.NODE_ENV === 'test',
    clientOrigins: e.CLIENT_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean),
    siteUrl: e.SITE_URL.replace(/\/+$/, ''),
    cookieName: 'rs_sid',
    cookieSecure: e.NODE_ENV === 'production' || e.COOKIE_SAMESITE === 'none',
    smtpConfigured: Boolean(e.SMTP_HOST),
};
export function isAllowedOrigin(origin) {
    if (!origin)
        return true;
    if (env.clientOrigins.includes(origin))
        return true;
    if (/^https:\/\/([a-z0-9-]+\.)*vercel\.app$/i.test(origin))
        return true;
    if (/^https:\/\/([a-z0-9-]+\.)*onrender\.com$/i.test(origin))
        return true;
    if (/^http:\/\/localhost(:\d+)?$/i.test(origin))
        return true;
    if (/^http:\/\/127\.0\.0\.1(:\d+)?$/i.test(origin))
        return true;
    return false;
}
