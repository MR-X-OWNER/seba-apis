import { useForm, Link } from '@inertiajs/react';

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit = (e) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-600 via-violet-700 to-slate-900">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-white/95 dark:bg-slate-900 p-8 shadow-2xl space-y-5">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400">Seba API</h1>
          <p className="text-slate-500 mt-1">লগইন করুন</p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
          {errors.email && <p className="text-rose-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Password</label>
          <input
            type="password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={data.remember}
            onChange={(e) => setData('remember', e.target.checked)}
          />
          মনে রাখুন
        </label>

        <button
          type="submit"
          disabled={processing}
          className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3"
        >
          {processing ? 'অপেক্ষা করুন...' : 'লগইন'}
        </button>

        <p className="text-center text-sm text-slate-500">
          নতুন account?{' '}
          <Link href="/register" className="text-indigo-600 font-semibold">Register</Link>
        </p>
      </form>
    </div>
  );
}
