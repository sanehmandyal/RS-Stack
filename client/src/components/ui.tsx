import { motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, Inbox } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { ApiError } from '../services/api';

/** Scroll-triggered reveal. Renders instantly (no motion) for users who prefer reduced motion. */
export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Section({ children, className = '', id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`px-4 py-16 sm:px-6 sm:py-24 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, text, center = true }: { eyebrow?: string; title: string; text?: string; center?: boolean }) {
  return (
    <Reveal className={`mb-10 max-w-2xl sm:mb-14 ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{eyebrow}</p>}
      <h2 className="text-3xl sm:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-muted">{text}</p>}
    </Reveal>
  );
}

export function PageHero({ title, text, eyebrow, children }: { title: string; text?: string; eyebrow?: string; children?: ReactNode }) {
  return (
    <header className="relative overflow-hidden px-4 pb-12 pt-32 sm:px-6 sm:pt-40">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{eyebrow}</p>}
        <h1 className="max-w-3xl text-4xl sm:text-5xl">{title}</h1>
        {text && <p className="mt-5 max-w-2xl text-lg text-muted">{text}</p>}
        {children}
      </div>
    </header>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden />;
}

export function CardSkeletons({ n = 6 }: { n?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading">
      {Array.from({ length: n }).map((_, i) => (
        <Skeleton key={i} className="h-44" />
      ))}
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: ApiError | Error; onRetry?: () => void }) {
  return (
    <div role="alert" className="card mx-auto flex max-w-lg flex-col items-center gap-3 text-center">
      <AlertCircle className="h-8 w-8 text-red-300" aria-hidden />
      <p className="font-semibold">We could not load this content.</p>
      <p className="text-sm text-muted">{error.message}</p>
      {onRetry && <button className="btn-ghost" onClick={onRetry}>Try again</button>}
    </div>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="card mx-auto flex max-w-lg flex-col items-center gap-3 text-center">
      <Inbox className="h-8 w-8 text-muted" aria-hidden />
      <p className="font-semibold">{title}</p>
      {text && <p className="text-sm text-muted">{text}</p>}
      {action}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: [string, string?][] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map(([label, to], i) => (
          <li key={label} className="flex items-center gap-1.5">
            {to ? <Link to={to} className="hover:text-ink">{label}</Link> : <span aria-current="page" className="text-ink">{label}</span>}
            {i < items.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function FaqList({ items }: { items: { q?: string; a?: string; question?: string; answer?: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((f, i) => (
        <details key={i} className="card group p-0">
          <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold">
            {f.q ?? f.question}
            <span className="text-secondary transition group-open:rotate-45" aria-hidden>+</span>
          </summary>
          <p className="px-5 pb-5 text-muted">{f.a ?? f.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-extrabold tracking-tight ${className}`}>
      <img
        src="/logo.png"
        alt="RS Stack"
        className="h-9 w-9 rounded-full object-cover ring-2 ring-secondary/30 shadow-md"
      />
      <span className="text-lg">RS <span className="text-gradient font-black">STACK</span></span>
    </span>
  );
}
