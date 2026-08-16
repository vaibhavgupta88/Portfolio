import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MonitoringCheck } from '../../types';

interface ResponseTimeChartProps {
  checks: MonitoringCheck[];
}

export const ResponseTimeChart: React.FC<ResponseTimeChartProps> = ({ checks }) => {
  const chartData = checks.map((c) => ({
    time: new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    latency: c.responseTimeMs,
    dns: c.dnsLookupTimeMs,
    ttfb: c.ttfbMs,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}ms`} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#121824',
              borderColor: '#1e293b',
              borderRadius: '0.75rem',
              color: '#f8fafc',
              fontSize: '12px',
            }}
          />
          <Line type="monotone" dataKey="latency" name="Total Latency" stroke="#6366f1" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="ttfb" name="TTFB" stroke="#34d399" strokeWidth={1.5} dot={false} strokeDasharray="3 3" />
          <Line type="monotone" dataKey="dns" name="DNS Time" stroke="#fbbf24" strokeWidth={1.5} dot={false} strokeDasharray="2 2" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
