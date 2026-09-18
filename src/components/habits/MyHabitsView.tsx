import React, { useState } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  GitMerge,
  Clock,
  CheckCircle2,
  X,
  Activity,
  Power,
  TrendingUp,
  Sliders,
} from 'lucide-react';
import { useHabit } from '../../context/HabitContext';
import { Habit, HabitCategory, TargetFrequency } from '../../types';

export const MyHabitsView: React.FC = () => {
  const {
    habits,
    chains,
    addHabit,
    updateHabit,
    toggleHabitActive,
    deleteHabit,
    getHabitConsistency,
    setActivePage,
  } = useHabit();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    category: HabitCategory | string;
    customCategory?: string;
    description: string;
    targetFrequency: TargetFrequency | string;
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    color: string;
  }>({
    name: '',
    category: 'Study',
    customCategory: '',
    description: '',
    targetFrequency: 'daily',
    timeOfDay: 'morning',
    color: '#7C3AED',
  });

  const categories: string[] = [
    'All',
    'Sleep',
    'Study',
    'Exercise',
    'Food',
    'Hydration',
    'Screen Time',
    'Productivity',
    'Personal',
    'Custom',
  ];

  const filteredHabits = habits.filter((habit) => {
    const matchesSearch =
      habit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      habit.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || habit.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingHabit(null);
    setFormError(null);
    setFormData({
      name: '',
      category: 'Study',
      customCategory: '',
      description: '',
      targetFrequency: 'daily',
      timeOfDay: 'morning',
      color: '#7C3AED',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setFormError(null);
    const isStandardCat = [
      'Sleep',
      'Study',
      'Exercise',
      'Food',
      'Hydration',
      'Screen Time',
      'Productivity',
      'Personal',
    ].includes(habit.category);

    setFormData({
      name: habit.name,
      category: isStandardCat ? habit.category : 'Custom',
      customCategory: isStandardCat ? '' : habit.category,
      description: habit.description,
      targetFrequency: habit.targetFrequency,
      timeOfDay: habit.timeOfDay || 'morning',
      color: habit.color || '#7C3AED',
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      setFormError('Habit name cannot be empty.');
      return;
    }

    if (trimmedName.length > 50) {
      setFormError('Habit name cannot exceed 50 characters.');
      return;
    }

    // Check for duplicate habit name (case-insensitive)
    const isDuplicate = habits.some(
      (h) =>
        (!editingHabit || h.id !== editingHabit.id) &&
        h.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      setFormError(`A habit named "${trimmedName}" already exists. Please choose a distinct name.`);
      return;
    }

    const finalCategory =
      formData.category === 'Custom' && formData.customCategory?.trim()
        ? formData.customCategory.trim()
        : formData.category;

    if (editingHabit) {
      updateHabit({
        ...editingHabit,
        name: trimmedName,
        category: finalCategory,
        description: formData.description.trim(),
        targetFrequency: formData.targetFrequency,
        timeOfDay: formData.timeOfDay,
        color: formData.color,
      });
    } else {
      addHabit({
        name: trimmedName,
        category: finalCategory,
        description: formData.description.trim(),
        targetFrequency: formData.targetFrequency,
        active: true,
        timeOfDay: formData.timeOfDay,
        color: formData.color,
      });
    }

    setIsAddModalOpen(false);
  };

  return (
    <div id="my-habits-container" className="space-y-6 pb-12">
      {/* Top Controls: Search, Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="habit-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search habits by keyword or routine..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#131B33] border border-[#1E294B] text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-[#2DD4BF] transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          id="add-new-habit-btn"
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold shadow-sm shadow-[#7C3AED]/30 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Habit</span>
        </button>
      </div>

      {/* Category Filter Bar */}
      <div id="habit-category-filter-bar" className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#2DD4BF] text-[#0B1020] glow-teal'
                : 'bg-[#131B33] text-slate-300 hover:text-white border border-[#1E294B]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Habits Grid */}
      <div id="habits-list-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHabits.map((habit) => {
          const consistency = getHabitConsistency(habit.id);
          const outgoingChains = chains.filter((c) => c.sourceHabit === habit.id);
          const incomingChains = chains.filter((c) => c.targetHabit === habit.id);

          return (
            <div
              key={habit.id}
              id={`habit-card-${habit.id}`}
              className={`p-5 rounded-2xl bg-[#131B33] border transition-all flex flex-col justify-between ${
                habit.active
                  ? 'border-[#1E294B] hover:border-slate-600'
                  : 'border-[#1E294B]/40 opacity-60 bg-[#0E1528]'
              }`}
            >
              <div>
                {/* Header: Category Badge + Target Frequency */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-[#0B1020] text-slate-200 border border-[#1E294B]">
                    {habit.category}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[11px] font-mono text-slate-400 capitalize">
                      {habit.targetFrequency}
                    </span>
                    <button
                      onClick={() => toggleHabitActive(habit.id)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                        habit.active
                          ? 'bg-[#2DD4BF]/10 text-[#2DD4BF] border-[#2DD4BF]/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                      title={habit.active ? 'Click to deactivate habit' : 'Click to activate habit'}
                    >
                      {habit.active ? 'Active' : 'Deactivated'}
                    </button>
                  </div>
                </div>

                {/* Habit Name and Description */}
                <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                  {habit.name}
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                  {habit.description || 'No description provided.'}
                </p>

                {/* Consistency Metric Meter */}
                <div className="mt-4 p-3 rounded-xl bg-[#0B1020] border border-[#1E294B] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-[#2DD4BF]" />
                      <span>Current Consistency</span>
                    </span>
                    <span className="font-mono font-bold text-[#2DD4BF]">{consistency}%</span>
                  </div>
                  {/* Visual Progress Bar */}
                  <div className="w-full h-1.5 bg-[#131B33] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#7C3AED] to-[#2DD4BF] rounded-full transition-all duration-300"
                      style={{ width: `${consistency}%` }}
                    />
                  </div>
                </div>

                {/* Routine Window & Connected Chains */}
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 capitalize">
                    <Clock className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>{habit.timeOfDay || 'Morning'} Routine</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {outgoingChains.length + incomingChains.length} Chain Links
                  </span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-3 border-t border-[#1E294B] flex items-center justify-between">
                <button
                  onClick={() => setActivePage('chains')}
                  className="text-xs text-[#2DD4BF] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <GitMerge className="w-3 h-3" />
                  <span>View Chains</span>
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenEdit(habit)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#0B1020] transition-colors cursor-pointer"
                    title="Edit Habit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete habit "${habit.name}"? This removes historical logs and chains connected to it.`)) {
                        deleteHabit(habit.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#F472B6] hover:bg-[#0B1020] transition-colors cursor-pointer"
                    title="Delete Habit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredHabits.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[#131B33] border border-[#1E294B] max-w-lg mx-auto">
          <Activity className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No habits found</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Start logging your habits to discover your first habit pattern.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold cursor-pointer"
          >
            Add Your First Habit
          </button>
        </div>
      )}

      {/* Add / Edit Habit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#131B33] border border-[#1E294B] shadow-2xl p-6 relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1E294B]">
              <h3 className="text-base font-bold text-white">
                {editingHabit ? 'Edit Habit' : 'Add New Habit'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Validation Error Banner */}
              {formError && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Name */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Habit Name *
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {formData.name.length}/50
                  </span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={50}
                  value={formData.name}
                  onChange={(e) => {
                    setFormError(null);
                    setFormData({ ...formData, name: e.target.value });
                  }}
                  placeholder="e.g., Morning Hydration, 25-min Study Block"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B1020] border border-[#1E294B] text-sm text-white focus:outline-hidden focus:border-[#2DD4BF]"
                />
              </div>

              {/* Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-[#1E294B] text-xs text-white focus:outline-hidden focus:border-[#2DD4BF]"
                  >
                    <option value="Sleep">Sleep</option>
                    <option value="Study">Study</option>
                    <option value="Exercise">Exercise</option>
                    <option value="Food">Food</option>
                    <option value="Hydration">Hydration</option>
                    <option value="Screen Time">Screen Time</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Personal">Personal</option>
                    <option value="Custom">Custom Category</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Frequency
                  </label>
                  <select
                    value={formData.targetFrequency}
                    onChange={(e) => setFormData({ ...formData, targetFrequency: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B1020] border border-[#1E294B] text-xs text-white focus:outline-hidden focus:border-[#2DD4BF]"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="weekends">Weekends</option>
                    <option value="4x/week">4x / week</option>
                    <option value="3x/week">3x / week</option>
                    <option value="2x/week">2x / week</option>
                  </select>
                </div>
              </div>

              {/* Custom Category Input if selected */}
              {formData.category === 'Custom' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Custom Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customCategory}
                    onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                    placeholder="Enter custom category..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B1020] border border-[#1E294B] text-xs text-white focus:outline-hidden focus:border-[#2DD4BF]"
                  />
                </div>
              )}

              {/* Time of Day */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Routine Phase (Time of Day)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['morning', 'afternoon', 'evening', 'night'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({ ...formData, timeOfDay: t })}
                      className={`py-1.5 rounded-lg text-xs capitalize font-medium border transition-colors cursor-pointer ${
                        formData.timeOfDay === t
                          ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                          : 'bg-[#0B1020] text-slate-400 border-[#1E294B]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description / Specific Intent
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., 500ml water before caffeine intake to stabilize morning focus."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B1020] border border-[#1E294B] text-xs text-white focus:outline-hidden focus:border-[#2DD4BF]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-xs font-semibold text-white shadow-sm cursor-pointer"
                >
                  {editingHabit ? 'Save Changes' : 'Create Habit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
