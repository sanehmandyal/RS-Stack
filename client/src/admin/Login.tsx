import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Logo } from '../components/ui';
import { api, ApiError } from '../services/api';
import { useAuth } from './auth';

function Shell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="grid min-h-dvh place-items-center px-4">
      <div className="glass-strong w-full max-w-md rounded-3xl p-6 sm:p-8">
        <Logo className="mb-6" /><h1 className="mb-5 text-2xl">{title}</h1>{children}
      </div>
    </div>
  );
}
const Err = ({ msg }: { msg: string }) => (msg ? <p role="alert" className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{msg}</p> : null);

export function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/admin/dashboard" replace />;
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true); setError('');
    try { await login(email, password); nav('/admin/dashboard'); }
    catch (err) { const a = err as ApiError; setError(a.status === 429 ? 'Too many attempts. Please wait and try again.' : a.status === 401 ? 'Invalid email or password.' : 'Could not sign in. Please try again.'); }
    finally { setBusy(false); }
  };
  return (
    <Shell title="Admin sign in">
      <form onSubmit={submit} className="space-y-4">
        <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" required autoComplete="username" className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div><label className="label" htmlFor="password">Password</label><input id="password" type="password" required autoComplete="current-password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <Err msg={error} />
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <p className="text-center text-sm"><Link to="/admin/forgot-password" className="text-secondary underline">Forgot password?</Link></p>
      </form>
    </Shell>
  );
}

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try { await api('/admin/auth/forgot-password', { method: 'POST', body: { email } }); setDone(true); } catch (err) { setError((err as ApiError).status === 429 ? 'Too many requests. Please wait.' : 'Please enter a valid email.'); }
  };
  return (
    <Shell title="Reset your password">
      {done ? <p className="text-muted">If that account exists, a reset link has been sent. The link is single-use and expires shortly.</p> : (
        <form onSubmit={submit} className="space-y-4">
          <div><label className="label" htmlFor="fe">Email</label><input id="fe" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <Err msg={error} /><button className="btn-primary w-full">Send reset link</button>
        </form>
      )}
      <p className="mt-4 text-center text-sm"><Link to="/admin/login" className="text-secondary underline">Back to sign in</Link></p>
    </Shell>
  );
}

export function ResetPassword() {
  const [sp] = useSearchParams();
  const token = sp.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setError('');
    try { await api('/admin/auth/reset-password', { method: 'POST', body: { token, password } }); setDone(true); }
    catch (err) { const a = err as ApiError; setError(a.issues?.[0]?.message ?? 'This link is invalid or has expired.'); }
  };
  return (
    <Shell title="Choose a new password">
      {done ? <p className="text-muted">Password updated. <Link to="/admin/login" className="text-secondary underline">Sign in</Link>.</p> : (
        <form onSubmit={submit} className="space-y-4">
          <div><label className="label" htmlFor="np">New password</label><input id="np" type="password" required minLength={12} autoComplete="new-password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} /><p className="mt-1 text-xs text-muted">At least 12 characters.</p></div>
          <Err msg={error} /><button className="btn-primary w-full">Update password</button>
        </form>
      )}
    </Shell>
  );
}
