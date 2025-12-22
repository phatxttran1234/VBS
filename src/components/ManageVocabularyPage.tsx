import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Search, CreditCard as Edit, Trash2, BookOpen, Save, X } from 'lucide-react';
import { getVocabularyTerms, getCategories, createVocabularyTerm, updateVocabularyTerm, deleteVocabularyTerm } from '../lib/supabase';
import type { VocabularyTerm, Category } from '../lib/supabase';

interface ManageVocabularyPageProps {
  onBack: () => void;
}

interface TermFormData {
  term: string;
  definition: string;
  example: string;
  category_id: string;
  difficulty_level: number;
}

export const ManageVocabularyPage: React.FC<ManageVocabularyPageProps> = ({ onBack }) => {
  const [terms, setTerms] = useState<VocabularyTerm[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTerm, setEditingTerm] = useState<VocabularyTerm | null>(null);
  const [formData, setFormData] = useState<TermFormData>({
    term: '',
    definition: '',
    example: '',
    category_id: '',
    difficulty_level: 1
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [termsResult, categoriesResult] = await Promise.all([
        getVocabularyTerms(),
        getCategories()
      ]);

      if (termsResult.data) {
        setTerms(termsResult.data);
      }

      if (categoriesResult.data) {
        setCategories(categoriesResult.data);
      }
    } catch (error) {
      console.error('Error loading vocabulary data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTerms = terms.filter(term => {
    const matchesCategory = selectedCategory === 'all' || term.category_id === selectedCategory;
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const resetForm = () => {
    setFormData({
      term: '',
      definition: '',
      example: '',
      category_id: '',
      difficulty_level: 1
    });
    setEditingTerm(null);
    setShowAddForm(false);
  };

  const handleAddNew = () => {
    resetForm();
    setShowAddForm(true);
  };

  const handleEdit = (term: VocabularyTerm) => {
    setFormData({
      term: term.term,
      definition: term.definition,
      example: term.example || '',
      category_id: term.category_id || '',
      difficulty_level: term.difficulty_level
    });
    setEditingTerm(term);
    setShowAddForm(true);
  };

  const handleDelete = async (termId: string) => {
    if (!confirm('Are you sure you want to delete this term? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteVocabularyTerm(termId);
      setTerms(prev => prev.filter(term => term.id !== termId));
    } catch (error) {
      console.error('Error deleting term:', error);
      alert('Failed to delete term. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingTerm) {
        // Update existing term
        const { data, error } = await updateVocabularyTerm(editingTerm.id, formData);
        
        if (error) {
          console.error('Update error:', error);
          throw new Error(error.message || 'Failed to update term');
        }

        if (data) {
          setTerms(prev => prev.map(term => 
            term.id === editingTerm.id ? data : term
          ));
        }
      } else {
        // Create new term
        const termData = {
          term: formData.term.trim(),
          definition: formData.definition.trim(),
          example: formData.example.trim() || null,
          category_id: formData.category_id || null,
          difficulty_level: formData.difficulty_level
        };
        
        const { data, error } = await createVocabularyTerm(termData);
        
        if (error) {
          console.error('Create error:', error);
          throw new Error(error.message || 'Failed to create term');
        }

        if (data) {
          setTerms(prev => [data, ...prev]);
        }
      }

      resetForm();
    } catch (error) {
      console.error('Error saving term:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save term. Please try again.';
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-orange-100 text-orange-800';
      case 4: return 'bg-red-100 text-red-800';
      case 5: return 'bg-gray-700 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1: return 'Beginner';
      case 2: return 'Basic';
      case 3: return 'Intermediate';
      case 4: return 'Advanced';
      case 5: return 'Expert';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading vocabulary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-blue-100/50 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center space-x-3 mb-4">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Manage Vocabulary</h1>
          <button
            onClick={handleAddNew}
            className="ml-auto p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Categories ({terms.length})
          </button>
          {categories.map((category) => {
            const categoryCount = terms.filter(term => term.category_id === category.id).length;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name} ({categoryCount})
              </button>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingTerm ? 'Edit Term' : 'Add New Term'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Term */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Term *
                </label>
                <input
                  type="text"
                  value={formData.term}
                  onChange={(e) => setFormData(prev => ({ ...prev, term: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter volleyball term"
                  required
                />
              </div>

              {/* Definition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Definition *
                </label>
                <textarea
                  value={formData.definition}
                  onChange={(e) => setFormData(prev => ({ ...prev, definition: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter definition"
                  rows={3}
                  required
                />
              </div>

              {/* Example */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Example (Optional)
                </label>
                <textarea
                  value={formData.example}
                  onChange={(e) => setFormData(prev => ({ ...prev, example: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter usage example"
                  rows={2}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">No Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={formData.difficulty_level}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty_level: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1}>1 - Beginner</option>
                  <option value={2}>2 - Basic</option>
                  <option value={3}>3 - Intermediate</option>
                  <option value={4}>4 - Advanced</option>
                  <option value={5}>5 - Expert</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingTerm ? 'Update' : 'Add'} Term</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Terms List */}
      <div className="px-6 py-6">
        <div className="space-y-4">
          {filteredTerms.map((term) => (
            <div
              key={term.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{term.term}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(term.difficulty_level)}`}>
                      {getDifficultyLabel(term.difficulty_level)}
                    </span>
                  </div>
                  {term.category && (
                    <p className="text-sm text-blue-600 font-medium mb-2">{term.category.name}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(term)}
                    className="p-2 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 text-indigo-600 hover:from-blue-200 hover:to-purple-200 transition-colors duration-200"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(term.id)}
                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-gray-700 leading-relaxed">{term.definition}</p>
                {term.example && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-500 mb-1">Example:</p>
                    <p className="text-gray-600 italic">{term.example}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No terms found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search or filter'
                : 'No vocabulary terms available yet'}
            </p>
            {(!searchTerm && selectedCategory === 'all') && (
              <button
                onClick={handleAddNew}
                className="bg-gradient-to-r from-logo-blue to-logo-blue-light text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              >
                Add First Term
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};