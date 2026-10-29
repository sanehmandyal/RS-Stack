import { ArrowRight, Check, MapPin, Quote, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const SHOWCASE_PROJECTS = [
  {
    id: 'local-services',
    tabLabel: 'Local Services',
    title: 'Tricity Cleaners & Property Care',
    location: 'Phase 5, Mohali',
    slug: 'demo-local-service-website',
    tag: 'Web Platform & Local Search',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Tricity Cleaners platform showcase',
    highlightMetric: '+300% Inbound Calls',
    highlightSub: 'Within 60 Days of Launch',
    deliverables: [
      'Sub-second mobile quote booking flow',
      'Google Business Profile #1 Map Pack ranking',
      '100% full source code & asset ownership',
      'Direct WhatsApp inquiry lead routing',
    ],
    clientQuote: 'Growora rebuilt our service platform and local search footprint in Phase 5 Mohali. Incoming direct customer calls increased by over 300%.',
    author: 'Rajat Sharma',
    role: 'Founder',
  },
  {
    id: 'hospitality',
    tabLabel: 'Hospitality & Dining',
    title: 'Shivalik Eco Retreats',
    location: 'Himachal & Tricity',
    slug: 'demo-hospitality-local-presence',
    tag: 'Direct Booking & Experience Portal',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Shivalik Eco Retreats booking portal',
    highlightMetric: '0.4s Mobile Load',
    highlightSub: 'Core Web Vitals Certified',
    deliverables: [
      'Mobile-first room & tour inquiry catalog',
      'Structured LocalBusiness schema markup',
      'Zero monthly plugin or CMS licensing fees',
      'Direct WhatsApp booking concierge integration',
    ],
    clientQuote: 'The direct WhatsApp booking integration and sub-second mobile page loads have completely transformed how tourists book with us.',
    author: 'Ananya Verma',
    role: 'Managing Partner',
  },
  {
    id: 'industrial',
    tabLabel: 'Corporate & Industrial',
    title: 'Apex Industrial Supply',
    location: 'Chandigarh & Punjab',
    slug: 'demo-corporate-consulting-hub',
    tag: 'Custom MERN Quotation Portal',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Apex Industrial Supply platform',
    highlightMetric: '100% Code Ownership',
    highlightSub: 'Enterprise Handover',
    deliverables: [
      'Bespoke quotation pipeline & catalog portal',
      'Secure MongoDB & Node.js backend API',
      'Role-based access control for team members',
      'Full technical documentation & training',
    ],
    clientQuote: 'Their full-stack MERN portal automated our quotation pipeline and replaced dozens of manual spreadsheets. Exceptional engineering.',
    author: 'Harpreet Singh',
    role: 'Co-Founder & Director',
  },
];

export function HeroVisual() {
  const [activeId, setActiveId] = useState('local-services');
  const project = SHOWCASE_PROJECTS.find((p) => p.id === activeId) || SHOWCASE_PROJECTS[0];

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Top Header Bar */}
        <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#143D34]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Verified Client Delivery
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-600">
            Phase 5, Mohali HQ
          </span>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-100/70 p-1.5 gap-1.5">
          {SHOWCASE_PROJECTS.map((p) => {
            const isSelected = p.id === activeId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveId(p.id)}
                className={`rounded-lg py-2 px-2 text-xs font-semibold transition-all duration-150 text-center truncate ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {p.tabLabel}
              </button>
            );
          })}
        </div>

        {/* Project Visual Showcase */}
        <div className="p-5 sm:p-6">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 mb-5">
            <img
              src={project.image}
              alt={project.imageAlt}
              className="h-full w-full object-cover"
              loading="eager"
            />
            {/* Impact Metric Badge Overlay */}
            <div className="absolute bottom-3 left-3 rounded-lg bg-slate-900/95 backdrop-blur-sm px-3.5 py-2 text-white border border-slate-800 shadow-md">
              <p className="text-sm sm:text-base font-extrabold text-white leading-tight">
                {project.highlightMetric}
              </p>
              <p className="text-[11px] text-slate-300 font-medium">
                {project.highlightSub}
              </p>
            </div>
          </div>

          {/* Project Details */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {project.tag}
              </p>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                {project.title}
              </h3>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md self-start sm:self-auto border border-slate-200">
              <MapPin className="h-3.5 w-3.5 text-[#143D34]" />
              <span>{project.location}</span>
            </div>
          </div>

          {/* Deliverables Checklist */}
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#143D34]" /> Scope Delivered:
            </p>
            <div className="grid gap-2 sm:grid-cols-2 text-xs sm:text-sm text-slate-700">
              {project.deliverables.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-[#143D34] shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-800">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
            <div className="flex items-start gap-2.5">
              <Quote className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  "{project.clientQuote}"
                </p>
                <p className="text-xs font-bold text-slate-900 mt-2">
                  {project.author} <span className="text-slate-500 font-normal">/ {project.role}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
            <Link
              to={`/portfolio/${project.slug}`}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#143D34] hover:text-black transition"
            >
              View Full Case Study <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link to="/contact" className="btn btn-sm btn-primary">
              Discuss Your Project
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
