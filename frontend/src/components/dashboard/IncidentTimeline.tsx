import React from 'react';
import { Incident } from '../../types';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface IncidentTimelineProps {
  incidents: Incident[];
}

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({ incidents }) => {
  if (incidents.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800/80">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-white">All Systems Operational</h4>
        <p className="text-xs text-slate-400 mt-1">No active network outages or latency degradation detected.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {incidents.map((incident) => {
        const websiteName = typeof incident.websiteId === 'object' ? incident.websiteId.name : 'Monitored Site';
        const isResolved = incident.status === 'resolved';

        return (
          <div
            key={incident._id}
            className={`p-4 rounded-xl border transition flex items-start justify-between gap-4 ${
              isResolved
                ? 'bg-slate-900/40 border-slate-800/80 text-slate-300'
                : 'bg-rose-950/20 border-rose-800/40 text-rose-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${isResolved ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' : 'bg-rose-950 text-rose-400 border border-rose-800/60'}`}>
                {isResolved ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-white">{websiteName}</span>
                  <span
                    className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
                      isResolved
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                        : 'bg-rose-950 text-rose-400 border border-rose-800/60'
                    }`}
                  >
                    {incident.status}
                  </span>
                </div>
                <p className="text-xs opacity-90">{incident.cause}</p>
                <div className="flex items-center gap-3 text-[11px] opacity-75 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Started: {new Date(incident.startedAt).toLocaleTimeString()}
                  </span>
                  {incident.resolvedAt && (
                    <span>Resolved: {new Date(incident.resolvedAt).toLocaleTimeString()}</span>
                  )}
                </div>
              </div>
            </div>

            <Link
              to="/incidents"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 whitespace-nowrap"
            >
              View details &rarr;
            </Link>
          </div>
        );
      })}
    </div>
  );
};
