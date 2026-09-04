import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Lock, ExternalLink, Sparkles, Cpu } from 'lucide-react';

interface ShowcaseProject {
  id: string;
  index: string;
  kicker: string;
  title: string;
  badge: string;
  summary: string;
  bullets: string[];
  tech: string[];
  liveUrl: string;
  githubUrl: string;
  displayUrl: string;
  icon: React.ReactNode;
}

const showcaseProjects: ShowcaseProject[] = [
  {
    id: 'aven',
    index: '01',
    kicker: 'AI Content Generation Platform',
    title: 'Aven AI',
    badge: 'Flagship Full-Stack SaaS',
    summary: 'A multi-modal AI generation SaaS engineered to streamline content creation, generative imagery, resume intelligence, and precision photo editing into a unified, high-performance ecosystem.',
    bullets: [
      'Developed a full-stack AI content generation SaaS with React 19 frontend and Express 5 backend supporting article, image, resume-analysis, and image-editing workflows.',
      'Designed REST API integrations with PostgreSQL for persistent user data and Clerk for authentication and session management.',
      'Integrated Gemini AI, Cloudinary, Clipdrop, and Stripe for AI generation, media processing, and subscription-based billing.',
    ],
    tech: ['React 19', 'Express 5', 'PostgreSQL', 'Gemini AI', 'Clerk', 'Stripe', 'Tailwind CSS', 'Vite'],
    liveUrl: 'https://aven-mu.vercel.app/',
    githubUrl: 'https://github.com/vaibhavgupta88/Aven',
    displayUrl: 'aven-mu.vercel.app',
    icon: <Sparkles className="w-4 h-4 text-[#FF5A1F]" />,
  },
  {
    id: 'rankpilot',
    index: '02',
    kicker: 'AI SEO Tracking Engine',
    title: 'Rank Pilot',
    badge: 'Live SEO Intelligence',
    summary: 'An autonomous website performance and search tracking engine combining Google Gemini API with cloud-based headless browser automation for real-time rank tracking and audits.',
    bullets: [
      'Automated website analysis and keyword scoring using Google Gemini API for actionable search engine optimization intelligence.',
      'Orchestrated Browserbase cloud browser automation to perform live headless web auditing, competitor SERP scraping, and DOM extraction without rate-limiting.',
      'Architected full-stack pipeline with React.js, Express microservices, and MongoDB to store historical audits and performance metrics.',
    ],
    tech: ['React.js', 'Google Gemini API', 'Express.js', 'MongoDB', 'Browserbase', 'Tailwind CSS'],
    liveUrl: 'https://seo-rank-tracker-nu.vercel.app/',
    githubUrl: 'https://github.com/vaibhavgupta88/SEO_rank_tracker',
    displayUrl: 'seo-rank-tracker-nu.vercel.app',
    icon: <Cpu className="w-4 h-4 text-[#FF5A1F]" />,
  },
];

export const ProjectShowcaseSection: React.FC = () => {
  return (
    <section id="projects" className="px-2 sm:px-4 max-w-5xl mx-auto w-full pt-16 pb-12">
      {/* Section Header */}
      <div className="mb-14 pb-5 border-b border-[#E8E8E4]/70 dark:border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-pulse" />
            <h3 className="text-xs font-bold text-[#8A8A85] dark:text-[#787872] uppercase tracking-[0.2em]">
              Selected Case Studies
            </h3>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] dark:text-[#F4F4F2] tracking-tight">
            Featured Systems & Projects
          </h2>
        </div>
        <p className="text-sm text-[#7A7A75] dark:text-[#8E8E88] max-w-md">
          Deep dive into production full-stack SaaS architectures, AI agent workflows, and real-time platforms.
        </p>
      </div>

      {/* Alternating Project Rows */}
      <div className="space-y-20 sm:space-y-24">
        {showcaseProjects.map((project, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <div
              key={project.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              {/* Browser Preview Mockup Column */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`col-span-1 md:col-span-6 lg:col-span-7 ${
                  isEven ? 'md:order-1' : 'md:order-2'
                }`}
              >
                <div className="bg-white/85 hover:bg-white/95 dark:bg-[#181816]/85 dark:hover:bg-[#20201D]/95 backdrop-blur-2xl rounded-[24px] sm:rounded-[28px] border border-white/90 dark:border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.95)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] hover:shadow-[0_20px_48px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_48px_rgba(0,0,0,0.5)] transition-all duration-300 overflow-hidden group">
                  {/* macOS Window Header Chrome */}
                  <div className="bg-[#F4F4F1] dark:bg-[#1E1E1C] border-b border-[#EAEAE6] dark:border-white/10 px-4 py-3 flex items-center justify-between select-none">
                    {/* Traffic Lights */}
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]/40" />
                    </div>

                    {/* Address Bar */}
                    <div className="flex items-center gap-1.5 bg-white dark:bg-[#121210] px-3 py-1 rounded-full border border-[#E2E2DD] dark:border-white/10 text-[11px] font-mono text-[#555550] dark:text-[#A8A8A2] shadow-2xs max-w-[200px] sm:max-w-xs truncate">
                      <Lock className="w-3 h-3 text-[#27C93F] shrink-0" />
                      <span className="truncate">{project.displayUrl}</span>
                    </div>

                    {/* Quick Launch Icon */}
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-md text-[#787873] dark:text-[#888882] hover:text-[#111111] dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
                      title="Open Live URL"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Browser Window Viewport Content */}
                  <div className="relative aspect-[16/10] sm:aspect-[16/10.5] w-full bg-[#FAFAF8] dark:bg-[#121210] overflow-hidden flex flex-col justify-between">
                    {/* Live Embedded Interactive Iframe / Visual Mockup */}
                    <div className="w-full h-full relative group/frame">
                      <iframe
                        src={project.liveUrl}
                        title={`${project.title} Preview`}
                        className="w-[142%] h-[142%] transform scale-[0.704] origin-top-left border-0 bg-white pointer-events-none group-hover/frame:pointer-events-auto transition-opacity"
                        loading="lazy"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                      />

                      {/* Glassmorphic Hover Overlay with direct Launch CTA */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-between p-4 pointer-events-none">
                        <span className="text-white text-xs font-medium backdrop-blur-md bg-black/50 px-3 py-1 rounded-full border border-white/20">
                          {project.title} Live Deployment
                        </span>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF5A1F] text-white text-xs font-semibold shadow-md pointer-events-auto hover:bg-[#E04F1B] transition-colors"
                        >
                          <span>Open Full App</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Detailed About Section Column */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`col-span-1 md:col-span-6 lg:col-span-5 space-y-4 ${
                  isEven ? 'md:order-2' : 'md:order-1'
                }`}
              >
                {/* Index & Kicker Header */}
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[#FF5A1F] tracking-wider px-2 py-0.5 rounded-md bg-[#FF5A1F]/10 dark:bg-[#FF5A1F]/15 border border-[#FF5A1F]/20">
                    {project.index}
                  </span>
                  <span className="text-xs font-semibold text-[#8A8A85] dark:text-[#787872] uppercase tracking-wider">
                    {project.kicker}
                  </span>
                </div>

                {/* Title + Status Badge */}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111111] dark:text-[#F4F4F2] tracking-tight">
                    {project.title}
                  </h3>
                  <div className="mt-1">
                    <span className="inline-block text-[11px] font-semibold text-[#666660] dark:text-[#A8A8A2] bg-[#ECECE8] dark:bg-white/[0.08] px-2.5 py-0.5 rounded-full">
                      {project.badge}
                    </span>
                  </div>
                </div>

                {/* Summary narrative */}
                <p className="text-sm text-[#444440] dark:text-[#C5C5BF] leading-relaxed">
                  {project.summary}
                </p>

                {/* Key Bullet Highlights */}
                <div className="space-y-2 pt-1">
                  {project.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2.5 text-xs text-[#555550] dark:text-[#A8A8A2] leading-normal">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F] mt-1.5 shrink-0" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

                {/* Technologies List */}
                <div className="pt-2">
                  <p className="text-[10.5px] uppercase font-bold text-[#8A8A85] dark:text-[#787872] tracking-wider mb-2">
                    Core Technologies
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 rounded-full bg-white dark:bg-white/[0.08] text-[11px] font-medium text-[#444440] dark:text-[#D4D4CE] border border-[#E4E4DE] dark:border-white/10 shadow-2xs"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Links Buttons */}
                <div className="flex items-center gap-3 pt-4">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-semibold hover:bg-[#FF5A1F] dark:hover:bg-[#FF5A1F] dark:hover:text-white transition-colors shadow-sm cursor-pointer"
                  >
                    <span>Visit Live Site</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-white/[0.08] text-[#333330] dark:text-[#EAEAE6] hover:text-[#111111] dark:hover:text-white text-xs font-semibold border border-[#DEDEDA] dark:border-white/10 hover:border-[#111111] dark:hover:border-white/30 transition-colors shadow-2xs cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    <span>View GitHub</span>
                  </a>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
