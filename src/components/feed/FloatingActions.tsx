import React, { useState } from 'react';
import { Plus, X, Video, BookOpen, Dumbbell, FileText } from 'lucide-react';

interface FloatingActionsProps {
  onCreateVideo?: () => void;
  onCreateDrill?: () => void;
  onCreateLesson?: () => void;
  onCreatePost?: () => void;
}

export function FloatingActions({
  onCreateVideo,
  onCreateDrill,
  onCreateLesson,
  onCreatePost,
}: FloatingActionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    { icon: Video, label: 'Video', color: 'bg-accent-coral', onClick: onCreateVideo },
    { icon: Dumbbell, label: 'Drill', color: 'bg-accent-teal', onClick: onCreateDrill },
    { icon: BookOpen, label: 'Lesson', color: 'bg-logo-blue', onClick: onCreateLesson },
    { icon: FileText, label: 'Post', color: 'bg-accent-rose', onClick: onCreatePost },
  ];

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col-reverse items-end gap-3">
      {isExpanded && (
        <div className="flex flex-col gap-2 animate-slide-up">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => {
                  action.onClick?.();
                  setIsExpanded(false);
                }}
                className="flex items-center gap-3 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="px-3 py-1.5 bg-dark-surface rounded-lg text-sm font-medium text-dark-text opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  {action.label}
                </span>
                <div
                  className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center shadow-lg transition-transform active:scale-90`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 rounded-full bg-gradient-to-br from-accent-teal to-accent-teal-light flex items-center justify-center shadow-lg shadow-accent-teal/30 transition-all duration-300 active:scale-90 ${
          isExpanded ? 'rotate-45' : ''
        }`}
      >
        {isExpanded ? (
          <X className="w-6 h-6 text-dark-bg" />
        ) : (
          <Plus className="w-6 h-6 text-dark-bg" />
        )}
      </button>

      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
}
