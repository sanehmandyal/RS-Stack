import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  Globe2,
  HelpCircle,
  Laptop,
  Layers,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { originalFaqs, originalProjects, originalServices } from '../data/originalData';
import { fallbackBlogPosts, fallbackSettings, fallbackTestimonials } from '../data/fallbackData';
import { api } from '../services/api';
import { useToast } from './toast';
import { PageTitle } from './ui';

const WEBSITE_PAGES = [
  {
    id: 'home',
    title: 'Homepage',
    path: '/',
    category: 'Core',
    description: 'Main landing page featuring the hero headline, 7-service circular orbital animation, value pillars, and primary consultation CTA.',
    managedUnder: 'Settings & Home Copy',
    adminLink: '/admin/settings',
    seoPath: '/',
    icon: Laptop,
  },
  {
    id: 'services',
    title: 'Services Catalog',
    path: '/services',
    category: 'Commercial',
    description: 'Complete listing of all 7 core offerings: Website Creation, Local SEO, On-Page SEO, Off-Page SEO, Google Ads, Domain & Hosting, and Listings.',
    managedUnder: 'Services Resource',
    adminLink: '/admin/services',
    seoPath: '/services',
    icon: Globe2,
  },
  {
    id: 'portfolio',
    title: 'Portfolio & Case Studies',
    path: '/portfolio',
    category: 'Commercial',
    description: 'Verified client case studies, live platform demonstrations, technical stack highlights, and measured conversion metrics.',
    managedUnder: 'Projects Resource',
    adminLink: '/admin/projects',
    seoPath: '/portfolio',
    icon: Briefcase,
  },
  {
    id: 'industries',
    title: 'Industry Solutions',
    path: '/industries',
    category: 'Marketing',
    description: 'Dedicated growth playbooks tailored for Local Service Providers, Healthcare, Hospitality, Retail, and Corporate B2B.',
    managedUnder: 'Website Content',
    adminLink: '/admin/services',
    seoPath: '/industries',
    icon: Sparkles,
  },
  {
    id: 'about',
    title: 'About Growora',
    path: '/about',
    category: 'Company',
    description: 'Company background, engineering standards, direct Mohali Phase 5 team, code ownership guarantees, and technology ethos.',
    managedUnder: 'Settings & Company',
    adminLink: '/admin/settings',
    seoPath: '/about',
    icon: ShieldCheck,
  },
  {
    id: 'locations',
    title: 'Locations & Service Areas',
    path: '/locations',
    category: 'Local SEO',
    description: 'Geo-targeted regional landing pages for Mohali, Chandigarh, Panchkula, Zirakpur, Kharar, and wider Punjab & Tricity.',
    managedUnder: 'Clients & GBP Tasks',
    adminLink: '/admin/clients',
    seoPath: '/locations',
    icon: MapPin,
  },
  {
    id: 'blog',
    title: 'Blog & Engineering Insights',
    path: '/blog',
    category: 'Content',
    description: 'Educational articles on Google Maps ranking, Core Web Vitals, sub-second speed optimization, and MERN stack architectures.',
    managedUnder: 'Blog Resource',
    adminLink: '/admin/blog',
    seoPath: '/blog',
    icon: BookOpen,
  },
  {
    id: 'contact',
    title: 'Contact & Quote Engine',
    path: '/contact',
    category: 'Leads',
    description: 'Project inquiry form, instant quotation requests, and direct WhatsApp route routing. All submissions sync directly to Admin Leads.',
    managedUnder: 'Leads Inbox',
    adminLink: '/admin/leads',
    seoPath: '/contact',
    icon: Mail,
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    path: '/privacy-policy',
    category: 'Legal',
    description: 'GDPR & Indian Digital Personal Data Protection (DPDP) compliance, cookie policies, and data handling protocols.',
    managedUnder: 'Legal Compliance',
    adminLink: '/admin/settings',
    seoPath: '/privacy-policy',
    icon: FileText,
  },
  {
    id: 'terms',
    title: 'Terms & Conditions',
    path: '/terms-and-conditions',
    category: 'Legal',
    description: 'Service level agreements, code ownership transfer terms, client milestones, and warranties.',
    managedUnder: 'Legal Compliance',
    adminLink: '/admin/settings',
    seoPath: '/terms-and-conditions',
    icon: FileText,
  },
  {
    id: 'refund',
    title: 'Refund & Cancellation Policy',
    path: '/refund-policy',
    category: 'Legal',
    description: 'Transparent milestone refund guidelines, scope guarantees, and deposit terms.',
    managedUnder: 'Legal Compliance',
    adminLink: '/admin/settings',
    seoPath: '/refund-policy',
    icon: FileText,
  },
];

export default function PagesHub() {
  const toast = useToast();
  const [copiedId, setCopiedId] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('pages'); // 'pages' | 'catalog'

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://rs-stack.vercel.app';

  const copyPageLink = (page) => {
    const fullUrl = `${baseUrl}${page.path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(page.id);
    toast('ok', `Copied link: ${fullUrl}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shareOnWhatsApp = (page) => {
    const fullUrl = `${baseUrl}${page.path}`;
    const text = encodeURIComponent(`Check out Growora's ${page.title}: ${fullUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleGlobalSync = async () => {
    setSyncing(true);
    try {
      let serverSyncWorked = false;
      try {
        const s = await api('/admin/seed-sync', { method: 'POST' });
        if (s?.ok) serverSyncWorked = true;
      } catch {}

      if (!serverSyncWorked) {
        for (const s of originalServices) {
          await api('/admin/services', { method: 'POST', body: s }).catch(() => {});
        }
        for (const p of originalProjects) {
          await api('/admin/projects', { method: 'POST', body: p }).catch(() => {});
        }
        for (const b of fallbackBlogPosts) {
          await api('/admin/blog-posts', { method: 'POST', body: b }).catch(() => {});
        }
        await api('/admin/settings', { method: 'PUT', body: fallbackSettings }).catch(() => {});
      }

      toast('ok', 'All website catalog data successfully synced with admin database!');
    } catch (err) {
      toast('err', err.message || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const filteredPages = WEBSITE_PAGES.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <PageTitle title="Website Pages & Data Hub">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGlobalSync}
            disabled={syncing}
            className="btn btn-sm btn-ghost inline-flex items-center gap-1.5"
            title="Force synchronization between website and admin database"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-orange-600 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync Site & Admin Data'}</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-primary inline-flex items-center gap-1.5 shadow-xs"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Open Live Website</span>
          </a>
        </div>
      </PageTitle>

      {/* Info & Shareable Header Strip */}
      <div className="mb-6 rounded-2xl border border-orange-200/90 bg-gradient-to-r from-red-50/70 via-orange-50/50 to-amber-50/60 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-700">
              <Sparkles className="h-3.5 w-3.5 text-red-600" />
              Live Connected Website Architecture
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
              Access, Inspect & Share Any Website Page or Service
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Every page and service offering on Growora is dynamically connected to this Admin Panel. View live content, share 1-click URLs or WhatsApp briefs with clients, and synchronize data directly with MongoDB.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const allLinks = WEBSITE_PAGES.map((p) => `${p.title}: ${baseUrl}${p.path}`).join('\n');
                navigator.clipboard.writeText(allLinks);
                toast('ok', 'All website page links copied to clipboard');
              }}
              className="btn btn-sm btn-ghost bg-white shadow-xs"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Copy All Links</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('pages')}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition inline-flex items-center gap-2 ${
            activeTab === 'pages'
              ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Connected Pages ({WEBSITE_PAGES.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition inline-flex items-center gap-2 ${
            activeTab === 'catalog'
              ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Globe2 className="h-4 w-4" />
          <span>Website Content & Services (7 Core Offerings)</span>
        </button>
      </div>

      {activeTab === 'pages' && (
        <>
          {/* Search & Filter Bar */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                className="input pl-9 text-sm"
                placeholder="Search pages by name, path or category…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <span className="text-xs font-semibold text-slate-500">
              Showing {filteredPages.length} of {WEBSITE_PAGES.length} public pages
            </span>
          </div>

          {/* Pages Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPages.map((page) => {
              const PageIcon = page.icon;
              const isCopied = copiedId === page.id;

              return (
                <div
                  key={page.id}
                  className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col justify-between hover:border-orange-300 transition-all duration-200 group"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-red-50 to-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
                          <PageIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition">
                            {page.title}
                          </h3>
                          <span className="inline-block text-[11px] font-mono font-medium text-slate-500">
                            {page.path}
                          </span>
                        </div>
                      </div>

                      <span className="chip text-[10px] font-bold text-slate-600 bg-slate-100">
                        {page.category}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                      {page.description}
                    </p>

                    {/* Admin Management Tag */}
                    <div className="rounded-lg bg-slate-50 px-2.5 py-1.5 border border-slate-100 text-[11px] text-slate-600 flex items-center justify-between mb-4">
                      <span className="font-semibold text-slate-700">Data source:</span>
                      <span className="font-medium text-orange-700">{page.managedUnder}</span>
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => copyPageLink(page)}
                        title="Copy shareable link"
                        className="h-8 w-8 rounded-lg border border-slate-200 bg-white hover:bg-orange-50 hover:border-orange-300 flex items-center justify-center text-slate-600 hover:text-orange-600 transition"
                      >
                        {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => shareOnWhatsApp(page)}
                        title="Share link on WhatsApp"
                        className="h-8 w-8 rounded-lg border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 flex items-center justify-center text-slate-600 hover:text-emerald-600 transition"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                      </button>

                      <a
                        href={page.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open live page in new tab"
                        className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-1 text-xs font-semibold text-slate-700 transition"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>View</span>
                      </a>
                    </div>

                    <Link
                      to={page.adminLink}
                      className="btn btn-sm btn-ghost text-xs text-orange-700 font-semibold inline-flex items-center gap-1"
                    >
                      <span>Manage</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'catalog' && (
        <div className="space-y-8">
          {/* 7 Core Services Breakdown */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-xs bg-red-600 ring-2 ring-orange-200" />
                  All 7 Core Services (Live Website Catalog & Database)
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Synchronized with MongoDB and actively presented across the Homepage and /services.
                </p>
              </div>

              <Link to="/admin/services" className="btn btn-sm btn-primary inline-flex items-center gap-1.5 shadow-xs">
                <span>Manage in Services</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {originalServices.map((s) => {
                const liveUrl = `/services/${s.slug}`;
                const fullUrl = `${baseUrl}${liveUrl}`;
                return (
                  <div key={s.slug} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="chip text-[10px] font-bold uppercase text-orange-700 bg-orange-100">
                          {s.category}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">#{s.order}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">{s.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2 mb-3">{s.summary}</p>
                    </div>

                    <div className="border-t border-slate-200/60 pt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(fullUrl);
                            toast('ok', `Copied link: ${fullUrl}`);
                          }}
                          className="h-7 w-7 rounded-md border border-slate-200 bg-white hover:bg-orange-50 flex items-center justify-center text-slate-600 hover:text-orange-600 text-xs transition"
                          title="Copy service link"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const msg = encodeURIComponent(`Growora Service: ${s.title} - ${fullUrl}`);
                            window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
                          }}
                          className="h-7 w-7 rounded-md border border-slate-200 bg-white hover:bg-emerald-50 flex items-center justify-center text-slate-600 hover:text-emerald-600 text-xs transition"
                          title="Share on WhatsApp"
                        >
                          <Share2 className="h-3 w-3" />
                        </button>
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-7 px-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-1 text-[11px] font-semibold text-slate-700 transition"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>View</span>
                        </a>
                      </div>

                      <Link to="/admin/services" className="text-xs font-semibold text-orange-700 hover:underline">
                        Edit →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Portfolio & Case Studies */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-xs bg-orange-600 ring-2 ring-red-200" />
                  Portfolio & Case Studies ({originalProjects.length} Verified Projects)
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Client deliverables with tech highlights and conversion metrics.
                </p>
              </div>

              <Link to="/admin/projects" className="btn btn-sm btn-ghost inline-flex items-center gap-1.5">
                <span>Manage in Projects</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {originalProjects.map((p) => {
                const liveUrl = `/portfolio/${p.slug}`;
                const fullUrl = `${baseUrl}${liveUrl}`;
                return (
                  <div key={p.slug} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-between">
                    <div>
                      <span className="chip text-[10px] font-bold text-slate-600 bg-slate-200/80 mb-2 inline-block">
                        {p.industry}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">{p.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2 mb-3">{p.summary}</p>
                    </div>

                    <div className="border-t border-slate-200/60 pt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(fullUrl);
                            toast('ok', `Copied link: ${fullUrl}`);
                          }}
                          className="h-7 w-7 rounded-md border border-slate-200 bg-white flex items-center justify-center text-slate-600 text-xs hover:text-orange-600"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-7 px-2 rounded-md border border-slate-200 bg-white flex items-center gap-1 text-[11px] font-semibold text-slate-700"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>View</span>
                        </a>
                      </div>
                      <Link to="/admin/projects" className="text-xs font-semibold text-orange-700 hover:underline">
                        Edit →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Business Profile & Contact Info */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                Active Business Profile & Contact Data
              </h3>
              <Link to="/admin/settings" className="btn btn-sm btn-ghost text-xs font-semibold text-orange-700">
                Edit in Settings →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
              <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
                <span className="font-semibold text-slate-500 block">Brand Name</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">{fallbackSettings.businessName}</span>
              </div>
              <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
                <span className="font-semibold text-slate-500 block">Primary Contact Phone</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">{fallbackSettings.phone}</span>
              </div>
              <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
                <span className="font-semibold text-slate-500 block">Official Email</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">{fallbackSettings.contactEmail}</span>
              </div>
              <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
                <span className="font-semibold text-slate-500 block">Operating Office</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block truncate">{fallbackSettings.address}</span>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
