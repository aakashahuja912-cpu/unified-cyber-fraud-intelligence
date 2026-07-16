import { useState, useEffect } from 'react';
import { Terminal, Shield, User, Key, RefreshCw } from 'lucide-react';
import { threatAPI } from '../services/threatAPI';
import { AuditLog, LoginActivity } from '../db-store';

export default function ActivityLogs() {
  const [activeTab, setActiveTab] = useState<'audit' | 'login'>('audit');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loginActivities, setLoginActivities] = useState<LoginActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const data = await threatAPI.getLogs();
      if (data) {
        setAuditLogs(data.auditLogs || []);
        setLoginActivities(data.loginActivities || []);
      }
    } catch (e) {
      console.error('Failed to pull system logs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#102B46] border border-slate-800 rounded-xl p-5 space-y-4" id="activity-logs-component">
      {/* Tab Selectors */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-slate-800/80">
        <div className="flex bg-slate-950/40 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'audit' ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/15' : 'text-slate-400'
            }`}
          >
            <Terminal size={12} />
            <span>Operational Audits</span>
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'login' ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/15' : 'text-slate-400'
            }`}
          >
            <Key size={12} />
            <span>Cyber Login Telemetry</span>
          </button>
        </div>
        
        <button
          onClick={fetchLogs}
          className="text-slate-500 hover:text-cyan-400 p-1 hover:bg-slate-800/30 rounded-lg transition-colors cursor-pointer"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading && auditLogs.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-500 uppercase tracking-widest animate-pulse font-bold">
          Buffering logs...
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[350px] scrollbar-thin">
          {activeTab === 'audit' ? (
            <div className="space-y-2.5">
              {auditLogs.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No operation records found</p>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-950/25 rounded-lg border border-slate-800/60 flex items-start gap-3 text-xs">
                    <div className="p-1.5 bg-slate-900 border border-slate-800/80 text-slate-400 rounded-md mt-0.5">
                      <Shield size={12} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-center flex-wrap gap-2 text-[10px] text-slate-500 font-semibold font-mono">
                        <span>ACTOR: <span className="text-slate-300 font-bold">{log.actor} ({log.role})</span></span>
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-300 font-bold">{log.action}</p>
                      <p className="text-slate-400 leading-relaxed font-semibold">{log.details}</p>
                      <span className="text-[10px] font-mono text-slate-500 block">IP ADDR: {log.ipAddress}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              {loginActivities.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No login attempts logged</p>
              ) : (
                loginActivities.map((la) => (
                  <div key={la.id} className={`p-3 rounded-lg border flex items-start gap-3 text-xs ${
                    la.status === 'Failed' ? 'bg-red-500/5 border-red-500/10' : 'bg-slate-950/25 border-slate-800/60'
                  }`}>
                    <div className={`p-1.5 border rounded-md mt-0.5 ${
                      la.status === 'Failed' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-slate-900 border-slate-850 text-slate-400'
                    }`}>
                      <User size={12} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-center flex-wrap gap-2 text-[10px] text-slate-500 font-mono font-semibold">
                        <span>ID: <span className="text-slate-300 font-bold">{la.username}</span></span>
                        <span>{new Date(la.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="font-bold flex items-center gap-2">
                        <span>Login Attempt:</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-extrabold tracking-wide uppercase ${
                          la.status === 'Failed' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {la.status}
                        </span>
                      </p>
                      {la.failureReason && (
                        <p className="text-red-400 font-semibold">{la.failureReason}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500 font-semibold font-mono">
                        <span>DEVICE: {la.device} ({la.browser})</span>
                        <span>•</span>
                        <span>GEO: {la.location} (IP: {la.ipAddress})</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
