import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Check,
  Copy,
  ExternalLink,
  FileText,
  Globe2,
  HelpCircle,
  Laptop,
  Mail,
  MapPin,
  RefreshCw,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
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
      await api('/admin/seed-sync', { method: 'POST' });
      toast('ok', 'All website catalog data synchronized with admin panel');
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
      <PageTitle title="Website Pages Hub">
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
              Access, Inspect & Share Any Website Page
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Every page on Growora is dynamically linked to this Admin Panel. You can view the live public page, copy 1-click shareable URLs for clients, share pages directly to WhatsApp, and manage the underlying content and SEO.
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
              className="btn btn-sm btn-ghost bg-white"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Copy All Links</span>
            </button>
          </div>
        </div>
      </div>

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
  );
}
