import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Plus, CreditCard as Edit, Trash2, BookOpen, Star } from 'lucide-react';
import { getVocabularyTerms, getCategories, addToFlashcards, removeFromFlashcards, isInFlashcards, deleteVocabularyTerm } from '../lib/supabase';
import type { VocabularyTerm, Category } from '../lib/supabase';
import type { Page, UserRole } from '../App';

interface VocabularyPageProps {
  onBack: () => void;
  onNavigate: (page: Page) => void;
  userRole: UserRole;
  userId?: string;
}

export const VocabularyPage: React.FC<VocabularyPageProps> = ({ onBack, onNavigate, userRole, userId }) => {
  const [terms, setTerms] = useState<VocabularyTerm[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [flashcardStatus, setFlashcardStatus] = useState<Record<string, boolean>>({});

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

        // Load flashcard status from localStorage
        const savedFlashcards = localStorage.getItem('flashcards');
        if (savedFlashcards) {
          const flashcardIds = JSON.parse(savedFlashcards) as string[];
          const statusMap: Record<string, boolean> = {};
          flashcardIds.forEach(id => {
            statusMap[id] = true;
          });
          setFlashcardStatus(statusMap);
        }
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

  const handleFlashcardToggle = (termId: string) => {
    try {
      const isCurrentlyInFlashcards = flashcardStatus[termId];

      // Get current flashcards from localStorage
      const savedFlashcards = localStorage.getItem('flashcards');
      let flashcardIds: string[] = savedFlashcards ? JSON.parse(savedFlashcards) : [];

      if (isCurrentlyInFlashcards) {
        // Remove from flashcards
        flashcardIds = flashcardIds.filter(id => id !== termId);
      } else {
        // Add to flashcards
        flashcardIds.push(termId);
      }

      // Save back to localStorage
      localStorage.setItem('flashcards', JSON.stringify(flashcardIds));

      setFlashcardStatus(prev => ({
        ...prev,
        [termId]: !isCurrentlyInFlashcards
      }));
    } catch (error) {
      console.error('Error toggling flashcard:', error);
    }
  };

  const handleDeleteTerm = async (termId: string) => {
    if (!confirm('Are you sure you want to delete this term?')) return;

    try {
      await deleteVocabularyTerm(termId);
      setTerms(prev => prev.filter(term => term.id !== termId));
    } catch (error) {
      console.error('Error deleting term:', error);
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
      <div className="bg-white/90 backdrop-blur-sm border-b border-logo-blue-lightest/50 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center space-x-3 mb-4">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Vocabulary</h1>
          {userRole === 'admin' && (
            <button
              onClick={() => onNavigate('add-vocabulary')}
              className="ml-auto p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          )}
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
                ? 'bg-gradient-to-r from-logo-blue to-logo-blue-light text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-logo-blue to-logo-blue-light text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

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
                    onClick={() => handleFlashcardToggle(term.id)}
                    className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                      flashcardStatus[term.id]
                        ? 'bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600 hover:from-purple-200 hover:to-indigo-200'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-purple-500'
                    }`}
                    aria-label={flashcardStatus[term.id] ? 'Remove from flashcards' : 'Add to flashcards'}
                  >
                    <Star className={`w-5 h-5 transition-all duration-300 ${flashcardStatus[term.id] ? 'fill-current' : ''}`} />
                  </button>

                  {userRole === 'admin' && (
                    <>
                      <button
                        onClick={() => onNavigate('edit-vocabulary')}
                        className="p-2 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 text-indigo-600 hover:from-blue-200 hover:to-purple-200 transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTerm(term.id)}
                        className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
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
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search or filter'
                : 'No vocabulary terms available yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};