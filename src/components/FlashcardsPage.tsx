import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, ChevronLeft, ChevronRight, Star, BookOpen } from 'lucide-react';
import { getVocabularyTerms } from '../lib/supabase';
import type { VocabularyTerm } from '../lib/supabase';

interface FlashcardsPageProps {
  onBack: () => void;
  userId?: string;
  onNavigateToVocabulary?: () => void;
}

export const FlashcardsPage: React.FC<FlashcardsPageProps> = ({ onBack, userId, onNavigateToVocabulary }) => {
  const [flashcards, setFlashcards] = useState<VocabularyTerm[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlashcards();
  }, []);

  const loadFlashcards = async () => {
    setLoading(true);
    try {
      // Get flashcard IDs from localStorage
      const savedFlashcards = localStorage.getItem('flashcards');
      if (!savedFlashcards) {
        setLoading(false);
        return;
      }

      const flashcardIds: string[] = JSON.parse(savedFlashcards);

      // Get all vocabulary terms
      const { data: allTerms } = await getVocabularyTerms();

      if (allTerms) {
        // Filter to only include flashcard terms
        const flashcardTerms = allTerms.filter(term => flashcardIds.includes(term.id));
        setFlashcards(flashcardTerms);
      }
    } catch (error) {
      console.error('Error loading flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFlashcards = (termId: string) => {
    try {
      // Get current flashcards from localStorage
      const savedFlashcards = localStorage.getItem('flashcards');
      let flashcardIds: string[] = savedFlashcards ? JSON.parse(savedFlashcards) : [];

      // Remove from flashcards
      flashcardIds = flashcardIds.filter(id => id !== termId);

      // Save back to localStorage
      localStorage.setItem('flashcards', JSON.stringify(flashcardIds));

      // Update state
      setFlashcards(prev => prev.filter(card => card.id !== termId));

      // Adjust current index if necessary
      if (currentIndex >= flashcards.length - 1 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
      setIsFlipped(false);
    } catch (error) {
      console.error('Error removing flashcard:', error);
    }
  };

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
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
            <Star className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-blue-100/50 px-6 py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Flashcards</h1>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Star className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Flashcards Yet</h2>
            <p className="text-gray-600 mb-8 max-w-sm">
              Add vocabulary terms to your flashcards from the vocabulary page to start studying!
            </p>
            <button
              onClick={onNavigateToVocabulary || onBack}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
            >
              Browse Vocabulary
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const term = currentCard;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-logo-blue-lightest/50 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Flashcards</h1>
          </div>
          <div className="text-sm text-gray-600">
            {currentIndex + 1} of {flashcards.length}
          </div>
        </div>
        <button
          onClick={onNavigateToVocabulary || onBack}
          className="w-full py-2 px-4 bg-logo-blue-bg hover:bg-logo-blue-lightest text-logo-blue rounded-xl text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <Star className="w-4 h-4" />
          <span>Add More Flashcards</span>
        </button>
      </div>

      {/* Flashcard */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          {/* Card */}
          <div
            onClick={flipCard}
            className="relative w-full h-[500px] cursor-pointer"
            style={{ perspective: '1000px' }}
          >
            <div
              className="absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out transform-style-preserve-3d"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* Front Side */}
              <div
                className="absolute inset-0 w-full h-full backface-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 h-full flex flex-col items-center justify-center text-white shadow-xl">
                  <div className="text-center flex-1 flex flex-col justify-center">
                    <BookOpen className="w-12 h-12 text-blue-200 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold mb-4 break-words leading-tight">{term?.term}</h2>
                    {term?.category && (
                      <p className="text-blue-200 text-lg mb-4">{term.category.name}</p>
                    )}
                    <div className="flex items-center justify-center">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getDifficultyColor(term?.difficulty_level || 1)}`}>
                        {getDifficultyLabel(term?.difficulty_level || 1)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-blue-200 text-sm">Tap to reveal definition</p>
                  </div>
                </div>
              </div>

              {/* Back Side */}
              <div
                className="absolute inset-0 w-full h-full backface-hidden"
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <div className="bg-gradient-to-br from-logo-blue-light to-logo-blue-lighter rounded-3xl p-8 h-full flex flex-col justify-center text-white shadow-xl">
                  <div className="text-center space-y-6 flex-1 flex flex-col justify-center">
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-purple-200">Definition</h3>
                      <p className="text-lg leading-relaxed break-words px-2">{term?.definition}</p>
                    </div>
                    {term?.example && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-3 text-purple-200">Example</h3>
                        <p className="text-base leading-relaxed italic break-words px-2">{term.example}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-6">
                    <p className="text-purple-200 text-sm">Tap to see term</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prevCard}
              disabled={currentIndex === 0}
              className={`p-3 rounded-full transition-colors duration-200 ${
                currentIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4">
              <button
                onClick={flipCard}
                className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
              >
                <RotateCcw className="w-6 h-6" />
              </button>

              <button
                onClick={() => handleRemoveFromFlashcards(currentCard.id)}
                className="p-3 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
              >
                <Star className="w-6 h-6 fill-current" />
              </button>
            </div>

            <button
              onClick={nextCard}
              disabled={currentIndex === flashcards.length - 1}
              className={`p-3 rounded-full transition-colors duration-200 ${
                currentIndex === flashcards.length - 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-br from-blue-100 to-purple-100 text-indigo-600 hover:from-blue-200 hover:to-purple-200'
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              {flashcards.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index === currentIndex ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};