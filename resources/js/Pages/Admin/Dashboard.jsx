import Layout, { StatCard, fmt } from '../../Layout';

export default function AdminDashboard({ stats }) {
  return (
    <Layout>
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6">অ্যাডমিন ড্যাশবোর্ড</h1>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="মোট ইউজার" value={fmt(stats.total_users)} gradient="from-indigo-500 to-violet-600" />
        <StatCard title="Active ইউজার" value={fmt(stats.active_users)} gradient="from-emerald-500 to-teal-600" />
        <StatCard title="মোট API" value={fmt(stats.total_apis)} gradient="from-sky-500 to-blue-700" />
        <StatCard title="আজকের Hits" value={fmt(stats.hits_today)} gradient="from-fuchsia-500 to-pink-600" />
        <StatCard title="Success" value={fmt(stats.success_today)} gradient="from-green-500 to-emerald-700" />
        <StatCard title="Failed" value={fmt(stats.failed_today)} gradient="from-rose-500 to-red-700" />
        <StatCard title="আজকের Revenue" value={`৳ ${fmt(stats.revenue_today)}`} gradient="from-amber-500 to-orange-600" />
        <StatCard title="আজকের Profit" value={`৳ ${fmt(stats.profit_today)}`} gradient="from-cyan-500 to-indigo-600" />
      </div>
    </Layout>
  );
}
