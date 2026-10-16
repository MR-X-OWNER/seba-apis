import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

const NAV_GROUPS = {
  admin: [
    {
      label: 'Workspace',
      items: [
        { href: '/admin', bn: 'ওভারভিউ', en: 'Overview' },
        { href: '/admin/apis', bn: 'API তালিকা', en: 'API catalog' },
        { href: '/admin/users', bn: 'ইউজার', en: 'Users' },
      ],
    },
    {
      label: 'Operations',
      items: [{ href: '/admin/logs', bn: 'API লগ', en: 'API logs' }],
    },
  ],
  user: [
    {
      label: 'Workspace',
      items: [{ href: '/dashboard', bn: 'ড্যাশবোর্ড', en: 'Dashboard' }],
    },
  ],
};

const TEXT = {
  bn: { logout: 'লগআউট', admin: 'অ্যাডমিন প্যানেল', user: 'ইউজার প্যানেল' },
  en: { logout: 'Logout', admin: 'Admin Panel', user: 'User Panel' },
};

export const fmt = (n) => Number(n || 0).toLocaleString('bn-BD', { maximumFractionDigits: 2 });

export function StatCard({ title, value, hint }) {
  return (
    <div className="rounded-2xl border border-[#e9eaf1] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eeecff] text-[#6758e8] font-bold text-sm">
          ●
        </div>
        {hint && <span className="text-[11px] font-bold text-[#35a077]">{hint}</span>}
      </div>
      <p className="mt-5 text-xs text-[#9091a3]">{title}</p>
      <p className="mt-1 text-[23px] font-bold tracking-tight text-[#16172a]">{value}</p>
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[.12em] text-[#6758e8]">{eyebrow}</p>}
        <h2 className="mt-1 text-[27px] font-bold tracking-[-.04em] text-[#16172a]">{title}</h2>
        {description && <p className="mt-1 text-[13px] text-[#85869a]">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export default function Layout({ children }) {
  const page = usePage();
  const isAdmin = page.props.auth?.user?.role === 'admin';
  const currentPath = (page.url || '').split('?')[0];
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'bn');
  const t = TEXT[lang];
  const groups = NAV_GROUPS[isAdmin ? 'admin' : 'user'];
  const userName = page.props.auth?.user?.name || '';

  const changeLang = () => {
    const next = lang === 'bn' ? 'en' : 'bn';
    localStorage.setItem('lang', next);
    setLang(next);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-[#16172a]">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col border-r border-[#e8e9f1] bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[82px] items-center justify-between border-b border-[#f0f0f5] px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6758e8] text-white font-bold shadow-lg">S</div>
            <div>
              <p className="text-[15px] font-bold">Seba<span className="text-[#6758e8]">API</span></p>
              <p className="text-[10px] font-medium uppercase tracking-[.18em] text-[#a0a1b5]">Control center</p>
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1 text-[#a0a1b5] lg:hidden" aria-label="Close menu">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          {groups.map((group) => (
            <div key={group.label} className="mb-7">
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-[#a6a7b9]">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = currentPath === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
                        active ? 'bg-[#f0efff] text-[#6758e8]' : 'text-[#71738a] hover:bg-[#f7f7fb]'
                      }`}
                    >
                      {item[lang]}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[#f0f0f5] p-4">
          <div className="flex items-center gap-3 rounded-xl bg-[#fafaff] p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dedbff] text-xs font-bold text-[#6254dc]">
              {userName.slice(0, 2).toUpperCase() || 'SA'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold">{userName}</p>
              <p className="text-[11px] text-[#999bad]">{isAdmin ? 'Super admin' : 'User'}</p>
            </div>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <button className="fixed inset-0 z-30 bg-[#16172a]/20 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close overlay" />
      )}

      <main className="lg:ml-[250px]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-[#e8e9f1] bg-white/90 px-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="rounded-lg border border-[#e7e8f0] px-2.5 py-1.5 text-[#71738a] lg:hidden" aria-label="Open menu">☰</button>
            <p className="text-sm font-bold text-[#16172a]">{isAdmin ? t.admin : t.user}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={changeLang} className="rounded-lg border border-[#e4e5ee] px-3 py-1.5 text-xs font-semibold text-[#636579]">
              {lang === 'bn' ? 'EN' : 'বাংলা'}
            </button>
            <button onClick={() => router.post('/logout')} className="rounded-lg bg-[#6758e8] px-3 py-1.5 text-xs font-semibold text-white shadow">
              {t.logout}
            </button>
          </div>
        </header>

        {/* মোবাইলে sidebar লুকানো, তাই উপরে horizontal menu */}
        <nav className="flex gap-2 overflow-x-auto border-b border-[#e8e9f1] bg-white px-4 py-3 lg:hidden">
          {groups.flatMap((g) => g.items).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                currentPath === item.href ? 'bg-[#6758e8] text-white' : 'bg-[#f3f3f9] text-[#636579]'
              }`}
            >
              {item[lang]}
            </Link>
          ))}
        </nav>

        <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-8 lg:px-10">{children}</div>
      </main>
    </div>
  );
}
