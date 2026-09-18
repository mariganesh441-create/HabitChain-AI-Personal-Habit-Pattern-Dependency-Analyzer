import React, { useMemo } from 'react';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  GitMerge,
  Sparkles,
  Zap,
  Activity,
  Layers,
  ChevronRight,
  Check,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Plus,
  Calendar,
  BookOpen,
} from 'lucide-react';
import { useHabit } from '../../context/HabitContext';

export const DashboardView: React.FC = () => {
  const {
    habits,
    logs,
    chains,
    insights,
    todayProgress,
    overallConsistencyScore,
    weeklyProgress,
    toggleHabitStatus,
    getLogsForDate,
    selectedDate,
    setActivePage,
    isDemoDataLoaded,
    uniqueObservedDatesCount,
    minObservationsThreshold,
    setIsMethodologyModalOpen,
    runPatternAnalysis,
    isAnalyzing,
  } = useHabit();

  const todayLogs = getLogsForDate(selectedDate);
  const activeHabits = habits.filter((h) => h.active);

  // Top Consistent Habits
  const topConsistentHabits = useMemo(() => {
    return habits
      .map((h) => {
        const habitLogs = logs.filter((l) => l.habitId === h.id);
        const completedCount = habitLogs.filter((l) => l.status === 'completed').length;
        const rate = habitLogs.length > 0 ? Math.round((completedCount / habitLogs.length) * 100) : 0;
        return {
          ...h,
          rate,
          totalLogged: habitLogs.length,
          completedCount,
        };
      })
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 4);
  }, [habits, logs]);

  // Recent Detected Chains
  const recentDetectedChains = useMemo(() => {
    return [...chains]
      .sort((a, b) => b.relationshipStrength - a.relationshipStrength)
      .slice(0, 4);
  }, [chains]);

  // Group habits chronologically for "Today's Habit Flow"
  const timeOrder = { morning: 1, afternoon: 2, evening: 3, night: 4 };
  const sortedHabits = [...activeHabits].sort((a, b) => {
    const orderA = timeOrder[a.timeOfDay || 'morning'] || 1;
    const orderB = timeOrder[b.timeOfDay || 'morning'] || 1;
    return orderA - orderB;
  });

  return (
    <div id="dashboard-container" className="space-y-6 pb-12">
      {/* Quick Action Header & Methodology Notice */}
      <div
        id="methodology-banner"
        className="p-4 rounded-2xl bg-[#131B33] border border-[#1E294B] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4 text-[#2DD4BF]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">Empirical Behavioral Architecture</span>
              {isDemoDataLoaded ? (
                <span className="px-2 py-0.5 rounded-full bg-[#7C3AED]/20 text-purple-300 text-[10px] font-mono border border-[#7C3AED]/40 font-semibold">
                  DEMO DATA (14-Day Simulation)
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-[#2DD4BF]/15 text-[#2DD4BF] text-[10px] font-mono border border-[#2DD4BF]/30 font-semibold">
                  USER DATA ({uniqueObservedDatesCount} Days Tracked)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Chains represent observed co-occurrences and sequential associations from longitudinal log data. Non-causal model.
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-auto">
          <button
            id="dashboard-view-methodology-btn"
            onClick={() => setIsMethodologyModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#0B1020] border border-[#1E294B] text-slate-300 hover:text-white hover:border-[#2DD4BF] text-xs font-semibold transition-all cursor-pointer"
            title="Open Analytical Methodology Spec"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span>Methodology</span>
          </button>

          <button
            id="dashboard-reanalyze-btn"
            onClick={runPatternAnalysis}
            disabled={isAnalyzing}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#0B1020] border border-[#1E294B] text-slate-300 hover:text-white hover:border-[#7C3AED] text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            title="Re-run Pattern Analysis on Logs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>{isAnalyzing ? 'Analyzing...' : 'Re-Analyze'}</span>
          </button>

          <button
            id="dashboard-quick-add-habit-btn"
            onClick={() => setActivePage('habits')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#0B1020] border border-[#1E294B] text-slate-200 hover:text-white hover:border-[#7C3AED] text-xs font-semibold transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Add Habit</span>
          </button>

          <button
            id="dashboard-quick-log-btn"
            onClick={() => setActivePage('daily-log')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#2DD4BF] hover:bg-[#26bba7] text-[#0B1020] text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Quick Log</span>
          </button>
        </div>
      </div>

      {/* Primary Key Metrics Cards */}
      <div id="dashboard-metric-cards-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Habit Progress */}
        <div
          id="metric-today-progress"
          className="p-5 rounded-2xl bg-[#131B33] border border-[#1E294B] hover:border-[#2DD4BF]/40 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Today's Progress</span>
            <div className="w-8 h-8 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center text-[#2DD4BF]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-extrabold text-white tracking-tight">{todayProgress.percentage}%</span>
              <span className="text-xs text-slate-400 ml-2">
                ({todayProgress.completed} of {todayProgress.total} habits)
              </span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3 w-full bg-[#0B1020] rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#2DD4BF] h-2 rounded-full transition-all duration-500 ease-out glow-teal"
              style={{ width: `${todayProgress.percentage}%` }}
            />
          </div>
          <p className="mt-2.5 text-[11px] text-slate-400">
            {todayProgress.completed === todayProgress.total
              ? 'All daily targets executed'
              : `${todayProgress.total - todayProgress.completed} routines pending for today`}
          </p>
        </div>

        {/* Card 2: Habit Consistency */}
        <div
          id="metric-habit-consistency"
          className="p-5 rounded-2xl bg-[#131B33] border border-[#1E294B] hover:border-[#7C3AED]/40 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Habit Consistency</span>
            <div className="w-8 h-8 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-extrabold text-white tracking-tight">{overallConsistencyScore}</span>
              <span className="text-xs text-slate-400 ml-1">/ 100 Index</span>
            </div>
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED]/30">
              Stable
            </span>
          </div>
          <div className="mt-3 w-full bg-[#0B1020] rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#7C3AED] h-2 rounded-full transition-all duration-500 ease-out glow-purple"
              style={{ width: `${overallConsistencyScore}%` }}
            />
          </div>
          <p className="mt-2.5 text-[11px] text-slate-400">Computed across 14-day observation window</p>
        </div>

        {/* Card 3: Active Habits */}
        <div
          id="metric-active-habits"
          className="p-5 rounded-2xl bg-[#131B33] border border-[#1E294B] hover:border-[#F472B6]/40 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Habits</span>
            <div className="w-8 h-8 rounded-xl bg-[#F472B6]/10 flex items-center justify-center text-[#F472B6]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-extrabold text-white tracking-tight">{activeHabits.length}</span>
              <span className="text-xs text-slate-400 ml-2">monitored</span>
            </div>
            <button
              onClick={() => setActivePage('habits')}
              className="text-[11px] text-[#F472B6] hover:underline flex items-center gap-0.5"
            >
              <span>Manage</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="px-1.5 py-0.5 rounded bg-[#0B1020] text-slate-300">Academics</span>
            <span className="px-1.5 py-0.5 rounded bg-[#0B1020] text-slate-300">Health</span>
            <span className="px-1.5 py-0.5 rounded bg-[#0B1020] text-slate-300">Sleep</span>
          </div>
          <p className="mt-2.5 text-[11px] text-slate-400">3 primary behavioral categories active</p>
        </div>

        {/* Card 4: Detected Chains */}
        <div
          id="metric-detected-chains"
          className="p-5 rounded-2xl bg-[#131B33] border border-[#1E294B] hover:border-[#2DD4BF]/40 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Detected Chains</span>
            <div className="w-8 h-8 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center text-[#2DD4BF]">
              <GitMerge className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-extrabold text-[#2DD4BF] tracking-tight">{chains.length}</span>
              <span className="text-xs text-slate-400 ml-2">patterns</span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/20">
              Avg 84% Str.
            </span>
          </div>
          <div className="mt-3 flex items-center space-x-1">
            {chains.slice(0, 5).map((c, i) => (
              <div
                key={c.id}
                className="flex-1 h-2 rounded-full bg-[#2DD4BF]/20 overflow-hidden"
                title={`Chain ${i + 1}: ${Math.round(c.relationshipStrength * 100)}% strength`}
              >
                <div
                  className="h-full bg-[#2DD4BF]"
                  style={{ width: `${Math.round(c.relationshipStrength * 100)}%` }}
                />
              </div>
            ))}
          </div>
          <p className="mt-2.5 text-[11px] text-slate-400">Statistically significant dependencies</p>
        </div>
      </div>

      {/* VISUAL SECTION: "Today's Habit Flow" */}
      <section
        id="todays-habit-flow-section"
        className="p-6 rounded-2xl bg-[#131B33] border border-[#1E294B] shadow-lg relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] glow-teal" />
              <h2 className="text-lg font-bold text-white tracking-tight">Today's Habit Flow</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Chronological sequence diagram of your routine nodes and observed transition strengths.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#0B1020] border border-[#1E294B] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
              <span>Completed</span>
            </span>
            <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#0B1020] border border-[#1E294B] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              <span>Pending</span>
            </span>
          </div>
        </div>

        {/* Interactive Flow Diagram */}
        {sortedHabits.length > 0 ? (
          <div className="overflow-x-auto pb-3 pt-2">
          <div className="flex items-center min-w-[760px] gap-2">
            {sortedHabits.map((habit, index) => {
              const log = todayLogs.find((l) => l.habitId === habit.id);
              const isCompleted = log?.status === 'completed';
              const isPartial = log?.status === 'partial';

              // Find if there is a detected chain connecting this habit to the next one
              const nextHabit = sortedHabits[index + 1];
              const connectingChain = nextHabit
                ? chains.find((c) => c.sourceHabit === habit.id && c.targetHabit === nextHabit.id)
                : null;

              return (
                <React.Fragment key={habit.id}>
                  {/* Habit Node Card */}
                  <div
                    id={`habit-flow-node-${habit.id}`}
                    className={`flex-1 min-w-[150px] max-w-[210px] p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                      isCompleted
                        ? 'bg-[#15233D] border-[#2DD4BF]/50 shadow-sm shadow-[#2DD4BF]/10'
                        : isPartial
                        ? 'bg-[#181D33] border-[#7C3AED]/40'
                        : 'bg-[#0F1528] border-[#1E294B] hover:border-slate-600'
                    }`}
                    onClick={() => toggleHabitStatus(habit.id, selectedDate)}
                    title="Click to toggle completion status"
                  >
                    {/* Header with time badge and checkmark toggle */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-[#0B1020] text-slate-400 border border-[#1E294B]">
                        {habit.timeOfDay || 'Morning'}
                      </span>
                      <button
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                          isCompleted
                            ? 'bg-[#2DD4BF] text-[#0B1020] glow-teal'
                            : isPartial
                            ? 'bg-[#7C3AED]/30 text-[#7C3AED] border border-[#7C3AED]'
                            : 'bg-[#1E294B] text-slate-500 hover:text-white'
                        }`}
                        aria-label={`Toggle ${habit.name}`}
                      >
                        {isCompleted ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          <span className="text-[10px] font-mono">{index + 1}</span>
                        )}
                      </button>
                    </div>

                    {/* Habit Name */}
                    <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                      {habit.name}
                    </h3>

                    {/* Category */}
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{habit.category}</p>

                    {/* Status Pill */}
                    <div className="mt-2.5 pt-2 border-t border-[#1E294B]/60 flex items-center justify-between text-[10px]">
                      <span className={isCompleted ? 'text-[#2DD4BF] font-medium' : 'text-slate-400'}>
                        {isCompleted ? 'Done' : isPartial ? 'In progress' : 'Not started'}
                      </span>
                      <span className="text-[9px] text-slate-400 group-hover:text-slate-300">Tap to toggle</span>
                    </div>
                  </div>

                  {/* Connecting Arrow & Association Badge */}
                  {index < sortedHabits.length - 1 && (
                    <div className="flex flex-col items-center justify-center px-1 shrink-0">
                      {connectingChain ? (
                        <div
                          className="flex flex-col items-center cursor-pointer group/link"
                          onClick={() => setActivePage('chains')}
                          title={`Observed association: ${Math.round(connectingChain.relationshipStrength * 100)}% co-occurrence`}
                        >
                          <span className="text-[9px] font-mono font-bold text-[#2DD4BF] bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 px-1.5 py-0.5 rounded-md mb-1 whitespace-nowrap">
                            {Math.round(connectingChain.relationshipStrength * 100)}%
                          </span>
                          <div className="w-6 h-[2px] bg-gradient-to-r from-[#2DD4BF] to-[#7C3AED]" />
                          <ArrowRight className="w-3.5 h-3.5 text-[#7C3AED] -ml-1 -mt-2" />
                        </div>
                      ) : (
                        <div className="flex items-center text-slate-400">
                          <div className="w-4 h-[1px] bg-[#1E294B]" />
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
        ) : (
          <div className="p-8 text-center rounded-xl bg-[#0B1020] border border-[#1E294B]">
            <Activity className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-xs text-slate-300 font-medium">
              Start logging your habits to discover your first habit pattern.
            </p>
            <button
              onClick={() => setActivePage('habits')}
              className="mt-3 px-3.5 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold cursor-pointer"
            >
              Add Your First Habit
            </button>
          </div>
        )}

        {/* Footnote explanation for Flow */}
        <div className="mt-3 pt-3 border-t border-[#1E294B] flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-2">
          <p>
            <strong className="text-slate-300">Behavioral Stacking:</strong> Percentage badges indicate historical
            probability of reaching the next routine step once the source step is satisfied.
          </p>
          <button
            onClick={() => setActivePage('daily-log')}
            className="text-xs text-[#7C3AED] hover:text-[#9D68F7] font-semibold flex items-center space-x-1 shrink-0"
          >
            <span>Open Detailed Log</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Middle Grid: Top Consistent Habits & Recent Detected Chains */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Consistent Habits Widget */}
        <div
          id="card-top-consistent-habits"
          className="p-6 rounded-2xl bg-[#131B33] border border-[#1E294B] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-[#2DD4BF]" />
                <h2 className="text-base font-bold text-white tracking-tight">Top Consistent Habits</h2>
              </div>
              <button
                onClick={() => setActivePage('analytics')}
                className="text-xs text-[#2DD4BF] hover:underline font-medium flex items-center gap-0.5 cursor-pointer"
              >
                <span>Analytics</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {topConsistentHabits.length > 0 ? (
              <div className="space-y-3">
                {topConsistentHabits.map((h, i) => (
                  <div
                    key={h.id}
                    className="p-3 rounded-xl bg-[#0B1020] border border-[#1E294B] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-[#131B33] text-slate-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{h.name}</h4>
                        <span className="text-[10px] text-slate-400 capitalize">{h.category} • {h.timeOfDay}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <div className="w-20 bg-[#131B33] rounded-full h-1.5 overflow-hidden hidden sm:block">
                        <div
                          className="bg-[#2DD4BF] h-1.5 rounded-full"
                          style={{ width: `${h.rate}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-[#2DD4BF] min-w-[36px] text-right">
                        {h.rate}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No habits tracked yet.</p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#1E294B] flex items-center justify-between text-[11px] text-slate-400">
            <span>Highest compliance rate across logged days</span>
            <button
              onClick={() => setActivePage('habits')}
              className="text-xs text-[#7C3AED] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Habits</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Recent Detected Chains Widget */}
        <div
          id="card-recent-detected-chains"
          className="p-6 rounded-2xl bg-[#131B33] border border-[#1E294B] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <GitMerge className="w-4 h-4 text-[#7C3AED]" />
                <h2 className="text-base font-bold text-white tracking-tight">Recent Detected Chains</h2>
              </div>
              <button
                onClick={() => setActivePage('chains')}
                className="text-xs text-[#7C3AED] hover:underline font-medium flex items-center gap-0.5 cursor-pointer"
              >
                <span>All Chains ({chains.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentDetectedChains.length > 0 ? (
              <div className="space-y-3">
                {recentDetectedChains.map((c) => {
                  const src = habits.find((h) => h.id === c.sourceHabit)?.name || c.sourceHabit;
                  const tgt = habits.find((h) => h.id === c.targetHabit)?.name || c.targetHabit;
                  const percent = Math.round(c.relationshipStrength * 100);

                  return (
                    <div
                      key={c.id}
                      onClick={() => setActivePage('chains')}
                      className="p-3 rounded-xl bg-[#0B1020] border border-[#1E294B] hover:border-[#7C3AED]/50 transition-colors cursor-pointer flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center space-x-1.5 min-w-0 truncate">
                        <span className="font-semibold text-white truncate">{src}</span>
                        <span className="text-[#2DD4BF] font-mono shrink-0">➔</span>
                        <span className="font-semibold text-white truncate">{tgt}</span>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/20 font-bold">
                          {percent}%
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize hidden sm:inline">
                          {c.strengthLabel}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">
                Log consecutive habits to reveal sequential dependency chains.
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#1E294B] flex items-center justify-between text-[11px] text-slate-400">
            <span>Observed co-occurrence and conditional probability</span>
            <button
              onClick={() => setActivePage('chains')}
              className="text-xs text-[#2DD4BF] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Chain Ripple</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Weekly Progress & Recent AI Insights */}
      <div id="dashboard-secondary-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Progress Card (7 cols) */}
        <div
          id="card-weekly-progress"
          className="lg:col-span-7 p-6 rounded-2xl bg-[#131B33] border border-[#1E294B] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Weekly Progress & Rhythm</h2>
                <p className="text-xs text-slate-400">
                  Aggregated completion rates over the past 7 calendar days.
                </p>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-[#0B1020] border border-[#1E294B] text-slate-300">
                Past 7 Days
              </span>
            </div>

            {/* Weekly Bars */}
            <div className="grid grid-cols-7 gap-2 sm:gap-3 my-6">
              {weeklyProgress.map((item, idx) => {
                const isToday = idx === weeklyProgress.length - 1;
                return (
                  <div key={item.date} className="flex flex-col items-center space-y-2">
                    {/* Rate pill */}
                    <span className="text-[10px] font-mono font-medium text-slate-400">{item.rate}%</span>

                    {/* Bar container */}
                    <div className="w-full bg-[#0B1020] rounded-xl h-28 flex items-end p-1 border border-[#1E294B]">
                      <div
                        className={`w-full rounded-lg transition-all duration-500 ease-out ${
                          isToday
                            ? 'bg-gradient-to-t from-[#7C3AED] to-[#2DD4BF] glow-teal'
                            : item.rate >= 80
                            ? 'bg-[#7C3AED]'
                            : item.rate >= 50
                            ? 'bg-[#7C3AED]/60'
                            : 'bg-slate-700'
                        }`}
                        style={{ height: `${Math.max(12, item.rate)}%` }}
                      />
                    </div>

                    {/* Day label */}
                    <span
                      className={`text-xs font-semibold ${
                        isToday ? 'text-[#2DD4BF]' : 'text-slate-400'
                      }`}
                    >
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0B1020] border border-[#1E294B] flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
              <span>Strongest Weekday: Tuesday & Thursday (Avg 92%)</span>
            </span>
            <button
              onClick={() => setActivePage('analytics')}
              className="text-[#2DD4BF] hover:underline text-xs font-medium flex items-center gap-1"
            >
              <span>Full Analytics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recent AI Insights Card (5 cols) */}
        <div
          id="card-recent-ai-insights"
          className="lg:col-span-5 p-6 rounded-2xl bg-[#131B33] border border-[#1E294B] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#2DD4BF]" />
                <h2 className="text-base font-bold text-white tracking-tight">Recent AI Insights</h2>
              </div>
              <button
                onClick={() => setActivePage('insights')}
                className="text-xs text-[#2DD4BF] hover:underline font-medium flex items-center gap-0.5"
              >
                <span>View All ({insights.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List of top insights */}
            {insights.length > 0 ? (
              <div className="space-y-3">
                {insights.slice(0, 2).map((insight) => {
                  const isRisk = insight.type === 'possible_risk' || insight.type === 'friction_warning';
                  const isPositive = insight.type === 'positive_pattern';
                  const isConsistency = insight.type === 'consistency_insight';
                  const isChain = insight.type === 'chain_insight' || insight.type === 'sequence_optimization';

                  let badgeLabel = 'Observed Pattern';
                  let badgeClass = 'bg-[#7C3AED]/20 text-[#7C3AED] border-[#7C3AED]/30';
                  if (isRisk) {
                    badgeLabel = 'Risk Pattern';
                    badgeClass = 'bg-[#F472B6]/20 text-[#F472B6] border-[#F472B6]/30';
                  } else if (isPositive) {
                    badgeLabel = 'Positive Pattern';
                    badgeClass = 'bg-[#2DD4BF]/20 text-[#2DD4BF] border-[#2DD4BF]/30';
                  } else if (isConsistency) {
                    badgeLabel = 'Consistency';
                    badgeClass = 'bg-[#818CF8]/20 text-[#818CF8] border-[#818CF8]/30';
                  } else if (isChain) {
                    badgeLabel = 'Habit Chain';
                    badgeClass = 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/30';
                  }

                  return (
                    <div
                      key={insight.id}
                      className="p-3.5 rounded-xl bg-[#0B1020] border border-[#1E294B] hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${badgeClass}`}
                        >
                          {badgeLabel}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {Math.round(insight.confidence * 100)}% Confidence
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white line-clamp-1">{insight.title}</h4>
                      <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {insight.description}
                      </p>

                      {insight.scientificNote && (
                        <p className="text-[10px] text-slate-400 mt-2 italic line-clamp-1 border-t border-[#1E294B] pt-1.5">
                          * {insight.scientificNote}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center rounded-xl bg-[#0B1020] border border-[#1E294B]">
                <Sparkles className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                <p className="text-xs text-slate-400">
                  Start logging your habits to discover your first habit pattern.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#1E294B] flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Non-causal empirical model</span>
            <button
              onClick={() => setActivePage('reports')}
              className="text-xs text-[#7C3AED] hover:text-[#9D68F7] font-semibold flex items-center space-x-1"
            >
              <span>Read Formal Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
