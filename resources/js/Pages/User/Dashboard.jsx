import { router, usePage } from '@inertiajs/react';
import Layout, { StatCard, fmt } from '../../Layout';

export default function UserDashboard({ stats, key, apis, history }) {
  const { flash } = usePage().props;
  const newKey = flash?.new_api_key;

  const generate = () => router.post('/dashboard/api-key', {}, { preserveScroll: true });
  const revoke = () => {
    if (confirm('Key বাতিল করবেন? পুরোনো key আর কাজ করবে না।')) {
      router.delete('/dashboard/api-key', { preserveScroll: true });
    }
  };

  return (
    <Layout>
      <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-xl">
        <p className="text-white/80">বর্তমান ব্যালেন্স</p>
        <p className="text-4xl md:text-5xl font-extrabold mt-2">৳ {fmt(stats.balance)}</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
        <StatCard title="আজকের Hits" value={fmt(stats.hits_today)} gradient="from-sky-500 to-blue-700" />
        <StatCard title="মোট Hits" value={fmt(stats.hits_total)} gradient="from-emerald-500 to-teal-600" />
        <StatCard title="মোট খরচ" value={`৳ ${fmt(stats.spending_total)}`} gradient="from-amber-500 to-orange-600" />
      </div>

      <section className="mt-8 rounded-2xl bg-white dark:bg-slate-900 p-5 shadow border border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold">আপনার API Key</h2>
        <p className="text-sm text-slate-500 mt-1">
          {key.has_key ? `Active। মেয়াদ: ${key.expires_at}` : 'এখনো কোনো key নেই।'}
        </p>

        {newKey && (
          <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-300 p-4">
            <p className="text-sm font-semibold">এই key শুধু একবার দেখানো হবে। এখনই কপি করে রাখুন:</p>
            <code className="block break-all mt-2 text-sm">{newKey}</code>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button onClick={generate} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2">
            {key.has_key ? 'নতুন key বানান' : 'Key বানান'}
          </button>
          {key.has_key && (
            <button onClick={revoke} className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2">
              বাতিল করুন
            </button>
          )}
        </div>
      </section>

      <h2 className="text-xl font-bold mt-10 mb-4">আপনার API সমূহ</h2>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {apis.map((api) => (
          <div key={api.id} className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow border border-slate-200 dark:border-slate-800">
            <div className="font-semibold">{api.name}</div>
            <div className="text-xs text-slate-500 mt-2 break-all">{api.endpoint}</div>
            <div className="mt-3 font-bold text-indigo-600 dark:text-indigo-400">৳ {fmt(api.price)} / request</div>
          </div>
        ))}
        {apis.length === 0 && <p className="text-slate-500">এখনো কোনো API নেই।</p>}
      </div>

      <h2 className="text-xl font-bold mt-10 mb-4">সাম্প্রতিক Request</h2>
      <div className="overflow-x-auto rounded-2xl bg-white dark:bg-slate-900 shadow border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800 text-left">
            <tr>
              <th className="p-3">সময়</th>
              <th className="p-3">API</th>
              <th className="p-3">অবস্থা</th>
              <th className="p-3">চার্জ</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.id} className="border-t border-slate-200 dark:border-slate-800">
                <td className="p-3">{h.time}</td>
                <td className="p-3">{h.api}</td>
                <td className="p-3">{h.status === 'success' ? '✅ সফল' : '❌ ব্যর্থ'}</td>
                <td className="p-3">৳ {fmt(h.charged)}</td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr><td className="p-3 text-slate-500" colSpan={4}>এখনো কোনো request নেই।</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
