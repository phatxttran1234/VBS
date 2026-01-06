import React from 'react';
import { Home, Play, BookOpen, Dumbbell, User } from 'lucide-react';

export type FeedTab = 'home' | 'videos' | 'learn' | 'drills' | 'profile';

interface FeedNavigationProps {
  activeTab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
}

const tabs: { id: FeedTab; icon: React.ElementType; label: string }[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'videos', icon: Play, label: 'Videos' },
  { id: 'learn', icon: BookOpen, label: 'Learn' },
  { id: 'drills', icon: Dumbbell, label: 'Drills' },
  { id: 'profile', icon: User, label: 'Profile' },
];

export function FeedNavigation({ activeTab, onTabChange }: FeedNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-dark-bg/90 backdrop-blur-xl border-t border-dark-border/50 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-200 ${
                isActive ? 'scale-105' : 'active:scale-95'
              }`}
              aria-label={tab.label}
            >
              <div
                className={`relative p-2 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-accent-teal/15' : ''
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isActive ? 'text-accent-teal' : 'text-dark-text-muted'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent-teal rounded-full" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium mt-0.5 transition-colors duration-200 ${
                  isActive ? 'text-accent-teal' : 'text-dark-text-muted'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
