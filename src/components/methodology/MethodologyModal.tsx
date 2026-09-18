import React, { useState } from 'react';
import {
  GraduationCap,
  X,
  Database,
  CheckCircle2,
  Cpu,
  GitMerge,
  ShieldCheck,
  Sparkles,
  BookOpen,
  ArrowRight,
  Calculator,
} from 'lucide-react';
import { useHabit } from '../../context/HabitContext';

export const MethodologyModal: React.FC = () => {
  const { isMethodologyModalOpen, setIsMethodologyModalOpen, minObservationsThreshold } = useHabit();
  const [activeTab, setActiveTab] = useState<'overview' | 'math' | 'pipeline' | 'ethics'>('overview');

  if (!isMethodologyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-3xl max-h-[90vh] rounded-2xl bg-[#131B33] border border-[#1E294B] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-[#1E294B] flex items-center justify-between bg-[#0B1020]/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-[#2DD4BF]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Analytical Methodology & System Architecture
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30 font-semibold">
                  Academic Spec
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Scientific documentation of data processing, pattern detection, and non-causal heuristics.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsMethodologyModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E294B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-[#1E294B] flex items-center gap-2 bg-[#0B1020]/30 overflow-x-auto">
          {[
            { id: 'overview', label: '1. Pipeline Overview', icon: Database },
            { id: 'math', label: '2. Mathematical Formulation', icon: Calculator },
            { id: 'pipeline', label: '3. Data Validation & Processing', icon: Cpu },
            { id: 'ethics', label: '4. Non-Causal Framing & Rigor', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-[#2DD4BF] text-[#2DD4BF]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-xs leading-relaxed">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1E294B]">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#7C3AED]" />
                  <span>The Core Analytical Premise</span>
                </h4>
                <p>
                  Most habit tracking systems operate in analytical silos, recording individual habit adherence
                  without considering systemic behavioral interdependencies. <strong>HabitChain AI</strong> was
                  developed as an applied behavioral data science project to examine how discrete personal routines
                  function as <em>behavioral anchors</em> or <em>sequential cascades</em> across consecutive time windows.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1E294B] space-y-2">
                  <div className="flex items-center space-x-2 text-white font-semibold">
                    <Database className="w-4 h-4 text-[#2DD4BF]" />
                    <span>1. Data Ingestion Layer</span>
                  </div>
                  <p className="text-slate-400">
                    Captures multi-dimensional daily status records (completion, skips, subjective mood, routine phase, and notes).
                    Enforces data sanitization and strict uniqueness constraints per calendar date.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1E294B] space-y-2">
                  <div className="flex items-center space-x-2 text-white font-semibold">
                    <Cpu className="w-4 h-4 text-[#7C3AED]" />
                    <span>2. Association Mining Engine</span>
                  </div>
                  <p className="text-slate-400">
                    Computes empirical conditional probabilities and contingency matrices across chronological log sequences.
                    Evaluates both same-day anchor pairings and next-day ripple cascades.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1E294B] space-y-2">
                  <div className="flex items-center space-x-2 text-white font-semibold">
                    <GitMerge className="w-4 h-4 text-[#F472B6]" />
                    <span>3. Graph Representation</span>
                  </div>
                  <p className="text-slate-400">
                    Models detected associations as a directed network graph where nodes represent discrete habits
                    and edges quantify co-occurrence frequency, confidence score, and relationship strength.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1E294B] space-y-2">
                  <div className="flex items-center space-x-2 text-white font-semibold">
                    <Sparkles className="w-4 h-4 text-[#2DD4BF]" />
                    <span>4. Rule-Based AI Synthesis</span>
                  </div>
                  <p className="text-slate-400">
                    Distills statistical findings into 5 standardized, human-readable insight classes:
                    Positive Patterns, Consistency Audits, Association Chains, Trend Trajectories, and Attention Areas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'math' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1E294B] space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#2DD4BF]" />
                  <span>Empirical Probability & Association Metrics</span>
                </h4>
                <p>
                  For any pair of active habits <span className="font-mono text-[#2DD4BF]">A</span> (Anchor) and{' '}
                  <span className="font-mono text-purple-300">B</span> (Follow-up), our engine calculates the empirical
                  conditional adherence probability:
                </p>

                <div className="p-3 rounded-lg bg-[#131B33] border border-[#1E294B] font-mono text-center text-xs text-white">
                  P(B | A) = Count(Days where both A and B were Completed) / Count(Days where A was Completed)
                </div>

                <p className="text-slate-400 text-[11px]">
                  Where the observation window spans <span className="text-slate-200">N</span> distinct calendar dates,
                  requiring a minimum observation threshold of{' '}
                  <span className="text-[#2DD4BF] font-semibold">{minObservationsThreshold} distinct logged days</span>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1E294B] space-y-3">
                <h5 className="font-bold text-white text-xs uppercase tracking-wider">
                  Association Strength Classification
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                  <div className="p-3 rounded-lg bg-[#131B33] border border-[#2DD4BF]/30">
                    <span className="text-[#2DD4BF] font-bold block mb-1">Strong Association</span>
                    <span className="font-mono text-white text-base font-bold block">≥ 75%</span>
                    <span className="text-slate-400 mt-1 block">
                      Target habit completed in over three-quarters of instances following the anchor.
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#131B33] border border-purple-500/30">
                    <span className="text-purple-300 font-bold block mb-1">Moderate Association</span>
                    <span className="font-mono text-white text-base font-bold block">50% – 74%</span>
                    <span className="text-slate-400 mt-1 block">
                      Consistent co-occurrence observed above median randomness.
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#131B33] border border-slate-700">
                    <span className="text-slate-300 font-bold block mb-1">Weak Association</span>
                    <span className="font-mono text-white text-base font-bold block">&lt; 50%</span>
                    <span className="text-slate-400 mt-1 block">
                      Co-occurrence frequency insufficient to infer an active behavioral anchor.
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1E294B] space-y-2">
                <h5 className="font-bold text-white text-xs uppercase tracking-wider">
                  Statistical Confidence Score Formulation
                </h5>
                <p>
                  Confidence is computed as a monotonic function of sample completeness and occurrence density:
                </p>
                <div className="p-2.5 rounded-lg bg-[#131B33] border border-[#1E294B] font-mono text-[11px] text-[#2DD4BF]">
                  Confidence(A, B) = min(0.96, 0.70 + (CoOccurrences / TotalObservedDays) × 0.25)
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pipeline' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1E294B] space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2DD4BF]" />
                  <span>Validation Invariants & Error Handling</span>
                </h4>
                <ul className="space-y-2.5 list-disc list-inside text-slate-300">
                  <li>
                    <strong className="text-white">Cardinality Invariant:</strong> Exactly one log record is permitted
                    per habit per calendar date. Re-logging updates the existing record rather than creating duplicate entries.
                  </li>
                  <li>
                    <strong className="text-white">Habit Name Sanitization:</strong> Habit names must be non-empty,
                    bounded between 1 and 50 characters, and unique within the user's active habit catalog.
                  </li>
                  <li>
                    <strong className="text-white">Temporal Boundary Checks:</strong> Dates are normalized to standard
                    ISO format (YYYY-MM-DD), ensuring accurate sequential lag-1 computations across day boundaries.
                  </li>
                  <li>
                    <strong className="text-white">Observation Floor Protection:</strong> If the dataset contains fewer
                    than the configured minimum observations (current: {minObservationsThreshold} days), the engine
                    deliberately suppresses speculative pattern output and alerts the user transparently.
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1E294B] space-y-2">
                <h5 className="font-bold text-white text-xs uppercase tracking-wider">
                  Data Persistence Architecture
                </h5>
                <p>
                  All active habits, daily logs, detected chains, and generated audit reports persist client-side via
                  browser localStorage with automatic fallback initialization. A complete simulated 14-day research
                  dataset is available for demonstration and academic evaluation.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'ethics' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-3">
                <h4 className="text-sm font-bold text-purple-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2DD4BF]" />
                  <span>The Non-Causal Epistemological Rule</span>
                </h4>
                <p className="text-slate-200">
                  In behavioural statistics, <em>correlation does not imply causation</em>. Confounding variables
                  (such as ambient stress, academic calendar deadlines, or sleep deprivation) frequently co-influence
                  multiple habits simultaneously.
                </p>
                <div className="p-3 rounded-lg bg-[#0B1020] border border-[#1E294B] space-y-2">
                  <span className="font-semibold text-[#F472B6] block">Prohibited Verbs in All Outputs:</span>
                  <p className="text-slate-400">
                    The engine is strictly forbidden from claiming that habit A "causes", "forces", or "drives" habit B.
                  </p>
                  <span className="font-semibold text-[#2DD4BF] block pt-1">Mandatory Approved Language:</span>
                  <p className="text-slate-300 italic">
                    "Observed association", "repeated co-occurrence", "frequently occurring relationship", "based on logged historical data".
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1E294B] space-y-2">
                <h5 className="font-bold text-white text-xs uppercase tracking-wider">
                  Data Integrity & Transparency Standard
                </h5>
                <p>
                  When user data is sparse, synthetic patterns are never fabricated to fill empty UI states.
                  The interface clearly presents the exact observation count collected versus the required threshold,
                  instilling trust and adhering to scientific data principles.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1E294B] bg-[#0B1020]/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            HabitChain AI • Computational Behavioral Analytics Lab
          </span>
          <button
            onClick={() => setIsMethodologyModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            Close Methodology
          </button>
        </div>
      </div>
    </div>
  );
};
