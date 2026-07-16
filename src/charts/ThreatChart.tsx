import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function ThreatChart() {
  const chartData = [
    { name: 'Mon', Critical: 2, High: 4, Medium: 12 },
    { name: 'Tue', Critical: 1, High: 6, Medium: 15 },
    { name: 'Wed', Critical: 4, High: 3, Medium: 9 },
    { name: 'Thu', Critical: 3, High: 7, Medium: 14 },
    { name: 'Fri', Critical: 1, High: 8, Medium: 18 },
    { name: 'Sat', Critical: 0, High: 2, Medium: 5 },
    { name: 'Sun', Critical: 2, High: 3, Medium: 7 },
  ];

  return (
    <div className="h-[280px] w-full" id="threat-chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
          <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#102B46', borderColor: '#1e293b', borderRadius: '8px' }}
            itemStyle={{ color: '#f1f5f9' }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          <Line type="monotone" dataKey="Critical" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Critical Alerts" />
          <Line type="monotone" dataKey="High" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} name="High Severity" />
          <Line type="monotone" dataKey="Medium" stroke="#3b82f6" strokeWidth={1.5} dot={false} name="Medium/Low Incidents" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
