import React, { useEffect, useState } from 'react';
import { Wallet as Volleyball, Users, Trophy, Play } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { FlowButton } from './FlowButton';

interface LandingPageProps {
  onPlayerJoin: () => void;
  onCoachLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onPlayerJoin, onCoachLogin }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative z-10">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>
      
      <div className={`relative text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Logo and Title */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl shadow-lg mb-6 overflow-hidden">
            <img 
              src="/Screenshot 2025-11-21 at 15.51.53.png" 
              alt="VBS Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <p className={`text-xl font-medium ${isDarkMode ? 'text-dark-text-secondary' : 'text-gray-600'}`}>
            Volleyball Study System
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-12 max-w-sm mx-auto">
          <div className="text-center">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-logo-blue/30 to-logo-blue-light/20' 
                : 'bg-gradient-to-br from-blue-100 to-purple-100'
            }`}>
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-dark-text-secondary' : 'text-gray-600'}`}>Learn</p>
          </div>
          <div className="text-center">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-logo-blue-light/30 to-logo-blue/20' 
                : 'bg-gradient-to-br from-purple-100 to-indigo-100'
            }`}>
              <Play className="w-6 h-6 text-purple-600" />
            </div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-dark-text-secondary' : 'text-gray-600'}`}>Practice</p>
          </div>
          <div className="text-center">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-logo-blue/30 to-logo-blue-lighter/20' 
                : 'bg-gradient-to-br from-indigo-100 to-blue-100'
            }`}>
              <Trophy className="w-6 h-6 text-blue-600" />
            </div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-dark-text-secondary' : 'text-gray-600'}`}>Excel</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 w-full max-w-sm mx-auto">
          <div className={`${isVisible ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '0.2s' }}>
            <FlowButton 
              text="Get Started" 
              onClick={onPlayerJoin}
              className="w-full"
            />
          </div>
          
          <button
            onClick={onCoachLogin}
            className={`w-full backdrop-blur-md py-4 px-6 rounded-2xl font-semibold text-lg border transform hover:scale-[1.02] transition-all duration-200 ${
              isDarkMode 
                ? 'bg-black/20 text-white border-white/20 hover:bg-black/30 hover:shadow-lg' 
                : 'bg-white/20 text-gray-900 border-gray-900/20 hover:bg-white/30 hover:shadow-lg'
            } ${isVisible ? 'animate-fade-in-up' : ''}`}
            style={{ animationDelay: '0.4s' }}
          >
            Sign In
          </button>
        </div>

        {/* Subtitle */}
        <p className={`text-sm mt-8 transition-all duration-1000 delay-500 ${
          isDarkMode ? 'text-dark-text-secondary' : 'text-gray-500'
        } ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          Master volleyball techniques and terminology
        </p>
      </div>
    </div>
  );
};