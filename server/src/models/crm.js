import { Schema, model } from 'mongoose';
import { BUSINESS_TYPES, LEAD_STATUSES } from '../config/permissions.js';
const consentSchema = new Schema({
    email: { type: String, lowercase: true, trim: true, index: true },
    purpose: { type: String, default: 'contact_form' },
    policyVersion: { type: String, default: '1' },
    consentText: { type: String, maxlength: 500 },
    ipHash: String,
    userAgent: { type: String, maxlength: 300 },
    givenAt: { type: Date, default: Date.now },
}, { timestamps: true });
export const ContactConsent = model('ContactConsent', consentSchema);
const leadSchema = new Schema({
    name: { type: String, required: true, trim: true, maxlength: 100 },
    businessName: { type: String, trim: true, maxlength: 150 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254, index: true },
    phone: { type: String, trim: true, maxlength: 30 },
    businessType: { type: String, enum: BUSINESS_TYPES, required: true },
    services: { type: [String], default: [] },
    budgetRange: { type: String, maxlength: 40 },
    message: { type: String, required: true, maxlength: 3000 },
    preferredContact: { type: String, enum: ['email', 'phone', 'whatsapp'], default: 'email' },
    status: { type: String, enum: LEAD_STATUSES, default: 'new', index: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    followUpAt: Date,
    source: { type: String, default: 'website', maxlength: 60, index: true },
    utm: { source: String, medium: String, campaign: String },
    consent: { type: Schema.Types.ObjectId, ref: 'ContactConsent' },
    isSpam: { type: Boolean, default: false, index: true },
    archived: { type: Boolean, default: false, index: true },
    ipHash: String,
    userAgent: { type: String, maxlength: 300 },
}, { timestamps: true });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ status: 1, createdAt: -1 });
export const Lead = model('Lead', leadSchema);
const leadNoteSchema = new Schema({
    lead: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, required: true, maxlength: 2000 },
}, { timestamps: true });
export const LeadNote = model('LeadNote', leadNoteSchema);
const clientSchema = new Schema({
    businessName: { type: String, required: true, trim: true, maxlength: 150 },
    contactName: { type: String, trim: true, maxlength: 100 },
    contactEmail: { type: String, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, trim: true, maxlength: 30 },
    website: { type: String, trim: true, maxlength: 300 },
    category: { type: String, trim: true, maxlength: 100 },
    address: { type: String, trim: true, maxlength: 300 },
    hours: { type: String, trim: true, maxlength: 500 },
    serviceAreas: { type: [String], default: [] },
    // Records that the client authorised Growora to act. NEVER store passwords here.
    authorizationStatus: { type: String, enum: ['none', 'requested', 'granted', 'revoked'], default: 'none' },
    authorizationNote: { type: String, maxlength: 500 },
    notes: { type: String, maxlength: 2000 },
    archived: { type: Boolean, default: false },
}, { timestamps: true });
clientSchema.index({ businessName: 1 });
export const Client = model('Client', clientSchema);
const taskSchema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    type: {
        type: String,
        enum: ['profile_setup', 'optimization', 'nap_check', 'review_response', 'recommendation', 'access', 'approval'],
        default: 'optimization',
    },
    status: { type: String, enum: ['todo', 'in_progress', 'waiting_client', 'done'], default: 'todo', index: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    dueDate: Date,
    completedAt: Date,
    clientApproval: {
        approved: { type: Boolean, default: false },
        approvedBy: { type: String, maxlength: 150 },
        approvedAt: Date,
        note: { type: String, maxlength: 500 },
    },
    notes: { type: String, maxlength: 2000 },
}, { timestamps: true });
export const BusinessProfileTask = model('BusinessProfileTask', taskSchema);
const listingSchema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
    directoryName: { type: String, required: true, trim: true, maxlength: 150 },
    listingUrl: { type: String, trim: true, maxlength: 400 },
    status: { type: String, enum: ['planned', 'submitted', 'pending_verification', 'live', 'rejected'], default: 'planned' },
    napConsistent: { type: String, enum: ['unchecked', 'consistent', 'inconsistent'], default: 'unchecked' },
    submittedAt: Date,
    verifiedAt: Date,
    notes: { type: String, maxlength: 1000 },
}, { timestamps: true });
export const DirectoryListing = model('DirectoryListing', listingSchema);
const campaignSchema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
    platform: { type: String, enum: ['google_ads', 'meta_ads'], required: true },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    objective: { type: String, trim: true, maxlength: 300 },
    budget: {
        amount: { type: Number, min: 0, default: 0 },
        currency: { type: String, default: 'INR', maxlength: 3 },
        period: { type: String, enum: ['daily', 'monthly', 'total'], default: 'monthly' },
    },
    startDate: Date,
    endDate: Date,
    status: { type: String, enum: ['draft', 'pending_approval', 'active', 'paused', 'completed'], default: 'draft' },
    landingPage: { type: String, trim: true, maxlength: 400 },
    conversionTracking: { type: String, enum: ['not_set_up', 'in_progress', 'verified'], default: 'not_set_up' },
    reportingNotes: { type: String, maxlength: 3000 },
    clientApproved: { type: Boolean, default: false },
    approvedAt: Date,
}, { timestamps: true });
export const Campaign = model('Campaign', campaignSchema);
const domainSchema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
    domain: { type: String, required: true, trim: true, lowercase: true, maxlength: 253 },
    registrar: { type: String, trim: true, maxlength: 100 },
    hostingProvider: { type: String, trim: true, maxlength: 100 },
    managedBy: { type: String, enum: ['rs_stack', 'client'], default: 'client' },
    renewalDate: Date,
    hostingRenewalDate: Date,
    sslExpiry: Date,
    status: { type: String, enum: ['active', 'expiring', 'expired', 'transferred', 'inactive'], default: 'active' },
    recurringCostNote: { type: String, maxlength: 300 },
    // Do NOT put registrar / hosting passwords here. Use delegated access or a password manager.
    notes: { type: String, maxlength: 1000 },
}, { timestamps: true });
domainSchema.index({ renewalDate: 1 });
export const DomainHosting = model('DomainHosting', domainSchema);
