import { BarChart3, BookOpen, Briefcase, ExternalLink, FileText, Globe, HelpCircle, Inbox, KeyRound, LayoutDashboard, LogOut, Map, Megaphone, Menu, MessageSquareQuote, Plug, Search, Server, Settings, ShieldCheck, Users, X, Image as ImageIcon, Wrench } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../components/ui';
import { useAuth } from './auth';
const ITEMS = [
    ['dashboard', 'Dashboard', LayoutDashboard, ['dashboard:view']],
    ['pages', 'Website Pages', Globe, ['content:manage']],
    ['leads', 'Leads', Inbox, ['leads:read_all', 'leads:read_assigned']],
    ['services', 'Services', Wrench, ['content:manage']],
    ['projects', 'Projects', Briefcase, ['content:manage']],
    ['blog', 'Blog', BookOpen, ['blog:manage']],
    ['blog-categories', 'Blog categories', FileText, ['blog:manage']],
    ['testimonials', 'Testimonials', MessageSquareQuote, ['content:manage']],
    ['faqs', 'FAQs', HelpCircle, ['content:manage']],
    ['media', 'Media', ImageIcon, ['media:manage']],
    ['seo', 'SEO metadata', Search, ['seo:manage']],
    ['redirects', 'Redirects', Globe, ['seo:manage']],
    ['clients', 'Local SEO clients', Map, ['local:manage']],
    ['gbp-tasks', 'Profile tasks', BarChart3, ['local:manage']],
    ['directory-listings', 'Directory listings', FileText, ['local:manage']],
    ['campaigns', 'Ad campaigns', Megaphone, ['campaigns:manage']],
    ['domains', 'Domains & hosting', Server, ['hosting:manage']],
    ['integrations', 'Integrations', Plug, ['integrations:manage']],
    ['settings', 'Settings', Settings, ['settings:manage']],
    ['users', 'Users', Users, ['users:manage']],
    ['audit', 'Audit log', ShieldCheck, ['audit:view']],
];
export default function AdminLayout() {
    const { user, logout, can } = useAuth();
    const nav = useNavigate();
    const { pathname } = useLocation();
    const [open, setOpen] = useState(false);
    useEffect(() => setOpen(false), [pathname]);
    const crumbs = pathname.replace(/^\/admin\/?/, '').split('/').filter(Boolean);
    const sidebar = (<nav aria-label="Admin" className="flex h-full flex-col gap-1 overflow-y-auto p-3 bg-white">
      <Link to="/admin/dashboard" className="mb-4 px-2 pt-2"><Logo /></Link>
      {ITEMS.filter(([, , , p]) => can(...p)).map(([to, label, Icon]) => (<NavLink key={to} to={to} className={({ isActive }) => `flex min-h-[40px] items-center gap-3 rounded-xl px-3 text-sm transition-colors ${isActive
                ? 'bg-primary/10 text-primary font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-ink font-medium'}`}>
          <Icon className="h-4 w-4" aria-hidden/> {label}
        </NavLink>))}
    </nav>);
    return (<div className="min-h-dvh bg-bg lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="bg-white sticky top-0 hidden h-dvh border-r border-slate-200 lg:block">{sidebar}</aside>
      {open && (<div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button className="absolute inset-0 bg-black/40 backdrop-blur-xs" aria-label="Close menu" onClick={() => setOpen(false)}/>
          <aside className="bg-white absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-slate-200 shadow-2xl">{sidebar}</aside>
        </div>)}
      <div className="min-w-0 flex flex-col min-h-dvh">
        <header className="bg-white/95 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 shadow-xs">
          <div className="flex min-w-0 items-center gap-3">
            <button className="btn-ghost btn-sm lg:hidden" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X className="h-4 w-4"/> : <Menu className="h-4 w-4"/>}</button>
            <nav aria-label="Breadcrumb" className="truncate text-sm text-muted"><Link to="/admin/dashboard" className="hover:text-primary transition">Admin</Link>{crumbs.map((c) => <span key={c}> / <span className="capitalize text-ink font-medium">{c.replace(/-/g, ' ').slice(0, 24)}</span></span>)}</nav>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/admin/pages" className="btn-ghost btn-sm inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800" title="Access all website pages and shareable links">
              <Globe className="h-3.5 w-3.5 text-orange-600"/>
              <span className="hidden md:inline">Website Pages</span>
            </Link>
            <a href="/" target="_blank" rel="noopener noreferrer" className="btn-primary btn-sm inline-flex items-center gap-1.5 text-xs font-semibold shadow-xs" title="Open live public website in new tab">
              <ExternalLink className="h-3.5 w-3.5"/>
              <span className="hidden sm:inline">Live Website</span>
            </a>
            <span className="hidden text-right text-xs sm:block pl-2 border-l border-slate-200">
              <span className="block font-semibold text-ink">
                {user.name === 'RS Stack Admin' ? 'Growora Admin' : (user.name || 'Growora Admin')}
              </span>
              <span className="capitalize text-muted">{user.role?.replace('_', ' ') || 'Super Admin'}</span>
            </span>
            <Link to="/admin/account" className="btn-ghost btn-sm" aria-label="Account and password"><KeyRound className="h-4 w-4"/></Link>
            <button className="btn-ghost btn-sm" onClick={async () => { await logout(); nav('/admin/login'); }}><LogOut className="h-4 w-4" aria-hidden/> <span className="hidden sm:inline">Sign out</span></button>
          </div>
        </header>
        <main className="p-4 sm:p-6 flex-1"><Outlet /></main>
      </div>
    </div>);
}
