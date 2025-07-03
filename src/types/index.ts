export interface User {
  fid: number;
  username: string;
  displayName: string;
  pfp: {
    url: string;
  };
  profile: {
    bio: {
      text: string;
    };
  };
  followerCount: number;
  followingCount: number;
  verifications: string[];
  activeStatus: string;
}

export interface Cast {
  hash: string;
  parentHash?: string;
  parentUrl?: string;
  threadHash: string;
  author: User;
  text: string;
  timestamp: string;
  embeds: Array<{
    url?: string;
    cast?: Cast;
    metadata?: {
      contentType?: string;
      title?: string;
      description?: string;
      image?: {
        url: string;
      };
    };
  }>;
  frames: Array<{
    version: string;
    title: string;
    image: string;
    buttons: Array<{
      title: string;
      action_type: string;
      target?: string;
    }>;
    postUrl: string;
    framesUrl: string;
  }>;
  reactions: {
    likes: Array<{
      fid: number;
      fname: string;
    }>;
    recasts: Array<{
      fid: number;
      fname: string;
    }>;
    likesCount: number;
    recastsCount: number;
  };
  replies: {
    count: number;
  };
  channel?: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
  };
  mentioned_profiles: User[];
  viewerContext?: {
    liked: boolean;
    recasted: boolean;
    following: boolean;
  };
}

export interface JobPost {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  remote: boolean;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  benefits: string[];
  tags: string[];
  postedBy: User;
  postedAt: string;
  applicationUrl?: string;
  castHash?: string;
  applications: number;
  featured: boolean;
}

export interface AuthContext {
  user: User | null;
  signerUuid: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (signerUuid: string) => Promise<void>;
  logout: () => void;
}

export interface FeedFilters {
  feedType?: 'following' | 'filter' | 'global_trending';
  filterType?: 'fids' | 'parent_url' | 'channel_id' | 'embed_url';
  parentUrl?: string;
  channelId?: string;
  authorFids?: number[];
  limit?: number;
  cursor?: string;
}

export interface ApiResponse<T> {
  result: T;
  next?: {
    cursor?: string;
  };
}

export interface NeynarConfig {
  apiKey: string;
  clientId: string;
  baseUrl?: string;
}
