
import React from 'react';
import { User } from '../types';
import { CheckCircle, Sparkles, Clock, Target } from 'lucide-react';

interface SidebarProps {
  currentUser: User;
  suggestions: User[];
  onFollow: (id: string) => void;
  onUpgrade: () => void;
  onUserClick?: (user: User) => void;
  completedMinutes?: number;
  dailyGoalMinutes?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentUser, 
  suggestions, 
  onFollow, 
  onUpgrade, 
  onUserClick,
  completedMinutes = 0,
  dailyGoalMinutes = 360
}) => {
  const progressPercent = Math.min(100, (completedMinutes / dailyGoalMinutes) * 100);
  const remainingMins = Math.max(0, dailyGoalMinutes - completedMinutes);
  const remainingHours = Math.floor(remainingMins / 60);
  const remainingMinsPart = remainingMins % 60;

  return (
    <div className="hidden lg:block sticky top-24 w-80 space-y-6">
      {/* Profile Card */}
      <div className="flex items-center space-x-4 p-2">
        <img 
          src={currentUser.avatar} 
          alt={currentUser.username} 
          className="w-14 h-14 rounded-full object-cover border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity" 
          onClick={() => onUserClick?.(currentUser)}
        />
        <div className="flex-1">
          <h2 
            className="font-bold text-slate-800 leading-none cursor-pointer hover:text-blue-600"
            onClick={() => onUserClick?.(currentUser)}
          >
            {currentUser.username}
          </h2>
          <p className="text-sm text-slate-500 mt-1">{currentUser.fullName}</p>
        </div>
        <button 
          onClick={() => onUserClick?.(currentUser)}
          className="text-xs font-bold text-blue-600 hover:text-blue-800"
        >
          View Profile
        </button>
      </div>

      {/* Daily Goal Tracker */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-rose-500" />
            <h3 className="font-bold text-slate-800 text-sm">Daily Goal</h3>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{Math.round(progressPercent)}%</span>
        </div>
        
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-50">
          <Clock size={20} className="text-blue-600" />
          <div>
            <p className="text-[10px] font-black text-blue-600/60 uppercase tracking-widest leading-none mb-1">Time Remaining</p>
            <p className="text-sm font-bold text-slate-800">
              {remainingHours > 0 ? `${remainingHours}h ` : ''}{remainingMinsPart}m to go
            </p>
          </div>
        </div>
      </div>

      {/* Upgrade Banner */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-400 rounded-2xl p-6 text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-3 opacity-20 transform group-hover:scale-125 transition-transform">
          <Sparkles size={64} />
        </div>
        <h3 className="font-bold text-xl mb-4 relative z-10">StudyGram Pro</h3>
        <ul className="space-y-2 mb-6 text-sm relative z-10">
          <li className="flex items-center"><CheckCircle size={14} className="mr-2 opacity-80" /> AI Study Assistant</li>
          <li className="flex items-center"><CheckCircle size={14} className="mr-2 opacity-80" /> Smart Analytics</li>
          <li className="flex items-center"><CheckCircle size={14} className="mr-2 opacity-80" /> Ad-free experience</li>
        </ul>
        <button 
          onClick={onUpgrade}
          className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors shadow-lg active:scale-95"
        >
          Upgrade Now
        </button>
      </div>

      {/* Suggestions */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-500 text-sm uppercase tracking-wider">Suggestions for you</h3>
          <button className="text-xs font-bold text-slate-800 hover:underline">See All</button>
        </div>
        <div className="space-y-4">
          {suggestions.map((user) => (
            <div key={user.id} className="flex items-center justify-between group">
              <div className="flex items-center space-x-3">
                <img 
                  src={user.avatar} 
                  alt={user.username} 
                  className="w-9 h-9 rounded-full object-cover border border-slate-100 cursor-pointer hover:opacity-80 transition-opacity" 
                  onClick={() => onUserClick?.(user)}
                />
                <div className="max-w-[120px]">
                  <h4 
                    className="font-semibold text-sm text-slate-800 truncate cursor-pointer hover:text-blue-600"
                    onClick={() => onUserClick?.(user)}
                  >
                    {user.username}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">Popular in {['Math', 'Physics', 'History'][Math.floor(Math.random()*3)]}</p>
                </div>
              </div>
              <button 
                onClick={() => onFollow(user.id)}
                className={`text-xs font-bold ${user.isFollowing ? 'text-slate-400' : 'text-blue-500 hover:text-blue-700'}`}
              >
                {user.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="px-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Help</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Locations</a>
          <a href="#" className="hover:underline">Language</a>
        </div>
        <p>© 2024 STUDYGRAM FROM STUDYCOMMUNITY</p>
      </div>
    </div>
  );
};

export default Sidebar;
