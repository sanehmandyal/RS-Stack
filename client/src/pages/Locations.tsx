import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { PageHero, Reveal, Section } from '../components/ui';
import { LOCAL_DATA } from './LocalLanding';

export default function Locations() {
  return (
    <>
      <Seo
        title="Service Areas & Regional Hubs | RS Stack"
        description="Explore RS Stack service areas across Punjab, Himachal Pradesh, and Haryana including Mohali, Chandigarh, Panchkula, Zirakpur, Una, Amb, Amb Andaura, Nangal, and Anandpur Sahib."
        path="/locations"
        keywords={[
          'RS Stack locations',
          'website development Himachal',
          'website design Una HP',
          'local SEO Nangal',
          'web developer Anandpur Sahib',
          'SEO services Haryana',
        ]}
      />
      <PageHero
        eyebrow="Regional Hubs"
        title="Local Search & Web Development Hubs"
        text="From our central headquarters in Phase 5 Mohali (SAS Nagar), we engineer high-converting web applications, local SEO, and digital marketing for enterprises across Punjab, Himachal Pradesh, Haryana, and worldwide."
      />
      <Section className="pt-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(LOCAL_DATA).map(([slug, loc], idx) => (
            <Reveal key={slug} delay={(idx % 3) * 0.05}>
              <Link
                to={`/locations/${slug}`}
                className="card card-hover group flex h-full flex-col p-6 hover:border-secondary/40 transition"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary">
                  <MapPin className="h-4 w-4" />
                  {loc.region}
                </div>
                <h2 className="mt-3 text-xl font-bold group-hover:text-secondary transition">{loc.city}</h2>
                <p className="mt-2 text-xs text-muted leading-relaxed flex-1">{loc.landmark}</p>
                <div className="mt-4 flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                  {loc.areas.slice(0, 3).map((a) => (
                    <span key={a} className="chip text-[11px]">{a}</span>
                  ))}
                </div>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-secondary">
                  View Location Hub <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
