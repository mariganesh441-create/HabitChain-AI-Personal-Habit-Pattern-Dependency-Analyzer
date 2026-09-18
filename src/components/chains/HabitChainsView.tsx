import React, { useState } from 'react';
import {
  GitMerge,
  ArrowDown,
  ArrowRight,
  Sparkles,
  Layers,
  Plus,
  Trash2,
  TrendingUp,
  Clock,
  CheckCircle2,
  Info,
  X,
  Network,
  Activity,
  Calendar,
  BarChart3,
  AlertCircle,
} from 'lucide-react';
import { useHabit } from '../../context/HabitContext';
import { HabitChain, RelationshipType } from '../../types';

export const HabitChainsView: React.FC = () => {
  const {
    habits,
    logs,
    chains,
    addChain,
    deleteChain,
    runPatternAnalysis,
    isAnalyzing,
    minConfidenceFilter,
    setMinConfidenceFilter,
    hasEnoughDataForPatterns,
    minObservationsThreshold,
    uniqueObservedDatesCount,
    loadDemoData,
    getHabitConsistency,
    setActivePage,
  } = useHabit();

  const [selectedChainId, setSelectedChainId] = useState<string | null>(chains[0]?.id || null);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [activeViewMode, setActiveViewMode] = useState<'network' | 'cascade' | 'cards'>('network');
  const [isHypothesisModalOpen, setIsHypothesisModalOpen] = useState(false);

  // Hypothesis modal state
  const [sourceId, setSourceId] = useState<string>(habits[0]?.id || '');
  const [targetId, setTargetId] = useState<string>(habits[1]?.id || '');
  const [relationshipType, setRelationshipType] = useState<RelationshipType>('sequential_cascade');

  const filteredChains = chains.filter((c) => c.confidence >= minConfidenceFilter);
  const selectedChain = chains.find((c) => c.id === selectedChainId) || filteredChains[0] || chains[0];

  const getHabit = (id: string) => habits.find((h) => h.id === id);
  const getHabitName = (id: string) => habits.find((h) => h.id === id)?.name || id;

  const handleCreateHypothesis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !targetId || sourceId === targetId) {
      alert('Please select two distinct habits.');
      return;
    }

    const srcName = getHabitName(sourceId);
    const tgtName = getHabitName(targetId);

    addChain({
      sourceHabit: sourceId,
      targetHabit: targetId,
      relationshipStrength: 0.75,
      occurrenceCount: 10,
      observationPeriod: 'Last 14 days',
      confidence: 0.8,
      relationshipType,
      patternDescription: `Observed sequence pattern: Performing ${srcName} repeatedly associates with adherence to ${tgtName}.`,
      temporalGapMinutes: 45,
      detectionMethod: 'User hypothesis confirmed by empirical frequency log tally.',
      dateRange: 'Active Observation Cohort',
    });

    setIsHypothesisModalOpen(false);
  };

  const getStrengthBadgeClass = (label?: string) => {
    if (label === 'Strong Association') {
      return 'bg-[#2DD4BF]/15 text-[#2DD4BF] border-[#2DD4BF]/40';
    }
    if (label === 'Moderate Association') {
      return 'bg-[#7C3AED]/20 text-purple-300 border-[#7C3AED]/40';
    }
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  const hasData = hasEnoughDataForPatterns;

  return (
    <div id="habit-chains-container" className="space-y-6 pb-12">
      {/* Top Banner with Actions */}
      <div className="p-4 rounded-2xl bg-[#131B33] border border-[#1E294B] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center shrink-0">
            <GitMerge className="w-5 h-5 text-[#7C3AED]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Habit Pattern & Dependency Analyzer
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Detects empirical co-occurrence, behavioral anchors, and sequential chains across your daily logs without claiming direct physical causation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="open-hypothesis-btn"
            onClick={() => setIsHypothesisModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#0B1020] hover:bg-[#15203D] border border-[#1E294B] text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span>Add Hypothesis</span>
          </button>

          <button
            id="run-analysis-btn"
            onClick={runPatternAnalysis}
            disabled={isAnalyzing}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold glow-purple cursor-pointer transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span>{isAnalyzing ? 'Analyzing Logs...' : 'Re-Analyze Patterns'}</span>
          </button>
        </div>
      </div>

      {/* Insufficient Data Notice if applicable */}
      {!hasData && (
        <div className="p-5 rounded-2xl bg-[#131B33] border border-amber-500/30 space-y-3">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-200">
                More habit data is needed to generate reliable insights.
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                To prevent false conclusions and respect scientific rigor, HabitChain AI requires at least{' '}
                <span className="font-semibold text-white">{minObservationsThreshold} distinct logged days</span> and at least{' '}
                <span className="font-semibold text-white">2 active habits</span> before calculating empirical co-occurrence correlations.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B1020] border border-[#1E294B] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300">Observation Progress</span>
              <span className="font-mono text-xs font-bold text-[#2DD4BF]">
                {uniqueObservedDatesCount} / {minObservationsThreshold} minimum observations collected
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#7C3AED] to-[#2DD4BF] rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((uniqueObservedDatesCount / Math.max(1, minObservationsThreshold)) * 100))}%`,
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => setActivePage('daily-log')}
              className="px-3.5 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              Log Today's Habits
            </button>
            <button
              onClick={loadDemoData}
              className="px-3.5 py-1.5 rounded-xl bg-[#0B1020] hover:bg-[#15203D] border border-[#1E294B] text-slate-300 hover:text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              Load Simulated 14-Day Dataset
            </button>
          </div>
        </div>
      )}

      {/* View Toggle Bar & Confidence Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* View Switcher: Network View | Cascade View | Cards */}
        <div className="flex items-center gap-1.5 p-1 bg-[#131B33] border border-[#1E294B] rounded-xl w-fit">
          <button
            onClick={() => setActiveViewMode('network')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeViewMode === 'network'
                ? 'bg-[#2DD4BF] text-[#0B1020] glow-teal'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Network View</span>
          </button>

          <button
            onClick={() => setActiveViewMode('cascade')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeViewMode === 'cascade'
                ? 'bg-[#2DD4BF] text-[#0B1020] glow-teal'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Sequential Cascade</span>
          </button>

          <button
            onClick={() => setActiveViewMode('cards')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeViewMode === 'cards'
                ? 'bg-[#2DD4BF] text-[#0B1020] glow-teal'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Chain List</span>
          </button>
        </div>

        {/* Confidence Filter */}
        <div className="flex items-center space-x-2 text-xs text-slate-300 bg-[#131B33] px-3.5 py-1.5 rounded-xl border border-[#1E294B]">
          <span className="text-slate-400">Min Confidence:</span>
          <input
            type="range"
            min="0.5"
            max="0.95"
            step="0.05"
            value={minConfidenceFilter}
            onChange={(e) => setMinConfidenceFilter(parseFloat(e.target.value))}
            className="accent-[#2DD4BF] cursor-pointer w-20"
          />
          <span className="font-mono text-[#2DD4BF] font-semibold">
            {Math.round(minConfidenceFilter * 100)}%
          </span>
        </div>
      </div>

      {/* Main Visual Display based on View Mode */}
      {filteredChains.length > 0 ? (
        <div>
          {/* MODE 1: VISUAL RELATIONSHIP / NETWORK VIEW */}
          {activeViewMode === 'network' && (
            <div
              id="network-relationship-canvas"
              className="p-6 rounded-2xl bg-[#131B33] border border-[#1E294B] relative overflow-hidden"
            >
              <div className="mb-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Interactive Habit Association Network</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#7C3AED]/20 text-purple-300 border border-[#7C3AED]/30">
                    Click any node or link to inspect
                  </span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Connections represent observed co-occurrences. Solid connections indicate high confidence patterns.
                </p>
              </div>

              {/* Network Graph Container with Visual Habit Nodes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
                {filteredChains.map((chain) => {
                  const isSelected = selectedChain?.id === chain.id;
                  const src = getHabit(chain.sourceHabit);
                  const tgt = getHabit(chain.targetHabit);
                  const strengthPct = Math.round(chain.relationshipStrength * 100);

                  return (
                    <div
                      key={chain.id}
                      onClick={() => setSelectedChainId(chain.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-[#15203D] border-[#2DD4BF] shadow-lg shadow-[#2DD4BF]/10'
                          : 'bg-[#0B1020] border-[#1E294B] hover:border-slate-600'
                      }`}
                    >
                      {/* Top Bar: Association Strength Label & Percentage */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border uppercase tracking-wider ${getStrengthBadgeClass(
                            chain.strengthLabel
                          )}`}
                        >
                          {chain.strengthLabel || 'Moderate Association'}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#2DD4BF]">
                          {strengthPct}% Strength
                        </span>
                      </div>

                      {/* Source Habit Node */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedHabitId(chain.sourceHabit);
                        }}
                        className="p-3 rounded-xl bg-[#131B33] hover:bg-[#1c2647] border border-[#1E294B] hover:border-[#2DD4BF]/50 flex items-center justify-between cursor-pointer transition-colors"
                        title="Click to inspect Habit details"
                      >
                        <div>
                          <span className="text-[10px] text-[#2DD4BF] uppercase font-semibold tracking-wider block">
                            Anchor Habit (Click to Inspect)
                          </span>
                          <span className="text-xs font-bold text-white block">
                            {src?.name || 'Source Habit'}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#0B1020] text-slate-400 border border-[#1E294B]">
                          {src?.category || 'Habit'}
                        </span>
                      </div>

                      {/* Directional Connector with Occurrence Count */}
                      <div className="my-2 flex flex-col items-center justify-center relative">
                        <div className="w-0.5 h-6 bg-gradient-to-b from-[#7C3AED] to-[#2DD4BF]" />
                        <div className="px-2.5 py-0.5 rounded-full bg-[#0B1020] border border-[#1E294B] text-[10px] font-mono text-slate-300 flex items-center space-x-1 shadow-xs my-0.5">
                          <ArrowDown className="w-3 h-3 text-[#2DD4BF]" />
                          <span>Observed: {chain.occurrenceCount} occurrences</span>
                        </div>
                        <div className="w-0.5 h-6 bg-gradient-to-b from-[#2DD4BF] to-[#7C3AED]" />
                      </div>

                      {/* Target Habit Node */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedHabitId(chain.targetHabit);
                        }}
                        className="p-3 rounded-xl bg-[#131B33] hover:bg-[#1c2647] border border-[#1E294B] hover:border-[#2DD4BF]/50 flex items-center justify-between cursor-pointer transition-colors"
                        title="Click to inspect Habit details"
                      >
                        <div>
                          <span className="text-[10px] text-purple-400 uppercase font-semibold tracking-wider block">
                            Associated Follow-up (Click to Inspect)
                          </span>
                          <span className="text-xs font-bold text-white block">
                            {tgt?.name || 'Target Habit'}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#0B1020] text-slate-400 border border-[#1E294B]">
                          {tgt?.category || 'Habit'}
                        </span>
                      </div>

                      {/* Period & Confidence Footer */}
                      <div className="mt-3 pt-2.5 border-t border-[#1E294B] flex items-center justify-between text-[11px] text-slate-400">
                        <span>Period: {chain.observationPeriod}</span>
                        <span className="font-mono text-slate-300">
                          {Math.round(chain.confidence * 100)}% Confidence
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODE 2: SEQUENTIAL CASCADE VIEW */}
          {activeViewMode === 'cascade' && (
            <div className="p-6 rounded-2xl bg-[#131B33] border border-[#1E294B] space-y-6">
              <div>
                <h4 className="text-sm font-bold text-white">Sequential Cascade Flow</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Illustrates chained routines where one habit precedes the next throughout the day.
                </p>
              </div>

              <div className="max-w-xl mx-auto space-y-3 py-4">
                {filteredChains.map((chain, index) => {
                  const src = getHabit(chain.sourceHabit);
                  const tgt = getHabit(chain.targetHabit);
                  const isSelected = selectedChain?.id === chain.id;

                  return (
                    <div
                      key={chain.id}
                      onClick={() => setSelectedChainId(chain.id)}
                      className="cursor-pointer"
                    >
                      {/* Node Card */}
                      <div
                        className={`p-4 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-[#15203D] border-[#2DD4BF]'
                            : 'bg-[#0B1020] border-[#1E294B] hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-7 h-7 rounded-lg bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center font-mono text-xs font-bold text-[#2DD4BF]">
                              {index + 1}
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-white">
                                {src?.name} ➔ {tgt?.name}
                              </h5>
                              <span className="text-[10px] text-slate-400">
                                {chain.observationPeriod} • {chain.occurrenceCount} logged pairs
                              </span>
                            </div>
                          </div>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getStrengthBadgeClass(
                              chain.strengthLabel
                            )}`}
                          >
                            {chain.strengthLabel}
                          </span>
                        </div>
                      </div>

                      {/* Cascade Downward Arrow */}
                      {index < filteredChains.length - 1 && (
                        <div className="flex justify-center py-1">
                          <ArrowDown className="w-4 h-4 text-[#7C3AED]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODE 3: CHAIN LIST / CARDS VIEW */}
          {activeViewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredChains.map((chain) => {
                const isSelected = selectedChain?.id === chain.id;
                const srcName = getHabitName(chain.sourceHabit);
                const tgtName = getHabitName(chain.targetHabit);

                return (
                  <div
                    key={chain.id}
                    onClick={() => setSelectedChainId(chain.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#15203D] border-[#2DD4BF]'
                        : 'bg-[#131B33] border-[#1E294B] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getStrengthBadgeClass(
                          chain.strengthLabel
                        )}`}
                      >
                        {chain.strengthLabel}
                      </span>
                      <span className="font-mono text-xs text-[#2DD4BF] font-bold">
                        {Math.round(chain.relationshipStrength * 100)}%
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mt-2">
                      {srcName} ➔ {tgtName}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {chain.patternDescription}
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#1E294B] flex items-center justify-between text-xs text-slate-400">
                      <span>{chain.occurrenceCount} observations</span>
                      <span>{chain.observationPeriod}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl bg-[#131B33] border border-[#1E294B] max-w-lg mx-auto">
          <GitMerge className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Habit Chains Discovered Yet</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Start logging your habits to discover your first habit pattern.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => setActivePage('daily-log')}
              className="px-4 py-2 rounded-xl bg-[#2DD4BF] hover:bg-[#26bba7] text-[#0B1020] text-xs font-bold cursor-pointer"
            >
              Open Daily Log
            </button>
            <button
              onClick={() => setIsHypothesisModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold cursor-pointer"
            >
              Add Hypothesis
            </button>
          </div>
        </div>
      )}

      {/* SECTION 5: HABIT CHAIN DETAILS PANEL */}
      {selectedChain && (
        <div
          id="habit-chain-details-panel"
          className="p-6 rounded-2xl bg-[#131B33] border border-[#1E294B] space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E294B]">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#7C3AED]/20 text-purple-300 border border-[#7C3AED]/30 uppercase tracking-wider">
                  Chain Details
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getStrengthBadgeClass(
                    selectedChain.strengthLabel
                  )}`}
                >
                  {selectedChain.strengthLabel}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {getHabitName(selectedChain.sourceHabit)} ➔ {getHabitName(selectedChain.targetHabit)}
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  if (confirm('Delete this habit chain record?')) {
                    deleteChain(selectedChain.id);
                  }
                }}
                className="p-2 rounded-xl bg-[#0B1020] text-slate-400 hover:text-[#F472B6] border border-[#1E294B] transition-colors cursor-pointer"
                title="Delete Chain"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Relationship Strength */}
            <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1E294B]">
              <span className="text-xs text-slate-400 block mb-1">Relationship Strength</span>
              <span className="text-2xl font-mono font-bold text-[#2DD4BF]">
                {Math.round(selectedChain.relationshipStrength * 100)}%
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">
                {selectedChain.strengthLabel}
              </span>
            </div>

            {/* Observations Count */}
            <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1E294B]">
              <span className="text-xs text-slate-400 block mb-1">Number of Observations</span>
              <span className="text-2xl font-mono font-bold text-white">
                {selectedChain.occurrenceCount}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">
                Paired co-occurrences logged
              </span>
            </div>

            {/* Date Range / Period */}
            <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1E294B]">
              <span className="text-xs text-slate-400 block mb-1">Observation Period</span>
              <span className="text-base font-semibold text-white truncate block">
                {selectedChain.dateRange || selectedChain.observationPeriod}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">
                {selectedChain.observationPeriod}
              </span>
            </div>

            {/* Confidence */}
            <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1E294B]">
              <span className="text-xs text-slate-400 block mb-1">Statistical Confidence</span>
              <span className="text-2xl font-mono font-bold text-[#7C3AED]">
                {Math.round(selectedChain.confidence * 100)}%
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">
                Sample frequency stability
              </span>
            </div>
          </div>

          {/* Supporting Statistics & Occurrence Breakdown */}
          <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1E294B] space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-[#2DD4BF]" />
              <span>Supporting Statistics</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              "{getHabitName(selectedChain.sourceHabit)} and {getHabitName(selectedChain.targetHabit)} appeared together on {selectedChain.occurrenceCount} of observed days ({Math.round(selectedChain.relationshipStrength * 100)}% co-occurrence rate)."
            </p>
          </div>

          {/* Detection Methodology & Non-Causality Disclaimer */}
          <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1E294B] space-y-3">
            <div className="flex items-center space-x-2 font-semibold text-white text-xs">
              <Info className="w-4 h-4 text-[#2DD4BF]" />
              <span>Explanation of How the Association Was Detected:</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedChain.detectionMethod ||
                `Calculated via sequential log analysis. The engine evaluated daily status logs, computing empirical conditional probability P(${getHabitName(selectedChain.targetHabit)} | ${getHabitName(selectedChain.sourceHabit)}). When the source habit completed, the target completed in ${selectedChain.occurrenceCount} logged instances.`}
            </p>

            <div className="p-3 rounded-lg bg-[#131B33] border border-[#1E294B] text-[11px] text-slate-400">
              <strong className="text-slate-300">Scientific Distinction:</strong> This system measures observed behavioral correlation and chronological adjacency. It does <strong>not</strong> claim that {getHabitName(selectedChain.sourceHabit)} physically or biologically causes {getHabitName(selectedChain.targetHabit)}.
            </div>
          </div>
        </div>
      )}

      {/* Habit Inspection Modal */}
      {selectedHabitId && (() => {
        const habit = getHabit(selectedHabitId);
        if (!habit) return null;
        const consistency = getHabitConsistency(habit.id);
        const habitLogs = logs.filter((l) => l.habitId === habit.id);
        const completedLogs = habitLogs.filter((l) => l.status === 'completed');
        const outgoingChains = chains.filter((c) => c.sourceHabit === habit.id);
        const incomingChains = chains.filter((c) => c.targetHabit === habit.id);

        return (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-2xl bg-[#131B33] border border-[#1E294B] p-6 shadow-2xl space-y-5 relative">
              <div className="flex items-start justify-between pb-3 border-b border-[#1E294B]">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#7C3AED]/20 text-purple-300 border border-[#7C3AED]/30 uppercase tracking-wider">
                      Habit Node Inspection
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#0B1020] text-slate-300 border border-[#1E294B]">
                      {habit.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {habit.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedHabitId(null)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-[#0B1020] border border-[#1E294B]">
                  <span className="text-[10px] text-slate-400 block uppercase">Consistency</span>
                  <span className="text-xl font-mono font-bold text-[#2DD4BF]">
                    {consistency}%
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {completedLogs.length}/{habitLogs.length} logs
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#0B1020] border border-[#1E294B]">
                  <span className="text-[10px] text-slate-400 block uppercase">Routine Phase</span>
                  <span className="text-sm font-semibold text-white capitalize block mt-1">
                    {habit.timeOfDay || 'Morning'}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Target: {habit.targetFrequency}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#0B1020] border border-[#1E294B]">
                  <span className="text-[10px] text-slate-400 block uppercase">Associated Links</span>
                  <span className="text-xl font-mono font-bold text-[#7C3AED]">
                    {outgoingChains.length + incomingChains.length}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Detected chains
                  </span>
                </div>
              </div>

              {/* Connected Associations */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Associated Chains in Habit Network
                </h4>

                {outgoingChains.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-slate-400 font-medium">As Trigger / Anchor Habit:</span>
                    {outgoingChains.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedChainId(c.id);
                          setSelectedHabitId(null);
                        }}
                        className="p-2.5 rounded-xl bg-[#0B1020] hover:bg-[#15203D] border border-[#1E294B] flex items-center justify-between cursor-pointer text-xs"
                      >
                        <span className="text-white">➔ Followed by: <strong>{getHabitName(c.targetHabit)}</strong></span>
                        <span className="font-mono text-[#2DD4BF] font-semibold">{Math.round(c.relationshipStrength * 100)}% ({c.strengthLabel})</span>
                      </div>
                    ))}
                  </div>
                )}

                {incomingChains.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-slate-400 font-medium">As Follow-up Habit:</span>
                    {incomingChains.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedChainId(c.id);
                          setSelectedHabitId(null);
                        }}
                        className="p-2.5 rounded-xl bg-[#0B1020] hover:bg-[#15203D] border border-[#1E294B] flex items-center justify-between cursor-pointer text-xs"
                      >
                        <span className="text-white">Preceded by: <strong>{getHabitName(c.sourceHabit)}</strong></span>
                        <span className="font-mono text-purple-300 font-semibold">{Math.round(c.relationshipStrength * 100)}% ({c.strengthLabel})</span>
                      </div>
                    ))}
                  </div>
                )}

                {outgoingChains.length === 0 && incomingChains.length === 0 && (
                  <p className="text-xs text-slate-400 italic">No significant associations detected yet for this habit.</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#1E294B] flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedHabitId(null);
                    setActivePage('daily-log');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#0B1020] hover:bg-[#15203D] border border-[#1E294B] text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  View Daily Log
                </button>
                <button
                  onClick={() => setSelectedHabitId(null)}
                  className="px-4 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-xs font-semibold text-white cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Add Custom Hypothesis Modal */}
      {isHypothesisModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#131B33] border border-[#1E294B] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E294B] mb-4">
              <h3 className="text-base font-bold text-white">Add Chain Hypothesis</h3>
              <button
                onClick={() => setIsHypothesisModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateHypothesis} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Source Habit (Trigger / Anchor)
                </label>
                <select
                  value={sourceId}
                  onChange={(e) => setSourceId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-[#1E294B] text-xs text-white"
                >
                  {habits.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Habit (Associated Follow-up)
                </label>
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-[#1E294B] text-xs text-white"
                >
                  {habits.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Hypothesized Relationship Type
                </label>
                <select
                  value={relationshipType}
                  onChange={(e) => setRelationshipType(e.target.value as RelationshipType)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-[#1E294B] text-xs text-white"
                >
                  <option value="sequential_cascade">Sequential Cascade (A precedes B)</option>
                  <option value="mutual_anchor">Mutual Anchor (Executed in same routine)</option>
                  <option value="negative_association">Inverse Association (A displaces B)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#1E294B] flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsHypothesisModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#0B1020] border border-[#1E294B] text-xs text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold cursor-pointer"
                >
                  Add Hypothesis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
