import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

interface FraudChartProps {
  data: any[];
}

export default function FraudChart({ data }: FraudChartProps) {
  const chartData = data && data.length > 0 ? data.slice(0, 8).map(item => ({
    txId: item.transactionId || item.id,
    prob: Math.round((item.fraudProbability || 0) * 100),
  })) : [
    { txId: 'tx1001', prob: 94 },
    { txId: 'tx1003', prob: 72 },
    { txId: 'tx1005', prob: 88 },
    { txId: 'tx1008', prob: 12 },
    { txId: 'tx1009', prob: 45 },
    { txId: 'tx1012', prob: 19 },
  ];

  return (
    <div className="h-[280px] w-full" id="fraud-chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
          <XAxis dataKey="txId" stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} tickLine={false} unit="%" />
          <Tooltip
            contentStyle={{ backgroundColor: '#102B46', borderColor: '#1e293b', borderRadius: '8px' }}
            itemStyle={{ color: '#f1f5f9' }}
            labelFormatter={(label) => `Tx: ${label}`}
          />
          <Bar dataKey="prob" radius={[4, 4, 0, 0]} name="Fraud Probability">
            {chartData.map((entry, index) => {
              const color = entry.prob > 80 ? '#ef4444' : entry.prob > 40 ? '#f97316' : '#10b981';
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
