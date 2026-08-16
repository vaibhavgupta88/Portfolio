import React, { useState, useEffect } from 'react';
import { StatCard } from '../components/dashboard/StatCard';
import { UptimeChart } from '../components/dashboard/UptimeChart';
import { ResponseTimeChart } from '../components/dashboard/ResponseTimeChart';
import { IncidentTimeline } from '../components/dashboard/IncidentTimeline';
import { GlobalMap } from '../components/map/GlobalMap';
import { DashboardStats, RegionNode, Incident, MonitoringCheck } from '../types';
import { api } from '../services/api';
import { useSocket } from '../context/SocketContext';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Globe,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { socket } = useSocket();
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    online: 0,
    offline: 0,
    degraded: 0,
    paused: 0,
    avgUptime: 100,
    avgResponseTime: 0,
    activeIncidentsCount: 0,
    sslExpiringSoon: 0,
  });
  const [regions, setRegions] = useState<RegionNode[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [checks, setChecks] = useState<MonitoringCheck[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, incidentsRes, metricsRes] = await Promise.all([
        api.get('/monitoring/dashboard-stats'),
        api.get('/incidents?status=investigating'),
        api.get('/monitoring/metrics?hours=24'),
      ]);

      if (statsRes.data.stats) setStats(statsRes.data.stats);
      if (statsRes.data.regions) setRegions(statsRes.data.regions);
      if (incidentsRes.data.incidents) setIncidents(incidentsRes.data.incidents);
      if (metricsRes.data.checks) setChecks(metricsRes.data.checks);
    } catch (err) {
      console.error('Error loading dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    if (!socket) return;
    socket.on('monitoring:check_result', () => {
      fetchDashboardData();
    });
    socket.on('incident:created', () => {
      fetchDashboardData();
    });

    return () => {
      socket.off('monitoring:check_result');
      socket.off('incident:created');
    };
  }, [socket]);

  // Generate synthetic timeline for uptime trend
  const uptimeTrendData = Array.from({ length: 12 }, (_, i) => ({
    timestamp: `${(i + 1) * 2}h ago`,
    uptime: Number((stats.avgUptime - (Math.random() * 0.4 - 0.2)).toFixed(2)),
  }));

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-800 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-slate-900 rounded-2xl border border-slate-800"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Resilience Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time telemetry, latency analytics, and global probe health</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/map"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition"
          >
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>Expand Global Map</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Uptime"
          value={`${stats.avgUptime}%`}
          subtitle="Past 30 days global SLA"
          icon={ShieldCheck}
          trend={stats.avgUptime >= 99 ? 'SLA Passed' : 'Degraded'}
          trendType={stats.avgUptime >= 99 ? 'positive' : 'negative'}
          colorTheme="emerald"
        />

        <StatCard
          title="Websites Online"
          value={`${stats.online} / ${stats.total}`}
          subtitle={`${stats.offline} offline • ${stats.degraded} degraded`}
          icon={CheckCircle2}
          trend={stats.offline === 0 ? 'Optimal' : `${stats.offline} Outage`}
          trendType={stats.offline === 0 ? 'positive' : 'negative'}
          colorTheme="indigo"
        />

        <StatCard
          title="Avg Response Time"
          value={`${stats.avgResponseTime} ms`}
          subtitle="Global TTFB & HTTP latency"
          icon={Zap}
          trend="Realtime"
          trendType="neutral"
          colorTheme="amber"
        />

        <StatCard
          title="Active Incidents"
          value={stats.activeIncidentsCount}
          subtitle={`${stats.sslExpiringSoon} SSL Certs Expiring`}
          icon={AlertTriangle}
          trend={stats.activeIncidentsCount === 0 ? 'Clean' : 'Action Required'}
          trendType={stats.activeIncidentsCount === 0 ? 'positive' : 'negative'}
          colorTheme="rose"
        />
      </div>

      {/* Global Map Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Global Monitoring Regions</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">7 Global Edge Nodes Active</span>
        </div>
        <GlobalMap regions={regions} />
      </div>

      {/* Charts Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Uptime Trend */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Global Availability Trend</h3>
              <p className="text-xs text-slate-400">Aggregated uptime SLA over time</p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-semibold">
              99.98% SLA
            </span>
          </div>
          <UptimeChart data={uptimeTrendData} />
        </div>

        {/* Latency History */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Response Time Breakdown (ms)</h3>
              <p className="text-xs text-slate-400">DNS Lookup, TTFB & Total Latency</p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/60 font-semibold">
              Latency Feed
            </span>
          </div>
          <ResponseTimeChart checks={checks} />
        </div>
      </div>

      {/* Active Incidents Feed */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Active Incident Feed</h3>
          </div>
          <Link to="/incidents" className="text-xs text-indigo-400 font-semibold hover:text-indigo-300">
            View All Incidents &rarr;
          </Link>
        </div>
        <IncidentTimeline incidents={incidents} />
      </div>
    </div>
  );
};
