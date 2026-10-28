import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ErrorState, Skeleton } from '../components/ui';
import { useFetch } from '../hooks/useFetch';
import { api } from '../services/api';
import { titleCase, fmtDateTime, toDateInput, whatsappLink } from '../utils/format';
import { useAuth } from './auth';
import { STATUSES } from './Leads';
import { useToast } from './toast';
import { Badge, PageTitle } from './ui';
export default function LeadDetail() {
    const { id } = useParams();
    const { can } = useAuth();
    const toast = useToast();
    const { data, loading, error, reload } = useFetch(() => api(`/admin/leads/${id}`), [id]);
    const users = useFetch(async () => (can('users:manage') ? api('/admin/users?limit=100') : { items: [] }), []);
    const [note, setNote] = useState('');
    if (loading)
        return <Skeleton className="h-64"/>;
    if (error || !data)
        return <ErrorState error={error ?? new Error('Not found')} onRetry={reload}/>;
    const { lead, notes, consent } = data;
    const canWrite = can('leads:write');
    const patch = async (body, msg = 'Saved') => {
        try {
            await api(`/admin/leads/${id}`, { method: 'PATCH', body });
            toast('ok', msg);
            reload();
        }
        catch (e) {
            toast('err', e.message);
        }
    };
    const addNote = async (e) => {
        e.preventDefault();
        try {
            await api(`/admin/leads/${id}/notes`, { method: 'POST', body: { body: note } });
            setNote('');
            reload();
        }
        catch (err) {
            toast('err', err.message);
        }
    };
    const wa = lead.preferredContact === 'whatsapp' && lead.phone ? whatsappLink(lead.phone, `Hello ${lead.name}, this is RS Stack following up on your enquiry.`) : null;
    return (<>
      <PageTitle title={lead.name}><Link to="/admin/leads" className="btn-ghost btn-sm">Back to leads</Link></PageTitle>
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card lg:col-span-2" aria-labelledby="inq">
          <h2 id="inq" className="mb-4 text-lg">Original inquiry</h2>
          <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            {[['Email', lead.email], ['Phone', lead.phone], ['Business', lead.businessName], ['Business type', titleCase(lead.businessType)], ['Budget', lead.budgetRange], ['Preferred contact', lead.preferredContact], ['Services', lead.services?.join(', ')], ['Source', lead.source], ['Received', fmtDateTime(lead.createdAt)]].map(([k, v]) => (<div key={k}><dt className="text-xs uppercase tracking-wide text-muted">{k}</dt><dd className="mt-0.5 break-words">{v || '-'}</dd></div>))}
          </dl>
          {/* React escapes this text; no HTML is ever rendered from a lead. */}
          <p className="mt-5 whitespace-pre-wrap rounded-xl border border-white/10 bg-white/5 p-4 text-sm">{lead.message}</p>
          <p className="mt-4 text-xs text-muted">Consent: {consent ? `given ${fmtDateTime(consent.givenAt)} (policy v${consent.policyVersion})` : 'no record'}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a className="btn-ghost btn-sm" href={`mailto:${lead.email}`}>Email</a>
            {wa && <a className="btn-ghost btn-sm" href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
          </div>
        </section>

        <section className="card space-y-4" aria-labelledby="mgmt">
          <h2 id="mgmt" className="text-lg">Manage</h2>
          <div><span className="label">Status</span><Badge value={lead.status}/>
            <select aria-label="Change status" className="input mt-2" value={lead.status} disabled={!canWrite} onChange={(e) => patch({ status: e.target.value })}>{STATUSES.map((s) => <option key={s} value={s}>{titleCase(s)}</option>)}</select></div>
          {can('leads:assign') && (<div><label className="label" htmlFor="asg">Assigned to</label>
              <select id="asg" className="input" value={lead.assignedTo?._id ?? ''} onChange={(e) => patch({ assignedTo: e.target.value || null })}>
                <option value="">Unassigned</option>
                {users.data?.items.filter((u) => u.active && ['sales_manager', 'admin', 'super_admin'].includes(u.role)).map((u) => <option key={u.id} value={u.id}>{u.name} ({u.role.replace('_', ' ')})</option>)}
              </select></div>)}
          <div><label className="label" htmlFor="fu">Follow-up date</label><input id="fu" type="date" className="input" disabled={!canWrite} value={toDateInput(lead.followUpAt)} onChange={(e) => patch({ followUpAt: e.target.value ? new Date(e.target.value).toISOString() : null })}/></div>
          {canWrite && <div className="flex flex-wrap gap-2">
            <button className="btn-ghost btn-sm" onClick={() => patch({ isSpam: !lead.isSpam }, lead.isSpam ? 'Unmarked spam' : 'Marked as spam')}>{lead.isSpam ? 'Not spam' : 'Mark spam'}</button>
            <button className="btn-ghost btn-sm" onClick={() => patch({ archived: !lead.archived }, lead.archived ? 'Restored' : 'Archived')}>{lead.archived ? 'Restore' : 'Archive'}</button>
          </div>}
        </section>

        <section className="card lg:col-span-3" aria-labelledby="notes">
          <h2 id="notes" className="mb-4 text-lg">Internal notes</h2>
          {canWrite && <form onSubmit={addNote} className="mb-5 flex flex-col gap-2 sm:flex-row"><label className="sr-only" htmlFor="note">New note</label><textarea id="note" required maxLength={2000} rows={2} className="input" placeholder="Add a note (visible to staff only)" value={note} onChange={(e) => setNote(e.target.value)}/><button className="btn-primary self-start">Add note</button></form>}
          {notes.length === 0 ? <p className="text-sm text-muted">No notes yet.</p> : <ul className="space-y-3">{notes.map((n) => <li key={n._id} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm"><p className="whitespace-pre-wrap">{n.body}</p><p className="mt-1 text-xs text-muted">{n.author?.name} · {fmtDateTime(n.createdAt)}</p></li>)}</ul>}
        </section>
      </div>
    </>);
}
