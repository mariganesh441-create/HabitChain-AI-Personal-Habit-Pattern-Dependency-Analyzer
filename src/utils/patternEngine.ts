import {
  Habit,
  DailyHabitLog,
  HabitChain,
  AIInsight,
  Report,
  ReportMetrics,
  RelationshipStrengthLabel,
} from '../types';

/**
 * Calculates consistency rate for a habit from a set of daily logs
 */
export const calculateHabitConsistency = (
  habitId: string,
  logs: DailyHabitLog[]
): {
  rate: number;
  completedCount: number;
  totalLoggedDays: number;
  missedCount: number;
} => {
  const habitLogs = logs.filter((l) => l.habitId === habitId);
  const totalLoggedDays = habitLogs.length;
  if (totalLoggedDays === 0) {
    return { rate: 0, completedCount: 0, totalLoggedDays: 0, missedCount: 0 };
  }

  const completedCount = habitLogs.filter((l) => l.status === 'completed').length;
  const partialCount = habitLogs.filter((l) => l.status === 'partial').length;
  const missedCount = habitLogs.filter((l) => l.status === 'missed' || l.status === 'skipped').length;

  // Weighted score: full completion = 1, partial = 0.5
  const weightedTotal = completedCount + partialCount * 0.5;
  const rate = Math.round((weightedTotal / totalLoggedDays) * 100);

  return { rate, completedCount, totalLoggedDays, missedCount };
};

/**
 * Dynamically generates academic, observation-grounded AI insights from actual user habit logs
 */
export const generateInsightsFromData = (
  habits: Habit[],
  logs: DailyHabitLog[],
  chains: HabitChain[],
  minObservationsThreshold: number = 5
): AIInsight[] => {
  const activeHabits = habits.filter((h) => h.active);
  const uniqueDates = Array.from(new Set(logs.map((l) => l.date))).sort();

  // If fewer than threshold logged days or fewer than 2 active habits, insufficient data
  if (uniqueDates.length < minObservationsThreshold || activeHabits.length < 2) {
    return [];
  }

  const totalDays = uniqueDates.length;
  const observationPeriod = `Past ${totalDays} Days`;
  const generatedInsights: AIInsight[] = [];
  const todayStr = uniqueDates[uniqueDates.length - 1] || new Date().toISOString().split('T')[0];

  // Helper map: date -> map(habitId -> log)
  const logsByDate = new Map<string, Map<string, DailyHabitLog>>();
  uniqueDates.forEach((date) => {
    const dayMap = new Map<string, DailyHabitLog>();
    logs.filter((l) => l.date === date).forEach((l) => dayMap.set(l.habitId, l));
    logsByDate.set(date, dayMap);
  });

  // 1. POSITIVE PATTERNS
  // Search pairs (A, B) where P(B completed | A completed) is significantly high
  let bestPositivePair: {
    source: Habit;
    target: Habit;
    pBoth: number;
    pTargetGivenSource: number;
    pTargetGivenNotSource: number;
    sourceCompletedCount: number;
    bothCompletedCount: number;
  } | null = null;

  for (const src of activeHabits) {
    for (const tgt of activeHabits) {
      if (src.id === tgt.id) continue;

      let srcDoneDays = 0;
      let bothDoneDays = 0;
      let srcNotDoneDays = 0;
      let tgtDoneWhenSrcNotDone = 0;

      uniqueDates.forEach((d) => {
        const dayMap = logsByDate.get(d);
        const sLog = dayMap?.get(src.id);
        const tLog = dayMap?.get(tgt.id);

        const sCompleted = sLog?.status === 'completed';
        const tCompleted = tLog?.status === 'completed';

        if (sCompleted) {
          srcDoneDays++;
          if (tCompleted) bothDoneDays++;
        } else {
          srcNotDoneDays++;
          if (tCompleted) tgtDoneWhenSrcNotDone++;
        }
      });

      if (srcDoneDays >= 3) {
        const pTargetGivenSource = bothDoneDays / srcDoneDays;
        const pTargetGivenNotSource =
          srcNotDoneDays > 0 ? tgtDoneWhenSrcNotDone / srcNotDoneDays : 0.5;

        if (pTargetGivenSource >= 0.70) {
          if (!bestPositivePair || pTargetGivenSource > bestPositivePair.pTargetGivenSource) {
            bestPositivePair = {
              source: src,
              target: tgt,
              pBoth: bothDoneDays / totalDays,
              pTargetGivenSource,
              pTargetGivenNotSource,
              sourceCompletedCount: srcDoneDays,
              bothCompletedCount: bothDoneDays,
            };
          }
        }
      }
    }
  }

  if (bestPositivePair) {
    const { source, target, pTargetGivenSource, pTargetGivenNotSource, bothCompletedCount, sourceCompletedCount } =
      bestPositivePair;
    const ratePct = Math.round(pTargetGivenSource * 100);
    const altRatePct = Math.round(pTargetGivenNotSource * 100);

    generatedInsights.push({
      id: `insight-pos-${source.id}-${target.id}`,
      title: `Co-Occurrence Synergy: ${source.name} ➔ ${target.name}`,
      description: `Your ${target.name.toLowerCase()} habit is more consistent on days when ${source.name.toLowerCase()} is completed (${ratePct}% vs ${altRatePct}% on days when omitted).`,
      type: 'positive_pattern',
      confidence: Math.min(0.96, Math.round((0.75 + (bothCompletedCount / totalDays) * 0.2) * 100) / 100),
      strengthLabel: ratePct >= 80 ? 'Strong Association' : 'Moderate Association',
      supportingData: `Observed together on ${bothCompletedCount} of ${sourceCompletedCount} days (${ratePct}% co-occurrence).`,
      observationPeriod,
      relatedHabitIds: [source.id, target.id],
      dateGenerated: todayStr,
      scientificNote:
        'Empirical co-occurrence correlation; does not imply physical causation. Demonstrates habit stacking synergy.',
    });
  }

  // 2. CONSISTENCY INSIGHTS
  const habitConsistencies = activeHabits
    .map((h) => ({
      habit: h,
      ...calculateHabitConsistency(h.id, logs),
    }))
    .sort((a, b) => b.rate - a.rate);

  if (habitConsistencies.length > 0) {
    const top = habitConsistencies[0];
    generatedInsights.push({
      id: `insight-const-${top.habit.id}`,
      title: `Consistency Anchor: ${top.habit.name}`,
      description: `Your ${top.habit.name} habit is your most reliable routine anchor, maintaining an observed ${top.rate}% completion consistency across ${top.totalLoggedDays} logged sessions.`,
      type: 'consistency_insight',
      confidence: 0.94,
      strengthLabel: 'Strong Association',
      supportingData: `Successfully satisfied on ${top.completedCount} of ${top.totalLoggedDays} days (${top.rate}% adherence).`,
      observationPeriod,
      relatedHabitIds: [top.habit.id],
      dateGenerated: todayStr,
      scientificNote:
        'Consistent anchor habits serve as stable foundations for chaining subsequent behavioral steps.',
    });
  }

  // 3. ASSOCIATION INSIGHTS (Pairwise & Sequential Relationships)
  const topChain = chains[0];
  if (topChain) {
    const srcHabit = habits.find((h) => h.id === topChain.sourceHabit);
    const tgtHabit = habits.find((h) => h.id === topChain.targetHabit);

    if (srcHabit && tgtHabit) {
      const isNextDay = topChain.timingType === 'next_day';
      generatedInsights.push({
        id: `insight-assoc-${topChain.id}`,
        title: `Observed Association: ${srcHabit.name} ➔ ${tgtHabit.name}`,
        description: `Your most repeated observed pattern is ${srcHabit.name} ➔ ${tgtHabit.name}. Executing ${srcHabit.name} exhibits a ${Math.round(topChain.relationshipStrength * 100)}% observed probability of completing ${tgtHabit.name}${isNextDay ? ' on the following day' : ' later that day'}.`,
        type: 'association_insight',
        confidence: topChain.confidence || 0.9,
        strengthLabel: topChain.strengthLabel || 'Strong Association',
        supportingData: `Observed co-occurrence in ${topChain.occurrenceCount} instances over ${topChain.observationPeriod || observationPeriod}.`,
        observationPeriod: topChain.observationPeriod || observationPeriod,
        relatedHabitIds: [srcHabit.id, tgtHabit.id],
        dateGenerated: todayStr,
        scientificNote:
          'Longitudinal frequency modeling shows repeated sequential pairing; statistical association, not deterministic causation.',
      });
    }
  }

  // 4. TREND INSIGHTS (Chronological comparison: first half vs second half)
  if (uniqueDates.length >= 4) {
    const half = Math.floor(uniqueDates.length / 2);
    const firstHalfDates = uniqueDates.slice(0, half);
    const secondHalfDates = uniqueDates.slice(half);

    const firstHalfLogs = logs.filter((l) => firstHalfDates.includes(l.date));
    const secondHalfLogs = logs.filter((l) => secondHalfDates.includes(l.date));

    const firstCompleted = firstHalfLogs.filter((l) => l.status === 'completed').length;
    const firstTotal = firstHalfLogs.length || 1;
    const firstRate = Math.round((firstCompleted / firstTotal) * 100);

    const secondCompleted = secondHalfLogs.filter((l) => l.status === 'completed').length;
    const secondTotal = secondHalfLogs.length || 1;
    const secondRate = Math.round((secondCompleted / secondTotal) * 100);

    const diff = secondRate - firstRate;
    const trendDirection = diff >= 0 ? 'gain' : 'dip';
    const absDiff = Math.abs(diff);

    generatedInsights.push({
      id: `insight-trend-window`,
      title: `Adherence Trajectory: ${diff >= 0 ? '+' : '-'}${absDiff}% Routine Trend`,
      description: `Aggregated completion shifted from ${firstRate}% in the first half of observation to ${secondRate}% in the recent period, reflecting ${diff >= 0 ? 'strengthening' : 'fluctuating'} routine momentum.`,
      type: 'trend_insight',
      confidence: 0.89,
      strengthLabel: absDiff >= 15 ? 'Strong Association' : 'Moderate Association',
      supportingData: `${firstRate}% baseline vs ${secondRate}% recent window (${diff >= 0 ? '+' : ''}${diff}% net change).`,
      observationPeriod,
      relatedHabitIds: activeHabits.slice(0, 3).map((h) => h.id),
      dateGenerated: todayStr,
      scientificNote:
        'Moving window evaluation identifies period-over-period rhythm stability across the tracked cohort.',
    });
  }

  // 5. ATTENTION AREAS (Friction or Vulnerability)
  if (habitConsistencies.length > 0) {
    const lowest = habitConsistencies[habitConsistencies.length - 1];
    const top = habitConsistencies[0];

    if (lowest && lowest.rate < 85) {
      generatedInsights.push({
        id: `insight-attn-${lowest.habit.id}`,
        title: `Attention Area: ${lowest.habit.name} Vulnerability`,
        description: `Your ${lowest.habit.name} habit exhibits the highest variance (${lowest.rate}% consistency, ${lowest.missedCount} missed occurrences). Stacking it immediately after ${top.habit.name} may reinforce follow-through.`,
        type: 'attention_area',
        confidence: 0.84,
        strengthLabel: 'Moderate Association',
        supportingData: `${lowest.missedCount} recorded misses across ${lowest.totalLoggedDays} observation days.`,
        observationPeriod,
        relatedHabitIds: [lowest.habit.id, top.habit.id],
        dateGenerated: todayStr,
        scientificNote:
          'High dropout habits benefit from habit chaining directly following high-probability anchor routines.',
      });
    }
  }

  return generatedInsights;
};

/**
 * Generates an empirical Report from habit data and selected parameters
 */
export const generateReportFromData = (params: {
  reportType: 'daily' | 'weekly' | 'monthly' | 'custom';
  startDate?: string;
  endDate?: string;
  habits: Habit[];
  logs: DailyHabitLog[];
  chains: HabitChain[];
  insights: AIInsight[];
}): Report => {
  const { reportType, habits, logs, chains, insights } = params;
  const activeHabits = habits.filter((h) => h.active);
  const allDates = Array.from(new Set(logs.map((l) => l.date))).sort();
  const latestDate = allDates[allDates.length - 1] || new Date().toISOString().split('T')[0];

  // Determine date bounds
  let targetDates: string[] = [];
  let timeRangeLabel = '';

  if (reportType === 'daily') {
    const targetDate = params.endDate || latestDate;
    targetDates = [targetDate];
    timeRangeLabel = `Daily Snapshot (${targetDate})`;
  } else if (reportType === 'weekly') {
    targetDates = allDates.slice(-7);
    if (targetDates.length === 0) targetDates = [latestDate];
    timeRangeLabel = `Weekly Evaluation (${targetDates[0]} to ${targetDates[targetDates.length - 1]})`;
  } else if (reportType === 'monthly') {
    targetDates = allDates.slice(-30);
    if (targetDates.length === 0) targetDates = [latestDate];
    timeRangeLabel = `Monthly Comprehensive Audit (${targetDates[0]} to ${targetDates[targetDates.length - 1]})`;
  } else {
    // custom
    const start = params.startDate || allDates[0] || latestDate;
    const end = params.endDate || latestDate;
    targetDates = allDates.filter((d) => d >= start && d <= end);
    if (targetDates.length === 0) targetDates = [latestDate];
    timeRangeLabel = `Custom Audit Window (${start} to ${end})`;
  }

  // Filter logs to target dates
  const filteredLogs = logs.filter((l) => targetDates.includes(l.date));

  // Calculate metrics
  let totalHabitInstances = 0;
  let completedInstances = 0;
  let missedHabitCount = 0;

  activeHabits.forEach((h) => {
    targetDates.forEach((d) => {
      totalHabitInstances++;
      const log = filteredLogs.find((l) => l.habitId === h.id && l.date === d);
      if (log?.status === 'completed') {
        completedInstances++;
      } else if (log?.status === 'partial') {
        completedInstances += 0.5;
      } else {
        missedHabitCount++;
      }
    });
  });

  const completionPercentage =
    totalHabitInstances > 0 ? Math.round((completedInstances / totalHabitInstances) * 100) : 0;

  // Habit consistency ranking in this period
  const habitStats = activeHabits
    .map((h) => {
      const hLogs = filteredLogs.filter((l) => l.habitId === h.id);
      const done = hLogs.filter((l) => l.status === 'completed').length;
      const count = hLogs.length || 1;
      const consistency = Math.round((done / count) * 100);

      // Trend estimation: compare first half to second half of window
      const half = Math.floor(targetDates.length / 2);
      let trend: 'improving' | 'stable' | 'declining' = 'stable';
      if (half >= 2) {
        const firstDates = targetDates.slice(0, half);
        const secondDates = targetDates.slice(half);
        const firstDone = filteredLogs.filter(
          (l) => l.habitId === h.id && firstDates.includes(l.date) && l.status === 'completed'
        ).length / (firstDates.length || 1);
        const secondDone = filteredLogs.filter(
          (l) => l.habitId === h.id && secondDates.includes(l.date) && l.status === 'completed'
        ).length / (secondDates.length || 1);

        if (secondDone - firstDone > 0.1) trend = 'improving';
        else if (firstDone - secondDone > 0.1) trend = 'declining';
      }

      return {
        habitId: h.id,
        habitName: h.name,
        consistency,
        trend,
      };
    })
    .sort((a, b) => b.consistency - a.consistency);

  const topHabit = habitStats[0]?.habitName || 'None identified';
  const vulnerableHabit =
    habitStats.length > 1 ? habitStats[habitStats.length - 1]?.habitName : 'None identified';

  // Detected Chains in this window
  const topChain = chains[0];
  const strongestChainStr = topChain
    ? `${habits.find((h) => h.id === topChain.sourceHabit)?.name || 'Habit'} ➔ ${
        habits.find((h) => h.id === topChain.targetHabit)?.name || 'Target'
      } (${Math.round(topChain.relationshipStrength * 100)}% strength)`
    : 'No active chains observed';

  const detectedChainsSummary = chains.slice(0, 4).map((c) => {
    const s = habits.find((h) => h.id === c.sourceHabit)?.name || 'Source';
    const t = habits.find((h) => h.id === c.targetHabit)?.name || 'Target';
    return `${s} ➔ ${t} (${Math.round(c.relationshipStrength * 100)}% association, ${c.strengthLabel})`;
  });

  // Important observed patterns
  const importantObservedPatterns = insights.slice(0, 3).map((ins) => ins.description);
  if (importantObservedPatterns.length === 0) {
    importantObservedPatterns.push(
      `Observed overall completion consistency of ${completionPercentage}% across ${activeHabits.length} monitored routines.`
    );
  }

  // AI-generated summary (non-causal, objective)
  const aiSummary = `During the ${timeRangeLabel.toLowerCase()}, a total of ${totalHabitInstances} habit opportunities were monitored across ${activeHabits.length} active habits. The observed overall completion rate reached ${completionPercentage}%, with ${missedHabitCount} uncompleted habit events. Analysis indicates that "${topHabit}" demonstrated the highest execution consistency, while "${vulnerableHabit}" exhibited higher frequency of disruption. Cross-habit dependency analysis identifies ${chains.length} statistically significant sequential chains. These findings describe observed behavioral associations and provide empirical guidance for routine structure optimization.`;

  const recommendations = [
    `Anchor lower-consistency habits directly after "${topHabit}" to leverage established routine momentum.`,
    `Review time blocks during high-dropout periods to reduce schedule friction.`,
    `Log completions within the active window to maintain longitudinal data fidelity.`,
  ];

  const reportId = `report-${Date.now()}`;
  const title =
    reportType === 'daily'
      ? `Daily Habit Execution Audit (${targetDates[0] || latestDate})`
      : reportType === 'weekly'
      ? `Weekly Habit Dependency & Adherence Report`
      : reportType === 'monthly'
      ? `Monthly Behavioral Pattern Synthesis`
      : `Custom Period Habit Correlation Analysis`;

  const report: Report = {
    id: reportId,
    title,
    generatedDate: latestDate,
    timeRange: timeRangeLabel,
    reportType,
    startDate: targetDates[0],
    endDate: targetDates[targetDates.length - 1],
    summaryText: aiSummary,
    aiSummary,
    metrics: {
      avgCompletionRate: completionPercentage,
      strongestChain: strongestChainStr,
      topHabit,
      vulnerableHabit,
      chainsAnalyzed: chains.length,
      totalHabits: activeHabits.length,
      completionPercentage,
      missedHabitCount,
      bestConsistency: topHabit,
      habitTrends: habitStats,
    },
    detectedChainsSummary,
    importantObservedPatterns,
    recommendations,
    academicMethodologyNotes:
      'Metrics computed via longitudinal empirical log evaluation. Statistical co-occurrences and contingency ratios describe observed patterns and do not constitute deterministic or medical claims.',
  };

  return report;
};
