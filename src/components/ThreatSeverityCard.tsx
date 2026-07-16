import { AlertOctagon, Terminal, ShieldAlert, Radio } from 'lucide-react';

export default function ThreatSeverityCard() {
  const severities = [
    { title: 'Critical Anomalies', value: '3', color: 'text-red-500 border-red-500/20 bg-red-500/5', icon: AlertOctagon, details: 'Immediate mitigation needed' },
    { title: 'High Danger Vectors', value: '8', color: 'text-orange-500 border-orange-500/20 bg-orange-500/5', icon: ShieldAlert, details: 'Active investigation ongoing' },
    { title: 'Medium Warning States', value: '14', color: 'text-amber-500 border-amber-500/20 bg-amber-500/5', icon: Radio, details: 'Dynamic heuristics tracking' },
    { title: 'Low Audit Events', value: '184', color: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5', icon: Terminal, details: 'Logged inside DB collections' },
  ];

  return (
    <div className="bg-[#102B46] border border-slate-800 rounded-xl p-5 space-y-4" id="threat-severity-breakdown-card">
      <div>
        <h3 className="text-sm font-bold text-slate-200 tracking-wider">Telemetry Severity Spectrum</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">Classification counts across the security alerts threshold database.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {severities.map((sev, idx) => {
          const Icon = sev.icon;
          return (
            <div key={idx} className={`p-4 rounded-xl border flex flex-col justify-between ${sev.color}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold leading-none">{sev.title}</span>
                <Icon size={14} className="opacity-80" />
              </div>
              <div className="mt-2">
                <span className="text-2xl font-mono font-extrabold">{sev.value}</span>
                <span className="text-[9px] block opacity-60 font-medium leading-normal mt-0.5">{sev.details}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
