import { useForm, Link } from '@inertiajs/react';
import Layout, { fmt } from '../../../Layout';

const input = 'w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500';

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">{label}</label>
      {children}
      {error && <p className="text-rose-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default function ApiForm({ api }) {
  const { data, setData, post, put, processing, errors } = useForm({
    name: api?.name ?? '',
    slug: api?.slug ?? '',
    method: api?.method ?? 'GET',
    url: api?.url ?? '',
    headers: api?.headers ?? '',
    params: api?.params ?? '',
    response_path: api?.response_path ?? '',
    success_path: api?.success_path ?? '',
    success_value: api?.success_value ?? '',
    provider_cost: api?.provider_cost ?? 0,
    user_price: api?.user_price ?? 0,
    rate_limit_per_min: api?.rate_limit_per_min ?? '',
    is_enabled: api?.is_enabled ?? true,
  });

  const submit = (e) => {
    e.preventDefault();
    if (api) {
      put(`/admin/apis/${api.id}`);
    } else {
      post('/admin/apis');
    }
  };

  const profit = Number(data.user_price || 0) - Number(data.provider_cost || 0);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">{api ? 'API সম্পাদনা' : 'নতুন API'}</h1>
        <Link href="/admin/apis" className="text-indigo-600 font-semibold">← ফিরে যান</Link>
      </div>

      <form onSubmit={submit} className="max-w-3xl grid gap-5 md:grid-cols-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow">
        <Field label="API নাম" error={errors.name}>
          <input className={input} value={data.name} onChange={(e) => setData('name', e.target.value)} required />
        </Field>

        <Field label="Slug (URL-এর অংশ, যেমন weather)" error={errors.slug}>
          <input className={input} value={data.slug} onChange={(e) => setData('slug', e.target.value)} required />
        </Field>

        <Field label="Method" error={errors.method}>
          <select className={input} value={data.method} onChange={(e) => setData('method', e.target.value)}>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
        </Field>

        <Field label="Response path (ঐচ্ছিক, যেমন data.price)" error={errors.response_path}>
          <input className={input} value={data.response_path} onChange={(e) => setData('response_path', e.target.value)} />
        </Field>

        <Field label="Success path (ঐচ্ছিক, যেমন success বা Code)" error={errors.success_path}>
          <input className={input} value={data.success_path} onChange={(e) => setData('success_path', e.target.value)} />
        </Field>

        <Field label="Success value (যেমন true বা 200 বা SUCCESS)" error={errors.success_value}>
          <input className={input} value={data.success_value} onChange={(e) => setData('success_value', e.target.value)} />
        </Field>

        <div className="md:col-span-2">
          <Field label="Provider URL" error={errors.url}>
            <input className={input} value={data.url} onChange={(e) => setData('url', e.target.value)} required />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label='Headers (JSON, যেমন {"x-api-key":"..."})' error={errors.headers}>
            <textarea rows={3} className={input} value={data.headers} onChange={(e) => setData('headers', e.target.value)} />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Fixed Params (JSON, ঐচ্ছিক)" error={errors.params}>
            <textarea rows={3} className={input} value={data.params} onChange={(e) => setData('params', e.target.value)} />
          </Field>
        </div>

        <Field label="Provider খরচ (৳)" error={errors.provider_cost}>
          <input type="number" step="0.0001" className={input} value={data.provider_cost} onChange={(e) => setData('provider_cost', e.target.value)} required />
        </Field>

        <Field label="User Price (৳)" error={errors.user_price}>
          <input type="number" step="0.0001" className={input} value={data.user_price} onChange={(e) => setData('user_price', e.target.value)} required />
        </Field>

        <Field label="Rate limit / মিনিট (খালি = সীমাহীন)" error={errors.rate_limit_per_min}>
          <input type="number" min="1" className={input} value={data.rate_limit_per_min} onChange={(e) => setData('rate_limit_per_min', e.target.value)} />
        </Field>

        <div className="flex flex-col justify-end">
          <p className="text-sm text-slate-500">প্রতি request লাভ (শুধু আপনি দেখবেন)</p>
          <p className="text-xl font-extrabold text-emerald-600">৳ {fmt(profit)}</p>
        </div>

        <label className="flex items-center gap-2 md:col-span-2">
          <input type="checkbox" checked={data.is_enabled} onChange={(e) => setData('is_enabled', e.target.checked)} />
          API চালু থাকবে
        </label>

        <div className="md:col-span-2">
          <button type="submit" disabled={processing} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold px-6 py-3">
            {processing ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
          </button>
        </div>
      </form>
    </Layout>
  );
}
