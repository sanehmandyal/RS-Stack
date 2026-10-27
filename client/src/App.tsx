import { lazy, Suspense } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import { Skeleton } from './components/ui';
import PublicLayout from './layouts/PublicLayout';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPostPage from './pages/BlogPost';
import Contact from './pages/Contact';
import Home from './pages/Home';
import IndustryDetail from './pages/IndustryDetail';
import Industries from './pages/Industries';
import Legal from './pages/Legal';
import LocalLanding from './pages/LocalLanding';
import Locations from './pages/Locations';
import NotFound from './pages/NotFound';
import Portfolio from './pages/Portfolio';
import ProjectDetail from './pages/ProjectDetail';
import ServiceDetail from './pages/ServiceDetail';
import Services from './pages/Services';

function LocalLandingWrapper() {
  const { slug } = useParams();
  return <LocalLanding slug={slug} />;
}

// The admin app is code-split so public visitors never download it.
const AdminApp = lazy(() => import('./admin/AdminApp'));

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:slug" element={<ServiceDetail />} />
        <Route path="industries" element={<Industries />} />
        <Route path="industries/:slug" element={<IndustryDetail />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="portfolio/:slug" element={<ProjectDetail />} />
        <Route path="about" element={<About />} />
        <Route path="locations" element={<Locations />} />
        <Route path="locations/:slug" element={<LocalLandingWrapper />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPostPage />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy-policy" element={<Legal kind="privacy" />} />
        <Route path="terms-of-service" element={<Legal kind="terms" />} />
        <Route path="cookie-policy" element={<Legal kind="cookies" />} />
        <Route path="refund-policy" element={<Legal kind="refund" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route
        path="admin/*"
        element={
          <Suspense fallback={<div className="p-8"><Skeleton className="h-40" /></div>}>
            <AdminApp />
          </Suspense>
        }
      />
    </Routes>
  );
}
