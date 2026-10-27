# Integrations and external credentials

| Integration | State in this codebase | What you must provide |
|---|---|---|
| MongoDB Atlas | Required | `MONGODB_URI` |
| Email (SMTP) | Implemented (lead notifications, password reset); disabled if unset | `SMTP_*`, `MAIL_FROM`, `LEAD_NOTIFY_EMAIL` |
| WhatsApp click-to-chat | Implemented (wa.me link) | Number in Admin → Settings (digits with country code) |
| Google Analytics 4 / GTM / Meta Pixel | Browser tags load **only after cookie consent** | `GA_MEASUREMENT_ID`, `GTM_ID`, `META_PIXEL_ID` |
| Search Console | Verification meta tag + sitemap | `GOOGLE_SITE_VERIFICATION` |
| Google Business Profile API | **Not connected.** Manual task/approval records only | Google API access approval + OAuth app (future work) |
| Google Ads API / Meta Marketing API | **Not connected.** Campaign records are manual, never live data | Developer tokens, OAuth apps (future work) |
| Payments | Not implemented (no payment workflow defined) | — |

Rules followed: no scraping of Google Maps, no client passwords stored, no invented spend/conversion numbers, no claims of live connections.
