# RS Stack — digital agency website, CMS and CRM

MERN application for RS Stack: a conversion-focused public website plus a protected admin panel (leads CRM, content, SEO, local-SEO tasks, campaign records, domains/hosting records).

> **Read `STATUS.md` first.** It states exactly what was built, what has and has not been verified, and what you must configure.

## Stack
- **client/** React 18, Vite, TypeScript, Tailwind CSS, React Router, Framer Motion, React Hook Form + Zod, Lucide.
- **server/** Node 20+, Express, TypeScript, Mongoose (MongoDB Atlas), Zod, Argon2id, Helmet, pino.

## Quick start (local)
```bash
npm install                      # installs both workspaces
cp .env.example server/.env      # then edit values (MONGODB_URI, IP_HASH_SALT, ...)
npm run seed --workspace server  # starter services, demo projects (flagged), FAQs, posts
BOOTSTRAP_ADMIN_EMAIL=you@example.com BOOTSTRAP_ADMIN_NAME="Your Name" \
BOOTSTRAP_ADMIN_PASSWORD='a-long-unique-passphrase' npm run bootstrap:admin --workspace server
npm run dev:server               # http://localhost:4000
npm run dev:client               # http://localhost:5173  (proxies /api to :4000)
```
Admin: http://localhost:5173/admin/login

## Quality commands
```bash
npm run typecheck     # tsc for client and server
npm test              # server: Vitest + Supertest + in-memory MongoDB; client: Vitest
npm run build         # builds both
```
The server tests use `mongodb-memory-server`, which downloads a MongoDB binary on first run (needs internet access to fastdl.mongodb.org).

## Production in one paragraph
Build the client, set `SERVE_CLIENT=true` and `NODE_ENV=production`, and run the server: it serves the SPA with per-route SEO metadata, canonical URLs, JSON-LD and correct 404 status codes injected into the HTML, plus `/sitemap.xml` and `/robots.txt`. See `docs/deployment.md`.

## Docs
`docs/architecture.md`, `docs/deployment.md`, `docs/security.md`, `docs/integrations.md`, `docs/admin-guide.md`.
