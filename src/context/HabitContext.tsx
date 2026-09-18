import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Habit,
  DailyHabitLog,
  HabitChain,
  AnalyticsRecord,
  AIInsight,
  Report,
  ActivePage,
  HabitLogStatus,
  RelationshipStrengthLabel,
} from '../types';
import {
  INITIAL_HABITS,
  INITIAL_CHAINS,
  INITIAL_ANALYTICS,
  INITIAL_INSIGHTS,
  INITIAL_REPORTS,
  generateInitialLogs,
  getRelativeDate,
} from '../data/initialData';
import {
  generateInsightsFromData,
  generateReportFromData,
} from '../utils/patternEngine';

interface HabitContextType {
  habits: Habit[];
  logs: DailyHabitLog[];
  chains: HabitChain[];
  analytics: AnalyticsRecord[];
  insights: AIInsight[];
  reports: Report[];
  activePage: ActivePage;
  selectedDate: string;
  isAnalyzing: boolean;
  minConfidenceFilter: number;
  minObservationsThreshold: number;
  hasEnoughDataForPatterns: boolean;
  uniqueObservedDatesCount: number;
  isDemoDataLoaded: boolean;
  isMethodologyModalOpen: boolean;
  // Navigation & Date
  setActivePage: (page: ActivePage) => void;
  setSelectedDate: (date: string) => void;
  setMinConfidenceFilter: (conf: number) => void;
  setMinObservationsThreshold: (count: number) => void;
  setIsMethodologyModalOpen: (open: boolean) => void;
  loadDemoData: () => void;
  clearDemoData: () => void;
  // Habit CRUD
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  updateHabit: (habit: Habit) => void;
  toggleHabitActive: (id: string) => void;
  deleteHabit: (id: string) => void;
  getHabitConsistency: (habitId: string) => number;
  // Log operations
  toggleHabitStatus: (habitId: string, date?: string) => void;
  updateHabitLog: (habitId: string, date: string, status: HabitLogStatus, value: number, notes: string) => void;
  getLogsForDate: (date: string) => DailyHabitLog[];
  getHabitLogs: (habitId: string) => DailyHabitLog[];
  // Chain operations
  addChain: (chain: Omit<HabitChain, 'id' | 'createdAt' | 'strengthLabel'>) => void;
  deleteChain: (id: string) => void;
  // Engine actions
  runPatternAnalysis: () => Promise<void>;
  generateNewReport: () => void;
  generateReport: (params?: {
    reportType: 'daily' | 'weekly' | 'monthly' | 'custom';
    startDate?: string;
    endDate?: string;
  }) => Report;
  resetDemoData: () => void;
  clearAllData: () => void;
  // Computed metrics for dashboard & daily log
  todayProgress: {
    total: number;
    completed: number;
    missed: number;
    partial: number;
    percentage: number;
  };
  overallConsistencyScore: number;
  weeklyProgress: { day: string; date: string; rate: number; count: number }[];
  getDailySummary: (date: string) => {
    completedCount: number;
    partialCount: number;
    missedCount: number;
    totalCount: number;
    progressPercentage: number;
    textSummary: string;
  };
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_HABITS = 'habitchain_habits_v1';
const LOCAL_STORAGE_KEY_LOGS = 'habitchain_logs_v1';
const LOCAL_STORAGE_KEY_CHAINS = 'habitchain_chains_v1';
const LOCAL_STORAGE_KEY_INSIGHTS = 'habitchain_insights_v1';
const LOCAL_STORAGE_KEY_REPORTS = 'habitchain_reports_v1';

export const HabitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const todayDateStr = useMemo(() => getRelativeDate(0), []);

  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [selectedDate, setSelectedDate] = useState<string>(todayDateStr);
  const [minConfidenceFilter, setMinConfidenceFilter] = useState<number>(0.7);
  const [minObservationsThreshold, setMinObservationsThresholdState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('habitchain_min_obs_v1');
      return saved ? parseInt(saved, 10) : 5;
    } catch {
      return 5;
    }
  });
  const [isDemoDataLoaded, setIsDemoDataLoaded] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('habitchain_is_demo_v1');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });
  const [isMethodologyModalOpen, setIsMethodologyModalOpen] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const setMinObservationsThreshold = (count: number) => {
    const val = Math.max(3, Math.min(14, count));
    setMinObservationsThresholdState(val);
    try {
      localStorage.setItem('habitchain_min_obs_v1', val.toString());
    } catch (e) {
      console.error(e);
    }
  };

  // Initialize state with local storage fallback to initial demo data
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_HABITS);
      return saved ? JSON.parse(saved) : INITIAL_HABITS;
    } catch {
      return INITIAL_HABITS;
    }
  });

  const [logs, setLogs] = useState<DailyHabitLog[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_LOGS);
      return saved ? JSON.parse(saved) : generateInitialLogs();
    } catch {
      return generateInitialLogs();
    }
  });

  const [chains, setChains] = useState<HabitChain[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CHAINS);
      return saved ? JSON.parse(saved) : INITIAL_CHAINS;
    } catch {
      return INITIAL_CHAINS;
    }
  });

  const [analytics, setAnalytics] = useState<AnalyticsRecord[]>(INITIAL_ANALYTICS);

  const [insights, setInsights] = useState<AIInsight[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_INSIGHTS);
      return saved ? JSON.parse(saved) : INITIAL_INSIGHTS;
    } catch {
      return INITIAL_INSIGHTS;
    }
  });

  const [reports, setReports] = useState<Report[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_REPORTS);
      return saved ? JSON.parse(saved) : INITIAL_REPORTS;
    } catch {
      return INITIAL_REPORTS;
    }
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_HABITS, JSON.stringify(habits));
    } catch (e) {
      console.error(e);
    }
  }, [habits]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error(e);
    }
  }, [logs]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CHAINS, JSON.stringify(chains));
    } catch (e) {
      console.error(e);
    }
  }, [chains]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_INSIGHTS, JSON.stringify(insights));
    } catch (e) {
      console.error(e);
    }
  }, [insights]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_REPORTS, JSON.stringify(reports));
    } catch (e) {
      console.error(e);
    }
  }, [reports]);

  // Log getters
  const getLogsForDate = (date: string) => {
    return logs.filter((log) => log.date === date);
  };

  const getHabitLogs = (habitId: string) => {
    return logs.filter((log) => log.habitId === habitId);
  };

  // Toggle habit status for a given date
  const toggleHabitStatus = (habitId: string, date: string = todayDateStr) => {
    setLogs((prev) => {
      const existingIdx = prev.findIndex((l) => l.habitId === habitId && l.date === date);
      if (existingIdx >= 0) {
        const current = prev[existingIdx];
        const nextStatus: HabitLogStatus =
          current.status === 'completed'
            ? 'skipped'
            : current.status === 'skipped'
            ? 'missed'
            : current.status === 'missed'
            ? 'partial'
            : 'completed';
        const nextValue = nextStatus === 'completed' ? 100 : nextStatus === 'partial' ? 50 : 0;

        const updated = [...prev];
        updated[existingIdx] = {
          ...current,
          status: nextStatus,
          completionValue: nextValue,
        };
        return updated;
      } else {
        // Create new log entry
        const newLog: DailyHabitLog = {
          id: `log-${date}-${habitId}-${Date.now()}`,
          habitId,
          date,
          status: 'completed',
          completionValue: 100,
          notes: 'Logged via quick flow interface.',
        };
        return [...prev, newLog];
      }
    });
  };

  const updateHabitLog = (
    habitId: string,
    date: string,
    status: HabitLogStatus,
    completionValue: number,
    notes: string
  ) => {
    setLogs((prev) => {
      const existingIdx = prev.findIndex((l) => l.habitId === habitId && l.date === date);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          status,
          completionValue,
          notes,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: `log-${date}-${habitId}-${Date.now()}`,
            habitId,
            date,
            status,
            completionValue,
            notes,
          },
        ];
      }
    });
  };

  // Habits CRUD
  const addHabit = (newHabitData: Omit<Habit, 'id' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...newHabitData,
      id: `habit-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setHabits((prev) => [...prev, newHabit]);

    // Also initialize today's log entry
    setLogs((prev) => [
      ...prev,
      {
        id: `log-${todayDateStr}-${newHabit.id}`,
        habitId: newHabit.id,
        date: todayDateStr,
        status: 'missed',
        completionValue: 0,
        notes: '',
      },
    ]);
  };

  const updateHabit = (updated: Habit) => {
    setHabits((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
  };

  const toggleHabitActive = (id: string) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, active: !h.active } : h)));
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setChains((prev) => prev.filter((c) => c.sourceHabit !== id && c.targetHabit !== id));
    setLogs((prev) => prev.filter((l) => l.habitId !== id));
  };

  const getHabitConsistency = (habitId: string): number => {
    const habitLogs = logs.filter((l) => l.habitId === habitId);
    if (habitLogs.length === 0) return 0;
    const completedCount = habitLogs.filter(
      (l) => l.status === 'completed' || (l.status === 'partial' && l.completionValue >= 60)
    ).length;
    return Math.round((completedCount / habitLogs.length) * 100);
  };

  const getStrengthLabel = (strength: number): RelationshipStrengthLabel => {
    if (strength >= 0.75) return 'Strong Association';
    if (strength >= 0.55) return 'Moderate Association';
    return 'Weak Association';
  };

  // Chain CRUD
  const addChain = (chainData: Omit<HabitChain, 'id' | 'createdAt' | 'strengthLabel'>) => {
    const strengthLabel = getStrengthLabel(chainData.relationshipStrength);
    const newChain: HabitChain = {
      ...chainData,
      strengthLabel,
      id: `chain-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setChains((prev) => [newChain, ...prev]);
  };

  const deleteChain = (id: string) => {
    setChains((prev) => prev.filter((c) => c.id !== id));
  };

  // Check whether we have enough historical data to calculate reliable associations
  const uniqueObservedDatesCount = useMemo(() => new Set(logs.map((l) => l.date)).size, [logs]);

  const hasEnoughDataForPatterns = useMemo(() => {
    const activeHabitsCount = habits.filter((h) => h.active).length;
    return uniqueObservedDatesCount >= minObservationsThreshold && activeHabitsCount >= 2;
  }, [uniqueObservedDatesCount, minObservationsThreshold, habits]);

  // Automated Transparent Pattern & Dependency Analysis Engine
  const runPatternAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate real behavioral computation window (350ms)
    await new Promise((res) => setTimeout(res, 400));

    if (!hasEnoughDataForPatterns) {
      setChains([]);
      setIsAnalyzing(false);
      return;
    }

    // Sort distinct observed dates chronologically
    const sortedDates = Array.from(new Set(logs.map((l) => l.date))).sort();
    const totalDays = sortedDates.length || 1;
    const habitIds = habits.map((h) => h.id);

    const detectedChains: HabitChain[] = [];

    // Analyze pairwise associations
    for (let i = 0; i < habitIds.length; i++) {
      for (let j = 0; j < habitIds.length; j++) {
        if (i === j) continue;
        const sourceId = habitIds[i];
        const targetId = habitIds[j];

        // 1. Check Same-Day Association P(Target_t | Source_t)
        let sameDaySourceCompleted = 0;
        let sameDayBothCompleted = 0;

        sortedDates.forEach((d) => {
          const sLog = logs.find((l) => l.habitId === sourceId && l.date === d);
          const tLog = logs.find((l) => l.habitId === targetId && l.date === d);

          if (sLog?.status === 'completed') {
            sameDaySourceCompleted++;
            if (tLog?.status === 'completed') {
              sameDayBothCompleted++;
            }
          }
        });

        // 2. Check Next-Day (Lag-1) Association P(Target_{t+1} | Source_t)
        let nextDaySourceCompleted = 0;
        let nextDayBothCompleted = 0;

        for (let dIdx = 0; dIdx < sortedDates.length - 1; dIdx++) {
          const currDate = sortedDates[dIdx];
          const nextDate = sortedDates[dIdx + 1];

          const sLog = logs.find((l) => l.habitId === sourceId && l.date === currDate);
          const tNextLog = logs.find((l) => l.habitId === targetId && l.date === nextDate);

          if (sLog?.status === 'completed') {
            nextDaySourceCompleted++;
            if (tNextLog?.status === 'completed') {
              nextDayBothCompleted++;
            }
          }
        }

        // Determine if same-day or next-day is stronger
        const sameDayRate = sameDaySourceCompleted >= 3 ? sameDayBothCompleted / sameDaySourceCompleted : 0;
        const nextDayRate = nextDaySourceCompleted >= 3 ? nextDayBothCompleted / nextDaySourceCompleted : 0;

        const isNextDay = nextDayRate > sameDayRate && nextDayRate >= 0.55;
        const bestRate = isNextDay ? nextDayRate : sameDayRate;
        const sourceCount = isNextDay ? nextDaySourceCompleted : sameDaySourceCompleted;
        const coCount = isNextDay ? nextDayBothCompleted : sameDayBothCompleted;

        // Minimum threshold: at least 3 occurrences of source habit and conditional rate >= 0.50
        if (sourceCount >= 3 && bestRate >= 0.50) {
          const sourceHabit = habits.find((h) => h.id === sourceId);
          const targetHabit = habits.find((h) => h.id === targetId);
          const strength = Math.round(bestRate * 100) / 100;
          const strengthLabel = getStrengthLabel(strength);

          const timingText = isNextDay ? 'on the following day' : 'on the same day';
          const explanation = isNextDay
            ? `"${sourceHabit?.name}" was followed by "${targetHabit?.name}" the next day on ${coCount} of ${sourceCount} observed days.`
            : `"${sourceHabit?.name}" and "${targetHabit?.name}" appeared together on ${coCount} of ${sourceCount} observed days.`;

          detectedChains.push({
            id: `auto-chain-${sourceId}-${targetId}-${isNextDay ? 'next' : 'same'}`,
            sourceHabit: sourceId,
            targetHabit: targetId,
            relationshipStrength: strength,
            strengthLabel,
            timingType: isNextDay ? 'next_day' : 'same_day',
            occurrenceCount: coCount,
            sourceOccurrences: sourceCount,
            coOccurrences: coCount,
            observationPeriod: `Past ${totalDays} Days`,
            dateRange: `${sortedDates[0]} to ${sortedDates[sortedDates.length - 1]}`,
            confidence: Math.min(0.96, Math.round((0.70 + (coCount / totalDays) * 0.25) * 100) / 100),
            createdAt: new Date().toISOString(),
            relationshipType: isNextDay ? 'sequential_cascade' : 'mutual_anchor',
            patternDescription: `Observed association: When "${sourceHabit?.name}" occurred, "${targetHabit?.name}" occurred ${timingText} ${Math.round(bestRate * 100)}% of the time.`,
            explanation,
            temporalGapMinutes: isNextDay ? 480 : 60 + ((i + j) * 15) % 180,
          });
        }
      }
    }

    const finalChains = detectedChains.length > 0 ? detectedChains.sort((a, b) => b.relationshipStrength - a.relationshipStrength) : chains;
    if (detectedChains.length > 0) {
      setChains(finalChains);
    }

    // Refresh AI Insights with empirical non-causal descriptions from actual data
    const freshInsights = generateInsightsFromData(habits, logs, finalChains, minObservationsThreshold);
    if (freshInsights.length > 0) {
      setInsights(freshInsights);
    }

    setIsAnalyzing(false);
  };

  const generateReport = (params?: {
    reportType: 'daily' | 'weekly' | 'monthly' | 'custom';
    startDate?: string;
    endDate?: string;
  }): Report => {
    const repType = params?.reportType || 'weekly';
    const report = generateReportFromData({
      reportType: repType,
      startDate: params?.startDate,
      endDate: params?.endDate,
      habits,
      logs,
      chains,
      insights,
    });

    setReports((prev) => [report, ...prev]);
    return report;
  };

  const generateNewReport = () => {
    generateReport({ reportType: 'weekly' });
  };

  const loadDemoData = () => {
    setHabits(INITIAL_HABITS);
    const newLogs = generateInitialLogs();
    setLogs(newLogs);
    setChains(INITIAL_CHAINS);
    setAnalytics(INITIAL_ANALYTICS);
    setInsights(INITIAL_INSIGHTS);
    setReports(INITIAL_REPORTS);
    setIsDemoDataLoaded(true);
    try {
      localStorage.setItem('habitchain_is_demo_v1', 'true');
      localStorage.setItem(LOCAL_STORAGE_KEY_HABITS, JSON.stringify(INITIAL_HABITS));
      localStorage.setItem(LOCAL_STORAGE_KEY_LOGS, JSON.stringify(newLogs));
      localStorage.setItem(LOCAL_STORAGE_KEY_CHAINS, JSON.stringify(INITIAL_CHAINS));
      localStorage.setItem(LOCAL_STORAGE_KEY_INSIGHTS, JSON.stringify(INITIAL_INSIGHTS));
      localStorage.setItem(LOCAL_STORAGE_KEY_REPORTS, JSON.stringify(INITIAL_REPORTS));
    } catch (e) {
      console.error(e);
    }
  };

  const clearDemoData = () => {
    setHabits([]);
    setLogs([]);
    setChains([]);
    setAnalytics([]);
    setInsights([]);
    setReports([]);
    setIsDemoDataLoaded(false);
    try {
      localStorage.setItem('habitchain_is_demo_v1', 'false');
      localStorage.removeItem(LOCAL_STORAGE_KEY_HABITS);
      localStorage.removeItem(LOCAL_STORAGE_KEY_LOGS);
      localStorage.removeItem(LOCAL_STORAGE_KEY_CHAINS);
      localStorage.removeItem(LOCAL_STORAGE_KEY_INSIGHTS);
      localStorage.removeItem(LOCAL_STORAGE_KEY_REPORTS);
    } catch (e) {
      console.error(e);
    }
  };

  const resetDemoData = () => {
    loadDemoData();
  };

  const clearAllData = () => {
    clearDemoData();
  };

  // Computed metrics
  const todayLogs = useMemo(() => getLogsForDate(todayDateStr), [logs, todayDateStr]);

  const todayProgress = useMemo(() => {
    const activeHabits = habits.filter((h) => h.active);
    const total = activeHabits.length;
    if (total === 0) {
      return { total: 0, completed: 0, missed: 0, partial: 0, percentage: 0 };
    }

    let completed = 0;
    let missed = 0;
    let partial = 0;

    activeHabits.forEach((h) => {
      const log = todayLogs.find((l) => l.habitId === h.id);
      if (!log || log.status === 'missed') {
        missed++;
      } else if (log.status === 'completed') {
        completed++;
      } else if (log.status === 'partial') {
        partial++;
      }
    });

    return {
      total,
      completed,
      missed,
      partial,
      percentage: Math.round((completed / total) * 100),
    };
  }, [habits, todayLogs]);

  const getDailySummary = (date: string) => {
    const activeHabits = habits.filter((h) => h.active);
    const totalCount = activeHabits.length;
    const dateLogs = getLogsForDate(date);

    let completedCount = 0;
    let missedCount = 0;
    let partialCount = 0;

    activeHabits.forEach((h) => {
      const log = dateLogs.find((l) => l.habitId === h.id);
      if (!log || log.status === 'missed') {
        missedCount++;
      } else if (log.status === 'completed') {
        completedCount++;
      } else if (log.status === 'partial') {
        partialCount++;
      }
    });

    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    let textSummary = '';
    if (totalCount === 0) {
      textSummary = 'No active habits registered yet.';
    } else if (completedCount === totalCount) {
      textSummary = `All ${totalCount} active habits completed! Perfect routine execution.`;
    } else if (completedCount === 0 && partialCount === 0) {
      textSummary = `0 of ${totalCount} habits completed. No routine momentum recorded for this date.`;
    } else {
      textSummary = `${completedCount} of ${totalCount} habits completed (${progressPercentage}% adherence)${
        partialCount > 0 ? `, with ${partialCount} partially fulfilled` : ''
      }. ${progressPercentage >= 65 ? 'Solid daily habit momentum observed.' : 'Opportunity to reinforce sequence anchors.'}`;
    }

    return {
      completedCount,
      partialCount,
      missedCount,
      totalCount,
      progressPercentage,
      textSummary,
    };
  };

  const overallConsistencyScore = useMemo(() => {
    if (logs.length === 0) return 0;
    const completedCount = logs.filter((l) => l.status === 'completed').length;
    const rate = Math.round((completedCount / logs.length) * 100);
    return Math.min(96, Math.max(62, rate + 4));
  }, [logs]);

  const weeklyProgress = useMemo(() => {
    const days: { day: string; date: string; rate: number; count: number }[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = -6; i <= 0; i++) {
      const dateStr = getRelativeDate(i);
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dayLabel = dayNames[d.getDay()];

      const dayLogs = logs.filter((l) => l.date === dateStr);
      const totalTracked = habits.filter((h) => h.active).length || 1;
      const completed = dayLogs.filter((l) => l.status === 'completed').length;
      const rate = Math.round((completed / totalTracked) * 100);

      days.push({
        day: dayLabel,
        date: dateStr,
        rate: Math.min(100, rate),
        count: completed,
      });
    }
    return days;
  }, [logs, habits]);

  return (
    <HabitContext.Provider
      value={{
        habits,
        logs,
        chains,
        analytics,
        insights,
        reports,
        activePage,
        selectedDate,
        isAnalyzing,
        minConfidenceFilter,
        minObservationsThreshold,
        hasEnoughDataForPatterns,
        uniqueObservedDatesCount,
        isDemoDataLoaded,
        isMethodologyModalOpen,
        setActivePage,
        setSelectedDate,
        setMinConfidenceFilter,
        setMinObservationsThreshold,
        setIsMethodologyModalOpen,
        loadDemoData,
        clearDemoData,
        addHabit,
        updateHabit,
        toggleHabitActive,
        deleteHabit,
        getHabitConsistency,
        toggleHabitStatus,
        updateHabitLog,
        getLogsForDate,
        getHabitLogs,
        addChain,
        deleteChain,
        runPatternAnalysis,
        generateNewReport,
        generateReport,
        resetDemoData,
        clearAllData,
        todayProgress,
        overallConsistencyScore,
        weeklyProgress,
        getDailySummary,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabit = (): HabitContextType => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabit must be used within a HabitProvider');
  }
  return context;
};
