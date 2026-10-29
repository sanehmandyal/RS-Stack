import { AnimatePresence, motion } from 'framer-motion';
import { Lock, Menu, MessageCircle, X } from 'lucide-react';
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
    const wa = whatsappLink(s.whatsappNumber, 'Hi Growora, I would like to discuss a project.');

    useEffect(() => {
        const on = () => setScrolled(window.scrollY > 16);
        on();
        window.addEventListener('scroll', on, { passive: true });
        return () => window.removeEventListener('scroll', on);
    }, []);

    useEffect(() => setOpen(false), [pathname]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === 'Escape' && setOpen(false);
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [open]);

    return (
      <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-200 ${scrolled ? 'py-2' : 'py-3.5'}`}>
        <div className={`mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 py-2.5 rounded-xl transition-all duration-200 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-sm mx-3 sm:mx-auto'
            : 'bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs'
        }`}>
          <Link to="/" aria-label="Growora home" className="hover:opacity-95 transition">
            <Logo />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex bg-slate-100/90 p-1 rounded-lg border border-slate-200/80">
            {NAV.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `rounded-md px-3.5 py-1.5 text-xs font-semibold transition duration-150 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
                }`}
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
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition shadow-xs"
                aria-label="Chat on WhatsApp"
              >
                <MessageCircle className="h-4 w-4 text-orange-600"/>
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            )}
            <Link to="/contact" className="btn btn-sm btn-primary hidden md:inline-flex">
              Schedule Consultation
            </Link>
            <button
              className="btn btn-sm btn-ghost lg:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-label="Menu"
              className="fixed inset-x-3 top-[68px] max-h-[calc(100dvh-80px)] overflow-y-auto rounded-xl p-5 lg:hidden bg-white border border-slate-200 shadow-xl"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <nav aria-label="Mobile" className="flex flex-col gap-1">
                {NAV.map(([to, label]) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) => `min-h-[44px] rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-slate-100 text-slate-950 border border-slate-200 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {label}
                  </NavLink>
                ))}
                {wa && (
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:from-red-700 hover:to-orange-700 transition"
                  >
                    <MessageCircle className="h-4 w-4"/> Chat on WhatsApp (+91 98057 20962)
                  </a>
                )}
                <Link to="/contact" className="btn btn-primary mt-2">
                  Schedule Consultation
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    );
}

function Footer() {
    const s = useSettings();
    return (
      <footer className="border-t border-slate-200 bg-white px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-3.5 max-w-sm text-sm text-slate-600 leading-relaxed">
              {s.tagline || 'Websites, Local SEO and Custom Web Applications for Growing Businesses.'}
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-700">
              {s.contactEmail && (
                <li>
                  <a className="hover:text-black transition font-medium" href={`mailto:${s.contactEmail}`}>
                    {s.contactEmail}
                  </a>
                </li>
              )}
              {s.phone && (
                <li>
                  <a className="hover:text-black transition inline-flex items-center gap-1.5 font-medium" href={`tel:${s.phone.replace(/[^\d+]/g, '')}`}>
                    {s.phone}
                  </a>
                </li>
              )}
              {s.address && (
                <li className="text-slate-600">
                  {s.address}
                </li>
              )}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Capabilities</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link className="hover:text-black transition" to="/services/business-website-development">Web Development</Link></li>
              <li><Link className="hover:text-black transition" to="/services/local-seo-optimization">Local SEO & Maps</Link></li>
              <li><Link className="hover:text-black transition" to="/services/custom-mern-applications">Web Applications</Link></li>
              <li><Link className="hover:text-black transition" to="/portfolio">Recent Work</Link></li>
              <li><Link className="hover:text-black transition" to="/about">About Growora</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Compliance & Legal</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link className="hover:text-black transition" to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link className="hover:text-black transition" to="/terms-and-conditions">Terms & Conditions</Link></li>
              <li><Link className="hover:text-black transition" to="/refund-policy">Refund & Cancellation</Link></li>
              <li className="pt-2">
                <Link className="hover:text-red-700 inline-flex items-center gap-1.5 text-orange-700 font-semibold transition" to="/admin/login">
                  <Lock className="h-3 w-3"/> Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-6xl border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {s.businessName}. All rights reserved. Phase 5, Mohali, SAS Nagar, Punjab 160059.</p>
          <div className="flex items-center gap-4">
            <Link to="/admin/login" className="hover:text-red-700 text-slate-600 transition inline-flex items-center gap-1.5 font-medium">
              <Lock className="h-3 w-3 text-orange-600"/> Admin Login
            </Link>
            <span>|</span>
            <p>Phase 5, Mohali, Punjab, India</p>
          </div>
        </div>
      </footer>
    );
}

function Backdrop() {
    return (
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg">
        {/* Crisp clean architectural grid */}
        <div className="absolute inset-0 grid-bg opacity-35"/>
        {/* Subtle clean top wash */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white to-transparent"/>
      </div>
    );
}

export default function PublicLayout() {
    const { pathname } = useLocation();
    const s = useSettings();
    const wa = whatsappLink(s.whatsappNumber, 'Hi Growora, I would like to enquire about website or SEO services.');

    useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname]);

    return (
      <div className="relative min-h-dvh flex flex-col justify-between">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-red-600 focus:text-white focus:px-4 focus:py-2">
          Skip to content
        </a>
        <Backdrop />
        <Header />
        <main id="main" className="flex-1"><Outlet /></main>
        <Footer />

        {/* Floating Sticky WhatsApp Button */}
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Chat on WhatsApp (${s.whatsappNumber || '+91 98057 20962'})`}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 px-4 py-2.5 text-white font-semibold shadow-md hover:from-red-700 hover:via-orange-700 hover:to-amber-700 transition active:scale-95 duration-150"
          >
            <MessageCircle className="h-4 w-4"/>
            <span className="text-xs font-bold tracking-wide uppercase">WhatsApp</span>
          </a>
        )}

        <CookieConsent />
      </div>
    );
}
