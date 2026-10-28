import { useState } from 'react';
import { Code2, Search, Server, CheckCircle2, ArrowRight, } from 'lucide-react';
import { Link } from 'react-router-dom';
export function HeroVisual() {
    const [activeTab, setActiveTab] = useState('web-dev');
    const tabs = [
        {
            id: 'web-dev',
            label: 'Web Development',
            shortLabel: 'Web Dev',
            icon: Code2,
            title: 'Modern Responsive Websites',
            description: 'Handcrafted web applications built with React 18 and clean semantic HTML. Fast, accessible, and structured for maximum client conversion.',
            deliverables: [
                '100% full source code ownership',
                'Mobile-first responsive architecture',
                'Zero monthly CMS plugin lock-in',
                'Sub-second page loading speeds',
            ],
            techStack: ['React 18', 'TypeScript', 'Tailwind CSS', 'Vite'],
            serviceLink: '/services/custom-web-development',
            specs: [
                { label: 'Architecture', value: 'Component-Driven' },
                { label: 'Responsive', value: 'Mobile, Tablet, Desktop' },
                { label: 'Ownership', value: 'Client 100%' },
            ],
        },
        {
            id: 'local-seo',
            label: 'Local SEO & Maps',
            shortLabel: 'Local SEO',
            icon: Search,
            title: 'Google Business Profile & Citations',
            description: 'Engineered search presence for local businesses across Phase 5 Mohali, Chandigarh, and the greater Tricity region.',
            deliverables: [
                'Google Business Profile category & service tuning',
                'Local citation consistency (NAP verification)',
                'Schema.org LocalBusiness structured data',
                'Geotargeted service landing page structure',
            ],
            techStack: ['Schema.org', 'Google Search Console', 'Local Citations'],
            serviceLink: '/services/local-seo-services-mohali',
            specs: [
                { label: 'Target Market', value: 'Phase 5 Mohali & Tricity' },
                { label: 'Markup', value: 'JSON-LD Structured Data' },
                { label: 'Verification', value: 'NAP Consistent' },
            ],
        },
        {
            id: 'custom-apps',
            label: 'Web Applications',
            shortLabel: 'Web Apps',
            icon: Server,
            title: 'Custom MERN Web Applications',
            description: 'Scalable backend APIs and secure admin dashboards tailored to your internal business processes and customer portals.',
            deliverables: [
                'Secure RESTful API endpoints',
                'Role-based access control (RBAC)',
                'Automated lead management and inquiries',
                'MongoDB persistent database storage',
            ],
            techStack: ['Node.js', 'Express', 'MongoDB', 'Argon2id'],
            serviceLink: '/services/full-stack-web-applications',
            specs: [
                { label: 'Backend', value: 'Node.js & Express' },
                { label: 'Database', value: 'MongoDB Cloud' },
                { label: 'Security', value: 'Strict CSP & RBAC' },
            ],
        },
    ];
    const current = tabs.find((t) => t.id === activeTab) || tabs[0];
    return (<div className="w-full">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Top window chrome */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-slate-300"/>
            <span className="h-3 w-3 rounded-full bg-slate-300"/>
            <span className="h-3 w-3 rounded-full bg-slate-300"/>
            <span className="ml-2 font-mono text-xs text-slate-500 hidden sm:inline">rsstack.dev/overview</span>
          </div>
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Verified Deliverables
          </span>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-100/70 p-1.5 gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = tab.id === activeTab;
            return (<button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`flex items-center justify-center gap-2 rounded-lg py-2 px-2 sm:px-3 text-xs sm:text-sm font-semibold transition-colors duration-150 ${isSelected
                    ? 'bg-white text-teal-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'}`}>
                <Icon className={`h-4 w-4 shrink-0 ${isSelected ? 'text-teal-700' : 'text-slate-500'}`}/>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>);
        })}
        </div>

        {/* Tab content panel */}
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center rounded-md border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800 mb-2">
                Engineering Standard
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">{current.title}</h3>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg">
                {current.description}
              </p>
            </div>
          </div>

          {/* Deliverables checklist */}
          <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Included In Every Project:
            </h4>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {current.deliverables.map((item) => (<div key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-700 shrink-0 mt-0.5"/>
                  <span className="text-xs sm:text-sm text-slate-800 font-medium">{item}</span>
                </div>))}
            </div>
          </div>

          {/* Tech stack tags */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Stack:</span>
            {current.techStack.map((tech) => (<span key={tech} className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-mono text-slate-700">
                {tech}
              </span>))}
          </div>

          {/* Specs grid */}
          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-200 pt-4 text-center">
            {current.specs.map((spec) => (<div key={spec.label} className="rounded-lg bg-slate-50 p-2 border border-slate-200/80">
                <p className="text-[11px] text-slate-500">{spec.label}</p>
                <p className="text-xs font-semibold text-slate-900 mt-0.5 truncate">{spec.value}</p>
              </div>))}
          </div>

          {/* Bottom link */}
          <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
            <Link to={current.serviceLink} className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-900 transition">
              Learn more about this capability <ArrowRight className="h-3.5 w-3.5"/>
            </Link>
            <Link to="/contact" className="btn btn-sm btn-primary">
              Request Quote
            </Link>
          </div>
        </div>
      </div>
    </div>);
}
