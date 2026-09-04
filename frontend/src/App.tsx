import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from './components/portfolio/Header';
import { Hero } from './components/portfolio/Hero';
import { ExperienceCard } from './components/portfolio/ExperienceCard';
import { LeadershipCard } from './components/portfolio/LeadershipCard';
import { EducationCard } from './components/portfolio/EducationCard';
import { ReadingCard } from './components/portfolio/ReadingCard';
import { MapCard } from './components/portfolio/MapCard';
import { TechnicalSkillsSection } from './components/portfolio/TechnicalSkillsSection';
import { GrainySpotlightBackground } from './components/portfolio/GrainySpotlightBackground';
import { BookingModal } from './components/portfolio/BookingModal';
import { NavDrawer } from './components/portfolio/NavDrawer';

// Silky smooth entrance choreography with Apple/Linear quintic easing & lens blur fade
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.85,
    },
  },
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1], // Quintic deceleration curve
    },
  },
};

export const App: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F6F4] text-[#121212] flex flex-col items-center selection:bg-[#FF5A1F] selection:text-white antialiased font-sans relative overflow-x-hidden">
      {/* Global Animated Grainy Soft Spotlight Background */}
      <GrainySpotlightBackground />

      {/* Main Landing Portfolio Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[1040px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col min-h-screen justify-between relative z-10"
      >
        
        {/* Top Header */}
        <motion.div variants={itemVariants}>
          <Header onOpenMenu={() => setIsMenuOpen(true)} />
        </motion.div>

        {/* Hero Section with Exact Morphing 'Hi' */}
        <main className="flex-1 w-full my-auto py-4">
          <Hero onBookCall={() => setIsBookingOpen(true)} />

          {/* Dynamic Apple-Widget Style Bento Grid Section */}
          <motion.section 
            variants={containerVariants}
            className="px-2 sm:px-4 max-w-5xl mx-auto w-full pt-4 pb-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              
              {/* Row 1: Featured Projects (Wide 2-Column Widget) */}
              <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 h-full">
                <ExperienceCard />
              </motion.div>

              {/* Row 1: Montreal/Noida Style Map (1-Column Square Widget) */}
              <motion.div variants={itemVariants} className="col-span-1 h-full">
                <MapCard />
              </motion.div>

              {/* Row 2, Col 1: Education (1-Column Widget) */}
              <motion.div variants={itemVariants} className="col-span-1">
                <EducationCard />
              </motion.div>

              {/* Row 2, Col 2: Leadership & Roles (1-Column Widget) */}
              <motion.div variants={itemVariants} className="col-span-1">
                <LeadershipCard />
              </motion.div>

              {/* Row 2, Col 3: What I'm reading (1-Column Widget) */}
              <motion.div variants={itemVariants} className="col-span-1">
                <ReadingCard />
              </motion.div>

            </div>
          </motion.section>

          {/* Dedicated Technical Skills Section */}
          <motion.div variants={itemVariants}>
            <TechnicalSkillsSection />
          </motion.div>
        </main>

        {/* Footer */}
        <motion.footer 
          variants={itemVariants}
          className="w-full max-w-5xl mx-auto px-4 py-6 text-center text-xs text-[#9E9E98] flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#ECECE8]/60 mt-auto"
        >
          <span>Crafted with precision • Vaibhav Gupta • Noida, UP</span>
          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/in/vaibhavgupta88/" target="_blank" rel="noreferrer" className="hover:text-[#111111] hover:underline underline-offset-4 transition">
              LinkedIn
            </a>
            <a href="https://github.com/vaibhavgupta88" target="_blank" rel="noreferrer" className="hover:text-[#111111] hover:underline underline-offset-4 transition">
              GitHub
            </a>
            <a href="https://leetcode.com/u/vaibhavgupta88/" target="_blank" rel="noreferrer" className="hover:text-[#111111] hover:underline underline-offset-4 transition">
              LeetCode
            </a>
          </div>
        </motion.footer>
      </motion.div>

      {/* Modals & Slide-over Navigation */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <NavDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onBookCall={() => {
          setIsBookingOpen(true);
        }}
      />
    </div>
  );
};

export default App;
