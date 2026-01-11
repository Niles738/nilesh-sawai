
import React from 'react';
import { Plus } from 'lucide-react';
import { User } from '../types';

interface StoriesProps {
  users: User[];
  currentUser: User;
}

const Stories: React.FC<StoriesProps> = ({ users, currentUser }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm overflow-x-auto flex items-center space-x-6 scrollbar-hide">
      {/* Current User Story */}
      <div className="flex flex-col items-center space-y-1 min-w-[70px] cursor-pointer group">
        <div className="relative">
          <div className="w-16 h-16 rounded-full p-[2px] border-2 border-slate-200">
            <img src={currentUser.avatar} alt="Your story" className="w-full h-full rounded-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all" />
          </div>
          <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 border-2 border-white text-white">
            <Plus size={12} strokeWidth={3} />
          </div>
        </div>
        <span className="text-xs text-slate-600 font-medium truncate max-w-[64px]">Your Story</span>
      </div>

      {/* Others */}
      {users.map((user) => (
        <div key={user.id} className="flex flex-col items-center space-y-1 min-w-[70px] cursor-pointer">
          <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-blue-600 via-sky-400 to-indigo-600">
            <div className="w-full h-full rounded-full p-[2px] bg-white">
              <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
            </div>
          </div>
          <span className="text-xs text-slate-600 font-medium truncate max-w-[64px]">{user.username}</span>
        </div>
      ))}
    </div>
  );
};

export default Stories;
