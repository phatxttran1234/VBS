import React from 'react';
import { BookOpen, Play, FolderOpen, LogOut, Shield, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getVocabularyTerms, getVideoDrills, getCategories } from '../lib/supabase';
import type { Page } from '../App';

interface AdminDashboardProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, onLogout }) => {
  const [stats, setStats] = useState({
    totalTerms: 0,
    totalVideos: 0,
    totalCategories: 0,
    loading: true
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [termsResult, videosResult, categoriesResult] = await Promise.all([
        getVocabularyTerms(),
        getVideoDrills(),
        getCategories()
      ]);

      setStats({
        totalTerms: termsResult.data?.length || 0,
        totalVideos: videosResult.data?.length || 0,
        totalCategories: categoriesResult.data?.length || 0,
        loading: false
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const adminCards = [
    {
      id: 'manage-vocabulary',
      title: 'Manage Vocabulary',
      description: 'Add, edit, and organize terms',
      icon: BookOpen,
      color: 'from-blue-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-purple-50',
      iconColor: 'text-indigo-600'
    },
    {
      id: 'manage-videos',
      title: 'Manage Video Drills',
      description: 'Upload and organize videos',
      icon: Play,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-indigo-50',
      iconColor: 'text-purple-600'
    },
    {
      id: 'manage-drills',
      title: 'Manage Drills',
      description: 'Add and organize training drills',
      icon: FolderOpen,
      color: 'from-green-500 to-teal-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-teal-50',
      iconColor: 'text-green-600'
    }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-logo-blue to-logo-blue-light text-white px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full overflow-hidden ring-2 ring-white/40 shadow-lg">
              <img 
                src="/Screenshot 2025-11-21 at 15.51.53.png" 
                alt="VBS Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-blue-100">
                Welcome, Admin
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
          >
            <LogOut className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className={`px-6 py-6 backdrop-blur-md ${
        isDarkMode ? 'bg-black/20' : 'bg-white/20'
      }`}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
        {stats.loading ? (
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center p-4 bg-gray-50 rounded-xl animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-indigo-600">{stats.totalTerms}</div>
              <div className="text-sm text-gray-600">Vocabulary Terms</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">{stats.totalVideos}</div>
              <div className="text-sm text-gray-600">Video Drills</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-xl">
              <div className="text-2xl font-bold text-indigo-600">{stats.totalCategories}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
          </div>
        )}
      </div>

      {/* Management Cards */}
      <div className="px-6 py-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Management</h2>
        <div className="space-y-4">
          {adminCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onNavigate(card.id as Page)}
                className={`backdrop-blur-md rounded-2xl p-6 shadow-sm hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 cursor-pointer border ${
                  isDarkMode ? 'bg-black/20 border-white/10' : 'bg-white/20 border-gray-900/10'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                    <IconComponent className={`w-7 h-7 ${card.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
                    <p className="text-gray-600 text-sm">{card.description}</p>
                  </div>
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};