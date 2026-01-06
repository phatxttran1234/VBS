import React from 'react';
import { Bell, Search, Zap } from 'lucide-react';

interface FeedHeaderProps {
  onSearchClick?: () => void;
  onNotificationClick?: () => void;
}

export function FeedHeader({ onSearchClick, onNotificationClick }: FeedHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-xl border-b border-dark-border/50">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-teal to-accent-teal-light flex items-center justify-center">
            <Zap className="w-4 h-4 text-dark-bg" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-semibold text-dark-text tracking-tight">VBall AI</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onSearchClick}
            className="p-2.5 rounded-xl hover:bg-dark-surface active:scale-95 transition-all duration-200"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-dark-text-secondary" />
          </button>
          <button
            onClick={onNotificationClick}
            className="p-2.5 rounded-xl hover:bg-dark-surface active:scale-95 transition-all duration-200 relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-dark-text-secondary" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-rose rounded-full animate-pulse-soft" />
          </button>
        </div>
      </div>
    </header>
  );
}
