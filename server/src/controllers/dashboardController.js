import { can } from '../config/permissions.js';
import { AuditLog } from '../models/AuditLog.js';
import { Lead } from '../models/crm.js';
import { BlogPost, Project } from '../models/content.js';
import { Types } from 'mongoose';
/** Real, database-backed numbers only. Lead figures are scoped to what the viewer may see. */
export async function dashboard(req, res) {
    const role = req.auth.role;
    const result = {};
    if (can(role, 'leads:read_all') || can(role, 'leads:read_assigned')) {
        const scope = can(role, 'leads:read_all') ? {} : { assignedTo: new Types.ObjectId(req.auth.userId) };
        const base = { ...scope, isSpam: false, archived: false };
        const since = new Date(Date.now() - 29 * 86_400_000);
        since.setHours(0, 0, 0, 0);
        const [byStatus, trend, bySource] = await Promise.all([
            Lead.aggregate([{ $match: base }, { $group: { _id: '$status', n: { $sum: 1 } } }]),
            Lead.aggregate([
                { $match: { ...base, createdAt: { $gte: since } } },
                { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, n: { $sum: 1 } } },
                { $sort: { _id: 1 } },
            ]),
            Lead.aggregate([{ $match: base }, { $group: { _id: '$source', n: { $sum: 1 } } }, { $sort: { n: -1 } }, { $limit: 8 }]),
        ]);
        const count = (s) => byStatus.find((x) => x._id === s)?.n ?? 0;
        const total = byStatus.reduce((a, x) => a + x.n, 0);
        // Fill missing days with zero so the chart is continuous (still real data — zeros are real).
        const map = new Map(trend.map((t) => [t._id, t.n]));
        const days = [];
        for (let i = 0; i < 30; i++) {
            const d = new Date(since.getTime() + i * 86_400_000);
            const key = d.toISOString().slice(0, 10);
            days.push({ date: key, count: map.get(key) ?? 0 });
        }
        result.leads = {
            total,
            new: count('new'),
            inProgress: count('contacted') + count('proposal_sent'),
            qualified: count('qualified'),
            converted: count('won'),
            lost: count('lost'),
            trend: days,
            sources: bySource.map((s) => ({ source: s._id ?? 'unknown', count: s.n })),
        };
    }
    if (can(role, 'content:manage') || can(role, 'blog:manage')) {
        const [projects, posts] = await Promise.all([
            Project.countDocuments({ published: true }),
            BlogPost.countDocuments({ status: 'published' }),
        ]);
        result.content = { publishedProjects: projects, publishedPosts: posts };
    }
    if (can(role, 'audit:view')) {
        result.recentActivity = await AuditLog.find().sort({ createdAt: -1 }).limit(10).select('action actorEmail targetType createdAt').lean();
    }
    res.json(result);
}
export async function auditLog(req, res) {
    const page = Math.max(1, parseInt(String(req.query.page ?? '1'), 10) || 1);
    const limit = 50;
    const action = typeof req.query.action === 'string' ? req.query.action.slice(0, 80) : undefined;
    const filter = action ? { action } : {};
    const [items, total] = await Promise.all([
        AuditLog.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
        AuditLog.countDocuments(filter),
    ]);
    res.json({ items, total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) });
}
