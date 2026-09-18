import React, { useState } from 'react';
import { HabitProvider, useHabit } from './context/HabitContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { MyHabitsView } from './components/habits/MyHabitsView';
import { DailyLogView } from './components/daily-log/DailyLogView';
import { HabitChainsView } from './components/chains/HabitChainsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { AIInsightsView } from './components/insights/AIInsightsView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { MethodologyModal } from './components/methodology/MethodologyModal';

const MainContent: React.FC = () => {
  const { activePage } = useHabit();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardView />;
      case 'habits':
        return <MyHabitsView />;
      case 'daily-log':
        return <DailyLogView />;
      case 'chains':
        return <HabitChainsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'insights':
        return <AIInsightsView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex flex-col lg:flex-row antialiased">
      {/* Left-Side Navigation Sidebar */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
        <Header onOpenMobileMenu={() => setIsMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Methodology & Analytical Architecture Modal */}
      <MethodologyModal />
    </div>
  );
};

export default function App() {
  return (
    <HabitProvider>
      <MainContent />
    </HabitProvider>
  );
}
