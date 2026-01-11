
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Home, Search, PlusSquare, Compass, Bell, User as UserIcon, 
  Settings, LogOut, MessageSquare, BookOpen, GraduationCap, X, 
  Sparkles, BrainCircuit, Mic, Camera, Check, AtSign, Send, Bot,
  Timer, Play, Pause, RotateCcw, Zap, Clock
} from 'lucide-react';
import { User, Post, StudyStat, FocusData, ChatMessage } from './types';
import Stories from './components/Stories';
import PostCard from './components/PostCard';
import Sidebar from './components/Sidebar';
import StudyStats from './components/StudyStats';
import ProfilePage from './components/ProfilePage';
import SettingsModal from './components/SettingsModal';
import { getSmartCaption, generateStudyTip, askStudyAssistant } from './services/geminiService';

const CURRENT_USER: User = {
  id: 'me',
  username: 'study_lover',
  fullName: 'Sarah Study',
  avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
  bio: 'Mastering Computer Science & Psychology. Sharing my journey through code and cognition! 📚✨',
  followersCount: 1240,
  followingCount: 382,
  postsCount: 12
};

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    user: { id: 'u1', username: 'math_wizard', fullName: 'Alex Chen', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', bio: 'Solving the world, one equation at a time.' },
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1350&q=80',
    caption: 'Just solved this complex calculus problem! The key was recognizing the pattern early. #math #calculus #studygram',
    likes: 1240,
    commentsCount: 24,
    timeAgo: '2h',
    subject: 'Mathematics',
    isLiked: false,
    isBookmarked: false
  },
  {
    id: '2',
    user: { id: 'u2', username: 'biology_nerd', fullName: 'Emma Wilson', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', bio: 'Cell biology is my life. 🧬' },
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1350&q=80',
    caption: 'My biology notes on cell division! Color coding really helps me remember the different phases. #biology #notes',
    likes: 850,
    commentsCount: 42,
    timeAgo: '5h',
    subject: 'Biology',
    isLiked: true,
    isBookmarked: false
  },
  {
    id: '3',
    user: { id: 'u3', username: 'coding_master', fullName: 'David Lee', avatar: 'https://randomuser.me/api/portraits/men/65.jpg', bio: 'React developer and lifelong learner.' },
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1350&q=80',
    caption: 'Building a new study planner! Can\'t wait to share the final version. #programming #react',
    likes: 2100,
    commentsCount: 56,
    timeAgo: '1d',
    subject: 'Programming',
    isLiked: false,
    isBookmarked: true
  }
];

const SUGGESTIONS: User[] = [
  { id: 's1', username: 'history_buff', fullName: 'Michael R.', avatar: 'https://randomuser.me/api/portraits/men/75.jpg', bio: 'Exploring the past to understand the future. 🏛️' },
  { id: 's2', username: 'chem_lab', fullName: 'Dr. Jane', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', bio: 'Chemical engineering and laboratory insights.' },
  { id: 's3', username: 'physics_geek', fullName: 'Leo T.', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', bio: 'Quantum physics simplifies everything. Or does it?' },
  { id: 's4', username: 'lit_explorer', fullName: 'Sophie M.', avatar: 'https://randomuser.me/api/portraits/women/11.jpg', bio: 'Lost in the pages of classic literature. 📖' },
];

const FOCUS_DATA: FocusData[] = [
  { day: 'Mon', score: 65 },
  { day: 'Tue', score: 82 },
  { day: 'Wed', score: 70 },
  { day: 'Thu', score: 95 },
  { day: 'Fri', score: 87 },
  { day: 'Sat', score: 45 },
  { day: 'Sun', score: 60 },
];

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [suggestions, setSuggestions] = useState<User[]>(SUGGESTIONS);
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [studyTip, setStudyTip] = useState<string | null>(null);
  
  // Turbo Timer & Goals State
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [completedMinutes, setCompletedMinutes] = useState(240); // 4 hours already done
  const dailyGoalMinutes = 360; // 6 hours goal
  const timerIntervalRef = useRef<number | null>(null);

  // AI Assistant State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [aiContext, setAiContext] = useState<string>('General Study Help');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Routing State
  const [currentView, setCurrentView] = useState<'feed' | 'profile'>('feed');
  const [profileUser, setProfileUser] = useState<User>(CURRENT_USER);

  // New Post Form State
  const [newPostCaption, setNewPostCaption] = useState('');
  const [newPostSubject, setNewPostSubject] = useState('');
  const [isEnhancingCaption, setIsEnhancingCaption] = useState(false);

  useEffect(() => {
    fetchNewTip();
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Timer Logic
  useEffect(() => {
    if (isTimerActive && timerSeconds > 0) {
      timerIntervalRef.current = window.setInterval(() => {
        setTimerSeconds(prev => {
          if (prev % 60 === 0 && prev !== 0) {
            setCompletedMinutes(c => c + 1);
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerActive(false);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerActive, timerSeconds]);

  const toggleTimer = () => setIsTimerActive(!isTimerActive);
  const resetTimer = (mins: number = 25) => {
    setIsTimerActive(false);
    setTimerSeconds(mins * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const STUDY_STATS = useMemo((): StudyStat[] => [
    { label: 'Study Time', value: `${Math.floor(completedMinutes / 60)}h ${completedMinutes % 60}m`, trend: 12 },
    { label: 'Goal Left', value: `${Math.max(0, dailyGoalMinutes - completedMinutes)}m`, trend: -5 },
    { label: 'Focus Score', value: '87%', trend: -2 },
  ], [completedMinutes]);

  const fetchNewTip = async () => {
    const tip = await generateStudyTip(newPostSubject || "General Learning");
    setStudyTip(tip);
  };

  const handleLike = useCallback((id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return { 
          ...p, 
          isLiked: !p.isLiked, 
          likes: p.isLiked ? p.likes - 1 : p.likes + 1 
        };
      }
      return p;
    }));
  }, []);

  const handleBookmark = useCallback((id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, isBookmarked: !p.isBookmarked } : p));
  }, []);

  const handleFollow = useCallback((id: string) => {
    setSuggestions(prev => prev.map(u => {
      if (u.id === id) {
        const newIsFollowing = !u.isFollowing;
        setCurrentUser(prevUser => ({
          ...prevUser,
          followingCount: newIsFollowing 
            ? (prevUser.followingCount || 0) + 1 
            : Math.max(0, (prevUser.followingCount || 0) - 1)
        }));
        return { ...u, isFollowing: newIsFollowing };
      }
      return u;
    }));
  }, []);

  const enhanceCaption = async () => {
    if (!newPostCaption) return;
    setIsEnhancingCaption(true);
    const enhanced = await getSmartCaption(newPostSubject, newPostCaption);
    setNewPostCaption(enhanced);
    setIsEnhancingCaption(false);
  };

  const handleCreatePost = () => {
    if (!newPostCaption) return;
    const newPost: Post = {
      id: Date.now().toString(),
      user: currentUser,
      imageUrl: `https://picsum.photos/seed/${Date.now()}/800/800`,
      caption: newPostCaption,
      likes: 0,
      commentsCount: 0,
      timeAgo: 'Just now',
      subject: newPostSubject || 'General',
      isLiked: false,
      isBookmarked: false
    };
    setPosts([newPost, ...posts]);
    setCurrentUser(prev => ({ ...prev, postsCount: (prev.postsCount || 0) + 1 }));
    setShowCreateModal(false);
    setNewPostCaption('');
    setNewPostSubject('');
  };

  const handleUpdateProfile = (updatedData: { fullName: string; username: string; bio: string }) => {
    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);
    if (profileUser.id === currentUser.id) setProfileUser(updatedUser);
    setShowSettingsModal(false);
  };

  const navigateToProfile = useCallback((user: User) => {
    setProfileUser(user);
    setCurrentView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateToFeed = useCallback(() => {
    setCurrentView('feed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAskAI = (post: Post) => {
    setAiContext(`Subject: ${post.subject}. Post Content: ${post.caption}. Author: ${post.user.username}`);
    setChatMessages([
      { 
        id: 'init', 
        role: 'assistant', 
        content: `Hi! I'm ready to help you with ${post.user.username}'s post about ${post.subject}. What would you like to know?` 
      }
    ]);
    setShowAIAssistant(true);
  };

  const sendMessageToAI = async () => {
    if (!aiInput.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: aiInput };
    setChatMessages(prev => [...prev, userMsg]);
    setAiInput('');
    setIsAiTyping(true);
    const history = chatMessages.map(m => ({ role: m.role, content: m.content }));
    const aiResponse = await askStudyAssistant(aiContext, aiInput, history);
    const assistantMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: aiResponse };
    setChatMessages(prev => [...prev, assistantMsg]);
    setIsAiTyping(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-150">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 h-16 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
          <button onClick={navigateToFeed} className="flex items-center space-x-2 text-blue-600 outline-none transition-transform active:scale-95">
            <GraduationCap size={32} strokeWidth={2.5} />
            <span className="text-2xl font-black tracking-tight hidden sm:inline">StudyGram</span>
          </button>

          <div className="hidden md:flex flex-1 max-w-sm mx-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Quick search..." 
              className="w-full bg-slate-100/50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          <nav className="flex items-center space-x-1 md:space-x-4">
            <button onClick={navigateToFeed} className={`p-2 rounded-xl transition-all active:scale-90 ${currentView === 'feed' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'}`}>
              <Home size={22} strokeWidth={2.2} />
            </button>
            <button className="p-2 hover:bg-slate-50 rounded-xl transition-all active:scale-90 text-slate-700">
              <MessageSquare size={22} strokeWidth={2.2} />
            </button>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="p-2 hover:bg-slate-50 rounded-xl transition-all active:scale-90 text-slate-700"
            >
              <PlusSquare size={22} strokeWidth={2.2} />
            </button>
            <button className="p-2 hover:bg-slate-50 rounded-xl transition-all active:scale-90 text-slate-700">
              <Bell size={22} strokeWidth={2.2} />
            </button>
            <div 
              onClick={() => navigateToProfile(currentUser)}
              className={`w-9 h-9 ml-2 rounded-full overflow-hidden border cursor-pointer hover:scale-105 active:scale-95 transition-all ${currentView === 'profile' && profileUser.id === currentUser.id ? 'ring-2 ring-blue-600 ring-offset-2' : 'border-slate-200'}`}
            >
              <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 max-w-6xl mx-auto px-4">
        {currentView === 'feed' ? (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 max-w-2xl mx-auto lg:mx-0">
              <Stories users={INITIAL_POSTS.map(p => p.user)} currentUser={currentUser} />
              <StudyStats stats={STUDY_STATS} focusData={FOCUS_DATA} />
              <div className="space-y-6">
                {posts.map(post => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    onLike={handleLike} 
                    onBookmark={handleBookmark} 
                    onUserClick={navigateToProfile}
                    onAskAI={handleAskAI}
                  />
                ))}
              </div>
            </div>
            <Sidebar 
              currentUser={currentUser} 
              suggestions={suggestions} 
              onFollow={handleFollow}
              onUpgrade={() => setShowAIAssistant(true)}
              onUserClick={navigateToProfile}
              completedMinutes={completedMinutes}
              dailyGoalMinutes={dailyGoalMinutes}
            />
          </div>
        ) : (
          <ProfilePage 
            user={profileUser}
            isOwnProfile={profileUser.id === currentUser.id}
            posts={posts.filter(p => p.user.id === profileUser.id)}
            studyStats={STUDY_STATS}
            focusData={FOCUS_DATA}
            onEditProfile={() => setShowSettingsModal(true)}
            onPostClick={(post) => console.log('Post details:', post)}
          />
        )}
      </main>

      {/* Turbo Focus Timer Widget */}
      <div className={`fixed bottom-8 left-8 z-[60] transition-all duration-300 transform ${isTimerOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-2xl p-6 flex flex-col items-center w-64 animate-in zoom-in duration-200">
          <div className="flex items-center justify-between w-full mb-4">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-amber-500 fill-amber-500" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">Turbo Focus</span>
            </div>
            <button onClick={() => setIsTimerOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
          </div>
          
          <div className={`text-5xl font-black tracking-tighter mb-4 tabular-nums ${isTimerActive ? 'text-blue-600 animate-pulse' : 'text-slate-800'}`}>
            {formatTime(timerSeconds)}
          </div>
          
          <div className="flex gap-2 w-full mb-6">
            <button onClick={() => resetTimer(25)} className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-bold text-slate-600 transition-all">STUDY</button>
            <button onClick={() => resetTimer(5)} className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-bold text-slate-600 transition-all">BREAK</button>
          </div>

          <div className="flex items-center gap-3 w-full">
            <button 
              onClick={toggleTimer}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-white font-bold transition-all active:scale-95 ${isTimerActive ? 'bg-slate-800 hover:bg-slate-900' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100'}`}
            >
              {isTimerActive ? <><Pause size={20} /> Pause</> : <><Play size={20} /> Start Sprint</>}
            </button>
            <button onClick={() => resetTimer()} className="p-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all">
              <RotateCcw size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Timer FAB */}
      {!isTimerOpen && (
        <button 
          onClick={() => setIsTimerOpen(true)}
          className={`fixed bottom-8 left-8 w-14 h-14 bg-white border border-slate-200 rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group ${isTimerActive ? 'ring-2 ring-blue-500 ring-offset-4' : ''}`}
        >
          <Timer size={24} className={isTimerActive ? 'text-blue-600 animate-spin-slow' : 'text-slate-700'} />
          {isTimerActive && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full border-2 border-white animate-ping"></span>
          )}
        </button>
      )}

      {/* AI FAB */}
      {!showAIAssistant && (
        <button 
          onClick={() => setShowAIAssistant(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50"
        >
          <BrainCircuit size={24} />
        </button>
      )}

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-150">
            <div className="border-b border-slate-100 p-5 flex items-center justify-between">
              <h2 className="font-bold text-xl text-slate-800">New Publication</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 p-1 transition-all"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-6">
              <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-100 text-sm font-medium" value={newPostSubject} onChange={(e) => setNewPostSubject(e.target.value)}>
                <option value="">Select category...</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Biology">Biology</option>
                <option value="Literature">Literature</option>
                <option value="Programming">Programming</option>
              </select>
              <div className="relative">
                <textarea rows={4} placeholder="Describe your study session..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-100 resize-none pr-12 text-sm" value={newPostCaption} onChange={(e) => setNewPostCaption(e.target.value)} />
                <button onClick={enhanceCaption} disabled={isEnhancingCaption || !newPostCaption} className="absolute bottom-4 right-4 bg-white border border-slate-200 p-2.5 rounded-xl text-blue-600 hover:bg-blue-50 transition-all shadow-sm">
                  <BrainCircuit size={20} className={isEnhancingCaption ? 'animate-spin' : ''} />
                </button>
              </div>
              <button onClick={handleCreatePost} disabled={!newPostCaption || !newPostSubject} className="w-full bg-blue-600 text-white font-black text-sm uppercase tracking-widest py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-[0.98]">Publish Now</button>
            </div>
          </div>
        </div>
      )}

      {/* Assistant Modal */}
      {showAIAssistant && (
        <div className="fixed bottom-8 right-8 w-80 sm:w-96 h-[500px] bg-white border border-slate-200 rounded-3xl shadow-2xl z-[70] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-200">
          <div className="bg-blue-600 p-4 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center space-x-3">
              <BrainCircuit size={20} />
              <h4 className="font-bold text-sm">AI Assistant</h4>
            </div>
            <button onClick={() => setShowAIAssistant(false)} className="hover:bg-white/10 p-1 rounded-lg"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scrollbar-hide">
            {chatMessages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-100 text-slate-700 shadow-sm'}`}>{msg.content}</div>
              </div>
            ))}
            {isAiTyping && <div className="flex justify-start"><div className="bg-white border border-slate-100 p-3 rounded-2xl shadow-sm flex space-x-1"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span><span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-75"></span><span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-150"></span></div></div>}
            <div ref={chatEndRef} />
          </div>
          <div className="p-4 bg-white border-t border-slate-100 flex items-center space-x-2">
            <input type="text" placeholder="Ask anything..." className="flex-1 bg-slate-100 border-none rounded-xl py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100" value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessageToAI()} />
            <button onClick={sendMessageToAI} disabled={!aiInput.trim() || isAiTyping} className="p-2 bg-blue-600 text-white rounded-xl active:scale-90 transition-all"><Send size={18} /></button>
          </div>
        </div>
      )}

      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} currentUser={currentUser} onUpdateProfile={handleUpdateProfile} />
    </div>
  );
};

export default App;
