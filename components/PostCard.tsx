
import React, { useState, memo } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Sparkles, Share2 } from 'lucide-react';
import { Post, User } from '../types';

interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  onUserClick?: (user: User) => void;
  onAskAI?: (post: Post) => void;
}

const PostCard: React.FC<PostCardProps> = memo(({ post, onLike, onBookmark, onUserClick, onAskAI }) => {
  const [comment, setComment] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = () => {
    setIsSharing(true);
    if (navigator.share) {
      navigator.share({
        title: `Study notes from ${post.user.username}`,
        text: post.caption,
        url: window.location.href,
      }).catch(() => {});
    }
    setTimeout(() => setIsSharing(false), 2000);
  };

  return (
    <article className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-6 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <img 
            src={post.user.avatar} 
            alt={post.user.username} 
            className="w-10 h-10 rounded-full object-cover border border-slate-100 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => onUserClick?.(post.user)}
          />
          <div>
            <h3 
              className="font-semibold text-sm hover:text-blue-600 cursor-pointer transition-colors"
              onClick={() => onUserClick?.(post.user)}
            >
              {post.user.username}
            </h3>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{post.subject} • {post.timeAgo}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onAskAI?.(post)}
            className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center space-x-1"
            title="Ask AI about this"
          >
            <Sparkles size={16} />
            <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Ask AI</span>
          </button>
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img 
          src={post.imageUrl} 
          alt="Post content" 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {isSharing && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl px-6 py-3 shadow-xl transform animate-in zoom-in slide-in-from-bottom-2 duration-200">
              <p className="text-blue-600 font-bold text-sm">Link Shared!</p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1.5">
              <button 
                onClick={() => onLike(post.id)}
                className={`transition-transform active:scale-125 ${post.isLiked ? 'text-rose-500' : 'text-slate-700 hover:text-rose-500'}`}
              >
                <Heart size={24} fill={post.isLiked ? 'currentColor' : 'none'} />
              </button>
              <span className="text-xs font-bold text-slate-600">{post.likes.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center space-x-1.5">
              <button className="text-slate-700 hover:text-blue-500 transition-colors">
                <MessageCircle size={24} />
              </button>
              <span className="text-xs font-bold text-slate-600">{post.commentsCount.toLocaleString()}</span>
            </div>

            <button 
              onClick={handleShare}
              className="text-slate-700 hover:text-blue-500 transition-colors flex items-center space-x-1.5 group"
            >
              <Share2 size={24} className="group-active:scale-110 transition-transform" />
            </button>
            
            <button className="text-slate-700 hover:text-blue-500 transition-colors">
              <Send size={24} />
            </button>
          </div>
          <button 
            onClick={() => onBookmark(post.id)}
            className={`transition-colors ${post.isBookmarked ? 'text-amber-500' : 'text-slate-700 hover:text-amber-500'}`}
          >
            <Bookmark size={24} fill={post.isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="text-sm leading-relaxed">
          <span 
            className="font-bold mr-2 cursor-pointer hover:text-blue-600"
            onClick={() => onUserClick?.(post.user)}
          >
            {post.user.username}
          </span>
          {post.caption}
        </div>

        <button className="text-slate-400 text-sm mt-2 hover:underline">
          View all {post.commentsCount} comments
        </button>

        {/* Add Comment */}
        <div className="mt-4 flex items-center border-t border-slate-100 pt-3">
          <input 
            type="text" 
            placeholder="Add a comment..." 
            className="flex-1 text-sm outline-none bg-transparent"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button 
            disabled={!comment.trim()}
            className="text-blue-500 font-semibold text-sm disabled:opacity-50 transition-all ml-2"
          >
            Post
          </button>
        </div>
      </div>
    </article>
  );
});

export default PostCard;
