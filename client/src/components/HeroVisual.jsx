import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Globe2,
  HardDrive,
  Link2,
  MapPin,
  Search,
  Server,
  Share2,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ORBIT_SERVICES = [
  {
    id: 'website-creation',
    angle: 0,
    icon: Globe2,
    title: 'Website Creation',
    shortLabel: 'Websites',
    subtitle: 'Responsive modern business sites',
    badge: 'Design & Code',
    metric: 'Sub-0.5s Speed',
    description: 'Custom, mobile-responsive business websites built with React 18, high-speed architecture, and direct WhatsApp inquiry buttons.',
    deliverable: 'Custom Web Design + Mobile-First Code Ownership',
    ctaTopic: 'Website Creation Services',
  },
  {
    id: 'local-seo',
    angle: 51.4,
    icon: MapPin,
    title: 'Local Page SEO',
    shortLabel: 'Local SEO',
    subtitle: 'Google Map Pack rankings',
    badge: 'Nearby Search',
    metric: '#1 Map Pack',
    description: 'Geo-targeted landing pages and Google Business Profile optimization to capture ready-to-buy customers in your area.',
    deliverable: 'Google Map Pack Dominance + Geo Landing Pages',
    ctaTopic: 'Local Page SEO Services',
  },
  {
    id: 'on-page-seo',
    angle: 102.9,
    icon: Search,
    title: 'On-Page SEO',
    shortLabel: 'On-Page',
    subtitle: 'Technical tags & speed architecture',
    badge: 'Search Engine Tuning',
    metric: '100% SEO Score',
    description: 'Complete optimization of title tags, meta descriptions, LocalBusiness schema markup, heading structure, and Core Web Vitals.',
    deliverable: 'Schema Markup + Speed Optimization + Meta Tags',
    ctaTopic: 'On-Page SEO Optimization',
  },
  {
    id: 'off-page-seo',
    angle: 154.3,
    icon: Link2,
    title: 'Off-Page SEO',
    shortLabel: 'Off-Page',
    subtitle: 'Authority backlinks & citations',
    badge: 'Domain Authority',
    metric: 'High DA Links',
    description: 'Ethical, high-authority backlink outreach, relevant guest citations, and digital brand mentions that push your rankings to the top.',
    deliverable: 'Authoritative Backlinks + Digital PR Mentions',
    ctaTopic: 'Off-Page SEO & Backlinks',
  },
  {
    id: 'google-ads',
    angle: 205.7,
    icon: Target,
    title: 'Google Ads Handle',
    shortLabel: 'Google Ads',
    subtitle: 'PPC & high-ROI search campaigns',
    badge: 'Immediate Inbound',
    metric: 'Direct Calls Today',
    description: 'Targeted Google Search & Call Ads campaigns that put your business in front of customers searching with high buying intent right now.',
    deliverable: 'Campaign Setup + Negative Keywords + Conversion Tracking',
    ctaTopic: 'Google Ads Management',
  },
  {
    id: 'domain-hosting',
    angle: 257.1,
    icon: Server,
    title: 'Domain & Hosting',
    shortLabel: 'Domain & Hosting',
    subtitle: 'Fast cloud servers & free SSL',
    badge: 'Cloud Infrastructure',
    metric: '99.9% Uptime',
    description: 'Domain registration, lightning-fast secure cloud hosting, free SSL security certificates, DNS configuration, and corporate email setup.',
    deliverable: 'High-Speed Cloud Hosting + Free SSL & DNS Setup',
    ctaTopic: 'Domain Registration & Cloud Hosting',
  },
  {
    id: 'business-listing',
    angle: 308.6,
    icon: Building2,
    title: 'Directory & Maps Listing',
    shortLabel: 'Listings',
    subtitle: 'All major local directories',
    badge: 'Citations & Maps',
    metric: '50+ Verified Portals',
    description: 'Complete business verification and listing on Google Maps, Apple Maps, Bing Places, Justdial, and top local business directories.',
    deliverable: 'Google & Apple Maps Listing + Citation Sync',
    ctaTopic: 'Business Directory & Maps Listing',
  },
];

export function HeroVisual() {
  const [activeId, setActiveId] = useState('website-creation');
  const [isPaused, setIsPaused] = useState(false);

  const active = ORBIT_SERVICES.find((n) => n.id === activeId) || ORBIT_SERVICES[0];
  const ActiveIcon = active.icon;

  // Auto-cycle through the 7 services every 4.5 seconds if not paused by hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveId((currentId) => {
        const currentIndex = ORBIT_SERVICES.findIndex((n) => n.id === currentId);
        const nextIndex = (currentIndex + 1) % ORBIT_SERVICES.length;
        return ORBIT_SERVICES[nextIndex].id;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div
      className="relative w-full max-w-xl mx-auto flex flex-col items-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Circle Animation Stage */}
      <div className="relative w-full max-w-[420px] sm:max-w-[460px] aspect-square flex items-center justify-center">
        {/* Soft Ambient Radial Heatmap */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-600/10 via-orange-500/15 to-amber-500/10 blur-2xl pointer-events-none" />

        {/* Outer Pulsing Wave Ring */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-2 sm:inset-4 rounded-full border border-orange-200/60 pointer-events-none"
        />

        {/* Outer Orbit Track Circle */}
        <div className="absolute inset-6 sm:inset-8 rounded-full border-2 border-dashed border-orange-300/60" />

        {/* Inner Counter-Rotating Orbit Track */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-16 sm:inset-20 rounded-full border border-red-200/60 pointer-events-none"
        >
          {/* Radar beacon pip */}
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 shadow-sm" />
        </motion.div>

        {/* Rotating Circular Orbit System containing the 7 Services */}
        <motion.div
          animate={{ rotate: isPaused ? undefined : 360 }}
          transition={{ duration: 46, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-6 sm:inset-8 flex items-center justify-center"
        >
          {ORBIT_SERVICES.map((node) => {
            const NodeIcon = node.icon;
            const isSelected = node.id === activeId;

            return (
              <div
                key={node.id}
                className="absolute flex items-center justify-center"
                style={{
                  transform: `rotate(${node.angle}deg) translate(clamp(115px, 28vw, 158px)) rotate(-${node.angle}deg)`,
                }}
              >
                {/* Counter-rotation so node icon stays upright */}
                <motion.div
                  animate={{ rotate: isPaused ? undefined : -360 }}
                  transition={{ duration: 46, repeat: Infinity, ease: 'linear' }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveId(node.id)}
                    aria-label={`Explore service: ${node.title}`}
                    className={`group relative flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'h-12 w-12 sm:h-13 sm:w-13 bg-gradient-to-tr from-red-600 to-orange-500 text-white shadow-lg ring-4 ring-orange-200 scale-110 z-20'
                        : 'h-9 w-9 sm:h-10 sm:w-10 bg-white/95 text-slate-700 border-2 border-orange-200/90 shadow-sm hover:border-orange-400 hover:scale-105 z-10'
                    }`}
                  >
                    <NodeIcon className={`transition duration-200 ${isSelected ? 'h-5 w-5 sm:h-6 sm:w-6' : 'h-4 w-4 text-slate-700 group-hover:text-orange-600'}`} />

                    {/* Compact Node Label Tag */}
                    <span
                      className={`absolute -bottom-5 sm:-bottom-5.5 whitespace-nowrap text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md transition-all duration-200 pointer-events-none ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white/90 text-slate-600 border border-slate-200/80 group-hover:text-slate-900 group-hover:border-orange-300'
                      }`}
                    >
                      {node.shortLabel}
                    </span>
                  </button>
                </motion.div>
              </div>
            );
          })}
        </motion.div>

        {/* Central Core Circle (Active Service Showcase) */}
        <div className="relative z-10 h-32 w-32 sm:h-36 sm:w-36 rounded-full bg-white/95 backdrop-blur-md border-2 border-orange-300/80 shadow-md flex flex-col items-center justify-center p-2.5 text-center">
          {/* Animated Core Glow Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-500/10 to-orange-500/10 animate-pulse pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col items-center justify-center"
            >
              <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center text-white shadow-2xs mb-1">
                <ActiveIcon className="h-3.5 w-3.5" />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 leading-none">
                {active.badge}
              </span>

              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 mt-1 leading-tight line-clamp-1">
                {active.title}
              </h4>

              <span className="mt-1 inline-flex items-center rounded-md bg-gradient-to-r from-red-50 to-orange-50 px-2 py-0.5 text-[10px] font-black text-red-700 border border-orange-200/80">
                {active.metric}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Badges */}
        <div className="absolute top-2 left-2 hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-xs backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-red-600 ring-2 ring-orange-200 animate-pulse" />
          <span>7 Core Offerings</span>
        </div>

        <div className="absolute bottom-2 right-2 hidden sm:inline-flex items-center gap-1 rounded-lg border border-orange-200 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-xs backdrop-blur-sm">
          <Sparkles className="h-3 w-3 text-orange-500" />
          <span>Tap Node to Inspect</span>
        </div>
      </div>

      {/* Dynamic Detail Card Below Circle */}
      <div className="w-full mt-2 rounded-xl border border-orange-200 bg-white p-3.5 sm:p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-start gap-2.5">
            <span className="h-6 w-6 rounded-md bg-gradient-to-tr from-red-600 to-orange-600 text-white flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
              ✓
            </span>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                {active.title}: <span className="text-slate-600 font-normal">{active.description}</span>
              </p>
              <p className="text-[11px] font-semibold text-orange-700 mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-orange-600" /> {active.deliverable}
              </p>
            </div>
          </div>

          <Link
            to={`/contact?service=${encodeURIComponent(active.title)}`}
            className="btn btn-sm btn-primary whitespace-nowrap shrink-0 self-end sm:self-center shadow-xs"
          >
            Get a Quote <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
