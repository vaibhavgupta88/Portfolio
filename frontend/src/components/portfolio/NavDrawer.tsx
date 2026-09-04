import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onBookCall: () => void;
}

const navLinks = [
  { label: 'Aven AI', sublabel: 'AI Content Generation SaaS (2026)', href: 'https://aven-mu.vercel.app/', external: true },
  { label: 'Rank Pilot', sublabel: 'AI SEO Tracking Engine (2026)', href: 'https://seo-rank-tracker-nu.vercel.app/', external: true },
  { label: 'LeetCode', sublabel: '200+ Problems Solved in C++', href: 'https://leetcode.com/u/vaibhavgupta88/', external: true },
  { label: 'GitHub', sublabel: 'Open Source Repositories', href: 'https://github.com/vaibhavgupta88', external: true },
  { label: 'LinkedIn', sublabel: 'Connect & Work History', href: 'https://www.linkedin.com/in/vaibhavgupta88/', external: true },
];

export const NavDrawer: React.FC<NavDrawerProps> = ({ isOpen, onClose, onBookCall }) => {
  const { theme, toggleTheme } = useTheme();

  // Ensure body scroll is always free and never trapped
  useEffect(() => {
    document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-hidden"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            key="nav-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10"
          />

          {/* Drawer Panel */}
          <motion.div
            key="nav-drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-0 right-0 bottom-0 w-full max-w-sm bg-[#FAFAF8] dark:bg-[#141412] p-7 sm:p-8 shadow-2xl flex flex-col justify-between border-l border-[#EBEBE6] dark:border-white/10 z-20 overflow-y-auto"
          >
            {/* Top Section */}
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-[#ECECE8] dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#111111] dark:bg-white text-white dark:text-[#111111] flex items-center justify-center text-xs font-bold font-mono">
                    VG
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#111111] dark:text-[#F4F4F2] leading-tight">Vaibhav Gupta</h4>
                    <p className="text-[12px] text-[#8A8A85]">Software Engineer</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Theme Switcher Button */}
                  <button
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    className="w-9 h-9 rounded-full bg-white dark:bg-[#1E1E1B] border border-[#E8E8E4] dark:border-white/10 flex items-center justify-center text-[#111111] dark:text-[#F4F4F2] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Moon className="w-4 h-4 text-[#555550]" />
                    )}
                  </button>

                  <button
                    onClick={onClose}
                    aria-label="Close navigation menu"
                    className="w-9 h-9 rounded-full bg-white dark:bg-[#1E1E1B] border border-[#E8E8E4] dark:border-white/10 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Minimalist Live Status */}
              <div className="flex items-center gap-2 text-xs font-medium text-[#444440] dark:text-[#A8A8A0] my-5 px-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Available for full-time & intern SDE roles</span>
              </div>

              {/* Minimal Navigation List */}
              <div className="space-y-1 pt-2">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => {
                      if (!link.external) onClose();
                    }}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="group flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white dark:hover:bg-white/[0.06] text-[#111111] dark:text-[#EAEAE6] hover:text-[#FF5A1F] dark:hover:text-[#FF5A1F] transition-all border border-transparent hover:border-[#EAEAE6] dark:hover:border-white/10"
                  >
                    <div>
                      <div className="text-sm font-semibold leading-tight">{link.label}</div>
                      <div className="text-[11.5px] text-[#8A8A85] mt-0.5 font-normal">
                        {link.sublabel}
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 opacity-35 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[#FF5A1F]" />
                  </a>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-[#ECECE8] dark:border-white/10 space-y-3">
              <button
                onClick={() => {
                  onClose();
                  onBookCall();
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] font-medium text-xs hover:bg-[#FF5A1F] dark:hover:bg-[#FF5A1F] dark:hover:text-white transition-colors cursor-pointer shadow-sm"
              >
                Book a 15-min Call
              </button>
              
              <div className="flex items-center justify-between text-[11px] text-[#8A8A85] px-1">
                <span>Noida, UP • UTC+5:30</span>
                <span className="text-[#111111] dark:text-[#F4F4F2] font-medium">Vaibhav Gupta</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
