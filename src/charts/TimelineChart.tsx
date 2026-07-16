import { Shield, AlertTriangle, Cpu, Terminal } from 'lucide-react';

export default function TimelineChart() {
  const events = [
    {
      time: '14:22:10 UTC',
      title: 'SWIFT Channel Intercept',
      details: 'Automatic blockade of $45,000 wire. Impossible travel detected for Sarah Jenkins.',
      severity: 'Critical',
      icon: AlertTriangle,
      color: 'text-red-500 bg-red-500/10 border-red-500/20'
    },
    {
      time: '13:58:45 UTC',
      title: 'PQC Migration Started',
      details: 'Triggered post-quantum cryptographic upgrade on asset Core Ledger Credentials DB.',
      severity: 'Info',
      icon: Cpu,
      color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20'
    },
    {
      time: '12:15:30 UTC',
      title: 'Brute Force Terminated',
      details: 'Security analyst admin blacklisted IP 203.0.113.111 after 15 failed root attempts.',
      severity: 'High',
      icon: Shield,
      color: 'text-orange-500 bg-orange-500/10 border-orange-500/20'
    },
    {
      time: '10:05:12 UTC',
      title: 'Audit Report Generated',
      details: 'Comprehensive weekly cryptographic ageing evaluation compiled as PDF.',
      severity: 'Low',
      icon: Terminal,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  return (
    <div className="flex flex-col gap-5 py-2 pl-2" id="timelinechart-container">
      {events.map((evt, idx) => {
        const Icon = evt.icon;
        return (
          <div key={idx} className="relative flex gap-4 items-start group">
            {/* Thread line connecting nodes */}
            {idx !== events.length - 1 && (
              <span className="absolute left-4 top-8 bottom-[-20px] w-[1px] bg-slate-800 group-hover:bg-cyan-500/40 transition-colors"></span>
            )}
            
            {/* Visual indicator dot */}
            <div className={`p-2 rounded-lg border flex-shrink-0 relative z-10 transition-transform duration-300 group-hover:scale-110 ${evt.color}`}>
              <Icon size={16} />
            </div>

            {/* Event Info card */}
            <div className="flex-1 min-w-0 bg-slate-900/40 p-3 rounded-lg border border-slate-800/60 hover:border-slate-700/60 transition-colors">
              <div className="flex justify-between items-center gap-2 mb-1">
                <h4 className="text-sm font-semibold text-slate-200 truncate">{evt.title}</h4>
                <span className="text-[10px] text-slate-500 whitespace-nowrap font-mono">{evt.time}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{evt.details}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  evt.severity === 'Critical' ? 'bg-red-500/10 text-red-400' :
                  evt.severity === 'High' ? 'bg-orange-500/10 text-orange-400' :
                  evt.severity === 'Info' ? 'bg-cyan-500/10 text-cyan-400' :
                  'bg-emerald-500/10 text-emerald-400'
                }`}>
                  {evt.severity}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
