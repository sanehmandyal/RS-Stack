import { motion, useReducedMotion } from 'framer-motion';
import { Globe, MapPin, Megaphone, Search } from 'lucide-react';

/**
 * Decorative hero composition. The widgets are illustrative only and deliberately contain no numbers,
 * so nothing here can be mistaken for real customer analytics.
 */
export function HeroVisual() {
  const reduce = useReducedMotion();
  const float = (d = 0) => (reduce ? {} : { animate: { y: [0, -10, 0] }, transition: { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: d } });
  const chip = (Icon: typeof Globe, label: string, cls: string, d: number) => (
    <motion.div {...float(d)} className={`glass-strong absolute flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${cls}`}>
      <Icon className="h-4 w-4 text-secondary" aria-hidden /> {label}
    </motion.div>
  );
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-lg" aria-hidden>
      <div className="absolute inset-6 rounded-3xl bg-gradient-to-br from-primary/30 to-secondary/10 blur-3xl" />
      <div className="glass-strong absolute inset-x-4 inset-y-8 overflow-hidden rounded-2xl">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" /><span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-3 h-4 flex-1 rounded-md bg-white/5" />
        </div>
        <div className="space-y-3 p-4">
          <div className="h-5 w-2/3 rounded-md bg-white/15" />
          <div className="h-3 w-5/6 rounded bg-white/8" /><div className="h-3 w-3/5 rounded bg-white/8" />
          <div className="h-8 w-28 rounded-lg bg-primary/80" />
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[0, 1, 2].map((i) => <div key={i} className="h-20 rounded-xl border border-white/10 bg-white/[0.04]" />)}
          </div>
          <div className="flex h-16 items-end gap-1.5 pt-2">
            {[30, 48, 36, 60, 52, 74, 66].map((h, i) => <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-secondary/60" style={{ height: `${h}%` }} />)}
          </div>
        </div>
      </div>
      {chip(Search, 'Local SEO', '-left-1 top-2 sm:-left-4', 0)}
      {chip(MapPin, 'Google Business Profile', '-right-1 top-16 sm:-right-4', 1.2)}
      {chip(Megaphone, 'Google & Meta Ads', '-left-1 bottom-10 sm:-left-6', 2.2)}
      {chip(Globe, 'Websites & Apps', 'right-2 bottom-2 sm:-right-2', 3)}
    </div>
  );
}
