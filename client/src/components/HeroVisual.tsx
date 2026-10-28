import { useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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
} from 'lucide-react';

interface OrbitNodeProps {
  icon: typeof Globe;
  title: string;
  tag: string;
  color: string;
  badgeCls?: string;
  positionCls: string;
}

export function HeroVisual() {
  const reduce = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);

  // 3D tilt tracking for mouse movement
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: -(y / (rect.height / 2)) * 10,
      y: (x / (rect.width / 2)) * 10,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const orbitNodes: OrbitNodeProps[] = [
    {
      icon: Search,
      title: 'Local SEO Dominance',
      tag: 'Rank #1 on Google',
      color: 'from-blue-600 to-cyan-500',
      positionCls: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
    },
    {
      icon: MapPin,
      title: 'Google Business Profile',
      tag: 'Top 3 Map Pack',
      color: 'from-sky-500 to-blue-600',
      positionCls: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2',
    },
    {
      icon: Globe,
      title: 'Websites & Web Apps',
      tag: '<1.2s High Speed',
      color: 'from-blue-600 to-indigo-600',
      positionCls: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
    },
    {
      icon: Megaphone,
      title: 'Google & Meta Ads',
      tag: '3.8x ROI Scaling',
      color: 'from-indigo-600 to-sky-600',
      positionCls: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2',
    },
  ];

  return (
    <div
      className="relative mx-auto flex aspect-square w-full max-w-[480px] sm:max-w-[540px] items-center justify-center select-none"
      aria-hidden="true"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        handleMouseLeave();
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Ambient background glow & liquid energy aura */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-blue-400/20 via-sky-300/25 to-indigo-400/15 blur-3xl pointer-events-none" />

      {/* ROTATIONAL ORBIT TRACK 1: Outer Marching Ants Circuit with Orbiting Services */}
      <div
        className={`relative flex items-center justify-center w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full transition-transform duration-700 pointer-events-auto ${
          isPaused ? '[animation-play-state:paused]' : ''
        }`}
        style={{
          animation: reduce ? 'none' : 'spin-slow 36s linear infinite',
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
        {orbitNodes.map((node, idx) => {
          const Icon = node.icon;
          const isActive = activeNode === node.title;

          return (
            <div
              key={node.title}
              className={`absolute ${node.positionCls} z-30 transition-transform duration-200`}
            >
              <div
                className={`transition-all duration-300 ${
                  isPaused ? '[animation-play-state:paused]' : ''
                }`}
                style={{
                  animation: reduce ? 'none' : 'spin-reverse 36s linear infinite',
                }}
              >
                <div
                  onMouseEnter={() => setActiveNode(node.title)}
                  onMouseLeave={() => setActiveNode(null)}
                  className={`group relative flex items-center gap-2.5 rounded-full border px-3.5 py-2 text-xs font-semibold shadow-glass backdrop-blur-xl cursor-pointer transition-all duration-300 ${
                    isActive
                      ? 'scale-110 border-blue-400 bg-white shadow-glass-hover ring-2 ring-blue-400/40'
                      : 'border-white/80 bg-white/85 hover:scale-105 hover:bg-white hover:border-blue-300'
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr ${node.color} text-white shadow-sm transition-transform duration-300 group-hover:rotate-12`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-ink leading-tight whitespace-nowrap">{node.title}</span>
                    <span className="text-[10px] font-medium text-primary leading-tight whitespace-nowrap">{node.tag}</span>
                  </div>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ROTATIONAL ORBIT TRACK 2: Inner Counter-Rotating Marching Ants & Energy Orbs */}
      <div
        className={`absolute flex items-center justify-center w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] rounded-full pointer-events-none ${
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

      {/* CENTRAL 3D INTERACTIVE HUB: The RS Stack Growth Engine */}
      <div
        ref={cardRef}
        style={{
          transform: reduce
            ? 'none'
            : `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
        className="relative z-20 w-[270px] sm:w-[320px] rounded-3xl border border-white/95 bg-white/90 p-4 shadow-glass backdrop-blur-2xl transition duration-300 hover:shadow-glass-hover"
      >
        {/* Specular top highlight edge */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent" />

        {/* Browser Top Chrome */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/90 shadow-xs" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90 shadow-xs" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90 shadow-xs" />
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50/90 px-2.5 py-0.5 text-[10px] font-mono text-slate-600">
            <Lock className="h-2.5 w-2.5 text-emerald-600" />
            <span>rsstack.dev/engine</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-semibold text-slate-500">Live</span>
          </div>
        </div>

        {/* Growth Engine Metrics Body */}
        <div className="pt-3 space-y-3">
          {/* Header Title with animated Sparkle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">RS Stack Engine</p>
              <h4 className="text-sm font-extrabold text-ink">Growth & Local Visibility</h4>
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-50 text-primary border border-blue-100">
              <Zap className="h-4 w-4" />
            </div>
          </div>

          {/* Real-time Performance Pillars */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-blue-100/80 bg-blue-50/50 p-2 text-center">
              <p className="text-xs font-bold text-primary">#1</p>
              <p className="text-[9px] font-medium text-slate-500">Google Maps</p>
            </div>
            <div className="rounded-xl border border-sky-100/80 bg-sky-50/50 p-2 text-center">
              <p className="text-xs font-bold text-sky-700">&lt;1.0s</p>
              <p className="text-[9px] font-medium text-slate-500">Core Vitals</p>
            </div>
            <div className="rounded-xl border border-indigo-100/80 bg-indigo-50/50 p-2 text-center">
              <p className="text-xs font-bold text-indigo-700">3.8x</p>
              <p className="text-[9px] font-medium text-slate-500">ROAS Scale</p>
            </div>
          </div>

          {/* Animated SVG Traffic & Revenue Curve */}
          <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-slate-50/80 p-2.5">
            <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 mb-1">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-600" /> Continuous Pipeline
              </span>
              <span className="font-bold text-emerald-600">+340% YoY</span>
            </div>

            {/* Rising SVG Wave */}
            <svg viewBox="0 0 100 32" className="w-full h-8 overflow-visible">
              <defs>
                <linearGradient id="gradientWave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0 26 Q 20 24, 35 16 T 70 10 T 100 4 L 100 32 L 0 32 Z"
                fill="url(#gradientWave)"
              />
              <path
                d="M0 26 Q 20 24, 35 16 T 70 10 T 100 4"
                fill="none"
                stroke="#2563EB"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="100" cy="4" r="3" fill="#2563EB" className="animate-ping origin-center" />
              <circle cx="100" cy="4" r="2" fill="#FFFFFF" stroke="#2563EB" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Live System Status Pill */}
          <div className="flex items-center justify-between rounded-xl bg-slate-900 px-3 py-1.5 text-[10px] text-white">
            <div className="flex items-center gap-1.5">
              <Activity className="h-3 w-3 text-emerald-400 animate-pulse" />
              <span className="font-mono text-slate-200">Phase 5 Mohali & Global</span>
            </div>
            <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-300">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
