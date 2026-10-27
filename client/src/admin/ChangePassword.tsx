import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { api, ApiError, setCsrfToken } from '../services/api';
import { PageTitle } from './ui';
import { useAuth } from './auth';

export default function ChangePassword({ forced }: { forced?: boolean }) {
  const { refresh } = useAuth();
  const nav = useNavigate();
  const [cur, setCur] = useState('');
  const [next, setNext] = useState('');
  const [showCur, setShowCur] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api('/admin/auth/change-password', { method: 'POST', body: { currentPassword: cur, newPassword: next } });
      setCsrfToken(''); // every session is revoked on change
      await refresh();
      nav('/admin/login');
    } catch (err) {
      const a = err as ApiError;
      setError(a.issues?.[0]?.message ?? a.message);
    } finally {
      setBusy(false);
    }
  };

  const form = (
    <form onSubmit={submit} className="glass-strong max-w-md space-y-4 rounded-2xl p-6 sm:p-7 border border-slate-200 bg-white shadow-xl">
      {forced && (
        <p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
          You must set a new password before continuing.
        </p>
      )}

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="label text-xs font-semibold uppercase tracking-wider text-slate-700 mb-0" htmlFor="cp">
            Current password
          </label>
          <button
            type="button"
            onClick={() => setShowCur(!showCur)}
            className="text-xs text-muted hover:text-primary transition inline-flex items-center gap-1 focus:outline-none"
          >
            {showCur ? <EyeOff className="h-3.5 w-3.5 text-primary" /> : <Eye className="h-3.5 w-3.5" />}
            <span>{showCur ? 'Hide' : 'Show'}</span>
          </button>
        </div>
        <div className="relative">
          <input
            id="cp"
            type={showCur ? 'text' : 'password'}
            required
            autoComplete="current-password"
            className="input pr-11 text-ink bg-slate-50 border-slate-300 focus:bg-white focus:border-primary transition"
            value={cur}
            onChange={(e) => setCur(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowCur(!showCur)}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-primary transition focus:outline-none rounded-lg"
          >
            {showCur ? <EyeOff className="h-4 w-4 text-primary" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="label text-xs font-semibold uppercase tracking-wider text-slate-700 mb-0" htmlFor="nn">
            New password
          </label>
          <button
            type="button"
            onClick={() => setShowNext(!showNext)}
            className="text-xs text-muted hover:text-primary transition inline-flex items-center gap-1 focus:outline-none"
          >
            {showNext ? <EyeOff className="h-3.5 w-3.5 text-primary" /> : <Eye className="h-3.5 w-3.5" />}
            <span>{showNext ? 'Hide' : 'Show'}</span>
          </button>
        </div>
        <div className="relative">
          <input
            id="nn"
            type={showNext ? 'text' : 'password'}
            required
            minLength={12}
            autoComplete="new-password"
            className="input pr-11 text-ink bg-slate-50 border-slate-300 focus:bg-white focus:border-primary transition"
            value={next}
            onChange={(e) => setNext(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowNext(!showNext)}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-primary transition focus:outline-none rounded-lg"
          >
            {showNext ? <EyeOff className="h-4 w-4 text-primary" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <p className="mt-1 text-xs text-muted">At least 12 characters.</p>
      </div>

      {error && <p role="alert" className="text-sm text-red-700 rounded-lg bg-red-50 border border-red-200 p-2.5">{error}</p>}

      <button type="submit" className="btn-primary w-full py-2.5 font-semibold flex items-center justify-center gap-2" disabled={busy}>
        <Lock className="h-4 w-4" />
        <span>{busy ? 'Updating…' : 'Change password'}</span>
      </button>
      <p className="text-xs text-muted text-center">You will be signed out everywhere and asked to sign in again.</p>
    </form>
  );

  return forced ? (
    <div className="grid min-h-dvh place-items-center p-4 bg-bg">{form}</div>
  ) : (
    <>
      <PageTitle title="Account" />
      {form}
    </>
  );
}
