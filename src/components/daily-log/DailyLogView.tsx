import React, { useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Save,
  Activity,
  Layers,
  Sparkles,
  PieChart,
} from 'lucide-react';
import { useHabit } from '../../context/HabitContext';
import { HabitLogStatus } from '../../types';
import { getRelativeDate } from '../../data/initialData';

export const DailyLogView: React.FC = () => {
  const {
    habits,
    logs,
    selectedDate,
    setSelectedDate,
    updateHabitLog,
    getDailySummary,
    setActivePage,
  } = useHabit();

  const [notesDrafts, setNotesDrafts] = useState<Record<string, string>>({});
  const [activeNoteHabitId, setActiveNoteHabitId] = useState<string | null>(null);

  const activeHabits = habits.filter((h) => h.active);
  const currentLogs = logs.filter((l) => l.date === selectedDate);
  const dailySummary = getDailySummary(selectedDate);

  // Quick navigation buttons: -2, -1, Today
  const quickDates = [
    { label: '2 Days Ago', date: getRelativeDate(-2) },
    { label: 'Yesterday', date: getRelativeDate(-1) },
    { label: 'Today', date: getRelativeDate(0) },
  ];

  const handleDateShift = (delta: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + delta);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const getLogForHabit = (habitId: string) => {
    return (
      currentLogs.find((l) => l.habitId === habitId) || {
        id: `temp-${selectedDate}-${habitId}`,
        habitId,
        date: selectedDate,
        status: 'missed' as HabitLogStatus,
        completionValue: 0,
        notes: '',
      }
    );
  };

  const handleStatusChange = (habitId: string, status: HabitLogStatus) => {
    const log = getLogForHabit(habitId);
    const value = status === 'completed' ? 100 : status === 'partial' ? 50 : 0;
    const currentNote = notesDrafts[habitId] !== undefined ? notesDrafts[habitId] : log.notes;
    updateHabitLog(habitId, selectedDate, status, value, currentNote);
  };

  const handleValueChange = (habitId: string, value: number) => {
    const log = getLogForHabit(habitId);
    let newStatus: HabitLogStatus = log.status;
    if (value >= 100) newStatus = 'completed';
    else if (value > 0) newStatus = 'partial';
    else newStatus = 'missed';

    const currentNote = notesDrafts[habitId] !== undefined ? notesDrafts[habitId] : log.notes;
    updateHabitLog(habitId, selectedDate, newStatus, value, currentNote);
  };

  const handleSaveNote = (habitId: string) => {
    const log = getLogForHabit(habitId);
    const noteText = notesDrafts[habitId] !== undefined ? notesDrafts[habitId] : log.notes;
    updateHabitLog(habitId, selectedDate, log.status, log.completionValue, noteText);
    setActiveNoteHabitId(null);
  };

  return (
    <div id="daily-log-container" className="space-y-6 pb-12">
      {/* Date Bar & Quick Jump Selector */}
      <div className="p-4 rounded-2xl bg-[#131B33] border border-[#1E294B] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleDateShift(-1)}
            className="p-2 rounded-xl bg-[#0B1020] border border-[#1E294B] text-slate-300 hover:text-white hover:border-slate-600 transition-colors cursor-pointer"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#0B1020] border border-[#1E294B]">
            <Calendar className="w-4 h-4 text-[#2DD4BF]" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              className="bg-transparent text-sm font-semibold text-white focus:outline-hidden cursor-pointer"
            />
          </div>

          <button
            onClick={() => handleDateShift(1)}
            className="p-2 rounded-xl bg-[#0B1020] border border-[#1E294B] text-slate-300 hover:text-white hover:border-slate-600 transition-colors cursor-pointer"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Date Presets */}
        <div className="flex items-center gap-2">
          {quickDates.map((item) => (
            <button
              key={item.date}
              onClick={() => setSelectedDate(item.date)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                selectedDate === item.date
                  ? 'bg-[#7C3AED] text-white glow-purple'
                  : 'bg-[#0B1020] text-slate-400 hover:text-white border border-[#1E294B]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Daily Progress & Summary Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Progress % */}
        <div className="p-4 rounded-2xl bg-[#131B33] border border-[#1E294B]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Progress Rate</span>
            <PieChart className="w-4 h-4 text-[#2DD4BF]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#2DD4BF]">
            {dailySummary.progressPercentage}%
          </div>
          <div className="w-full h-1.5 bg-[#0B1020] rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#7C3AED] to-[#2DD4BF] rounded-full transition-all"
              style={{ width: `${dailySummary.progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Completed Count */}
        <div className="p-4 rounded-2xl bg-[#131B33] border border-[#1E294B]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Completed Habits</span>
            <CheckCircle2 className="w-4 h-4 text-[#2DD4BF]" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {dailySummary.completedCount}{' '}
            <span className="text-xs text-slate-400 font-normal">/ {dailySummary.totalCount}</span>
          </div>
          <span className="text-[11px] text-[#2DD4BF] block mt-1">Successfully fulfilled</span>
        </div>

        {/* Missed Count */}
        <div className="p-4 rounded-2xl bg-[#131B33] border border-[#1E294B]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Missed Habits</span>
            <XCircle className="w-4 h-4 text-[#F472B6]" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {dailySummary.missedCount}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Uncompleted routines</span>
        </div>

        {/* Partially Completed Count */}
        <div className="p-4 rounded-2xl bg-[#131B33] border border-[#1E294B]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Partially Completed</span>
            <Clock className="w-4 h-4 text-[#7C3AED]" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {dailySummary.partialCount}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Incomplete / partial effort</span>
        </div>
      </div>

      {/* Daily Habit Summary Box */}
      <div className="p-4 rounded-2xl bg-[#131B33] border border-[#1E294B] flex items-start space-x-3">
        <div className="w-8 h-8 rounded-xl bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4 text-[#2DD4BF]" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Daily Habit Summary for {selectedDate}
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {dailySummary.textSummary}
          </p>
        </div>
      </div>

      {/* Habit Logging List */}
      <div id="daily-log-habits-list" className="space-y-4">
        {activeHabits.map((habit) => {
          const log = getLogForHabit(habit.id);
          const isCompleted = log.status === 'completed';
          const isPartial = log.status === 'partial';
          const isMissed = log.status === 'missed';

          const noteDraft =
            notesDrafts[habit.id] !== undefined ? notesDrafts[habit.id] : log.notes;
          const isNoteOpen = activeNoteHabitId === habit.id;

          return (
            <div
              key={habit.id}
              id={`daily-log-row-${habit.id}`}
              className="p-5 rounded-2xl bg-[#131B33] border border-[#1E294B] hover:border-slate-700 transition-all space-y-4"
            >
              {/* Row Header: Habit Name, Category, and 3 Status Buttons */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#0B1020] text-slate-400 border border-[#1E294B]">
                      {habit.category}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {habit.timeOfDay || 'Morning'} Routine
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                    {habit.name}
                  </h3>
                  {habit.description && (
                    <p className="text-xs text-slate-400 mt-0.5">{habit.description}</p>
                  )}
                </div>

                {/* Status Toggle Buttons: Completed | Partially Completed | Missed */}
                <div className="flex items-center space-x-1.5 shrink-0">
                  <button
                    onClick={() => handleStatusChange(habit.id, 'completed')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-[#2DD4BF] text-[#0B1020] border-[#2DD4BF] glow-teal'
                        : 'bg-[#0B1020] text-slate-400 border-[#1E294B] hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange(habit.id, 'partial')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isPartial
                        ? 'bg-[#7C3AED] text-white border-[#7C3AED] glow-purple'
                        : 'bg-[#0B1020] text-slate-400 border-[#1E294B] hover:text-white'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Partially completed</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange(habit.id, 'missed')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isMissed
                        ? 'bg-[#F472B6]/20 text-[#F472B6] border-[#F472B6]/40'
                        : 'bg-[#0B1020] text-slate-400 border-[#1E294B] hover:text-[#F472B6]'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Missed</span>
                  </button>
                </div>
              </div>

              {/* Completion Value & Notes Controls */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-3 border-t border-[#1E294B]/70 items-center">
                {/* Completion Value Slider/Number */}
                <div className="md:col-span-6 flex items-center space-x-3">
                  <span className="text-xs text-slate-400 shrink-0">Completion Value:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={log.completionValue}
                    onChange={(e) => handleValueChange(habit.id, parseInt(e.target.value, 10))}
                    className="w-full accent-[#2DD4BF] cursor-pointer"
                  />
                  <span className="font-mono text-xs font-semibold text-[#2DD4BF] w-12 text-right">
                    {log.completionValue}%
                  </span>
                </div>

                {/* Notes Toggle / Input */}
                <div className="md:col-span-6 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => setActiveNoteHabitId(isNoteOpen ? null : habit.id)}
                    className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#2DD4BF]" />
                    <span>
                      {log.notes ? 'Edit Notes' : 'Add Note'} {log.notes && '(1)'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Expandable Notes Input */}
              {isNoteOpen && (
                <div className="pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={noteDraft}
                      onChange={(e) =>
                        setNotesDrafts({ ...notesDrafts, [habit.id]: e.target.value })
                      }
                      placeholder="Add reflection or context on this habit's execution..."
                      className="flex-1 px-3 py-1.5 rounded-xl bg-[#0B1020] border border-[#1E294B] text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#2DD4BF]"
                    />
                    <button
                      onClick={() => handleSaveNote(habit.id)}
                      className="px-3 py-1.5 rounded-xl bg-[#2DD4BF] hover:bg-[#26bba7] text-[#0B1020] text-xs font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <Save className="w-3 h-3" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {activeHabits.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[#131B33] border border-[#1E294B] max-w-lg mx-auto">
          <Activity className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No active habits to log</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Start logging your habits to discover your first habit pattern.
          </p>
          <button
            onClick={() => setActivePage('habits')}
            className="mt-4 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold cursor-pointer"
          >
            Manage Habits
          </button>
        </div>
      )}
    </div>
  );
};
