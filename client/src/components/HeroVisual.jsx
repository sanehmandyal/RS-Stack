import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Coins,
  Flame,
  Globe2,
  MapPin,
  MessageCircle,
  RotateCw,
  ShoppingBag,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ORBIT_NODES = [
  {
    id: 'local-seo',
    angle: 0,
    icon: MapPin,
    title: 'Local SEO & Maps',
    subtitle: 'Rank #1 on Google Map Pack',
    badge: 'Hyperlocal Growth',
    metric: '#1 Map Pack',
    color: 'from-red-600 to-orange-500',
    description: 'Direct customer calls from ready-to-buy local searchers across Mohali, Chandigarh & Tricity.',
    deliverable: 'Google Profile Optimization + Local Citation Network',
  },
  {
    id: 'fast-web',
    angle: 60,
    icon: Zap,
    title: '0.4s Fast Platforms',
    subtitle: 'Sub-second mobile speed',
    badge: 'Core Web Vitals',
    metric: '0.4s Speed',
    color: 'from-orange-500 to-amber-500',
    description: 'Engineered with React 18 for instantaneous mobile loads that slash bounce rates by over 50%.',
    deliverable: 'Clean MERN Architecture + Zero CMS Bloat',
  },
  {
    id: 'whatsapp-engine',
    angle: 120,
    icon: MessageCircle,
    title: 'WhatsApp Engine',
    subtitle: 'Instant lead routing',
    badge: 'Conversion Magnet',
    metric: '3x Fast Leads',
    color: 'from-red-500 to-rose-600',
    description: 'Route high-intent inquiries straight into WhatsApp so you close customers before competitors reply.',
    deliverable: '1-Click Direct WhatsApp Booking Concierge',
  },
  {
    id: 'b2b-rfq',
    angle: 180,
    icon: Briefcase,
    title: 'B2B Wholesale Hub',
    subtitle: 'Self-serve quotation engine',
    badge: 'Industrial Pipeline',
    metric: 'Auto RFQ Quotes',
    color: 'from-orange-600 to-red-600',
    description: 'Replace manual PDF quoting with automated dealer pricing tiers, GST quotation PDFs, and ERP order sync.',
    deliverable: 'Role-Based Access + Instant GST Quotes',
  },
  {
    id: 'direct-stays',
    angle: 240,
    icon: Coins,
    title: 'Zero-OTA Booking',
    subtitle: 'Direct guest reservation',
    badge: 'Boutique Stays',
    metric: 'Save 18% Fees',
    color: 'from-amber-500 to-orange-600',
    description: 'Bypass hefty 18% commissions to MakeMyTrip & Booking.com with direct guest reservation software.',
    deliverable: 'Live Calendar Sync + Advance Payments',
  },
  {
    id: 'd2c-subscription',
    angle: 300,
    icon: ShoppingBag,
    title: 'D2C Subscription',
    subtitle: 'Recurring revenue engine',
    badge: 'Quick-Commerce',
    metric: '74% Repeat Sales',
    color: 'from-red-600 via-orange-500 to-amber-500',
    description: 'Automated recurring UPI payments and hyperlocal dispatch routes for specialized regional brands.',
    deliverable: 'UPI Autopay + Real-time Route Tracking',
  },
];

export function HeroVisual() {
  const [activeId, setActiveId] = useState('local-seo');
  const [isPaused, setIsPaused] = useState(false);

  const active = ORBIT_NODES.find((n) => n.id === activeId) || ORBIT_NODES[0];
  const ActiveIcon = active.icon;

  // Auto-cycle through nodes every 4.5 seconds if not paused by hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveId((currentId) => {
        const currentIndex = ORBIT_NODES.findIndex((n) => n.id === currentId);
        const nextIndex = (currentIndex + 1) % ORBIT_NODES.length;
        return ORBIT_NODES[nextIndex].id;
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

        {/* Outer Pulsing Wave Ring 1 */}
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
          {/* Subtle radar beacon pip */}
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 shadow-sm" />
        </motion.div>

        {/* Rotating Circular Orbit System containing the 6 Business Nodes */}
        <motion.div
          animate={{ rotate: isPaused ? undefined : 360 }}
          transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-6 sm:inset-8 flex items-center justify-center"
        >
          {ORBIT_NODES.map((node) => {
            const rad = (node.angle * Math.PI) / 180;
            // Radius ~ 150px on standard desktop, 125px on mobile
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
                {/* Counter-rotation on node so icon stays upright */}
                <motion.div
                  animate={{ rotate: isPaused ? undefined : -360 }}
                  transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveId(node.id)}
                    aria-label={`Explore business idea: ${node.title}`}
                    className={`group relative flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'h-13 w-13 sm:h-14 sm:w-14 bg-gradient-to-tr from-red-600 to-orange-500 text-white shadow-lg ring-4 ring-orange-200 scale-110 z-20'
                        : 'h-10 w-10 sm:h-11 sm:w-11 bg-white/95 text-slate-700 border-2 border-orange-200/90 shadow-sm hover:border-orange-400 hover:scale-105 z-10'
                    }`}
                  >
                    <NodeIcon className={`transition duration-200 ${isSelected ? 'h-5 w-5 sm:h-6 sm:w-6' : 'h-4 w-4 text-slate-700 group-hover:text-orange-600'}`} />

                    {/* Compact Node Label Tag */}
                    <span
                      className={`absolute -bottom-5 sm:-bottom-5.5 whitespace-nowrap text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-md transition-all duration-200 pointer-events-none ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white/90 text-slate-600 border border-slate-200/80 group-hover:text-slate-900 group-hover:border-orange-300'
                      }`}
                    >
                      {node.title.split(' ')[0]}
                    </span>
                  </button>
                </motion.div>
              </div>
            );
          })}
        </motion.div>

        {/* Central Core Circle (Active Business Idea Showcase) */}
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

        {/* Floating Verified Trust Pills */}
        <div className="absolute top-2 left-2 hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-xs backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-red-600 ring-2 ring-orange-200 animate-pulse" />
          <span>Continuous Orbit Engine</span>
        </div>

        <div className="absolute bottom-2 right-2 hidden sm:inline-flex items-center gap-1 rounded-lg border border-orange-200 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-xs backdrop-blur-sm">
          <Sparkles className="h-3 w-3 text-orange-500" />
          <span>Interactive Node System</span>
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
            to={`/contact?blueprint=${encodeURIComponent(active.title)}`}
            className="btn btn-sm btn-primary whitespace-nowrap shrink-0 self-end sm:self-center shadow-xs"
          >
            Launch This Idea <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
