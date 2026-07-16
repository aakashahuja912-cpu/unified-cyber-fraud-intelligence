import LineChart from '../charts/LineChart';
import BarChart from '../charts/BarChart';
import PieChart from '../charts/PieChart';
import AreaChart from '../charts/AreaChart';
import HeatMapChart from '../charts/HeatMapChart';
import RiskChart from '../charts/RiskChart';

export default function Analytics() {
  return (
    <div className="space-y-6" id="comprehensive-analytics-page">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-100 tracking-wider">CORRELATION STATISTICS MATRIX</h2>
        <p className="text-xs text-slate-400 mt-0.5">Advanced structural analysis of network nodes, cryptographic failures, and SWIFT anomalies.</p>
      </div>

      {/* Grid containing high-fidelity charting widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#102B46] border border-slate-800 rounded-xl p-5">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest block mb-4">Risk Index Probability (Historical Timeline)</span>
          <RiskChart />
        </div>

        <div className="bg-[#102B46] border border-slate-800 rounded-xl p-5">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest block mb-4">Total Liquidity Volume Traced</span>
          <AreaChart />
        </div>

        <div className="bg-[#102B46] border border-slate-800 rounded-xl p-5">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest block mb-4">Correlation Incidents by Network Segment</span>
          <BarChart />
        </div>

        <div className="bg-[#102B46] border border-slate-800 rounded-xl p-5">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest block mb-4">Login Event Density Matrix</span>
          <HeatMapChart />
        </div>
      </div>
    </div>
  );
}
