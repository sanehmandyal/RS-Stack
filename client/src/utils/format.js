export const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
export const fmtDateTime = (d) => d ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';
export const titleCase = (s) => s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
/** Builds a wa.me click-to-chat link. Returns null unless a valid digits-only number is configured. */
export function whatsappLink(number, text = 'Hello RS Stack, I would like to know more about your services.') {
    const digits = (number ?? '').replace(/\D/g, '');
    if (digits.length < 8)
        return null;
    return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
export const toIsoOrNull = (v) => (v ? new Date(v).toISOString() : null);
export const toDateInput = (v) => (v ? new Date(v).toISOString().slice(0, 10) : '');
