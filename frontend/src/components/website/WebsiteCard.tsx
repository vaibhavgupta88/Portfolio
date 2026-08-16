import React, { useState } from 'react';
import { Website } from '../../types';
import { Link } from 'react-router-dom';
import {
  Globe,
  Play,
  Pause,
  RefreshCw,
  Trash2,
  ExternalLink,
  Shield,
  Zap,
} from 'lucide-react';
import { api } from '../../services/api';

interface WebsiteCardProps {
  website: Website;
  onRefresh: () => void;
}

export const WebsiteCard: React.FC<WebsiteCardProps> = ({ website, onRefresh }) => {
  const [checking, setChecking] = useState(false);

  const handleTogglePause = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await api.patch(`/websites/${website._id}/toggle-pause`);
      onRefresh();
    } catch (err) {
      console.error('Error toggling pause status', err);
    }
  };

  const handleManualCheck = async (e: React.MouseEvent) => {
    e.preventDefault();
    setChecking(true);
    try {
      await api.post(`/websites/${website._id}/check-now`);
      onRefresh();
    } catch (err) {
      console.error('Error running manual check', err);
    } finally {
      setChecking(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!window.confirm(`Are you sure you want to remove ${website.name} from monitoring?`)) return;
    try {
      await api.delete(`/websites/${website._id}`);
      onRefresh();
    } catch (err) {
      console.error('Error deleting website', err);
    }
  };

  const statusStyles = {
    up: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80',
    down: 'bg-rose-950/80 text-rose-400 border-rose-800/80 animate-pulse',
    degraded: 'bg-amber-950/80 text-amber-400 border-amber-800/80',
    unknown: 'bg-slate-900 text-slate-400 border-slate-800',
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 transition shadow-xl space-y-4 relative group">
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="min-w-0">
            <Link
              to={`/websites/${website._id}`}
              className="font-bold text-base text-white hover:text-indigo-400 transition truncate block"
            >
              {website.name}
            </Link>
            <a
              href={website.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 truncate"
            >
              <span className="truncate">{website.url}</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border ${
            website.isPaused ? 'bg-slate-800 text-slate-400 border-slate-700' : statusStyles[website.lastCheckStatus || 'unknown']
          }`}
        >
          {website.isPaused ? 'PAUSED' : website.lastCheckStatus}
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-950/40 rounded-xl border border-slate-800/50 text-xs">
        <div>
          <span className="text-[11px] text-slate-400 block">Uptime</span>
          <span className="font-mono font-bold text-emerald-400">{website.uptimePercentage}%</span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 block">Latency</span>
          <span className="font-mono font-bold text-white">
            {website.lastResponseTimeMs ? `${website.lastResponseTimeMs}ms` : '--'}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 block">SSL Expiry</span>
          <span className="font-mono font-bold text-indigo-300">
            {website.sslDaysRemaining !== undefined ? `${website.sslDaysRemaining} days` : 'N/A'}
          </span>
        </div>
      </div>

      {/* Tags & Provider info */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 flex-wrap">
          {website.tags && website.tags.length > 0 ? (
            website.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                #{tag}
              </span>
            ))
          ) : (
            <span className="text-[11px] text-slate-400">{website.cdnProvider || 'Standard Origin'}</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleManualCheck}
            disabled={checking || website.isPaused}
            title="Check Now"
            className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleTogglePause}
            title={website.isPaused ? 'Resume Monitoring' : 'Pause Monitoring'}
            className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            {website.isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          <button
            onClick={handleDelete}
            title="Delete Website"
            className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-rose-400 hover:bg-rose-950/40 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
