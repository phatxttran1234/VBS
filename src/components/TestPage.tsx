import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Trophy, RotateCcw, BookOpen } from 'lucide-react';
import { getVocabularyTerms } from '../lib/supabase';
import type { VocabularyTerm } from '../lib/supabase';

interface TestPageProps {
  onBack: () => void;
  userId?: string;
}

interface Question {
  term: VocabularyTerm;
  options: string[];
  correctAnswer: string;
}

interface TestResult {
  term: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export const TestPage: React.FC<TestPageProps> = ({ onBack, userId }) => {
  const [allTerms, setAllTerms] = useState<VocabularyTerm[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadVocabularyAndGenerateTest();
  }, []);

  const loadVocabularyAndGenerateTest = async () => {
    setLoading(true);
    try {
      const { data: terms } = await getVocabularyTerms();
      if (terms && terms.length >= 4) {
        setAllTerms(terms);
        generateQuestions(terms);
      }
    } catch (error) {
      console.error('Error loading vocabulary:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQuestions = (terms: VocabularyTerm[]) => {
    // Shuffle and take 20 terms (or all if less than 20)
    const shuffledTerms = [...terms].sort(() => Math.random() - 0.5);
    const selectedTerms = shuffledTerms.slice(0, Math.min(20, terms.length));

    const generatedQuestions: Question[] = selectedTerms.map(term => {
      // Get 3 random incorrect definitions
      const otherTerms = terms.filter(t => t.id !== term.id);
      const incorrectOptions = otherTerms
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(t => t.definition);

      // Combine correct and incorrect options, then shuffle
      const allOptions = [term.definition, ...incorrectOptions];
      const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);

      return {
        term,
        options: shuffledOptions,
        correctAnswer: term.definition
      };
    });

    setQuestions(generatedQuestions);
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return; // Prevent selection after showing result
    
    setSelectedAnswer(answer);
    setShowResult(true);

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;

    const result: TestResult = {
      term: currentQuestion.term.term,
      userAnswer: answer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect
    };

    setTestResults(prev => [...prev, result]);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Auto-advance after 2 seconds
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer('');
        setShowResult(false);
      } else {
        setTestCompleted(true);
      }
    }, 2000);
  };

  const restartTest = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowResult(false);
    setTestResults([]);
    setTestCompleted(false);
    setScore(0);
    generateQuestions(allTerms);
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'Excellent! Outstanding performance!';
    if (percentage >= 80) return 'Great job! You know your volleyball terms well!';
    if (percentage >= 70) return 'Good work! Keep studying to improve!';
    if (percentage >= 60) return 'Not bad! Review the terms you missed.';
    return 'Keep practicing! Review the vocabulary and try again.';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Preparing your test...</p>
        </div>
      </div>
    );
  }

  if (allTerms.length < 4) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="bg-white/90 backdrop-blur-sm border-b border-blue-100/50 px-6 py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Test</h1>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Enough Terms</h2>
            <p className="text-gray-600 mb-8 max-w-sm">
              You need at least 4 vocabulary terms to take a test. Add more terms to get started!
            </p>
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (testCompleted) {
    const mistakes = testResults.filter(result => !result.isCorrect);
    
    return (
      <div className="min-h-screen flex flex-col">
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Test Results</h1>
          </div>
        </div>

        <div className="flex-1 px-6 py-8">
          {/* Score Section */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Test Complete!</h2>
            <div className={`text-4xl font-bold mb-2 ${getScoreColor(score, questions.length)}`}>
              {score}/{questions.length}
            </div>
            <p className="text-lg text-gray-600 mb-4">
              {Math.round((score / questions.length) * 100)}% Correct
            </p>
            <p className="text-gray-600 max-w-sm mx-auto">
              {getScoreMessage(score, questions.length)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={restartTest}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Take Again</span>
            </button>
            <button
              onClick={onBack}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Mistakes Section */}
          {mistakes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Review Your Mistakes ({mistakes.length})
              </h3>
              <div className="space-y-4">
                {mistakes.map((mistake, index) => (
                  <div key={index} className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{mistake.term}</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-red-600 font-medium">Your answer: </span>
                            <span className="text-gray-700">{mistake.userAnswer}</span>
                          </div>
                          <div>
                            <span className="text-green-600 font-medium">Correct answer: </span>
                            <span className="text-gray-700">{mistake.correctAnswer}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mistakes.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Perfect Score!</h3>
              <p className="text-gray-600">You got every question right. Excellent work!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-blue-100/50 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Test</h1>
          </div>
          <div className="text-sm text-gray-600">
            {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Term and Category */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What is the definition of:
            </h2>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-6 mb-6">
              <h3 className="text-3xl font-bold">{currentQuestion.term.term}</h3>
              {currentQuestion.term.category && (
                <p className="text-blue-200 mt-2">{currentQuestion.term.category.name}</p>
              )}
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ";
              
              if (showResult) {
                if (option === currentQuestion.correctAnswer) {
                  buttonClass += "border-green-500 bg-green-50 text-green-800";
                } else if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
                  buttonClass += "border-red-500 bg-red-50 text-red-800";
                } else {
                  buttonClass += "border-gray-200 bg-gray-50 text-gray-600";
                }
              } else {
                buttonClass += "border-gray-200 bg-white hover:border-blue-500 hover:bg-blue-50 text-gray-900";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                    {showResult && option === currentQuestion.correctAnswer && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                    {showResult && option === selectedAnswer && option !== currentQuestion.correctAnswer && (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Result Message */}
          {showResult && (
            <div className="mt-6 text-center">
              {selectedAnswer === currentQuestion.correctAnswer ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-green-800 font-semibold">Correct!</p>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-800 font-semibold mb-2">Incorrect</p>
                  <p className="text-red-700 text-sm">
                    The correct answer is: <strong>{currentQuestion.correctAnswer}</strong>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Score Display */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-4 bg-white rounded-xl px-6 py-3 shadow-sm border border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{score}</div>
                <div className="text-xs text-gray-600">Correct</div>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{testResults.length - score}</div>
                <div className="text-xs text-gray-600">Wrong</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};