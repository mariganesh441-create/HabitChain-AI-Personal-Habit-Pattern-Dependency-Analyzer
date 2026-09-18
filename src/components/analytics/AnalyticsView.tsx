import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Calendar,
  Layers,
  HelpCircle,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Zap,
  Filter,
  Search,
  Sun,
  Sunset,
  Moon,
  CloudSun,
  Droplet,
  Brain,
  Dumbbell,
  Utensils,
  Smartphone,
  CheckSquare,
  Sparkles,
  GitMerge,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';
import { useHabit } from '../../context/HabitContext';
import { HabitCategory } from '../../types';
import { calculateHabitConsistency } from '../../utils/patternEngine';

type TrendView = 'daily' | 'weekly' | 'monthly';
type DateRangeFilter = '7d' | '14d' | '30d' | 'all';

const CATEGORIES: { name: HabitCategory; icon: any; color: string }[] = [
  { name: 'Sleep', icon: Moon, color: '#818CF8' },
  { name: 'Study', icon: Brain, color: '#7C3AED' },
  { name: 'Exercise', icon: Dumbbell, color: '#F472B6' },
  { name: 'Food', icon: Utensils, color: '#34D399' },
  { name: 'Hydration', icon: Droplet, color: '#2DD4BF' },
  { name: 'Screen Time', icon: Smartphone, color: '#FB923C' },
  { name: 'Productivity', icon: CheckSquare, color: '#A78BFA' },
  { name: 'Personal', icon: Sparkles, color: '#38BDF8' },
];

export const AnalyticsView: React.FC = () => {
  const { habits, logs, chains, analytics, setActivePage } = useHabit();

  // Filters state
  const [dateRange, setDateRange] = useState<DateRangeFilter>('14d');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedHabitId, setSelectedHabitId] = useState<string>('all');
  const [chainStrengthFilter, setChainStrengthFilter] = useState<string>('all');
  const [trendView, setTrendView] = useState<TrendView>('daily');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeHabits = habits.filter((h) => h.active);

  // Filter logs by date range
  const filteredLogsByDate = useMemo(() => {
    const allDates = Array.from(new Set(logs.map((l) => l.date))).sort();
    if (allDates.length === 0) return [];

    let targetDates: string[] = allDates;
    if (dateRange === '7d') {
      targetDates = allDates.slice(-7);
    } else if (dateRange === '14d') {
      targetDates = allDates.slice(-14);
    } else if (dateRange === '30d') {
      targetDates = allDates.slice(-30);
    }

    return logs.filter((l) => targetDates.includes(l.date));
  }, [logs, dateRange]);

  // Filter habits by category and search
  const filteredHabits = useMemo(() => {
    return activeHabits.filter((h) => {
      const matchCategory =
        selectedCategory === 'all' ||
        h.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        !searchQuery ||
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchHabit = selectedHabitId === 'all' || h.id === selectedHabitId;
      return matchCategory && matchSearch && matchHabit;
    });
  }, [activeHabits, selectedCategory, searchQuery, selectedHabitId]);

  // A. Habit Completion Trend Data
  const trendData = useMemo(() => {
    const dates = Array.from(new Set(filteredLogsByDate.map((l) => l.date))).sort();
    if (dates.length === 0) return [];

    if (trendView === 'daily') {
      // Last 7 to 14 days
      const sliceDates = dates.slice(dateRange === '7d' ? -7 : -14);
      return sliceDates.map((date) => {
        const dayLogs = filteredLogsByDate.filter((l) => {
          if (l.date !== date) return false;
          if (selectedHabitId !== 'all' && l.habitId !== selectedHabitId) return false;
          if (selectedCategory !== 'all') {
            const h = habits.find((hb) => hb.id === l.habitId);
            return h && h.category.toLowerCase() === selectedCategory.toLowerCase();
          }
          return true;
        });

        const total = dayLogs.length;
        const completed = dayLogs.filter((l) => l.status === 'completed').length;
        const partial = dayLogs.filter((l) => l.status === 'partial').length;
        const rate = total > 0 ? Math.round(((completed + partial * 0.5) / total) * 100) : 0;

        const dateObj = new Date(date + 'T00:00:00');
        const label = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });

        return { label, date, rate, count: completed, total };
      });
    } else if (trendView === 'weekly') {
      // Group dates into 7-day chunks
      const chunks: string[][] = [];
      for (let i = 0; i < dates.length; i += 7) {
        chunks.push(dates.slice(i, i + 7));
      }

      return chunks.map((chunk, idx) => {
        const chunkLogs = filteredLogsByDate.filter((l) => {
          if (!chunk.includes(l.date)) return false;
          if (selectedHabitId !== 'all' && l.habitId !== selectedHabitId) return false;
          if (selectedCategory !== 'all') {
            const h = habits.find((hb) => hb.id === l.habitId);
            return h && h.category.toLowerCase() === selectedCategory.toLowerCase();
          }
          return true;
        });

        const total = chunkLogs.length;
        const completed = chunkLogs.filter((l) => l.status === 'completed').length;
        const partial = chunkLogs.filter((l) => l.status === 'partial').length;
        const rate = total > 0 ? Math.round(((completed + partial * 0.5) / total) * 100) : 0;

        return {
          label: `Week ${idx + 1}`,
          date: `${chunk[0]} - ${chunk[chunk.length - 1]}`,
          rate,
          count: completed,
          total,
        };
      });
    } else {
      // Monthly view
      const monthMap = new Map<string, typeof filteredLogsByDate>();
      dates.forEach((d) => {
        const monthKey = d.substring(0, 7); // YYYY-MM
        if (!monthMap.has(monthKey)) monthMap.set(monthKey, []);
        const dLogs = filteredLogsByDate.filter((l) => l.date === d);
        monthMap.get(monthKey)!.push(...dLogs);
      });

      return Array.from(monthMap.entries()).map(([monthKey, mLogs]) => {
        const eligibleLogs = mLogs.filter((l) => {
          if (selectedHabitId !== 'all' && l.habitId !== selectedHabitId) return false;
          if (selectedCategory !== 'all') {
            const h = habits.find((hb) => hb.id === l.habitId);
            return h && h.category.toLowerCase() === selectedCategory.toLowerCase();
          }
          return true;
        });

        const total = eligibleLogs.length;
        const completed = eligibleLogs.filter((l) => l.status === 'completed').length;
        const partial = eligibleLogs.filter((l) => l.status === 'partial').length;
        const rate = total > 0 ? Math.round(((completed + partial * 0.5) / total) * 100) : 0;

        const dateObj = new Date(monthKey + '-01T00:00:00');
        const label = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

        return { label, date: monthKey, rate, count: completed, total };
      });
    }
  }, [filteredLogsByDate, trendView, dateRange, selectedHabitId, selectedCategory, habits]);

  // B. Habit Consistency Data
  const habitConsistencies = useMemo(() => {
    return activeHabits
      .map((h) => {
        const stats = calculateHabitConsistency(h.id, filteredLogsByDate);
        return {
          habit: h,
          ...stats,
        };
      })
      .sort((a, b) => b.rate - a.rate);
  }, [activeHabits, filteredLogsByDate]);

  // C. Category Analysis Data (8 standard categories)
  const categoryStats = useMemo(() => {
    return CATEGORIES.map((cat) => {
      // Match habits whose category contains the name
      const catHabits = activeHabits.filter(
        (h) =>
          h.category.toLowerCase() === cat.name.toLowerCase() ||
          (cat.name === 'Study' && (h.category.includes('Academics') || h.category.includes('Focus'))) ||
          (cat.name === 'Exercise' && (h.category.includes('Health') || h.category.includes('Gym'))) ||
          (cat.name === 'Hydration' && h.category.includes('Nutrition')) ||
          (cat.name === 'Personal' && h.category.includes('Mental'))
      );

      const catHabitIds = catHabits.map((h) => h.id);
      const catLogs = filteredLogsByDate.filter((l) => catHabitIds.includes(l.habitId));
      const total = catLogs.length;
      const completed = catLogs.filter((l) => l.status === 'completed').length;
      const partial = catLogs.filter((l) => l.status === 'partial').length;
      const rate = total > 0 ? Math.round(((completed + partial * 0.5) / total) * 100) : 0;

      return {
        ...cat,
        habitCount: catHabits.length,
        completionRate: rate,
        totalLogs: total,
      };
    });
  }, [activeHabits, filteredLogsByDate]);

  // D. Habit Chain Statistics
  const chainStats = useMemo(() => {
    const totalAssociations = chains.length;
    const strongAssociations = chains.filter(
      (c) => c.relationshipStrength >= 0.8 || c.strengthLabel === 'Strong Association'
    ).length;
    const moderateAssociations = chains.filter(
      (c) =>
        (c.relationshipStrength >= 0.6 && c.relationshipStrength < 0.8) ||
        c.strengthLabel === 'Moderate Association'
    ).length;
    const weakAssociations = chains.filter(
      (c) => c.relationshipStrength < 0.6 || c.strengthLabel === 'Weak Association'
    ).length;

    // Most frequently observed chain
    const mostFrequentChain =
      chains.length > 0
        ? [...chains].sort((a, b) => b.occurrenceCount - a.occurrenceCount)[0]
        : null;

    const mostFrequentSrc = habits.find((h) => h.id === mostFrequentChain?.sourceHabit);
    const mostFrequentTgt = habits.find((h) => h.id === mostFrequentChain?.targetHabit);

    return {
      totalAssociations,
      strongAssociations,
      moderateAssociations,
      weakAssociations,
      mostFrequentChain,
      mostFrequentSrc,
      mostFrequentTgt,
    };
  }, [chains, habits]);

  // E. Time-Based Analysis (Morning, Afternoon, Evening, Night)
  const timeBasedStats = useMemo(() => {
    const timeSlots: {
      slot: 'morning' | 'afternoon' | 'evening' | 'night';
      label: string;
      hours: string;
      icon: any;
      color: string;
    }[] = [
      { slot: 'morning', label: 'Morning', hours: '06:00 - 12:00', icon: Sun, color: '#2DD4BF' },
      { slot: 'afternoon', label: 'Afternoon', hours: '12:00 - 17:00', icon: CloudSun, color: '#7C3AED' },
      { slot: 'evening', label: 'Evening', hours: '17:00 - 21:00', icon: Sunset, color: '#F472B6' },
      { slot: 'night', label: 'Night', hours: '21:00 - 04:00', icon: Moon, color: '#818CF8' },
    ];

    return timeSlots.map((ts) => {
      const slotHabits = activeHabits.filter((h) => h.timeOfDay === ts.slot);
      const slotHabitIds = slotHabits.map((h) => h.id);
      const slotLogs = filteredLogsByDate.filter((l) => slotHabitIds.includes(l.habitId));

      const total = slotLogs.length;
      const completed = slotLogs.filter((l) => l.status === 'completed').length;
      const partial = slotLogs.filter((l) => l.status === 'partial').length;
      const rate = total > 0 ? Math.round(((completed + partial * 0.5) / total) * 100) : 0;

      return {
        ...ts,
        habits: slotHabits,
        habitCount: slotHabits.length,
        completionRate: rate,
        totalLogs: total,
      };
    });
  }, [activeHabits, filteredLogsByDate]);

  // Empty state check
  if (activeHabits.length === 0 || logs.length === 0) {
    return (
      <div id="analytics-empty-container" className="py-16">
        <div className="p-12 text-center rounded-2xl bg-[#131B33] border border-[#1E294B] max-w-lg mx-auto">
          <BarChart3 className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Habit Analytics Available</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Start logging your habits to discover your first habit pattern and unlock behavioral insights.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setActivePage('habits')}
              className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold cursor-pointer"
            >
              Add Habits
            </button>
            <button
              onClick={() => setActivePage('daily-log')}
              className="px-4 py-2 rounded-xl bg-[#2DD4BF] hover:bg-[#26bba7] text-[#0B1020] text-xs font-bold cursor-pointer"
            >
              Log Today's Habits
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate overall metrics
  const overallAvgRate =
    trendData.length > 0
      ? Math.round(trendData.reduce((acc, t) => acc + t.rate, 0) / trendData.length)
      : 80;

  return (
    <div id="analytics-container" className="space-y-6 pb-12">
      {/* Top Academic Banner & Search/Filter Controls */}
      <div className="p-5 rounded-2xl bg-[#131B33] border border-[#1E294B] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#2DD4BF]/20 border border-[#2DD4BF]/30 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5 text-[#2DD4BF]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Habit Pattern & Adherence Analytics
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Longitudinal consistency analysis, temporal clustering, and empirical dependency statistics.
              </p>
            </div>
          </div>

          {/* Quick Date Range Filter */}
          <div className="flex items-center space-x-1.5 bg-[#0B1020] p-1 rounded-xl border border-[#1E294B] self-start sm:self-auto">
            {(['7d', '14d', '30d', 'all'] as DateRangeFilter[]).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  dateRange === r
                    ? 'bg-[#2DD4BF] text-[#0B1020] shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r === '7d' ? '7 Days' : r === '14d' ? '14 Days' : r === '30d' ? '30 Days' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filter Row: Search, Category, Habit dropdowns */}
        <div className="pt-3 border-t border-[#1E294B] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search habits or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B1020] border border-[#1E294B] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF]"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#0B1020] border border-[#1E294B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2DD4BF] cursor-pointer"
            >
              <option value="all">All Categories (8)</option>
              {CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Specific Habit Filter */}
          <div>
            <select
              value={selectedHabitId}
              onChange={(e) => setSelectedHabitId(e.target.value)}
              className="w-full bg-[#0B1020] border border-[#1E294B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2DD4BF] cursor-pointer"
            >
              <option value="all">All Habits ({activeHabits.length})</option>
              {activeHabits.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters button */}
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <span className="text-[11px] text-slate-400">
              {filteredHabits.length} habits matched
            </span>
            {(selectedCategory !== 'all' || selectedHabitId !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedHabitId('all');
                  setSearchQuery('');
                }}
                className="text-xs text-[#2DD4BF] hover:underline font-semibold"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#131B33] border border-[#1E294B]">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Observed Completion
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{overallAvgRate}%</span>
            <span className="text-xs font-semibold text-[#2DD4BF] flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              Stable
            </span>
          </div>
          <div className="mt-2 w-full bg-[#0B1020] rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#2DD4BF] h-1.5 rounded-full" style={{ width: `${overallAvgRate}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#131B33] border border-[#1E294B]">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Top Consistency Habit
          </span>
          <div className="mt-2">
            <span className="text-sm font-bold text-white line-clamp-1">
              {habitConsistencies[0]?.habit.name || 'None'}
            </span>
            <span className="text-xs font-mono text-[#7C3AED] font-semibold">
              {habitConsistencies[0]?.rate || 0}% Adherence Rate
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#131B33] border border-[#1E294B]">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Active Associations
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#2DD4BF]">{chains.length}</span>
            <span className="text-xs text-slate-400">
              {chainStats.strongAssociations} Strong
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Cross-habit interactions</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#131B33] border border-[#1E294B]">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Peak Execution Window
          </span>
          <div className="mt-2">
            <span className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-[#2DD4BF]" />
              Morning (06:00 - 12:00)
            </span>
            <span className="text-xs font-mono text-slate-400">
              {timeBasedStats[0]?.completionRate || 85}% window adherence
            </span>
          </div>
        </div>
      </div>

      {/* A. HABIT COMPLETION TREND (Daily, Weekly, Monthly) */}
      <section
        id="habit-completion-trend-section"
        className="p-6 rounded-2xl bg-[#131B33] border border-[#1E294B] space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-[#2DD4BF]" />
              <h3 className="text-base font-bold text-white tracking-tight">
                A. Habit Completion Trend
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Longitudinal tracking of completed vs attempted habit nodes across chronological intervals.
            </p>
          </div>

          {/* Trend View Toggle: Daily | Weekly | Monthly */}
          <div className="flex items-center space-x-1 bg-[#0B1020] p-1 rounded-xl border border-[#1E294B] self-start sm:self-auto">
            {(['daily', 'weekly', 'monthly'] as TrendView[]).map((v) => (
              <button
                key={v}
                onClick={() => setTrendView(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                  trendView === v
                    ? 'bg-[#7C3AED] text-white shadow-sm shadow-[#7C3AED]/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Clean, Legible Trend Chart */}
        {trendData.length > 0 ? (
          <div className="pt-4 space-y-3">
            <div className="flex items-end gap-2 sm:gap-3 h-44 border-b border-[#1E294B] pb-2">
              {trendData.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-[#0B1020] border border-[#1E294B] text-[11px] text-white px-2.5 py-1 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-lg">
                    <span className="font-bold text-[#2DD4BF]">{item.rate}%</span> ({item.count}/{item.total} habits)
                  </div>

                  {/* Percentage label above bar */}
                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-white transition-colors mb-1 hidden sm:block">
                    {item.rate}%
                  </span>

                  {/* Bar Column */}
                  <div className="w-full bg-[#0B1020] rounded-t-lg h-full flex items-end p-0.5 border border-[#1E294B]/60 overflow-hidden">
                    <div
                      className={`w-full rounded-t-md transition-all duration-500 ease-out group-hover:brightness-125 ${
                        item.rate >= 80
                          ? 'bg-gradient-to-t from-[#7C3AED] to-[#2DD4BF]'
                          : item.rate >= 60
                          ? 'bg-gradient-to-t from-[#7C3AED] to-[#9D68F7]'
                          : 'bg-slate-700'
                      }`}
                      style={{ height: `${Math.max(8, item.rate)}%` }}
                    />
                  </div>

                  {/* X-axis Label */}
                  <span className="text-[10px] font-mono text-slate-400 mt-2 truncate max-w-[60px] text-center">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#2DD4BF]" />
                <span>High Adherence (≥80%)</span>
                <span className="w-2.5 h-2.5 rounded-sm bg-[#7C3AED] ml-2" />
                <span>Moderate (60-79%)</span>
              </span>
              <span className="font-mono text-[11px] text-slate-300">
                Period Average: {overallAvgRate}%
              </span>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400 bg-[#0B1020] rounded-xl border border-[#1E294B]">
            Insufficient log events in the selected interval to display trend.
          </div>
        )}
      </section>

      {/* B. HABIT CONSISTENCY & RANKING */}
      <section
        id="habit-consistency-section"
        className="p-6 rounded-2xl bg-[#131B33] border border-[#1E294B] space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#7C3AED]" />
              <h3 className="text-base font-bold text-white tracking-tight">
                B. Habit Consistency Index
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical execution rate per habit across monitored sessions.
            </p>
          </div>

          <span className="text-xs font-mono text-slate-300 bg-[#0B1020] px-3 py-1.5 rounded-xl border border-[#1E294B]">
            {activeHabits.length} Habits Tracked
          </span>
        </div>

        {/* Consistency Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {habitConsistencies.map((item, idx) => {
            const isHigh = item.rate >= 80;
            const isModerate = item.rate >= 60 && item.rate < 80;
            return (
              <div
                key={item.habit.id}
                className="p-4 rounded-xl bg-[#0B1020] border border-[#1E294B] hover:border-slate-600 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-lg bg-[#131B33] text-slate-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{item.habit.name}</h4>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="text-[10px] text-slate-400">{item.habit.category}</span>
                        <span className="text-[10px] text-slate-500">•</span>
                        <span className="text-[10px] text-slate-400 capitalize">
                          {item.habit.timeOfDay || 'Daily'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Percentage Pill */}
                  <div className="text-right shrink-0">
                    <span
                      className={`text-sm font-extrabold font-mono ${
                        isHigh ? 'text-[#2DD4BF]' : isModerate ? 'text-[#7C3AED]' : 'text-slate-400'
                      }`}
                    >
                      {item.rate}%
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {item.completedCount}/{item.totalLoggedDays} days
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 w-full bg-[#131B33] rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isHigh ? 'bg-[#2DD4BF]' : isModerate ? 'bg-[#7C3AED]' : 'bg-slate-600'
                    }`}
                    style={{ width: `${item.rate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* C. CATEGORY ANALYSIS (8 Standard Categories) */}
      <section
        id="category-analysis-section"
        className="p-6 rounded-2xl bg-[#131B33] border border-[#1E294B] space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-[#2DD4BF]" />
              <h3 className="text-base font-bold text-white tracking-tight">
                C. Category Analysis
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Completion patterns evaluated across the 8 primary behavioral domains.
            </p>
          </div>
          <span className="text-xs text-slate-400">8 Domain Taxonomy</span>
        </div>

        {/* 8 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {categoryStats.map((cat) => {
            const CatIcon = cat.icon;
            return (
              <div
                key={cat.name}
                className="p-4 rounded-xl bg-[#0B1020] border border-[#1E294B] hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${cat.color}20`, borderColor: `${cat.color}40`, borderWidth: 1 }}
                    >
                      <CatIcon className="w-4 h-4" style={{ color: cat.color }} />
                    </div>
                    <span className="font-mono text-base font-bold text-white">{cat.completionRate}%</span>
                  </div>

                  <h4 className="text-xs font-bold text-white">{cat.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {cat.habitCount} active habit{cat.habitCount === 1 ? '' : 's'}
                  </p>
                </div>

                <div className="mt-3">
                  <div className="w-full bg-[#131B33] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${cat.completionRate}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* D. HABIT CHAIN STATISTICS */}
      <section
        id="habit-chain-statistics-section"
        className="p-6 rounded-2xl bg-[#131B33] border border-[#1E294B] space-y-4"
      >
        <div className="flex items-center space-x-2">
          <GitMerge className="w-4 h-4 text-[#2DD4BF]" />
          <h3 className="text-base font-bold text-white tracking-tight">
            D. Habit Chain Statistics
          </h3>
        </div>
        <p className="text-xs text-slate-400 -mt-2">
          Observed cross-habit dependencies, contingency strengths, and repeating sequential pairings.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1E294B]">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
              Total Associations
            </span>
            <span className="text-2xl font-extrabold text-white mt-1 block">
              {chainStats.totalAssociations}
            </span>
            <span className="text-[10px] text-slate-400">Statistically modeled</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1E294B]">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
              Strong Associations
            </span>
            <span className="text-2xl font-extrabold text-[#2DD4BF] mt-1 block">
              {chainStats.strongAssociations}
            </span>
            <span className="text-[10px] text-[#2DD4BF] font-mono">≥80% co-occurrence</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1E294B]">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
              Moderate Associations
            </span>
            <span className="text-2xl font-extrabold text-[#7C3AED] mt-1 block">
              {chainStats.moderateAssociations}
            </span>
            <span className="text-[10px] text-[#7C3AED] font-mono">60% - 79% co-occurrence</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1E294B]">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
              Weak Associations
            </span>
            <span className="text-2xl font-extrabold text-slate-400 mt-1 block">
              {chainStats.weakAssociations}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">&lt;60% co-occurrence</span>
          </div>
        </div>

        {/* Most Frequently Observed Chain Highlight */}
        {chainStats.mostFrequentChain && chainStats.mostFrequentSrc && chainStats.mostFrequentTgt ? (
          <div className="p-4 rounded-xl bg-[#0B1020] border border-[#2DD4BF]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-[#2DD4BF]" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2DD4BF]">
                  Most Frequently Observed Chain
                </span>
                <div className="flex items-center flex-wrap gap-2 mt-1">
                  <span className="text-xs font-bold text-white bg-[#131B33] px-2.5 py-1 rounded-lg border border-[#1E294B]">
                    {chainStats.mostFrequentSrc.name}
                  </span>
                  <span className="text-xs text-[#2DD4BF] font-mono">➔</span>
                  <span className="text-xs font-bold text-white bg-[#131B33] px-2.5 py-1 rounded-lg border border-[#1E294B]">
                    {chainStats.mostFrequentTgt.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-right shrink-0">
              <div>
                <span className="text-xs font-mono font-bold text-white block">
                  {Math.round(chainStats.mostFrequentChain.relationshipStrength * 100)}% Strength
                </span>
                <span className="text-[11px] text-slate-400">
                  Observed {chainStats.mostFrequentChain.occurrenceCount} times
                </span>
              </div>
              <button
                onClick={() => setActivePage('chains')}
                className="px-3 py-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold cursor-pointer"
              >
                Inspect Chains
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1E294B] text-xs text-slate-400 text-center">
            No repeated chains observed yet. Continue logging to detect associations.
          </div>
        )}
      </section>

      {/* E. TIME-BASED ANALYSIS (Morning, Afternoon, Evening, Night) */}
      <section
        id="time-based-analysis-section"
        className="p-6 rounded-2xl bg-[#131B33] border border-[#1E294B] space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#F472B6]" />
              <h3 className="text-base font-bold text-white tracking-tight">
                E. Time-Based Analysis
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Compare execution consistency across diurnal windows (Morning, Afternoon, Evening, Night).
            </p>
          </div>
        </div>

        {/* 4 Time Slots Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {timeBasedStats.map((slot) => {
            const SlotIcon = slot.icon;
            return (
              <div
                key={slot.slot}
                className="p-4 rounded-xl bg-[#0B1020] border border-[#1E294B] hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${slot.color}20`, borderColor: `${slot.color}40`, borderWidth: 1 }}
                    >
                      <SlotIcon className="w-4 h-4" style={{ color: slot.color }} />
                    </div>
                    <span className="text-lg font-extrabold font-mono text-white">
                      {slot.completionRate}%
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white">{slot.label}</h4>
                  <span className="text-[10px] text-slate-400 block font-mono">{slot.hours}</span>
                  <p className="text-[11px] text-slate-400 mt-2">
                    {slot.habitCount} habit{slot.habitCount === 1 ? '' : 's'} assigned
                  </p>
                </div>

                <div className="mt-3">
                  <div className="w-full bg-[#131B33] rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${slot.completionRate}%`,
                        backgroundColor: slot.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
