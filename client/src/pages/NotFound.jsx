import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
export default function NotFound() {
    return (<section className="grid min-h-[70dvh] place-items-center px-4 pt-32 text-center">
      <Helmet><title>Page not found | Growora</title><meta name="robots" content="noindex"/></Helmet>
      <div>
        <p className="text-sm font-semibold text-secondary">404</p>
        <h1 className="mt-2 text-4xl">Page not found</h1>
        <p className="mt-3 text-muted">The page you are looking for does not exist or has moved.</p>
        <div className="mt-6 flex justify-center gap-3"><Link to="/" className="btn-primary">Back to home</Link><Link to="/contact" className="btn-ghost">Contact us</Link></div>
      </div>
    </section>);
}
