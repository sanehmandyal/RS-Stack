import { Plus } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { EmptyState, ErrorState, Skeleton } from '../components/ui';
import { useFetch } from '../hooks/useFetch';
import { api, ApiError } from '../services/api';
import { slugify } from '../utils/slug';
import { toDateInput } from '../utils/format';
import { useAuth } from './auth';
import type { Field, ResourceCfg } from './resources';
import { useToast } from './toast';
import { Confirm, DataTable, Pager, PageTitle, Td, Th } from './ui';

const getPath = (o: any, p: string) => p.split('.').reduce((a, k) => (a == null ? undefined : a[k]), o);
const setPath = (o: any, p: string, v: unknown) => {
  const ks = p.split('.');
  let c = o;
  ks.slice(0, -1).forEach((k) => (c = c[k] ??= {}));
  c[ks[ks.length - 1]] = v;
};

function toForm(fields: Field[], item: any) {
  const f: Record<string, any> = {};
  for (const fd of fields) {
    let v = getPath(item, fd.name);
    if (fd.type === 'list') v = Array.isArray(v) ? v.join('\n') : '';
    else if (fd.type === 'json') v = v ? JSON.stringify(v, null, 2) : '[]';
    else if (fd.type === 'date') v = toDateInput(v);
    else if (fd.type === 'ref') v = v?._id ?? v ?? '';
    else if (fd.type === 'bool') v = Boolean(v);
    else if (fd.type === 'select') v = v === undefined ? (fd.options?.[0]?.[0] ?? '') : String(v);
    else v = v ?? '';
    f[fd.name] = v;
  }
  return f;
}

function toPayload(fields: Field[], form: Record<string, any>) {
  const out: any = {};
  for (const fd of fields) {
    const v = form[fd.name];
    let val: unknown = v;
    if (fd.type === 'list') val = String(v).split('\n').map((s) => s.trim()).filter(Boolean);
    else if (fd.type === 'json') val = JSON.parse(v || '[]');
    else if (fd.type === 'number') { if (v === '') continue; val = Number(v); }
    else if (fd.type === 'date') val = v ? new Date(v).toISOString() : fd.nullable ? null : undefined;
    else if (fd.type === 'select' && fd.name === 'statusCode') val = Number(v);
    else if (fd.type === 'ref') val = v || (fd.required ? undefined : null);
    if (val === undefined) continue;
    setPath(out, fd.name, val);
  }
  return out;
}

function RefSelect({ field, value, onChange }: { field: Field; value: string; onChange: (v: string) => void }) {
  const { data } = useFetch<{ items: any[] }>(() => api(`/admin/${field.ref!.endpoint}?limit=100`), []);
  return (
    <select id={field.name} className="input" value={value} onChange={(e) => onChange(e.target.value)} required={field.required}>
      <option value="">Select…</option>
      {data?.items.map((i) => <option key={i._id} value={i._id}>{i[field.ref!.label]}</option>)}
    </select>
  );
}

function Editor({ cfg, item, onDone, onCancel }: { cfg: ResourceCfg; item: any | null; onDone: () => void; onCancel: () => void }) {
  const toast = useToast();
  const [form, setForm] = useState(() => toForm(cfg.fields, item));
  const [slugTouched, setSlugTouched] = useState(!!item);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);
  const set = (n: string, v: unknown) => setForm((f) => ({ ...f, [n]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setError(''); setBusy(true);
    try {
      const body = toPayload(cfg.fields, form);
      if (item) await api(`/admin/${cfg.endpoint}/${item._id}`, { method: 'PATCH', body });
      else await api(`/admin/${cfg.endpoint}`, { method: 'POST', body });
      toast('ok', `${cfg.singular} saved`);
      onDone();
    } catch (err) {
      const a = err as ApiError;
      setError(err instanceof SyntaxError ? 'A JSON field is not valid JSON.' : a.issues?.length ? a.issues.map((i) => `${i.path}: ${i.message}`).join('; ') : a.message);
    } finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="glass space-y-4 rounded-2xl p-5" aria-label={`${item ? 'Edit' : 'New'} ${cfg.singular}`}>
      <h2 className="text-lg capitalize">{item ? 'Edit' : 'New'} {cfg.singular}</h2>
      {cfg.fields.map((fd) => (
        <div key={fd.name}>
          {fd.type === 'bool' ? (
            <label className="flex min-h-[36px] items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-primary" checked={!!form[fd.name]} onChange={(e) => set(fd.name, e.target.checked)} /> {fd.label}</label>
          ) : (
            <>
              <label className="label" htmlFor={fd.name}>{fd.label}{fd.required && ' *'}</label>
              {fd.type === 'textarea' || fd.type === 'list' || fd.type === 'json' || fd.type === 'html' ? (
                <textarea id={fd.name} className={`input ${fd.type === 'json' || fd.type === 'html' ? 'font-mono text-xs' : ''}`} rows={fd.type === 'html' ? 14 : fd.type === 'textarea' ? 4 : 5} value={form[fd.name]} onChange={(e) => set(fd.name, e.target.value)} required={fd.required} />
              ) : fd.type === 'select' ? (
                <select id={fd.name} className="input" value={form[fd.name]} onChange={(e) => set(fd.name, e.target.value)}>{fd.options?.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
              ) : fd.type === 'ref' ? (
                <RefSelect field={fd} value={form[fd.name]} onChange={(v) => set(fd.name, v)} />
              ) : (
                <input id={fd.name} className="input" type={fd.type === 'number' ? 'number' : fd.type === 'date' ? 'date' : 'text'} value={form[fd.name]} required={fd.required}
                  onChange={(e) => {
                    set(fd.name, e.target.value);
                    if (fd.name === 'slug') setSlugTouched(true);
                    if (fd.slugFrom === undefined && cfg.fields.some((x) => x.slugFrom === fd.name) && !slugTouched) set('slug', slugify(e.target.value));
                  }} />
              )}
              {fd.help && <p className="mt-1 text-xs text-muted">{fd.help}</p>}
              {fd.type === 'html' && item?.bodyHtml && (
                <div className="mt-2">
                  <button type="button" className="btn-ghost btn-sm" onClick={() => setPreview((p) => !p)}>{preview ? 'Hide' : 'Preview'} saved version</button>
                  {/* Preview shows only the server-sanitised copy that was previously saved. */}
                  {preview && <div className="prose-rs mt-3 rounded-xl border border-white/10 p-4" dangerouslySetInnerHTML={{ __html: item.bodyHtml }} />}
                </div>
              )}
            </>
          )}
        </div>
      ))}
      {error && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
      <div className="flex gap-2"><button className="btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button><button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button></div>
    </form>
  );
}

export default function Resource({ cfg }: { cfg: ResourceCfg }) {
  const { can } = useAuth();
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<any | null | undefined>(undefined); // undefined = list view, null = new
  const [del, setDel] = useState<any | null>(null);
  const qsStr = new URLSearchParams({ page: String(page), ...(q ? { q } : {}), ...filters }).toString();
  const { data, loading, error, reload } = useFetch<any>(() => api(`/admin/${cfg.endpoint}?${qsStr}`), [cfg.endpoint, qsStr]);
  useEffect(() => { setPage(1); }, [q, filters]);
  if (!can(...cfg.permission)) return <p className="text-muted">You do not have access to this area.</p>;

  const open = async (row: any) => {
    try { setEditing(await api(`/admin/${cfg.endpoint}/${row._id}`)); } catch (e) { toast('err', (e as Error).message); }
  };
  const remove = async () => {
    try { await api(`/admin/${cfg.endpoint}/${del._id}`, { method: 'DELETE' }); toast('ok', 'Deleted'); setDel(null); reload(); }
    catch (e) { toast('err', (e as Error).message); setDel(null); }
  };

  if (editing !== undefined) return <Editor key={editing?._id ?? 'new'} cfg={cfg} item={editing} onCancel={() => setEditing(undefined)} onDone={() => { setEditing(undefined); reload(); }} />;

  return (
    <>
      <PageTitle title={cfg.title}><button className="btn-primary btn-sm" onClick={() => setEditing(null)}><Plus className="h-4 w-4" aria-hidden /> New {cfg.singular}</button></PageTitle>
      {cfg.notice && <p className="mb-4 rounded-xl border border-amber-300/30 bg-amber-300/10 p-3 text-sm text-amber-100">{cfg.notice}</p>}
      <div className="mb-4 flex flex-wrap gap-3">
        <div><label className="sr-only" htmlFor="rq">Search</label><input id="rq" className="input w-56" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        {cfg.filters?.map((f) => (
          <div key={f.name}><label className="sr-only" htmlFor={`f-${f.name}`}>{f.label}</label>
            <select id={`f-${f.name}`} className="input w-44" value={filters[f.name] ?? ''} onChange={(e) => setFilters((s) => { const n = { ...s }; if (e.target.value) n[f.name] = e.target.value; else delete n[f.name]; return n; })}>
              <option value="">{f.label}: all</option>{f.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select></div>
        ))}
      </div>
      {loading && <Skeleton className="h-48" />}
      {error && <ErrorState error={error} onRetry={reload} />}
      {data && data.items.length === 0 && <EmptyState title={`No ${cfg.title.toLowerCase()} yet`} text="Create the first one to get started." />}
      {data && data.items.length > 0 && (
        <>
          <DataTable label={cfg.title}>
            <thead><tr>{cfg.columns.map((c) => <Th key={c.key}>{c.label}</Th>)}<Th><span className="sr-only">Actions</span></Th></tr></thead>
            <tbody>
              {data.items.map((row: any) => (
                <tr key={row._id}>
                  {cfg.columns.map((c) => <Td key={c.key}>{c.render ? c.render(row) : String(row[c.key] ?? '')}</Td>)}
                  <Td className="whitespace-nowrap text-right"><button className="btn-ghost btn-sm" onClick={() => open(row)}>Edit</button> <button className="btn-danger btn-sm" onClick={() => setDel(row)}>Delete</button></Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
          <Pager page={data.page} pages={data.pages} onPage={setPage} />
        </>
      )}
      <Confirm open={!!del} title={`Delete this ${cfg.singular}?`} text="This cannot be undone." onConfirm={remove} onCancel={() => setDel(null)} />
    </>
  );
}
