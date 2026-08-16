import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { RegionNode } from '../../types';
import { ShieldCheck, Activity, Clock, AlertTriangle } from 'lucide-react';

interface GlobalMapProps {
  regions: RegionNode[];
}

// Create custom colored circle marker icons using L.divIcon
const createCustomIcon = (status: 'healthy' | 'degraded' | 'down') => {
  const colorClass =
    status === 'healthy'
      ? 'bg-emerald-500 shadow-[0_0_15px_#10b981] border-emerald-300'
      : status === 'degraded'
      ? 'bg-amber-500 shadow-[0_0_15px_#f59e0b] border-amber-300'
      : 'bg-rose-500 shadow-[0_0_15px_#f43f5e] border-rose-300';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div className="relative flex items-center justify-center">
      <div className="w-5 h-5 rounded-full ${colorClass} border-2 animate-pulse"></div>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export const GlobalMap: React.FC<GlobalMapProps> = ({ regions }) => {
  return (
    <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl relative">
      <MapContainer
        center={[20, 10]}
        zoom={2}
        scrollWheelZoom={true}
        className="w-full h-full"
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {regions.map((node) => (
          <Marker
            key={node.id}
            position={[node.lat, node.lng]}
            icon={createCustomIcon(node.status)}
          >
            <Popup className="custom-leaflet-popup min-w-[240px]">
              <div className="p-1 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/60">
                      {node.code}
                    </span>
                    <h3 className="font-bold text-sm text-white">{node.name}</h3>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" /> Average Latency:
                    </span>
                    <span className="font-mono font-semibold text-emerald-400">{node.latencyMs} ms</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Status:
                    </span>
                    <span
                      className={`font-semibold capitalize px-2 py-0.5 rounded text-[10px] ${
                        node.status === 'healthy'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                          : node.status === 'degraded'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800/60'
                          : 'bg-rose-950 text-rose-400 border border-rose-800/60'
                      }`}
                    >
                      {node.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Monitored Targets:
                    </span>
                    <span className="font-mono text-slate-200">{node.totalMonitored} active</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-400" /> Probe Operational
                  </span>
                  <span className="text-emerald-400 font-semibold">100% Sync</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
