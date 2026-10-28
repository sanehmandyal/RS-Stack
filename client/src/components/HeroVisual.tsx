import { useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Globe,
  MapPin,
  Megaphone,
  Search,
  Sparkles,
  TrendingUp,
  Activity,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink,
  BarChart3,
  Layers,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServiceNode {
  id: string;
  icon: typeof Globe;
  title: string;
  tag: string;
  url: string;
  category: string;
  headline: string;
  color: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  serviceSlug: string;
  positionCls: string;
  metrics: { value: string; label: string }[];
  chartLabel: string;
  chartStat: string;
  statusText: string;
  features: string[];
}

export function HeroVisual() {
  const reduce = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);
  const [selectedId, setSelectedId] = useState<string>('local-seo');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // 3D tilt tracking for mouse movement
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: -(y / (rect.height / 2)) * 8,
      y: (x / (rect.width / 2)) * 8,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const services: ServiceNode[] = [
    {
      id: 'local-seo',
      icon: Search,
      title: 'Local SEO Dominance',
      tag: 'Rank #1 on Google',
      url: 'rsstack.dev/local-seo',
      category: 'Local Search Engine',
      headline: 'Google Search & Local Rankings',
      color: 'from-blue-600 to-cyan-500',
      accentBg: 'bg-blue-50/70',
      accentBorder: 'border-blue-200/80',
      accentText: 'text-blue-700',
      serviceSlug: '/services/local-seo-services-mohali',
      positionCls: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
      metrics: [
        { value: '#1 Rank', label: 'Google Search' },
        { value: '+480%', label: 'Organic Clicks' },
        { value: '99/100', label: 'Technical SEO' },
      ],
      chartLabel: 'Organic Search Trajectory',
      chartStat: 'Top 100% Keywords In #1 Position',
      statusText: 'High-Intent Search Traffic • Mohali & Global',
      features: ['Local Citations', 'Schema Markup', 'Keyword Ranking'],
    },
    {
      id: 'gbp',
      icon: MapPin,
      title: 'Google Business Profile',
      tag: 'Top 3 Map Pack',
      url: 'rsstack.dev/gbp-optimization',
      category: 'Google Maps Engine',
      headline: 'Google Maps & Local 3-Pack',
      color: 'from-sky-500 to-blue-600',
      accentBg: 'bg-sky-50/70',
      accentBorder: 'border-sky-200/80',
      accentText: 'text-sky-700',
      serviceSlug: '/services/local-seo-services-mohali',
      positionCls: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2',
      metrics: [
        { value: 'Top 3', label: 'Map Pack Rank' },
        { value: '+310%', label: 'Direction Calls' },
        { value: '5.0 ★', label: 'Review Engine' },
      ],
      chartLabel: 'Inquiries via Google Maps',
      chartStat: '+310% Direct Customer Calls',
      statusText: 'Google Maps Verified • Phase 5 Mohali',
      features: ['Geo-Grid Ranking', 'Review Acceleration', 'NAP Consistency'],
    },
    {
      id: 'web-dev',
      icon: Globe,
      title: 'Websites & Web Apps',
      tag: '<1.2s High Speed',
      url: 'rsstack.dev/web-development',
      category: 'Full-Stack Architecture',
      headline: 'Conversion Websites & React Apps',
      color: 'from-blue-600 to-indigo-600',
      accentBg: 'bg-indigo-50/70',
      accentBorder: 'border-indigo-200/80',
      accentText: 'text-indigo-700',
      serviceSlug: '/services/website-development-mohali',
      positionCls: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
      metrics: [
        { value: '<1.0s', label: 'Mobile Load' },
        { value: '100%', label: 'Code Ownership' },
        { value: '99.9%', label: 'Uptime SLA' },
      ],
      chartLabel: 'Core Web Vitals Velocity',
      chartStat: 'Lighthouse Score: 99/100',
      statusText: 'MERN Stack • Fully Responsive • Secure',
      features: ['Bespoke UI/UX', 'SEO-Engineered', 'Sub-Second Speed'],
    },
    {
      id: 'ads',
      icon: Megaphone,
      title: 'Google & Meta Ads',
      tag: '3.8x ROI Scaling',
      url: 'rsstack.dev/performance-ads',
      category: 'Performance Marketing',
      headline: 'High-ROI Ad Campaigns & Leads',
      color: 'from-indigo-600 to-sky-600',
      accentBg: 'bg-purple-50/70',
      accentBorder: 'border-purple-200/80',
      accentText: 'text-purple-700',
      serviceSlug: '/services/google-meta-ads',
      positionCls: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2',
      metrics: [
        { value: '3.8x', label: 'Average ROAS' },
        { value: '-42%', label: 'Cost Per Lead' },
        { value: '14.2%', label: 'Conversion Rate' },
      ],
      chartLabel: 'Paid Acquisition Pipeline',
      chartStat: '3.8x Return On Ad Spend',
      statusText: 'Conversion API Active • Live Leads Flow',
      features: ['Search & Meta Funnels', 'A/B Creative Testing', 'WhatsApp Flow'],
    },
  ];

  const currentService = services.find((s) => s.id === selectedId) || services[0];
  const CurrentIcon = currentService.icon;

  const handleSelectService = (id: string) => {
    setSelectedId(id);
  };

  return (
    <div
      className="relative mx-auto flex aspect-square w-full max-w-[500px] sm:max-w-[560px] items-center justify-center select-none"
      aria-label="Interactive RS Stack Digital Growth Engine"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        handleMouseLeave();
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Ambient background glow & liquid energy aura */}
      <div className="absolute inset-2 sm:inset-4 rounded-full bg-gradient-to-tr from-blue-400/20 via-sky-300/25 to-indigo-400/15 blur-3xl pointer-events-none" />

      {/* ROTATIONAL ORBIT TRACK 1: Outer Marching Ants Circuit with Clickable Orbiting Service Buttons */}
      <div
        className={`relative flex items-center justify-center w-[360px] h-[360px] sm:w-[450px] sm:h-[450px] rounded-full transition-transform duration-700 pointer-events-auto ${
          isPaused ? '[animation-play-state:paused]' : ''
        }`}
        style={{
          animation: reduce ? 'none' : 'spin-slow 38s linear infinite',
        }}
      >
        {/* SVG Marching Ants Circular Track */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="49%"
            fill="none"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="1.5"
            className="marching-ants"
          />
        </svg>

        {/* Orbiting Satellites (Counter-rotating to stay upright and readable) */}
        {services.map((node) => {
          const Icon = node.icon;
          const isSelected = selectedId === node.id;
          const isHovered = hoveredId === node.id;

          return (
            <div
              key={node.id}
              className={`absolute ${node.positionCls} z-30 transition-transform duration-200`}
            >
              <div
                className={`transition-all duration-300 ${
                  isPaused ? '[animation-play-state:paused]' : ''
                }`}
                style={{
                  animation: reduce ? 'none' : 'spin-reverse 38s linear infinite',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleSelectService(node.id)}
                  onMouseEnter={() => setHoveredId(node.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  aria-pressed={isSelected}
                  title={`Click to view ${node.title} live metrics`}
                  className={`group relative flex items-center gap-2.5 rounded-full border px-3.5 py-2 text-xs font-semibold shadow-glass backdrop-blur-xl cursor-pointer transition-all duration-300 active:scale-95 ${
                    isSelected
                      ? 'scale-110 border-blue-500 bg-white shadow-[0_0_25px_rgba(37,99,235,0.35)] ring-2 ring-blue-500/50'
                      : 'border-white/85 bg-white/90 hover:scale-105 hover:bg-white hover:border-blue-300 hover:shadow-glass-hover'
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr ${node.color} text-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-ink leading-tight whitespace-nowrap">{node.title}</span>
                    <span className="text-[10px] font-medium text-primary leading-tight whitespace-nowrap">
                      {isSelected ? '● Active View' : node.tag}
                    </span>
                  </div>
                  <span className="relative flex h-2 w-2">
                    {isSelected ? (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-90" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
                      </>
                    ) : (
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-300 group-hover:bg-blue-400" />
                    )}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ROTATIONAL ORBIT TRACK 2: Inner Counter-Rotating Marching Ants & Energy Orbs */}
      <div
        className={`absolute flex items-center justify-center w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] rounded-full pointer-events-none ${
          isPaused ? '[animation-play-state:paused]' : ''
        }`}
        style={{
          animation: reduce ? 'none' : 'spin-reverse 24s linear infinite',
        }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <circle
            cx="50%"
            cy="50%"
            r="49%"
            fill="none"
            stroke="rgba(2, 132, 199, 0.22)"
            strokeWidth="1.5"
            className="marching-ants-reverse"
          />
        </svg>

        {/* Orbiting Glass Energy Beads */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-300 shadow-[0_0_12px_rgba(59,130,246,0.8)] border border-white" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-2.5 w-2.5 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-400 shadow-[0_0_10px_rgba(14,165,233,0.7)] border border-white" />
      </div>

      {/* Radar Pulse Sweep Effect */}
      <div
        className="absolute w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] rounded-full pointer-events-none opacity-20"
        style={{
          background: 'conic-gradient(from 0deg at 50% 50%, rgba(37,99,235,0.4) 0deg, rgba(37,99,235,0) 60deg, transparent 360deg)',
          animation: reduce ? 'none' : 'radar-sweep 8s linear infinite',
        }}
      />

      {/* CENTRAL 3D INTERACTIVE HUB: Dynamically updates when any button is clicked */}
      <div
        ref={cardRef}
        style={{
          transform: reduce
            ? 'none'
            : `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
        className="relative z-20 w-[280px] sm:w-[330px] rounded-3xl border border-white/95 bg-white/95 p-4 shadow-glass backdrop-blur-2xl transition duration-300 hover:shadow-glass-hover"
      >
        {/* Specular top highlight edge */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent" />

        {/* Browser Top Chrome with dynamic URL */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/90 shadow-xs" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90 shadow-xs" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90 shadow-xs" />
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50/90 px-2.5 py-0.5 text-[10px] font-mono text-slate-600 transition-all">
            <Lock className="h-2.5 w-2.5 text-emerald-600" />
            <span className="truncate max-w-[130px] sm:max-w-[160px]">{currentService.url}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-semibold text-slate-500">Live</span>
          </div>
        </div>

        {/* Dynamic Service Content Body (Smooth Transition on Click) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentService.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="pt-3 space-y-3"
          >
            {/* Header Title & Category matching clicked service */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  {currentService.category}
                </p>
                <h4 className="text-sm font-extrabold text-ink leading-tight">
                  {currentService.headline}
                </h4>
              </div>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr ${currentService.color} text-white shadow-sm`}
              >
                <CurrentIcon className="h-4 w-4" />
              </div>
            </div>

            {/* 3 Real-time Service Metrics */}
            <div className="grid grid-cols-3 gap-2">
              {currentService.metrics.map((metric, i) => (
                <div
                  key={i}
                  className={`rounded-xl border ${currentService.accentBorder} ${currentService.accentBg} p-2 text-center transition-all`}
                >
                  <p className={`text-xs font-extrabold ${currentService.accentText}`}>
                    {metric.value}
                  </p>
                  <p className="text-[9px] font-medium text-slate-500 truncate">{metric.label}</p>
                </div>
              ))}
            </div>

            {/* Dynamic Interactive Chart matching clicked service */}
            <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-slate-50/80 p-2.5">
              <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 mb-1">
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-emerald-600" /> {currentService.chartLabel}
                </span>
                <span className="font-bold text-emerald-600 text-[10px]">{currentService.chartStat}</span>
              </div>

              {/* Dynamic SVG Waveform */}
              <svg viewBox="0 0 100 32" className="w-full h-8 overflow-visible">
                <defs>
                  <linearGradient id={`grad-${currentService.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {currentService.id === 'local-seo' && (
                  <>
                    <path d="M0 28 Q 20 25, 40 18 T 75 8 T 100 3 L 100 32 L 0 32 Z" fill={`url(#grad-${currentService.id})`} />
                    <path d="M0 28 Q 20 25, 40 18 T 75 8 T 100 3" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="100" cy="3" r="3" fill="#2563EB" className="animate-ping origin-center" />
                    <circle cx="100" cy="3" r="2" fill="#FFFFFF" stroke="#2563EB" strokeWidth="1.5" />
                  </>
                )}

                {currentService.id === 'gbp' && (
                  <>
                    <path d="M0 24 Q 15 15, 30 20 T 60 10 T 85 4 T 100 2 L 100 32 L 0 32 Z" fill={`url(#grad-${currentService.id})`} />
                    <path d="M0 24 Q 15 15, 30 20 T 60 10 T 85 4 T 100 2" fill="none" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="100" cy="2" r="3" fill="#0284C7" className="animate-ping origin-center" />
                    <circle cx="100" cy="2" r="2" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
                  </>
                )}

                {currentService.id === 'web-dev' && (
                  <>
                    <path d="M0 20 Q 25 5, 50 12 T 80 4 T 100 2 L 100 32 L 0 32 Z" fill={`url(#grad-${currentService.id})`} />
                    <path d="M0 20 Q 25 5, 50 12 T 80 4 T 100 2" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="100" cy="2" r="3" fill="#4F46E5" className="animate-ping origin-center" />
                    <circle cx="100" cy="2" r="2" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="1.5" />
                  </>
                )}

                {currentService.id === 'ads' && (
                  <>
                    <path d="M0 26 Q 20 22, 45 16 T 70 8 T 100 4 L 100 32 L 0 32 Z" fill={`url(#grad-${currentService.id})`} />
                    <path d="M0 26 Q 20 22, 45 16 T 70 8 T 100 4" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="100" cy="4" r="3" fill="#7C3AED" className="animate-ping origin-center" />
                    <circle cx="100" cy="4" r="2" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="1.5" />
                  </>
                )}
              </svg>
            </div>

            {/* Click to Explore Service Deep Link */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 truncate max-w-[170px]">
                <Activity className="h-3 w-3 text-emerald-500 animate-pulse shrink-0" />
                <span className="truncate">{currentService.statusText}</span>
              </div>

              <Link
                to={currentService.serviceSlug}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:text-blue-800 hover:underline shrink-0"
              >
                Explore <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
