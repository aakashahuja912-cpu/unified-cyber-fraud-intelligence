import { useState } from 'react';
import { fraudAPI } from '../services/fraudAPI';
import { CATEGORIES, CRYPTO_STANDARDS } from '../utils/constants';
import { Play, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import ExplainableAI from './ExplainableAI';

export default function FraudDetectionCard() {
  const [amount, setAmount] = useState('12000');
  const [loginAttempts, setLoginAttempts] = useState('4');
  const [location, setLocation] = useState('Moscow, Russia');
  const [encryption, setEncryption] = useState('RSA-1024');
  const [isTrustedDevice, setIsTrustedDevice] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const data = await fraudAPI.detectFraud({
        amount: parseFloat(amount),
        loginAttempts: parseInt(loginAttempts),
        hour: new Date().getHours(),
        isTrustedDevice,
        location,
        browser: 'Firefox v120',
        encryptionType: encryption
      });
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#102B46] border border-slate-800 rounded-xl p-6" id="fraud-detection-simulator-card">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-200 tracking-wider">Dynamic Fraud & SHAP Simulator</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Test transaction data and evaluate neural weights in real time.</p>
        </div>
        <div className="bg-cyan-500/10 text-cyan-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-cyan-500/20">
          ML SIMULATOR
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Parameters Form */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Simulation Parameters</h4>

          {/* Amount */}
          <div>
            <label className="block text-xs text-slate-400 font-semibold mb-1.5">Transaction Value (USD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:border-cyan-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Login attempts */}
            <div>
              <label className="block text-xs text-slate-400 font-semibold mb-1.5">MFA Failures / Login attempts</label>
              <select
                value={loginAttempts}
                onChange={(e) => setLoginAttempts(e.target.value)}
                className="w-full bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none"
              >
                <option value="1">1 (Normal)</option>
                <option value="2">2 (Unusual)</option>
                <option value="3">3 (Risk Alert)</option>
                <option value="5">5 (Suspected Brute)</option>
              </select>
            </div>

            {/* Encryption Standard */}
            <div>
              <label className="block text-xs text-slate-400 font-semibold mb-1.5">Session Cipher Suite</label>
              <select
                value={encryption}
                onChange={(e) => setEncryption(e.target.value)}
                className="w-full bg-[#102B46] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none"
              >
                {CRYPTO_STANDARDS.map((std) => (
                  <option key={std.value} value={std.value}>
                    {std.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs text-slate-400 font-semibold mb-1.5">IP Endpoint Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none"
            />
          </div>

          {/* Trusted device checkbox */}
          <div className="flex items-center gap-2.5 bg-slate-950/20 border border-slate-800/80 p-3 rounded-lg">
            <input
              type="checkbox"
              id="trusted_device_check"
              checked={isTrustedDevice}
              onChange={(e) => setIsTrustedDevice(e.target.checked)}
              className="accent-cyan-500 rounded border-slate-800"
            />
            <label htmlFor="trusted_device_check" className="text-xs text-slate-300 font-semibold cursor-pointer">
              Secure Device Fingerprint Match (isTrusted)
            </label>
          </div>

          <button
            onClick={handleSimulate}
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {loading ? (
              <span>Running Isolation Forest Core...</span>
            ) : (
              <>
                <Play size={13} fill="currentColor" />
                <span>Execute Predictive Engines</span>
              </>
            )}
          </button>
        </div>

        {/* Results Panel */}
        <div className="flex flex-col justify-between border-l border-slate-800/80 pl-0 lg:pl-6">
          {result ? (
            <div className="space-y-5 flex-1 flex flex-col justify-between">
              {/* Core metrics */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Model Probability output</h4>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    result.isFlagged ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {result.isFlagged ? 'INTERDICT / BLOCK' : 'CLEARED'}
                  </span>
                </div>

                <div className="flex items-center gap-4 bg-slate-950/30 p-4 rounded-xl border border-slate-800">
                  <div className={`p-3 rounded-full border ${
                    result.isFlagged ? 'bg-red-500/15 border-red-500/20 text-red-400' : 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400'
                  }`}>
                    {result.isFlagged ? <AlertCircle size={24} /> : <CheckCircle size={24} />}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Anomaly Likelihood</span>
                    <span className="text-3xl font-extrabold font-mono text-slate-100">{Math.round(result.fraudProbability * 100)}%</span>
                  </div>
                </div>
              </div>

              {/* Explanations List */}
              {result.patternsDetected && result.patternsDetected.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Triggered Security Rules</span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.patternsDetected.map((pat: string, idx: number) => (
                      <span key={idx} className="text-[10px] bg-slate-900 border border-slate-800/80 text-slate-300 px-2.5 py-1 rounded-full font-semibold">
                        {pat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* SHAP component rendering */}
              <div className="mt-2">
                <ExplainableAI shapValues={result.shapValues} confidenceScore={result.fraudProbability} />
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-10">
              <Sparkles size={32} className="text-slate-600 mb-2.5 animate-bounce" />
              <h5 className="text-xs font-bold text-slate-300 tracking-wider">Awaiting Simulation Feed</h5>
              <p className="text-[11px] text-slate-500 max-w-xs mt-1">Configure inputs and execute predictive model engines to view SHAP attribution analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
