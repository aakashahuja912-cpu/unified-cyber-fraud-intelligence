import { useState, useEffect } from 'react';
import { ShieldCheck, AlertOctagon, RefreshCw, CheckCircle } from 'lucide-react';
import { threatAPI } from '../services/threatAPI';
import { ThreatAlert } from '../db-store';

export default function SecurityAlerts() {
  const [alerts, setAlerts] = useState<ThreatAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const data = await threatAPI.getThreatAlerts();
      setAlerts(data);
    } catch (e) {
      console.error('Failed to load alert sequences:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleResolve = async (alertId: string) => {
    try {
      // Optimistic update
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'Resolved' } : a));
      await threatAPI.resolveThreatAlert(alertId);
      fetchAlerts();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading && alerts.length === 0) {
    return (
      <div className="bg-[#102B46] border border-slate-800 rounded-xl p-6 h-60 flex items-center justify-center">
        <span className="text-xs text-slate-400 font-bold tracking-wider animate-pulse uppercase">Decrypting incident logs...</span>
      </div>
    );
  }

  return (
    <div className="bg-[#102B46] border border-slate-800 rounded-xl p-5 space-y-4" id="security-alerts-component">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold text-slate-200 tracking-wider">Active Correlation Alerts</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">High-velocity telemetry alerts flagged by multi-layered model classifiers.</p>
        </div>
        <button
          onClick={fetchAlerts}
          className="text-slate-400 hover:text-cyan-400 p-1.5 hover:bg-slate-800/30 rounded-lg transition-colors cursor-pointer"
          title="Force telemetry refresh"
        >
          <RefreshCw size={13} />
        </button>
      </div>

      {/* Alerts feed list */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
        {alerts.length === 0 ? (
          <p className="text-xs text-slate-500 py-10 text-center font-medium">All systems normal. No alerts triggered.</p>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-all duration-200 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center ${
                alert.status === 'Resolved' 
                  ? 'bg-slate-950/15 border-slate-800 text-slate-500' 
                  : alert.severity === 'Critical'
                    ? 'bg-red-500/5 border-red-500/20 text-slate-200'
                    : alert.severity === 'High'
                      ? 'bg-orange-500/5 border-orange-500/15 text-slate-200'
                      : 'bg-cyan-500/5 border-cyan-500/15 text-slate-200'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className={`p-2.5 rounded-lg border flex-shrink-0 mt-0.5 ${
                  alert.status === 'Resolved'
                    ? 'bg-slate-900 border-slate-800 text-slate-500'
                    : alert.severity === 'Critical'
                      ? 'bg-red-500/10 border-red-500/25 text-red-400'
                      : alert.severity === 'High'
                        ? 'bg-orange-500/10 border-orange-500/25 text-orange-400'
                        : 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400'
                }`}>
                  <AlertOctagon size={16} />
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className={`text-xs font-bold ${alert.status === 'Resolved' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                      {alert.type}
                    </span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                      alert.severity === 'Critical' ? 'bg-red-500/10 text-red-400' :
                      alert.severity === 'High' ? 'bg-orange-500/10 text-orange-400' :
                      'bg-cyan-500/10 text-cyan-400'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono font-semibold">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className={`text-xs ${alert.status === 'Resolved' ? 'text-slate-500' : 'text-slate-350'} leading-relaxed font-medium`}>
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
                    <span>Source vector: <span className="font-mono text-slate-400">{alert.source}</span></span>
                    {alert.assignedTo && (
                      <>
                        <span>•</span>
                        <span>Assigned to: <span className="text-cyan-400">{alert.assignedTo}</span></span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex-shrink-0">
                {alert.status !== 'Resolved' ? (
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 text-[10px] font-bold py-1.5 px-3.5 rounded-lg transition-all duration-200 cursor-pointer"
                  >
                    <CheckCircle size={11} />
                    <span>Acknowledge & Clear</span>
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase bg-slate-950/20 border border-slate-850 px-3 py-1 rounded-lg">
                    <ShieldCheck size={11} className="text-slate-500" />
                    <span>Closed Logs</span>
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
