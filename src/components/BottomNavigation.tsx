import React from 'react';
import { Home, BookOpen, Zap, FileText, Play, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import type { Page } from '../App';

interface BottomNavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentPage, onNavigate }) => {
  const { isDarkMode } = useTheme();
  
  const navItems = [
    { id: 'player-dashboard', label: 'Home', icon: Home },
    { id: 'vocabulary', label: 'Vocab', icon: BookOpen },
    { id: 'flashcards', label: 'Cards', icon: Zap },
    { id: 'test', label: 'Test', icon: FileText },
    { id: 'videos', label: 'Videos', icon: Play },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 backdrop-blur-lg border-t ${
      isDarkMode 
        ? 'bg-dark-bg-light/90 border-dark-bg-lighter' 
        : 'bg-white/90 border-gray-200'
    }`}>
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as Page)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                  : isDarkMode
                    ? 'text-dark-text-secondary hover:text-indigo-400 hover:bg-gradient-to-br hover:from-logo-blue/20 hover:to-logo-blue-light/20'
                    : 'text-gray-600 hover:text-indigo-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50'
              }`}
            >
              <IconComponent className={`w-5 h-5 mb-1 ${isActive ? 'text-white' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-white' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};