import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { EmptyState, ErrorState, Skeleton } from '../components/ui';
import { useFetch } from '../hooks/useFetch';
import { api } from '../services/api';
import { fmtDate } from '../utils/format';
import { useAuth } from './auth';
import { useToast } from './toast';
import { Badge, DataTable, PageTitle, Pager, Td, Th } from './ui';
export const STATUSES = ['new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost'];
export default function Leads() {
    const { can } = useAuth();
    const toast = useToast();
    const [sp, setSp] = useSearchParams();
    const [q, setQ] = useState(sp.get('q') ?? '');
    const f = { status: sp.get('status') ?? '', service: sp.get('service') ?? '', source: sp.get('source') ?? '', sort: sp.get('sort') ?? 'newest', archived: sp.get('archived') ?? '', spam: sp.get('spam') ?? '', from: sp.get('from') ?? '', to: sp.get('to') ?? '', q: sp.get('q') ?? '', page: sp.get('page') ?? '1' };
    const query = new URLSearchParams(Object.entries(f).filter(([, v]) => v)).toString();
    const { data, loading, error, reload } = useFetch(() => api(`/admin/leads?${query}`), [query]);
    const services = useFetch(() => api('/public/services'), []);
    useEffect(() => setQ(f.q), [f.q]); // eslint-disable-line react-hooks/exhaustive-deps
    const set = (patch) => { const n = new URLSearchParams(sp); Object.entries(patch).forEach(([k, v]) => (v ? n.set(k, v) : n.delete(k))); if (!('page' in patch))
        n.delete('page'); setSp(n); };
    const exportCsv = async () => {
        try {
            const res = await api(`/admin/leads/export.csv?${query}`, { raw: true });
            const url = URL.createObjectURL(await res.blob());
            const a = document.createElement('a');
            a.href = url;
            a.download = 'rs-stack-leads.csv';
            a.click();
            URL.revokeObjectURL(url);
        }
        catch (e) {
            toast('err', e.message);
        }
    };
    return (<>
      <PageTitle title="Leads">{can('leads:export') && <button className="btn-ghost btn-sm" onClick={exportCsv}><Download className="h-4 w-4" aria-hidden/> Export CSV</button>}</PageTitle>
      <form className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" onSubmit={(e) => { e.preventDefault(); set({ q: q.trim() }); }} role="search" aria-label="Filter leads">
        <input aria-label="Search leads" className="input" placeholder="Search name, email, business…" value={q} onChange={(e) => setQ(e.target.value)}/>
        <select aria-label="Status" className="input" value={f.status} onChange={(e) => set({ status: e.target.value })}><option value="">All statuses</option>{STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}</select>
        <select aria-label="Service" className="input" value={f.service} onChange={(e) => set({ service: e.target.value })}><option value="">All services</option>{services.data?.items.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}</select>
        <select aria-label="Sort" className="input" value={f.sort} onChange={(e) => set({ sort: e.target.value })}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="followup">Follow-up date</option><option value="status">Status</option></select>
        <label className="flex items-center gap-2 text-sm text-muted">From <input type="date" className="input" value={f.from ? f.from.slice(0, 10) : ""} onChange={(e) => set({ from: e.target.value ? new Date(e.target.value).toISOString() : '' })}/></label>
        <label className="flex items-center gap-2 text-sm text-muted">To <input type="date" className="input" value={f.to ? f.to.slice(0, 10) : ''} onChange={(e) => set({ to: e.target.value ? new Date(`${e.target.value}T23:59:59`).toISOString() : '' })}/></label>
        <select aria-label="View" className="input" value={f.spam ? 'spam' : f.archived ? 'archived' : 'active'} onChange={(e) => set({ spam: e.target.value === 'spam' ? 'true' : '', archived: e.target.value === 'archived' ? 'true' : '' })}><option value="active">Active leads</option><option value="archived">Archived</option><option value="spam">Spam</option></select>
        <button className="btn-primary">Search</button>
      </form>
      {loading && <Skeleton className="h-48"/>}
      {error && <ErrorState error={error} onRetry={reload}/>}
      {data && data.items.length === 0 && <EmptyState title="No leads match" text="Adjust the filters, or wait for new inquiries."/>}
      {data && data.items.length > 0 && (<>
          <DataTable label="Leads">
            <thead><tr><Th>Received</Th><Th>Name</Th><Th>Business</Th><Th>Services</Th><Th>Status</Th><Th>Assigned</Th><Th>Follow-up</Th></tr></thead>
            <tbody>{data.items.map((l) => (<tr key={l._id} className="hover:bg-white/5">
                <Td className="whitespace-nowrap">{fmtDate(l.createdAt)}</Td>
                <Td><Link to={`/admin/leads/${l._id}`} className="font-semibold text-secondary hover:underline">{l.name}</Link><span className="block text-xs text-muted">{l.email}</span></Td>
                <Td>{l.businessName}</Td>
                <Td className="max-w-[220px] truncate text-muted">{l.services?.join(', ')}</Td>
                <Td><Badge value={l.status}/></Td>
                <Td>{l.assignedTo?.name ?? <span className="text-muted">Unassigned</span>}</Td>
                <Td>{fmtDate(l.followUpAt)}</Td>
              </tr>))}</tbody>
          </DataTable>
          <Pager page={data.page} pages={data.pages} onPage={(p) => set({ page: String(p) })}/>
          <p className="mt-2 text-xs text-muted">{data.total} lead(s)</p>
        </>)}
    </>);
}
