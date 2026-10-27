import { useEffect, useState, type FormEvent } from 'react';
import { ErrorState, Skeleton } from '../components/ui';
import { useFetch } from '../hooks/useFetch';
import { api, ApiError } from '../services/api';
import { useToast } from './toast';
import { PageTitle } from './ui';

const TOP: [string, string][] = [['businessName', 'Business name'], ['tagline', 'Tagline'], ['contactEmail', 'Contact email'], ['phone', 'Phone'], ['whatsappNumber', 'WhatsApp number (digits only, with country code)'], ['address', 'Address']];
const SOCIAL = ['facebook', 'instagram', 'linkedin', 'x', 'youtube'];
const HOME: [string, string][] = [['heroHeadline', 'Hero headline'], ['heroSubheadline', 'Hero sub-headline'], ['primaryCta', 'Primary button'], ['secondaryCta', 'Secondary button'], ['finalCtaTitle', 'Final CTA title'], ['finalCtaText', 'Final CTA text']];

export default function SettingsPage() {
  const toast = useToast();
  const { data, loading, error, reload } = useFetch<any>(() => api('/admin/settings'), []);
  const [f, setF] = useState<any>(null);
  const [err, setErr] = useState('');
  useEffect(() => { if (data) setF({ ...Object.fromEntries(TOP.map(([k]) => [k, data[k] ?? ''])), social: { ...data.social }, home: { ...data.home } }); }, [data]);
  if (loading || !f) return error ? <ErrorState error={error} onRetry={reload} /> : <Skeleton className="h-64" />;

  const save = async (e: FormEvent) => {
    e.preventDefault(); setErr('');
    try {
      const clean = (o: Record<string, string>) => Object.fromEntries(Object.entries(o ?? {}).filter(([, v]) => v !== '' && v != null));
      await api('/admin/settings', { method: 'PUT', body: { ...f, social: clean(f.social), home: clean(f.home) } });
      toast('ok', 'Settings saved'); reload();
    } catch (x) { const a = x as ApiError; setErr(a.issues?.map((i) => `${i.path}: ${i.message}`).join('; ') || a.message); }
  };
  const input = (label: string, value: string, on: (v: string) => void, id: string) => (
    <div key={id}><label className="label" htmlFor={id}>{label}</label><input id={id} className="input" value={value ?? ''} onChange={(e) => on(e.target.value)} /></div>
  );
  return (
    <>
      <PageTitle title="Site settings" />
      <form onSubmit={save} className="glass max-w-3xl space-y-8 rounded-2xl p-6">
        <fieldset className="grid gap-4 sm:grid-cols-2"><legend className="mb-3 text-lg font-semibold">Business & contact</legend>{TOP.map(([k, l]) => input(l, f[k], (v) => setF({ ...f, [k]: v }), k))}</fieldset>
        <fieldset className="grid gap-4 sm:grid-cols-2"><legend className="mb-3 text-lg font-semibold">Social links (https://…)</legend>{SOCIAL.map((k) => input(k, f.social[k], (v) => setF({ ...f, social: { ...f.social, [k]: v } }), `s-${k}`))}</fieldset>
        <fieldset className="grid gap-4"><legend className="mb-3 text-lg font-semibold">Home page copy (leave blank for defaults)</legend>{HOME.map(([k, l]) => input(l, f.home[k], (v) => setF({ ...f, home: { ...f.home, [k]: v } }), `h-${k}`))}</fieldset>
        {err && <p role="alert" className="text-sm text-red-300">{err}</p>}
        <button className="btn-primary">Save settings</button>
      </form>
    </>
  );
}
