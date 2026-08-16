import React, { useState, useEffect } from 'react';
import { Incident } from '../types';
import { api } from '../services/api';
import { AlertTriangle, CheckCircle2, Clock, Filter, ShieldAlert } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export const IncidentsPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const { addToast } = useNotifications();

  const fetchIncidents = async () => {
    try {
      let query = `/incidents?`;
      if (statusFilter !== 'all') query += `status=${statusFilter}`;
      const res = await api.get(query);
      if (res.data.incidents) setIncidents(res.data.incidents);
    } catch (err) {
      console.error('Error fetching incidents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [statusFilter]);

  const handleResolveIncident = async (incidentId: string) => {
    try {
      await api.patch(`/incidents/${incidentId}/status`, {
        status: 'resolved',
        message: 'Manually marked as resolved by engineering operator.',
      });
      addToast({
        title: 'Incident Resolved',
        message: 'Incident status updated to resolved.',
        type: 'recovered',
      });
      fetchIncidents();
    } catch (err) {
      console.error('Error resolving incident', err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Outage & Incident Logs</h1>
          <p className="text-xs text-slate-400 mt-1">Audit timeline of network failures, DNS drops, and high latency events</p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2">
          {['all', 'investigating', 'identified', 'monitoring', 'resolved'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                statusFilter === tab
                  ? 'bg-indigo-600 text-white shadow-glow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents List */}
      {loading ? (
        <div className="p-8 text-center text-slate-500 animate-pulse">Loading incident logs...</div>
      ) : incidents.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800/80 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Incidents Recorded</h3>
          <p className="text-xs text-slate-400">All monitored services are healthy and operating within threshold.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {incidents.map((incident) => {
            const siteName = typeof incident.websiteId === 'object' ? incident.websiteId.name : 'Target Site';
            const isResolved = incident.status === 'resolved';

            return (
              <div
                key={incident._id}
                className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2.5 rounded-xl mt-0.5 shrink-0 ${
                        isResolved
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                          : 'bg-rose-950 text-rose-400 border border-rose-800/80 animate-pulse'
                      }`}
                    >
                      {isResolved ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-base font-bold text-white">{siteName}</h3>
                        <span
                          className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            isResolved
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800/80'
                              : 'bg-rose-950 text-rose-400 border-rose-800/80'
                          }`}
                        >
                          {incident.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{incident.cause}</p>
                    </div>
                  </div>

                  {!isResolved && (
                    <button
                      onClick={() => handleResolveIncident(incident._id)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-800 transition shrink-0"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>

                {/* Timeline History */}
                <div className="pt-4 border-t border-slate-800/80 space-y-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Incident Timeline</h4>
                  <div className="space-y-2 text-xs font-mono">
                    {incident.timeline.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-slate-300">
                        <span className="text-slate-500 shrink-0">
                          {new Date(step.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="capitalize font-semibold text-indigo-400">[{step.status}]</span>
                        <span>{step.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
