import DeviceAnalytics from '../components/DeviceAnalytics';
import LoginAnalytics from '../components/LoginAnalytics';
import LineChart from '../charts/LineChart';
import BarChart from '../charts/BarChart';

export default function CyberTelemetry() {
  return (
    <div className="space-y-6" id="cyber-telemetry-page">
      <div>
        <h2 className="text-lg font-bold text-slate-100 tracking-wider">CYBERSECURITY TELEMETRY ANALYTICS</h2>
        <p className="text-xs text-slate-400 mt-0.5">Continuous evaluation of user agents, logins, and device session bindings.</p>
      </div>

      {/* Analytics Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#102B46] border border-slate-800 rounded-xl p-5">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest block mb-4">Total System Event Ingestion Rate</span>
          <LineChart />
        </div>
        <div className="bg-[#102B46] border border-slate-800 rounded-xl p-5">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest block mb-4">Login Events Matrix by Node Group</span>
          <BarChart />
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeviceAnalytics />
        <LoginAnalytics />
      </div>
    </div>
  );
}
