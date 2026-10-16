import { Link, router, usePage } from '@inertiajs/react';
import Layout, { PageHeader, fmt } from '../../../Layout';

export default function ApisIndex({ apis }) {
  const { flash } = usePage().props;

  const remove = (api) => {
    if (confirm(`"${api.name}" মুছে ফেলবেন?`)) router.delete(`/admin/apis/${api.id}`);
  };

  return (
    <Layout>
      <PageHeader
        eyebrow="API management"
        title="API তালিকা"
        description="প্রতিটি provider API এখান থেকে যোগ, সম্পাদনা ও নিয়ন্ত্রণ করুন।"
        action={
          <Link href="/admin/apis/create" className="rounded-xl bg-[#6758e8] px-4 py-2.5 text-xs font-semibold text-white shadow-lg">
            + নতুন API
          </Link>
        }
      />

      {flash?.success && (
        <div className="mb-5 rounded-xl bg-[#e8f8f1] px-4 py-3 text-sm font-semibold text-[#35a077]">{flash.success}</div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-[#e9eaf1] bg-white">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b border-[#f1f1f5] text-[10px] uppercase tracking-[.08em] text-[#a0a1b1]">
              <th className="px-6 py-4 font-bold">API নাম</th>
              <th className="px-6 py-4 font-bold">Slug</th>
              <th className="px-6 py-4 font-bold">Provider খরচ</th>
              <th className="px-6 py-4 font-bold">User Price</th>
              <th className="px-6 py-4 font-bold">লাভ</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold"></th>
            </tr>
          </thead>
          <tbody>
            {apis.map((api) => (
              <tr key={api.id} className="border-b border-[#f5f5f7] last:border-0">
                <td className="px-6 py-4 text-[13px] font-bold">{api.name}</td>
                <td className="px-6 py-4 text-[12px] text-[#696b80]">{api.slug}</td>
                <td className="px-6 py-4 text-[12px] text-[#696b80]">৳ {fmt(api.provider_cost)}</td>
                <td className="px-6 py-4 text-[12px] text-[#696b80]">৳ {fmt(api.user_price)}</td>
                <td className="px-6 py-4 text-[12px] font-bold text-[#35a077]">৳ {fmt(api.user_price - api.provider_cost)}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => router.post(`/admin/apis/${api.id}/toggle`)}
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      api.is_enabled ? 'bg-[#e8f8f1] text-[#35a077]' : 'bg-[#fff0e5] text-[#cc893b]'
                    }`}
                  >
                    {api.is_enabled ? 'Live' : 'Paused'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-3">
                  <Link href={`/admin/apis/${api.id}/edit`} className="text-[12px] font-bold text-[#6758e8]">Edit</Link>
                  <button onClick={() => remove(api)} className="text-[12px] font-bold text-rose-500">Delete</button>
                </td>
              </tr>
            ))}
            {apis.length === 0 && (
              <tr>
                <td className="px-6 py-6 text-sm text-[#9091a3]" colSpan={7}>এখনো কোনো API যোগ করা হয়নি।</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
        }
                      
