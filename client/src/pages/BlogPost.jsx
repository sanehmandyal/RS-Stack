import { Link, useParams } from 'react-router-dom';
import { Seo, breadcrumbLd } from '../components/Seo';
import { Breadcrumbs, Section, Skeleton } from '../components/ui';
import { fallbackBlogPosts } from '../data/fallbackData';
import { useFetch } from '../hooks/useFetch';
import { publicApi } from '../services/api';
import { fmtDate } from '../utils/format';
import NotFound from './NotFound';
export default function BlogPostPage() {
    const { slug = '' } = useParams();
    const { data, loading, error, reload } = useFetch(() => publicApi.post(slug), [slug]);
    const fallbackPost = fallbackBlogPosts.find((p) => p.slug === slug);
    if (loading && !fallbackPost) {
        return (<div className="px-4 pt-40">
        <div className="mx-auto max-w-3xl space-y-4">
          <Skeleton className="h-12"/>
          <Skeleton className="h-64"/>
        </div>
      </div>);
    }
    const p = data?.post || fallbackPost;
    if (!p)
        return <NotFound />;
    const path = `/blog/${p.slug}`;
    const url = `${window.location.origin}${path}`;
    const share = [
        ['LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`],
        ['X', `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(p.title)}`],
        ['Facebook', `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`],
    ];
    const bodyHtml = p.bodyHtml ||
        `<p class="lead">${p.excerpt}</p>
    <p>In modern digital acquisition, every fraction of a second and every search touchpoint directly impacts your customer acquisition costs. At RS Stack, we architect high-performance websites and dominate local search rankings across Mohali, Chandigarh, and worldwide.</p>
    <h2>Strategic Implementation Framework</h2>
    <p>Deploying evidence-based technical SEO and clean code ensures your business captures high-intent customers at the exact moment they are looking for your services.</p>
    <ul>
      <li>Optimized for Google Core Web Vitals and sub-second mobile rendering.</li>
      <li>Full source code and complete digital asset ownership with zero proprietary lock-in.</li>
      <li>Structured LocalBusiness and Service schema markup for maximum search visibility.</li>
    </ul>`;
    const relatedArticles = data?.related?.length
        ? data.related
        : fallbackBlogPosts.filter((x) => x.slug !== p.slug);
    return (<>
      <Seo title={p.metaTitle || `${p.title} | RS Stack`} description={p.metaDescription || p.excerpt || p.title} path={path} type="article" image={p.coverImage || undefined} jsonLd={[{ '@context': 'https://schema.org', '@type': 'Article', headline: p.title, datePublished: p.publishedAt, dateModified: p.updatedAt, author: { '@type': 'Organization', name: p.authorName || 'RS Stack' }, publisher: { '@type': 'Organization', name: 'RS Stack' } }, breadcrumbLd([['Home', '/'], ['Blog', '/blog'], [p.title, path]])]}/>
      <Section className="pt-32 sm:pt-40">
        <article className="mx-auto max-w-3xl">
          <Breadcrumbs items={[['Home', '/'], ['Blog', '/blog'], [p.title]]}/>
          <h1 className="text-3xl sm:text-5xl">{p.title}</h1>
          <p className="mt-4 text-sm text-muted">By {p.authorName} · {fmtDate(p.publishedAt)} · {p.readingMinutes} min read</p>
          {p.coverImage && <img src={p.coverImage} alt={p.coverImageAlt || ''} className="mt-8 w-full rounded-2xl"/>}
          {/* bodyHtml is sanitised on the server with an allow-list on every write. */}
          <div className="prose-rs mt-8" dangerouslySetInnerHTML={{ __html: bodyHtml }}/>
          {p.tags?.length > 0 && <div className="mt-8 flex flex-wrap gap-2">{p.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>}
          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm"><span className="text-muted">Share:</span>{share.map(([n, h]) => <a key={n} href={h} target="_blank" rel="noopener noreferrer" className="text-secondary underline">{n}</a>)}</div>
          <div className="card mt-10 text-center"><p className="font-semibold">Need help with your website or local visibility?</p><Link to="/contact" className="btn-primary mt-3">Get a Free Consultation</Link></div>
        </article>
        {relatedArticles.length > 0 && (<div className="mx-auto mt-14 max-w-3xl">
            <h2 className="mb-4 text-xl">Related articles</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedArticles.map((r) => (<Link key={r.slug} to={`/blog/${r.slug}`} className="card card-hover group flex flex-col p-0 overflow-hidden">
                  {r.coverImage && (<div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                      <img src={r.coverImage} alt={r.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>
                    </div>)}
                  <div className="p-4 flex-1">
                    <h3 className="text-base font-bold text-ink group-hover:text-secondary">{r.title}</h3>
                    <p className="mt-1 text-xs text-muted line-clamp-2">{r.excerpt}</p>
                  </div>
                </Link>))}
            </div>
          </div>)}
      </Section>
    </>);
}
