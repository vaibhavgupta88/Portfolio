import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const GrainySpotlightBackground: React.FC = () => {
  // Smooth spring-dampened mouse spotlight tracker
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. Static Master Top Studio Spotlight (Gentle gallery overhead light) */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 235, 220, 0.35) 45%, rgba(246, 246, 244, 0) 80%)',
        }}
      />

      {/* 2. Slow Breathing Ambient Aura in Header & Hero */}
      <motion.div
        animate={{
          opacity: [0.35, 0.55, 0.35],
          scale: [0.98, 1.03, 0.98],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full blur-[100px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 90, 31, 0.07) 0%, rgba(255, 180, 120, 0.03) 50%, transparent 75%)',
        }}
      />

      {/* 3. Interactive Cursor-Following Soft Ambient Glow */}
      <motion.div
        className="fixed w-[600px] h-[600px] -ml-[300px] -mt-[300px] rounded-full blur-[90px] pointer-events-none hidden md:block"
        style={{
          x: smoothX,
          y: smoothY,
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.75) 0%, rgba(255, 110, 50, 0.04) 40%, transparent 70%)',
        }}
      />

      {/* 4. Ultra-Fine Studio Film Grain (3.5% Opacity - Pristine, Tactile, Non-intrusive) */}
      <div 
        className="fixed inset-0 w-full h-full opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='fineNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23fineNoise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  );
};
