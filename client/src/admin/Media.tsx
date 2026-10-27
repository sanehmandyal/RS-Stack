import { Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { ErrorState, Skeleton } from '../components/ui';
import { useFetch } from '../hooks/useFetch';
import { api } from '../services/api';
import { useToast } from './toast';
import { Confirm, PageTitle, Pager } from './ui';

export default function Media() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useFetch<any>(() => api(`/admin/media?page=${page}`), [page]);
  const [alt, setAlt] = useState('');
  const [del, setDel] = useState<any | null>(null);
  const file = useRef<HTMLInputElement>(null);

  const upload = async () => {
    const f = file.current?.files?.[0];
    if (!f) return toast('err', 'Choose an image first');
    const fd = new FormData(); fd.append('file', f); if (alt) fd.append('alt', alt);
    try { await api('/admin/media', { method: 'POST', body: fd }); toast('ok', 'Uploaded'); setAlt(''); if (file.current) file.current.value = ''; reload(); } catch (e) { toast('err', (e as Error).message); }
  };
  const saveAlt = async (m: any, v: string) => { try { await api(`/admin/media/${m._id}`, { method: 'PATCH', body: { alt: v } }); toast('ok', 'Alt text saved'); } catch (e) { toast('err', (e as Error).message); } };

  return (
    <>
      <PageTitle title="Media" />
      <div className="glass mb-6 flex flex-wrap items-end gap-3 rounded-2xl p-4">
        <div><label className="label" htmlFor="mf">Image (JPG, PNG, WebP, GIF)</label><input id="mf" ref={file} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="input" /></div>
        <div className="min-w-[200px] flex-1"><label className="label" htmlFor="ma">Alt text</label><input id="ma" className="input" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Describe the image" /></div>
        <button className="btn-primary" onClick={upload}><Upload className="h-4 w-4" aria-hidden /> Upload</button>
        <p className="w-full text-xs text-muted">Files are type-checked by content on the server, re-encoded, and stripped of metadata. Copy a file’s URL into a project or post.</p>
      </div>
      {loading && <Skeleton className="h-40" />}
      {error && <ErrorState error={error} onRetry={reload} />}
      {data && data.items.length === 0 && <p className="text-muted">No media uploaded yet.</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data?.items.map((m: any) => (
          <figure key={m._id} className="card p-3">
            <img src={m.url} alt={m.alt || ''} loading="lazy" className="aspect-video w-full rounded-lg object-cover" />
            <figcaption className="mt-3 space-y-2 text-xs">
              <input aria-label="Alt text" className="input" defaultValue={m.alt} onBlur={(e) => e.target.value !== (m.alt ?? '') && saveAlt(m, e.target.value)} />
              <div className="flex items-center justify-between gap-2"><button className="btn-ghost btn-sm" onClick={() => navigator.clipboard?.writeText(m.url).then(() => toast('ok', 'URL copied'))}>Copy URL</button><button className="btn-danger btn-sm" aria-label="Delete image" onClick={() => setDel(m)}><Trash2 className="h-3.5 w-3.5" /></button></div>
            </figcaption>
          </figure>
        ))}
      </div>
      {data && <Pager page={data.page} pages={data.pages} onPage={setPage} />}
      <Confirm open={!!del} title="Delete this image?" text="Pages that use it will show a broken image." onCancel={() => setDel(null)} onConfirm={async () => { const m = del; setDel(null); try { await api(`/admin/media/${m._id}`, { method: 'DELETE' }); reload(); } catch (e) { toast('err', (e as Error).message); } }} />
    </>
  );
}
