# Custom Domain Setup Guide for RS Stack

Your website is deployed on Vercel (`https://rs-stack.vercel.app/`). To connect your custom domain (e.g. `rsstack.dev` or `yourdomain.com`), follow these steps:

---

## Step 1: Add the Domain in Vercel

1. Open your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click on your **rs-stack** project.
3. Click on the **Settings** tab at the top.
4. In the left navigation, click **Domains**.
5. In the input box, enter your custom domain name (e.g. `yourdomain.com`) and click **Add**.
6. Vercel will ask you to configure the redirect preference (recommended: redirect `www.yourdomain.com` to `yourdomain.com` or vice versa).

---

## Step 2: Configure DNS Records at Your Registrar

Log into where you bought your domain (e.g., Namecheap, GoDaddy, Cloudflare, Google Domains/Squarespace) and go to **DNS Management** / **Manage DNS**:

### 1. Root Domain (Apex) Record
- **Type**: `A`
- **Name / Host**: `@` (or leave blank if required by your DNS provider)
- **Value / Target**: `76.76.21.21`
- **TTL**: Auto or `3600`

### 2. Subdomain (www) Record
- **Type**: `CNAME`
- **Name / Host**: `www`
- **Value / Target**: `cname.vercel-dns.com.`
- **TTL**: Auto or `3600`

---

## Step 3: Automatic SSL & Verification

- Once the DNS records propagate (typically 2 to 15 minutes), Vercel will verify the domain.
- Vercel automatically provisions a free, auto-renewing Let's Encrypt TLS/SSL certificate.
- Your site will be live and secure with HTTPS.

---

## Pre-configured Assets on RS Stack:
- **Favicons**: `/favicon.svg` (vector) and `/logo.png` (high-res PNG) are linked in `client/index.html`.
- **Search Engine Sitemaps**: `sitemap.xml` and `robots.txt` are configured with canonical paths.
- **Legal Compliance Pages**:
  - `/privacy` & `/privacy-policy`
  - `/terms` & `/terms-of-service`
  - `/cookie-policy`
  - `/refund-policy`
- **Security & Route Protection**: Complete Argon2id authentication, RBAC admin guards, and sanitized inputs.
