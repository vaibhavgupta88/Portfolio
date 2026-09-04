import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  category: string;
  period: string;
  highlight: string;
  tech: string[];
  liveUrl: string;
  githubUrl: string;
}

const projects: Project[] = [
  {
    id: 'aven',
    name: 'Aven AI',
    category: 'Full-Stack AI Content Generation SaaS',
    period: '2026',
    highlight: 'Full-stack AI content generation SaaS supporting article, image, resume-analysis, and image-editing workflows.',
    tech: ['React 19', 'Express 5', 'PostgreSQL', 'Gemini AI', 'Clerk', 'Stripe'],
    liveUrl: 'https://aven-mu.vercel.app/',
    githubUrl: 'https://github.com/vaibhavgupta88/Aven',
  },
  {
    id: 'rankpilot',
    name: 'Rank Pilot',
    category: 'AI SEO Tracking Engine',
    period: '2026',
    highlight: 'Automated website analysis using Google Gemini API for SEO intelligence and Browserbase for web automation.',
    tech: ['React.js', 'Gemini API', 'Express.js', 'MongoDB', 'Browserbase'],
    liveUrl: 'https://seo-rank-tracker-nu.vercel.app/',
    githubUrl: 'https://github.com/vaibhavgupta88/SEO_rank_tracker',
  },
  {
    id: 'jeevansetu',
    name: 'JeevanSetu',
    category: 'Disaster Preparedness Platform • SIH 2025',
    period: '2025',
    highlight: 'Real-time disaster response system for schools with interactive maps, emergency alerts, and AI assistance.',
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Maps API'],
    liveUrl: 'https://github.com/vaibhavgupta88',
    githubUrl: 'https://github.com/vaibhavgupta88',
  },
];

export const ExperienceCard: React.FC = () => {
  return (
    <motion.div 
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="bg-white/80 hover:bg-white/90 backdrop-blur-2xl rounded-[28px] p-6 sm:p-7 border border-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1)] flex flex-col justify-between h-full min-h-[340px] relative overflow-hidden group transition-all duration-300 select-none cursor-default"
    >
      {/* Top Header - Clean Unboxed Typography */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-[#8A8A85] uppercase tracking-wider">
          Featured Projects
        </h3>
        <span className="text-[11px] font-medium text-[#A0A09A]">
          Flagship Works
        </span>
      </div>

      {/* Clean Divided Project List */}
      <div className="space-y-3.5 my-auto">
        {projects.map((proj, idx) => (
          <div key={proj.id} className="group/item cursor-default">
            <div className="transition-transform duration-200 group-hover/item:translate-x-1">
              
              {/* Line 1: Title + Links + Year */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[15.5px] font-bold text-[#111111] group-hover/item:text-[#FF5A1F] transition-colors leading-tight"
                  >
                    <span>{proj.name}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#FF5A1F] transition-transform duration-200 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5" />
                  </a>

                  {/* Minimal GitHub Link */}
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 hover:bg-white text-[10.5px] font-medium text-[#555550] hover:text-[#111111] border border-[#E0E0DC] shadow-2xs transition-colors ml-1"
                    title="View Source on GitHub"
                  >
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    <span>GitHub</span>
                  </a>
                </div>

                <span className="text-[11px] font-medium text-[#7A7A75]">
                  {proj.period}
                </span>
              </div>

              {/* Line 2: Category */}
              <p className="text-[12px] font-medium text-[#FF5A1F] mt-0.5">
                {proj.category}
              </p>

              {/* Line 3: Description */}
              <p className="text-[11.5px] text-[#555550] mt-0.5 leading-snug">
                {proj.highlight}
              </p>

              {/* Line 4: Clean Non-Boxed Technologies List */}
              <p className="text-[11px] font-medium text-[#8A8A85] mt-1 tracking-tight">
                {proj.tech.join(' • ')}
              </p>
            </div>

            {idx < projects.length - 1 && (
              <div className="mt-3 border-b border-neutral-200/50" />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};
