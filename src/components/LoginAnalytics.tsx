import { Key, AlertOctagon, RefreshCw } from 'lucide-react';

export default function LoginAnalytics() {
  const loginStats = [
    { title: 'Authorized Logins (24h)', value: '8,421', desc: 'Secure SSO / Active directory matches', status: 'normal' },
    { title: 'Failed Authentication Attempts', value: '42', desc: 'Pre-lockout validation triggers', status: 'warning' },
    { title: 'Brute-Force Lockouts Active', value: '3', desc: 'IP addresses under dynamic firewall block', status: 'danger' }
  ];

  return (
    <div className="bg-[#102B46] border border-slate-800 rounded-xl p-5 space-y-4" id="login-analytics-component">
      <div>
        <h3 className="text-sm font-bold text-slate-200 tracking-wider">Access Attempt Telemetry</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">Real-time mapping of authentication states and session creations.</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {loginStats.map((stat, idx) => (
          <div key={idx} className="p-3.5 bg-slate-950/25 border border-slate-800/80 rounded-lg flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 font-bold block">{stat.title}</span>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{stat.desc}</p>
            </div>

            <div className={`text-xl font-mono font-extrabold px-3 py-1.5 rounded-lg border flex items-center gap-1.5 shrink-0 ${
              stat.status === 'normal' ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10' :
              stat.status === 'warning' ? 'text-orange-400 bg-orange-500/5 border-orange-500/10' :
              'text-red-400 bg-red-500/5 border-red-500/10'
            }`}>
              {stat.status !== 'normal' && <AlertOctagon size={14} className="animate-pulse" />}
              <span>{stat.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
