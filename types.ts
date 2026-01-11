
export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  bio?: string;
  isFollowing?: boolean;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
}

export interface Post {
  id: string;
  user: User;
  imageUrl: string;
  caption: string;
  likes: number;
  commentsCount: number;
  timeAgo: string;
  subject: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export interface StudyStat {
  label: string;
  value: string;
  trend?: number;
}

export interface FocusData {
  day: string;
  score: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}
