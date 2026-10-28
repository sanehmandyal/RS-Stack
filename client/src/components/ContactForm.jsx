import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { BUDGETS, BUSINESS_TYPES, contactSchema } from '../schemas/contact';
import { publicApi } from '../services/api';
import { trackEvent } from './Consent';
export function ContactForm({ serviceSlug, source = 'contact-page', compact }) {
    const startedAt = useRef(Date.now());
    const [status, setStatus] = useState('idle');
    const [serverError, setServerError] = useState('');
    const services = useFetch(() => publicApi.services(), []);
    const utm = useMemo(() => {
        const p = new URLSearchParams(window.location.search);
        const u = { source: p.get('utm_source') ?? undefined, medium: p.get('utm_medium') ?? undefined, campaign: p.get('utm_campaign') ?? undefined };
        return u.source || u.medium || u.campaign ? u : undefined;
    }, []);
    const { register, handleSubmit, reset, setError, formState: { errors } } = useForm({
        resolver: zodResolver(contactSchema),
        defaultValues: { services: serviceSlug ? [serviceSlug] : [], preferredContact: 'email', budgetRange: '', website: '' },
    });
    const onSubmit = handleSubmit(async (v) => {
        setStatus('sending');
        setServerError('');
        const payload = { ...v, source, formStartedAt: startedAt.current, utm };
        for (const k of ['phone', 'budgetRange', 'businessName', 'website'])
            if (!payload[k])
                delete payload[k];
        if (!utm)
            delete payload.utm;
        try {
            await publicApi.createLead(payload);
            trackEvent('generate_lead', { source });
            setStatus('done');
            reset();
        }
        catch (e) {
            const err = e;
            err.issues?.forEach((i) => setError(i.path, { message: i.message }));
            setServerError(err.status === 429 ? 'Too many requests. Please wait a few minutes and try again.' : err.status === 0 ? err.message : 'We could not send your message. Please check the details and try again.');
            setStatus('error');
        }
    });
    if (status === 'done') {
        return (<div role="status" className="card flex flex-col items-center gap-3 py-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-300" aria-hidden/>
        <h3 className="text-xl">Thank you. Your enquiry has been received.</h3>
        <p className="text-muted">We will get back to you using your preferred contact method.</p>
        <button className="btn-ghost" onClick={() => setStatus('idle')}>Send another enquiry</button>
      </div>);
    }
    const err = (n) => errors[n]?.message;
    const field = (n) => ({ 'aria-invalid': !!errors[n], 'aria-describedby': errors[n] ? `${n}-err` : undefined });
    const Err = ({ n }) => (err(n) ? <p id={`${n}-err`} className="field-error" role="alert">{err(n)}</p> : null);
    return (<form onSubmit={onSubmit} noValidate className="card space-y-5" aria-label="Contact form">
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className="label" htmlFor="name">Your name *</label><input id="name" className="input" autoComplete="name" {...field('name')} {...register('name')}/><Err n="name"/></div>
        <div><label className="label" htmlFor="businessName">Business name</label><input id="businessName" className="input" autoComplete="organization" {...register('businessName')}/><Err n="businessName"/></div>
        <div><label className="label" htmlFor="email">Email *</label><input id="email" type="email" inputMode="email" className="input" autoComplete="email" {...field('email')} {...register('email')}/><Err n="email"/></div>
        <div><label className="label" htmlFor="phone">Phone / WhatsApp</label><input id="phone" type="tel" inputMode="tel" className="input" autoComplete="tel" {...field('phone')} {...register('phone')}/><Err n="phone"/></div>
        <div>
          <label className="label" htmlFor="businessType">Business type *</label>
          <select id="businessType" className="input" defaultValue="" {...field('businessType')} {...register('businessType')}>
            <option value="" disabled>Select…</option>
            {BUSINESS_TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select><Err n="businessType"/>
        </div>
        <div>
          <label className="label" htmlFor="budgetRange">Budget range (optional)</label>
          <select id="budgetRange" className="input" {...register('budgetRange')}>
            <option value="">Prefer not to say</option>
            {BUDGETS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>

      {!compact && (<fieldset>
          <legend className="label">Services you need</legend>
          {services.loading ? <p className="text-sm text-muted">Loading services…</p> : (<div className="grid max-h-56 gap-2 overflow-y-auto rounded-xl border border-white/10 p-3 sm:grid-cols-2">
              {(services.data?.items ?? []).map((s) => (<label key={s.slug} className="flex min-h-[36px] items-center gap-2 text-sm text-muted">
                  <input type="checkbox" value={s.slug} className="h-4 w-4 accent-primary" {...register('services')}/> {s.title}
                </label>))}
            </div>)}
        </fieldset>)}

      <div><label className="label" htmlFor="message">Tell us about your project *</label><textarea id="message" rows={5} className="input" {...field('message')} {...register('message')}/><Err n="message"/></div>

      <fieldset>
        <legend className="label">Preferred contact method</legend>
        <div className="flex flex-wrap gap-4 text-sm text-muted">
          {['email', 'phone', 'whatsapp'].map((m) => (<label key={m} className="flex min-h-[36px] items-center gap-2 capitalize"><input type="radio" value={m} className="accent-primary" {...register('preferredContact')}/> {m}</label>))}
        </div>
      </fieldset>

      {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label>Website<input type="text" tabIndex={-1} autoComplete="off" {...register('website')}/></label>
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-muted">
          <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-primary" {...field('consent')} {...register('consent')}/>
          <span>I agree to RS Stack storing my details to respond to this enquiry, as described in the <Link to="/privacy-policy" className="text-secondary underline">Privacy Policy</Link>. *</span>
        </label><Err n="consent"/>
      </div>

      {serverError && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{serverError}</p>}
      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Request free consultation'}</button>
      <p className="text-xs text-muted">We never guarantee specific rankings, leads or sales. We will reply with an honest view of what is realistic.</p>
    </form>);
}
