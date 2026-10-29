import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Briefcase,
  Check,
  ChevronLeft,
  ChevronRight,
  Coins,
  Cpu,
  Flame,
  Layers,
  Play,
  RotateCw,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Truck,
  Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const BUSINESS_IDEAS = [
  {
    id: 'local-services',
    icon: Truck,
    category: 'Hyperlocal Service Engine',
    title: 'On-Demand Service Booking Hub',
    tagline: 'Direct customer bookings with automated WhatsApp technician routing.',
    badge: 'High Local Demand',
    metric: '+320% Bookings',
    metricSub: 'Bypasses aggregators & commissions',
    projectedRevenue: '₹2.5L – ₹6.0L / mo',
    pipeline: [
      { step: 'Map Pack #1', detail: 'Local Google SEO' },
      { step: '30s Booking', detail: 'Smart price quote' },
      { step: 'Route WhatsApp', detail: 'Instant team dispatch' },
    ],
    growthLevers: [
      'Keep 100% profit (Zero commission to aggregators)',
      'Instant quote calculator with live slot selection',
      'Automated review flywheel to rank #1 on Google Maps',
    ],
    ctaTopic: 'Hyperlocal Service Booking Platform',
  },
  {
    id: 'b2b-wholesale',
    icon: Briefcase,
    category: 'B2B Wholesale & Supply',
    title: 'Self-Serve RFQ & Dealer Quotation Portal',
    tagline: 'Automate tier pricing, instant GST quotation PDFs, and ERP order flows.',
    badge: 'Industrial & B2B',
    metric: '4.8x Sales Speed',
    metricSub: 'Replaces manual spreadsheet quotes',
    projectedRevenue: '₹15L – ₹50L / mo',
    pipeline: [
      { step: 'Dealer Catalog', detail: 'Tiered wholesale rates' },
      { step: 'Instant RFQ', detail: 'Auto GST PDF quote' },
      { step: 'UPI / NEFT Link', detail: 'Direct bank settlement' },
    ],
    growthLevers: [
      'Role-based dealer login with customized wholesale discounts',
      'Automated GST invoice generation in under 2 seconds',
      'Direct synchronization with Tally / custom backend APIs',
    ],
    ctaTopic: 'B2B Wholesale Quotation Portal',
  },
  {
    id: 'hospitality',
    icon: Coins,
    category: 'Boutique Stays & Resorts',
    title: 'Zero-OTA Commission Booking Concierge',
    tagline: 'Direct luxury guest reservations with integrated WhatsApp concierge.',
    badge: 'Tourism & Stays',
    metric: 'Save 18% OTA Fees',
    metricSub: '100% direct guest relationship',
    projectedRevenue: '₹4.0L – ₹12L / mo',
    pipeline: [
      { step: '4K Experience', detail: 'Visual tour & reviews' },
      { step: 'Live Calendar', detail: 'Real-time sync' },
      { step: 'Direct Concierge', detail: 'WhatsApp payment' },
    ],
    growthLevers: [
      'Eliminates 18-22% platform cut taken by Booking.com & MMT',
      'Direct WhatsApp concierge handles customized guest requests',
      'Upsell local excursions, dining passes, and spa packages',
    ],
    ctaTopic: 'Direct Boutique Booking Platform',
  },
  {
    id: 'healthcare',
    icon: Stethoscope,
    category: 'Healthcare & Wellness',
    title: 'Clinic Intake & Smart Appointment System',
    tagline: 'Pre-paid patient appointments with paperless intake and reminder loops.',
    badge: 'Clinics & Doctors',
    metric: '-65% No-Shows',
    metricSub: 'Automated WhatsApp confirmation',
    projectedRevenue: '₹3.0L – ₹8.5L / mo',
    pipeline: [
      { step: 'Specialty Finder', detail: 'Doctor schedule search' },
      { step: 'Digital Intake', detail: 'Paperless health form' },
      { step: 'WhatsApp Loop', detail: 'Reminders & follow-ups' },
    ],
    growthLevers: [
      'Pre-paid appointment booking ends costly patient no-shows',
      'Paperless mobile intake form ready before patient walks in',
      'Automated review prompt sends patients directly to Google rating',
    ],
    ctaTopic: 'Healthcare Clinic Intake System',
  },
  {
    id: 'd2c-subscription',
    icon: ShoppingBag,
    category: 'D2C Brand & Subscription',
    title: 'Regional Quick-Commerce & Box Subscription',
    tagline: 'Deliver fresh regional goods with automated recurring UPI subscriptions.',
    badge: 'Fast-Moving D2C',
    metric: '74% Repeat Rate',
    metricSub: 'Automated recurring subscriptions',
    projectedRevenue: '₹5.0L – ₹18L / mo',
    pipeline: [
      { step: 'Taste Profile', detail: 'Quick preference quiz' },
      { step: 'UPI Autopay', detail: 'Automated weekly cycle' },
      { step: 'Hyperlocal Run', detail: 'Same-day route tracking' },
    ],
    growthLevers: [
      'Predictable recurring monthly revenue via UPI auto-debit',
      'Zero marketplace listing commissions or hidden deductions',
      'Real-time WhatsApp tracking and delivery dispatch alerts',
    ],
    ctaTopic: 'D2C Subscription Quick-Commerce',
  },
];

export function HeroVisual() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const autoPlayTimerRef = useRef(null);

  const current = BUSINESS_IDEAS[index];
  const IconComponent = current.icon;

  const nextIdea = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % BUSINESS_IDEAS.length);
  };

  const prevIdea = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + BUSINESS_IDEAS.length) % BUSINESS_IDEAS.length);
  };

  // Auto-play cycling with pause on hover
  useEffect(() => {
    if (isPaused) return;
    autoPlayTimerRef.current = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % BUSINESS_IDEAS.length);
    }, 6000);

    return () => clearInterval(autoPlayTimerRef.current);
  }, [isPaused, index]);

  return (
    <div
      className="w-full max-w-xl mx-auto lg:max-w-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative rounded-2xl border-2 border-orange-200/90 bg-white shadow-md overflow-hidden flex flex-col">
        {/* Animated Top Header Strip */}
        <div className="border-b border-orange-100 bg-gradient-to-r from-red-50/70 via-orange-50/60 to-amber-50/70 px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600 ring-2 ring-orange-200" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-orange-600" />
              Live Business Idea Blueprints
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
              Idea {index + 1} of {BUSINESS_IDEAS.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevIdea}
                aria-label="Previous business idea"
                className="h-6 w-6 rounded-md border border-slate-200 bg-white hover:bg-orange-50 hover:border-orange-300 flex items-center justify-center text-slate-700 transition"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={nextIdea}
                aria-label="Next business idea"
                className="h-6 w-6 rounded-md border border-slate-200 bg-white hover:bg-orange-50 hover:border-orange-300 flex items-center justify-center text-slate-700 transition"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar (Auto-Cycles every 6s) */}
        <div className="h-1 w-full bg-orange-100 overflow-hidden">
          <motion.div
            key={index}
            initial={{ width: '0%' }}
            animate={{ width: isPaused ? '100%' : '100%' }}
            transition={{ duration: isPaused ? 0 : 6, ease: 'linear' }}
            className="h-full bg-gradient-to-r from-red-600 to-orange-500"
          />
        </div>

        {/* Interactive Industry Idea Selector Pills */}
        <div className="flex items-center gap-1 overflow-x-auto p-2 bg-slate-50/90 border-b border-slate-100 no-scrollbar">
          {BUSINESS_IDEAS.map((idea, i) => {
            const isSelected = i === index;
            return (
              <button
                key={idea.id}
                type="button"
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200'
                }`}
              >
                <span>{idea.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Animated Idea Body with Slide Transitions */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={current.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 24 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-3.5"
            >
              {/* Category & Impact Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white shadow-xs shrink-0">
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                      {current.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                      {current.title}
                    </h3>
                  </div>
                </div>

                <div className="rounded-lg border border-orange-200 bg-gradient-to-br from-red-50 to-orange-50 px-2.5 py-1 text-right shrink-0">
                  <p className="text-xs sm:text-sm font-black text-red-700 leading-none">
                    {current.metric}
                  </p>
                  <p className="text-[10px] text-orange-800 font-semibold mt-0.5">
                    {current.metricSub}
                  </p>
                </div>
              </div>

              {/* Tagline */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {current.tagline}
              </p>

              {/* Animated 3-Step Technology Architecture Pipeline */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
                  <Cpu className="h-3 w-3 text-orange-600" />
                  Automated Growth Architecture:
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {current.pipeline.map((p, idx) => (
                    <div key={p.step} className="relative">
                      <div className="rounded-lg border border-slate-200/90 bg-white p-2 shadow-2xs h-full flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-slate-900 block truncate">
                          {p.step}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium block truncate mt-0.5">
                          {p.detail}
                        </span>
                      </div>
                      {idx < 2 && (
                        <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 text-orange-400 z-10 font-black text-xs">
                          →
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Growth & Monetization Levers */}
              <div className="space-y-1.5 pt-0.5">
                {current.growthLevers.map((lever) => (
                  <div key={lever} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="h-4 w-4 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="font-medium text-slate-800">{lever}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Action Row */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={nextIdea}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-orange-600 transition group"
            >
              <RotateCw className="h-3.5 w-3.5 text-orange-500 transition group-hover:rotate-180 duration-300" />
              <span>Shuffle Next Idea</span>
            </button>

            <Link
              to={`/contact?interest=${encodeURIComponent(current.ctaTopic)}`}
              className="btn btn-sm btn-primary shadow-xs"
            >
              Build This Business Idea <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
