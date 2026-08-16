import React from 'react';
import { ArrowRight, CornerDownRight, CheckCircle } from 'lucide-react';

interface RedirectChainViewProps {
  redirectChain: string[];
}

export const RedirectChainView: React.FC<RedirectChainViewProps> = ({ redirectChain }) => {
  if (!redirectChain || redirectChain.length <= 1) {
    return (
      <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-emerald-400" />
        <span>Direct 200 OK response with 0 intermediate redirects.</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        HTTP Redirect Path ({redirectChain.length - 1} Hop{redirectChain.length > 2 ? 's' : ''})
      </h4>
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 font-mono text-xs">
        {redirectChain.map((url, idx) => (
          <div key={idx} className="flex items-center gap-2 text-slate-300">
            {idx === 0 ? (
              <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 font-bold text-[10px]">ORIGIN</span>
            ) : idx === redirectChain.length - 1 ? (
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px]">TARGET</span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 font-bold text-[10px]">301/302 HOP</span>
            )}
            <span className="truncate">{url}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
