import FraudDetectionCard from '../components/FraudDetectionCard';
import FraudChart from '../charts/FraudChart';

export default function FraudDetection() {
  return (
    <div className="space-y-6" id="fraud-detection-page">
      <div>
        <h2 className="text-lg font-bold text-slate-100 tracking-wider">FRAUD DETECTION ENGINE</h2>
        <p className="text-xs text-slate-400 mt-0.5">Real-time prediction of transaction compromise, identity theft, and account takeover (ATO) attempts.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Interactive Simulator */}
        <FraudDetectionCard />

        {/* Historical probability chart */}
        <div className="bg-[#102B46] border border-slate-800 rounded-xl p-5">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest block mb-4">Fraud Probability Distribution - Historical Sequences</span>
          <FraudChart data={[]} />
        </div>
      </div>
    </div>
  );
}
