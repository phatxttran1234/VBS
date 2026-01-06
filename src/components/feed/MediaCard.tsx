import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Play, Sparkles, ChevronDown, ChevronUp, Send, MoreHorizontal } from 'lucide-react';

interface MediaCardProps {
  id: string;
  type: 'video' | 'image' | 'drill';
  title: string;
  description: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  author: {
    name: string;
    avatar: string;
    verified?: boolean;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  category?: string;
  duration?: string;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onSave?: () => void;
}

export function MediaCard({
  type,
  title,
  description,
  mediaUrl,
  thumbnailUrl,
  author,
  stats,
  category,
  duration,
  onLike,
  onShare,
  onSave,
}: MediaCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [expandDescription, setExpandDescription] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.();
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.();
  };

  const handleAIQuery = async () => {
    if (!aiQuery.trim()) return;

    setIsAiLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const responses = [
      `Great question about "${title}"! This drill focuses on developing core volleyball fundamentals. The key is to maintain proper form throughout each repetition.`,
      `Based on this content, I'd recommend focusing on footwork first. Start slow and gradually increase speed as your technique improves.`,
      `This is an excellent drill for ${category || 'skill development'}. Make sure to warm up properly before attempting the full sequence.`,
    ];

    setAiResponse(responses[Math.floor(Math.random() * responses.length)]);
    setIsAiLoading(false);
    setAiQuery('');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <article className="bg-dark-surface rounded-2xl overflow-hidden border border-dark-border/30 animate-fade-in">
      <div className="flex items-center justify-between p-3 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-dark-border">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-dark-text">{author.name}</span>
              {author.verified && (
                <div className="w-4 h-4 rounded-full bg-accent-teal flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-dark-bg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                </div>
              )}
            </div>
            {category && (
              <span className="text-xs text-dark-text-muted">{category}</span>
            )}
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-dark-surface-light transition-colors">
          <MoreHorizontal className="w-5 h-5 text-dark-text-muted" />
        </button>
      </div>

      <div className="relative aspect-video bg-dark-bg-lighter">
        <img
          src={thumbnailUrl || mediaUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        {type === 'video' && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <button className="absolute inset-0 flex items-center justify-center group">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-transform group-hover:scale-110 group-active:scale-95">
                <Play className="w-7 h-7 text-white ml-1" fill="white" />
              </div>
            </button>
            {duration && (
              <span className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 rounded-md text-xs font-medium text-white">
                {duration}
              </span>
            )}
          </>
        )}
        {type === 'drill' && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-accent-coral/90 backdrop-blur-sm rounded-lg">
            <span className="text-xs font-semibold text-white">DRILL</span>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="text-base font-semibold text-dark-text leading-snug mb-1">{title}</h3>
        <div className="relative">
          <p className={`text-sm text-dark-text-secondary leading-relaxed ${!expandDescription ? 'line-clamp-2' : ''}`}>
            {description}
          </p>
          {description.length > 100 && (
            <button
              onClick={() => setExpandDescription(!expandDescription)}
              className="flex items-center gap-1 text-xs text-accent-teal font-medium mt-1"
            >
              {expandDescription ? (
                <>Show less <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>Show more <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-3 py-2 border-t border-dark-border/30">
        <div className="flex items-center gap-1">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 active:scale-95 ${
              isLiked ? 'text-accent-rose' : 'text-dark-text-secondary hover:bg-dark-surface-light'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{formatNumber(stats.likes + (isLiked ? 1 : 0))}</span>
          </button>

          <button
            onClick={() => setShowAIChat(!showAIChat)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 active:scale-95 ${
              showAIChat ? 'text-accent-teal bg-accent-teal/10' : 'text-dark-text-secondary hover:bg-dark-surface-light'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{formatNumber(stats.comments)}</span>
          </button>

          <button
            onClick={onShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-dark-text-secondary hover:bg-dark-surface-light transition-all duration-200 active:scale-95"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-medium">{formatNumber(stats.shares)}</span>
          </button>
        </div>

        <button
          onClick={handleSave}
          className={`p-2 rounded-xl transition-all duration-200 active:scale-95 ${
            isSaved ? 'text-accent-coral' : 'text-dark-text-secondary hover:bg-dark-surface-light'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {showAIChat && (
        <div className="px-3 pb-3 animate-slide-up">
          <div className="bg-dark-bg-lighter rounded-xl p-3 border border-dark-border/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-accent-teal to-accent-teal-light flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-dark-bg" />
              </div>
              <span className="text-sm font-medium text-dark-text">Ask AI about this</span>
            </div>

            {aiResponse && (
              <div className="mb-3 p-3 bg-dark-surface rounded-lg">
                <p className="text-sm text-dark-text-secondary leading-relaxed">{aiResponse}</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAIQuery()}
                placeholder="Ask a question..."
                className="flex-1 bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-sm text-dark-text placeholder:text-dark-text-muted focus:outline-none focus:border-accent-teal/50 transition-colors"
              />
              <button
                onClick={handleAIQuery}
                disabled={isAiLoading || !aiQuery.trim()}
                className="p-2.5 rounded-xl bg-accent-teal text-dark-bg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
              >
                {isAiLoading ? (
                  <div className="w-5 h-5 border-2 border-dark-bg/30 border-t-dark-bg rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
