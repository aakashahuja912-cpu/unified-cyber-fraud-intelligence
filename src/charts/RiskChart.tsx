import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface RiskChartProps {
  data?: any[];
}

export default function RiskChart({ data }: RiskChartProps) {
  const chartData = data && data.length > 0 ? data.map((item, idx) => ({
    name: new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    score: item.score,
    telemetry: item.telemetryFactor,
    transaction: item.transactionFactor,
    behavior: item.behaviorFactor
  })).reverse() : [
    { name: '10:00', score: 25, telemetry: 5, transaction: 10, behavior: 10 },
    { name: '11:00', score: 38, telemetry: 12, transaction: 14, behavior: 12 },
    { name: '12:00', score: 65, telemetry: 15, transaction: 25, behavior: 25 },
    { name: '13:00', score: 85, telemetry: 28, transaction: 27, behavior: 30 },
    { name: '14:00', score: 92, telemetry: 28, transaction: 28, behavior: 36 },
  ];

  return (
    <div className="h-[280px] w-full" id="risk-chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorBehavior" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
          <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#102B46', borderColor: '#1e293b', borderRadius: '8px' }}
            labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
            itemStyle={{ color: '#f1f5f9' }}
          />
          <Area type="monotone" dataKey="score" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" name="Risk Score" />
          <Area type="monotone" dataKey="behavior" stroke="#06b6d4" strokeWidth={1.5} fillOpacity={1} fill="url(#colorBehavior)" name="Behavior Anomaly" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
