
import React, { useState } from 'react';
import { X, User, Bell, Shield, Check, Smartphone, Mail, AtSign, Camera, Info } from 'lucide-react';
import { User as UserType } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserType;
  onUpdateProfile: (updatedData: { fullName: string; username: string; bio: string }) => void;
}

const BIO_MAX_LENGTH = 160;

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentUser, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy'>('profile');
  
  // Profile state
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio || '');

  // Notification state
  const [notifications, setNotifications] = useState({
    push: { likes: true, comments: true, followers: true },
    email: { likes: false, comments: true, followers: false }
  });

  if (!isOpen) return null;

  const handleSaveProfile = () => {
    onUpdateProfile({ fullName, username, bio });
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/\s/g, '_');
    const sanitizedValue = value.replace(/[^a-z0-9_]/g, '');
    setUsername(sanitizedValue);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= BIO_MAX_LENGTH) {
      setBio(value);
    }
  };

  const toggleNotification = (type: 'push' | 'email', key: 'likes' | 'comments' | 'followers') => {
    setNotifications(prev => ({
      ...prev,
      [type]: { ...prev[type], [key]: !prev[type][key] }
    }));
  };

  const Toggle = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
    <button 
      onClick={onClick}
      className={`w-12 h-6 rounded-full transition-colors relative ${active ? 'bg-blue-600' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${active ? 'translate-x-7' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl h-[600px] flex overflow-hidden shadow-2xl animate-in zoom-in duration-200">
        {/* Sidebar */}
        <div className="w-48 bg-slate-50 border-r border-slate-100 p-6 flex flex-col">
          <h2 className="font-black text-slate-800 text-lg mb-8 tracking-tight">Settings</h2>
          <nav className="space-y-1 flex-1">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
            >
              <User size={18} />
              <span>Profile</span>
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'notifications' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
            >
              <Bell size={18} />
              <span>Notifications</span>
            </button>
            <button 
              onClick={() => setActiveTab('privacy')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'privacy' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
            >
              <Shield size={18} />
              <span>Privacy</span>
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="p-4 flex justify-end">
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-10 pb-10 scrollbar-hide">
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="flex flex-col items-center space-y-4 py-2">
                  <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-blue-600 to-sky-400 shadow-lg">
                      <img src={currentUser.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover border-4 border-white" />
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                      <Camera size={24} />
                    </div>
                  </div>
                  <button className="text-[11px] font-black text-blue-600 hover:underline uppercase tracking-widest">Update Photo</button>
                </div>

                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Username Handle</label>
                    <div className="relative">
                      <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-11 outline-none focus:ring-2 focus:ring-blue-100 transition-all font-bold text-sm text-slate-800"
                        placeholder="username"
                      />
                    </div>
                    <div className="flex items-start space-x-1.5 px-1 pt-1 opacity-60">
                      <Info size={10} className="mt-0.5 shrink-0" />
                      <p className="text-[9px] font-medium leading-tight">Only alphanumeric characters and underscores allowed.</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Display Name</label>
                    <input 
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-sm text-slate-800"
                      placeholder="Your Full Name"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bio</label>
                      <span className={`text-[9px] font-bold ${bio.length >= BIO_MAX_LENGTH ? 'text-rose-500' : 'text-slate-400'}`}>
                        {bio.length} / {BIO_MAX_LENGTH}
                      </span>
                    </div>
                    <textarea 
                      rows={3}
                      value={bio}
                      onChange={handleBioChange}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-100 resize-none font-medium text-sm text-slate-700"
                      placeholder="Tell your study buddies about your goals..."
                    />
                  </div>
                </div>

                <button 
                  onClick={handleSaveProfile}
                  className="w-full bg-blue-600 text-white font-bold text-sm py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Save Profile Changes
                </button>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-10">
                <section className="space-y-6">
                  <div className="flex items-center space-x-2 text-slate-800">
                    <Smartphone size={20} className="text-blue-600" />
                    <h3 className="font-bold">Push Notifications</h3>
                  </div>
                  <div className="space-y-4 bg-slate-50 rounded-3xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-700">Likes</p>
                        <p className="text-xs text-slate-500">When someone likes your study notes</p>
                      </div>
                      <Toggle active={notifications.push.likes} onClick={() => toggleNotification('push', 'likes')} />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div>
                        <p className="text-sm font-bold text-slate-700">Comments</p>
                        <p className="text-xs text-slate-500">When someone comments on your posts</p>
                      </div>
                      <Toggle active={notifications.push.comments} onClick={() => toggleNotification('push', 'comments')} />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div>
                        <p className="text-sm font-bold text-slate-700">New Followers</p>
                        <p className="text-xs text-slate-500">When someone starts following you</p>
                      </div>
                      <Toggle active={notifications.push.followers} onClick={() => toggleNotification('push', 'followers')} />
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center space-x-2 text-slate-800">
                    <Mail size={20} className="text-blue-600" />
                    <h3 className="font-bold">Email Notifications</h3>
                  </div>
                  <div className="space-y-4 bg-slate-50 rounded-3xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-700">Activity Digests</p>
                        <p className="text-xs text-slate-500">Weekly summaries of your study activity</p>
                      </div>
                      <Toggle active={notifications.email.likes} onClick={() => toggleNotification('email', 'likes')} />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div>
                        <p className="text-sm font-bold text-slate-700">Product Updates</p>
                        <p className="text-xs text-slate-500">Stay in the loop with new features</p>
                      </div>
                      <Toggle active={notifications.email.comments} onClick={() => toggleNotification('email', 'comments')} />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-20">
                <div className="bg-slate-50 p-6 rounded-full text-slate-300">
                  <Shield size={48} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Privacy Settings</h3>
                  <p className="text-sm text-slate-500 max-w-[240px] mt-1">Privacy features are currently being enhanced. Check back soon!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
