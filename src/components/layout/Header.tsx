import React from 'react';
import { Menu, Sparkles, RefreshCw, Calendar, Info, BookOpen } from 'lucide-react';
import { useHabit } from '../../context/HabitContext';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { activePage, isAnalyzing, runPatternAnalysis, setIsMethodologyModalOpen } = useHabit();

  const getPageInfo = () => {
    switch (activePage) {
      case 'dashboard':
        return {
          title: 'Overview Dashboard',
          description: 'Personal habit pattern, consistency flow, and dependency monitoring.',
        };
      case 'habits':
        return {
          title: 'My Habits Catalog',
          description: 'Cataloged routines with active association linkages.',
        };
      case 'daily-log':
        return {
          title: 'Daily Habit Log',
          description: 'Record daily routine states and inspect real-time chain ripples.',
        };
      case 'chains':
        return {
          title: 'Habit Chains & Dependencies',
          description: 'Observed conditional relationships and sequential behavioral cascades.',
        };
      case 'analytics':
        return {
          title: 'Pattern Analytics & Co-occurrence',
          description: 'Statistical contingency matrices and habit clustering metrics.',
        };
      case 'insights':
        return {
          title: 'AI Insights & Observations',
          description: 'Automated pattern detection and behavioral correlation findings.',
        };
      case 'reports':
        return {
          title: 'Behavioral Audit Reports',
          description: 'Formal synthesis documents and habit architecture audits.',
        };
      case 'settings':
        return {
          title: 'Analysis Settings & Prototype Specs',
          description: 'Adjust correlation thresholds, observation filters, and project metadata.',
        };
      default:
        return {
          title: 'HabitChain AI',
          description: 'Personal Habit Pattern & Dependency Analyzer',
        };
    }
  };

  const info = getPageInfo();

  // Format today's date nicely
  const formattedToday = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 bg-[#0B1020]/90 backdrop-blur-md border-b border-[#1E294B] px-4 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    >
      {/* Left side: Mobile button + Title & Description */}
      <div className="flex items-center space-x-3">
        <button
          id="mobile-nav-toggle-btn"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-[#131B33] border border-[#1E294B] text-slate-300 hover:text-white"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 id="page-primary-title" className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            {info.title}
          </h1>
          <p id="page-subtitle" className="text-xs text-slate-400 mt-0.5">
            {info.description}
          </p>
        </div>
      </div>

      {/* Right side: Date tag & Trigger Analysis Button */}
      <div className="flex items-center space-x-2.5 self-end md:self-center">
        {/* Methodology button */}
        <button
          id="header-methodology-btn"
          onClick={() => setIsMethodologyModalOpen(true)}
          className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#131B33] border border-[#1E294B] hover:border-[#2DD4BF] text-xs text-slate-300 hover:text-white transition-all cursor-pointer"
          title="Analytical Methodology & System Architecture Spec"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#2DD4BF]" />
          <span>Methodology</span>
        </button>

        {/* Date Display */}
        <div
          id="header-date-pill"
          className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#131B33] border border-[#1E294B] text-xs text-slate-300"
        >
          <Calendar className="w-3.5 h-3.5 text-[#2DD4BF]" />
          <span>{formattedToday}</span>
        </div>

        {/* Run Pattern Analysis Button */}
        <button
          id="trigger-pattern-analysis-btn"
          onClick={runPatternAnalysis}
          disabled={isAnalyzing}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] active:scale-[0.98] text-white text-xs font-semibold shadow-sm shadow-[#7C3AED]/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title="Run statistical pattern detection on all logged habit pairs"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#2DD4BF]" />
              <span>Analyzing Chains...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-[#2DD4BF]" />
              <span>Run Pattern Engine</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
