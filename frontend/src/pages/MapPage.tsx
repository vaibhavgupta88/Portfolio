import React, { useState, useEffect } from 'react';
import { GlobalMap } from '../components/map/GlobalMap';
import { RegionNode } from '../types';
import { api } from '../services/api';
import { Globe, Activity, ShieldCheck, RefreshCw } from 'lucide-react';

export const MapPage: React.FC = () => {
  const [regions, setRegions] = useState<RegionNode[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRegions = async () => {
    try {
      const res = await api.get('/monitoring/dashboard-stats');
      if (res.data.regions) setRegions(res.data.regions);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Global Network Resilience Map</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time status of multi-region edge monitoring nodes</p>
        </div>

        <button
          onClick={fetchRegions}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition"
        >
          <RefreshCw className="w-4 h-4 text-indigo-400" />
          <span>Refresh Map Signals</span>
        </button>
      </div>

      {/* Map Container */}
      {loading ? (
        <div className="w-full h-[550px] bg-slate-900 rounded-2xl border border-slate-800 animate-pulse flex items-center justify-center text-slate-500">
          Loading Global Latency Telemetry...
        </div>
      ) : (
        <GlobalMap regions={regions} />
      )}

      {/* Region Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
        {regions.map((node) => (
          <div
            key={node.id}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/60">
                {node.code}
              </span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                {node.status}
              </span>
            </div>
            <h4 className="font-semibold text-sm text-white truncate">{node.name}</h4>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
              <span>Avg Latency:</span>
              <span className="font-mono font-bold text-emerald-400">{node.latencyMs} ms</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
