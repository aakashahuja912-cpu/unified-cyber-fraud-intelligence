import ExplainableAI from '../components/ExplainableAI';
import AIRecommendationCard from '../components/AIRecommendationCard';

export default function AIExplainability() {
  const dummyShap = {
    'Transaction Value Deviation': 0.38,
    'Unrecognized Device Fingerprint': 0.22,
    'Impossible Location Speed (Velocity)': 0.28,
    'Session Cryptography Ageing': 0.12,
    'Login Failure Rate Index': 0.05
  };

  return (
    <div className="space-y-6" id="ai-explainability-page">
      <div>
        <h2 className="text-lg font-bold text-slate-100 tracking-wider">EXPLAINABLE AI & CORRELATION INSIGHTS</h2>
        <p className="text-xs text-slate-400 mt-0.5">Demystifying decision weights in Isolation Forest & Gradient Boosting classifiers using SHAP values.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-[#102B46] border border-slate-800 rounded-xl p-5">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest block mb-4">Baseline Model Weight Contribution (SHAP)</span>
            <ExplainableAI shapValues={dummyShap} confidenceScore={0.88} />
          </div>
        </div>
        <AIRecommendationCard />
      </div>
    </div>
  );
}
