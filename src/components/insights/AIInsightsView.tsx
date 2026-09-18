import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  GitMerge,
  Info,
  ShieldCheck,
  TrendingUp,
  Clock,
  Calendar,
  Layers,
  ArrowRight,
  Filter,
  Search,
  BookOpen,
} from 'lucide-react';
import { useHabit } from '../../context/HabitContext';
import { AIInsightType } from '../../types';

export const AIInsightsView: React.FC = () => {
  const { habits, logs, insights, runPatternAnalysis, isAnalyzing, setActivePage } = useHabit();

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (insights.length === 0 || logs.length === 0) {
    return (
      <div id="ai-insights-insufficient-container" className="py-16">
        <div className="p-10 text-center rounded-2xl bg-[#131B33] border border-[#1E294B] max-w-md mx-auto">
          <Sparkles className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">
            More habit data is needed before meaningful insights can be generated.
          </h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Log your daily habits to allow the statistical engine to detect co-occurrences, time-based associations, and routine patterns.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
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

  const filterCategories = [
    { id: 'all', label: 'All Insights', count: insights.length },
    {
      id: 'positive_pattern',
      label: 'Positive Patterns',
      count: insights.filter((i) => i.type === 'positive_pattern').length,
    },
    {
      id: 'possible_risk',
      label: 'Risk Patterns',
      count: insights.filter((i) => i.type === 'possible_risk' || i.type === 'friction_warning').length,
    },
    {
      id: 'consistency_insight',
      label: 'Consistency',
      count: insights.filter((i) => i.type === 'consistency_insight').length,
    },
    {
      id: 'chain_insight',
      label: 'Habit Chains',
      count: insights.filter((i) => i.type === 'chain_insight' || i.type === 'sequence_optimization').length,
    },
  ];

  const filteredInsights = useMemo(() => {
    return insights.filter((item) => {
      // Category filter matching
      let matchesCategory = true;
      if (selectedCategoryFilter === 'positive_pattern') {
        matchesCategory = item.type === 'positive_pattern';
      } else if (selectedCategoryFilter === 'possible_risk') {
        matchesCategory = item.type === 'possible_risk' || item.type === 'friction_warning';
      } else if (selectedCategoryFilter === 'consistency_insight') {
        matchesCategory = item.type === 'consistency_insight';
      } else if (selectedCategoryFilter === 'chain_insight') {
        matchesCategory = item.type === 'chain_insight' || item.type === 'sequence_optimization';
      }

      // Search filter matching
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.supportingData && item.supportingData.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [insights, selectedCategoryFilter, searchQuery]);

  const getHabit = (id: string) => habits.find((h) => h.id === id);

  return (
    <div id="ai-insights-container" className="space-y-6 pb-12">
      {/* Scientific & Academic Methodology Disclaimer Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#131B33] border border-[#2DD4BF]/30 space-y-2">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4 text-[#2DD4BF]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Scientific Methodology & Observation Notice</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              These insights represent empirical statistical co-occurrences and time-lag associations derived from your personal log history. They are presented as analytical observations rather than medical conclusions or guaranteed cause-and-effect statements.
            </p>
          </div>
        </div>
      </div>

      {/* Top Controls Header */}
      <div className="p-5 rounded-2xl bg-[#131B33] border border-[#1E294B] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-[#2DD4BF]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Habit Pattern & Dependency Insights
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical correlation detection across your daily routine sequences.
            </p>
          </div>
        </div>

        <button
          id="recalculate-insights-btn"
          onClick={runPatternAnalysis}
          disabled={isAnalyzing}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-sm shadow-[#7C3AED]/30 transition-all cursor-pointer disabled:opacity-50 shrink-0 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''} text-[#2DD4BF]`} />
          <span>{isAnalyzing ? 'Evaluating Sequences...' : 'Re-Analyze Logs'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {filterCategories.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedCategoryFilter(opt.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategoryFilter === opt.id
                  ? 'bg-[#2DD4BF] text-[#0B1020] shadow-sm'
                  : 'bg-[#131B33] text-slate-300 hover:text-white border border-[#1E294B]'
              }`}
            >
              <span>{opt.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedCategoryFilter === opt.id
                    ? 'bg-[#0B1020]/20 text-[#0B1020]'
                    : 'bg-[#0B1020] text-slate-400'
                }`}
              >
                {opt.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#131B33] border border-[#1E294B] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF]"
          />
        </div>
      </div>

      {/* Insights Cards List */}
      <div className="space-y-4">
        {filteredInsights.map((insight) => {
          const isRisk = insight.type === 'possible_risk' || insight.type === 'friction_warning';
          const isPositive = insight.type === 'positive_pattern';
          const isConsistency = insight.type === 'consistency_insight';
          const isChain = insight.type === 'chain_insight' || insight.type === 'sequence_optimization';

          // Category Badge Styling
          let categoryBadgeColor = 'bg-[#7C3AED]/20 text-[#7C3AED] border-[#7C3AED]/30';
          let categoryLabel = 'Pattern Insight';
          if (isPositive) {
            categoryBadgeColor = 'bg-[#2DD4BF]/20 text-[#2DD4BF] border-[#2DD4BF]/30';
            categoryLabel = 'Positive Pattern';
          } else if (isRisk) {
            categoryBadgeColor = 'bg-[#F472B6]/20 text-[#F472B6] border-[#F472B6]/30';
            categoryLabel = 'Possible Risk Pattern';
          } else if (isConsistency) {
            categoryBadgeColor = 'bg-[#818CF8]/20 text-[#818CF8] border-[#818CF8]/30';
            categoryLabel = 'Consistency Insight';
          } else if (isChain) {
            categoryBadgeColor = 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/30';
            categoryLabel = 'Habit Chain Insight';
          }

          return (
            <div
              key={insight.id}
              id={`insight-card-${insight.id}`}
              className={`p-5 rounded-2xl bg-[#131B33] border transition-all ${
                isRisk
                  ? 'border-[#F472B6]/40 hover:border-[#F472B6]/70'
                  : isPositive
                  ? 'border-[#2DD4BF]/40 hover:border-[#2DD4BF]/70'
                  : isConsistency
                  ? 'border-[#818CF8]/40 hover:border-[#818CF8]/70'
                  : 'border-[#1E294B] hover:border-slate-600'
              }`}
            >
              {/* Header: Category Badge + Observation Period + Strength Indicator */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${categoryBadgeColor}`}
                  >
                    {categoryLabel}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {insight.observationPeriod || 'Past 14 Days'}
                  </span>
                </div>

                {/* Strength / Confidence Indicator */}
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-semibold text-[#2DD4BF]">
                    {insight.strengthLabel || (insight.confidence >= 0.8 ? 'Strong Association' : 'Moderate Association')}
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#0B1020] text-slate-300 border border-[#1E294B]">
                    {Math.round(insight.confidence * 100)}% Confidence
                  </span>
                </div>
              </div>

              {/* Short Title */}
              <h4 className="text-base font-bold text-white tracking-tight leading-snug">
                {insight.title}
              </h4>

              {/* Clear Explanation */}
              <p className="text-xs text-slate-200 mt-2 leading-relaxed">
                {insight.description}
              </p>

              {/* Supporting Data Block */}
              {insight.supportingData && (
                <div className="mt-3 p-3 rounded-xl bg-[#0B1020] border border-[#1E294B] flex items-center space-x-2.5">
                  <Clock className="w-4 h-4 text-[#2DD4BF] shrink-0" />
                  <div className="text-xs text-slate-300">
                    <span className="font-semibold text-white mr-1">Supporting Data:</span>
                    <span>{insight.supportingData}</span>
                  </div>
                </div>
              )}

              {/* Related Habits Links */}
              {insight.relatedHabitIds && insight.relatedHabitIds.length > 0 && (
                <div className="mt-3 flex items-center flex-wrap gap-1.5">
                  <span className="text-[11px] text-slate-400 mr-1">Related Habits:</span>
                  {insight.relatedHabitIds.map((hid) => {
                    const h = getHabit(hid);
                    if (!h) return null;
                    return (
                      <span
                        key={hid}
                        className="px-2.5 py-1 rounded-lg bg-[#0B1020] border border-[#1E294B] text-xs font-medium text-slate-200 flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
                        {h.name}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Scientific Non-Causal Note */}
              {insight.scientificNote && (
                <div className="mt-4 pt-3 border-t border-[#1E294B] flex items-start space-x-2 text-[11px] text-slate-400">
                  <Info className="w-3.5 h-3.5 text-[#2DD4BF] shrink-0 mt-0.5" />
                  <span className="italic leading-relaxed">
                    Methodological Context: {insight.scientificNote}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredInsights.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[#131B33] border border-[#1E294B] max-w-lg mx-auto">
          <Sparkles className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Matching Insights Found</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Try adjusting your category filter or search query. As you log more habit days, additional patterns will be automatically synthesized.
          </p>
          <button
            onClick={() => {
              setSelectedCategoryFilter('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
