import { useEffect, useState } from 'react';
import { ErrorState, Skeleton } from '../components/ui';
import { fallbackSettings } from '../data/fallbackData';
import { useFetch } from '../hooks/useFetch';
import { api } from '../services/api';
import { useToast } from './toast';
import { PageTitle } from './ui';
const TOP = [['businessName', 'Business name'], ['tagline', 'Tagline'], ['contactEmail', 'Contact email'], ['phone', 'Phone'], ['whatsappNumber', 'WhatsApp number (digits only, with country code)'], ['address', 'Address']];
const SOCIAL = ['facebook', 'instagram', 'linkedin', 'x', 'youtube'];
const HOME = [['heroHeadline', 'Hero headline'], ['heroSubheadline', 'Hero sub-headline'], ['primaryCta', 'Primary button'], ['secondaryCta', 'Secondary button'], ['finalCtaTitle', 'Final CTA title'], ['finalCtaText', 'Final CTA text']];
export default function SettingsPage() {
    const toast = useToast();
    const { data, loading, error, reload } = useFetch(() => api('/admin/settings'), []);
    const [f, setF] = useState(null);
    const [err, setErr] = useState('');
    useEffect(() => {
        const src = data || fallbackSettings;
        if (src) {
            setF({
                ...Object.fromEntries(TOP.map(([k]) => [k, src[k] ?? fallbackSettings[k] ?? ''])),
                social: { ...fallbackSettings.social, ...src.social },
                home: { ...fallbackSettings.home, ...src.home }
            });
        }
    }, [data]);
    if (loading && !f)
        return <Skeleton className="h-64"/>;
    if (!f && error)
        return <ErrorState error={error} onRetry={reload}/>;
    if (!f)
        return <Skeleton className="h-64"/>;
    const save = async (e) => {
        e.preventDefault();
        setErr('');
        try {
            const clean = (o) => Object.fromEntries(Object.entries(o ?? {}).filter(([, v]) => v !== '' && v != null));
            await api('/admin/settings', { method: 'PUT', body: { ...f, social: clean(f.social), home: clean(f.home) } });
            toast('ok', 'Settings saved');
            reload();
        }
        catch (x) {
            const a = x;
            setErr(a.issues?.map((i) => `${i.path}: ${i.message}`).join('; ') || a.message);
        }
    };
    const input = (label, value, on, id) => (<div key={id}><label className="label" htmlFor={id}>{label}</label><input id={id} className="input" value={value ?? ''} onChange={(e) => on(e.target.value)}/></div>);
    return (<>
      <PageTitle title="Site settings"/>
      <form onSubmit={save} className="glass max-w-3xl space-y-8 rounded-2xl p-6">
        <fieldset className="grid gap-4 sm:grid-cols-2"><legend className="mb-3 text-lg font-semibold">Business & contact</legend>{TOP.map(([k, l]) => input(l, f[k], (v) => setF({ ...f, [k]: v }), k))}</fieldset>
        <fieldset className="grid gap-4 sm:grid-cols-2"><legend className="mb-3 text-lg font-semibold">Social links (https://…)</legend>{SOCIAL.map((k) => input(k, f.social[k], (v) => setF({ ...f, social: { ...f.social, [k]: v } }), `s-${k}`))}</fieldset>
        <fieldset className="grid gap-4"><legend className="mb-3 text-lg font-semibold">Home page copy (leave blank for defaults)</legend>{HOME.map(([k, l]) => input(l, f.home[k], (v) => setF({ ...f, home: { ...f.home, [k]: v } }), `h-${k}`))}</fieldset>
        {err && <p role="alert" className="text-sm text-red-300">{err}</p>}
        <button className="btn-primary">Save settings</button>
      </form>
    </>);
}
