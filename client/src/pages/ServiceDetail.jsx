import { Check } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { ContactForm } from '../components/ContactForm';
import { Seo, breadcrumbLd } from '../components/Seo';
import { Breadcrumbs, FaqList, PageHero, Section, Skeleton } from '../components/ui';
import { fallbackServices } from '../data/fallbackData';
import { useFetch } from '../hooks/useFetch';
import { publicApi } from '../services/api';
import { DELIVERY_LABEL } from '../utils/content';
const List = ({ title, items }) => items?.length ? (<div className="card h-full p-6">
      <h2 className="text-xl font-bold">{title}</h2>
      <ul className="mt-3.5 space-y-2 text-sm text-muted leading-relaxed">
        {items.map((x) => (<li key={x} className="flex gap-2.5">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden/>
            {x}
          </li>))}
      </ul>
    </div>) : null;
export default function ServiceDetail() {
    const { slug = '' } = useParams();
    const { data, loading } = useFetch(() => publicApi.service(slug), [slug]);
    const s = data?.service ?? fallbackServices.find((serv) => serv.slug === slug) ?? fallbackServices[0];
    if (loading && !s) {
        return (<div className="px-4 pt-40 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-4">
          <Skeleton className="h-12 w-2/3"/>
          <Skeleton className="h-40"/>
        </div>
      </div>);
    }
    const path = `/services/${s.slug}`;
    return (<>
      <Seo title={s.metaTitle || `${s.title} | RS Stack`} description={s.metaDescription || s.summary} path={path} jsonLd={[
            {
                '@context': 'https://schema.org',
                '@type': 'Service',
                name: s.title,
                description: s.summary,
                provider: { '@type': 'Organization', name: 'RS Stack' },
            },
            breadcrumbLd([['Home', '/'], ['Services', '/services'], [s.title, path]]),
        ]}/>
      <PageHero title={s.title} text={s.summary}>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a href="#enquire" className="btn-primary">
            Request Service Proposal
          </a>
          <span className="chip">{DELIVERY_LABEL[s.delivery] ?? 'Direct delivery'}</span>
        </div>
      </PageHero>
      <Section className="pt-4">
        <Breadcrumbs items={[['Home', '/'], ['Services', '/services'], [s.title]]}/>
        {s.image && (<div className="mb-10 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <img src={s.image} alt={s.title} className="w-full max-h-[440px] object-cover"/>
          </div>)}
        {s.description && <p className="prose-rs mb-10 max-w-3xl text-lg leading-relaxed">{s.description}</p>}
        {s.thirdPartyNote && (<p className="mb-8 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
            {s.thirdPartyNote}
          </p>)}
        <div className="grid gap-6 md:grid-cols-2">
          <List title="Target Audience & Eligibility" items={s.audience}/>
          <List title="Key Challenges Addressed" items={s.problems}/>
          <List title="Tangible Deliverables" items={s.deliverables}/>
          <List title="Strategic Business Benefits" items={s.benefits}/>
          <List title="Important Considerations" items={s.limitations}/>
          <List title="Implementation Process" items={s.process}/>
        </div>
        {s.timeline && (<p className="mt-8 text-sm text-muted">
            <strong className="text-ink">Estimated timeline:</strong> {s.timeline}. Timelines depend on feature scope and asset provision.
          </p>)}
      </Section>
      {s.faqs && s.faqs.length > 0 && (<Section className="pt-0">
          <h2 className="mb-6 text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="max-w-3xl">
            <FaqList items={s.faqs.map(([q, a], i) => ({ _id: String(i), question: q, answer: a }))}/>
          </div>
        </Section>)}
      <Section id="enquire" className="pt-0">
        <div className="glass-strong rounded-3xl p-8 sm:p-12">
          <h2 className="mb-4 text-3xl font-bold">Get a Custom Scope & Quote for {s.title}</h2>
          <p className="text-muted mb-8 max-w-xl">
            Tell us about your requirements. We will analyze your specifications and return a clear, itemized proposal.
          </p>
          <div className="max-w-3xl">
            <ContactForm serviceSlug={s.slug} source={`service-${s.slug}`.slice(0, 60)}/>
          </div>
        </div>
      </Section>
    </>);
}
