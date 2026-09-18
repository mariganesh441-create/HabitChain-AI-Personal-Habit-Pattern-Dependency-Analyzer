import React from 'react';
import {
  LayoutDashboard,
  ListChecks,
  CalendarDays,
  GitMerge,
  BarChart3,
  Sparkles,
  FileText,
  Sliders,
  GraduationCap,
  Activity,
  X,
  ShieldAlert,
} from 'lucide-react';
import { useHabit } from '../../context/HabitContext';
import { ActivePage } from '../../types';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

interface NavItem {
  id: ActivePage;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const { activePage, setActivePage, chains, habits, setIsMethodologyModalOpen } = useHabit();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'habits', label: 'My Habits', icon: ListChecks, badge: `${habits.filter((h) => h.active).length}` },
    { id: 'daily-log', label: 'Daily Log', icon: CalendarDays },
    { id: 'chains', label: 'Habit Chains', icon: GitMerge, badge: `${chains.length}` },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'insights', label: 'AI Insights', icon: Sparkles },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Sliders },
  ];

  const handleSelectPage = (page: ActivePage) => {
    setActivePage(page);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0B1020] border-r border-[#1E294B] flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div id="sidebar-brand-header" className="p-6 border-b border-[#1E294B] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#2DD4BF] p-[1px] flex items-center justify-center glow-purple">
              <div className="w-full h-full bg-[#0B1020] rounded-[11px] flex items-center justify-center">
                <GitMerge className="w-5 h-5 text-[#2DD4BF]" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-base tracking-tight text-white">HabitChain</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED]/30">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal">Pattern & Dependency Lab</p>
            </div>
          </div>

          <button
            id="close-sidebar-mobile-btn"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#131B33]"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Academic Project Badge */}
        <div id="sidebar-academic-badge" className="mx-4 mt-4 p-3 rounded-xl bg-[#131B33]/80 border border-[#1E294B] space-y-2.5">
          <div className="flex items-start space-x-2.5">
            <GraduationCap className="w-4 h-4 text-[#2DD4BF] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-slate-200">College Research Project</p>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                Empirical habit association modeling. Non-causal pattern analysis.
              </p>
            </div>
          </div>
          <button
            id="sidebar-methodology-btn"
            onClick={() => setIsMethodologyModalOpen(true)}
            className="w-full py-1.5 px-2.5 rounded-lg bg-[#0B1020] hover:bg-[#15203D] border border-[#1E294B] text-[11px] font-semibold text-[#2DD4BF] hover:text-white flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
          >
            <span>Read Methodology Spec</span>
          </button>
        </div>

        {/* Navigation List */}
        <nav id="sidebar-nav-list" className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Navigation Menu
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleSelectPage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-[#151D38] text-white border border-[#7C3AED]/40 shadow-sm shadow-[#7C3AED]/20'
                    : 'text-slate-300 hover:text-white hover:bg-[#131B33]/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#2DD4BF]' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-[#7C3AED]/30 text-[#2DD4BF] border border-[#2DD4BF]/30'
                        : 'bg-[#1E294B] text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* System Methodology Note & Quick Status */}
        <div id="sidebar-footer" className="p-4 border-t border-[#1E294B] space-y-3 bg-[#0B1020]">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse" />
              <span>Pattern Engine</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">v1.2-edu</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0F162B] border border-[#1E294B]/70 flex items-center space-x-2 text-[11px] text-slate-400">
            <ShieldAlert className="w-3.5 h-3.5 text-[#F472B6] shrink-0" />
            <span className="line-clamp-2 leading-tight">
              Statistical associations only; never implies physical causality.
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
