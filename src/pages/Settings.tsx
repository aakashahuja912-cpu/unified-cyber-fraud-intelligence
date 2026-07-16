import React, { useState, useEffect } from 'react';
import { riskAPI } from '../services/riskAPI';
import { Settings as SettingsIcon, Save, CheckCircle, RefreshCw } from 'lucide-react';

export default function Settings() {
  const [quantumSensitivity, setQuantumSensitivity] = useState('High');
  const [mfaRequired, setMfaRequired] = useState(true);
  const [autoBlockThreshold, setAutoBlockThreshold] = useState(0.75);
  const [sessionTimeout, setSessionTimeout] = useState(15);
  const [apiSecurityHeaders, setApiSecurityHeaders] = useState(true);
  const [anomalyModel, setAnomalyModel] = useState('Isolation Forest (Dynamic Ensemble)');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  const fetchSettings = async () => {
    try {
      const data = await riskAPI.getSettings();
      if (data) {
        setQuantumSensitivity(data.quantumSensitivity || 'High');
        setMfaRequired(data.mfaRequired ?? true);
        setAutoBlockThreshold(data.autoBlockThreshold || 0.75);
        setSessionTimeout(data.sessionTimeout || 15);
        setApiSecurityHeaders(data.apiSecurityHeaders ?? true);
        setAnomalyModel(data.anomalyModelType || 'Isolation Forest (Dynamic Ensemble)');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');

    try {
      await riskAPI.updateSettings({
        quantumSensitivity,
        mfaRequired,
        autoBlockThreshold,
        sessionTimeout,
        apiSecurityHeaders,
        anomalyModelType: anomalyModel
      });
      setSuccess('Global intelligence configuration committed successfully!');
      fetchSettings();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#102B46] border border-slate-800 rounded-xl p-6 h-60 flex items-center justify-center">
        <span className="text-xs text-slate-400 font-bold tracking-wider animate-pulse uppercase">Decompiling system registers...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="system-settings-page">
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 tracking-wider flex items-center gap-2">
            <SettingsIcon size={18} className="text-cyan-400" />
            <span>GLOBAL ENGINE SETTINGS</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">Fine-tune correlation parameters, anomaly cutoffs, and identity parameters.</p>
        </div>
      </div>

      <div className="max-w-3xl bg-[#102B46] border border-slate-800 rounded-xl p-6 shadow-xl">
        {success && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg flex items-center gap-2 mb-6">
            <CheckCircle size={14} className="shrink-0" />
            <span className="font-semibold">{success}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Anomaly model */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Behavior Anomaly Model Core</label>
            <select
              value={anomalyModel}
              onChange={(e) => setAnomalyModel(e.target.value)}
              className="w-full bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none cursor-pointer"
            >
              <option value="Isolation Forest (Dynamic Ensemble)">Isolation Forest (Dynamic Ensembles)</option>
              <option value="XGBoost Gradient Boosting Core">XGBoost Gradient Boosting Classifier</option>
              <option value="SVM Kernelized Clustering">SVM Kernelized Anomaly Clustering</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Auto Block cutoff */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Auto-Block Intercept Cutoff (0.0 to 1.0)</label>
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="1.0"
                required
                value={autoBlockThreshold}
                onChange={(e) => setAutoBlockThreshold(parseFloat(e.target.value))}
                className="w-full bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none font-mono"
              />
            </div>

            {/* Session Timeout */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Analyst Session Timeout Limit (Mins)</label>
              <input
                type="number"
                required
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                className="w-full bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none font-mono"
              />
            </div>
          </div>

          {/* Cryptographic Sensitivity */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Shor-Vulnerable Cryptographic Alarm Sensitivity</label>
            <div className="flex gap-4">
              {['Low', 'Medium', 'High'].map((level) => (
                <label key={level} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                  <input
                    type="radio"
                    name="sensitivity"
                    value={level}
                    checked={quantumSensitivity === level}
                    onChange={(e) => setQuantumSensitivity(e.target.value)}
                    className="accent-cyan-500"
                  />
                  <span>{level} Alarm Index</span>
                </label>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3.5 pt-2 border-t border-slate-800/60">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="mfa_chk"
                checked={mfaRequired}
                onChange={(e) => setMfaRequired(e.target.checked)}
                className="accent-cyan-500 rounded"
              />
              <label htmlFor="mfa_chk" className="text-xs font-semibold text-slate-350 cursor-pointer">
                Force Hardware MFA verification across out-of-boundary IP tunnels
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="headers_chk"
                checked={apiSecurityHeaders}
                onChange={(e) => setApiSecurityHeaders(e.target.checked)}
                className="accent-cyan-500 rounded"
              />
              <label htmlFor="headers_chk" className="text-xs font-semibold text-slate-350 cursor-pointer">
                Deploy FIPS 140-3 payload encryption on outbound REST calls
              </label>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white font-bold text-xs py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer pt-3"
          >
            <Save size={13} />
            <span>{saving ? 'Committing configurations...' : 'Save global system configuration'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
