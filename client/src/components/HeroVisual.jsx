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
      'Sub-second quote booking flow',
      'Google Map Pack #1 ranking',
      '100% full code ownership',
      'Direct WhatsApp lead routing',
    ],
    clientQuote: 'Incoming direct customer inquiries increased by over 300% within two months of launch.',
    author: 'Rajat Sharma',
    role: 'Founder',
  },
  {
    id: 'hospitality',
    tabLabel: 'Hospitality',
    title: 'Shivalik Eco Retreats',
    location: 'Himachal & Tricity',
    slug: 'demo-hospitality-local-presence',
    tag: 'Direct Booking & Experience Portal',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Shivalik Eco Retreats booking portal',
    highlightMetric: '0.4s Mobile Load',
    highlightSub: 'Core Web Vitals Certified',
    deliverables: [
      'Mobile-first room inquiry catalog',
      'LocalBusiness schema markup',
      'Zero monthly plugin fees',
      'Direct WhatsApp concierge',
    ],
    clientQuote: 'Sub-second mobile speeds and direct WhatsApp bookings doubled our direct customer reservations.',
    author: 'Ananya Verma',
    role: 'Managing Partner',
  },
  {
    id: 'industrial',
    tabLabel: 'Corporate & MERN',
    title: 'Apex Industrial Supply',
    location: 'Chandigarh & Punjab',
    slug: 'demo-corporate-consulting-hub',
    tag: 'Custom MERN Quotation Portal',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Apex Industrial Supply platform',
    highlightMetric: '100% Code Ownership',
    highlightSub: 'Full Architecture Handover',
    deliverables: [
      'Bespoke quotation pipeline',
      'Secure MongoDB & Node.js API',
      'Role-based staff permissions',
      'Complete documentation handover',
    ],
    clientQuote: 'Replaced manual quotation spreadsheets with an automated, ultra-fast custom platform.',
    author: 'Harpreet Singh',
    role: 'Co-Founder & Director',
  },
];

export function HeroVisual() {
  const [activeId, setActiveId] = useState('local-services');
  const project = SHOWCASE_PROJECTS.find((p) => p.id === activeId) || SHOWCASE_PROJECTS[0];

  return (
    <div className="w-full max-w-xl mx-auto lg:max-w-none">
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden flex flex-col">
        {/* Top Header & Tab Strip */}
        <div className="border-b border-slate-200 bg-slate-50/90 px-3 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-lg">
            {SHOWCASE_PROJECTS.map((p) => {
              const isSelected = p.id === activeId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActiveId(p.id)}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all duration-150 ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {p.tabLabel}
                </button>
              );
            })}
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 pr-1">
            <span className="h-2 w-2 rounded-full bg-[#143D34]" />
            <span>Verified Delivery</span>
          </div>
        </div>

        {/* Compact Visual Showcase Banner */}
        <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-slate-100">
          <img
            src={project.image}
            alt={project.imageAlt}
            className="h-full w-full object-cover transition-opacity duration-200"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent pointer-events-none" />

          {/* Location Chip */}
          <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-slate-100 bg-slate-900/80 backdrop-blur-xs px-2.5 py-0.5 rounded-md border border-slate-700/80">
            <MapPin className="h-3 w-3 text-emerald-400" />
            <span>{project.location}</span>
          </div>

          {/* Impact Metric Badge Overlay */}
          <div className="absolute bottom-2.5 left-3 text-white">
            <p className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
              {project.highlightMetric}
            </p>
            <p className="text-[11px] text-slate-300 font-medium mt-0.5">
              {project.highlightSub}
            </p>
          </div>
        </div>

        {/* Project Details & Deliverables */}
        <div className="p-4 sm:p-5 flex flex-col gap-3.5">
          {/* Title & Tag */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {project.tag}
            </p>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mt-0.5">
              {project.title}
            </h3>
          </div>

          {/* High-density 2x2 Deliverables */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-slate-700 border-y border-slate-100 py-2.5">
            {project.deliverables.map((item) => (
              <div key={item} className="flex items-center gap-1.5 truncate">
                <Check className="h-3.5 w-3.5 text-[#143D34] shrink-0" />
                <span className="font-medium text-slate-800 truncate">{item}</span>
              </div>
            ))}
          </div>

          {/* Compact Client Quote */}
          <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2">
            <div className="flex items-start gap-2">
              <Quote className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 italic leading-snug line-clamp-2">
                "{project.clientQuote}" <span className="not-italic font-semibold text-slate-900 ml-1">— {project.author}, {project.role}</span>
              </p>
            </div>
          </div>

          {/* Bottom Action Row */}
          <div className="flex items-center justify-between pt-1">
            <Link
              to={`/portfolio/${project.slug}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#143D34] hover:text-black transition"
            >
              Explore Case Study <ArrowRight className="h-3.5 w-3.5" />
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
