import { ResponsiveContainer, AreaChart as ReChartsArea, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function AreaChart() {
  const chartData = [
    { name: 'Jan', amount: 1200000 },
    { name: 'Feb', amount: 1540000 },
    { name: 'Mar', amount: 1890000 },
    { name: 'Apr', amount: 1420000 },
    { name: 'May', amount: 2100000 },
    { name: 'Jun', amount: 2650000 },
  ];

  return (
    <div className="h-[280px] w-full" id="areachart-container">
      <ResponsiveContainer width="100%" height="100%">
        <ReChartsArea data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
          <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
          <Tooltip
            contentStyle={{ backgroundColor: '#102B46', borderColor: '#1e293b', borderRadius: '8px' }}
            itemStyle={{ color: '#f1f5f9' }}
            formatter={(value: any) => [`$${value.toLocaleString()}`, 'Processed Volume']}
          />
          <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAmount)" name="Transaction Volume" />
        </ReChartsArea>
      </ResponsiveContainer>
    </div>
  );
}
