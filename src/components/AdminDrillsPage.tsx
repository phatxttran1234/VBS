import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, Save, X, Loader2, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

interface Drill {
  id: string;
  title: string;
  age_group: string;
  category: string;
  description: string;
  duration?: string;
  setup?: string;
  execution?: string;
  coaching_tips?: string;
  reps?: string;
  order_index: number;
}

interface DrillForm {
  title: string;
  age_group: string;
  category: string;
  description: string;
  duration: string;
  setup: string;
  execution: string;
  coaching_tips: string;
  reps: string;
  order_index: number;
}

const AGE_GROUPS = ['U12', 'U14', 'U16', 'U18'];
const CATEGORIES = ['Warm-up', 'Agility', 'Passing', 'Spiking', 'Setting', 'Serving', 'Other'];

const initialFormState: DrillForm = {
  title: '',
  age_group: 'U12',
  category: 'Warm-up',
  description: '',
  duration: '',
  setup: '',
  execution: '',
  coaching_tips: '',
  reps: '',
  order_index: 0,
};

interface AdminDrillsPageProps {
  onBack?: () => void;
}

export default function AdminDrillsPage({ onBack }: AdminDrillsPageProps) {
  const [drills, setDrills] = useState<Drill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DrillForm>(initialFormState);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('U12');
  const [expandedDrill, setExpandedDrill] = useState<string | null>(null);

  useEffect(() => {
    fetchDrills();
  }, [selectedAgeGroup]);

  const fetchDrills = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('drills')
        .select('*')
        .eq('age_group', selectedAgeGroup)
        .order('category')
        .order('order_index');

      if (error) throw error;
      setDrills(data || []);
    } catch (error) {
      console.error('Error fetching drills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from('drills')
          .update(form)
          .eq('id', editingId);

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
      } else {
        const { error } = await supabase
          .from('drills')
          .insert([form]);

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
      }

      setShowForm(false);
      setEditingId(null);
      setForm(initialFormState);
      fetchDrills();
    } catch (error) {
      console.error('Error saving drill:', error);
      alert(`Failed to save drill: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (drill: Drill) => {
    setForm({
      title: drill.title,
      age_group: drill.age_group,
      category: drill.category,
      description: drill.description,
      duration: drill.duration || '',
      setup: drill.setup || '',
      execution: drill.execution || '',
      coaching_tips: drill.coaching_tips || '',
      reps: drill.reps || '',
      order_index: drill.order_index,
    });
    setEditingId(drill.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this drill?')) return;

    try {
      const { error } = await supabase.from('drills').delete().eq('id', id);
      if (error) throw error;
      fetchDrills();
    } catch (error) {
      console.error('Error deleting drill:', error);
      alert('Failed to delete drill');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(initialFormState);
  };

  const groupedDrills = drills.reduce((acc, drill) => {
    if (!acc[drill.category]) {
      acc[drill.category] = [];
    }
    acc[drill.category].push(drill);
    return acc;
  }, {} as Record<string, Drill[]>);

  const toggleDrill = (drillId: string) => {
    setExpandedDrill(expandedDrill === drillId ? null : drillId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Manage Drills
            </h1>
          </div>
          {!showForm && (
            <button
            onClick={() => setShowForm(true)}
            className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
          >
            <Plus size={20} className="text-white" />
          </button>
          )}
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {editingId ? 'Edit Drill' : 'Add New Drill'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Age Group *
                  </label>
                  <select
                    required
                    value={form.age_group}
                    onChange={(e) => setForm({ ...form, age_group: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {AGE_GROUPS.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 15 min"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reps/Sets
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 3-4 sets × 6-8 reps"
                    value={form.reps}
                    onChange={(e) => setForm({ ...form, reps: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Order Index
                  </label>
                  <input
                    type="number"
                    value={form.order_index}
                    onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Setup
                </label>
                <textarea
                  rows={3}
                  value={form.setup}
                  onChange={(e) => setForm({ ...form, setup: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Execution
                </label>
                <textarea
                  rows={4}
                  value={form.execution}
                  onChange={(e) => setForm({ ...form, execution: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Coaching Tips
                </label>
                <textarea
                  rows={3}
                  value={form.coaching_tips}
                  onChange={(e) => setForm({ ...form, coaching_tips: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {editingId ? 'Update' : 'Save'} Drill
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {AGE_GROUPS.map((group) => (
            <button
              key={group}
              onClick={() => setSelectedAgeGroup(group)}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                selectedAgeGroup === group
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {group}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : Object.keys(groupedDrills).length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No drills available for {selectedAgeGroup} yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedDrills).map(([category, categoryDrills]) => (
              <div key={category} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
                  <h2 className="text-xl font-bold text-white">{category}</h2>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {categoryDrills.map((drill) => (
                    <div key={drill.id}>
                      <div className="px-4 py-4 flex items-start justify-between">
                        <button
                          onClick={() => toggleDrill(drill.id)}
                          className="flex-1 text-left"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {drill.title}
                          </h3>
                          {drill.duration && (
                            <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">
                              {drill.duration}
                            </span>
                          )}
                        </button>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleEdit(drill)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(drill.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => toggleDrill(drill.id)}
                            className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            {expandedDrill === drill.id ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {expandedDrill === drill.id && (
                        <div className="px-4 pb-4 space-y-4 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-4">
                          {drill.description && (
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Description
                              </h4>
                              <p className="whitespace-pre-wrap">{drill.description}</p>
                            </div>
                          )}

                          {drill.setup && (
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Setup
                              </h4>
                              <p className="whitespace-pre-wrap">{drill.setup}</p>
                            </div>
                          )}

                          {drill.execution && (
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Execution
                              </h4>
                              <p className="whitespace-pre-wrap">{drill.execution}</p>
                            </div>
                          )}

                          {drill.coaching_tips && (
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Coaching Tips
                              </h4>
                              <p className="whitespace-pre-wrap">{drill.coaching_tips}</p>
                            </div>
                          )}

                          {drill.reps && (
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Reps
                              </h4>
                              <p className="whitespace-pre-wrap">{drill.reps}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
