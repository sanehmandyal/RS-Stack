import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { CardSkeletons, PageHero, Reveal, Section } from '../components/ui';
import { fallbackServices } from '../data/fallbackData';
import { useFetch } from '../hooks/useFetch';
import { publicApi } from '../services/api';
import { DELIVERY_LABEL } from '../utils/content';

const GROUPS: [string, string][] = [
  ['development', 'Websites & Applications'],
  ['local', 'Local Search & Visibility'],
  ['ads', 'Targeted Advertising'],
  ['seo', 'Optimization & SEO'],
  ['infrastructure', 'Cloud Infrastructure & Care'],
  ['content', 'Content & Strategy'],
];

export default function Services() {
  const { data, loading } = useFetch<{ items: any[] }>(() => publicApi.services(), []);
  const allServices = (data?.items && data.items.length > 0) ? data.items : fallbackServices;

  return (
    <>
      <Seo
        title="Services | RS Stack"
        description="High-performance web development, local SEO, Google Business Profile management, Google & Meta Ads, and enterprise cloud maintenance."
        path="/services"
      />
      <PageHero
        eyebrow="Capabilities"
        title="Engineered Web Development & Digital Marketing Under One Roof"
        text="From bespoke single-page web experiences to full-stack applications and local search domination, explore our end-to-end digital services."
      />
      <Section className="pt-4">
        {loading && !allServices.length && <CardSkeletons />}
        {GROUPS.map(([cat, label]) => {
          const items = allServices.filter((s) => s.category === cat);
          if (!items.length) return null;
          return (
            <div key={cat} className="mb-14">
              <h2 className="mb-6 text-2xl font-bold flex items-center gap-3 text-slate-900">
                <span className="h-2 w-2 rounded-xs bg-blue-600" />
                {label}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((s, i) => (
                  <Reveal key={s.slug} delay={(i % 3) * 0.05}>
                    <Link to={`/services/${s.slug}`} className="card card-hover group flex h-full flex-col overflow-hidden p-0">
                      {s.image && (
                        <div className="relative aspect-video w-full overflow-hidden bg-surface">
                          <img
                            src={s.image}
                            alt={s.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-80" />
                        </div>
                      )}
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-lg font-bold group-hover:text-secondary transition">{s.title}</h3>
                        <p className="mt-2.5 flex-1 text-sm text-muted leading-relaxed">{s.summary}</p>
                        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                          <span className="chip text-xs">{DELIVERY_LABEL[s.delivery] ?? 'Direct delivery'}</span>
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-secondary">
                            Details <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          );
        })}
      </Section>
    </>
  );
}
