import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';

const KEY = 'rs_cookie_consent_v1';
type Choice = 'accepted' | 'rejected' | null;

function read(): Choice {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'accepted' || v === 'rejected' ? v : null;
  } catch {
    return null;
  }
}

function addScript(src: string, id: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement('script');
  s.id = id;
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

/** Loads analytics / pixel scripts ONLY after the visitor has accepted. Nothing loads before consent. */
function loadTracking(t: { ga: string | null; gtm: string | null; metaPixel: string | null }) {
  const w = window as any;
  if (t.gtm) {
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    addScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(t.gtm)}`, 'gtm-js');
  }
  if (t.ga) {
    w.dataLayer = w.dataLayer || [];
    w.gtag = function () { w.dataLayer.push(arguments); };
    w.gtag('js', new Date());
    w.gtag('config', t.ga, { anonymize_ip: true });
    addScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(t.ga)}`, 'ga-js');
  }
  if (t.metaPixel && !w.fbq) {
    const n: any = (w.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); });
    if (!w._fbq) w._fbq = n;
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
    addScript('https://connect.facebook.net/en_US/fbevents.js', 'fb-js');
    w.fbq('init', t.metaPixel);
    w.fbq('track', 'PageView');
  }
}

/** Fire a conversion event if (and only if) tracking was enabled by consent. */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  const w = window as any;
  if (read() !== 'accepted') return;
  try {
    if (w.gtag) w.gtag('event', name, params);
    if (w.dataLayer && !w.gtag) w.dataLayer.push({ event: name, ...params });
    if (w.fbq && name === 'generate_lead') w.fbq('track', 'Lead');
  } catch { /* tracking must never break the page */ }
}

export function CookieConsent() {
  const { tracking } = useSettings();
  const hasTrackers = Boolean(tracking.ga || tracking.gtm || tracking.metaPixel);
  const [choice, setChoice] = useState<Choice>(() => read());

  useEffect(() => {
    if (choice === 'accepted' && hasTrackers) loadTracking(tracking);
  }, [choice, hasTrackers, tracking]);

  const save = (c: Exclude<Choice, null>) => {
    try { localStorage.setItem(KEY, c); } catch { /* private mode: keep in memory only */ }
    setChoice(c);
  };

  // Nothing to ask about unless analytics / advertising tags are configured.
  if (!hasTrackers || choice) return null;
  return (
    <div role="dialog" aria-live="polite" aria-label="Cookie preferences" className="glass-strong fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-2xl p-4 sm:p-5">
      <p className="text-sm text-muted">
        We would like to use analytics and advertising cookies to understand how the site is used and to measure our marketing. They stay off unless you accept. See our{' '}
        <Link to="/cookie-policy" className="text-secondary underline">Cookie Policy</Link>.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="btn-primary btn-sm" onClick={() => save('accepted')}>Accept</button>
        <button className="btn-ghost btn-sm" onClick={() => save('rejected')}>Reject</button>
      </div>
    </div>
  );
}
