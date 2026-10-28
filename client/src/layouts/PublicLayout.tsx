import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Lock, Menu, MessageCircle, Phone, X } from 'lucide-react';
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
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${scrolled ? 'py-2' : 'py-3 sm:py-4'}`}>
      <div className={`mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full px-4 py-2 sm:px-6 transition-all duration-300 ${scrolled ? 'glass-strong mx-3 sm:mx-auto border border-white/80 shadow-[0_10px_35px_-5px_rgba(15,23,42,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)]' : 'bg-white/50 backdrop-blur-md border border-white/60 shadow-xs'}`}>
        <Link to="/" aria-label="RS Stack home" className="hover:scale-105 transition-transform"><Logo /></Link>
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex bg-slate-100/70 p-1 rounded-full border border-white/80 backdrop-blur-md">
          {NAV.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-primary shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-ink hover:bg-white/60'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-50/90 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition shadow-xs backdrop-blur-md hover:scale-105 active:scale-95"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="h-4 w-4 text-emerald-600" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          )}
          <Link to="/contact" className="btn-primary btn-sm hidden md:inline-flex rounded-full shadow-sm hover:scale-105 active:scale-95 transition-transform">Get Free Consultation</Link>
          <button className="btn-ghost btn-sm lg:hidden rounded-full" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div id="mobile-menu" role="dialog" aria-label="Menu" className="glass-strong fixed inset-x-3 top-[72px] max-h-[calc(100dvh-90px)] overflow-y-auto rounded-3xl p-5 lg:hidden border border-white/80 shadow-2xl"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {NAV.map(([to, label]) => (
                <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `min-h-[48px] rounded-2xl px-4 py-3 font-semibold transition ${isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-700 hover:bg-slate-50'}`}>{label}</NavLink>
              ))}
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 transition"
                >
                  <MessageCircle className="h-4 w-4" /> Chat on WhatsApp (+91 98057 20962)
                </a>
              )}
              <Link to="/contact" className="btn-primary mt-2 rounded-2xl">Get Free Consultation</Link>
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
    <footer className="border-t border-slate-200 bg-slate-50/90 px-4 py-14 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted leading-relaxed">{s.tagline}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {s.contactEmail && <li><a className="hover:text-primary transition" href={`mailto:${s.contactEmail}`}>{s.contactEmail}</a></li>}
            {s.phone && (
              <li>
                <a className="hover:text-primary transition inline-flex items-center gap-1.5 font-medium" href={`tel:${s.phone.replace(/[^\d+]/g, '')}`}>
                  <Phone className="h-3.5 w-3.5 text-primary" /> {s.phone}
                </a>
              </li>
            )}
            {s.address && <li className="text-slate-600 leading-relaxed font-medium">📍 {s.address}</li>}
            {wa && (
              <li className="pt-2">
                <a
                  className="inline-flex items-center gap-2 font-semibold text-emerald-600 hover:text-emerald-700 transition"
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
              <li key={k}><a className="capitalize text-primary hover:underline font-medium" href={v} target="_blank" rel="noopener noreferrer">{k}</a></li>
            ))}
          </ul>
        </div>
        <nav aria-label="Company">
          <h2 className="mb-3 text-sm font-bold text-ink">Services & Solutions</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            {NAV.map(([to, label]) => <li key={to}><Link className="hover:text-primary transition" to={to}>{label}</Link></li>)}
          </ul>
        </nav>
        <nav aria-label="Legal">
          <h2 className="mb-3 text-sm font-bold text-ink">Legal & Policies</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link className="hover:text-primary transition" to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link className="hover:text-primary transition" to="/terms-of-service">Terms of Service</Link></li>
            <li><Link className="hover:text-primary transition" to="/cookie-policy">Cookie Policy</Link></li>
            <li><Link className="hover:text-primary transition" to="/refund-policy">Refund & Cancellation</Link></li>
            <li>
              <Link className="hover:text-primary inline-flex items-center gap-1.5 text-primary font-semibold transition" to="/admin/login">
                <Lock className="h-3 w-3" /> Admin Portal
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
        <p>© {new Date().getFullYear()} {s.businessName}. All rights reserved. Phase 5, Mohali, SAS Nagar, Punjab 160059.</p>
        <div className="flex items-center gap-4">
          <Link to="/admin/login" className="hover:text-primary text-slate-600 transition inline-flex items-center gap-1.5 font-medium">
            <Lock className="h-3 w-3 text-primary" /> Admin Login
          </Link>
          <span>•</span>
          <p>Engineered for High-Performance Local & Global Digital Growth.</p>
        </div>
      </div>
    </footer>
  );
}

function Backdrop() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg">
      {/* Ambient floating colorful glow bubbles */}
      <div className={`absolute -left-32 -top-20 h-[34rem] w-[34rem] rounded-full bg-gradient-to-tr from-blue-400/20 via-sky-300/15 to-indigo-300/15 blur-[120px] ${reduce ? '' : 'animate-bubble-slow'}`} />
      <div className={`absolute -right-24 top-1/4 h-[30rem] w-[30rem] rounded-full bg-gradient-to-br from-sky-400/20 via-teal-300/15 to-blue-500/15 blur-[120px] ${reduce ? '' : 'animate-bubble-float [animation-delay:-4s]'}`} />
      <div className={`absolute left-1/3 top-2/3 h-[26rem] w-[26rem] rounded-full bg-gradient-to-tl from-indigo-400/15 via-blue-300/15 to-cyan-300/10 blur-[110px] ${reduce ? '' : 'animate-bubble-drift [animation-delay:-8s]'}`} />
      <div className={`absolute -bottom-20 right-1/4 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-blue-500/15 to-emerald-300/10 blur-[120px] ${reduce ? '' : 'animate-bubble-slow [animation-delay:-12s]'}`} />

      {/* Floating Translucent Liquid Glass Bubbles */}
      {!reduce && (
        <>
          <div className="absolute left-[12%] top-[18%] h-24 w-24 rounded-full glass-bubble animate-bubble-float opacity-75" />
          <div className="absolute right-[14%] top-[12%] h-16 w-16 rounded-full glass-bubble animate-bubble-slow opacity-65 [animation-delay:-3s]" />
          <div className="absolute left-[7%] top-[55%] h-20 w-20 rounded-full glass-bubble animate-bubble-drift opacity-70 [animation-delay:-6s]" />
          <div className="absolute right-[10%] top-[65%] h-28 w-28 rounded-full glass-bubble animate-bubble-float opacity-55 [animation-delay:-9s]" />
          <div className="absolute left-[28%] top-[84%] h-14 w-14 rounded-full glass-bubble animate-bubble-slow opacity-65 [animation-delay:-12s]" />
        </>
      )}

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 grid-bg opacity-25" />
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
