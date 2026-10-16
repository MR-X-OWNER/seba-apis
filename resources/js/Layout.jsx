import { Link, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const TEXT = {
  bn: { dashboard: 'ড্যাশবোর্ড', logout: 'লগআউট', admin: 'অ্যাডমিন প্যানেল', user: 'ইউজার প্যানেল' },
  en: { dashboard: 'Dashboard', logout: 'Logout', admin: 'Admin Panel', user: 'User Panel' },
};

export const fmt = (n) => Number(n || 0).toLocaleString('bn-BD', { maximumFractionDigits: 2 });

export function StatCard({ title, value, gradient }) {
  return (
    <div className={`rounded-2xl p-5 shadow-lg text-white bg-gradient-to-br ${gradient || 'from-slate-700 to-slate-900'}`}>
      <p className="text-sm text-white/80">{title}</p>
      <p className="text-2xl md:text-3xl font-extrabold mt-2">{value}</p>
    </div>
  );
}

export default function Layout({ children }) {
  const { auth } = usePage().props;
  const isAdmin = auth.user?.role === 'admin';

  const [dark, setDark] = useState(() => localStorage.getItem('theme') !== 'light');
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'bn');
  const t = TEXT[lang];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const dashboardHref = isAdmin ? '/admin' : '/dashboard';

  return (
    <div className="min-h-screen flex text-slate-800 dark:text-slate-100">
      <aside className="hidden md:flex w-64 flex-col bg-gradient-to-b from-indigo-700 to-violet-900 text-white p-5">
        <div className="text-2xl font-extrabold mb-8">Seba API</div>
        <nav className="space-y-2">
          <Link href={dashboardHref} className="block rounded-xl px-4 py-2 bg-white/10 hover:bg-white/20">
            {t.dashboard}
          </Link>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 px-4 md:px-8 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
          <div className="font-bold md:font-semibold">
            <span className="md:hidden">Seba API</span>
            <span className="hidden md:inline">{isAdmin ? t.admin : t.user}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-sm"
            >
              {lang === 'bn' ? 'EN' : 'বাংলা'}
            </button>
            <button
              onClick={() => setDark(!dark)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-sm"
            >
              {dark ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => router.post('/logout')}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm"
            >
              {t.logout}
            </button>
          </div>
        </header>

        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
