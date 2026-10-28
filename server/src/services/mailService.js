import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { escapeHtml } from '../utils/security.js';
let transport = null;
function getTransport() {
    if (!env.smtpConfigured)
        return null;
    if (!transport) {
        transport = nodemailer.createTransport({
            host: env.SMTP_HOST,
            port: env.SMTP_PORT,
            secure: env.SMTP_SECURE,
            auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
        });
    }
    return transport;
}
async function send(to, subject, text, html) {
    const t = getTransport();
    if (!t) {
        logger.warn({ subject }, 'Email not sent: SMTP is not configured');
        return false;
    }
    try {
        await t.sendMail({ from: env.MAIL_FROM, to, subject: subject.replace(/[\r\n]+/g, ' '), text, html });
        return true;
    }
    catch (err) {
        logger.error({ err }, 'Email send failed');
        return false;
    }
}
export async function sendLeadNotification(lead) {
    if (!env.LEAD_NOTIFY_EMAIL)
        return false;
    const rows = [
        ['Name', lead.name],
        ['Business', lead.businessName || '-'],
        ['Email', lead.email],
        ['Phone', lead.phone || '-'],
        ['Business type', lead.businessType],
        ['Services', lead.services.join(', ') || '-'],
        ['Preferred contact', lead.preferredContact],
        ['Message', lead.message],
    ];
    const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');
    const html = `<table cellpadding="6">${rows
        .map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`)
        .join('')}</table>`;
    return send(env.LEAD_NOTIFY_EMAIL, `New RS Stack inquiry from ${lead.name}`, text, html);
}
export async function sendPasswordReset(to, token) {
    const link = `${env.siteUrl}/admin/reset-password?token=${encodeURIComponent(token)}`;
    const text = `A password reset was requested for your RS Stack admin account.\n\nReset link (valid for 30 minutes, single use):\n${link}\n\nIf you did not request this, you can ignore this email.`;
    const html = `<p>A password reset was requested for your RS Stack admin account.</p><p><a href="${escapeHtml(link)}">Reset your password</a> (valid for 30 minutes, single use).</p><p>If you did not request this, you can ignore this email.</p>`;
    return send(to, 'Reset your RS Stack admin password', text, html);
}
