import { Link } from 'react-router-dom';
import { Shield, Sparkles, Award, Users, CheckCircle2 } from 'lucide-react';
import { Seo } from '../components/Seo';
import { PageHero, Section, SectionHead } from '../components/ui';

export default function About() {
  return (
    <>
      <Seo
        title="About RS Stack | Elite Web & Digital Growth Agency"
        description="Learn about RS Stack's engineering standards, mission, transparent pricing ethos, and how we help businesses grow with confidence."
        path="/about"
      />
      <PageHero
        eyebrow="Our Mission & DNA"
        title="We Build High-Converting Digital Systems. You Grow Your Business."
        text="RS Stack is an engineering-first digital growth agency. We bridge the gap between complex web development, high-intent local SEO, and measurable customer acquisition for ambitious enterprises."
      />

      <Section className="pt-4">
        {/* Visual Agency Banner */}
        <div className="relative mb-14 overflow-hidden rounded-3xl border border-white/10">
          <div className="relative aspect-[21/9] w-full min-h-[300px]">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80"
              alt="RS Stack Engineering and Growth Team"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xl font-bold text-white">Engineering Excellence & Business Integrity</p>
                <p className="text-sm text-muted">Every deliverable crafted with clean architecture and verified metrics.</p>
              </div>
              <Link to="/contact" className="btn-primary">
                Work With Us
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: 'Our Mission',
              desc: 'Make enterprise-grade web development, local search dominance, and digital infrastructure accessible and understandable for business owners who demand tangible return on investment.',
              icon: Sparkles,
            },
            {
              title: 'Radical Transparency',
              desc: 'No vague marketing jargon or false promises. We outline exact deliverables, transparent third-party costs (hosting, domains, ad spend), and realistic timelines in writing before any engagement.',
              icon: Shield,
            },
            {
              title: 'Conversion-Focused Engineering',
              desc: 'A pretty site that fails to convert is useless. We optimize every pixel, typography hierarchy, mobile touchpoint, and call-to-action to maximize qualified customer inquiries.',
              icon: Award,
            },
            {
              title: '100% Client Ownership',
              desc: 'We never lock you into restrictive proprietary ecosystems. You own 100% of your source code, design assets, database structures, and ad accounts from day one.',
              icon: Users,
            },
          ].map((item) => (
            <div key={item.title} className="card p-8 hover:border-secondary/30 transition">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-secondary">
                <item.icon className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold">{item.title}</h2>
              <p className="mt-3 text-muted leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Guiding Principles */}
        <div className="mt-14 glass-strong rounded-3xl p-8 sm:p-12">
          <SectionHead
            eyebrow="Our Commitments"
            title="What Sets RS Stack Apart"
            center={false}
          />
          <div className="grid gap-6 sm:grid-cols-3 mt-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-secondary font-bold">
                <CheckCircle2 className="h-5 w-5" /> Modern Stack Only
              </div>
              <p className="text-sm text-muted">
                React 18, Vite, TypeScript, Tailwind CSS, and Node.js for ultra-fast, future-proof stability.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-secondary font-bold">
                <CheckCircle2 className="h-5 w-5" /> Mobile-First Testing
              </div>
              <p className="text-sm text-muted">
                Tested across real iOS and Android viewports to guarantee seamless mobile conversion.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-secondary font-bold">
                <CheckCircle2 className="h-5 w-5" /> Direct Communication
              </div>
              <p className="text-sm text-muted">
                Work directly with dedicated engineers and digital growth strategists, not junior account managers.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link to="/contact" className="btn-primary shadow-glow px-8 py-3 text-base">
            Book a Free 30-Min Strategy Consultation
          </Link>
        </div>
      </Section>
    </>
  );
}
