'use client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default function PerformanceChart() {
  const data = [
    { name: '10s', value: 400 },
    { name: '20s', value: 300 },
    { name: '30s', value: 600 },
    { name: '40s', value: 800 },
    { name: '50s', value: 500 },
  ];

  return (
    <div className="h-64 w-full bg-zinc-900 border border-zinc-700 rounded-lg p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#52525b" />
          <YAxis stroke="#52525b" />
          <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none' }} />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
