import React from 'react';
import { motion } from 'framer-motion';

interface Activity {
  id: string;
  name: string;
  role: string;
  period: string;
  highlight: string;
  skills: string;
}

const activities: Activity[] = [
  {
    id: 'jss-films',
    name: 'JSS Photography & Films',
    role: 'Vice-President',
    period: '2026',
    highlight: 'Leading creative media productions & team coordination.',
    skills: 'Creative Direction • Operations • Team Leadership',
  },
  {
    id: 'tedx',
    name: 'TEDxLady Irwin College',
    role: 'Photographer & Operations',
    period: '2025',
    highlight: 'Event visual coverage and networking with speakers.',
    skills: 'Event Visuals • Media Coverage • Networking',
  },
];

export const LeadershipCard: React.FC = () => {
  return (
    <motion.div 
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="bg-white/80 hover:bg-white/90 dark:bg-[#181816]/85 dark:hover:bg-[#20201D]/95 backdrop-blur-2xl rounded-[28px] p-6 sm:p-7 border border-white/70 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1)] dark:hover:shadow-[0_14px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.12)] flex flex-col justify-start h-[340px] relative overflow-hidden group transition-all duration-300 select-none cursor-default"
    >
      {/* Top Header - Clean Unboxed Typography */}
      <div className="mb-3">
        <h3 className="text-xs font-bold text-[#8A8A85] dark:text-[#787872] uppercase tracking-wider">
          Leadership & Roles
        </h3>
      </div>

      {/* Clean Activity Rows */}
      <div className="space-y-4 my-auto">
        {activities.map((act, idx) => (
          <div key={act.id} className="group/item cursor-default">
            <div className="transition-transform duration-200 group-hover/item:translate-x-1">
              <div className="flex items-center justify-between">
                <h4 className="text-[14.5px] font-bold text-[#111111] dark:text-[#F4F4F2] leading-tight">
                  {act.name}
                </h4>
                <span className="text-[11px] font-medium text-[#7A7A75] dark:text-[#787872]">
                  {act.period}
                </span>
              </div>
              
              <p className="text-[12px] font-medium text-[#FF5A1F] mt-0.5">
                {act.role}
              </p>
              
              <p className="text-[11.5px] text-[#555550] dark:text-[#A4A49E] mt-0.5 leading-snug">
                {act.highlight}
              </p>
              
              <p className="text-[10.5px] font-medium text-[#8A8A85] dark:text-[#787872] mt-0.5 tracking-tight truncate">
                {act.skills}
              </p>
            </div>

            {idx === 0 && (
              <div className="mt-3.5 border-b border-neutral-200/60 dark:border-white/10" />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};
