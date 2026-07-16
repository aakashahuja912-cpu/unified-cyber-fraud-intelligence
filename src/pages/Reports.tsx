import React, { useState, useEffect } from 'react';
import { threatAPI } from '../services/threatAPI';
import { SavedReport } from '../db-store';
import { FileText, Download, CheckCircle, RefreshCw, AlertTriangle } from 'lucide-react';

export default function Reports() {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [title, setTitle] = useState('Weekly Cryptographic Ageing Audit');
  const [type, setType] = useState('Quantum');
  const [format, setFormat] = useState('PDF');
  
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchReports = async () => {
    try {
      const data = await threatAPI.getReports();
      setReports(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setSuccess('');
    setError('');

    try {
      await threatAPI.generateReport({ title, type, format });
      setSuccess('Audit report compiled and committed to database!');
      fetchReports();
    } catch (err: any) {
      setError(err.message || 'Report compilation failed.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6" id="compliance-reports-page">
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 tracking-wider">COMPLIANCE & COMPILATION CENTRE</h2>
          <p className="text-xs text-slate-400 mt-0.5">Generate, sign, and download cryptographical strength and fraud audit ledgers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compiler Form */}
        <div className="bg-[#102B46] border border-slate-800 rounded-xl p-5 space-y-4 h-fit">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest block pb-2 border-b border-slate-800">Compile Audit ledger</span>
          
          {success && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle size={14} className="shrink-0" />
              <span className="font-semibold">{success}</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg flex items-center gap-2">
              <AlertTriangle size={14} className="shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 font-semibold mb-1">Report Title / Subject</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1">Type Focus</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none cursor-pointer font-semibold"
                >
                  <option value="Quantum">Quantum Risk</option>
                  <option value="Fraud">Fraud Probability</option>
                  <option value="Threat">Cyber Telemetry</option>
                  <option value="Comprehensive">Comprehensive SOC</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1">Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none cursor-pointer font-semibold"
                >
                  <option value="PDF">Secure PDF</option>
                  <option value="CSV">Data CSV</option>
                  <option value="Excel">Excel Binary</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {generating ? (
                <span>Assembling cryptographic hashes...</span>
              ) : (
                <>
                  <FileText size={13} />
                  <span>Sign & Compile Audit</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Saved Ledgers List */}
        <div className="lg:col-span-2 bg-[#102B46] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="pb-2 border-b border-slate-800 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest block">Available System Ledgers</span>
            <button onClick={fetchReports} className="text-slate-500 hover:text-cyan-400 transition-colors">
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto scrollbar-thin">
            {loading ? (
              <p className="text-xs text-slate-500 py-10 text-center animate-pulse">Scanning database indexes...</p>
            ) : reports.length === 0 ? (
              <p className="text-xs text-slate-500 py-10 text-center">No reports compiled yet.</p>
            ) : (
              reports.map((rep) => (
                <div key={rep.id} className="p-3.5 bg-slate-950/20 border border-slate-800/80 rounded-xl flex justify-between items-center gap-4 hover:border-slate-700/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/10 rounded-lg">
                      <FileText size={15} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">{rep.title}</span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold uppercase mt-0.5">
                        <span>Type: {rep.type}</span>
                        <span>•</span>
                        <span>Format: <span className="font-mono text-cyan-400">{rep.format}</span></span>
                        <span>•</span>
                        <span>Size: {rep.size}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={threatAPI.getDownloadUrl(rep.id)}
                    download
                    className="p-2 bg-slate-900 hover:bg-cyan-600 text-slate-400 hover:text-white border border-slate-800 hover:border-cyan-500 rounded-lg transition-all duration-200 cursor-pointer"
                    title="Download decrypted compliance ledger"
                  >
                    <Download size={13} />
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
