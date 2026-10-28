import { useState } from 'react';
import { ErrorState, Skeleton } from '../components/ui';
import { useFetch } from '../hooks/useFetch';
import { api } from '../services/api';
import { fmtDateTime } from '../utils/format';
import { DataTable, PageTitle, Pager, Td, Th } from './ui';
export default function Audit() {
    const [page, setPage] = useState(1);
    const [action, setAction] = useState('');
    const { data, loading, error, reload } = useFetch(() => api(`/admin/audit-log?page=${page}${action ? `&action=${encodeURIComponent(action)}` : ''}`), [page, action]);
    return (<>
      <PageTitle title="Audit log"/>
      <div className="mb-4"><label className="sr-only" htmlFor="aa">Filter by action</label><input id="aa" className="input w-72" placeholder="Filter by exact action, e.g. auth.login_failed" value={action} onChange={(e) => { setAction(e.target.value); setPage(1); }}/></div>
      {loading && <Skeleton className="h-48"/>}
      {error && <ErrorState error={error} onRetry={reload}/>}
      {data && (<>
          <DataTable label="Audit log">
            <thead><tr><Th>When</Th><Th>Actor</Th><Th>Action</Th><Th>Target</Th></tr></thead>
            <tbody>{data.items.map((a) => <tr key={a._id}><Td className="whitespace-nowrap">{fmtDateTime(a.createdAt)}</Td><Td>{a.actorEmail ?? '-'}</Td><Td>{a.action}</Td><Td>{a.targetType} {a.targetId}</Td></tr>)}</tbody>
          </DataTable>
          <Pager page={data.page} pages={data.pages} onPage={setPage}/>
        </>)}
    </>);
}
