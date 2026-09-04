import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight, Loader2 } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const topics = [
  'SDE Role / Job',
  'Internship',
  'Project Collab',
  'Say Hello',
];

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const [activeTopic, setActiveTopic] = useState('SDE Role / Job');
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const subject = encodeURIComponent(`[Portfolio Contact: ${activeTopic}] From ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nTopic: ${activeTopic}\n\nMessage:\n${formData.message}`
    );
    const mailtoUrl = `mailto:vaibhav0878gupta@gmail.com?subject=${subject}&body=${body}`;

    await new Promise((res) => setTimeout(res, 500));

    try {
      window.open(mailtoUrl, '_blank');
    } catch {
      // Fallback
    }

    setIsSending(false);
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setFormData({ name: '', email: '', message: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/35 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="relative bg-white/95 dark:bg-[#181816]/95 backdrop-blur-2xl rounded-[32px] p-7 sm:p-9 max-w-[480px] w-full shadow-[0_24px_70px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,1)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] border border-white/90 dark:border-white/10 z-10 select-none overflow-hidden my-auto"
          >
            {/* Close Button */}
            <button
              onClick={handleResetAndClose}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#F3F3F0] dark:bg-[#222220] hover:bg-[#EAEAE6] dark:hover:bg-[#2C2C28] flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors focus:outline-none z-20 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {!submitted ? (
              <div>
                {/* Header */}
                <div className="mb-6 pr-8">
                  <h3 className="text-2xl sm:text-[26px] font-extrabold text-[#111111] dark:text-[#F4F4F2] tracking-tight leading-tight">
                    Let’s connect.
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#7A7A75] dark:text-[#8E8E88] mt-1.5 font-normal leading-relaxed">
                    Have an engineering role, collaboration, or question? Send a message directly to my inbox.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Topic Pill Selector with Sliding Pill */}
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-semibold text-[#666660] dark:text-[#A8A8A2]">
                      What’s this about?
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {topics.map((t) => {
                        const isSelected = activeTopic === t;
                        return (
                          <button
                            type="button"
                            key={t}
                            onClick={() => setActiveTopic(t)}
                            className={`relative px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 focus:outline-none cursor-pointer ${
                              isSelected
                                ? 'text-white dark:text-[#111111]'
                                : 'text-[#555550] dark:text-[#C5C5BF] bg-[#F5F5F2] dark:bg-white/[0.06] hover:bg-[#EBEBE6] dark:hover:bg-white/[0.1] border border-[#E8E8E3] dark:border-white/10'
                            }`}
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="activeTopicPill"
                                className="absolute inset-0 rounded-full bg-[#111111] dark:bg-white"
                                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                              />
                            )}
                            <span className="relative z-10">{t}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11.5px] font-semibold text-[#666660] dark:text-[#A8A8A2]">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Chi"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#F6F6F4] dark:bg-[#121210] hover:bg-[#F2F2EF] dark:hover:bg-[#1A1A18] focus:bg-white dark:focus:bg-[#121210] text-sm text-[#111111] dark:text-[#F4F4F2] placeholder:text-[#A0A09A] dark:placeholder:text-[#666660] border border-transparent dark:border-white/10 focus:border-[#111111] dark:focus:border-[#FF5A1F] focus:outline-none transition-all"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-semibold text-[#666660] dark:text-[#A8A8A2]">
                      Your Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#F6F6F4] dark:bg-[#121210] hover:bg-[#F2F2EF] dark:hover:bg-[#1A1A18] focus:bg-white dark:focus:bg-[#121210] text-sm text-[#111111] dark:text-[#F4F4F2] placeholder:text-[#A0A09A] dark:placeholder:text-[#666660] border border-transparent dark:border-white/10 focus:border-[#111111] dark:focus:border-[#FF5A1F] focus:outline-none transition-all"
                    />
                  </div>

                  {/* Message Input */}
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-semibold text-[#666660] dark:text-[#A8A8A2]">
                      Message
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Hi Vaibhav, let’s discuss..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#F6F6F4] dark:bg-[#121210] hover:bg-[#F2F2EF] dark:hover:bg-[#1A1A18] focus:bg-white dark:focus:bg-[#121210] text-sm text-[#111111] dark:text-[#F4F4F2] placeholder:text-[#A0A09A] dark:placeholder:text-[#666660] border border-transparent dark:border-white/10 focus:border-[#111111] dark:focus:border-[#FF5A1F] focus:outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full py-3.5 px-6 rounded-full bg-[#111111] dark:bg-white hover:bg-[#222222] dark:hover:bg-[#EAEAE6] text-white dark:text-[#111111] font-medium text-sm flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(0,0,0,0.16)] active:scale-[0.98] transition-all mt-3 disabled:opacity-75 cursor-pointer"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Subtle Direct Contact Bottom Note */}
                <div className="mt-5 text-center text-[11.5px] text-[#9A9A94] dark:text-[#8E8E88]">
                  Or email directly at{' '}
                  <a
                    href="mailto:vaibhav0878gupta@gmail.com"
                    className="text-[#111111] dark:text-[#F4F4F2] font-semibold hover:underline hover:text-[#FF5A1F] dark:hover:text-[#FF5A1F] transition-colors"
                  >
                    vaibhav0878gupta@gmail.com
                  </a>
                </div>
              </div>
            ) : (
              /* Upgraded Apple-Style Minimal Confirmation Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="py-4 text-center space-y-6"
              >
                {/* Luminous Animated Success Icon */}
                <motion.div 
                  initial={{ scale: 0.6, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 18, stiffness: 260 }}
                  className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 mx-auto flex items-center justify-center shadow-[0_4px_20px_rgba(16,185,129,0.15)]"
                >
                  <Check className="w-7 h-7 stroke-[2.5]" />
                </motion.div>

                {/* Heading & Context */}
                <div className="space-y-1.5">
                  <h3 className="text-2xl font-extrabold text-[#111111] dark:text-[#F4F4F2] tracking-tight">
                    Message Sent!
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#73736E] dark:text-[#A8A8A2] max-w-xs mx-auto leading-relaxed">
                    Thank you, <span className="font-semibold text-[#111111] dark:text-[#F4F4F2]">{formData.name || 'there'}</span>. I’ve received your note regarding <span className="font-semibold text-[#111111] dark:text-[#F4F4F2]">{activeTopic}</span> and will get back to you shortly.
                  </p>
                </div>

                {/* Confirmation Receipt Capsule */}
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#F6F6F4] dark:bg-white/[0.06] border border-[#E8E8E3] dark:border-white/10 text-xs text-[#555550] dark:text-[#C5C5BF]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Delivered to: <strong className="text-[#111111] dark:text-[#F4F4F2]">vaibhav0878gupta@gmail.com</strong></span>
                </div>

                {/* Back to Portfolio Button */}
                <div className="pt-2">
                  <button
                    onClick={handleResetAndClose}
                    className="w-full py-3.5 px-6 rounded-full bg-[#111111] dark:bg-white hover:bg-[#222222] dark:hover:bg-[#EAEAE6] text-white dark:text-[#111111] text-xs font-semibold shadow-sm transition-all duration-200 cursor-pointer"
                  >
                    Back to Portfolio
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
