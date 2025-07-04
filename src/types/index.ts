export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  remote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  description: string;
  requirements: string[];
  benefits: string[];
  tags: string[];
  postedBy: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  };
  postedAt: string;
  applicationUrl?: string;
  applicationCount: number;
  featured: boolean;
  paymentTxHash?: string; // For tracking job posting payments
  expires?: string;
}

export interface JobPostForm {
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  remote: boolean;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
  description: string;
  requirements: string;
  benefits: string;
  tags: string;
  applicationUrl: string;
  featured: boolean;
}

export interface User {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  bio?: string;
  location?: {
    placeId: string;
    description: string;
  };
}

export interface MiniAppContext {
  user: User;
  location?: {
    type: 'cast_embed' | 'cast_share' | 'notification' | 'launcher' | 'channel';
    [key: string]: any;
  };
  client: {
    clientFid: number;
    added: boolean;
    safeAreaInsets?: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
    notificationDetails?: {
      url: string;
      token: string;
    };
  };
}

export interface PaymentConfig {
  jobPostingFee: string; // in ETH or token amount
  featuredJobFee: string; // additional fee for featured listings
  contractAddress: string; // smart contract for payments
  chainId: number; // Base mainnet
}
