import { ShieldCheck, Info } from 'lucide-react';

interface ExplainableAIProps {
  shapValues: { [key: string]: number };
  confidenceScore: number;
}

export default function ExplainableAI({ shapValues, confidenceScore }: ExplainableAIProps) {
  const items = Object.entries(shapValues).map(([key, val]) => ({
    name: key,
    value: val,
    percentage: Math.round(val * 100)
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="bg-slate-950/25 border border-slate-800 rounded-xl p-4 space-y-4" id="explainable-ai-card">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Info size={13} className="text-cyan-400" />
          <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">SHAP Attributions</h4>
        </div>
        <span className="text-[9px] font-bold text-slate-500 font-mono">Additive Feature Contribution</span>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const isNegative = item.value < 0;
          const displayWidth = Math.min(100, Math.abs(item.percentage) * 2);
          
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400">
                <span className="truncate">{item.name}</span>
                <span className={isNegative ? 'text-emerald-400 font-mono' : 'text-red-400 font-mono'}>
                  {isNegative ? '-' : '+'}{Math.abs(item.percentage)}% SHAP
                </span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden flex">
                {/* Horizontal progress bar representing negative (good) or positive (bad) SHAP contribution */}
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${isNegative ? 'bg-emerald-500' : 'bg-red-500'}`}
                  style={{ width: `${displayWidth}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[9px] text-slate-500 leading-relaxed font-medium">
        *Confidence score ({Math.round(confidenceScore * 100)}%) computed using Local Feature Importance (SHAP values). Positive values indicate threat acceleration, negative values indicate trust mitigation.
      </p>
    </div>
  );
}
