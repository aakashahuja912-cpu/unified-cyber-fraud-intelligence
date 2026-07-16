import { useState, useEffect } from 'react';
import DashboardCards from '../components/DashboardCards';
import RiskMeter from '../components/RiskMeter';
import SecurityAlerts from '../components/SecurityAlerts';
import WorldMap from '../components/WorldMap';
import TransactionTable from '../components/TransactionTable';
import AIRecommendationCard from '../components/AIRecommendationCard';
import { fraudAPI } from '../services/fraudAPI';
import { riskAPI } from '../services/riskAPI';
import { threatAPI } from '../services/threatAPI';
import { Transaction, RiskScore } from '../db-store';

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [riskData, setRiskData] = useState<any>(null);
  const [metrics, setMetrics] = useState({
    totalTransactions: 0,
    fraudBlocked: 0,
    activeThreats: 0,
    quantumAlerts: 0,
    riskScore: 45
  });

  const fetchData = async () => {
    try {
      const txs = await fraudAPI.getTransactions();
      const risk = await riskAPI.getRiskScore();
      const threats = await threatAPI.getThreatAlerts();
      const quantum = await threatAPI.getQuantumThreats();

      setTransactions(txs || []);
      setRiskData(risk);

      const activeThreatsCount = (threats || []).filter((t: any) => t.status !== 'Resolved').length;
      const blockedTxsCount = (txs || []).filter((t: any) => t.status === 'Blocked').length;

      setMetrics({
        totalTransactions: txs ? txs.length : 0,
        fraudBlocked: blockedTxsCount,
        activeThreats: activeThreatsCount,
        quantumAlerts: quantum ? quantum.summary?.vulnerable || 0 : 0,
        riskScore: risk ? risk.score : 45
      });
    } catch (e) {
      console.error('Failed to compile SOC metrics:', e);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 5 seconds for live simulation feeds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6" id="overview-dashboard-page">
      {/* Title Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-100 tracking-wider">CORRELATION SOC OVERVIEW</h2>
          <p className="text-xs text-slate-400 mt-0.5">Real-time mapping of cyber threat telemetry and customer transactional anomalies.</p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#102B46] border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>DEDICATED SECURE NODE</span>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <DashboardCards metrics={metrics} />

      {/* Main Grid: Map, Risk gauge and alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WorldMap />
        </div>
        <div>
          {riskData ? (
            <RiskMeter 
              score={riskData.score} 
              tier={riskData.tier} 
              factors={riskData.factors || { telemetry: 15, transaction: 15, behavior: 15 }} 
            />
          ) : (
            <div className="bg-[#102B46] border border-slate-800 h-full rounded-xl flex items-center justify-center">
              <span className="text-xs text-slate-500 font-bold tracking-widest animate-pulse">DECIPHERING RISK MATRIX...</span>
            </div>
          )}
        </div>
      </div>

      {/* Second grid: Real-time alerts and AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SecurityAlerts />
        <AIRecommendationCard />
      </div>

      {/* Live ledger table */}
      <div className="pt-2">
        <TransactionTable transactions={transactions.slice(0, 8)} />
      </div>
    </div>
  );
}
