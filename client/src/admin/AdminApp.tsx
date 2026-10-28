import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AuthProvider, useAuth } from './auth';
import AdminLayout from './AdminLayout';
import { ToastProvider } from './toast';
import { Login, ForgotPassword, ResetPassword } from './Login';
import ChangePassword from './ChangePassword';
import Dashboard from './Dashboard';
import Leads from './Leads';
import LeadDetail from './LeadDetail';
import Resource from './Resource';
import { RESOURCES } from './resources';
import Users from './Users';
import SettingsPage from './SettingsPage';
import Integrations from './Integrations';
import Media from './Media';
import Audit from './Audit';
import { Skeleton } from '../components/ui';

function Guard() {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8"><Skeleton className="h-32" /></div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (user.mustChangePassword) return <ChangePassword forced />;
  return <AdminLayout />;
}

function RequirePerm({ perm, children }: { perm: string; children: React.ReactElement }) {
  const { can } = useAuth();
  if (!can(perm)) {
    return (
      <div className="card m-6 p-8 text-center max-w-md mx-auto">
        <h3 className="text-lg font-bold text-ink">Access Restricted</h3>
        <p className="mt-2 text-sm text-muted">You do not have administrative permission to view this section.</p>
        <div className="mt-4">
          <Link to="/admin/dashboard" className="btn-primary btn-sm">Return to Dashboard</Link>
        </div>
      </div>
    );
  }
  return children;
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Helmet><title>Admin | RS Stack</title><meta name="robots" content="noindex, nofollow" /></Helmet>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route element={<Guard />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<RequirePerm perm="dashboard:view"><Dashboard /></RequirePerm>} />
            <Route path="leads" element={<RequirePerm perm="leads:read_all"><Leads /></RequirePerm>} />
            <Route path="leads/:id" element={<RequirePerm perm="leads:read_all"><LeadDetail /></RequirePerm>} />
            {Object.entries(RESOURCES).map(([path, cfg]) => <Route key={path} path={path} element={<Resource key={path} cfg={cfg} />} />)}
            <Route path="media" element={<RequirePerm perm="media:manage"><Media /></RequirePerm>} />
            <Route path="integrations" element={<RequirePerm perm="integrations:manage"><Integrations /></RequirePerm>} />
            <Route path="settings" element={<RequirePerm perm="settings:manage"><SettingsPage /></RequirePerm>} />
            <Route path="users" element={<RequirePerm perm="users:manage"><Users /></RequirePerm>} />
            <Route path="audit" element={<RequirePerm perm="audit:view"><Audit /></RequirePerm>} />
            <Route path="account" element={<ChangePassword />} />
            <Route path="*" element={<p className="p-8 text-muted">Page not found.</p>} />
          </Route>
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}
