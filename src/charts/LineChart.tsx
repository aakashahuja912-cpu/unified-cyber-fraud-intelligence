import { ResponsiveContainer, LineChart as ReChartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function LineChart() {
  const chartData = [
    { name: '00:00', events: 140 },
    { name: '04:00', events: 90 },
    { name: '08:00', events: 350 },
    { name: '12:00', events: 580 },
    { name: '16:00', events: 610 },
    { name: '20:00', events: 420 },
    { name: '24:00', events: 180 },
  ];

  return (
    <div className="h-[280px] w-full" id="linechart-container">
      <ResponsiveContainer width="100%" height="100%">
        <ReChartsLine data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
          <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#102B46', borderColor: '#1e293b', borderRadius: '8px' }}
            itemStyle={{ color: '#f1f5f9' }}
          />
          <Line type="monotone" dataKey="events" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} name="Events Ingested / Sec" />
        </ReChartsLine>
      </ResponsiveContainer>
    </div>
  );
}
