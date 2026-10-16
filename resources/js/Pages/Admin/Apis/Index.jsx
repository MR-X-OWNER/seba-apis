import { Link, router, usePage } from '@inertiajs/react';
import Layout, { fmt } from '../../../Layout';

export default function ApisIndex({ apis }) {
  const { flash } = usePage().props;

  const remove = (api) => {
    if (confirm(`"${api.name}" মুছে ফেলবেন?`)) router.delete(`/admin/apis/${api.id}`);
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="text-2xl font-extrabold">API সমূহ</h1>
        <Link href="/admin/apis/create" className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2">
          + নতুন API
        </Link>
      </div>

      {flash?.success && (
        <div className="mb-4 rounded-xl bg-emerald-100 text-emerald-800 px-4 py-2">{flash.success}</div>
      )}

      <div className="overflow-x-auto rounded-2xl bg-white dark:bg-slate-900 shadow border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800 text-left">
            <tr>
              <th className="p-3">নাম</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Provider খরচ</th>
              <th className="p-3">User Price</th>
              <th className="p-3">লাভ</th>
              <th className="p-3">Limit/min</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {apis.map((api) => (
              <tr key={api.id} className="border-t border-slate-200 dark:border-slate-800">
                <td className="p-3 font-semibold">{api.name}</td>
                <td className="p-3">{api.slug}</td>
                <td className="p-3">৳ {fmt(api.provider_cost)}</td>
                <td className="p-3">৳ {fmt(api.user_price)}</td>
                <td className="p-3 text-emerald-600 font-semibold">৳ {fmt(api.user_price - api.provider_cost)}</td>
                <td className="p-3">{api.rate_limit_per_min ?? 'সীমাহীন'}</td>
                <td className="p-3">
                  <button
                    onClick={() => router.post(`/admin/apis/${api.id}/toggle`)}
                    className={`rounded-lg px-2 py-1 text-white text-xs ${api.is_enabled ? 'bg-emerald-600' : 'bg-slate-500'}`}
                  >
                    {api.is_enabled ? 'ON' : 'OFF'}
                  </button>
                </td>
                <td className="p-3 space-x-2 whitespace-nowrap">
                  <Link href={`/admin/apis/${api.id}/edit`} className="text-indigo-600 font-semibold">Edit</Link>
                  <button onClick={() => remove(api)} className="text-rose-600 font-semibold">Delete</button>
                </td>
              </tr>
            ))}
            {apis.length === 0 && (
              <tr><td className="p-3 text-slate-500" colSpan={8}>এখনো কোনো API যোগ করা হয়নি।</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
