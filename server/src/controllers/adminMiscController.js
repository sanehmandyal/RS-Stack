import { env } from '../config/env.js';
import { audit } from '../services/auditService.js';
import { settingsSchema } from '../validators/schemas.js';
import { getOrCreateSettings } from './publicController.js';
export async function getSettings(_req, res) {
    res.json((await getOrCreateSettings()).toObject());
}
export async function updateSettings(req, res) {
    const data = settingsSchema.parse(req.body);
    const doc = await getOrCreateSettings();
    doc.set(data);
    await doc.save();
    await audit(req, 'settings.updated', { type: 'SiteSettings' }, { fields: Object.keys(data) });
    res.json(doc.toObject());
}
/**
 * Honest integration status. "configured" only means that the environment variables exist.
 * No live Google Business Profile / Google Ads / Meta Ads API connection is implemented in this codebase:
 * those areas are manual record-keeping until OAuth + API access is added (see docs/integrations.md).
 */
export function integrationsStatus(_req, res) {
    res.json({
        items: [
            { key: 'email', name: 'Transactional email (SMTP)', configured: env.smtpConfigured, mode: 'live', note: 'Used for lead notifications and password reset.' },
            { key: 'ga4', name: 'Google Analytics 4', configured: Boolean(env.GA_MEASUREMENT_ID), mode: 'browser tag', note: 'Loaded only after cookie consent.' },
            { key: 'gtm', name: 'Google Tag Manager', configured: Boolean(env.GTM_ID), mode: 'browser tag', note: 'Loaded only after cookie consent.' },
            { key: 'meta_pixel', name: 'Meta Pixel', configured: Boolean(env.META_PIXEL_ID), mode: 'browser tag', note: 'Loaded only after cookie consent.' },
            { key: 'gsc', name: 'Google Search Console verification', configured: Boolean(env.GOOGLE_SITE_VERIFICATION), mode: 'meta tag', note: 'Verification meta tag is injected into the page head.' },
            { key: 'gbp', name: 'Google Business Profile API', configured: false, mode: 'manual', note: 'Not connected. Tasks and approvals are tracked manually in the Local SEO area.' },
            { key: 'google_ads', name: 'Google Ads API', configured: false, mode: 'manual', note: 'Not connected. Campaign records are manual entries, not live ad data.' },
            { key: 'meta_ads', name: 'Meta Marketing API', configured: false, mode: 'manual', note: 'Not connected. Campaign records are manual entries, not live ad data.' },
        ],
    });
}
