import React, { useState } from 'react';
import {
  Sliders,
  RotateCcw,
  Trash2,
  Download,
  Upload,
  GraduationCap,
  ShieldCheck,
  Cpu,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useHabit } from '../../context/HabitContext';

export const SettingsView: React.FC = () => {
  const {
    habits,
    logs,
    chains,
    insights,
    reports,
    resetDemoData,
    clearAllData,
    minConfidenceFilter,
    setMinConfidenceFilter,
  } = useHabit();

  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotificationStatus(msg);
    setTimeout(() => setNotificationStatus(null), 3000);
  };

  const handleExportJSON = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      project: 'HabitChain AI – Personal Habit Pattern & Dependency Analyzer',
      version: '1.2.0-edu',
      habits,
      logs,
      chains,
      insights,
      reports,
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HabitChain_Dataset_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Dataset JSON exported successfully');
  };

  return (
    <div id="settings-container" className="space-y-6 pb-12 max-w-4xl">
      {/* Toast Notification */}
      {notificationStatus && (
        <div className="p-3 rounded-xl bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 text-[#2DD4BF] text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notificationStatus}</span>
        </div>
      )}

      {/* College Project Architecture & Purpose Box */}
      <div className="p-6 rounded-2xl bg-[#131B33] border border-[#1E294B] space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 text-[#7C3AED]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Academic Prototype Overview & Methodology
            </h3>
            <p className="text-xs text-slate-400">
              Department of Behavioral Sciences & Computing • Undergraduate Research Project
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1E294B] text-xs text-slate-300 space-y-2 leading-relaxed">
          <p>
            <strong>Research Focus:</strong> HabitChain AI was designed to move beyond traditional checklist-style habit trackers by focusing exclusively on <em>inter-habit relationships</em>, sequence contingencies, and daily momentum flow.
          </p>
          <p>
            <strong>Core Scientific Invariant:</strong> The application measures longitudinal co-occurrence and lag correlations. In accordance with behavioral science research standards, the system explicitly avoids attributing causal power to observed habits.
          </p>
        </div>
      </div>

      {/* Pattern Detection Tuning */}
      <div className="p-6 rounded-2xl bg-[#131B33] border border-[#1E294B] space-y-4">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#2DD4BF]" />
          <span>Pattern Detection Parameters</span>
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-200">
                Minimum Statistical Confidence Threshold
              </span>
              <span className="font-mono text-[#2DD4BF] font-bold">
                {Math.round(minConfidenceFilter * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="0.95"
              step="0.05"
              value={minConfidenceFilter}
              onChange={(e) => setMinConfidenceFilter(parseFloat(e.target.value))}
              className="w-full accent-[#2DD4BF] cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Chains with p-value confidence below this threshold are suppressed from the primary dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Data Management & Demo Controls */}
      <div className="p-6 rounded-2xl bg-[#131B33] border border-[#1E294B] space-y-4">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#7C3AED]" />
          <span>Dataset Management & Portability</span>
        </h3>
        <p className="text-xs text-slate-400">
          This prototype operates with local modular storage. You can freely switch between simulated college student cohorts or export your log records for statistical analysis.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            className="flex items-center justify-center space-x-2 p-3 rounded-xl bg-[#0B1020] border border-[#1E294B] hover:border-[#2DD4BF] text-xs font-semibold text-white transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#2DD4BF]" />
            <span>Export Dataset (JSON)</span>
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={() => {
              if (confirm('Reset to standard college research demo dataset? Any custom habits will be replaced with the baseline cohort.')) {
                resetDemoData();
                showNotification('Reset to baseline college demo dataset');
              }
            }}
            className="flex items-center justify-center space-x-2 p-3 rounded-xl bg-[#0B1020] border border-[#1E294B] hover:border-[#7C3AED] text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#7C3AED]" />
            <span>Restore Demo Dataset</span>
          </button>

          {/* Clear All Records */}
          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear all user logs, habits, and detected chains?')) {
                clearAllData();
                showNotification('All records cleared');
              }
            }}
            className="flex items-center justify-center space-x-2 p-3 rounded-xl bg-[#0B1020] border border-[#1E294B] hover:border-[#F472B6] text-xs font-semibold text-slate-200 hover:text-[#F472B6] transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-[#F472B6]" />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
