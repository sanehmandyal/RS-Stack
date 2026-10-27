import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Seo } from '../components/Seo';
import { CardSkeletons, PageHero, Section } from '../components/ui';
import { fallbackProjects } from '../data/fallbackData';
import { useFetch } from '../hooks/useFetch';
import { publicApi } from '../services/api';
import { PORTFOLIO_FILTERS } from '../utils/content';

export default function Portfolio() {
  const [cat, setCat] = useState('');
  const { data, loading } = useFetch<{ items: any[] }>(() => publicApi.projects(cat), [cat]);

  const rawList = (data?.items && data.items.length > 0) ? data.items : fallbackProjects;
  const filteredProjects = cat ? rawList.filter((p) => p.category === cat) : rawList;

  return (
    <>
      <Seo
        title="Portfolio & Case Studies | RS Stack"
        description="Explore selected high-performance websites, local search rank growth campaigns, and custom applications delivered by RS Stack."
        path="/portfolio"
      />
      <PageHero
        eyebrow="Case Studies"
        title="Engineered for Performance & High Conversion"
        text="Discover how we help businesses transform their digital presence, capture high-value customer inquiries, and establish category authority."
      />
      <Section className="pt-4">
        <div role="group" aria-label="Filter projects" className="mb-10 flex flex-wrap gap-2.5">
          {PORTFOLIO_FILTERS.map(([v, l]) => (
            <button
              key={v}
              aria-pressed={cat === v}
              onClick={() => setCat(v)}
              className={`btn btn-sm transition ${
                cat === v
                  ? 'bg-primary text-white shadow-glow'
                  : 'border border-white/15 bg-white/5 text-muted hover:text-ink hover:border-white/30'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {loading && !filteredProjects.length && <CardSkeletons n={3} />}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((p) => (
            <Link
              key={p.slug}
              to={`/portfolio/${p.slug}`}
              className="card card-hover group flex flex-col overflow-hidden p-0"
            >
              {p.thumbnail ? (
                <div className="relative aspect-video w-full overflow-hidden bg-surface">
                  <img
                    src={p.thumbnail}
                    alt={p.thumbnailAlt || p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent opacity-80" />
                  <span className="absolute bottom-3 left-4 chip bg-black/60 backdrop-blur-md border-white/20 text-white font-medium">
                    {p.industry}
                  </span>
                </div>
              ) : (
                <div className="mb-4 grid aspect-video place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 text-sm text-muted">
                  {p.industry}
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-lg font-bold group-hover:text-secondary transition">{p.title}</h2>
                <p className="mt-2 text-sm text-muted leading-relaxed flex-1">{p.summary}</p>
                {p.results && p.results.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <p className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5" /> {p.results[0]}
                    </p>
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-1.5 pt-2">
                  {p.technologies?.slice(0, 3).map((t: string) => (
                    <span key={t} className="chip text-[11px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
