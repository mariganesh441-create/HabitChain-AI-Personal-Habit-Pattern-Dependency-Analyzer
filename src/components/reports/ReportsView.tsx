import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Download,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  GitMerge,
  GraduationCap,
  ChevronRight,
  Printer,
  Table,
  TrendingDown,
  TrendingUp,
  Zap,
  Info,
  Clock,
  X,
} from 'lucide-react';
import { useHabit } from '../../context/HabitContext';
import { Report } from '../../types';

export const ReportsView: React.FC = () => {
  const { reports, generateReport, habits, chains } = useHabit();
  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || '');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  // Form state for generating a report
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('weekly');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const currentReport = reports.find((r) => r.id === selectedReportId) || reports[0];

  const handleCreateReport = () => {
    const newReport = generateReport({
      reportType,
      startDate: reportType === 'custom' ? customStartDate : undefined,
      endDate: reportType === 'custom' ? customEndDate : undefined,
    });
    setSelectedReportId(newReport.id);
    setIsGenerateModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!currentReport) return;
    const rows = [
      ['Metric / Section', 'Value'],
      ['Report Title', currentReport.title],
      ['Observation Period', currentReport.timeRange],
      ['Generated Date', currentReport.generatedDate],
      ['Average Completion Rate', `${currentReport.metrics.avgCompletionRate}%`],
      ['Chains Analyzed', currentReport.metrics.chainsAnalyzed.toString()],
      ['Strongest Chain', currentReport.metrics.strongestChain],
      ['Top Consistent Habit', currentReport.metrics.topHabit],
      ['Most Vulnerable Habit', currentReport.metrics.vulnerableHabit],
      ['Executive Summary', `"${currentReport.summaryText.replace(/"/g, '""')}"`],
      ...currentReport.recommendations.map((rec, i) => [`Recommendation ${i + 1}`, `"${rec.replace(/"/g, '""')}"`]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${currentReport.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportMarkdown = () => {
    if (!currentReport) return;
    const md = `# ${currentReport.title}
Generated Date: ${currentReport.generatedDate}
Observation Window: ${currentReport.timeRange}

## Executive Summary
${currentReport.summaryText}

## Quantitative Behavioral Metrics
- Average Completion Rate: ${currentReport.metrics.avgCompletionRate}%
- Active Chains Analyzed: ${currentReport.metrics.chainsAnalyzed}
- Strongest Observed Chain: ${currentReport.metrics.strongestChain}
- Top Reliable Habit: ${currentReport.metrics.topHabit}
- Most Vulnerable Routine: ${currentReport.metrics.vulnerableHabit}

## Chain & Pattern Breakdown
${chains
  .slice(0, 5)
  .map((c) => {
    const src = habits.find((h) => h.id === c.sourceHabit)?.name || c.sourceHabit;
    const tgt = habits.find((h) => h.id === c.targetHabit)?.name || c.targetHabit;
    return `- ${src} ➔ ${tgt}: ${Math.round(c.relationshipStrength * 100)}% co-occurrence (${c.strengthLabel})`;
  })
  .join('\n')}

## Experimental Routine Adjustments
${currentReport.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

## Academic Methodology
${currentReport.academicMethodologyNotes || 'Contingency modeling of discrete daily habits using empirical co-occurrence statistics.'}
`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentReport.title.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="reports-container" className="space-y-6 pb-12">
      {/* Action Header */}
      <div className="p-5 rounded-2xl bg-[#131B33] border border-[#1E294B] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-[#7C3AED]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Habit Pattern & Behavioral Reports
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive academic audits detailing habit consistency, sequence dependencies, and empirical recommendations.
            </p>
          </div>
        </div>

        <button
          id="generate-new-report-btn"
          onClick={() => setIsGenerateModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-sm shadow-[#7C3AED]/30 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Audit</span>
        </button>
      </div>

      {/* Reports Navigation Bar & Selected Document */}
      {reports.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar List of Reports (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Available Audits ({reports.length})
              </span>
            </div>

            <div className="space-y-2">
              {reports.map((rep) => {
                const isSelected = currentReport?.id === rep.id;
                return (
                  <div
                    key={rep.id}
                    onClick={() => setSelectedReportId(rep.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#15203D] border-[#2DD4BF] shadow-sm shadow-[#2DD4BF]/10'
                        : 'bg-[#131B33] border-[#1E294B] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="font-mono">{rep.generatedDate}</span>
                      <span className="font-mono font-bold text-[#2DD4BF]">
                        {rep.metrics.avgCompletionRate}% Adherence
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{rep.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{rep.summaryText}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Report Presentation Document (8 cols) */}
          {currentReport && (
            <div
              id="printable-report-area"
              className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-[#131B33] border border-[#1E294B] space-y-6"
            >
              {/* Document Header with Export Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#1E294B]">
                <div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-[#2DD4BF]" />
                    <span className="text-xs font-mono text-[#2DD4BF] font-semibold">
                      Research Audit #{currentReport.id.slice(-6)}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-1.5">{currentReport.title}</h2>
                  <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{currentReport.timeRange}</span>
                    <span>•</span>
                    <span className="font-mono">Generated {currentReport.generatedDate}</span>
                  </div>
                </div>

                {/* Export actions */}
                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0B1020] border border-[#1E294B] text-xs text-slate-300 hover:text-white hover:border-slate-500 transition-colors cursor-pointer"
                    title="Export CSV"
                  >
                    <Table className="w-3.5 h-3.5 text-[#2DD4BF]" />
                    <span>CSV</span>
                  </button>
                  <button
                    onClick={handleExportMarkdown}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0B1020] border border-[#1E294B] text-xs text-slate-300 hover:text-white hover:border-slate-500 transition-colors cursor-pointer"
                    title="Export Markdown"
                  >
                    <Download className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>Markdown</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0B1020] border border-[#1E294B] text-xs text-slate-300 hover:text-white hover:border-slate-500 transition-colors cursor-pointer"
                    title="Print / Save as PDF"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-400" />
                    <span>Print / PDF</span>
                  </button>
                </div>
              </div>

              {/* 1. Executive Summary */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#2DD4BF]" />
                  <span>Executive Behavioral Summary</span>
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed p-4 rounded-xl bg-[#0B1020] border border-[#1E294B]">
                  {currentReport.summaryText}
                </p>
              </div>

              {/* 2. Quantitative Metrics Grid */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <span>Quantitative Audit Metrics</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#0B1020] border border-[#1E294B]">
                    <span className="text-[11px] text-slate-400 block">Average Completion Rate</span>
                    <span className="text-xl font-bold font-mono text-[#2DD4BF]">
                      {currentReport.metrics.avgCompletionRate}%
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0B1020] border border-[#1E294B]">
                    <span className="text-[11px] text-slate-400 block">Active Chains Analyzed</span>
                    <span className="text-xl font-bold font-mono text-[#7C3AED]">
                      {currentReport.metrics.chainsAnalyzed} Sequences
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0B1020] border border-[#1E294B]">
                    <span className="text-[11px] text-slate-400 block">Top Reliable Habit</span>
                    <span className="text-xs font-semibold text-white block mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-[#2DD4BF]" />
                      {currentReport.metrics.topHabit}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0B1020] border border-[#1E294B]">
                    <span className="text-[11px] text-slate-400 block">Most Vulnerable Routine</span>
                    <span className="text-xs font-semibold text-[#F472B6] block mt-1 flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5 text-[#F472B6]" />
                      {currentReport.metrics.vulnerableHabit}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Chain & Pattern Breakdown */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <GitMerge className="w-3.5 h-3.5 text-[#2DD4BF]" />
                  <span>Chain & Pattern Breakdown</span>
                </h4>
                <div className="space-y-2">
                  {chains.slice(0, 4).map((c) => {
                    const src = habits.find((h) => h.id === c.sourceHabit)?.name || 'Source habit';
                    const tgt = habits.find((h) => h.id === c.targetHabit)?.name || 'Target habit';
                    return (
                      <div
                        key={c.id}
                        className="p-3 rounded-xl bg-[#0B1020] border border-[#1E294B] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white">{src}</span>
                          <span className="text-[#2DD4BF] font-mono">➔</span>
                          <span className="font-semibold text-white">{tgt}</span>
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-[#2DD4BF] font-bold">
                            {Math.round(c.relationshipStrength * 100)}%
                          </span>
                          <span className="text-[10px] text-slate-400 block">{c.strengthLabel}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Suggested Behavioral Adjustments (Strictly non-prescriptive) */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2DD4BF]" />
                  <span>Suggested Behavioral Adjustments (Experimental Recommendations)</span>
                </h4>
                <p className="text-[11px] text-slate-400 mb-2 italic">
                  Framed strictly as experimental routine suggestions to test and observe, not absolute rules.
                </p>
                <ul className="space-y-2">
                  {currentReport.recommendations.map((rec, i) => (
                    <li
                      key={i}
                      className="p-3 rounded-xl bg-[#0B1020] border border-[#1E294B] text-xs text-slate-200 flex items-start space-x-2.5"
                    >
                      <span className="w-5 h-5 rounded-md bg-[#7C3AED]/20 text-[#7C3AED] font-bold text-[11px] flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 5. Academic Methodology Footnote */}
              {currentReport.academicMethodologyNotes && (
                <div className="pt-4 border-t border-[#1E294B] flex items-start space-x-2 text-[11px] text-slate-400 italic">
                  <Info className="w-4 h-4 text-[#2DD4BF] shrink-0 mt-0.5" />
                  <span>
                    Academic Methodology: {currentReport.academicMethodologyNotes}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-[#131B33] border border-[#1E294B] max-w-lg mx-auto">
          <FileText className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Research Audits Generated</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Generate your first comprehensive behavioral audit to analyze habit consistency and sequence dependencies.
          </p>
          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold cursor-pointer"
          >
            Generate Your First Audit
          </button>
        </div>
      )}

      {/* Report Generation Modal */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1020]/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#131B33] border border-[#1E294B] rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Configure New Research Audit</h3>
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Select the observation window for empirical habit co-occurrence and consistency synthesis.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Report Observation Scope
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'daily', label: 'Daily (Today)' },
                    { id: 'weekly', label: 'Weekly (7 Days)' },
                    { id: 'monthly', label: 'Monthly (30 Days)' },
                    { id: 'custom', label: 'Custom Range' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setReportType(t.id as any)}
                      className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                        reportType === t.id
                          ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                          : 'bg-[#0B1020] text-slate-300 border-[#1E294B] hover:border-slate-600'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {reportType === 'custom' && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Start Date</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full bg-[#0B1020] border border-[#1E294B] rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">End Date</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full bg-[#0B1020] border border-[#1E294B] rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#1E294B] flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsGenerateModalOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateReport}
                className="px-4 py-2 rounded-xl bg-[#2DD4BF] hover:bg-[#26bba7] text-[#0B1020] text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Synthesize Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
