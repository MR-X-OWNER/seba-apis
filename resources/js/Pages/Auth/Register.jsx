import { useForm, Link } from '@inertiajs/react';

export default function Register() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post('/register');
  };

  const input = 'w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-600 via-violet-700 to-slate-900">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-white/95 dark:bg-slate-900 p-8 shadow-2xl space-y-4">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400">Seba API</h1>
          <p className="text-slate-500 mt-1">নতুন account খুলুন</p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">নাম</label>
          <input className={input} value={data.name} onChange={(e) => setData('name', e.target.value)} required />
          {errors.name && <p className="text-rose-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input type="email" className={input} value={data.email} onChange={(e) => setData('email', e.target.value)} required />
          {errors.email && <p className="text-rose-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Password (কমপক্ষে ৮ অক্ষর)</label>
          <input type="password" className={input} value={data.password} onChange={(e) => setData('password', e.target.value)} required />
          {errors.password && <p className="text-rose-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Password আবার লিখুন</label>
          <input type="password" className={input} value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} required />
        </div>

        <button
          type="submit"
          disabled={processing}
          className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3"
        >
          Register
        </button>

        <p className="text-center text-sm text-slate-500">
          আগে থেকেই account আছে?{' '}
          <Link href="/login" className="text-indigo-600 font-semibold">লগইন</Link>
        </p>
      </form>
    </div>
  );
}
