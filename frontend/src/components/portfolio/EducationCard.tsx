import React from 'react';
import { motion } from 'framer-motion';

const coursework = [
  'Data Structures & Algorithms',
  'Database Management Systems (DBMS)',
  'Object-Oriented Programming (OOP)',
  'Operating Systems & Networks',
];

export const EducationCard: React.FC = () => {
  return (
    <motion.div 
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="bg-white/80 hover:bg-white/90 dark:bg-[#181816]/85 dark:hover:bg-[#20201D]/95 backdrop-blur-2xl rounded-[28px] p-6 sm:p-7 border border-white/70 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1)] dark:hover:shadow-[0_14px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.12)] flex flex-col justify-between h-[340px] relative overflow-hidden group transition-all duration-300 select-none cursor-default"
    >
      {/* Top Header - Clean Unboxed Typography */}
      <div className="mb-2">
        <h3 className="text-xs font-bold text-[#8A8A85] dark:text-[#787872] uppercase tracking-wider">
          Education
        </h3>
      </div>

      {/* Main University Block */}
      <div className="my-auto space-y-3.5">
        <div>
          <div className="flex items-center justify-between">
            <h4 className="text-[15.5px] font-bold text-[#111111] dark:text-[#F4F4F2] leading-tight">
              JSSATE Noida
            </h4>
            <span className="text-[11px] font-medium text-[#7A7A75] dark:text-[#787872]">
              2023 – 2027
            </span>
          </div>

          <p className="text-[12.5px] font-semibold text-[#FF5A1F] mt-0.5">
            B.Tech in Information Technology
          </p>

          <p className="text-[11.5px] font-medium text-[#555550] dark:text-[#A4A49E] mt-0.5">
            Cumulative GPA: <span className="font-bold text-[#111111] dark:text-[#F4F4F2]">7.91</span> / 10.0
          </p>
        </div>

        {/* Bulleted Relevant Coursework Section */}
        <div className="pt-2.5 border-t border-neutral-200/50 dark:border-white/10">
          <span className="text-[10px] font-bold text-[#8A8A85] dark:text-[#787872] uppercase tracking-wider block mb-2">
            Core Coursework
          </span>
          <ul className="space-y-1.5 text-[11.5px] text-[#444440] dark:text-[#C5C5BF]">
            {coursework.map((course) => (
              <li key={course} className="flex items-center gap-2 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F] flex-shrink-0" />
                <span className="leading-snug">{course}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};
