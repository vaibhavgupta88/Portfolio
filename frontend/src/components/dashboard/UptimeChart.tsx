import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface UptimeChartProps {
  data: Array<{ timestamp: string; uptime: number }>;
}

export const UptimeChart: React.FC<UptimeChartProps> = ({ data }) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUptime" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis domain={[90, 100]} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#121824',
              borderColor: '#1e293b',
              borderRadius: '0.75rem',
              color: '#f8fafc',
              fontSize: '12px',
            }}
            formatter={(value: any) => [`${value}%`, 'Global Uptime']}
          />
          <Area type="monotone" dataKey="uptime" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorUptime)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
