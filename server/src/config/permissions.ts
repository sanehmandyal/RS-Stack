export const ROLES = ['super_admin', 'admin', 'marketing_manager', 'sales_manager'] as const;
export type Role = (typeof ROLES)[number];

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
] as const;
export type Permission = (typeof PERMISSIONS)[number];

const restrictedForAdmin: Permission[] = ['users:manage', 'integrations:manage', 'audit:view'];

/**
 * Role → permission matrix. This is the single source of truth and is evaluated
 * on the server for every protected endpoint. Roles are always read from the DB
 * (never from the request).
 */
export const ROLE_PERMISSIONS: Record<Role, ReadonlySet<Permission>> = {
  super_admin: new Set(PERMISSIONS),
  admin: new Set(PERMISSIONS.filter((p) => !restrictedForAdmin.includes(p))),
  marketing_manager: new Set<Permission>([
    'dashboard:view',
    'blog:manage',
    'seo:manage',
    'media:manage',
    'campaigns:manage',
  ]),
  sales_manager: new Set<Permission>(['dashboard:view', 'leads:read_assigned', 'leads:write']),
};

export function can(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.has(permission) ?? false;
}

export function permissionsFor(role: Role): Permission[] {
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
] as const;

export const INDUSTRY_SLUGS = [
  'cleaning-services',
  'travel-agencies',
  'cafes-restaurants',
  'hotels',
  'salons',
  'local-businesses',
  'professional-services',
] as const;

export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

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
] as const;
