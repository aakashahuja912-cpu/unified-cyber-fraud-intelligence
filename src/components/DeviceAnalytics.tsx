import { Laptop, Shield, AlertTriangle } from 'lucide-react';

export default function DeviceAnalytics() {
  const devices = [
    { name: 'Macbook Pro 16" (Safari v17)', os: 'macOS Sonoma', count: 145, trustIndex: 98, isTrusted: true },
    { name: 'Dell Latitude 5420 (Chrome v122)', os: 'Windows 11 Enterprise', count: 320, trustIndex: 94, isTrusted: true },
    { name: 'Unknown Android (Firefox v119)', os: 'Android OS 14', count: 12, trustIndex: 45, isTrusted: false },
    { name: 'Generic Linux Client (Headless Chrome)', os: 'Ubuntu Desktop v22', count: 4, trustIndex: 12, isTrusted: false },
  ];

  return (
    <div className="bg-[#102B46] border border-slate-800 rounded-xl p-5 space-y-4" id="device-analytics-component">
      <div>
        <h3 className="text-sm font-bold text-slate-200 tracking-wider">Fingerprint Device Analytics</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">Authentication profiles & browser environment trust evaluations.</p>
      </div>

      <div className="space-y-3">
        {devices.map((dev, idx) => (
          <div key={idx} className="p-3 bg-slate-950/25 border border-slate-800/80 rounded-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg border ${
                dev.isTrusted ? 'bg-cyan-500/10 border-cyan-500/10 text-cyan-400' : 'bg-red-500/10 border-red-500/10 text-red-400'
              }`}>
                <Laptop size={14} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200 block">{dev.name}</span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">{dev.os}</span>
              </div>
            </div>

            <div className="text-right flex items-center gap-4">
              <div>
                <span className="text-[10px] text-slate-500 block font-semibold">Active Sessions</span>
                <span className="text-xs font-mono font-bold text-slate-200">{dev.count}</span>
              </div>
              <div className="min-w-[80px]">
                <span className="text-[10px] text-slate-500 block font-semibold">Trust Rating</span>
                <span className={`text-xs font-mono font-bold flex items-center justify-end gap-1 ${
                  dev.trustIndex > 80 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {dev.isTrusted ? <Shield size={11} /> : <AlertTriangle size={11} />}
                  <span>{dev.trustIndex}%</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
