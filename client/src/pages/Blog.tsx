import { Search } from 'lucide-react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { CardSkeletons, EmptyState, ErrorState, PageHero, Section } from '../components/ui';
import { useFetch } from '../hooks/useFetch';
import { publicApi } from '../services/api';
import { fmtDate } from '../utils/format';

export default function Blog() {
  const [sp, setSp] = useSearchParams();
  const page = Number(sp.get('page') ?? 1) || 1;
  const category = sp.get('category') ?? '';
  const q = sp.get('q') ?? '';
  const [term, setTerm] = useState(q);
  const posts = useFetch<any>(() => publicApi.posts({ page, category, q, limit: 9 }), [page, category, q]);
  const cats = useFetch<{ items: any[] }>(() => publicApi.categories(), []);
  const set = (patch: Record<string, string>) => { const n = new URLSearchParams(sp); Object.entries(patch).forEach(([k, v]) => (v ? n.set(k, v) : n.delete(k))); if (!('page' in patch)) n.delete('page'); setSp(n); };

  return (
    <>
      <Seo title="Blog & Resources | RS Stack" description="Practical guides on websites, local SEO and digital marketing for small business owners." path="/blog" noindex={page > 1 || !!q} />
      <PageHero eyebrow="Blog" title="Practical guides for small business owners" />
      <Section className="pt-4">
        <form role="search" onSubmit={(e) => { e.preventDefault(); set({ q: term.trim() }); }} className="mb-6 flex max-w-md gap-2">
          <label htmlFor="blog-search" className="sr-only">Search articles</label>
          <input id="blog-search" className="input" placeholder="Search articles…" value={term} onChange={(e) => setTerm(e.target.value)} />
          <button className="btn-primary" aria-label="Search"><Search className="h-4 w-4" /></button>
        </form>
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Categories">
          <button aria-pressed={!category} className={`btn btn-sm ${!category ? 'bg-primary text-white' : 'border border-white/15 bg-white/5 text-muted'}`} onClick={() => set({ category: '' })}>All</button>
          {cats.data?.items.map((c) => <button key={c.slug} aria-pressed={category === c.slug} className={`btn btn-sm ${category === c.slug ? 'bg-primary text-white' : 'border border-white/15 bg-white/5 text-muted'}`} onClick={() => set({ category: c.slug })}>{c.name}</button>)}
        </div>
        {posts.loading && <CardSkeletons n={3} />}
        {posts.error && <ErrorState error={posts.error} onRetry={posts.reload} />}
        {posts.data && posts.data.featured?.length > 0 && (
          <div className="mb-10"><h2 className="mb-4 text-xl">Featured</h2><div className="grid gap-5 md:grid-cols-3">{posts.data.featured.map((p: any) => <Link key={p.slug} to={`/blog/${p.slug}`} className="card card-hover block border-primary/30"><h3 className="text-lg">{p.title}</h3><p className="mt-2 text-sm text-muted">{p.excerpt}</p></Link>)}</div></div>
        )}
        {posts.data && posts.data.items.length === 0 && <EmptyState title="No articles found" text="Try a different search or category." />}
        {posts.data && posts.data.items.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.data.items.map((p: any) => (
              <article key={p.slug}><Link to={`/blog/${p.slug}`} className="card card-hover block h-full">
                <p className="text-xs text-muted">{fmtDate(p.publishedAt)} · {p.readingMinutes} min read</p>
                <h2 className="mt-2 text-lg">{p.title}</h2><p className="mt-2 text-sm text-muted">{p.excerpt}</p>
              </Link></article>
            ))}
          </div>
        )}
        {posts.data && posts.data.pages > 1 && (
          <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-3">
            <button className="btn-ghost btn-sm" disabled={page <= 1} onClick={() => set({ page: String(page - 1) })}>Previous</button>
            <span className="text-sm text-muted">Page {page} of {posts.data.pages}</span>
            <button className="btn-ghost btn-sm" disabled={page >= posts.data.pages} onClick={() => set({ page: String(page + 1) })}>Next</button>
          </nav>
        )}
      </Section>
    </>
  );
}
