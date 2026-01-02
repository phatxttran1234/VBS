import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { BackgroundPaths } from './components/ui/background-paths';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { PlayerDashboard } from './components/PlayerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { PlaceholderPage } from './components/PlaceholderPage';
import { VocabularyPage } from './components/VocabularyPage';
import { FlashcardsPage } from './components/FlashcardsPage';
import { TestPage } from './components/TestPage';
import { ManageVocabularyPage } from './components/ManageVocabularyPage';
import VideoDrillsPage from './components/VideoDrillsPage';
import AdminVideoDrills from './components/AdminVideoDrills';
import DrillsPage from './components/DrillsPage';
import AdminDrillsPage from './components/AdminDrillsPage';
import { ChatBot } from './components/ChatBot';

export type Page =
  | 'landing'
  | 'login'
  | 'player-dashboard'
  | 'admin-dashboard'
  | 'vocabulary'
  | 'flashcards'
  | 'test'
  | 'videos'
  | 'drills'
  | 'progress'
  | 'profile'
  | 'manage-vocabulary'
  | 'manage-videos'
  | 'manage-drills'
  | 'manage-categories'
  | 'add-vocabulary'
  | 'edit-vocabulary';

export type UserRole = 'coach' | 'admin' | null;

function AppContent() {
  const { isDarkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [guestUserId, setGuestUserId] = useState<string>('');

  // Generate or retrieve guest user ID
  useEffect(() => {
    let userId = localStorage.getItem('guestUserId');
    if (!userId) {
      userId = 'guest_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('guestUserId', userId);
    }
    setGuestUserId(userId);
  }, []);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const handleCoachLogin = () => {
    setUserRole('coach');
    setCurrentPage('player-dashboard');
  };

  const handleAdminLogin = () => {
    setUserRole('admin');
    setCurrentPage('admin-dashboard');
  };

  const handleLogout = async () => {
    setUserRole(null);
    setCurrentPage('landing');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage 
            onPlayerJoin={() => navigateTo('login')}
            onCoachLogin={() => navigateTo('login')}
          />
        );
      case 'login':
        return (
          <LoginPage 
            onBack={() => navigateTo('landing')}
            onCoachLogin={handleCoachLogin}
            onAdminLogin={handleAdminLogin}
          />
        );
      case 'player-dashboard':
        return (
          <PlayerDashboard 
            onNavigate={navigateTo}
            onLogout={handleLogout}
            currentPage={currentPage}
          />
        );
      case 'admin-dashboard':
        return (
          <AdminDashboard 
            onNavigate={navigateTo}
            onLogout={handleLogout}
          />
        );
      case 'manage-vocabulary':
        return (
          <ManageVocabularyPage 
            onBack={() => navigateTo('admin-dashboard')}
          />
        );
      case 'vocabulary':
        return (
          <VocabularyPage 
            onBack={() => {
              if (userRole === 'coach') {
                navigateTo('player-dashboard');
              } else if (userRole === 'admin') {
                navigateTo('admin-dashboard');
              } else {
                navigateTo('landing');
              }
            }}
            onNavigate={navigateTo}
            userRole={userRole}
            userId={guestUserId}
          />
        );
      case 'flashcards':
        return (
          <FlashcardsPage
            onBack={() => {
              if (userRole === 'coach') {
                navigateTo('player-dashboard');
              } else if (userRole === 'admin') {
                navigateTo('admin-dashboard');
              } else {
                navigateTo('landing');
              }
            }}
            onNavigateToVocabulary={() => navigateTo('vocabulary')}
            userId={guestUserId}
          />
        );
      case 'test':
        return (
          <TestPage
            onBack={() => {
              if (userRole === 'coach') {
                navigateTo('player-dashboard');
              } else if (userRole === 'admin') {
                navigateTo('admin-dashboard');
              } else {
                navigateTo('landing');
              }
            }}
            userId={guestUserId}
          />
        );
      case 'videos':
        return (
          <VideoDrillsPage
            onBack={() => {
              if (userRole === 'coach') {
                navigateTo('player-dashboard');
              } else if (userRole === 'admin') {
                navigateTo('admin-dashboard');
              } else {
                navigateTo('landing');
              }
            }}
          />
        );
      case 'manage-videos':
        return (
          <AdminVideoDrills
            onBack={() => navigateTo('admin-dashboard')}
          />
        );
      case 'drills':
        return (
          <DrillsPage
            onBack={() => {
              if (userRole === 'coach') {
                navigateTo('player-dashboard');
              } else if (userRole === 'admin') {
                navigateTo('admin-dashboard');
              } else {
                navigateTo('landing');
              }
            }}
          />
        );
      case 'manage-drills':
        return (
          <AdminDrillsPage
            onBack={() => navigateTo('admin-dashboard')}
          />
        );
      default:
        return (
          <PlaceholderPage 
            title={currentPage.charAt(0).toUpperCase() + currentPage.slice(1).replace('-', ' ')}
            onBack={() => {
              if (userRole === 'coach') {
                navigateTo('player-dashboard');
              } else if (userRole === 'admin') {
                navigateTo('admin-dashboard');
              } else {
                navigateTo('landing');
              }
            }}
          />
        );
    }
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <BackgroundPaths className="fixed inset-0">
        <div className="relative z-10 min-h-screen">
          {renderPage()}
        </div>
      </BackgroundPaths>
      <ChatBot />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;