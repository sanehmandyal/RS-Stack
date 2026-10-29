import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { PageHero, Reveal, Section } from '../components/ui';
import { INDUSTRIES } from '../utils/content';
export default function Industries() {
    return (<>
      <Seo title="Industries We Serve | Growora" description="High-converting digital solutions tailored to cleaning services, travel agencies, restaurants, hotels, aesthetics salons, retail boutiques, and corporate firms." path="/industries"/>
      <PageHero eyebrow="Targeted Market Solutions" title="Digital Blueprints Tailored Around How Your Industry Operates" text="Every sector has distinct customer buying habits, lead triggers, and local search dynamics. Explore our tailored frameworks."/>
      <Section className="pt-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((i, idx) => (<Reveal key={i.slug} delay={(idx % 3) * 0.05}>
              <Link to={`/industries/${i.slug}`} className="card card-hover group flex h-full flex-col overflow-hidden p-0">
                {i.image && (<div className="relative aspect-video w-full overflow-hidden bg-surface">
                    <img src={i.image} alt={i.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-80"/>
                  </div>)}
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-xl font-bold group-hover:text-secondary transition">{i.name}</h2>
                  <p className="mt-2 text-sm text-muted leading-relaxed flex-1">{i.short}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-secondary">
                    Explore Blueprint <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden/>
                  </span>
                </div>
              </Link>
            </Reveal>))}
          <Reveal>
            <Link to="/contact" className="card card-hover flex h-full flex-col justify-center p-8 border-dashed border-secondary/30 bg-secondary/[0.02] text-center">
              <h2 className="text-xl font-bold text-secondary">Other Sectors & Enterprises</h2>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                Do not see your exact niche? Tell us about your operational workflow and target audience. We will architect a custom roadmap.
              </p>
              <div className="mt-6">
                <span className="btn-primary btn-sm inline-flex items-center gap-1">
                  Schedule Consultation <ArrowRight className="h-4 w-4"/>
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </Section>
    </>);
}
