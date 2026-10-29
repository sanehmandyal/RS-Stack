import { ArrowRight, Check, Globe2, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContactForm } from '../components/ContactForm';
import { HeroVisual } from '../components/HeroVisual';
import { Seo } from '../components/Seo';
import { FaqList, Reveal, Section, SectionHead } from '../components/ui';
import { fallbackFaqs, fallbackProjects, fallbackServices } from '../data/fallbackData';
import { useFetch } from '../hooks/useFetch';
import { useSettings } from '../hooks/useSettings';
import { publicApi } from '../services/api';
import { INDUSTRIES } from '../utils/content';
export default function Home() {
    const { home } = useSettings();
    const services = useFetch(() => publicApi.services(), []);
    const projects = useFetch(() => publicApi.projects(), []);
    const testimonials = useFetch(() => publicApi.testimonials(), []);
    const faqs = useFetch(() => publicApi.faqs('global'), []);
    // Use live data if returned from backend, otherwise fallback to core catalog
    const servicesList = (services.data?.items && services.data.items.length > 0) ? services.data.items : fallbackServices;
    const projectsList = (projects.data?.items && projects.data.items.length > 0) ? projects.data.items : fallbackProjects;
    // Testimonials: strictly display only real verified reviews from DB (no fake reviews)
    const verifiedReviews = (testimonials.data?.items && testimonials.data.items.length > 0) ? testimonials.data.items : [];
    const faqsList = (faqs.data?.items && faqs.data.items.length > 0) ? faqs.data.items : fallbackFaqs;
    return (<>
      <Seo title="Growora | Website Development & Local SEO Company in Mohali & Global" description="Growora is an engineering and digital agency based in Phase 5 Mohali SAS Nagar Punjab 160059. We build responsive websites, optimize Google Business Profiles for local search, and develop custom web applications." path="/" keywords={[
            'website development company in Mohali',
            'website designer SAS Nagar Punjab',
            'local SEO services Mohali Chandigarh',
            'Google Business Profile ranking Mohali',
            'best digital marketing agency Phase 5 Mohali',
            'MERN stack web developers Punjab',
            'small business website development',
            'Google ads agency Mohali',
        ]}/>

      {/* Hero Section */}
      <header className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-36">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" aria-hidden/>
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              <Globe2 className="h-3.5 w-3.5 text-teal-700"/> Agency • Phase 5, Mohali
            </div>
            <h1 className="text-3xl leading-tight sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
              {home.heroHeadline ?? 'Website Development, Local SEO & Custom Web Applications'}
            </h1>
            <p className="mt-5 max-w-xl text-base sm:text-lg text-slate-600 leading-relaxed">
              {home.heroSubheadline ??
            'Based in Phase 5, Mohali. We build fast, responsive websites, optimize Google Business Profiles for local search, and engineer scalable MERN stack web applications for growing businesses.'}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/contact" className="btn btn-primary rounded-lg px-6 py-2.5 font-semibold">
                {home.primaryCta ?? 'Schedule Consultation'} <ArrowRight className="h-4 w-4" aria-hidden/>
              </Link>
              <Link to="/services" className="btn btn-ghost rounded-lg px-6 py-2.5 font-semibold">
                {home.secondaryCta ?? 'Explore Services'}
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-200 pt-6">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">100%</p>
                <p className="text-xs text-slate-500 mt-0.5">Source Ownership</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-teal-700">React 18</p>
                <p className="text-xs text-slate-500 mt-0.5">Modern Full-Stack</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">Phase 5</p>
                <p className="text-xs text-slate-500 mt-0.5">Mohali Based</p>
              </div>
            </div>
          </div>
          <HeroVisual />
        </div>
      </header>

      {/* Value Pillars */}
      <Section className="border-y border-slate-200 bg-slate-50/50">
        <SectionHead eyebrow="Our Engineering Standards" title="Engineered for Trust, Performance and Visibility" text="We address every touchpoint of your customer journey: from initial discovery on Google to completed booking."/>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
                icon: Globe2,
                title: 'Search Visibility & Local Discovery',
                desc: 'High-intent technical SEO, Google Business Profile optimization, and local citation networks put your business in front of ready-to-buy customers.',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
                imageAlt: 'Search visibility and analytics dashboard',
            },
            {
                icon: ShieldCheck,
                title: 'Responsive & Accessible Design',
                desc: 'Mobile-first, fast-loading interfaces crafted with modern UI and clear value propositions that immediately command customer trust.',
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
                imageAlt: 'Responsive modern website user interface',
            },
            {
                icon: Zap,
                title: 'Direct Client Inquiries',
                desc: 'Automated quotation workflows, instant WhatsApp inquiry links, and structured forms turn website visitors into qualified business leads.',
                image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80',
                imageAlt: 'Client communication and inquiry management',
            },
        ].map((item, i) => (<Reveal key={item.title} delay={i * 0.08}>
              <div className="card card-hover h-full flex flex-col p-0 overflow-hidden">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                  <img src={item.image} alt={item.imageAlt} loading="lazy" className="h-full w-full object-cover transition duration-300"/>
                  <div className="absolute top-3 left-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 shadow-xs text-teal-700">
                    <item.icon className="h-4 w-4"/>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed flex-1">{item.desc}</p>
                </div>
              </div>
            </Reveal>))}
        </div>
      </Section>

      {/* Services Grid */}
      <Section id="services">
        <SectionHead eyebrow="Core Services" title="Professional Web Solutions for Business Scale" text="Transparent scopes, zero lock-in, and professional deliverables engineered for clear return on investment."/>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {servicesList.slice(0, 6).map((s, i) => (<Reveal key={s.slug} delay={(i % 3) * 0.06}>
              <Link to={`/services/${s.slug}`} className="card card-hover group flex h-full flex-col overflow-hidden p-0">
                {s.image && (<div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img src={s.image} alt={s.title} loading="lazy" className="h-full w-full object-cover transition duration-300"/>
                  </div>)}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-teal-700 transition">{s.title}</h3>
                  <p className="mt-2 flex-1 text-xs sm:text-sm text-slate-600 leading-relaxed">{s.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-teal-700">
                    View service details <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden/>
                  </span>
                </div>
              </Link>
            </Reveal>))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/services" className="btn btn-ghost px-6">
            View All Services
          </Link>
        </div>
      </Section>

      {/* Industry Solutions */}
      <Section className="border-t border-slate-200 bg-slate-50/50">
        <SectionHead eyebrow="Industry Blueprints" title="Tailored Solutions for Your Specific Industry" text="We understand the operational workflows, customer behaviors, and requirements across key sectors."/>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES.map((ind, idx) => (<Reveal key={ind.slug} delay={(idx % 4) * 0.05}>
              <Link to={`/industries/${ind.slug}`} className="card card-hover group flex h-full flex-col overflow-hidden p-0">
                {ind.image && (<div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <img src={ind.image} alt={ind.name} loading="lazy" className="h-full w-full object-cover transition duration-300"/>
                  </div>)}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition">{ind.name}</h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{ind.short}</p>
                </div>
              </Link>
            </Reveal>))}
          <Reveal>
            <Link to="/contact" className="card card-hover flex h-full flex-col justify-center p-6 border-dashed border-slate-300 bg-white text-center">
              <h3 className="text-sm font-bold text-teal-800">Other Industries</h3>
              <p className="mt-1.5 text-xs text-slate-600">
                Operating in another sector? Tell us about your workflow and we will provide custom recommendations.
              </p>
              <span className="mt-3 inline-flex items-center justify-center gap-1 text-xs font-semibold text-slate-900">
                Discuss Your Project <ArrowRight className="h-3.5 w-3.5"/>
              </span>
            </Link>
          </Reveal>
        </div>
      </Section>

      {/* Featured Portfolio Case Studies */}
      <Section>
        <SectionHead eyebrow="Client Projects" title="Recent Work & Case Studies" text="A look into web platforms and applications engineered for real business operations."/>
        <div className="grid gap-6 md:grid-cols-3">
          {projectsList.slice(0, 3).map((p) => (<Link key={p.slug} to={`/portfolio/${p.slug}`} className="card card-hover group flex flex-col overflow-hidden p-0">
              {p.thumbnail && (<div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img src={p.thumbnail} alt={p.thumbnailAlt || p.title} loading="lazy" className="h-full w-full object-cover transition duration-300"/>
                  <span className="absolute bottom-3 left-3 rounded-md bg-slate-900/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {p.industry}
                  </span>
                </div>)}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition">{p.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed flex-1">{p.summary}</p>
                {p.results && p.results.length > 0 && (<div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs font-semibold text-teal-700 flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5"/> {p.results[0]}
                    </p>
                  </div>)}
              </div>
            </Link>))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/portfolio" className="btn btn-ghost">
            View All Projects
          </Link>
        </div>
      </Section>

      {/* Structured 6-Step Process */}
      <Section className="border-y border-slate-200 bg-slate-50/50">
        <SectionHead eyebrow="How We Work" title="A Structured, Transparent Roadmap" text="From initial discovery to launch, every milestone is documented and reviewed with you."/>
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
                phase: 'Phase 01',
                title: 'Discovery & Requirements',
                desc: 'We analyze your business, customer profile, competitors, and exact functional goals.',
                image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
            },
            {
                phase: 'Phase 02',
                title: 'Strategy & Architecture',
                desc: 'We agree upon project scope, deliverables, and a realistic timeline in writing.',
                image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
            },
            {
                phase: 'Phase 03',
                title: 'UI/UX Design & Layout',
                desc: 'We build clear, accessible, mobile-first layouts and review prototypes with you.',
                image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
            },
            {
                phase: 'Phase 04',
                title: 'Development & Integration',
                desc: 'We develop clean React components, connect APIs, and configure lead inquiry forms.',
                image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
            },
            {
                phase: 'Phase 05',
                title: 'Testing & Deployment',
                desc: 'We test across devices and screen sizes, configure custom domains, and deploy securely.',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
            },
            {
                phase: 'Phase 06',
                title: 'Maintenance & Support',
                desc: 'We provide ongoing technical updates, backups, and local support directly from Mohali.',
                image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
            },
        ].map((item, i) => (<Reveal key={item.phase} delay={(i % 3) * 0.06}>
              <li className="card card-hover h-full list-none p-0 overflow-hidden flex flex-col">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                  <img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-cover transition duration-300"/>
                  <span className="absolute top-3 left-3 rounded-md bg-white px-2.5 py-1 text-xs font-bold text-teal-700 shadow-xs border border-slate-200">
                    {item.phase}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed flex-1">{item.desc}</p>
                </div>
              </li>
            </Reveal>))}
        </ol>
      </Section>

      {/* Verified Client Testimonials - ONLY rendered if verified real reviews exist in database */}
      {verifiedReviews.length > 0 && (<Section>
          <SectionHead eyebrow="Client Reviews" title="Verified Client Feedback" text="Reviews from businesses we have worked with on web development and search visibility."/>
          <div className="grid gap-6 md:grid-cols-3">
            {verifiedReviews.map((t) => (<figure key={t._id} className="card flex flex-col justify-between p-6">
                <blockquote className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 pt-4 border-t border-slate-100">
                  {t.avatar && (<img src={t.avatar} alt={t.authorName} className="h-9 w-9 rounded-md object-cover border border-slate-200"/>)}
                  <div>
                    <span className="block text-xs sm:text-sm font-semibold text-slate-900">{t.authorName}</span>
                    <span className="block text-xs text-slate-500">
                      {[t.authorRole, t.businessName].filter(Boolean).join(', ')}
                    </span>
                  </div>
                </figcaption>
              </figure>))}
          </div>
        </Section>)}

      {/* FAQs */}
      <Section className="border-t border-slate-200 bg-slate-50/50">
        <SectionHead eyebrow="FAQ" title="Frequently Asked Questions"/>
        <div className="mx-auto max-w-3xl">
          <FaqList items={faqsList}/>
        </div>
      </Section>

      {/* High-Impact CTA Banner */}
      <Section>
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-10 lg:grid lg:grid-cols-2 lg:gap-12 items-center shadow-xs">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-2">Get In Touch</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {home.finalCtaTitle ?? 'Ready to Discuss Your Project?'}
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {home.finalCtaText ??
            'Tell us about your business goals. We will reply within 24 business hours with an actionable roadmap, scope, and quote tailored to your requirements.'}
            </p>
            <ul className="mt-5 space-y-2 text-xs sm:text-sm text-slate-700">
              {[
            'Free 30-minute initial discovery consultation',
            'Written scope and milestone breakdown',
            'Full source code ownership upon project completion',
        ].map((x) => (<li key={x} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-teal-700 shrink-0" aria-hidden/> {x}
                </li>))}
            </ul>
          </div>
          <div className="mt-8 lg:mt-0">
            <ContactForm source="home-cta" compact/>
          </div>
        </div>
      </Section>
    </>);
}
