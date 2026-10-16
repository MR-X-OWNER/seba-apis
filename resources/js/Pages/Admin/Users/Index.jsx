import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Layout, { fmt } from '../../../Layout';

function UserRow({ user }) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const adjust = (type) => {
    router.post(`/admin/users/${user.id}/adjust`, { type, amount, note }, {
      preserveScroll: true,
      onSuccess: () => { setAmount(''); setNote(''); },
    });
  };

  return (
    <tr className="border-t border-slate-200 dark:border-slate-800 align-top">
      <td className="p-3">
        <div className="font-semibold">{user.name}</div>
        <div className="text-xs text-slate-500">{user.email}</div>
      </td>
      <td className="p-3 font-bold">৳ {fmt(user.balance)}</td>
      <td className="p-3">
        <span className={user.status === 'active' ? 'text-emerald-600' : 'text-rose-600'}>{user.status === 'active' ? 'Active' : 'Blocked'}</span>
      </td>
      <td className="p-3">
        <div className="flex flex-wrap gap-2">
          <input type="number" min="0.01" step="0.01" placeholder="পরিমাণ" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-28 rounded-lg border px-2 py-1 bg-transparent" />
          <input placeholder="নোট" value={note} onChange={(e) => setNote(e.target.value)} className="w-32 rounded-lg border px-2 py-1 bg-transparent" />
          <button onClick={() => adjust('credit')} className="rounded-lg bg-emerald-600 text-white px-3 py-1 text-sm">+ Add</button>
          <button onClick={() => adjust('debit')} className="rounded-lg bg-amber-600 text-white px-3 py-1 text-sm">− Deduct</button>
          <button onClick={() => router.post(`/admin/users/${user.id}/toggle`, {}, { preserveScroll: true })} className="rounded-lg bg-slate-600 text-white px-3 py-1 text-sm">
            {user.status === 'active' ? 'Block' : 'Unblock'}
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function UsersIndex({ users }) {
  const { errors } = usePage().props;

  return (
    <Layout>
      <h1 className="text-2xl font-extrabold mb-6">ইউজার ও Balance</h1>

      {errors?.amount && <div className="mb-4 rounded-xl bg-rose-100 text-rose-700 px-4 py-2">{errors.amount}</div>}

      <div className="overflow-x-auto rounded-2xl bg-white dark:bg-slate-900 shadow border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800 text-left">
            <tr>
              <th className="p-3">ইউজার</th>
              <th className="p-3">Balance</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => <UserRow key={u.id} user={u} />)}
            {users.length === 0 && (
              <tr><td className="p-3 text-slate-500" colSpan={4}>এখনো কোনো ইউজার নেই।</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
