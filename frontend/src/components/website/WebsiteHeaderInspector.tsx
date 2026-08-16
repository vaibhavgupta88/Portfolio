import React from 'react';
import { ShieldCheck, Server, Cpu } from 'lucide-react';

interface WebsiteHeaderInspectorProps {
  headers: Record<string, string>;
  cdnProvider?: string;
}

export const WebsiteHeaderInspector: React.FC<WebsiteHeaderInspectorProps> = ({ headers, cdnProvider }) => {
  const headerEntries = Object.entries(headers || {});

  return (
    <div className="space-y-4">
      {/* CDN & Server Provider summary card */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Detected CDN / Edge Layer</span>
            <span className="text-sm font-semibold text-white">{cdnProvider || 'Direct Origin / Uncached'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Server Header</span>
            <span className="text-sm font-mono font-semibold text-emerald-400">
              {headers?.['server'] || headers?.['Server'] || 'Standard Node / Nginx'}
            </span>
          </div>
        </div>
      </div>

      {/* Header table */}
      <div className="rounded-xl border border-slate-800/80 overflow-hidden bg-slate-950/40">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
            <tr>
              <th className="px-4 py-3">Header Key</th>
              <th className="px-4 py-3">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
            {headerEntries.length > 0 ? (
              headerEntries.map(([key, val]) => (
                <tr key={key} className="hover:bg-slate-900/40 transition">
                  <td className="px-4 py-2.5 text-indigo-300 font-semibold">{key}</td>
                  <td className="px-4 py-2.5 break-all opacity-90">{val}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="px-4 py-6 text-center text-slate-500 font-sans">
                  No response headers recorded for latest check.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
