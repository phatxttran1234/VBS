import React from 'react';
import { Plus } from 'lucide-react';

interface Story {
  id: string;
  username: string;
  avatar: string;
  hasNew: boolean;
  isOwn?: boolean;
}

interface StoryReelProps {
  stories: Story[];
  onStoryClick?: (story: Story) => void;
  onAddStory?: () => void;
}

export function StoryReel({ stories, onStoryClick, onAddStory }: StoryReelProps) {
  return (
    <div className="py-4">
      <div className="flex gap-4 px-4 overflow-x-auto scrollbar-hide">
        <button
          onClick={onAddStory}
          className="flex flex-col items-center gap-1.5 flex-shrink-0"
        >
          <div className="relative w-16 h-16 rounded-full bg-dark-surface border-2 border-dashed border-dark-border flex items-center justify-center">
            <Plus className="w-6 h-6 text-dark-text-muted" />
          </div>
          <span className="text-[11px] text-dark-text-muted font-medium">Add</span>
        </button>

        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => onStoryClick?.(story)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0"
          >
            <div
              className={`relative w-16 h-16 rounded-full p-[2px] ${
                story.hasNew
                  ? 'bg-gradient-to-br from-accent-teal via-accent-coral to-accent-rose'
                  : 'bg-dark-border'
              }`}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-dark-bg p-[2px]">
                <img
                  src={story.avatar}
                  alt={story.username}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              {story.hasNew && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-accent-teal text-[8px] font-bold text-dark-bg rounded-full uppercase">
                  New
                </span>
              )}
            </div>
            <span className="text-[11px] text-dark-text-secondary font-medium max-w-[60px] truncate">
              {story.username}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
