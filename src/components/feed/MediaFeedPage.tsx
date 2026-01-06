import React, { useState, useEffect } from 'react';
import { FeedHeader } from './FeedHeader';
import { FeedNavigation, FeedTab } from './FeedNavigation';
import { MediaCard } from './MediaCard';
import { StoryReel } from './StoryReel';
import { FloatingActions } from './FloatingActions';
import { RefreshCw, Filter, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Drill {
  id: string;
  title: string;
  description: string;
  category: string;
  age_group: string;
  duration: string;
  difficulty: string;
}

const mockStories = [
  { id: '1', username: 'Coach_Mike', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150', hasNew: true },
  { id: '2', username: 'Sarah_VB', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150', hasNew: true },
  { id: '3', username: 'ProSetter', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150', hasNew: true },
  { id: '4', username: 'AceSpiker', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150', hasNew: false },
  { id: '5', username: 'BlockKing', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150', hasNew: false },
];

const drillImages = [
  'https://images.pexels.com/photos/6203631/pexels-photo-6203631.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/6203514/pexels-photo-6203514.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3601108/pexels-photo-3601108.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/6203634/pexels-photo-6203634.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/6203519/pexels-photo-6203519.jpeg?auto=compress&cs=tinysrgb&w=800',
];

const authorAvatars = [
  'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
];

const authorNames = ['Coach Mike', 'Sarah Williams', 'Pro Academy'];

export function MediaFeedPage() {
  const [activeTab, setActiveTab] = useState<FeedTab>('home');
  const [drills, setDrills] = useState<Drill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  useEffect(() => {
    fetchDrills();
  }, []);

  const fetchDrills = async () => {
    try {
      const { data, error } = await supabase
        .from('drills')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setDrills(data || []);
    } catch (error) {
      console.error('Error fetching drills:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDrills();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const filters = ['all', 'trending', 'following', 'new'];

  const renderHomeContent = () => (
    <>
      <StoryReel stories={mockStories} />

      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedFilter === filter
                  ? 'bg-accent-teal text-dark-bg'
                  : 'bg-dark-surface text-dark-text-secondary hover:bg-dark-surface-light'
              }`}
            >
              {filter === 'trending' && <TrendingUp className="w-4 h-4 inline mr-1.5" />}
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-4 pb-24">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-dark-surface rounded-2xl p-4 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-dark-surface-light" />
                  <div className="flex-1">
                    <div className="h-4 bg-dark-surface-light rounded w-24 mb-2" />
                    <div className="h-3 bg-dark-surface-light rounded w-16" />
                  </div>
                </div>
                <div className="aspect-video bg-dark-surface-light rounded-xl mb-4" />
                <div className="h-4 bg-dark-surface-light rounded w-3/4 mb-2" />
                <div className="h-3 bg-dark-surface-light rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          drills.map((drill, index) => (
            <MediaCard
              key={drill.id}
              id={drill.id}
              type="drill"
              title={drill.title}
              description={drill.description}
              mediaUrl={drillImages[index % drillImages.length]}
              thumbnailUrl={drillImages[index % drillImages.length]}
              author={{
                name: authorNames[index % authorNames.length],
                avatar: authorAvatars[index % authorAvatars.length],
                verified: index % 2 === 0,
              }}
              stats={{
                likes: Math.floor(Math.random() * 500) + 50,
                comments: Math.floor(Math.random() * 100) + 10,
                shares: Math.floor(Math.random() * 50) + 5,
              }}
              category={drill.category}
              duration={drill.duration || '15 min'}
            />
          ))
        )}
      </div>
    </>
  );

  const renderVideosContent = () => (
    <div className="px-4 pt-4 pb-24">
      <h2 className="text-xl font-bold text-dark-text mb-4">Video Drills</h2>
      <div className="grid grid-cols-2 gap-3">
        {drillImages.map((img, i) => (
          <div
            key={i}
            className="relative aspect-[9/16] rounded-xl overflow-hidden bg-dark-surface animate-fade-in"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-sm font-semibold text-white line-clamp-2">
                Training Session {i + 1}
              </p>
              <p className="text-xs text-white/70 mt-1">2.{i}K views</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLearnContent = () => (
    <div className="px-4 pt-4 pb-24">
      <h2 className="text-xl font-bold text-dark-text mb-4">Learn Volleyball</h2>
      <div className="space-y-3">
        {['Fundamentals', 'Serving', 'Setting', 'Hitting', 'Defense'].map((topic, i) => (
          <button
            key={topic}
            className="w-full p-4 bg-dark-surface rounded-xl flex items-center gap-4 hover:bg-dark-surface-light transition-colors animate-fade-in"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-teal to-accent-teal-light flex items-center justify-center">
              <span className="text-lg font-bold text-dark-bg">{i + 1}</span>
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-dark-text">{topic}</h3>
              <p className="text-sm text-dark-text-muted">{(i + 1) * 5} lessons</p>
            </div>
            <div className="w-16 h-1.5 bg-dark-bg-lighter rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-teal rounded-full"
                style={{ width: `${(i + 1) * 15}%` }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderDrillsContent = () => (
    <div className="px-4 pt-4 pb-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-dark-text">Drill Library</h2>
        <button className="p-2 rounded-xl bg-dark-surface hover:bg-dark-surface-light transition-colors">
          <Filter className="w-5 h-5 text-dark-text-secondary" />
        </button>
      </div>
      <div className="space-y-3">
        {drills.slice(0, 8).map((drill, i) => (
          <div
            key={drill.id}
            className="p-4 bg-dark-surface rounded-xl animate-fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={drillImages[i % drillImages.length]}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-dark-text line-clamp-1">{drill.title}</h3>
                <p className="text-sm text-dark-text-muted line-clamp-1 mt-0.5">
                  {drill.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-dark-bg-lighter rounded text-xs text-dark-text-secondary">
                    {drill.age_group}
                  </span>
                  <span className="px-2 py-0.5 bg-dark-bg-lighter rounded text-xs text-dark-text-secondary">
                    {drill.difficulty || 'Intermediate'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfileContent = () => (
    <div className="px-4 pt-4 pb-24">
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-dark-border mb-4">
          <img
            src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-xl font-bold text-dark-text">Coach Player</h2>
        <p className="text-dark-text-muted">@coachplayer</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Drills', value: '42' },
          { label: 'Followers', value: '1.2K' },
          { label: 'Following', value: '89' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-lg font-bold text-dark-text">{stat.value}</p>
            <p className="text-sm text-dark-text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <button className="w-full py-3 bg-accent-teal rounded-xl font-semibold text-dark-bg mb-6 active:scale-[0.98] transition-transform">
        Edit Profile
      </button>

      <div className="space-y-2">
        {['Saved Drills', 'My Progress', 'Settings', 'Help'].map((item) => (
          <button
            key={item}
            className="w-full p-4 bg-dark-surface rounded-xl text-left font-medium text-dark-text hover:bg-dark-surface-light transition-colors"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeContent();
      case 'videos':
        return renderVideosContent();
      case 'learn':
        return renderLearnContent();
      case 'drills':
        return renderDrillsContent();
      case 'profile':
        return renderProfileContent();
      default:
        return renderHomeContent();
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <FeedHeader />

      <main className="pt-14">
        {activeTab === 'home' && (
          <div className="flex items-center justify-center py-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 text-sm text-dark-text-muted hover:text-dark-text transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
            </button>
          </div>
        )}

        {renderContent()}
      </main>

      <FloatingActions />
      <FeedNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
