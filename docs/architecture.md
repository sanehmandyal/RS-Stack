# Architecture

## Layout
```
client/src   pages/ (public)  admin/ (protected app, code-split)  components/  hooks/  services/api.ts  schemas/  utils/
server/src   config/ controllers/ middleware/ models/ routes/ services/ validators/ utils/ scripts/ seed/ tests/
```
Controllers handle HTTP, `services/` hold business logic (auth, audit, mail, SEO), `models/` hold Mongoose schemas, `validators/` hold Zod schemas. Generic content CRUD is produced by `controllers/crudFactory.ts`, which applies a permission check, strict Zod validation and audit logging to every route.

## Request flow
Browser → (Vite proxy in dev, or same origin in prod) → Express: request-id → helmet/CSP → CORS allow-list → body limit → input sanitising → rate limits → routers. Public API: `/api/public/*`. Admin API: `/api/admin/*` (everything except login/forgot/reset requires a valid session, then a per-route permission).

## Authentication
Server-side sessions. A random token is set in an HttpOnly, SameSite cookie; only its hash is stored in MongoDB with an expiry (TTL) and revocation support. A CSRF token is returned by login/`me`, held in memory by the SPA and required in `X-CSRF-Token` on every state-changing admin request. Nothing sensitive goes in localStorage. Passwords use Argon2id. Reset tokens are single-use and short-lived.

## Roles
`super_admin`, `admin`, `marketing_manager`, `sales_manager` — matrix in `server/src/config/permissions.ts`. Roles are always read from the database. Sales Managers see only leads assigned to them (out-of-scope leads return 404).

## Data model (Mongoose)
User, Session, PasswordResetToken, Lead, LeadNote, ContactConsent, Service, Project, BlogPost, BlogCategory, MediaAsset, Testimonial, FAQ, SiteSettings, PageSeo, Redirect, Client, BusinessProfileTask, DirectoryListing, Campaign, DomainHosting, AuditLog.

## SEO strategy
The client is a Vite SPA. To avoid the usual SPA SEO weakness, the production server injects title, description, canonical, Open Graph, robots and JSON-LD for each route into the HTML before sending it, returns real 404 status codes for unknown service/project/post URLs, applies database-managed redirects, and generates the sitemap. Body content is still rendered client-side; if you need fully server-rendered body HTML, add build-time prerendering or move the public site to an SSR framework.
