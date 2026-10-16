import { Link } from '@inertiajs/react';
import Layout, { StatCard, PageHeader, fmt } from '../../Layout';

export default function AdminDashboard({ stats }) {
  const success = stats.success_today;
  const failed = stats.failed_today;
  const total = success + failed;
  const rate = total > 0 ? Math.round((success / total) * 1000) / 10 : 0;
  const deg = (rate / 100) * 360;

  return (
    <Layout>
      <PageHeader
        eyebrow="Live workspace"
        title="প্ল্যাটফর্ম পারফরম্যান্স"
        description="আপনার API ব্যবসার সংক্ষিপ্ত চিত্র।"
        action={
          <Link href="/admin/apis/create" className="rounded-xl bg-[#6758e8] px-4 py-2.5 text-xs font-semibold text-white shadow-lg">
            + নতুন API
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="মোট ইউজার" value={fmt(stats.total_users)} />
        <StatCard title="Active ইউজার" value={fmt(stats.active_users)} />
        <StatCard title="মোট API" value={fmt(stats.total_apis)} />
        <StatCard title="আজকের Hits" value={fmt(stats.hits_today)} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <section className="rounded-2xl border border-[#e9eaf1] bg-white p-6">
          <h3 className="text-[15px] font-bold">আজকের আর্থিক হিসাব</h3>
          <p className="mt-1 text-[11px] text-[#999aad]">শুধু সফল request থেকে</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-[#f7f8fc] p-4">
              <p className="text-xs text-[#9091a3]">Revenue</p>
              <p className="mt-1 text-2xl font-bold">৳ {fmt(stats.revenue_today)}</p>
            </div>
            <div className="rounded-xl bg-[#e8f8f1] p-4">
              <p className="text-xs text-[#35a077]">Profit (লাভ)</p>
              <p className="mt-1 text-2xl font-bold text-[#35a077]">৳ {fmt(stats.profit_today)}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#e9eaf1] bg-white p-6">
          <h3 className="text-[15px] font-bold">Request স্বাস্থ্য</h3>
          <p className="mt-1 text-[11px] text-[#999aad]">আজকের সফলতার হার</p>
          <div className="my-6 flex items-center justify-center">
            <div
              className="flex h-36 w-36 items-center justify-center rounded-full"
              style={{
                background: total === 0
                  ? '#e5e7eb'
                  : `conic-gradient(#52b58f 0 ${deg}deg, #f0a152 ${deg}deg 360deg)`,
              }}
            >
              <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
                <span className="text-2xl font-bold">{rate}%</span>
                <span className="text-[10px] text-[#9899aa]">সফল</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between border-t border-[#f0f0f5] pt-4 text-[11px] text-[#73758a]">
            <span>সফল <b className="text-[#35a077]">{fmt(success)}</b></span>
            <span>ব্যর্থ <b className="text-[#d79640]">{fmt(failed)}</b></span>
          </div>
        </section>
      </div>
    </Layout>
  );
        }
          
