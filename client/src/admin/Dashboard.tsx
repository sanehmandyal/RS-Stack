import { Link } from 'react-router-dom';
import { EmptyState, ErrorState, Skeleton } from '../components/ui';
import { useFetch } from '../hooks/useFetch';
import { api } from '../services/api';
import { fmtDateTime } from '../utils/format';
import { PageTitle } from './ui';

const Stat = ({ label, value, to }: { label: string; value: number; to?: string }) => {
  const inner = <><p className="text-xs uppercase tracking-wide text-muted">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></>;
  return to ? <Link to={to} className="card card-hover">{inner}</Link> : <div className="card">{inner}</div>;
};

function TrendChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((a, d) => a + d.count, 0);
  const w = 600, h = 140, bw = w / data.length;
  return (
    <figure>
      <svg viewBox={`0 0 ${w} ${h + 18}`} role="img" aria-label={`Inquiries per day for the last 30 days. Total ${total}.`} className="h-auto w-full">
        {data.map((d, i) => {
          const bh = (d.count / max) * h;
          return <rect key={d.date} x={i * bw + 2} y={h - bh} width={bw - 4} height={Math.max(bh, d.count ? 2 : 1)} rx="2" fill={d.count ? '#1D4ED8' : '#E2E8F0'}><title>{`${d.date}: ${d.count}`}</title></rect>;
        })}
        <text x="0" y={h + 14} fontSize="10" fill="#64748B">{data[0]?.date}</text>
        <text x={w} y={h + 14} fontSize="10" textAnchor="end" fill="#64748B">{data[data.length - 1]?.date}</text>
      </svg>
      <figcaption className="sr-only">Daily inquiry counts for the last 30 days; peak {max}.</figcaption>
    </figure>
  );
}

export default function Dashboard() {
  const { data, loading, error, reload } = useFetch<any>(() => api('/admin/dashboard'), []);
  if (loading) return <Skeleton className="h-64" />;
  if (error || !data) return <ErrorState error={error ?? new Error('No data')} onRetry={reload} />;
  const l = data.leads;
  return (
    <>
      <PageTitle title="Dashboard" />
      <p className="mb-4 text-xs text-muted">All figures come from your database. Nothing here is estimated or sample data.</p>
      {l && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <Stat label="Total inquiries" value={l.total} to="/admin/leads" />
            <Stat label="New" value={l.new} to="/admin/leads?status=new" />
            <Stat label="In progress" value={l.inProgress} />
            <Stat label="Qualified" value={l.qualified} to="/admin/leads?status=qualified" />
            <Stat label="Converted" value={l.converted} to="/admin/leads?status=won" />
            <Stat label="Lost" value={l.lost} />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <section className="card lg:col-span-2" aria-labelledby="trend"><h2 id="trend" className="mb-4 text-lg">Inquiries, last 30 days</h2>{l.total === 0 ? <EmptyState title="No inquiries yet" text="They will appear here once someone submits the contact form." /> : <TrendChart data={l.trend} />}</section>
            <section className="card" aria-labelledby="src"><h2 id="src" className="mb-4 text-lg">Lead sources</h2>
              {l.sources.length === 0 ? <p className="text-sm text-muted">No data yet.</p> : <ul className="space-y-2 text-sm">{l.sources.map((s: any) => <li key={s.source} className="flex justify-between gap-3"><span className="truncate text-muted">{s.source}</span><span className="font-semibold">{s.count}</span></li>)}</ul>}
            </section>
          </div>
        </>
      )}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {data.content && <section className="card"><h2 className="mb-3 text-lg">Content</h2><p className="text-sm text-muted">Published projects: <b className="text-ink">{data.content.publishedProjects}</b></p><p className="text-sm text-muted">Published blog posts: <b className="text-ink">{data.content.publishedPosts}</b></p></section>}
        {data.recentActivity && <section className="card"><h2 className="mb-3 text-lg">Recent activity</h2>{data.recentActivity.length === 0 ? <p className="text-sm text-muted">No activity yet.</p> : <ul className="space-y-2 text-sm">{data.recentActivity.map((a: any) => <li key={a._id} className="flex justify-between gap-3"><span>{a.action} <span className="text-muted">{a.actorEmail}</span></span><span className="shrink-0 text-xs text-muted">{fmtDateTime(a.createdAt)}</span></li>)}</ul>}</section>}
      </div>
      {!l && !data.content && <EmptyState title="Welcome" text="Use the menu to open the areas you have access to." />}
    </>
  );
}
