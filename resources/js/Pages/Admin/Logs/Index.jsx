import Layout, { fmt } from '../../../Layout';

export default function LogsIndex({ logs }) {
  return (
    <Layout>
      <h1 className="text-2xl font-extrabold mb-6">API Logs (সর্বশেষ ১০০)</h1>

      <div className="overflow-x-auto rounded-2xl bg-white dark:bg-slate-900 shadow border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800 text-left">
            <tr>
              <th className="p-3">সময়</th>
              <th className="p-3">ইউজার</th>
              <th className="p-3">API</th>
              <th className="p-3">অবস্থা</th>
              <th className="p-3">চার্জ</th>
              <th className="p-3">Provider খরচ</th>
              <th className="p-3">ms</th>
              <th className="p-3">Error</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-t border-slate-200 dark:border-slate-800">
                <td className="p-3 whitespace-nowrap">{l.time}</td>
                <td className="p-3">{l.user}</td>
                <td className="p-3">{l.api}</td>
                <td className="p-3">{l.status === 'success' ? '✅' : '❌'}</td>
                <td className="p-3">৳ {fmt(l.charged)}</td>
                <td className="p-3">৳ {fmt(l.provider_cost)}</td>
                <td className="p-3">{l.response_ms}</td>
                <td className="p-3 text-rose-600 max-w-xs truncate">{l.error}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td className="p-3 text-slate-500" colSpan={8}>এখনো কোনো log নেই।</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
