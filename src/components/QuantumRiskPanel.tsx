import { useState, useEffect } from 'react';
import { Cpu, ShieldAlert, CheckCircle2, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { threatAPI } from '../services/threatAPI';
import { QuantumAlert } from '../db-store';

export default function QuantumRiskPanel() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuantumData = async () => {
    setLoading(true);
    try {
      const qData = await threatAPI.getQuantumThreats();
      setData(qData);
    } catch (e) {
      console.error('Error fetching quantum assets:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuantumData();

    // Listen to live quantum updates (we can poll every 4 seconds in the UI, or let SSE handle it)
    const interval = setInterval(fetchQuantumData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMigrate = async (alertId: string) => {
    try {
      // Optimistic state change
      if (data && data.alerts) {
        const updated = data.alerts.map((a: any) => {
          if (a.id === alertId) {
            return { ...a, status: 'Mitigating' };
          }
          return a;
        });
        setData({ ...data, alerts: updated });
      }
      await threatAPI.migrateQuantumAsset(alertId);
      // Let polling update status naturally, or refetch
      setTimeout(fetchQuantumData, 2000);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading && !data) {
    return (
      <div className="bg-[#102B46] border border-slate-800 rounded-xl p-6 h-60 flex items-center justify-center">
        <span className="text-xs text-slate-400 font-bold tracking-wider animate-pulse uppercase">Decompiling crypto vectors...</span>
      </div>
    );
  }

  const alerts: QuantumAlert[] = data?.alerts || [];
  const summary = data?.summary || { vulnerable: 0, mitigating: 0, protected: 0, totalCount: 0, migrationProgress: 0 };

  return (
    <div className="bg-[#102B46] border border-slate-800 rounded-xl p-6 space-y-6" id="quantum-risk-panel-component">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold text-slate-200 tracking-wider flex items-center gap-2">
            <Cpu size={16} className="text-cyan-400" />
            <span>Quantum Threat Vector Monitor</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Harvest Now, Decrypt Later (HNDL) cryptographic ageing assessment.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold">Migration Progress</span>
            <span className="text-xs font-mono font-extrabold text-cyan-400">{summary.migrationProgress}% Complete</span>
          </div>
          <div className="h-10 w-20 bg-slate-950/40 border border-slate-800/80 rounded-lg flex items-center justify-center">
            <div className="relative w-16 h-2 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full transition-all duration-1000" style={{ width: `${summary.migrationProgress}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Vulnerable */}
        <div className="bg-slate-950/25 border border-red-500/10 p-4 rounded-xl flex justify-between items-center">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Shor-Vulnerable Assets</span>
            <span className="text-2xl font-mono font-extrabold text-red-400 mt-1 block">{summary.vulnerable}</span>
          </div>
          <div className="p-2.5 bg-red-500/10 text-red-400 border border-red-500/10 rounded-lg">
            <ShieldAlert size={16} />
          </div>
        </div>

        {/* Migrating */}
        <div className="bg-slate-950/25 border border-orange-500/10 p-4 rounded-xl flex justify-between items-center">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Active Kyber Upgrades</span>
            <span className="text-2xl font-mono font-extrabold text-orange-400 mt-1 block">{summary.mitigating}</span>
          </div>
          <div className="p-2.5 bg-orange-500/10 text-orange-400 border border-orange-500/10 rounded-lg animate-spin" style={{ animationDuration: '3s' }}>
            <Zap size={16} />
          </div>
        </div>

        {/* Protected */}
        <div className="bg-slate-950/25 border border-emerald-500/10 p-4 rounded-xl flex justify-between items-center">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">PQC Post-Quantum Compliant</span>
            <span className="text-2xl font-mono font-extrabold text-emerald-400 mt-1 block">{summary.protected}</span>
          </div>
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 rounded-lg">
            <CheckCircle2 size={16} />
          </div>
        </div>
      </div>

      {/* Assets vulnerability table */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Asset Encryption Ageing Ledger</h4>
        <div className="space-y-2.5 max-h-[340px] overflow-y-auto scrollbar-thin">
          {alerts.map((asset) => (
            <div key={asset.id} className="p-3.5 bg-slate-950/30 rounded-xl border border-slate-800/80 hover:border-slate-700/80 transition-colors flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-200">{asset.assetName}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                    asset.riskLevel === 'Critical' ? 'bg-red-500/10 text-red-400' : 'bg-orange-500/10 text-orange-400'
                  }`}>
                    {asset.riskLevel} Risk
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 font-semibold">
                  <span>Weak standard: <span className="font-mono text-red-400">{asset.cryptoStandard}</span></span>
                  <span className="text-slate-600">|</span>
                  <span>Recommendation: <span className="font-mono text-cyan-400">{asset.recommendedMigration.split(' ')[0]}</span></span>
                </div>
              </div>

              {/* Action trigger button */}
              <div>
                {asset.status === 'Vulnerable' ? (
                  <button
                    onClick={() => handleMigrate(asset.id)}
                    className="flex items-center gap-1 bg-cyan-600/15 hover:bg-cyan-600 text-cyan-400 hover:text-white border border-cyan-500/30 text-[10px] font-bold py-1.5 px-3 rounded-lg transition-all duration-200 cursor-pointer"
                  >
                    <span>Migrate to PQC</span>
                    <ArrowRight size={10} />
                  </button>
                ) : asset.status === 'Mitigating' ? (
                  <span className="flex items-center gap-1.5 text-orange-400 font-bold text-[10px] uppercase bg-orange-500/10 border border-orange-500/10 py-1.5 px-3 rounded-lg">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-ping"></span>
                    <span>Encrypting payloads...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-400 font-bold text-[10px] uppercase bg-emerald-500/10 border border-emerald-500/10 py-1.5 px-3 rounded-lg">
                    <ShieldCheck size={11} />
                    <span>Protected</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
