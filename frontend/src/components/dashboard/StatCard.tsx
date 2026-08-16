import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  colorTheme?: 'emerald' | 'indigo' | 'rose' | 'amber';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'neutral',
  colorTheme = 'indigo',
}) => {
  const themeStyles = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 transition shadow-xl relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-white tracking-tight font-mono">{value}</h3>
            {trend && (
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  trendType === 'positive'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                    : trendType === 'negative'
                    ? 'bg-rose-950 text-rose-400 border border-rose-800/60'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {trend}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-400 pt-1">{subtitle}</p>}
        </div>

        <div className={`p-3 rounded-xl border ${themeStyles[colorTheme]} shrink-0 transition group-hover:scale-105`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
