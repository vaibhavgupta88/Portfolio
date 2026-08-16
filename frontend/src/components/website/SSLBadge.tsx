import React from 'react';
import { ShieldCheck, ShieldAlert, Calendar } from 'lucide-react';

interface SSLBadgeProps {
  daysRemaining?: number;
}

export const SSLBadge: React.FC<SSLBadgeProps> = ({ daysRemaining }) => {
  if (daysRemaining === undefined) {
    return (
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-slate-500" />
        <span>SSL Certificate status unavailable (HTTP or unverified)</span>
      </div>
    );
  }

  const isCritical = daysRemaining <= 7;
  const isWarning = daysRemaining <= 30;

  return (
    <div
      className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
        isCritical
          ? 'bg-rose-950/40 border-rose-800/80 text-rose-200'
          : isWarning
          ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
          : 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-slate-900/80 shrink-0">
          {isCritical || isWarning ? (
            <ShieldAlert className={`w-5 h-5 ${isCritical ? 'text-rose-400' : 'text-amber-400'}`} />
          ) : (
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          )}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">SSL/TLS Security Certificate</h4>
          <p className="text-xs opacity-90 mt-0.5">
            {isCritical
              ? 'Certificate expires imminently. Urgent renewal required!'
              : isWarning
              ? 'Certificate expires soon. Plan renewal shortly.'
              : 'Certificate is valid with high security score.'}
          </p>
        </div>
      </div>

      <div className="text-right shrink-0">
        <span className="text-2xl font-bold font-mono block">{daysRemaining} Days</span>
        <span className="text-[11px] opacity-75 uppercase tracking-wider font-semibold">Remaining</span>
      </div>
    </div>
  );
};
