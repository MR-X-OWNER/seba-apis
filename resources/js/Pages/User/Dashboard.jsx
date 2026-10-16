import Layout, { StatCard, fmt } from '../../Layout';

export default function UserDashboard({ stats, apis }) {
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

      <h2 className="text-xl font-bold mt-10 mb-4">আপনার API সমূহ</h2>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {apis.map((api) => (
          <div key={api.id} className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow border border-slate-200 dark:border-slate-800">
            <div className="font-semibold">{api.name}</div>
            <div className="text-sm text-slate-500 mt-1 break-all">/api/v1/call/{api.slug}</div>
            <div className="mt-4 font-bold text-indigo-600 dark:text-indigo-400">৳ {fmt(api.user_price)} / request</div>
          </div>
        ))}
        {apis.length === 0 && <p className="text-slate-500">এখনো কোনো API যোগ করা হয়নি।</p>}
      </div>
    </Layout>
  );
}
