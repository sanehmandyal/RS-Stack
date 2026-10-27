# Deployment

## Recommended topology
One Node host (Render, Railway, Fly.io, a VPS, etc.) running the Express server with `SERVE_CLIENT=true`, MongoDB Atlas for data, HTTPS terminated by the host or a reverse proxy. A single origin keeps cookies first-party and avoids CORS.

## Steps
1. **MongoDB Atlas**: create a cluster, a database user with `readWrite` on the app database only, and an IP allow-list for your host. Enable backups.
2. **Environment** (host dashboard, never committed): copy every key from `.env.example`. In production set `NODE_ENV=production`, a real `MONGODB_URI`, `SITE_URL=https://yourdomain`, `CLIENT_ORIGINS=https://yourdomain`, `TRUST_PROXY` to the number of proxies, `IP_HASH_SALT` (`openssl rand -base64 48`), `SERVE_CLIENT=true`, and SMTP settings.
3. **Build**: `npm ci && npm run build`. Start with `npm run start --workspace server`.
4. **Seed**: `npm run seed --workspace server` once (idempotent; never overwrites edited content).
5. **First Super Admin**: run `bootstrap:admin` once with the three `BOOTSTRAP_ADMIN_*` variables, then remove them from the environment. There is no public setup endpoint.
6. **Uploads**: `UPLOAD_DIR` must be on persistent storage (volume), or move media to object storage before scaling beyond one instance.
7. **Domain/DNS/SSL**: point DNS at the host, enable HTTPS, confirm `/healthz` and `/readyz`.
8. **Search Console**: set `GOOGLE_SITE_VERIFICATION`, submit `/sitemap.xml`.

## Rollback
Redeploy the previous build/image. Schema changes are additive; restore a database backup if data was damaged.

## Monitoring
Health endpoints `/healthz` (process) and `/readyz` (database). Logs are structured JSON with request IDs. Add an uptime monitor and an error tracker of your choice.
