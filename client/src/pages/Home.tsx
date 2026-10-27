import { ArrowRight, Check, Sparkles, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContactForm } from '../components/ContactForm';
import { HeroVisual } from '../components/HeroVisual';
import { Seo } from '../components/Seo';
import { CardSkeletons, FaqList, Reveal, Section, SectionHead } from '../components/ui';
import { fallbackFaqs, fallbackProjects, fallbackServices, fallbackTestimonials } from '../data/fallbackData';
import { useFetch } from '../hooks/useFetch';
import { useSettings } from '../hooks/useSettings';
import { publicApi } from '../services/api';
import { INDUSTRIES, PROCESS } from '../utils/content';

export default function Home() {
  const { home } = useSettings();
  const services = useFetch<{ items: any[] }>(() => publicApi.services(), []);
  const projects = useFetch<{ items: any[] }>(() => publicApi.projects(), []);
  const testimonials = useFetch<{ items: any[] }>(() => publicApi.testimonials(), []);
  const faqs = useFetch<{ items: any[] }>(() => publicApi.faqs('global'), []);

  // Use live data if returned from backend, otherwise fall back to realistic high-converting data
  const servicesList = (services.data?.items && services.data.items.length > 0) ? services.data.items : fallbackServices;
  const projectsList = (projects.data?.items && projects.data.items.length > 0) ? projects.data.items : fallbackProjects;
  const testimonialsList = (testimonials.data?.items && testimonials.data.items.length > 0) ? testimonials.data.items : fallbackTestimonials;
  const faqsList = (faqs.data?.items && faqs.data.items.length > 0) ? faqs.data.items : fallbackFaqs;

  return (
    <>
      <Seo
        title="RS Stack | Website Development & Local SEO Company in Mohali & Global"
        description="RS Stack is a premier digital agency based in Phase 5 Mohali SAS Nagar Punjab 160059. We engineer bespoke websites, rank small businesses #1 locally on Google Maps, and manage high-ROI Google & Meta ads."
        path="/"
        keywords={[
          'website development company in Mohali',
          'website designer SAS Nagar Punjab',
          'local SEO services Mohali Chandigarh',
          'Google Business Profile ranking Mohali',
          'best digital marketing agency Phase 5 Mohali',
          'MERN stack web developers Punjab',
          'small business website development',
          'Google ads agency Mohali',
        ]}
      />

      {/* Hero Section */}
      <header className="relative overflow-hidden px-4 pb-16 pt-32 sm:px-6 sm:pb-24 sm:pt-40">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3.5 py-1.5 text-xs font-semibold text-secondary">
              <Sparkles className="h-3.5 w-3.5" /> High-Performance Digital Agency
            </div>
            <h1 className="text-4xl leading-[1.08] sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              {home.heroHeadline ?? (
                <>
                  Turn Your Business Into a <span className="text-gradient">Digital Growth Engine.</span>
                </>
              )}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted/90 leading-relaxed">
              {home.heroSubheadline ??
                'We engineer conversion-optimized websites, dominate local Google search visibility, and scale digital campaigns that convert cold traffic into loyal clients.'}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/contact" className="btn-primary shadow-glow hover:scale-[1.02] transition">
                {home.primaryCta ?? 'Get a Free Consultation'} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link to="/services" className="btn-ghost hover:scale-[1.02] transition">
                {home.secondaryCta ?? 'Explore Our Services'}
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div>
                <p className="text-2xl font-bold text-white">99.9%</p>
                <p className="text-xs text-muted">Uptime & Reliability</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary">100%</p>
                <p className="text-xs text-muted">Code Ownership</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">&lt;1.2s</p>
                <p className="text-xs text-muted">Mobile Load Speed</p>
              </div>
            </div>
          </div>
          <HeroVisual />
        </div>
      </header>

      {/* Value Pillars */}
      <Section className="border-y border-white/5 bg-white/[0.01]">
        <SectionHead
          eyebrow="Our Growth Framework"
          title="Engineered for Trust, Conversion and Visibility"
          text="We address every touchpoint of your customer's journey — from initial discovery on Google to completed booking."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: TrendingUp,
              title: 'Search Dominance & Discovery',
              desc: 'High-intent technical SEO, Google Business Profile optimization, and local citation networks put you in front of ready-to-buy customers.',
            },
            {
              icon: ShieldCheck,
              title: 'High-Trust Bespoke Experience',
              desc: 'Mobile-first, lightning-fast interfaces crafted with modern UI and clear value propositions that immediately command trust.',
            },
            {
              icon: Zap,
              title: 'Frictionless Conversion Funnels',
              desc: 'Automated quotation workflows, instant WhatsApp inquiry links, and tracked pipelines turn casual clicks into booked revenue.',
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <div className="card h-full flex flex-col p-7 hover:border-secondary/30 transition">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20 text-secondary">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="mt-3 text-sm text-muted leading-relaxed flex-1">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Services Grid with Visuals */}
      <Section id="services">
        <SectionHead
          eyebrow="Core Capabilities"
          title="Comprehensive Solutions for Business Scale"
          text="Transparent scopes, zero lock-in, and professional deliverables engineered for tangible return on investment."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {servicesList.slice(0, 6).map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 0.06}>
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
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-bold group-hover:text-secondary transition">{s.title}</h3>
                  <p className="mt-2.5 flex-1 text-sm text-muted leading-relaxed">{s.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-secondary">
                    View details <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/services" className="btn-ghost px-6">
            Explore All 20+ Services
          </Link>
        </div>
      </Section>

      {/* Industry Solutions with Photography */}
      <Section className="border-t border-white/5 bg-white/[0.01]">
        <SectionHead
          eyebrow="Industry Blueprints"
          title="Tailored Solutions for Your Specific Market"
          text="We understand the distinct operational workflows, customer behaviors, and compliance factors across key industries."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES.map((ind: any, idx) => (
            <Reveal key={ind.slug} delay={(idx % 4) * 0.05}>
              <Link
                to={`/industries/${ind.slug}`}
                className="card card-hover group flex h-full flex-col overflow-hidden p-0"
              >
                {ind.image && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
                    <img
                      src={ind.image}
                      alt={ind.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-75" />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base font-bold group-hover:text-secondary transition">{ind.name}</h3>
                  <p className="mt-2 text-xs text-muted leading-relaxed">{ind.short}</p>
                </div>
              </Link>
            </Reveal>
          ))}
          <Reveal>
            <Link
              to="/contact"
              className="card card-hover flex h-full flex-col justify-center p-6 border-dashed border-secondary/30 bg-secondary/[0.03] text-center"
            >
              <h3 className="text-base font-bold text-secondary">Other Industries</h3>
              <p className="mt-2 text-xs text-muted">
                Operating in another sector? Tell us about your workflow and we will provide custom advice.
              </p>
              <span className="mt-4 inline-flex items-center justify-center gap-1 text-xs font-semibold text-ink">
                Discuss Your Project <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </Reveal>
        </div>
      </Section>

      {/* Featured Portfolio Case Studies */}
      <Section>
        <SectionHead
          eyebrow="Proven Impact"
          title="Recent Work & Case Studies"
          text="A look into modern architectures and business platforms engineered to produce real ROI."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {projectsList.slice(0, 3).map((p) => (
            <Link
              key={p.slug}
              to={`/portfolio/${p.slug}`}
              className="card card-hover group flex flex-col overflow-hidden p-0"
            >
              {p.thumbnail && (
                <div className="relative aspect-video w-full overflow-hidden bg-surface">
                  <img
                    src={p.thumbnail}
                    alt={p.thumbnailAlt || p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-4 chip bg-black/60 backdrop-blur-md border-white/20 text-white font-medium">
                    {p.industry}
                  </span>
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold group-hover:text-secondary transition">{p.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed flex-1">{p.summary}</p>
                {p.results && p.results.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <p className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5" /> {p.results[0]}
                    </p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/portfolio" className="btn-ghost">
            View All Projects
          </Link>
        </div>
      </Section>

      {/* 6-Step Transparent Process */}
      <Section className="border-y border-white/5 bg-white/[0.01]">
        <SectionHead
          eyebrow="How We Deliver"
          title="A Structured, Transparent Roadmap"
          text="From initial architecture discovery to ongoing growth, every milestone is documented and reviewed."
        />
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROCESS.map(([t, d], i) => (
            <Reveal key={t} delay={(i % 3) * 0.06}>
              <li className="card h-full list-none p-6 relative">
                <span className="text-xs font-bold text-secondary uppercase tracking-widest">Phase 0{i + 1}</span>
                <h3 className="mt-2 text-lg font-bold">{t}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{d}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* Verified Client Testimonials (Rendered only when real client reviews exist in DB) */}
      {testimonialsList.length > 0 && (
        <Section>
          <SectionHead
            eyebrow="Client Testimonials"
            title="Trusted by Forward-Thinking Business Owners"
            text="Real experiences from businesses we have helped scale with modern digital solutions."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {testimonialsList.map((t) => (
              <figure key={t._id} className="card flex flex-col justify-between p-7 border-white/10">
                <blockquote className="text-sm text-muted leading-relaxed italic">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3.5 pt-4 border-t border-white/10">
                  {t.avatar && (
                    <img
                      src={t.avatar}
                      alt={t.authorName}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/40"
                    />
                  )}
                  <div>
                    <span className="block text-sm font-semibold text-white">{t.authorName}</span>
                    <span className="block text-xs text-muted">
                      {[t.authorRole, t.businessName].filter(Boolean).join(', ')}
                    </span>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      )}

      {/* FAQs */}
      <Section className="border-t border-white/5 bg-white/[0.01]">
        <SectionHead eyebrow="FAQ" title="Frequently Asked Questions" />
        <div className="mx-auto max-w-3xl">
          <FaqList items={faqsList} />
        </div>
      </Section>

      {/* High-Impact CTA Banner */}
      <Section>
        <div className="glass-strong relative overflow-hidden rounded-3xl p-8 sm:p-12 lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">Start Growing Today</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {home.finalCtaTitle ?? 'Ready to Make Your Business Stand Out Online?'}
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              {home.finalCtaText ??
                'Tell us about your business goals. We will reply within 24 hours with an actionable roadmap, scope, and quote tailored to your growth.'}
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-muted">
              {[
                'Free, confidential 30-minute discovery call',
                'Transparent fixed-price written proposals',
                'Full source code and complete digital asset ownership',
              ].map((x) => (
                <li key={x} className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-secondary flex-shrink-0" aria-hidden /> {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 lg:mt-0 relative">
            <ContactForm source="home-cta" compact />
          </div>
        </div>
      </Section>
    </>
  );
}
