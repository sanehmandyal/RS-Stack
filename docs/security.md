# Security notes

Implemented in code: Argon2id hashing; hashed server-side sessions with expiry and revocation; HttpOnly + SameSite cookies (Secure in production); CSRF token on state-changing admin requests; Origin checks; login, contact and reset rate limiting; failed-login audit entries; Helmet and a strict CSP; CORS allow-list; body size limits; Zod `.strict()` validation on every write; query-string operator-injection guard; server-side HTML sanitising of blog bodies; image uploads checked by file signature, size-limited, re-encoded and stripped of metadata; CSV export formula-injection neutralising; open-redirect and redirect-loop prevention; audit log with 2-year retention; no stack traces in production responses; consent record stored with each lead; visitor IPs stored only as salted hashes.

Operator responsibilities: strong unique secrets, HTTPS, least-privilege DB user, backups and restore tests, `npm audit` in CI, rotating `IP_HASH_SALT` only deliberately, reviewing legal pages, and enabling two-factor authentication at the hosting/Atlas/email providers (admin-panel 2FA is **not** implemented).

Known gaps: no admin 2FA; no malware scanning of uploads; no CAPTCHA (honeypot, timing check and rate limiting only); media stored on local disk; a penetration test has not been performed.
