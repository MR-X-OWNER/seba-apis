import { Link, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const NAV = {
  admin: [
    { href: '/admin', bn: 'ড্যাশবোর্ড', en: 'Dashboard' },
    { href: '/admin/apis', bn: 'API সমূহ', en: 'APIs' },
    { href: '/admin/users', bn: 'ইউজার', en: 'Users' },
    { href: '/admin/logs', bn: 'লগ', en: 'Logs' },
  ],
  user: [{ href: '/dashboard', bn: 'ড্যাশবোর্ড', en: 'Dashboard' }],
};

const TEXT = {
  bn: { logout: 'লগআউট', admin: 'অ্যাডমিন প্যানেল', user: 'ইউজার প্যানেল' },
  en: { logout: 'Logout', admin: 'Admin Panel', user: 'User Panel' },
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
  const page = usePage();
  const isAdmin = page.props.auth?.user?.role === 'admin';
  const currentPath = (page.url || '').split('?')[0];

  const [dark, setDark] = useState(() => localStorage.getItem('theme') !== 'light');
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'bn');
  const t = TEXT[lang];
  const links = NAV[isAdmin ? 'admin' : 'user'];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  return (
    <div className="min-h-screen flex text-slate-800 dark:text-slate-100">
      <aside className="hidden md:flex w-64 flex-col bg-gradient-to-b from-indigo-700 to-violet-900 text-white p-5">
        <div className="text-2xl font-extrabold mb-8">Seba API</div>
        <nav className="space-y-2">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-xl px-4 py-2 ${currentPath === item.href ? 'bg-white/25 font-bold' : 'bg-white/10 hover:bg-white/20'}`}
            >
              {item[lang]}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between gap-3 px-4 md:px-8 py-4">
            <div className="font-bold md:font-semibold">
              <span className="md:hidden">Seba API</span>
              <span className="hidden md:inline">{isAdmin ? t.admin : t.user}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')} className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-sm">
                {lang === 'bn' ? 'EN' : 'বাংলা'}
              </button>
              <button onClick={() => setDark(!dark)} className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-sm">
                {dark ? '☀️' : '🌙'}
              </button>
              <button onClick={() => router.post('/logout')} className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm">
                {t.logout}
              </button>
            </div>
          </div>
          {/* মোবাইলে sidebar নেই, তাই উপরে horizontal menu */}
          <nav className="md:hidden flex gap-2 overflow-x-auto px-4 pb-3">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm ${currentPath === item.href ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}
              >
                {item[lang]}
              </Link>
            ))}
          </nav>
        </header>

        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
