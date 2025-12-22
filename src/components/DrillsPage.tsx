import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ChevronDown, ChevronUp, Loader2, ArrowLeft } from 'lucide-react';

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

const AGE_GROUPS = ['U12', 'U14', 'U16', 'U18'];

interface DrillsPageProps {
  onBack?: () => void;
}

export default function DrillsPage({ onBack }: DrillsPageProps) {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('U12');
  const [drills, setDrills] = useState<Drill[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDrill, setExpandedDrill] = useState<string | null>(null);

  useEffect(() => {
    fetchDrills();
  }, [selectedAgeGroup]);

  const fetchDrills = async () => {
    setLoading(true);
    try {
      console.log('Fetching drills for age group:', selectedAgeGroup);
      const { data, error } = await supabase
        .from('drills')
        .select('*')
        .eq('age_group', selectedAgeGroup)
        .order('category')
        .order('order_index');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      console.log('Fetched drills:', data?.length, 'drills');
      setDrills(data || []);
    } catch (error) {
      console.error('Error fetching drills:', error);
    } finally {
      setLoading(false);
    }
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
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Training Drills
          </h1>
        </div>

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
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-4">
                  <h2 className="text-2xl font-extrabold text-white tracking-wide uppercase">{category}</h2>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {categoryDrills.map((drill) => (
                    <div key={drill.id}>
                      <button
                        onClick={() => toggleDrill(drill.id)}
                        className="w-full px-4 py-4 flex items-start justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex-1 text-left">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {drill.title}
                          </h3>
                          {drill.duration && (
                            <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">
                              {drill.duration}
                            </span>
                          )}
                        </div>
                        {expandedDrill === drill.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                        )}
                      </button>

                      {expandedDrill === drill.id && (
                        <div className="px-4 pb-4 space-y-4 text-gray-700 dark:text-gray-300">
                          {drill.description && (
                            <div>
                              <h4 className="font-semibold text-red-600 dark:text-red-500 mb-2">
                                Description
                              </h4>
                              <p className="whitespace-pre-wrap">{drill.description}</p>
                            </div>
                          )}

                          {drill.setup && (
                            <div>
                              <h4 className="font-semibold text-red-600 dark:text-red-500 mb-2">
                                Setup
                              </h4>
                              <p className="whitespace-pre-wrap">{drill.setup}</p>
                            </div>
                          )}

                          {drill.execution && (
                            <div>
                              <h4 className="font-semibold text-red-600 dark:text-red-500 mb-2">
                                Execution
                              </h4>
                              <p className="whitespace-pre-wrap">{drill.execution}</p>
                            </div>
                          )}

                          {drill.coaching_tips && (
                            <div>
                              <h4 className="font-semibold text-red-600 dark:text-red-500 mb-2">
                                Coaching Tips
                              </h4>
                              <p className="whitespace-pre-wrap">{drill.coaching_tips}</p>
                            </div>
                          )}

                          {drill.reps && (
                            <div>
                              <h4 className="font-semibold text-red-600 dark:text-red-500 mb-2">
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
