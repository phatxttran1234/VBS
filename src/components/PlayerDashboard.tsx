import React from 'react';
import { BookOpen, Zap, FileText, Play, TrendingUp, User, Home, LogOut } from 'lucide-react';
import { BottomNavigation } from './BottomNavigation';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import type { Page } from '../App';

interface PlayerDashboardProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  currentPage: Page;
}

export const PlayerDashboard: React.FC<PlayerDashboardProps> = ({ onNavigate, onLogout, currentPage }) => {
  const { isDarkMode } = useTheme();

  const dashboardCards = [
    {
      id: 'vocabulary',
      title: 'Vocabulary',
      description: 'Learn volleyball terms',
      icon: BookOpen,
      color: 'from-blue-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-purple-50',
      iconColor: 'text-indigo-600'
    },
    {
      id: 'flashcards',
      title: 'Flashcards',
      description: 'Quick study cards',
      icon: Zap,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-indigo-50',
      iconColor: 'text-purple-600'
    },
    {
      id: 'test',
      title: 'Test',
      description: 'Check your knowledge',
      icon: FileText,
      color: 'from-indigo-500 to-blue-600',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-blue-50',
      iconColor: 'text-indigo-600'
    },
    {
      id: 'videos',
      title: 'Video Drills',
      description: 'Watch and learn',
      icon: Play,
      color: 'from-blue-500 to-purple-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-purple-50',
      iconColor: 'text-blue-600'
    },
    {
      id: 'drills',
      title: 'Drills',
      description: 'Training exercises',
      icon: TrendingUp,
      color: 'from-green-500 to-teal-500',
      bgColor: 'bg-gradient-to-br from-green-50 to-teal-50',
      iconColor: 'text-green-600'
    }
  ];

  return (
    <div className="min-h-screen pb-20 relative z-10">
      {/* Header */}
      <div className={`backdrop-blur-sm border-b px-6 py-4 ${
        isDarkMode 
          ? 'bg-dark-bg-light/90 border-dark-bg-lighter/50' 
          : 'bg-white/90 border-logo-blue-lightest/50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-md ring-2 ring-white/50">
              <img 
                src="/Screenshot 2025-11-21 at 15.51.53.png" 
                alt="VBS Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                Welcome, Coach!
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-dark-text-secondary' : 'text-gray-600'}`}>
                Ready to improve?
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={onLogout}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-dark-bg-lighter hover:bg-dark-bg text-dark-text-secondary' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 gap-4">
          {dashboardCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onNavigate(card.id as Page)}
                className={`backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 cursor-pointer border ${
                  isDarkMode 
                    ? 'bg-dark-bg-light/90 border-dark-bg-lighter' 
                    : 'bg-white/90 border-gray-100'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isDarkMode ? 'bg-logo-blue/20' : card.bgColor
                  }`}>
                    <IconComponent className={`w-6 h-6 ${card.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                      {card.title}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-dark-text-secondary' : 'text-gray-600'}`}>
                      {card.description}
                    </p>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isDarkMode ? 'bg-dark-bg-lighter' : 'bg-gray-100'
                  }`}>
                    <svg className={`w-4 h-4 ${isDarkMode ? 'text-dark-text-secondary' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage={currentPage} onNavigate={onNavigate} />
    </div>
  );
};