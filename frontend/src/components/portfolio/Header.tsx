import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  onOpenMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMenu }) => {
  const { theme, toggleTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  const email = 'vaibhav0878gupta@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <header className="relative flex items-center justify-between py-5 px-2 sm:px-4 max-w-5xl mx-auto w-full z-20">
      {/* Left: Unified Frosted Glass Email & Monogram Capsule */}
      <motion.button
        onClick={handleCopyEmail}
        whileHover={{ scale: 1.01, y: -1 }}
        whileTap={{ scale: 0.98 }}
        className="group relative inline-flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-full bg-white/80 hover:bg-white/95 dark:bg-[#181816]/80 dark:hover:bg-[#20201D] backdrop-blur-2xl border border-white/70 dark:border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-200 focus:outline-none cursor-pointer select-none"
        title="Click to copy email address"
      >
        {/* Monogram Badge */}
        <div className="w-7 h-7 rounded-full bg-[#111111] dark:bg-white text-white dark:text-[#111111] flex items-center justify-center font-bold text-[11px] font-mono tracking-tight shadow-xs group-hover:bg-[#FF5A1F] dark:group-hover:bg-[#FF5A1F] dark:group-hover:text-white transition-colors duration-200 flex-shrink-0">
          VG
        </div>

        {/* Email Address Text */}
        <span className="text-[13.5px] sm:text-[14px] font-semibold text-[#1F1F1E] dark:text-[#F0F0EC] group-hover:text-[#111111] dark:group-hover:text-white tracking-tight">
          {email}
        </span>

        {/* Copy / Check Status Icon */}
        <div className="text-neutral-400 dark:text-neutral-500 group-hover:text-[#111111] dark:group-hover:text-white transition-colors pl-0.5">
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
          ) : (
            <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
          )}
        </div>

        {/* Floating Toast Notification on Copy */}
        <AnimatePresence>
          {copied && (
            <motion.span
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="absolute left-1/2 -translate-x-1/2 -bottom-9 bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-[11.5px] font-medium px-3 py-1 rounded-full shadow-lg z-50 whitespace-nowrap flex items-center gap-1.5 pointer-events-none"
            >
              <Check className="w-3 h-3 text-emerald-400 dark:text-emerald-600" />
              Copied to clipboard
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Right: Actions Container */}
      <div className="flex items-center gap-2.5">
        {/* Dark / Light Mode Toggle Button */}
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="w-10 h-10 rounded-full bg-white/80 hover:bg-white dark:bg-[#181816]/80 dark:hover:bg-[#20201D] backdrop-blur-2xl border border-white/70 dark:border-white/10 flex items-center justify-center text-[#111111] dark:text-[#F4F4F2] shadow-[0_4px_16px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.06)] hover:shadow-md transition-all duration-200 focus:outline-none cursor-pointer"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200" />
          ) : (
            <Moon className="w-4 h-4 text-[#555550] transition-transform duration-200" />
          )}
        </motion.button>

        {/* Symmetrical Glassmorphic Menu Button */}
        <motion.button
          onClick={onOpenMenu}
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle navigation menu"
          className="w-10 h-10 rounded-full bg-white/80 hover:bg-white dark:bg-[#181816]/80 dark:hover:bg-[#20201D] backdrop-blur-2xl border border-white/70 dark:border-white/10 flex flex-col items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.06)] hover:shadow-md transition-all duration-200 focus:outline-none cursor-pointer"
        >
          <span className="w-4 h-[1.75px] bg-[#111111] dark:bg-[#F4F4F2] rounded-full transition-transform" />
          <span className="w-4 h-[1.75px] bg-[#111111] dark:bg-[#F4F4F2] rounded-full transition-transform" />
        </motion.button>
      </div>
    </header>
  );
};
