import { useState } from 'react';
import { ErrorState, Skeleton } from '../components/ui';
import { useFetch } from '../hooks/useFetch';
import { api } from '../services/api';
import { fmtDateTime } from '../utils/format';
import { useAuth } from './auth';
import { useToast } from './toast';
import { Badge, Confirm, DataTable, PageTitle, Td, Th } from './ui';
const ROLES = [['super_admin', 'Super Admin'], ['admin', 'Admin'], ['marketing_manager', 'Marketing Manager'], ['sales_manager', 'Sales Manager']];
export default function Users() {
    const { user: me } = useAuth();
    const toast = useToast();
    const { data, loading, error, reload } = useFetch(() => api('/admin/users?limit=100'), []);
    const [form, setForm] = useState({ name: '', email: '', role: 'sales_manager', password: '' });
    const [formErr, setFormErr] = useState('');
    const [del, setDel] = useState(null);
    const act = async (fn, ok) => { try {
        await fn();
        toast('ok', ok);
        reload();
    }
    catch (e) {
        toast('err', e.message);
    } };
    const create = async (e) => {
        e.preventDefault();
        setFormErr('');
        try {
            await api('/admin/users', { method: 'POST', body: form });
            toast('ok', 'User created. They must change the password at first sign-in.');
            setForm({ name: '', email: '', role: 'sales_manager', password: '' });
            reload();
        }
        catch (err) {
            const a = err;
            setFormErr(a.issues?.map((i) => i.message).join('; ') || a.message);
        }
    };
    return (<>
      <PageTitle title="Users"/>
      <form onSubmit={create} className="glass mb-6 grid gap-3 rounded-2xl p-4 sm:grid-cols-2 lg:grid-cols-5" aria-label="Create user">
        <input aria-label="Name" required className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/>
        <input aria-label="Email" type="email" required className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}/>
        <select aria-label="Role" className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{ROLES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        <input aria-label="Temporary password" type="password" required minLength={12} autoComplete="new-password" className="input" placeholder="Temporary password (12+)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}/>
        <button className="btn-primary">Create user</button>
        {formErr && <p role="alert" className="text-sm text-red-300 sm:col-span-2 lg:col-span-5">{formErr}</p>}
      </form>
      {loading && <Skeleton className="h-40"/>}
      {error && <ErrorState error={error} onRetry={reload}/>}
      {data && (<DataTable label="Users">
          <thead><tr><Th>Name</Th><Th>Role</Th><Th>Status</Th><Th>Last sign-in</Th><Th><span className="sr-only">Actions</span></Th></tr></thead>
          <tbody>{data.items.map((u) => {
                const self = u.id === me.id;
                return (<tr key={u.id}>
                <Td><b>{u.name}</b><span className="block text-xs text-muted">{u.email}</span></Td>
                <Td><select aria-label={`Role for ${u.name}`} className="input w-44" value={u.role} disabled={self} onChange={(e) => act(() => api(`/admin/users/${u.id}`, { method: 'PATCH', body: { role: e.target.value } }), 'Role updated')}>{ROLES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Td>
                <Td><Badge value={u.active ? 'active' : 'disabled'}/></Td>
                <Td className="whitespace-nowrap">{fmtDateTime(u.lastLoginAt)}</Td>
                <Td className="whitespace-nowrap text-right">
                  {!self && <button className="btn-ghost btn-sm" onClick={() => act(() => api(`/admin/users/${u.id}`, { method: 'PATCH', body: { active: !u.active } }), u.active ? 'User disabled' : 'User enabled')}>{u.active ? 'Disable' : 'Enable'}</button>}{' '}
                  <button className="btn-ghost btn-sm" onClick={() => act(() => api(`/admin/users/${u.id}/revoke-sessions`, { method: 'POST' }), 'Sessions revoked')}>Revoke sessions</button>{' '}
                  {!self && <button className="btn-danger btn-sm" onClick={() => setDel(u)}>Delete</button>}
                </Td>
              </tr>);
            })}</tbody>
        </DataTable>)}
      <Confirm open={!!del} title="Delete this user?" text={`${del?.email ?? ''} will lose access immediately.`} onCancel={() => setDel(null)} onConfirm={() => { const u = del; setDel(null); void act(() => api(`/admin/users/${u.id}`, { method: 'DELETE' }), 'User deleted'); }}/>
    </>);
}
