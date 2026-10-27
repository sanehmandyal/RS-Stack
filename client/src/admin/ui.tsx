import { useEffect, useRef, type ReactNode } from 'react';

export function Confirm({ open, title, text, confirmLabel = 'Delete', onConfirm, onCancel }: { open: boolean; title: string; text: string; confirmLabel?: string; onConfirm: () => void; onCancel: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    ref.current?.focus();
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onCancel();
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [open, onCancel]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" role="alertdialog" aria-modal="true" aria-labelledby="cf-t" aria-describedby="cf-d">
      <div className="glass-strong w-full max-w-sm rounded-2xl p-6">
        <h2 id="cf-t" className="text-lg">{title}</h2><p id="cf-d" className="mt-2 text-sm text-muted">{text}</p>
        <div className="mt-5 flex justify-end gap-2"><button ref={ref} className="btn-ghost" onClick={onCancel}>Cancel</button><button className="btn-danger" onClick={onConfirm}>{confirmLabel}</button></div>
      </div>
    </div>
  );
}

export function Pager({ page, pages, onPage }: { page: number; pages: number; onPage: (p: number) => void }) {
  if (pages <= 1) return null;
  return (
    <nav aria-label="Pagination" className="mt-4 flex items-center justify-end gap-3">
      <button className="btn-ghost btn-sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>Previous</button>
      <span className="text-xs text-muted">Page {page} of {pages}</span>
      <button className="btn-ghost btn-sm" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next</button>
    </nav>
  );
}

export function PageTitle({ title, children }: { title: string; children?: ReactNode }) {
  return <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl">{title}</h1><div className="flex flex-wrap gap-2">{children}</div></div>;
}

/** Responsive table: horizontal scroll on narrow screens, with an accessible region label. */
export function DataTable({ label, children }: { label: string; children: ReactNode }) {
  return <div className="glass overflow-x-auto rounded-2xl" role="region" aria-label={label} tabIndex={0}><table className="w-full min-w-[640px] text-left text-sm">{children}</table></div>;
}
export const Th = ({ children }: { children?: ReactNode }) => <th scope="col" className="whitespace-nowrap border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">{children}</th>;
export const Td = ({ children, className = '' }: { children?: ReactNode; className?: string }) => <td className={`border-b border-white/5 px-4 py-3 align-top ${className}`}>{children}</td>;

export const STATUS_COLORS: Record<string, string> = {
  new: 'bg-sky-400/15 text-sky-200', contacted: 'bg-violet-400/15 text-violet-200', qualified: 'bg-amber-400/15 text-amber-200',
  proposal_sent: 'bg-fuchsia-400/15 text-fuchsia-200', won: 'bg-emerald-400/15 text-emerald-200', lost: 'bg-zinc-400/15 text-zinc-300',
};
export const Badge = ({ value }: { value: string }) => <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[value] ?? 'bg-white/10 text-muted'}`}>{value.replace(/_/g, ' ')}</span>;
