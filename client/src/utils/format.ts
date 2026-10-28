export const fmtDate = (d?: string | Date | null) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

export const fmtDateTime = (d?: string | Date | null) =>
  d ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';

export const titleCase = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/** Builds a wa.me click-to-chat link. Returns null unless a valid digits-only number is configured. */
export function whatsappLink(number?: string, text = 'Hello RS Stack, I would like to know more about your services.') {
  const digits = (number ?? '').replace(/\D/g, '');
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export const toIsoOrNull = (v: string) => (v ? new Date(v).toISOString() : null);
export const toDateInput = (v?: string | null) => (v ? new Date(v).toISOString().slice(0, 10) : '');
