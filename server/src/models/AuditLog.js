import { Schema, model } from 'mongoose';
const auditSchema = new Schema({
    actor: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    actorEmail: { type: String, maxlength: 254 },
    action: { type: String, required: true, index: true },
    targetType: String,
    targetId: String,
    meta: { type: Schema.Types.Mixed },
    ipHash: String,
    requestId: String,
}, { timestamps: { createdAt: true, updatedAt: false } });
auditSchema.index({ createdAt: -1 });
// Retention: audit entries are kept for 2 years, then removed automatically.
auditSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 730 });
export const AuditLog = model('AuditLog', auditSchema);
