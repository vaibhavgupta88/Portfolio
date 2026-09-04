import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight } from 'lucide-react';

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
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/25 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="absolute top-0 right-0 bottom-0 w-full max-w-sm bg-[#FAFAF8] p-7 sm:p-8 shadow-2xl flex flex-col justify-between border-l border-[#EBEBE6] z-10 overflow-y-auto"
          >
            {/* Top Section */}
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-[#ECECE8]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-bold font-mono">
                    VG
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#111111] leading-tight">Vaibhav Gupta</h4>
                    <p className="text-[12px] text-[#8A8A85]">Software Engineer</p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  aria-label="Close navigation menu"
                  className="w-9 h-9 rounded-full bg-white border border-[#E8E8E4] flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Minimalist Live Status */}
              <div className="flex items-center gap-2 text-xs font-medium text-[#444440] my-5 px-1">
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
                    className="group flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white text-[#111111] hover:text-[#FF5A1F] transition-all border border-transparent hover:border-[#EAEAE6]"
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
            <div className="pt-6 border-t border-[#ECECE8] space-y-3">
              <button
                onClick={() => {
                  onClose();
                  onBookCall();
                }}
                className="w-full py-3 px-5 rounded-full bg-[#111111] hover:bg-neutral-800 text-white font-medium text-xs shadow-sm transition-all"
              >
                Send a Message
              </button>

              <div className="flex items-center justify-between text-[11px] text-[#9A9A94] px-1">
                <span>Noida, UP, India</span>
                <span>vaibhav0878gupta@gmail.com</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
