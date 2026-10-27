import { Navigate, Route, Routes } from 'react-router-dom';
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
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="leads/:id" element={<LeadDetail />} />
            {Object.entries(RESOURCES).map(([path, cfg]) => <Route key={path} path={path} element={<Resource key={path} cfg={cfg} />} />)}
            <Route path="media" element={<Media />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="users" element={<Users />} />
            <Route path="audit" element={<Audit />} />
            <Route path="account" element={<ChangePassword />} />
            <Route path="*" element={<p className="p-8 text-muted">Page not found.</p>} />
          </Route>
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}
