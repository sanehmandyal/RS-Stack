import { useEffect, useRef } from 'react';
export function Confirm({ open, title, text, confirmLabel = 'Delete', onConfirm, onCancel }) {
    const ref = useRef(null);
    useEffect(() => {
        if (!open)
            return;
        ref.current?.focus();
        const k = (e) => e.key === 'Escape' && onCancel();
        document.addEventListener('keydown', k);
        return () => document.removeEventListener('keydown', k);
    }, [open, onCancel]);
    if (!open)
        return null;
    return (<div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" role="alertdialog" aria-modal="true" aria-labelledby="cf-t" aria-describedby="cf-d">
      <div className="glass-strong w-full max-w-sm rounded-2xl p-6">
        <h2 id="cf-t" className="text-lg">{title}</h2><p id="cf-d" className="mt-2 text-sm text-muted">{text}</p>
        <div className="mt-5 flex justify-end gap-2"><button ref={ref} className="btn-ghost" onClick={onCancel}>Cancel</button><button className="btn-danger" onClick={onConfirm}>{confirmLabel}</button></div>
      </div>
    </div>);
}
export function Pager({ page, pages, onPage }) {
    if (pages <= 1)
        return null;
    return (<nav aria-label="Pagination" className="mt-4 flex items-center justify-end gap-3">
      <button className="btn-ghost btn-sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>Previous</button>
      <span className="text-xs text-muted">Page {page} of {pages}</span>
      <button className="btn-ghost btn-sm" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next</button>
    </nav>);
}
export function PageTitle({ title, children }) {
    return <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl">{title}</h1><div className="flex flex-wrap gap-2">{children}</div></div>;
}
/** Responsive table: horizontal scroll on narrow screens, with an accessible region label. */
export function DataTable({ label, children }) {
    return <div className="card overflow-x-auto rounded-2xl p-0 border border-slate-200 bg-white shadow-xs" role="region" aria-label={label} tabIndex={0}><table className="w-full min-w-[640px] text-left text-sm">{children}</table></div>;
}
export const Th = ({ children }) => <th scope="col" className="whitespace-nowrap border-b border-slate-200 bg-slate-50/80 px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-700">{children}</th>;
export const Td = ({ children, className = '' }) => <td className={`border-b border-slate-100 px-4 py-3 align-top text-slate-800 ${className}`}>{children}</td>;
export const STATUS_COLORS = {
    new: 'bg-slate-100 text-slate-800 border border-slate-300',
    contacted: 'bg-slate-100 text-slate-700 border border-slate-200',
    qualified: 'bg-amber-50 text-amber-800 border border-amber-200',
    proposal_sent: 'bg-stone-100 text-stone-800 border border-stone-300',
    won: 'bg-[#143D34]/10 text-[#143D34] border border-[#143D34]/30',
    lost: 'bg-slate-100 text-slate-600 border border-slate-200',
};
export const Badge = ({ value }) => <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_COLORS[value] ?? 'bg-slate-100 text-slate-700 border border-slate-200'}`}>{value.replace(/_/g, ' ')}</span>;
