import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit2, Trash2, X, Save, Video, ArrowLeft } from 'lucide-react';
import { getCategories, getVideoDrills, createVideoDrill, updateVideoDrill, deleteVideoDrill } from '../lib/supabase';
import type { Category, VideoDrill } from '../lib/supabase';
import { parseVideoUrl, validateVideoUrl } from '../utils/videoEmbed';

interface DrillFormData {
  title: string;
  description: string;
  video_url: string;
  category_id: string;
  duration: number;
  difficulty_level: number;
}

interface AdminVideoDrillsProps {
  onBack?: () => void;
}

export default function AdminVideoDrills({ onBack }: AdminVideoDrillsProps) {
  const [drills, setDrills] = useState<VideoDrill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDrill, setEditingDrill] = useState<VideoDrill | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [formData, setFormData] = useState<DrillFormData>({
    title: '',
    description: '',
    video_url: '',
    category_id: '',
    duration: 0,
    difficulty_level: 1,
  });

  const [urlError, setUrlError] = useState<string>('');
  const [previewDrill, setPreviewDrill] = useState<VideoDrill | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateVideoUrl(formData.video_url);
    if (!validation.isValid) {
      setUrlError(validation.error || 'Invalid URL');
      return;
    }

    // Validate required fields
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }
    
    if (!formData.category_id) {
      alert('Please select a category');
      return;
    }
    setLoading(true);
    
    const videoInfo = parseVideoUrl(formData.video_url);
    const drillData = {
      ...formData,
      thumbnail_url: videoInfo.thumbnailUrl || '',
    };

    try {
      if (editingDrill) {
        const { data: updatedDrill, error } = await updateVideoDrill(editingDrill.id, drillData);
        if (error) {
          console.error('Error updating drill:', error);
          alert(`Failed to update drill: ${error.message || 'Please try again.'}`);
          return;
        }
        if (updatedDrill) {
          setPreviewDrill(updatedDrill);
        }
      } else {
        const { data: newDrill, error } = await createVideoDrill(drillData);
        if (error) {
          console.error('Error creating drill:', error);
          alert(`Failed to create drill: ${error.message || 'Please try again.'}`);
          return;
        }
        if (newDrill) {
          setPreviewDrill(newDrill);
        }
      }
      
      resetForm();
      fetchDrills();
    } catch (error) {
      console.error('Error saving drill:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save drill. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (drill: VideoDrill) => {
    setEditingDrill(drill);
    setFormData({
      title: drill.title,
      description: drill.description,
      video_url: drill.video_url,
      category_id: drill.category_id,
      duration: drill.duration,
      difficulty_level: drill.difficulty_level,
    });
    setShowForm(true);
    setUrlError('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this drill?')) return;

    try {
      const { error } = await deleteVideoDrill(id);
      if (error) {
        console.error('Error deleting drill:', error);
        alert('Failed to delete drill. Please try again.');
        return;
      }
      fetchDrills();
    } catch (error) {
      console.error('Error deleting drill:', error);
      alert('Failed to delete drill. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      video_url: '',
      category_id: '',
      duration: 0,
      difficulty_level: 1,
    });
    setEditingDrill(null);
    setShowForm(false);
    setUrlError('');
    setPreviewDrill(null);
  };

  const handleUrlChange = (url: string) => {
    setFormData({ ...formData, video_url: url });
    setUrlError('');
  };

  const filteredDrills = drills.filter(drill => {
    const matchesSearch = drill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || drill.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderVideoPlayer = (drill: VideoDrill) => {
    const videoInfo = parseVideoUrl(drill.video_url);

    if (videoInfo.type === 'youtube') {
      return (
        <iframe
          src={videoInfo.embedUrl}
          className="w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (videoInfo.type === 'instagram') {
      return (
        <iframe
          src={videoInfo.embedUrl}
          className="w-full h-full rounded-lg"
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
          className="w-full h-full rounded-lg"
          allow="encrypted-media;"
          allowFullScreen
        />
      );
    }

    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <p className="text-white">Unable to load video</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={24} className="text-gray-700 dark:text-gray-300" />
              </button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Video Drills Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Manage volleyball training drills</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
          >
            <Plus size={20} className="text-white" />
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search drills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingDrill ? 'Edit Drill' : 'Add New Drill'}
                  </h2>
                  <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Video URL
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.video_url}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      placeholder="YouTube, Instagram, or TikTok URL"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        urlError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {urlError && <p className="text-red-500 text-sm mt-1">{urlError}</p>}
                    <p className="text-gray-500 text-sm mt-1">Supported: YouTube, Instagram, TikTok</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      required
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Duration (seconds)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Difficulty Level
                      </label>
                      <select
                        value={formData.difficulty_level}
                        onChange={(e) => setFormData({ ...formData, difficulty_level: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value={1}>Beginner</option>
                        <option value={2}>Easy</option>
                        <option value={3}>Intermediate</option>
                        <option value={4}>Advanced</option>
                        <option value={5}>Expert</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Save size={20} />
                      {editingDrill ? 'Update' : 'Create'} Drill
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Video Preview Modal */}
        {previewDrill && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Drill Created Successfully!
                  </h2>
                  <button 
                    onClick={() => setPreviewDrill(null)} 
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Video Preview */}
                <div className="aspect-video bg-black rounded-lg mb-6">
                  {renderVideoPlayer(previewDrill)}
                </div>

                {/* Drill Info */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {previewDrill.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {previewDrill.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                      {previewDrill.categories?.name}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      Level {previewDrill.difficulty_level}
                    </span>
                    {previewDrill.duration > 0 && (
                      <span className="text-gray-600 dark:text-gray-400">
                        {Math.floor(previewDrill.duration / 60)}:{(previewDrill.duration % 60).toString().padStart(2, '0')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      handleEdit(previewDrill);
                      setPreviewDrill(null);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Edit2 size={20} />
                    Edit Drill
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(previewDrill.id);
                      setPreviewDrill(null);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Trash2 size={20} />
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setPreviewDrill(null);
                      fetchDrills(); // Refresh the list
                    }}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrills.map(drill => (
              <div key={drill.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {drill.thumbnail_url ? (
                    <img
                      src={drill.thumbnail_url}
                      alt={drill.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Video size={48} className="text-gray-400" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{drill.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{drill.description}</p>
                  <div className="flex items-center gap-2 mb-3 text-sm">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      {drill.categories?.name || 'No Category'}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      Level {drill.difficulty_level}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(drill)}
                      className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(drill.id)}
                      className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredDrills.length === 0 && (
          <div className="text-center py-12">
            <Video size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No drills found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || selectedCategory !== 'all' ? 'Try adjusting your filters' : 'Get started by adding your first drill'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
