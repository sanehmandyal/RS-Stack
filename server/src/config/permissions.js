export const ROLES = ['super_admin', 'admin', 'marketing_manager', 'sales_manager'];
export const PERMISSIONS = [
    'dashboard:view',
    'leads:read_all',
    'leads:read_assigned',
    'leads:write',
    'leads:assign',
    'leads:export',
    'content:manage',
    'blog:manage',
    'seo:manage',
    'media:manage',
    'campaigns:manage',
    'local:manage',
    'hosting:manage',
    'settings:manage',
    'integrations:manage',
    'users:manage',
    'audit:view',
];
const restrictedForAdmin = ['users:manage', 'integrations:manage', 'audit:view'];
/**
 * Role → permission matrix. This is the single source of truth and is evaluated
 * on the server for every protected endpoint. Roles are always read from the DB
 * (never from the request).
 */
export const ROLE_PERMISSIONS = {
    super_admin: new Set(PERMISSIONS),
    admin: new Set(PERMISSIONS.filter((p) => !restrictedForAdmin.includes(p))),
    marketing_manager: new Set([
        'dashboard:view',
        'blog:manage',
        'seo:manage',
        'media:manage',
        'campaigns:manage',
    ]),
    sales_manager: new Set(['dashboard:view', 'leads:read_assigned', 'leads:write']),
};
export function can(role, permission) {
    return ROLE_PERMISSIONS[role]?.has(permission) ?? false;
}
export function permissionsFor(role) {
    return [...(ROLE_PERMISSIONS[role] ?? [])];
}
export const BUSINESS_TYPES = [
    'cleaning_services',
    'travel_agency',
    'cafe_restaurant',
    'hotel',
    'salon_beauty',
    'local_shop',
    'professional_services',
    'other',
];
export const INDUSTRY_SLUGS = [
    'cleaning-services',
    'travel-agencies',
    'cafes-restaurants',
    'hotels',
    'salons',
    'local-businesses',
    'professional-services',
];
export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost'];
/** Public, non-admin routes that exist in the client app (used for status codes and the sitemap). */
export const STATIC_PUBLIC_ROUTES = [
    '/',
    '/services',
    '/industries',
    '/portfolio',
    '/about',
    '/blog',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
    '/cookie-policy',
    '/refund-policy',
];
