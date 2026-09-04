import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const ReadingCard: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white/80 hover:bg-white/90 dark:bg-[#181816]/85 dark:hover:bg-[#20201D]/95 backdrop-blur-2xl rounded-[28px] p-6 sm:p-7 pb-0 border border-white/70 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1)] dark:hover:shadow-[0_14px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.12)] flex flex-col justify-between h-[340px] relative overflow-hidden group transition-all duration-300 select-none cursor-default"
    >
      {/* Top Header - Clean Unboxed Typography */}
      <div>
        <div className="mb-3">
          <h3 className="text-xs font-bold text-[#8A8A85] dark:text-[#787872] uppercase tracking-wider">
            What I'm reading
          </h3>
        </div>

        {/* Book Title & Author */}
        <div className="space-y-0.5">
          <h4 className="text-[15.5px] font-bold text-[#111111] dark:text-[#F4F4F2] leading-tight">
            As A Man Thinketh
          </h4>
          <p className="text-[12px] text-[#8A8A85] dark:text-[#787872] font-medium">
            James Allen • Mindset & Philosophy
          </p>
        </div>
      </div>

      {/* Book Cover Shifted Downwards & Anchored at Bottom Edge */}
      <div className="relative w-full flex-1 flex items-end justify-center overflow-hidden -mb-1 pt-4">
        <motion.div
          animate={isHovered ? { y: 16, scale: 1.02 } : { y: 32, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-36 sm:w-40 h-44 sm:h-48 rounded-t-xl overflow-hidden shadow-[0_-12px_35px_rgba(0,0,0,0.18)] border-t border-x border-neutral-300/40"
        >
          {/* Book Cover Image: B&W by default, reveals color on hover */}
          <img 
            src="/as_a_man_thinketh.jpg" 
            alt="As A Man Thinketh by James Allen" 
            className={`w-full h-full object-cover object-top transition-all duration-500 ease-out ${
              isHovered 
                ? 'grayscale-0 contrast-100 brightness-100' 
                : 'grayscale contrast-105 brightness-95'
            }`}
          />

          {/* Left Spine Realistic Depth Shadow */}
          <div className="absolute top-0 bottom-0 left-0 w-3.5 bg-gradient-to-r from-black/35 via-black/10 to-transparent pointer-events-none" />
          
          {/* Right Page Edge Sheen */}
          <div className="absolute top-0 bottom-0 right-0 w-1.5 bg-gradient-to-l from-white/30 to-transparent pointer-events-none" />

          {/* Top Page Trim Shadow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        </motion.div>
      </div>
    </motion.div>
  );
};
