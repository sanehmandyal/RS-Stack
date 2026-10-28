import { Search, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { CardSkeletons, EmptyState, ErrorState, PageHero, Section } from '../components/ui';
import { fallbackBlogPosts } from '../data/fallbackData';
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
  const set = (patch: Record<string, string>) => {
    const n = new URLSearchParams(sp);
    Object.entries(patch).forEach(([k, v]) => (v ? n.set(k, v) : n.delete(k)));
    if (!('page' in patch)) n.delete('page');
    setSp(n);
  };

  const rawItems = posts.data?.items;
  const postsList = rawItems && rawItems.length > 0 ? rawItems : fallbackBlogPosts;

  return (
    <>
      <Seo
        title="Blog & Practical Digital Growth Guides | RS Stack"
        description="Actionable insights on website engineering, Google Business Profile ranking, local SEO, and digital marketing for growing businesses."
        path="/blog"
        noindex={page > 1 || !!q}
      />
      <PageHero
        eyebrow="Knowledge & Insights"
        title="Evidence-Based Guides for Growing Businesses"
        text="Actionable blueprints on search visibility, modern web engineering, and client acquisition."
      />
      <Section className="pt-4">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            set({ q: term.trim() });
          }}
          className="mb-6 flex max-w-md gap-2"
        >
          <label htmlFor="blog-search" className="sr-only">
            Search articles
          </label>
          <input
            id="blog-search"
            className="input"
            placeholder="Search guides (e.g. SEO, Speed, MERN)…"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
          <button className="btn-primary" aria-label="Search">
            <Search className="h-4 w-4" />
          </button>
        </form>

        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Categories">
          <button
            aria-pressed={!category}
            className={`btn btn-sm ${
              !category ? 'bg-primary text-white shadow-glow' : 'border border-white/80 bg-white/70 text-muted hover:text-ink'
            }`}
            onClick={() => set({ category: '' })}
          >
            All Guides
          </button>
          {cats.data?.items.map((c) => (
            <button
              key={c.slug}
              aria-pressed={category === c.slug}
              className={`btn btn-sm ${
                category === c.slug ? 'bg-primary text-white shadow-glow' : 'border border-white/80 bg-white/70 text-muted hover:text-ink'
              }`}
              onClick={() => set({ category: c.slug })}
            >
              {c.name}
            </button>
          ))}
        </div>

        {posts.loading && !postsList.length && <CardSkeletons n={3} />}
        {posts.error && !postsList.length && <ErrorState error={posts.error} onRetry={posts.reload} />}

        {postsList.length === 0 && (
          <EmptyState title="No articles found" text="Try a different search or category." />
        )}

        {postsList.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {postsList.map((p: any) => (
              <article key={p.slug}>
                <Link
                  to={`/blog/${p.slug}`}
                  className="card card-hover group flex h-full flex-col overflow-hidden p-0"
                >
                  {p.coverImage && (
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                      <img
                        src={p.coverImage}
                        alt={p.coverImageAlt || p.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-80" />
                      {p.category && (
                        <span className="absolute bottom-3 left-4 chip bg-black/60 backdrop-blur-md border-white/20 text-white font-medium">
                          {p.category}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-xs text-muted">
                      {fmtDate(p.publishedAt)} · {p.readingMinutes || 5} min read
                    </p>
                    <h2 className="mt-2 text-lg font-bold group-hover:text-secondary transition">
                      {p.title}
                    </h2>
                    <p className="mt-2 text-sm text-muted leading-relaxed flex-1">{p.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-secondary">
                      Read Guide <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {posts.data && posts.data.pages > 1 && (
          <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-3">
            <button
              className="btn-ghost btn-sm"
              disabled={page <= 1}
              onClick={() => set({ page: String(page - 1) })}
            >
              Previous
            </button>
            <span className="text-sm text-muted">
              Page {page} of {posts.data.pages}
            </span>
            <button
              className="btn-ghost btn-sm"
              disabled={page >= posts.data.pages}
              onClick={() => set({ page: String(page + 1) })}
            >
              Next
            </button>
          </nav>
        )}
      </Section>
    </>
  );
}
