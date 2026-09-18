export type HabitCategory =
  | 'Sleep'
  | 'Study'
  | 'Exercise'
  | 'Food'
  | 'Hydration'
  | 'Screen Time'
  | 'Productivity'
  | 'Personal'
  | 'Custom'
  | 'Focus & Academics'
  | 'Physical Health'
  | 'Mindfulness & Mental'
  | 'Sleep & Recovery'
  | 'Nutrition & Hydration';

export type TargetFrequency =
  | 'daily'
  | 'weekdays'
  | 'weekends'
  | '4x/week'
  | '3x/week'
  | '2x/week';

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory | string;
  description: string;
  targetFrequency: TargetFrequency | string;
  active: boolean;
  createdAt: string;
  // UI / Academic context attributes
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  iconName?: string;
  color?: string;
}

export type HabitLogStatus = 'completed' | 'partial' | 'missed' | 'skipped';

export interface DailyHabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  status: HabitLogStatus;
  completionValue: number; // 0 - 100 percentage or minutes / units
  notes: string;
}

export type RelationshipStrengthLabel =
  | 'Strong Association'
  | 'Moderate Association'
  | 'Weak Association';

export type RelationshipType = 
  | 'positive_trigger'      // Habit A observed with high probability of Habit B
  | 'sequential_cascade'    // Habit A precedes Habit B within typical daily window
  | 'mutual_anchor'        // Habits A & B occur together as a bundle
  | 'negative_association'; // Presence of A is associated with drop in completion of B

export interface HabitChain {
  id: string;
  sourceHabit: string; // Habit ID
  targetHabit: string; // Habit ID
  relationshipStrength: number; // 0.0 to 1.0 (e.g. 0.84 = 84% strength)
  occurrenceCount: number;      // e.g. 12 times observed
  observationPeriod: string;    // e.g. "Past 14 Days"
  confidence: number;           // 0.0 to 1.0 (e.g. 0.91)
  createdAt: string;
  // Enhanced pattern detection metrics
  strengthLabel: RelationshipStrengthLabel;
  timingType?: 'same_day' | 'next_day';
  sourceOccurrences?: number;
  coOccurrences?: number;
  dateRange?: string;
  explanation?: string;
  patternDescription?: string;
  relationshipType?: RelationshipType;
  temporalGapMinutes?: number;
  detectionMethod?: string;
}

export interface AnalyticsRecord {
  id: string;
  date: string;
  totalHabitsTracked: number;
  completionRate: number;      // Percentage 0-100
  consistencyScore: number;    // Score 0-100 based on standard deviation
  activeChainsDetected: number;
  peakPerformanceHour?: string;
  dominantCategory?: string;
}

export type AIInsightType =
  | 'positive_pattern'
  | 'consistency_insight'
  | 'association_insight'
  | 'trend_insight'
  | 'attention_area'
  | 'possible_risk'
  | 'chain_insight'
  | 'friction_warning'
  | 'sequence_optimization'
  | 'observation';

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: AIInsightType;
  confidence: number; // 0.0 to 1.0
  strengthLabel?: RelationshipStrengthLabel;
  supportingData?: string; // Quantitative supporting data point
  observationPeriod?: string; // e.g. "Past 14 Days"
  relatedHabitIds: string[];
  dateGenerated: string;
  scientificNote?: string; // Explicit reminder of non-causal statistical correlation
}

export interface ReportMetrics {
  avgCompletionRate: number;
  strongestChain: string;
  topHabit: string;
  vulnerableHabit: string;
  chainsAnalyzed: number;
  totalHabits?: number;
  completionPercentage?: number;
  missedHabitCount?: number;
  bestConsistency?: string;
  habitTrends?: {
    habitId: string;
    habitName: string;
    consistency: number;
    trend: 'improving' | 'stable' | 'declining';
  }[];
}

export interface Report {
  id: string;
  title: string;
  generatedDate: string;
  timeRange: string;
  reportType?: 'daily' | 'weekly' | 'monthly' | 'custom';
  startDate?: string;
  endDate?: string;
  summaryText: string;
  aiSummary?: string;
  metrics: ReportMetrics;
  detectedChainsSummary?: string[];
  importantObservedPatterns?: string[];
  recommendations: string[];
  academicMethodologyNotes?: string;
}

export type ActivePage =
  | 'dashboard'
  | 'habits'
  | 'daily-log'
  | 'chains'
  | 'analytics'
  | 'insights'
  | 'reports'
  | 'settings';
