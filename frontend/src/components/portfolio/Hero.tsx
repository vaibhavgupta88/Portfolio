import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onBookCall: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookCall }) => {
  const [isIntro, setIsIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIntro(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative pt-8 pb-12 px-2 sm:px-4 max-w-5xl mx-auto w-full">
      {/* Full-Screen Splash Overlay that fades away as 'Hi' glides into position */}
      <AnimatePresence>
        {isIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-[#F6F6F4] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Main Headline */}
      <div className="space-y-1 sm:space-y-2 mb-10">
        {/* Line 1: Hi, I'm [Avatar] Vaibhav Gupta! */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-4xl sm:text-5xl md:text-[54px] font-extrabold tracking-[-0.03em] text-[#111111] leading-tight min-h-[64px]">
          
          {/* Morphing "Hi," that starts full-screen and glides to this exact location */}
          {isIntro ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <motion.span
                layoutId="hero-greeting-hi"
                transition={{
                  duration: 0.85,
                  ease: [0.16, 1, 0.3, 1], // Apple quintic deceleration
                }}
                className="text-7xl sm:text-8xl md:text-9xl font-extrabold tracking-[-0.04em] text-[#111111]"
              >
                Hi,
              </motion.span>
            </div>
          ) : (
            <motion.span
              layoutId="hero-greeting-hi"
              transition={{
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block"
            >
              Hi,
            </motion.span>
          )}

          {/* Rest of the Line reveals as 'Hi,' settles */}
          <motion.div
            initial={{ opacity: 0, x: -12, filter: 'blur(4px)' }}
            animate={!isIntro ? { opacity: 1, x: 0, filter: 'blur(0px)' } : { opacity: 0, x: -12, filter: 'blur(4px)' }}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-x-3 gap-y-2 flex-wrap"
          >
            <span>I’m</span>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center justify-center -translate-y-1 cursor-pointer"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-[18px] sm:rounded-[22px] overflow-hidden border-2 border-white shadow-[0_8px_20px_rgba(0,0,0,0.12)] bg-[#1e1e1e] flex-shrink-0">
                <img 
                  src="/assets/vaibhav_avatar.jpg" 
                  alt="Vaibhav Gupta" 
                  className="w-full h-full object-cover object-top filter grayscale contrast-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/avatar.jpg';
                  }}
                />
              </div>
            </motion.div>

            <span>Vaibhav Gupta!</span>
          </motion.div>
        </div>

        {/* Line 2: I'm a Software Engineer building */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={!isIntro ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl md:text-[54px] font-extrabold tracking-[-0.03em] leading-tight"
        >
          <span className="text-[#A3A39E] font-medium mr-3">I’m a</span>
          <span className="text-[#111111] font-extrabold mr-3">Software Engineer</span>
          <span className="text-[#A3A39E] font-medium">building</span>
        </motion.div>

        {/* Line 3: Full-Stack & AI Systems. + Open to work badge */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={!isIntro ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center gap-x-4 gap-y-2.5 pt-1"
        >
          <span className="text-4xl sm:text-5xl md:text-[54px] font-extrabold tracking-[-0.03em] text-[#FF5A1F] leading-tight">
            Full-Stack & AI Systems.
          </span>

          {/* Open to work pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAEAE5] border border-[#DDDCD6] text-xs sm:text-[13px] font-semibold text-[#222222] shadow-[0_1px_3px_rgba(0,0,0,0.03)] select-none translate-y-0.5 sm:translate-y-1">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="tracking-tight leading-none">Open to work</span>
          </div>
        </motion.div>
      </div>

      {/* Action CTA & Bio Subtext */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={!isIntro ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8 pt-2"
      >
        <motion.button
          onClick={onBookCall}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="bg-[#111111] text-white px-7 py-3.5 rounded-full text-[15px] font-medium shadow-[0_4px_14px_rgba(0,0,0,0.18)] hover:bg-[#222222] hover:shadow-[0_6px_20px_rgba(0,0,0,0.22)] transition-all flex items-center justify-center flex-shrink-0 gap-2"
        >
          <span>Send a message</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        <p className="text-[15px] leading-relaxed text-[#444444] max-w-lg font-normal">
          Turning complex logic into fast, scalable, and beautifully engineered digital products. Feel free to explore my work below — I’d love to connect!
        </p>
      </motion.div>
    </section>
  );
};
