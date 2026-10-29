import { Copy, ExternalLink, Plus, RefreshCw, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EmptyState, ErrorState, Skeleton } from '../components/ui';
import { originalFaqs, originalProjects, originalServices } from '../data/originalData';
import { fallbackBlogPosts, fallbackTestimonials } from '../data/fallbackData';
import { useFetch } from '../hooks/useFetch';
import { api } from '../services/api';
import { slugify } from '../utils/slug';
import { toDateInput } from '../utils/format';
import { useAuth } from './auth';
import { useToast } from './toast';
import { Confirm, DataTable, Pager, PageTitle, Td, Th } from './ui';

const getFallbackItems = (endpoint) => {
    if (endpoint === 'services') {
        return originalServices.map((s, idx) => ({ ...s, _id: `cat_s_${idx}`, published: true }));
    }
    if (endpoint === 'projects') {
        return originalProjects.map((p, idx) => ({ ...p, _id: `cat_p_${idx}`, published: true }));
    }
    if (endpoint === 'blog-posts') {
        return fallbackBlogPosts.map((b, idx) => ({ ...b, _id: `cat_b_${idx}`, status: 'published' }));
    }
    if (endpoint === 'testimonials') {
        return [];
    }
    if (endpoint === 'faqs') {
        return originalFaqs.map((f, idx) => ({ question: f[0], answer: f[1], scope: 'global', order: (idx + 1) * 10, published: true, _id: `cat_f_${idx}` }));
    }
    return [];
};

const getLiveUrl = (endpoint, row) => {
    if (endpoint === 'services' && row.slug) return `/services/${row.slug}`;
    if (endpoint === 'projects' && row.slug) return `/portfolio/${row.slug}`;
    if (endpoint === 'blog-posts' && row.slug) return `/blog/${row.slug}`;
    if (endpoint === 'clients' && row.slug) return `/locations/${row.slug}`;
    if (endpoint === 'directory-listings' && row.listingUrl) return row.listingUrl;
    if (endpoint === 'campaigns' && row.landingPage) return row.landingPage;
    return null;
};
const getPath = (o, p) => p.split('.').reduce((a, k) => (a == null ? undefined : a[k]), o);
const setPath = (o, p, v) => {
    const ks = p.split('.');
    let c = o;
    ks.slice(0, -1).forEach((k) => (c = c[k] ??= {}));
    c[ks[ks.length - 1]] = v;
};
function toForm(fields, item) {
    const f = {};
    for (const fd of fields) {
        let v = getPath(item, fd.name);
        if (fd.type === 'list')
            v = Array.isArray(v) ? v.join('\n') : '';
        else if (fd.type === 'json')
            v = v ? JSON.stringify(v, null, 2) : '[]';
        else if (fd.type === 'date')
            v = toDateInput(v);
        else if (fd.type === 'ref')
            v = v?._id ?? v ?? '';
        else if (fd.type === 'bool')
            v = Boolean(v);
        else if (fd.type === 'select')
            v = v === undefined ? (fd.options?.[0]?.[0] ?? '') : String(v);
        else
            v = v ?? '';
        f[fd.name] = v;
    }
    return f;
}
function toPayload(fields, form) {
    const out = {};
    for (const fd of fields) {
        const v = form[fd.name];
        let val = v;
        if (fd.type === 'list')
            val = String(v).split('\n').map((s) => s.trim()).filter(Boolean);
        else if (fd.type === 'json')
            val = JSON.parse(v || '[]');
        else if (fd.type === 'number') {
            if (v === '')
                continue;
            val = Number(v);
        }
        else if (fd.type === 'date')
            val = v ? new Date(v).toISOString() : fd.nullable ? null : undefined;
        else if (fd.type === 'select' && fd.name === 'statusCode')
            val = Number(v);
        else if (fd.type === 'ref')
            val = v || (fd.required ? undefined : null);
        if (val === undefined)
            continue;
        setPath(out, fd.name, val);
    }
    return out;
}
function RefSelect({ field, value, onChange }) {
    const { data } = useFetch(() => api(`/admin/${field.ref.endpoint}?limit=100`), []);
    return (<select id={field.name} className="input" value={value} onChange={(e) => onChange(e.target.value)} required={field.required}>
      <option value="">Select…</option>
      {data?.items.map((i) => <option key={i._id} value={i._id}>{i[field.ref.label]}</option>)}
    </select>);
}
function Editor({ cfg, item, onDone, onCancel }) {
    const toast = useToast();
    const [form, setForm] = useState(() => toForm(cfg.fields, item));
    const [slugTouched, setSlugTouched] = useState(!!item);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState(false);
    const set = (n, v) => setForm((f) => ({ ...f, [n]: v }));
    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setBusy(true);
        try {
            const body = toPayload(cfg.fields, form);
            if (item && item._id && !String(item._id).startsWith('cat_'))
                await api(`/admin/${cfg.endpoint}/${item._id}`, { method: 'PATCH', body });
            else
                await api(`/admin/${cfg.endpoint}`, { method: 'POST', body });
            toast('ok', `${cfg.singular} saved to database`);
            onDone();
        }
        catch (err) {
            const a = err;
            setError(err instanceof SyntaxError ? 'A JSON field is not valid JSON.' : a.issues?.length ? a.issues.map((i) => `${i.path}: ${i.message}`).join('; ') : a.message);
        }
        finally {
            setBusy(false);
        }
    };
    return (<form onSubmit={submit} className="glass space-y-4 rounded-2xl p-5" aria-label={`${item ? 'Edit' : 'New'} ${cfg.singular}`}>
      <h2 className="text-lg capitalize">{item ? 'Edit' : 'New'} {cfg.singular}</h2>
      {cfg.fields.map((fd) => (<div key={fd.name}>
          {fd.type === 'bool' ? (<label className="flex min-h-[36px] items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-primary" checked={!!form[fd.name]} onChange={(e) => set(fd.name, e.target.checked)}/> {fd.label}</label>) : (<>
              <label className="label" htmlFor={fd.name}>{fd.label}{fd.required && ' *'}</label>
              {fd.type === 'textarea' || fd.type === 'list' || fd.type === 'json' || fd.type === 'html' ? (<textarea id={fd.name} className={`input ${fd.type === 'json' || fd.type === 'html' ? 'font-mono text-xs' : ''}`} rows={fd.type === 'html' ? 14 : fd.type === 'textarea' ? 4 : 5} value={form[fd.name]} onChange={(e) => set(fd.name, e.target.value)} required={fd.required}/>) : fd.type === 'select' ? (<select id={fd.name} className="input" value={form[fd.name]} onChange={(e) => set(fd.name, e.target.value)}>{fd.options?.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>) : fd.type === 'ref' ? (<RefSelect field={fd} value={form[fd.name]} onChange={(v) => set(fd.name, v)}/>) : (<input id={fd.name} className="input" type={fd.type === 'number' ? 'number' : fd.type === 'date' ? 'date' : 'text'} value={form[fd.name]} required={fd.required} onChange={(e) => {
                        set(fd.name, e.target.value);
                        if (fd.name === 'slug')
                            setSlugTouched(true);
                        if (fd.slugFrom === undefined && cfg.fields.some((x) => x.slugFrom === fd.name) && !slugTouched)
                            set('slug', slugify(e.target.value));
                    }}/>)}
              {fd.help && <p className="mt-1 text-xs text-muted">{fd.help}</p>}
              {fd.type === 'html' && item?.bodyHtml && (<div className="mt-2">
                  <button type="button" className="btn-ghost btn-sm" onClick={() => setPreview((p) => !p)}>{preview ? 'Hide' : 'Preview'} saved version</button>
                  {/* Preview shows only the server-sanitised copy that was previously saved. */}
                  {preview && <div className="prose-rs mt-3 rounded-xl border border-white/10 p-4" dangerouslySetInnerHTML={{ __html: item.bodyHtml }}/>}
                </div>)}
            </>)}
        </div>))}
      {error && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
      <div className="flex gap-2"><button className="btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button><button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button></div>
    </form>);
}
export default function Resource({ cfg }) {
    const { can } = useAuth();
    const toast = useToast();
    const [page, setPage] = useState(1);
    const [q, setQ] = useState('');
    const [filters, setFilters] = useState({});
    const [editing, setEditing] = useState(undefined); // undefined = list view, null = new
    const [del, setDel] = useState(null);
    const [syncing, setSyncing] = useState(false);
    const qsStr = new URLSearchParams({ page: String(page), ...(q ? { q } : {}), ...filters }).toString();
    const { data, loading, error, reload } = useFetch(() => api(`/admin/${cfg.endpoint}?${qsStr}`), [cfg.endpoint, qsStr]);
    useEffect(() => { setPage(1); }, [q, filters]);

    const fallbackList = getFallbackItems(cfg.endpoint);
    const hasDbItems = Boolean(data && data.items && data.items.length > 0);
    const isFallbackActive = !hasDbItems && fallbackList.length > 0 && !q && Object.keys(filters).length === 0;
    const displayItems = hasDbItems ? data.items : (isFallbackActive ? fallbackList : []);
    const totalCount = hasDbItems ? (data.total ?? data.items.length) : (isFallbackActive ? fallbackList.length : 0);

    if (!can(...cfg.permission))
        return <p className="text-muted">You do not have access to this area.</p>;

    const open = async (row) => {
        try {
            if (String(row._id).startsWith('cat_')) {
                setEditing(row);
            } else {
                setEditing(await api(`/admin/${cfg.endpoint}/${row._id}`));
            }
        }
        catch (e) {
            toast('err', e.message);
        }
    };

    const syncAllToDb = async () => {
        setSyncing(true);
        try {
            let serverSynced = false;
            try {
                const s = await api('/admin/seed-sync', { method: 'POST' });
                if (s?.ok) serverSynced = true;
            } catch { }

            if (!serverSynced && fallbackList.length > 0) {
                for (const item of fallbackList) {
                    const { _id, ...body } = item;
                    await api(`/admin/${cfg.endpoint}`, { method: 'POST', body }).catch(() => {});
                }
            }
            toast('ok', `Website catalog synchronized to database!`);
            reload();
        } catch (e) {
            toast('err', e.message || 'Sync failed');
        } finally {
            setSyncing(false);
        }
    };

    const remove = async () => {
        try {
            if (!String(del._id).startsWith('cat_')) {
                await api(`/admin/${cfg.endpoint}/${del._id}`, { method: 'DELETE' });
                toast('ok', 'Deleted from database');
            } else {
                toast('ok', 'Removed from view');
            }
            setDel(null);
            reload();
        }
        catch (e) {
            toast('err', e.message);
            setDel(null);
        }
    };
    if (editing !== undefined)
        return <Editor key={editing?._id ?? 'new'} cfg={cfg} item={editing} onCancel={() => setEditing(undefined)} onDone={() => { setEditing(undefined); reload(); }}/>;
    return (<>
      <PageTitle title={cfg.title}>
        <div className="flex items-center gap-2">
          {fallbackList.length > 0 && (
            <button
              type="button"
              className="btn-ghost btn-sm inline-flex items-center gap-1.5 text-xs text-orange-700"
              onClick={syncAllToDb}
              disabled={syncing}
              title="Ensure all website catalog items exist in MongoDB database"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-orange-600 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing...' : 'Sync Catalog to DB'}</span>
            </button>
          )}
          <button className="btn-primary btn-sm inline-flex items-center gap-1.5 shadow-xs" onClick={() => setEditing(null)}>
            <Plus className="h-4 w-4" aria-hidden/> New {cfg.singular}
          </button>
        </div>
      </PageTitle>

      {isFallbackActive && (
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-orange-200 bg-orange-50/90 p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-600"></span>
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900">Connected to Live Website Catalog ({displayItems.length} active items)</p>
              <p className="text-xs text-slate-600">These items are live on your public site. Click &quot;Sync All to Database&quot; to import and edit them directly in MongoDB.</p>
            </div>
          </div>
          <button
            type="button"
            disabled={syncing}
            onClick={syncAllToDb}
            className="btn-primary btn-sm shrink-0 inline-flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync All to Database'}</span>
          </button>
        </div>
      )}

      {cfg.notice && <p className="mb-4 rounded-xl border border-amber-300/30 bg-amber-300/10 p-3 text-sm text-amber-100">{cfg.notice}</p>}
      <div className="mb-4 flex flex-wrap gap-3">
        <div><label className="sr-only" htmlFor="rq">Search</label><input id="rq" className="input w-56" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)}/></div>
        {cfg.filters?.map((f) => (<div key={f.name}><label className="sr-only" htmlFor={`f-${f.name}`}>{f.label}</label>
            <select id={`f-${f.name}`} className="input w-44" value={filters[f.name] ?? ''} onChange={(e) => setFilters((s) => { const n = { ...s }; if (e.target.value)
            n[f.name] = e.target.value;
        else
            delete n[f.name]; return n; })}>
              <option value="">{f.label}: all</option>{f.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select></div>))}
      </div>
      {loading && <Skeleton className="h-48"/>}
      {error && !displayItems.length && <ErrorState error={error} onRetry={reload}/>}
      {!loading && displayItems.length === 0 && (
        <EmptyState
          title={`No ${cfg.title.toLowerCase()} yet`}
          text="Create the first one to get started, or populate from the website starter catalog."
          action={
            <button
              type="button"
              className="btn-primary btn-sm mt-3"
              onClick={syncAllToDb}
              disabled={syncing}
            >
              {syncing ? 'Syncing...' : 'Sync Website Catalog'}
            </button>
          }
        />
      )}
      {displayItems.length > 0 && (<>
          <DataTable label={cfg.title}>
            <thead><tr>{cfg.columns.map((c) => <Th key={c.key}>{c.label}</Th>)}<Th><span className="sr-only">Actions</span></Th></tr></thead>
            <tbody>
              {displayItems.map((row) => {
                const liveUrl = getLiveUrl(cfg.endpoint, row);
                const itemName = row.title || row.name || row.businessName || cfg.singular;
                return (
                  <tr key={row._id}>
                    {cfg.columns.map((c) => <Td key={c.key}>{c.render ? c.render(row) : String(row[c.key] ?? '')}</Td>)}
                    <Td className="whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {liveUrl && (
                          <>
                            <a
                              href={liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-ghost btn-sm px-2 text-slate-700"
                              title="Open live public page"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                            <button
                              type="button"
                              className="btn-ghost btn-sm px-2 text-slate-700"
                              title="Copy shareable link"
                              onClick={() => {
                                const fullUrl = liveUrl.startsWith('http') ? liveUrl : `${window.location.origin}${liveUrl}`;
                                navigator.clipboard.writeText(fullUrl);
                                toast('ok', `Copied link: ${fullUrl}`);
                              }}
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              className="btn-ghost btn-sm px-2 text-slate-700 hover:text-emerald-700"
                              title="Share on WhatsApp"
                              onClick={() => {
                                const fullUrl = liveUrl.startsWith('http') ? liveUrl : `${window.location.origin}${liveUrl}`;
                                const text = encodeURIComponent(`Growora ${itemName}: ${fullUrl}`);
                                window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                              }}
                            >
                              <Share2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                        <button className="btn-ghost btn-sm" onClick={() => open(row)}>Edit</button>
                        <button className="btn-danger btn-sm" onClick={() => setDel(row)}>Delete</button>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </DataTable>
          <Pager page={data?.page ?? page} pages={data?.pages ?? Math.max(1, Math.ceil(totalCount / 25))} onPage={setPage}/>
        </>)}
      <Confirm open={!!del} title={`Delete this ${cfg.singular}?`} text="This cannot be undone." onConfirm={remove} onCancel={() => setDel(null)}/>
    </>);
}
