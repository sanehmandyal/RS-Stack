import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiError, setCsrfToken } from '../services/api';
import { PageTitle } from './ui';
import { useAuth } from './auth';

export default function ChangePassword({ forced }: { forced?: boolean }) {
  const { refresh } = useAuth();
  const nav = useNavigate();
  const [cur, setCur] = useState('');
  const [next, setNext] = useState('');
  const [error, setError] = useState('');
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setError('');
    try {
      await api('/admin/auth/change-password', { method: 'POST', body: { currentPassword: cur, newPassword: next } });
      setCsrfToken(''); // every session is revoked on change
      await refresh();
      nav('/admin/login');
    } catch (err) { const a = err as ApiError; setError(a.issues?.[0]?.message ?? a.message); }
  };
  const form = (
    <form onSubmit={submit} className="glass max-w-md space-y-4 rounded-2xl p-6">
      {forced && <p className="rounded-xl border border-amber-300/30 bg-amber-300/10 p-3 text-sm text-amber-100">You must set a new password before continuing.</p>}
      <div><label className="label" htmlFor="cp">Current password</label><input id="cp" type="password" required autoComplete="current-password" className="input" value={cur} onChange={(e) => setCur(e.target.value)} /></div>
      <div><label className="label" htmlFor="nn">New password (min. 12 characters)</label><input id="nn" type="password" required minLength={12} autoComplete="new-password" className="input" value={next} onChange={(e) => setNext(e.target.value)} /></div>
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      <button className="btn-primary">Change password</button>
      <p className="text-xs text-muted">You will be signed out everywhere and asked to sign in again.</p>
    </form>
  );
  return forced ? <div className="grid min-h-dvh place-items-center p-4">{form}</div> : <><PageTitle title="Account" />{form}</>;
}
