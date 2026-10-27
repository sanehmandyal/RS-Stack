import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, MessageCircle, Phone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { CookieConsent } from '../components/Consent';
import { Logo } from '../components/ui';
import { useSettings } from '../hooks/useSettings';
import { NAV } from '../utils/content';
import { whatsappLink } from '../utils/format';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const s = useSettings();
  const wa = whatsappLink(s.whatsappNumber, 'Hi RS Stack, I would like to discuss a project.');

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 16);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const link = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'text-ink' : 'text-muted hover:text-ink'}`;

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className={`mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl px-4 py-2 sm:px-5 ${scrolled ? 'glass-strong mx-3 sm:mx-auto' : ''}`}>
        <Link to="/" aria-label="RS Stack home"><Logo /></Link>
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} className={link}>{label}</NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          )}
          <Link to="/contact" className="btn-primary btn-sm hidden md:inline-flex">Get Free Consultation</Link>
          <button className="btn-ghost btn-sm lg:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div id="mobile-menu" role="dialog" aria-label="Menu" className="glass-strong fixed inset-x-3 top-[72px] max-h-[calc(100dvh-90px)] overflow-y-auto rounded-2xl p-4 lg:hidden"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
            <nav aria-label="Mobile" className="flex flex-col">
              {NAV.map(([to, label]) => (
                <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `min-h-[48px] rounded-xl px-4 py-3 font-medium ${isActive ? 'bg-white/10 text-ink' : 'text-muted'}`}>{label}</NavLink>
              ))}
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg"
                >
                  <MessageCircle className="h-4 w-4" /> Chat on WhatsApp (+91 98057 20962)
                </a>
              )}
              <Link to="/contact" className="btn-primary mt-2">Get Free Consultation</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
  const s = useSettings();
  const wa = whatsappLink(s.whatsappNumber, 'Hi RS Stack, I would like to get a quote for a website / SEO project.');
  return (
    <footer className="border-t border-white/10 bg-surface/40 px-4 py-14 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted">{s.tagline}</p>
          <ul className="mt-4 space-y-1.5 text-sm text-muted">
            {s.contactEmail && <li><a className="hover:text-ink transition" href={`mailto:${s.contactEmail}`}>{s.contactEmail}</a></li>}
            {s.phone && (
              <li>
                <a className="hover:text-ink transition inline-flex items-center gap-1.5" href={`tel:${s.phone.replace(/[^\d+]/g, '')}`}>
                  <Phone className="h-3.5 w-3.5 text-secondary" /> {s.phone}
                </a>
              </li>
            )}
            {s.address && <li className="text-muted/90 leading-relaxed font-medium">📍 {s.address}</li>}
            {wa && (
              <li className="pt-2">
                <a
                  className="inline-flex items-center gap-2 font-semibold text-emerald-400 hover:text-emerald-300 transition"
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" /> Direct WhatsApp: +91 98057 20962
                </a>
              </li>
            )}
          </ul>
          <ul className="mt-4 flex flex-wrap gap-3 text-sm">
            {Object.entries(s.social).filter(([, v]) => v).map(([k, v]) => (
              <li key={k}><a className="capitalize text-secondary hover:underline" href={v} target="_blank" rel="noopener noreferrer">{k}</a></li>
            ))}
          </ul>
        </div>
        <nav aria-label="Company">
          <h2 className="mb-3 text-sm font-semibold">Services & Solutions</h2>
          <ul className="space-y-2 text-sm text-muted">
            {NAV.map(([to, label]) => <li key={to}><Link className="hover:text-ink" to={to}>{label}</Link></li>)}
          </ul>
        </nav>
        <nav aria-label="Legal">
          <h2 className="mb-3 text-sm font-semibold">Legal & Policies</h2>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link className="hover:text-ink" to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link className="hover:text-ink" to="/terms-of-service">Terms of Service</Link></li>
            <li><Link className="hover:text-ink" to="/cookie-policy">Cookie Policy</Link></li>
            <li><Link className="hover:text-ink" to="/refund-policy">Refund & Cancellation</Link></li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
        <p>© {new Date().getFullYear()} {s.businessName}. All rights reserved. Phase 5, Mohali, SAS Nagar, Punjab 160059.</p>
        <p>Engineered for High-Performance Local & Global Digital Growth.</p>
      </div>
    </footer>
  );
}

function Backdrop() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className={`absolute -left-32 top-0 h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-[120px] ${reduce ? '' : 'animate-drift'}`} />
      <div className={`absolute -right-24 top-1/3 h-[24rem] w-[24rem] rounded-full bg-secondary/10 blur-[120px] ${reduce ? '' : 'animate-drift [animation-delay:-8s]'}`} />
    </div>
  );
}

export default function PublicLayout() {
  const { pathname } = useLocation();
  const s = useSettings();
  const wa = whatsappLink(s.whatsappNumber, 'Hi RS Stack, I found your website and want to enquire about website / SEO services.');
  useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname]);

  return (
    <div className="relative min-h-dvh">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2">Skip to content</a>
      <Backdrop />
      <Header />
      <main id="main"><Outlet /></main>
      <Footer />

      {/* Floating Sticky WhatsApp Button with Pulse Animation */}
      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp (+91 98057 20962)"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3 text-white font-semibold shadow-2xl hover:bg-[#20ba5a] hover:scale-105 active:scale-95 transition duration-200 group"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          <MessageCircle className="h-5 w-5 fill-current" />
          <span className="hidden sm:inline text-xs font-bold tracking-wide uppercase">WhatsApp Us</span>
        </a>
      )}

      <CookieConsent />
    </div>
  );
}
