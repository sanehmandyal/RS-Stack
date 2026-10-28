/**
 * Tiny fetch wrapper. Auth uses an HttpOnly cookie set by the server, so no token is ever stored in
 * localStorage/sessionStorage. The CSRF token is kept in memory only and sent on state-changing requests.
 */
const envUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '');
const BASE = envUrl
    ? (envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`)
    : '/api';
let csrfToken = '';
export const setCsrfToken = (t) => {
    csrfToken = t;
};
let authToken = '';
export const setAuthToken = (t) => {
    authToken = t;
    try {
        if (t)
            sessionStorage.setItem('rs_admin_token', t);
        else
            sessionStorage.removeItem('rs_admin_token');
    }
    catch { }
};
export const getAuthToken = () => {
    if (authToken)
        return authToken;
    try {
        return sessionStorage.getItem('rs_admin_token') || '';
    }
    catch {
        return '';
    }
};
export class ApiError extends Error {
    status;
    issues;
    code;
    constructor(status, message, issues, code) {
        super(message);
        this.status = status;
        this.issues = issues;
        this.code = code;
    }
}
export async function api(path, opts = {}) {
    const method = opts.method ?? 'GET';
    const headers = {};
    let body;
    if (opts.body instanceof FormData)
        body = opts.body;
    else if (opts.body !== undefined) {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(opts.body);
    }
    if (method !== 'GET' && csrfToken)
        headers['X-CSRF-Token'] = csrfToken;
    const bearer = getAuthToken();
    if (bearer)
        headers['Authorization'] = `Bearer ${bearer}`;
    let res;
    try {
        res = await fetch(`${BASE}${path}`, { method, headers, body, credentials: 'include', signal: opts.signal });
    }
    catch (err) {
        if (err.name === 'AbortError')
            throw err;
        throw new ApiError(0, 'Network error. Please check your connection and try again.');
    }
    if (opts.raw) {
        if (!res.ok)
            throw new ApiError(res.status, 'Request failed');
        return res;
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok)
        throw new ApiError(res.status, data?.error ?? 'Something went wrong', data?.issues, data?.code);
    return data;
}
export const publicApi = {
    settings: () => api('/public/settings'),
    services: () => api('/public/services'),
    service: (slug) => api(`/public/services/${encodeURIComponent(slug)}`),
    projects: (category) => api(`/public/projects${category ? `?category=${encodeURIComponent(category)}` : ''}`),
    project: (slug) => api(`/public/projects/${encodeURIComponent(slug)}`),
    posts: (params) => {
        const q = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => v !== undefined && v !== '' && q.set(k, String(v)));
        return api(`/public/posts?${q}`);
    },
    post: (slug) => api(`/public/posts/${encodeURIComponent(slug)}`),
    categories: () => api('/public/categories'),
    testimonials: () => api('/public/testimonials'),
    faqs: (scope = 'global') => api(`/public/faqs?scope=${encodeURIComponent(scope)}`),
    createLead: (body) => api('/public/leads', { method: 'POST', body }),
};
