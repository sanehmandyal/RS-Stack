import { ExternalLink } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ContactForm } from '../components/ContactForm';
import { Seo, breadcrumbLd } from '../components/Seo';
import { Breadcrumbs, PageHero, Section, Skeleton } from '../components/ui';
import { fallbackProjects } from '../data/fallbackData';
import { useFetch } from '../hooks/useFetch';
import { publicApi } from '../services/api';

export default function ProjectDetail() {
  const { slug = '' } = useParams();
  const { data, loading } = useFetch<{ project: any }>(() => publicApi.project(slug), [slug]);

  const p = data?.project ?? fallbackProjects.find((proj) => proj.slug === slug) ?? fallbackProjects[0];

  if (loading && !p) {
    return (
      <div className="px-4 pt-40">
        <div className="mx-auto max-w-6xl">
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  const path = `/portfolio/${p.slug}`;
  return (
    <>
      <Seo
        title={p.metaTitle || `${p.title} | Case Study | RS Stack`}
        description={p.metaDescription || p.summary || 'RS Stack case study'}
        path={path}
        image={p.thumbnail || undefined}
        jsonLd={[breadcrumbLd([['Home', '/'], ['Portfolio', '/portfolio'], [p.title, path]])]}
      />
      <PageHero eyebrow={p.industry} title={p.title} text={p.summary}>
        {p.isDemo && <span className="chip mt-4">Demonstration project</span>}
      </PageHero>
      <Section className="pt-4">
        <Breadcrumbs items={[['Home', '/'], ['Portfolio', '/portfolio'], [p.title]]} />
        {p.thumbnail && (
          <div className="mb-10 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <img src={p.thumbnail} alt={p.thumbnailAlt || p.title} className="w-full max-h-[500px] object-cover" />
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2">
          {p.problem && (
            <div className="card p-7">
              <h2 className="text-xl font-bold">The Challenge</h2>
              <p className="mt-3 text-muted leading-relaxed">{p.problem}</p>
            </div>
          )}
          {p.solution && (
            <div className="card p-7">
              <h2 className="text-xl font-bold">The Strategic Solution</h2>
              <p className="mt-3 text-muted leading-relaxed">{p.solution}</p>
            </div>
          )}
        </div>
        {p.results && p.results.length > 0 && (
          <div className="card mt-6 p-7 border-secondary/20 bg-secondary/[0.02]">
            <h2 className="text-xl font-bold text-secondary">Verified Business Outcomes</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-muted leading-relaxed">
              {p.results.map((r: string) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-8 flex flex-wrap gap-2">
          {[...(p.technologies ?? [])].map((t: string) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
        {p.services && p.services.length > 0 && (
          <p className="mt-4 text-sm text-muted">
            Services used:{' '}
            {p.services.map((s: string, i: number) => (
              <span key={s}>
                {i > 0 && ', '}
                <Link className="text-secondary hover:underline" to={`/services/${s}`}>
                  {s.replace(/-/g, ' ')}
                </Link>
              </span>
            ))}
          </p>
        )}
        {p.liveUrl && (
          <a
            href={p.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-8 inline-flex items-center gap-2"
          >
            Visit Live Platform <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        )}
      </Section>
      <Section className="pt-0">
        <div className="glass-strong rounded-3xl p-8 sm:p-12">
          <h2 className="mb-4 text-3xl font-bold">Ready for Similar Growth in Your Business?</h2>
          <p className="text-muted mb-8 max-w-xl">
            Let us review your existing setup or discuss your new digital project. Get a complete written roadmap and estimate.
          </p>
          <div className="max-w-3xl">
            <ContactForm source={`project-${p.slug}`.slice(0, 60)} />
          </div>
        </div>
      </Section>
    </>
  );
}
