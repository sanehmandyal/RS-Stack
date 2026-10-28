import { ErrorState, Skeleton } from '../components/ui';
import { useFetch } from '../hooks/useFetch';
import { api } from '../services/api';
import { PageTitle } from './ui';
export default function Integrations() {
    const { data, loading, error, reload } = useFetch(() => api('/admin/integrations'), []);
    return (<>
      <PageTitle title="Integrations"/>
      <p className="mb-4 text-sm text-muted">“Configured” means the environment variables are present on the server. It does not prove the service is working. Items marked manual have no live API connection.</p>
      {loading && <Skeleton className="h-48"/>}
      {error && <ErrorState error={error} onRetry={reload}/>}
      <div className="grid gap-4 md:grid-cols-2">
        {data?.items.map((i) => (<div key={i.key} className="card">
            <div className="flex items-center justify-between gap-3"><h2 className="text-base">{i.name}</h2>
              <span className={`chip ${i.configured ? 'text-emerald-200' : 'text-amber-200'}`}>{i.configured ? 'Configured' : i.mode === 'manual' ? 'Not connected (manual)' : 'Not configured'}</span></div>
            <p className="mt-2 text-sm text-muted">{i.note}</p>
          </div>))}
      </div>
    </>);
}
