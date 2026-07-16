import { ResponsiveContainer, BarChart as ReChartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function BarChart() {
  const chartData = [
    { department: 'Retail Banking', Success: 4200, Failed: 42 },
    { department: 'Corporate SWIFT', Success: 180, Failed: 4 },
    { department: 'Wealth Mgmt', Success: 340, Failed: 12 },
    { department: 'Admin Terminals', Success: 95, Failed: 18 },
    { department: 'API Integrations', Success: 8200, Failed: 156 },
  ];

  return (
    <div className="h-[280px] w-full" id="barchart-container">
      <ResponsiveContainer width="100%" height="100%">
        <ReChartsBar data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
          <XAxis dataKey="department" stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#102B46', borderColor: '#1e293b', borderRadius: '8px' }}
            itemStyle={{ color: '#f1f5f9' }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          <Bar dataKey="Success" fill="#10b981" radius={[4, 4, 0, 0]} name="Authorized Login" />
          <Bar dataKey="Failed" fill="#ef4444" radius={[4, 4, 0, 0]} name="Failed Attempts" />
        </ReChartsBar>
      </ResponsiveContainer>
    </div>
  );
}
