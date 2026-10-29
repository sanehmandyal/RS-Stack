import { motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';
/** Scroll-triggered reveal. Renders instantly (no motion) for users who prefer reduced motion. */
export function Reveal({ children, delay = 0, className = '' }) {
    const reduce = useReducedMotion();
    if (reduce)
        return <div className={className}>{children}</div>;
    return (<motion.div className={className} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>);
}
export function Section({ children, className = '', id }) {
    return (<section id={id} className={`px-4 py-16 sm:px-6 sm:py-24 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>);
}
export function SectionHead({ eyebrow, title, text, center = true }) {
    return (<Reveal className={`mb-10 max-w-2xl sm:mb-14 ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <p className="mb-3 inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-100/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-800 shadow-xs">{eyebrow}</p>}
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">{title}</h2>
      {text && <p className="mt-4 text-muted leading-relaxed text-base sm:text-lg">{text}</p>}
    </Reveal>);
}
export function PageHero({ title, text, eyebrow, children }) {
    return (<header className="relative overflow-hidden px-4 pb-12 pt-32 sm:px-6 sm:pt-40">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" aria-hidden/>
      <div className="relative mx-auto max-w-6xl">
        {eyebrow && <p className="mb-3 inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-100/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-800 shadow-xs">{eyebrow}</p>}
        <h1 className="max-w-3xl text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">{title}</h1>
        {text && <p className="mt-5 max-w-2xl text-lg text-muted leading-relaxed">{text}</p>}
        {children}
      </div>
    </header>);
}
export function Skeleton({ className = '' }) {
    return <div className={`skeleton ${className}`} aria-hidden/>;
}
export function CardSkeletons({ n = 6 }) {
    return (<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading">
      {Array.from({ length: n }).map((_, i) => (<Skeleton key={i} className="h-44"/>))}
    </div>);
}
export function ErrorState({ error, onRetry }) {
    return (<div role="alert" className="card mx-auto flex max-w-lg flex-col items-center gap-3 text-center">
      <AlertCircle className="h-8 w-8 text-red-300" aria-hidden/>
      <p className="font-semibold">We could not load this content.</p>
      <p className="text-sm text-muted">{error.message}</p>
      {onRetry && <button className="btn-ghost" onClick={onRetry}>Try again</button>}
    </div>);
}
export function EmptyState({ title, text, action }) {
    return (<div className="card mx-auto flex max-w-lg flex-col items-center gap-3 text-center">
      <Inbox className="h-8 w-8 text-muted" aria-hidden/>
      <p className="font-semibold">{title}</p>
      {text && <p className="text-sm text-muted">{text}</p>}
      {action}
    </div>);
}
export function Breadcrumbs({ items }) {
    return (<nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map(([label, to], i) => (<li key={label} className="flex items-center gap-1.5">
            {to ? <Link to={to} className="hover:text-ink">{label}</Link> : <span aria-current="page" className="text-ink">{label}</span>}
            {i < items.length - 1 && <span aria-hidden>/</span>}
          </li>))}
      </ol>
    </nav>);
}
export function FaqList({ items }) {
    return (<div className="space-y-3">
      {items.map((f, i) => (<details key={i} className="card group p-0 hover:border-slate-300 transition duration-150">
          <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-semibold text-slate-900">
            {f.q ?? f.question}
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-slate-700 border border-slate-200 transition-transform duration-200 group-open:rotate-45 font-bold text-xs" aria-hidden>+</span>
          </summary>
          <p className="px-6 pb-6 text-slate-600 leading-relaxed text-sm">{f.a ?? f.answer}</p>
        </details>))}
    </div>);
}
export function Logo({ className = '' }) {
    return (<span className={`inline-flex items-center gap-2.5 font-extrabold tracking-tight ${className}`}>
      <img src="/logo.png" alt="Growora" className="h-8 w-8 rounded-full object-cover border border-slate-200 shadow-xs"/>
      <span className="text-lg text-slate-900 tracking-tight">Grow<span className="font-black text-[#143D34]">ora</span></span>
    </span>);
}
