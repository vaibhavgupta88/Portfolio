import React from 'react';
import { motion } from 'framer-motion';

interface SkillGroup {
  index: string;
  category: string;
  description: string;
  skills: { name: string; highlight?: boolean }[];
}

const skillGroups: SkillGroup[] = [
  {
    index: '01',
    category: 'Languages & Core Systems',
    description: 'Algorithmic foundations & data structures',
    skills: [
      { name: 'C++', highlight: true },
      { name: 'JavaScript (ES6+)', highlight: true },
      { name: 'C' },
      { name: 'SQL' },
      { name: 'Data Structures & Algorithms', highlight: true },
      { name: 'OOP' },
      { name: 'DBMS' },
    ],
  },
  {
    index: '02',
    category: 'Frontend Engineering',
    description: 'Pixel-perfect, fluid, accessible interfaces',
    skills: [
      { name: 'React.js', highlight: true },
      { name: 'Tailwind CSS', highlight: true },
      { name: 'Framer Motion' },
      { name: 'Responsive Web Design' },
      { name: 'HTML5 & CSS3' },
      { name: 'State Management' },
    ],
  },
  {
    index: '03',
    category: 'Backend & Data Architecture',
    description: 'Scalable REST APIs & document/relational databases',
    skills: [
      { name: 'Node.js', highlight: true },
      { name: 'Express.js', highlight: true },
      { name: 'MongoDB', highlight: true },
      { name: 'MySQL' },
      { name: 'RESTful Architecture' },
      { name: 'JWT Authentication' },
    ],
  },
  {
    index: '04',
    category: 'AI Systems & Toolchain',
    description: 'LLM integrations, automation & workflows',
    skills: [
      { name: 'Google Gemini API', highlight: true },
      { name: 'Browserbase', highlight: true },
      { name: 'Git & GitHub' },
      { name: 'Postman' },
      { name: 'Vite' },
    ],
  },
];

export const TechnicalSkillsSection: React.FC = () => {
  return (
    <section className="px-2 sm:px-4 max-w-5xl mx-auto w-full pt-14 pb-12">
      {/* Section Editorial Header - Clean Unboxed Typography */}
      <div className="mb-10 pb-6 border-b border-[#E8E8E4]/70 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold text-[#8A8A85] uppercase tracking-wider mb-2">
            Technical Expertise
          </h3>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight leading-tight">
            Tools, technologies & engineering foundations.
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-[#7A7A75] max-w-sm font-normal md:text-right">
          A disciplined engineering foundation spanning systems programming, scalable full-stack MERN engineering, and LLM automation.
        </p>
      </div>

      {/* Clean Flowing Typographic Rows */}
      <div className="space-y-8 sm:space-y-10">
        {skillGroups.map((group, idx) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start pb-8 border-b border-[#ECECE8]/60 last:border-b-0"
          >
            {/* Left Category Column */}
            <div className="md:col-span-4 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#A0A09A]">
                  {group.index}
                </span>
                <span className="text-xs font-medium text-[#8A8A85]">
                  / CATEGORY
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-[#111111] tracking-tight">
                {group.category}
              </h3>
              
              <p className="text-xs text-[#7A7A75] font-normal leading-relaxed">
                {group.description}
              </p>
            </div>

            {/* Right Flowing Badges Column */}
            <div className="md:col-span-8 flex flex-wrap gap-2 sm:gap-2.5 pt-0.5">
              {group.skills.map((skill) => (
                <motion.div
                  key={skill.name}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 cursor-default select-none shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${
                    skill.highlight
                      ? 'bg-white/90 hover:bg-white text-[#111111] border border-white hover:border-[#FF5A1F]/40 shadow-xs'
                      : 'bg-white/65 hover:bg-white/90 text-[#3A3A36] border border-white/60'
                  }`}
                >
                  <span 
                    className={`w-1.5 h-1.5 rounded-full ${
                      skill.highlight ? 'bg-[#FF5A1F]' : 'bg-[#C5C5BF]'
                    }`} 
                  />
                  <span>{skill.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
