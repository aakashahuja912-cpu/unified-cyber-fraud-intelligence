import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function QuantumRiskChart() {
  const chartData = [
    { name: 'Core Databases', Vulnerable: 3, Mitigating: 5, Protected: 2 },
    { name: 'SWIFT Gateway', Vulnerable: 1, Mitigating: 2, Protected: 3 },
    { name: 'ATM Network', Vulnerable: 5, Mitigating: 0, Protected: 1 },
    { name: 'Web Handshakes', Vulnerable: 12, Mitigating: 8, Protected: 4 },
    { name: 'Internal VPNs', Vulnerable: 2, Mitigating: 4, Protected: 6 },
  ];

  return (
    <div className="h-[280px] w-full" id="quantumchart-container">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
          <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#102B46', borderColor: '#1e293b', borderRadius: '8px' }}
            itemStyle={{ color: '#f1f5f9' }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          <Bar dataKey="Protected" stackId="a" fill="#10b981" name="PQC Secured (Kyber/Dilithium)" />
          <Bar dataKey="Mitigating" stackId="a" fill="#f97316" name="Active Migration Schema" />
          <Bar dataKey="Vulnerable" stackId="a" fill="#ef4444" name="Vulnerable (Classical RSA/3DES)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
