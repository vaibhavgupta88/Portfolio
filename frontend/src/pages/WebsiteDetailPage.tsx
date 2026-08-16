import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Website, MonitoringCheck, Incident } from '../types';
import { api } from '../services/api';
import { ResponseTimeChart } from '../components/dashboard/ResponseTimeChart';
import { WebsiteHeaderInspector } from '../components/website/WebsiteHeaderInspector';
import { SSLBadge } from '../components/website/SSLBadge';
import { RedirectChainView } from '../components/website/RedirectChainView';
import { IncidentTimeline } from '../components/dashboard/IncidentTimeline';
import {
  Globe,
  RefreshCw,
  Play,
  Pause,
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowLeft,
  Server,
  Layers,
} from 'lucide-react';

export const WebsiteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [website, setWebsite] = useState<Website | null>(null);
  const [checks, setChecks] = useState<MonitoringCheck[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [activeTab, setActiveTab] = useState<'performance' | 'headers' | 'dns' | 'incidents'>('performance');

  const fetchDetails = async () => {
    if (!id) return;
    try {
      const res = await api.get(`/websites/${id}`);
      if (res.data.website) setWebsite(res.data.website);
      if (res.data.checks) setChecks(res.data.checks);
      if (res.data.incidents) setIncidents(res.data.incidents);
    } catch (err) {
      console.error('Error loading website details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleManualCheck = async () => {
    if (!id) return;
    setChecking(true);
    try {
      await api.post(`/websites/${id}/check-now`);
      fetchDetails();
    } catch (e) {
      console.error(e);
    } finally {
      setChecking(false);
    }
  };

  if (loading || !website) {
    return (
      <div className="p-8 text-center text-slate-500 animate-pulse">
        Fetching target endpoint diagnostics...
      </div>
    );
  }

  const latestCheck = checks[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Back button */}
      <div>
        <Link to="/websites" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" /> Back to Monitored Endpoints
        </Link>
      </div>

      {/* Main Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white tracking-tight">{website.name}</h1>
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                    website.lastCheckStatus === 'up'
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800/80'
                      : website.lastCheckStatus === 'down'
                      ? 'bg-rose-950 text-rose-400 border-rose-800/80 animate-pulse'
                      : 'bg-amber-950 text-amber-400 border-amber-800/80'
                  }`}
                >
                  {website.lastCheckStatus}
                </span>
              </div>
              <a
                href={website.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1.5 mt-1 font-mono"
              >
                <span>{website.url}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleManualCheck}
              disabled={checking}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
              <span>Run Check Now</span>
            </button>
          </div>
        </div>

        {/* Diagnostic Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-400 block">SLA Uptime</span>
            <span className="text-lg font-bold font-mono text-emerald-400">{website.uptimePercentage}%</span>
          </div>
          <div>
            <span className="text-slate-400 block">Current Latency</span>
            <span className="text-lg font-bold font-mono text-white">
              {website.lastResponseTimeMs ? `${website.lastResponseTimeMs} ms` : '--'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Detected CDN</span>
            <span className="text-sm font-semibold text-indigo-300">{website.cdnProvider || 'Direct Origin'}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Check Frequency</span>
            <span className="text-sm font-mono font-semibold text-slate-200">{website.checkIntervalSeconds}s Interval</span>
          </div>
        </div>
      </div>

      {/* SSL Status Card */}
      <SSLBadge daysRemaining={website.sslDaysRemaining} />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('performance')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'performance' ? 'bg-indigo-600 text-white shadow-glow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Performance Telemetry
        </button>
        <button
          onClick={() => setActiveTab('headers')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'headers' ? 'bg-indigo-600 text-white shadow-glow' : 'text-slate-400 hover:text-white'
          }`}
        >
          HTTP Response Headers
        </button>
        <button
          onClick={() => setActiveTab('dns')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'dns' ? 'bg-indigo-600 text-white shadow-glow' : 'text-slate-400 hover:text-white'
          }`}
        >
          DNS & Redirect Path
        </button>
        <button
          onClick={() => setActiveTab('incidents')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'incidents' ? 'bg-indigo-600 text-white shadow-glow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Incident History ({incidents.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'performance' && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white">Historical Latency & TTFB (ms)</h3>
          <ResponseTimeChart checks={checks} />
        </div>
      )}

      {activeTab === 'headers' && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
          <WebsiteHeaderInspector headers={latestCheck?.headers || {}} cdnProvider={website.cdnProvider} />
        </div>
      )}

      {activeTab === 'dns' && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-6 shadow-xl">
          <RedirectChainView redirectChain={latestCheck?.redirectChain || [website.url]} />
        </div>
      )}

      {activeTab === 'incidents' && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
          <IncidentTimeline incidents={incidents} />
        </div>
      )}
    </div>
  );
};
