import { DollarSign, ShieldCheck, ShieldAlert, Cpu, Percent } from 'lucide-react';

interface DashboardCardsProps {
  metrics: {
    totalTransactions: number;
    fraudBlocked: number;
    activeThreats: number;
    quantumAlerts: number;
    riskScore: number;
  };
}

export default function DashboardCards({ metrics }: DashboardCardsProps) {
  const cards = [
    {
      title: 'Total Volume Tracked',
      value: metrics.totalTransactions.toLocaleString(),
      change: '+14% from yesterday',
      changeColor: 'text-emerald-400',
      icon: DollarSign,
      color: 'border-cyan-500/20 text-cyan-400 bg-cyan-500/5'
    },
    {
      title: 'Fraud Interdictions',
      value: metrics.fraudBlocked,
      change: '100% automatic block rate',
      changeColor: 'text-cyan-400',
      icon: ShieldCheck,
      color: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5'
    },
    {
      title: 'Active Cyber Threats',
      value: metrics.activeThreats,
      change: 'Critical severity level',
      changeColor: 'text-red-400',
      icon: ShieldAlert,
      color: 'border-red-500/20 text-red-400 bg-red-500/5'
    },
    {
      title: 'Quantum Vulnerable Assets',
      value: metrics.quantumAlerts,
      change: 'HNDL exposure indicators',
      changeColor: 'text-orange-400',
      icon: Cpu,
      color: 'border-orange-500/20 text-orange-400 bg-orange-500/5'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="dashboard-cards-grid">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div 
            key={idx} 
            className="bg-[#102B46] border border-slate-800 rounded-xl p-5 hover:border-slate-700 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300"
            id={`metric-card-${idx}`}
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-semibold text-slate-400">{card.title}</span>
              <div className={`p-2 rounded-lg border ${card.color}`}>
                <Icon size={16} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-100 font-mono tracking-tight">{card.value}</span>
              <span className={`text-[10px] font-medium mt-1 ${card.changeColor}`}>{card.change}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
