import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';
import { riskAPI } from '../services/riskAPI';

export default function AIRecommendationCard() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('Local Rule Heuristics');

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const data = await riskAPI.getAIRecommendations();
      if (data && data.recommendations) {
        setRecommendations(data.recommendations);
        setSource(data.source || 'Model Correlation Engine');
      }
    } catch (e) {
      console.error('Failed to fetch AI recommendations:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="bg-[#102B46] border border-slate-800 rounded-xl p-6 space-y-4" id="ai-recommendations-component">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Sparkles className="text-cyan-400 animate-pulse" size={16} />
          <h3 className="text-sm font-bold text-slate-200 tracking-wider">AI Cybersecurity Officer Advice</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded font-bold font-mono">
            {source}
          </span>
          <button 
            onClick={fetchRecommendations}
            disabled={loading}
            className="text-slate-500 hover:text-cyan-400 disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center space-y-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping inline-block"></span>
          <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Consulting Gemini Neural Core...</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
          {recommendations.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No correlation advice available</p>
          ) : (
            recommendations.map((rec, idx) => (
              <div 
                key={rec.id || idx} 
                className="p-4 bg-slate-950/30 rounded-xl border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col md:flex-row gap-4 items-start"
              >
                {/* Severity indicator */}
                <div className={`p-2.5 rounded-lg border flex-shrink-0 mt-0.5 ${
                  rec.riskLevel === 'Critical' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                  rec.riskLevel === 'High' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                  'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                }`}>
                  <ShieldAlert size={16} />
                </div>

                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex justify-between items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-slate-200">{rec.title}</h4>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                      rec.riskLevel === 'Critical' ? 'bg-red-500/10 text-red-400' :
                      rec.riskLevel === 'High' ? 'bg-orange-500/10 text-orange-400' :
                      'bg-cyan-500/10 text-cyan-400'
                    }`}>
                      {rec.riskLevel} Priority ({rec.relevanceScore}%)
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                    Vulnerability: <span className="text-slate-300 font-bold">{rec.vulnerability}</span>
                  </p>

                  <div className="bg-slate-950/45 p-2.5 rounded-lg border border-slate-900/60 text-xs text-slate-300 leading-relaxed font-medium">
                    <span className="font-bold text-cyan-400 text-[10px] uppercase block mb-1">Recommended Response Matrix</span>
                    {rec.action}
                  </div>

                  <p className="text-[10px] text-slate-500 italic leading-relaxed">
                    Rationale: {rec.rationale}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
