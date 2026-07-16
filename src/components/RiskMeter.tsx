import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

interface RiskMeterProps {
  score: number;
  tier: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: {
    telemetry: number;
    transaction: number;
    behavior: number;
  };
}

export default function RiskMeter({ score, tier, factors }: RiskMeterProps) {
  const getColors = () => {
    switch (tier) {
      case 'CRITICAL':
        return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'CRITICAL THREAT' };
      case 'HIGH':
        return { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30', label: 'HIGH RISK' };
      case 'MEDIUM':
        return { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'MODERATE RISK' };
      default:
        return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'SECURE / LOW' };
    }
  };

  const style = getColors();
  
  // Calculate stroke dasharray for arc circumference (radius=70, arc is 280deg)
  const radius = 70;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius; // ~439.8
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-[#102B46] border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-between h-full" id="risk-meter-component">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-6">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Composite Risk Level</h3>
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${style.color} ${style.bg} ${style.border}`}>
          {style.label}
        </span>
      </div>

      {/* SVG Radial Meter */}
      <div className="relative flex items-center justify-center my-2">
        <svg className="w-44 h-44 transform -rotate-90">
          {/* Base track */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            className="transition-all"
          />
          {/* Active progress */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke={tier === 'CRITICAL' ? '#ef4444' : tier === 'HIGH' ? '#f97316' : tier === 'MEDIUM' ? '#f59e0b' : '#10b981'}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold font-mono text-slate-100">{score}</span>
          <span className="text-[10px] text-slate-400 font-bold tracking-wider mt-0.5 uppercase">Threat index</span>
        </div>
      </div>

      {/* Breakdown Factors */}
      <div className="w-full space-y-3 mt-6">
        <div className="flex justify-between text-xs font-bold text-slate-400">
          <span>Correlation Vectors</span>
          <span>Index</span>
        </div>

        {/* 1. Cyber Telemetry (Max 30) */}
        <div>
          <div className="flex justify-between items-center text-[11px] mb-1">
            <span className="text-slate-400 font-medium">Cybersecurity Telemetry</span>
            <span className="font-semibold text-slate-200 font-mono">{factors.telemetry}/30</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 rounded-full transition-all duration-1000" 
              style={{ width: `${(factors.telemetry / 30) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 2. Transaction Integrity (Max 30) */}
        <div>
          <div className="flex justify-between items-center text-[11px] mb-1">
            <span className="text-slate-400 font-medium">Transaction Behaviour</span>
            <span className="font-semibold text-slate-200 font-mono">{factors.transaction}/30</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-500 rounded-full transition-all duration-1000" 
              style={{ width: `${(factors.transaction / 30) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 3. User Behavior Metrics (Max 40) */}
        <div>
          <div className="flex justify-between items-center text-[11px] mb-1">
            <span className="text-slate-400 font-medium">Anomaly Behavioral Engine</span>
            <span className="font-semibold text-slate-200 font-mono">{factors.behavior}/40</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-500 rounded-full transition-all duration-1000" 
              style={{ width: `${(factors.behavior / 40) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
