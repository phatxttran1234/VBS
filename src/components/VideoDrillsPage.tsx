import { useState, useEffect } from 'react';
import { Search, Filter, X, Play, Clock, ArrowLeft } from 'lucide-react';
import { getCategories, getVideoDrills } from '../lib/supabase';
import type { Category, VideoDrill } from '../lib/supabase';
import { parseVideoUrl } from '../utils/videoEmbed';

const difficultyLabels = ['', 'Beginner', 'Easy', 'Intermediate', 'Advanced', 'Expert'];

interface VideoDrillsPageProps {
  onBack?: () => void;
}

export default function VideoDrillsPage({ onBack }: VideoDrillsPageProps) {
  const [drills, setDrills] = useState<VideoDrill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDrill, setSelectedDrill] = useState<VideoDrill | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchDrills();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await getCategories();
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchDrills = async () => {
    setLoading(true);
    try {
      const { data, error } = await getVideoDrills();
      if (error) {
        console.error('Error fetching drills:', error);
        return;
      }
      setDrills(data || []);
    } catch (error) {
      console.error('Error fetching drills:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDrills = drills.filter(drill => {
    const matchesSearch = drill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || drill.category_id === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || drill.difficulty_level.toString() === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };

  const openDrill = (drill: VideoDrill) => {
    setSelectedDrill(drill);
  };

  const closeDrill = () => {
    setSelectedDrill(null);
  };

  const renderVideoPlayer = (drill: VideoDrill) => {
    const videoInfo = parseVideoUrl(drill.video_url);

    if (videoInfo.type === 'youtube') {
      return (
        <iframe
          src={videoInfo.embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (videoInfo.type === 'instagram') {
      return (
        <iframe
          src={videoInfo.embedUrl}
          className="w-full h-full"
          frameBorder="0"
          scrolling="no"
          allowTransparency
        />
      );
    }

    if (videoInfo.type === 'tiktok') {
      return (
        <iframe
          src={videoInfo.embedUrl}
          className="w-full h-full"
          allow="encrypted-media;"
          allowFullScreen
        />
      );
    }

    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <p className="text-white">Unable to load video</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={24} className="text-gray-700 dark:text-gray-300" />
            </button>
          )}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Video Drills</h1>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search drills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex gap-2 items-center">
            <Filter size={16} className="text-gray-500" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Levels</option>
              <option value="1">Beginner</option>
              <option value="2">Easy</option>
              <option value="3">Intermediate</option>
              <option value="4">Advanced</option>
              <option value="5">Expert</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredDrills.length === 0 ? (
          <div className="text-center py-12">
            <Play size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No drills found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDrills.map(drill => (
              <div
                key={drill.id}
                onClick={() => openDrill(drill)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 group">
                  {drill.thumbnail_url ? (
                    <img
                      src={drill.thumbnail_url}
                      alt={drill.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play size={48} className="text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                    <Play size={48} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {drill.duration > 0 && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <Clock size={12} />
                      {formatDuration(drill.duration)}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{drill.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{drill.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
                      {drill.categories?.name || 'No Category'}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 text-xs">
                      {difficultyLabels[drill.difficulty_level]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedDrill && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedDrill.title}</h2>
              <button
                onClick={closeDrill}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>
            <div className="aspect-video bg-black">
              {renderVideoPlayer(selectedDrill)}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-3 py-1 rounded">
                  {selectedDrill.categories?.name || 'No Category'}
                </span>
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  {difficultyLabels[selectedDrill.difficulty_level]}
                </span>
                {selectedDrill.duration > 0 && (
                  <span className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-1">
                    <Clock size={14} />
                    {formatDuration(selectedDrill.duration)}
                  </span>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300">{selectedDrill.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
