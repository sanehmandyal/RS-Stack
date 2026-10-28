import { z } from 'zod';
export const BUSINESS_TYPES = [
    ['cleaning_services', 'Cleaning services'],
    ['travel_agency', 'Travel agency / tour operator'],
    ['cafe_restaurant', 'Cafe / restaurant'],
    ['hotel', 'Hotel / hospitality'],
    ['salon_beauty', 'Salon / beauty business'],
    ['local_shop', 'Local shop / retailer'],
    ['professional_services', 'Professional services'],
    ['other', 'Other'],
];
export const BUDGETS = [
    ['under_25k', 'Under ₹25,000'],
    ['25k_50k', '₹25,000 to ₹50,000'],
    ['50k_1l', '₹50,000 to ₹1,00,000'],
    ['1l_3l', '₹1,00,000 to ₹3,00,000'],
    ['above_3l', 'Above ₹3,00,000'],
    ['not_sure', 'Not sure yet'],
];
const noMarkup = (v) => !/[<>]/.test(v);
// Mirrors the server-side schema; the server remains the source of truth.
export const contactSchema = z.object({
    name: z.string().trim().min(2, 'Please enter your name').max(100).refine(noMarkup, 'Remove < and > characters'),
    businessName: z.string().trim().max(150).refine(noMarkup, 'Remove < and > characters').optional(),
    email: z.string().trim().toLowerCase().email('Enter a valid email address').max(254),
    phone: z
        .string()
        .trim()
        .optional()
        .refine((v) => !v || /^\+?[\d][\d\s().-]{6,19}$/.test(v), 'Enter a valid phone number'),
    businessType: z.enum(BUSINESS_TYPES.map((b) => b[0]), { errorMap: () => ({ message: 'Select your business type' }) }),
    services: z.array(z.string()).max(25),
    budgetRange: z.enum(BUDGETS.map((b) => b[0])).optional().or(z.literal('')),
    message: z.string().trim().min(10, 'Please tell us a little more (at least 10 characters)').max(3000).refine(noMarkup, 'Remove < and > characters'),
    preferredContact: z.enum(['email', 'phone', 'whatsapp']),
    consent: z.literal(true, { errorMap: () => ({ message: 'Please accept the privacy notice to continue' }) }),
    website: z.string().max(200).optional(), // honeypot
});
