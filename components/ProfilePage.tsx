
import React, { useState, useEffect } from 'react';
import { Grid, Bookmark, Tag, Settings, Edit3, MapPin, Link as LinkIcon, Calendar, UserPlus, UserMinus, Quote } from 'lucide-react';
import { User, Post, StudyStat, FocusData } from '../types';
import StudyStats from './StudyStats';

interface ProfilePageProps {
  user: User;
  isOwnProfile: boolean;
  posts: Post[];
  studyStats: StudyStat[];
  focusData: FocusData[];
  onEditProfile: () => void;
  onPostClick: (post: Post) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ 
  user, 
  isOwnProfile, 
  posts, 
  studyStats, 
  focusData, 
  onEditProfile,
  onPostClick
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'tagged'>('posts');
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const [followersCount, setFollowersCount] = useState(user.followersCount || 0);

  // Sync state if the user object changes (e.g., navigating between profiles)
  useEffect(() => {
    setIsFollowing(user.isFollowing || false);
    setFollowersCount(user.followersCount || 0);
  }, [user.id, user.isFollowing, user.followersCount]);

  const handleToggleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowersCount(prev => Math.max(0, prev - 1));
    } else {
      setIsFollowing(true);
      setFollowersCount(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-4 pb-12 px-4 md:px-0">
      {/* Profile Header */}
      <header className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16 mb-12">
        <div className="relative group shrink-0">
          <div className="w-28 h-28 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-blue-600 to-sky-400 shadow-xl shadow-blue-100">
            <div className="w-full h-full rounded-full p-1 bg-white">
              <img 
                src={user.avatar} 
                alt={user.username} 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          {isOwnProfile && (
            <button 
              onClick={onEditProfile}
              className="absolute bottom-2 right-2 bg-white border border-slate-200 p-2 md:p-2.5 rounded-full shadow-lg text-blue-600 hover:scale-110 active:scale-95 transition-all z-10"
              title="Edit Profile Picture"
            >
              <Edit3 size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
          )}
        </div>

        <div className="flex-1 space-y-6 text-center md:text-left pt-2">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">@{user.username}</h1>
            <div className="flex gap-2">
              {isOwnProfile ? (
                <>
                  <button 
                    onClick={onEditProfile}
                    className="flex items-center gap-2 px-6 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-bold text-slate-700 transition-all active:scale-95"
                  >
                    <Edit3 size={14} />
                    Edit Profile
                  </button>
                  <button className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors active:scale-95">
                    <Settings size={20} className="text-slate-600" />
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleToggleFollow}
                    className={`flex items-center gap-2 px-8 py-1.5 rounded-lg text-sm font-bold transition-all active:scale-95 shadow-md ${isFollowing ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-none' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'}`}
                  >
                    {isFollowing ? (
                      <><UserMinus size={16} /> Unfollow</>
                    ) : (
                      <><UserPlus size={16} /> Follow</>
                    )}
                  </button>
                  <button className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-bold text-slate-700 transition-all active:scale-95">
                    Message
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-8 md:gap-10">
            <div className="text-slate-600">
              <span className="font-bold text-slate-900 text-lg">{user.postsCount || 0}</span> <span className="text-sm">posts</span>
            </div>
            <div className="text-slate-600 cursor-pointer hover:opacity-70 transition-opacity">
              <span className="font-bold text-slate-900 text-lg">{followersCount.toLocaleString()}</span> <span className="text-sm">followers</span>
            </div>
            <div className="text-slate-600 cursor-pointer hover:opacity-70 transition-opacity">
              <span className="font-bold text-slate-900 text-lg">{user.followingCount || 0}</span> <span className="text-sm">following</span>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="font-bold text-slate-800 text-lg">{user.fullName}</h2>
            <div className="max-w-md mx-auto md:mx-0">
              {user.bio ? (
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap italic bg-slate-50 border-l-2 border-blue-200 pl-3 py-1">
                  {user.bio}
                </p>
              ) : isOwnProfile ? (
                <button 
                  onClick={onEditProfile}
                  className="text-sm text-slate-400 font-light italic hover:text-blue-500 transition-colors"
                >
                  Click here to add a bio and tell others about your study journey...
                </button>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-3 text-[11px] text-slate-400 font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><MapPin size={12} className="text-blue-500" /> Education Hub</span>
              <span className="flex items-center gap-1.5"><LinkIcon size={12} className="text-blue-500" /> <a href="#" className="text-blue-600 hover:underline">studygram.ai</a></span>
              <span className="flex items-center gap-1.5"><Calendar size={12} className="text-blue-500" /> Member since 2024</span>
            </div>
          </div>
        </div>
      </header>

      {/* Study Stats Section */}
      <div className="mb-12">
        <StudyStats stats={studyStats} focusData={focusData} />
      </div>

      {/* Tabs */}
      <div className="border-t border-slate-200">
        <div className="flex justify-center gap-8 md:gap-12 -mt-px">
          <button 
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all border-t-2 ${activeTab === 'posts' ? 'border-slate-800 text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <Grid size={16} strokeWidth={activeTab === 'posts' ? 2.5 : 2} /> Posts
          </button>
          <button 
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all border-t-2 ${activeTab === 'saved' ? 'border-slate-800 text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <Bookmark size={16} strokeWidth={activeTab === 'saved' ? 2.5 : 2} /> Saved
          </button>
          <button 
            onClick={() => setActiveTab('tagged')}
            className={`flex items-center gap-2 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all border-t-2 ${activeTab === 'tagged' ? 'border-slate-800 text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <Tag size={16} strokeWidth={activeTab === 'tagged' ? 2.5 : 2} /> Tagged
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-6 py-8">
        {posts.length > 0 ? (
          posts.map(post => (
            <div 
              key={post.id} 
              onClick={() => onPostClick(post)}
              className="relative aspect-square bg-slate-100 cursor-pointer overflow-hidden group rounded-sm md:rounded-lg shadow-sm"
            >
              <img 
                src={post.imageUrl} 
                alt="Post content" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-4 md:gap-8 font-bold text-sm md:text-lg">
                <span className="flex items-center gap-1.5 md:gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <Bookmark size={20} className="md:w-6 md:h-6" fill="white" /> {post.likes}
                </span>
                <span className="flex items-center gap-1.5 md:gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                  <Tag size={20} className="md:w-6 md:h-6" fill="white" /> {post.commentsCount}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 py-32 text-center text-slate-400 flex flex-col items-center justify-center bg-white rounded-xl border border-dashed border-slate-200">
            <Grid size={48} strokeWidth={1} className="mb-4 opacity-20" />
            <p className="text-xl font-light">No posts shared yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
