import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, ArrowLeft, Target, Clock, Filter, Play } from 'lucide-react';
import DrillDetailModal from './DrillDetailModal';

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
  difficulty?: string;
  equipment?: string;
  order_index: number;
  video_url?: string;
}

const AGE_GROUPS = ['U12', 'U14', 'U16', 'U18'];
const CATEGORIES = ['All', 'Warm-up', 'Agility', 'Passing', 'Spiking', 'Setting', 'Serving', 'Other'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

interface DrillsPageProps {
  onBack?: () => void;
}

export default function DrillsPage({ onBack }: DrillsPageProps) {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('U12');
  const [drills, setDrills] = useState<Drill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [equipmentFilter, setEquipmentFilter] = useState<string>('');

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

  const filteredDrills = drills.filter((drill) => {
    if (selectedCategory !== 'All' && drill.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'All' && drill.difficulty !== selectedDifficulty) return false;
    if (equipmentFilter && !drill.equipment?.toLowerCase().includes(equipmentFilter.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0a0f1e] pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-lg bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <h1 className="text-4xl font-bold text-white">
            Training Drills
          </h1>
        </div>

        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {AGE_GROUPS.map((group) => (
            <button
              key={group}
              onClick={() => setSelectedAgeGroup(group)}
              className={`px-8 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                selectedAgeGroup === group
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              {group}
            </button>
          ))}
        </div>

        <div className="sticky top-0 z-10 bg-[#0f1729] border border-gray-800 rounded-xl p-4 mb-6 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Skill</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-blue-500 focus:outline-none transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-blue-500 focus:outline-none transition-colors"
              >
                {DIFFICULTIES.map((diff) => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Equipment</label>
              <input
                type="text"
                placeholder="Search equipment..."
                value={equipmentFilter}
                onChange={(e) => setEquipmentFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
          </div>
        ) : filteredDrills.length === 0 ? (
          <div className="bg-gray-800/30 border border-gray-800 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-lg">
              No drills match your filters for {selectedAgeGroup}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDrills.map((drill) => (
              <div
                key={drill.id}
                className="group bg-[#0f1729] border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-video bg-gradient-to-br from-gray-800/50 to-gray-900/50 flex items-center justify-center border-b border-gray-800">
                  <Target className="w-12 h-12 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                  {drill.video_url && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-md flex items-center gap-1 text-xs font-semibold shadow-lg">
                      <Play className="w-3 h-3 fill-current" />
                      VIDEO
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-400 bg-blue-400/10 rounded-full mb-3">
                    {drill.category}
                  </span>

                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                    {drill.title}
                  </h3>

                  <div className="flex items-center justify-between mb-4">
                    {drill.duration && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">{drill.duration}</span>
                      </div>
                    )}
                    {drill.difficulty && (
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        drill.difficulty === 'Beginner' ? 'bg-green-400/10 text-green-400' :
                        drill.difficulty === 'Intermediate' ? 'bg-yellow-400/10 text-yellow-400' :
                        'bg-red-400/10 text-red-400'
                      }`}>
                        {drill.difficulty}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedDrill(drill)}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                  >
                    View Drill
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedDrill && (
        <DrillDetailModal
          drill={selectedDrill}
          onClose={() => setSelectedDrill(null)}
        />
      )}
    </div>
  );
}
