import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import { Logo } from '../components/ui';
import { api, ApiError } from '../services/api';
import { useAuth } from './auth';

function Shell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="relative min-h-dvh flex flex-col justify-center items-center px-4 py-12 overflow-hidden bg-[#0A0D14]">
      {/* Dynamic ambient lighting & reflective background mesh */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[32rem] w-[32rem] rounded-full bg-gradient-to-tr from-primary/25 via-indigo-500/20 to-secondary/20 blur-[130px]" />
        <div className="absolute bottom-10 -right-20 h-72 w-72 rounded-full bg-secondary/15 blur-[100px]" />
        <div className="absolute -bottom-10 -left-20 h-72 w-72 rounded-full bg-primary/15 blur-[100px]" />
        <div className="absolute inset-0 grid-bg opacity-30" />
      </div>

      {/* Top Header Row with Back to Website Button */}
      <div className="relative z-10 w-full max-w-md mb-4 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-muted hover:text-white px-3.5 py-2 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.1] hover:border-white/25 backdrop-blur-xl shadow-lg transition duration-200 group"
          title="Return to the RS Stack homepage"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-secondary transition-transform group-hover:-translate-x-1" />
          <span>Back to site</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[11px] font-medium tracking-wide">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Secure Admin
        </span>
      </div>

      {/* Reflective Glossy Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Ambient aura glow behind card */}
        <div className="absolute -inset-0.5 rounded-[2.2rem] bg-gradient-to-r from-primary/40 via-secondary/25 to-indigo-500/40 blur-xl opacity-75" />

        <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-surface/90 backdrop-blur-2xl p-7 sm:p-9 shadow-2xl ring-1 ring-white/15">
          {/* Top specular highlight reflection line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          {/* Subtle glossy glass reflection gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-transparent" />

          <div className="relative z-10">
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <div className="rounded-xl border border-white/15 bg-white/[0.07] p-2 text-secondary shadow-inner">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}

            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>

      {/* Subtle footer label */}
      <p className="relative z-10 mt-8 text-center text-xs text-muted/60">
        RS Stack Management Portal • Phase 5, Mohali
      </p>
    </div>
  );
}

const Err = ({ msg }: { msg: string }) =>
  msg ? (
    <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
      <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
      <span>{msg}</span>
    </div>
  ) : null;

export function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/admin/dashboard" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email, password);
      nav('/admin/dashboard');
    } catch (err) {
      const a = err as ApiError;
      setError(
        a.status === 429
          ? 'Too many login attempts. Please wait a moment and try again.'
          : a.status === 401
          ? 'Invalid email or password.'
          : 'Could not sign in. Please verify your connection.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell title="Admin sign in" subtitle="Enter your credentials to access the management portal">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label text-xs font-semibold uppercase tracking-wider text-muted" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="username"
            placeholder="admin@rs-stack.com"
            className="input text-white bg-white/[0.05] border-white/15 focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted/40 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label text-xs font-semibold uppercase tracking-wider text-muted mb-0" htmlFor="password">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-muted hover:text-secondary transition inline-flex items-center gap-1 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-3.5 w-3.5 text-secondary" /> : <Eye className="h-3.5 w-3.5" />}
              <span>{showPassword ? 'Hide' : 'Show'}</span>
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="••••••••••••"
              className="input pr-11 text-white bg-white/[0.05] border-white/15 focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted/40 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-white transition focus:outline-none rounded-lg"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4 text-secondary" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Err msg={error} />

        <button
          type="submit"
          className="btn-primary w-full py-3 text-base font-semibold rounded-xl bg-gradient-to-r from-primary via-primary to-indigo-600 hover:from-primary-600 hover:to-indigo-500 shadow-[0_0_25px_rgba(121,91,255,0.35)] hover:shadow-[0_0_35px_rgba(121,91,255,0.55)] transition-all duration-200 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
          disabled={busy}
        >
          {busy ? (
            <>
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Signing in…</span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              <span>Sign in</span>
            </>
          )}
        </button>

        <p className="text-center text-sm pt-2">
          <Link to="/admin/forgot-password" className="text-secondary hover:text-secondary-400 hover:underline transition">
            Forgot password?
          </Link>
        </p>
      </form>
    </Shell>
  );
}

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/admin/auth/forgot-password', { method: 'POST', body: { email } });
      setDone(true);
    } catch (err) {
      setError((err as ApiError).status === 429 ? 'Too many requests. Please wait a moment.' : 'Please enter a valid email.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell title="Reset your password" subtitle="We will send a secure link to your email">
      {done ? (
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <p className="text-sm text-muted leading-relaxed">
            If that account exists, a single-use password reset link has been dispatched to your inbox.
          </p>
          <Link to="/admin/login" className="btn-ghost inline-flex w-full justify-center">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label text-xs font-semibold uppercase tracking-wider text-muted" htmlFor="fe">
              Registered email
            </label>
            <input
              id="fe"
              type="email"
              required
              placeholder="admin@rs-stack.com"
              className="input text-white bg-white/[0.05] border-white/15 focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted/40 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Err msg={error} />

          <button type="submit" className="btn-primary w-full py-3 font-semibold" disabled={busy}>
            {busy ? 'Sending link…' : 'Send reset link'}
          </button>

          <p className="mt-4 text-center text-sm">
            <Link to="/admin/login" className="text-secondary hover:underline">
              Back to sign in
            </Link>
          </p>
        </form>
      )}
    </Shell>
  );
}

export function ResetPassword() {
  const [sp] = useSearchParams();
  const token = sp.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/admin/auth/reset-password', { method: 'POST', body: { token, password } });
      setDone(true);
    } catch (err) {
      const a = err as ApiError;
      setError(a.issues?.[0]?.message ?? 'This reset link is invalid or has expired.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell title="Choose new password" subtitle="Must be at least 12 characters long">
      {done ? (
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <p className="text-sm text-muted">Your password has been successfully updated.</p>
          <Link to="/admin/login" className="btn-primary inline-flex w-full justify-center">
            Sign in now
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label text-xs font-semibold uppercase tracking-wider text-muted mb-0" htmlFor="np">
                New password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-muted hover:text-secondary transition inline-flex items-center gap-1 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5 text-secondary" /> : <Eye className="h-3.5 w-3.5" />}
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <div className="relative">
              <input
                id="np"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={12}
                autoComplete="new-password"
                placeholder="••••••••••••"
                className="input pr-11 text-white bg-white/[0.05] border-white/15 focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted/40 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-white transition focus:outline-none rounded-lg"
              >
                {showPassword ? <EyeOff className="h-4 w-4 text-secondary" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-1 text-xs text-muted">Minimum 12 characters including mixed cases & numbers.</p>
          </div>

          <Err msg={error} />

          <button type="submit" className="btn-primary w-full py-3 font-semibold" disabled={busy}>
            {busy ? 'Updating…' : 'Update password'}
          </button>
        </form>
      )}
    </Shell>
  );
}
