import QuantumRiskPanel from '../components/QuantumRiskPanel';
import QuantumRiskChart from '../charts/QuantumRiskChart';

export default function QuantumMonitoring() {
  return (
    <div className="space-y-6" id="quantum-monitoring-page">
      <div>
        <h2 className="text-lg font-bold text-slate-100 tracking-wider">QUANTUM CRYPTOGRAPHIC AGEING</h2>
        <p className="text-xs text-slate-400 mt-0.5">Assessing vulnerabilities in SWIFT protocols against Shor's and Grover's quantum computational attacks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QuantumRiskPanel />
        </div>
        <div className="bg-[#102B46] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest block mb-4">Post-Quantum Migration Schema Matrix</span>
          <QuantumRiskChart />
        </div>
      </div>
    </div>
  );
}
