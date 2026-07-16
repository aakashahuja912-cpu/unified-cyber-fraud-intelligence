import { ResponsiveContainer, PieChart as ReChartsPie, Pie, Cell, Tooltip, Legend } from 'recharts';

interface PieChartProps {
  data?: any[];
}

export default function PieChart({ data }: PieChartProps) {
  const defaultData = [
    { name: 'Wire Transfers', value: 55000 },
    { name: 'Crypto OTC', value: 24000 },
    { name: 'Shopping', value: 8900 },
    { name: 'Card Payments', value: 12000 },
    { name: 'Others', value: 4500 }
  ];

  const COLORS = ['#ef4444', '#f97316', '#10b981', '#3b82f6', '#06b6d4'];

  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <div className="h-[280px] w-full flex items-center justify-center" id="pie-chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <ReChartsPie>
          <Tooltip
            contentStyle={{ backgroundColor: '#102B46', borderColor: '#1e293b', borderRadius: '8px' }}
            itemStyle={{ color: '#f1f5f9' }}
          />
          <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ fontSize: '11px' }} />
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </ReChartsPie>
      </ResponsiveContainer>
    </div>
  );
}
