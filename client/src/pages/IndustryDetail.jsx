import { Check } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ContactForm } from '../components/ContactForm';
import { Seo, breadcrumbLd } from '../components/Seo';
import { Breadcrumbs, PageHero, Section } from '../components/ui';
import { INDUSTRIES } from '../utils/content';
import NotFound from './NotFound';
export default function IndustryDetail() {
    const { slug } = useParams();
    const ind = INDUSTRIES.find((i) => i.slug === slug);
    if (!ind)
        return <NotFound />;
    const path = `/industries/${ind.slug}`;
    return (<>
      <Seo title={`Websites & Digital Marketing for ${ind.name} | Growora`} description={`How ${ind.name.toLowerCase()} attract more high-value clients with modern web design, local SEO, and digital infrastructure from Growora.`} path={path} jsonLd={[breadcrumbLd([['Home', '/'], ['Industries', '/industries'], [ind.name, path]])]}/>
      <PageHero eyebrow="Industry Focus" title={`Digital Growth Framework for ${ind.name}`} text={ind.intro}/>
      <Section className="pt-4">
        <Breadcrumbs items={[['Home', '/'], ['Industries', '/industries'], [ind.name]]}/>

        {ind.image && (<div className="mb-10 overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <img src={ind.image} alt={ind.name} className="w-full max-h-[460px] object-cover"/>
          </div>)}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="card p-7">
            <h2 className="text-xl font-bold">Key Capabilities Engineered for {ind.name}</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted leading-relaxed">
              {ind.features.map((f) => (<li key={f} className="flex gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden/>
                  {f}
                </li>))}
            </ul>
          </div>
          <div className="card p-7">
            <h2 className="text-xl font-bold">Commercial & Operational Outcomes</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted leading-relaxed">
              {ind.benefits.map((f) => (<li key={f} className="flex gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden/>
                  {f}
                </li>))}
            </ul>
            <p className="mt-6 text-xs text-muted/80 border-t border-white/10 pt-4">
              Real results depend on local competition and market demand. We focus on ethical, high-quality development and measurable growth.
            </p>
          </div>
        </div>

        {'note' in ind && ind.note && (<p className="mt-6 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
            {ind.note}
          </p>)}

        <h2 className="mb-4 mt-12 text-2xl font-bold">Recommended Core Services</h2>
        <div className="flex flex-wrap gap-3">
          {ind.services.map((s) => (<Link key={s} to={`/services/${s}`} className="btn-ghost text-sm">
              {s.replace(/-/g, ' ')}
            </Link>))}
        </div>
      </Section>
      <Section className="pt-0">
        <div className="glass-strong rounded-3xl p-8 sm:p-12">
          <h2 className="mb-4 text-3xl font-bold">Launch or Upgrade Your {ind.name} Platform</h2>
          <p className="text-muted mb-8 max-w-xl">
            Get in touch with our team for a detailed walkthrough and personalized quote designed around your operations.
          </p>
          <div className="max-w-3xl">
            <ContactForm source={`industry-${ind.slug}`}/>
          </div>
        </div>
      </Section>
    </>);
}
