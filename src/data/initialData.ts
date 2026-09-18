import { Habit, DailyHabitLog, HabitChain, AnalyticsRecord, AIInsight, Report } from '../types';

// Helper to generate dates relative to today
export const getRelativeDate = (daysOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    name: 'Morning Hydration & Electrolytes',
    category: 'Hydration',
    description: 'Drink 500ml water and electrolytes immediately upon waking before caffeine.',
    targetFrequency: 'daily',
    active: true,
    createdAt: '2026-08-15T07:00:00Z',
    timeOfDay: 'morning',
    iconName: 'Droplet',
    color: '#2DD4BF', // Teal
  },
  {
    id: 'habit-2',
    name: '25-min Focused Study Block',
    category: 'Study',
    description: 'Undivided attention on priority university coursework with notification blackout.',
    targetFrequency: 'daily',
    active: true,
    createdAt: '2026-08-15T08:30:00Z',
    timeOfDay: 'morning',
    iconName: 'Brain',
    color: '#7C3AED', // Purple
  },
  {
    id: 'habit-3',
    name: 'Lecture Review & Flashcards',
    category: 'Study',
    description: 'Active recall spaced repetition of today\'s lecture modules and seminar readings.',
    targetFrequency: 'weekdays',
    active: true,
    createdAt: '2026-08-16T14:00:00Z',
    timeOfDay: 'afternoon',
    iconName: 'BookOpen',
    color: '#7C3AED',
  },
  {
    id: 'habit-4',
    name: 'Afternoon Cardio / Gym',
    category: 'Exercise',
    description: '30-45 minutes of campus fitness, resistance training, or brisk jog.',
    targetFrequency: '4x/week',
    active: true,
    createdAt: '2026-08-16T16:30:00Z',
    timeOfDay: 'afternoon',
    iconName: 'Activity',
    color: '#F472B6', // Pink
  },
  {
    id: 'habit-5',
    name: 'Mindful Breathing & Journal',
    category: 'Personal',
    description: '10 minutes of nervous system regulation and quick retrospective journaling.',
    targetFrequency: 'daily',
    active: true,
    createdAt: '2026-08-18T20:30:00Z',
    timeOfDay: 'evening',
    iconName: 'Sparkles',
    color: '#2DD4BF',
  },
  {
    id: 'habit-6',
    name: 'Screen-Free Wind Down',
    category: 'Screen Time',
    description: 'Power down laptops and mobile screens at least 45 minutes before sleep.',
    targetFrequency: 'daily',
    active: true,
    createdAt: '2026-08-18T22:00:00Z',
    timeOfDay: 'night',
    iconName: 'Moon',
    color: '#7C3AED',
  },
  {
    id: 'habit-7',
    name: 'In Bed by 11:30 PM',
    category: 'Sleep',
    description: 'Lights out target to safeguard 8 hours of restorative cognitive recovery.',
    targetFrequency: 'daily',
    active: true,
    createdAt: '2026-08-20T23:30:00Z',
    timeOfDay: 'night',
    iconName: 'Clock',
    color: '#F472B6',
  },
  {
    id: 'habit-8',
    name: 'Nutrient-Dense Lunch & Meal Prep',
    category: 'Food',
    description: 'Balanced whole-food meal with protein and complex carbs to sustain afternoon focus.',
    targetFrequency: 'daily',
    active: true,
    createdAt: '2026-08-21T12:30:00Z',
    timeOfDay: 'afternoon',
    iconName: 'Apple',
    color: '#2DD4BF',
  },
  {
    id: 'habit-9',
    name: 'Daily Priority Planning & Task Review',
    category: 'Productivity',
    description: 'Identify the top 3 high-impact objectives before starting coursework or deep work.',
    targetFrequency: 'weekdays',
    active: true,
    createdAt: '2026-08-22T08:00:00Z',
    timeOfDay: 'morning',
    iconName: 'CheckSquare',
    color: '#7C3AED',
  }
];

export const INITIAL_CHAINS: HabitChain[] = [
  {
    id: 'chain-1',
    sourceHabit: 'habit-1', // Hydration
    targetHabit: 'habit-2', // Study Block
    relationshipStrength: 0.88,
    occurrenceCount: 12,
    sourceOccurrences: 14,
    coOccurrences: 12,
    observationPeriod: 'Past 14 Days',
    dateRange: 'Past 14 Days',
    confidence: 0.92,
    strengthLabel: 'Strong Association',
    timingType: 'same_day',
    createdAt: '2026-09-01T00:00:00Z',
    relationshipType: 'sequential_cascade',
    patternDescription: 'Observed pattern: Morning Hydration and Focused Study Block appeared together on 12 of 14 observed days.',
    explanation: 'Morning Hydration and 25-min Focused Study Block appeared together on 12 of 14 observed days.',
    temporalGapMinutes: 45
  },
  {
    id: 'chain-2',
    sourceHabit: 'habit-2', // Study Block
    targetHabit: 'habit-3', // Lecture Review
    relationshipStrength: 0.81,
    occurrenceCount: 10,
    sourceOccurrences: 12,
    coOccurrences: 10,
    observationPeriod: 'Past 14 Days',
    dateRange: 'Past 14 Days',
    confidence: 0.87,
    strengthLabel: 'Strong Association',
    timingType: 'same_day',
    createdAt: '2026-09-02T00:00:00Z',
    relationshipType: 'sequential_cascade',
    patternDescription: 'Observed pattern: A completed morning study block showed an 81% co-occurrence with afternoon lecture review.',
    explanation: 'Focused Study Block and Lecture Review appeared together on 10 of 12 observed study days.',
    temporalGapMinutes: 180
  },
  {
    id: 'chain-3',
    sourceHabit: 'habit-6', // Screen-Free Wind Down
    targetHabit: 'habit-7', // In Bed by 11:30 PM
    relationshipStrength: 0.92,
    occurrenceCount: 12,
    sourceOccurrences: 13,
    coOccurrences: 12,
    observationPeriod: 'Past 14 Days',
    dateRange: 'Past 14 Days',
    confidence: 0.95,
    strengthLabel: 'Strong Association',
    timingType: 'same_day',
    createdAt: '2026-09-03T00:00:00Z',
    relationshipType: 'mutual_anchor',
    patternDescription: 'Observed association: Screen-free wind down appeared together with on-time sleep on 12 of 13 observed nights.',
    explanation: 'Screen-Free Wind Down and In Bed by 11:30 PM appeared together on 12 of 13 observed days.',
    temporalGapMinutes: 40
  },
  {
    id: 'chain-4',
    sourceHabit: 'habit-4', // Gym
    targetHabit: 'habit-5', // Mindful Breathing
    relationshipStrength: 0.70,
    occurrenceCount: 7,
    sourceOccurrences: 10,
    coOccurrences: 7,
    observationPeriod: 'Past 14 Days',
    dateRange: 'Past 14 Days',
    confidence: 0.79,
    strengthLabel: 'Moderate Association',
    timingType: 'same_day',
    createdAt: '2026-09-05T00:00:00Z',
    relationshipType: 'sequential_cascade',
    patternDescription: 'Observed pattern: Afternoon fitness and evening mindfulness appeared together on 7 of 10 workout days.',
    explanation: 'Afternoon Cardio / Gym and Mindful Breathing appeared together on 7 of 10 observed days.',
    temporalGapMinutes: 210
  },
  {
    id: 'chain-5',
    sourceHabit: 'habit-7', // Sleep on time
    targetHabit: 'habit-1', // Next Day Hydration
    relationshipStrength: 0.85,
    occurrenceCount: 11,
    sourceOccurrences: 13,
    coOccurrences: 11,
    observationPeriod: 'Past 14 Days',
    dateRange: 'Past 14 Days',
    confidence: 0.89,
    strengthLabel: 'Strong Association',
    timingType: 'next_day',
    createdAt: '2026-09-08T00:00:00Z',
    relationshipType: 'sequential_cascade',
    patternDescription: 'Observed next-day pattern: On-time sleep was followed by next-morning hydration on 11 of 13 mornings.',
    explanation: 'In Bed by 11:30 PM was followed by Morning Hydration the next morning on 11 of 13 observed days.',
    temporalGapMinutes: 480
  }
];

// Generate 14 days of realistic logs
export const generateInitialLogs = (): DailyHabitLog[] => {
  const logs: DailyHabitLog[] = [];
  const habits = INITIAL_HABITS;

  for (let i = -13; i <= 0; i++) {
    const dateStr = getRelativeDate(i);
    const isToday = i === 0;

    habits.forEach((habit, habitIdx) => {
      // Create correlated simulated status patterns
      let status: 'completed' | 'skipped' | 'missed' | 'partial' = 'completed';
      let completionValue = 100;
      let notes = '';

      if (isToday) {
        // Today has some completed morning habits and evening pending/ready
        if (habitIdx < 3) {
          status = 'completed';
          completionValue = 100;
          notes = 'Completed on schedule.';
        } else if (habitIdx === 3) {
          status = 'completed';
          completionValue = 85;
          notes = 'Completed 35 min campus workout.';
        } else {
          status = 'partial';
          completionValue = 30;
          notes = 'In progress for tonight\'s routine.';
        }
      } else {
        // Past patterns: simulate correlated adherence
        const pseudoRandom = Math.sin(i * 11 + habitIdx * 7);
        if (pseudoRandom > 0.6) {
          status = 'completed';
          completionValue = 100;
        } else if (pseudoRandom < -0.6) {
          status = 'missed';
          completionValue = 0;
          notes = 'Missed during heavy mid-term assignment prep.';
        } else {
          status = 'completed';
          completionValue = 100;
        }
      }

      logs.push({
        id: `log-${dateStr}-${habit.id}`,
        habitId: habit.id,
        date: dateStr,
        status,
        completionValue,
        notes: notes || 'Standard daily logging entry.'
      });
    });
  }

  return logs;
};

export const INITIAL_ANALYTICS: AnalyticsRecord[] = Array.from({ length: 14 }).map((_, idx) => {
  const dayOffset = idx - 13;
  const dateStr = getRelativeDate(dayOffset);
  const baseRate = 72 + Math.round(Math.sin(idx * 0.9) * 18);
  const consistency = 78 + Math.round(Math.cos(idx * 0.8) * 14);

  return {
    id: `analytics-${dateStr}`,
    date: dateStr,
    totalHabitsTracked: 7,
    completionRate: Math.min(100, Math.max(50, baseRate)),
    consistencyScore: Math.min(100, Math.max(60, consistency)),
    activeChainsDetected: 5,
    peakPerformanceHour: idx % 2 === 0 ? '09:00 AM' : '10:30 AM',
    dominantCategory: 'Focus & Academics'
  };
});

export const INITIAL_INSIGHTS: AIInsight[] = [
  {
    id: 'insight-1',
    title: 'Co-Occurrence Synergy: Morning Hydration ➔ Focused Study',
    description: 'Your study habit is more consistent on days when your morning hydration log is completed.',
    type: 'positive_pattern',
    confidence: 0.92,
    strengthLabel: 'Strong Association',
    supportingData: 'Completed study blocks on 11 of 12 days (92%) when hydration was completed vs 42% when omitted.',
    observationPeriod: 'Past 14 Days',
    relatedHabitIds: ['habit-1', 'habit-2'],
    dateGenerated: getRelativeDate(0),
    scientificNote: 'Observed co-occurrence correlation; reflects intentional habit stacking in routine rather than biological causation.'
  },
  {
    id: 'insight-2',
    title: 'Consistency Anchor: Morning Hydration & Electrolytes',
    description: 'Morning Hydration maintains the highest longitudinal adherence index among all monitored habits (93% consistency).',
    type: 'consistency_insight',
    confidence: 0.94,
    strengthLabel: 'Strong Association',
    supportingData: 'Achieved 93% completion regularity across 13 of 14 days with zero consecutive omissions.',
    observationPeriod: 'Past 14 Days',
    relatedHabitIds: ['habit-1'],
    dateGenerated: getRelativeDate(-1),
    scientificNote: 'High consistency habits serve as stable foundational anchors for stacking downstream behaviors.'
  },
  {
    id: 'insight-3',
    title: 'Sequential Association: Screen-Free Wind Down ➔ Target Bedtime',
    description: 'Screen-Free Wind Down and In Bed by 11:30 PM appeared together on 12 of 13 observed evenings (92% association rate).',
    type: 'association_insight',
    confidence: 0.95,
    strengthLabel: 'Strong Association',
    supportingData: 'Screen-free wind down preceded on-time sleep on 12 of 13 observed nights with 40-minute lag.',
    observationPeriod: 'Past 14 Days',
    relatedHabitIds: ['habit-6', 'habit-7'],
    dateGenerated: getRelativeDate(-2),
    scientificNote: 'Observed conditional dependency; eliminating screens is closely coupled with timely sleep initiation.'
  },
  {
    id: 'insight-4',
    title: 'Adherence Trend: Afternoon Study Blocks Showing 18% Gain',
    description: 'Study block adherence improved from 71% in week 1 to 89% in week 2 as morning hydration consistency stabilized.',
    type: 'trend_insight',
    confidence: 0.88,
    strengthLabel: 'Strong Association',
    supportingData: '+18% net completion gain observed across the latter 7 days compared to baseline.',
    observationPeriod: 'Past 14 Days',
    relatedHabitIds: ['habit-2', 'habit-3'],
    dateGenerated: getRelativeDate(-3),
    scientificNote: 'Longitudinal trend evaluation reflects positive behavioral momentum and routine stabilization.'
  },
  {
    id: 'insight-5',
    title: 'Attention Area: Lecture Review & Flashcards Vulnerability',
    description: 'Lecture Review exhibits the highest variance (64% consistency, 5 missed occurrences), frequently omitted on heavy workout days.',
    type: 'attention_area',
    confidence: 0.84,
    strengthLabel: 'Moderate Association',
    supportingData: '5 recorded misses across 14 observation days; drops to 40% adherence when workout exceeds 45 minutes.',
    observationPeriod: 'Past 14 Days',
    relatedHabitIds: ['habit-3', 'habit-4'],
    dateGenerated: getRelativeDate(-4),
    scientificNote: 'Observed cognitive fatigue trade-off; afternoon mental tasks benefit from earlier scheduling.'
  }
];

export const INITIAL_REPORTS: Report[] = [
  {
    id: 'report-1',
    title: 'Mid-Semester Behavioral Pattern & Habit Dependency Audit',
    generatedDate: getRelativeDate(0),
    timeRange: 'Past 14 Days (Empirical Observation Window)',
    summaryText: 'Analysis of 14-day tracking data reveals 5 statistically robust habit chains. Morning anchor habits exhibit the highest predictability cascade, while evening routines demonstrate tight binary coupling.',
    metrics: {
      avgCompletionRate: 84,
      strongestChain: 'Screen-Free Wind Down → Bed by 11:30 PM (94% strength)',
      topHabit: 'Morning Hydration & Electrolytes (93% consistency)',
      vulnerableHabit: 'Lecture Review & Flashcards (64% consistency)',
      chainsAnalyzed: 5
    },
    recommendations: [
      'Maintain the 08:30 AM morning anchor: Hydration serves as the primary gateway habit to focused study.',
      'Protect the 45-minute screen barrier: Eliminating laptop use after 10:45 PM safeguards sleep consistency.',
      'Consider shortening afternoon review sessions on heavy athletic training days to prevent routine dropout.'
    ],
    academicMethodologyNotes: 'All detected chains calculated using Pearson product-moment correlation coefficients and sequential lag-1 contingency tables. Correlation values describe observed pattern frequencies, not deterministic causality.'
  },
  {
    id: 'report-2',
    title: 'Baseline 30-Day Habit Association Synthesis',
    generatedDate: getRelativeDate(-14),
    timeRange: 'Prior Month Baseline Period',
    summaryText: 'Initial baseline dataset tracking the transition from solo habit monitoring to multi-habit interaction modeling. Core dependencies stabilized around day 11.',
    metrics: {
      avgCompletionRate: 76,
      strongestChain: 'Hydration → Focus Block (86% strength)',
      topHabit: 'Morning Hydration (89%)',
      vulnerableHabit: 'Mindful Breathing (58%)',
      chainsAnalyzed: 4
    },
    recommendations: [
      'Establish fixed temporal triggers between habit nodes to enhance chain durability.',
      'Log completion timestamps consistently within 30 minutes of habit termination.'
    ],
    academicMethodologyNotes: 'Data analyzed via HabitChain AI discrete-event dependency engine. Sample size N=210 log events.'
  }
];
