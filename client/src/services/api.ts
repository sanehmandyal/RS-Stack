/**
 * Tiny fetch wrapper. Auth uses an HttpOnly cookie set by the server, so no token is ever stored in
 * localStorage/sessionStorage. The CSRF token is kept in memory only and sent on state-changing requests.
 */
const BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '') ?? '/api';

let csrfToken = '';
export const setCsrfToken = (t: string) => {
  csrfToken = t;
};

export class ApiError extends Error {
  constructor(public status: number, message: string, public issues?: { path: string; message: string }[], public code?: string) {
    super(message);
  }
}

type Opts = { method?: string; body?: unknown; signal?: AbortSignal; raw?: boolean };

export async function api<T = any>(path: string, opts: Opts = {}): Promise<T> {
  const method = opts.method ?? 'GET';
  const headers: Record<string, string> = {};
  let body: BodyInit | undefined;
  if (opts.body instanceof FormData) body = opts.body;
  else if (opts.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(opts.body);
  }
  if (method !== 'GET' && csrfToken) headers['X-CSRF-Token'] = csrfToken;

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body, credentials: 'include', signal: opts.signal });
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw err;
    throw new ApiError(0, 'Network error. Please check your connection and try again.');
  }
  if (opts.raw) {
    if (!res.ok) throw new ApiError(res.status, 'Request failed');
    return res as unknown as T;
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data?.error ?? 'Something went wrong', data?.issues, data?.code);
  return data as T;
}

export const publicApi = {
  settings: () => api('/public/settings'),
  services: () => api('/public/services'),
  service: (slug: string) => api(`/public/services/${encodeURIComponent(slug)}`),
  projects: (category?: string) => api(`/public/projects${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  project: (slug: string) => api(`/public/projects/${encodeURIComponent(slug)}`),
  posts: (params: Record<string, string | number | undefined>) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && v !== '' && q.set(k, String(v)));
    return api(`/public/posts?${q}`);
  },
  post: (slug: string) => api(`/public/posts/${encodeURIComponent(slug)}`),
  categories: () => api('/public/categories'),
  testimonials: () => api('/public/testimonials'),
  faqs: (scope = 'global') => api(`/public/faqs?scope=${encodeURIComponent(scope)}`),
  createLead: (body: unknown) => api('/public/leads', { method: 'POST', body }),
};
