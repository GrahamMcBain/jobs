import { Job } from '@/types';
import { db } from './db';

// Fallback demo data for when database is not available
const demoJobs: Job[] = [
  {
    id: 'job_demo_1',
    title: 'Senior Frontend Developer',
    company: 'Farcaster Protocol',
    location: 'San Francisco, CA',
    type: 'full-time',
    remote: true,
    salaryMin: 150000,
    salaryMax: 200000,
    salaryCurrency: 'USD',
    description: 'Build the future of decentralized social media with React and TypeScript. Work on cutting-edge protocols and help shape the next generation of social networks.',
    requirements: [
      '5+ years of React experience',
      'TypeScript proficiency',
      'Web3/blockchain knowledge',
      'Experience with modern frontend tooling',
      'Understanding of decentralized protocols'
    ],
    benefits: [
      'Competitive equity package',
      'Health, dental, vision insurance',
      'Remote-first culture',
      'Conference and learning budget',
      'Top-tier equipment'
    ],
    tags: ['React', 'TypeScript', 'Web3', 'Farcaster', 'Frontend'],
    postedBy: {
      fid: 3621,
      username: 'farcaster',
      displayName: 'Farcaster',
      pfpUrl: 'https://i.imgur.com/farcaster.jpg'
    },
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    applicationUrl: 'https://jobs.farcaster.xyz/apply/frontend',
    applicationCount: 12,
    featured: true,
    paymentTxHash: '0x1234567890abcdef',
  },
  {
    id: 'job_demo_2',
    title: 'Smart Contract Engineer',
    company: 'Base Protocol',
    location: 'New York, NY',
    type: 'full-time',
    remote: false,
    salaryMin: 140000,
    salaryMax: 180000,
    salaryCurrency: 'USD',
    description: 'Design and implement secure smart contracts for our L2 scaling solution. Work with cutting-edge blockchain technology.',
    requirements: [
      '3+ years Solidity experience',
      'Deep understanding of Ethereum',
      'Security audit experience',
      'Gas optimization expertise'
    ],
    benefits: [
      'Token allocation',
      'Relocation assistance',
      'Health insurance',
      'Flexible hours'
    ],
    tags: ['Solidity', 'Ethereum', 'L2', 'Smart Contracts', 'Base'],
    postedBy: {
      fid: 5678,
      username: 'base',
      displayName: 'Base',
      pfpUrl: 'https://i.imgur.com/base.jpg'
    },
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    applicationUrl: 'https://base.org/careers',
    applicationCount: 8,
    featured: false,
  },
  {
    id: 'job_demo_3',
    title: 'Community Manager',
    company: 'Warpcast',
    location: 'Remote',
    type: 'part-time',
    remote: true,
    salaryMin: 50000,
    salaryMax: 70000,
    salaryCurrency: 'USD',
    description: 'Help grow and nurture the Farcaster community. Engage with users, moderate content, and drive community initiatives.',
    requirements: [
      'Experience in community management',
      'Deep understanding of Farcaster',
      'Excellent communication skills',
      'Social media expertise'
    ],
    benefits: [
      'Flexible schedule',
      'Remote work',
      'Community perks',
      'Growth opportunities'
    ],
    tags: ['Community', 'Social Media', 'Farcaster', 'Remote'],
    postedBy: {
      fid: 9152,
      username: 'warpcast',
      displayName: 'Warpcast',
      pfpUrl: 'https://i.imgur.com/warpcast.jpg'
    },
    postedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    applicationCount: 5,
    featured: false,
  }
];

export async function getAllJobs(): Promise<Job[]> {
  try {
    return await db.getAllJobs();
  } catch (error) {
    console.warn('Database unavailable, using demo data:', error);
    return demoJobs.sort((a, b) => {
      // Featured jobs first, then by date
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    });
  }
}

export async function getJobById(id: string): Promise<Job | null> {
  try {
    return await db.getJobById(id);
  } catch (error) {
    console.warn('Database unavailable, using demo data:', error);
    return demoJobs.find(job => job.id === id) || null;
  }
}

export async function createJob(jobData: Omit<Job, 'id' | 'postedAt' | 'applicationCount'>): Promise<Job> {
  try {
    return await db.createJob(jobData);
  } catch (error) {
    console.warn('Database unavailable, using in-memory storage:', error);
    // Fallback to in-memory for development
    const newJob: Job = {
      ...jobData,
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      postedAt: new Date().toISOString(),
      applicationCount: 0,
    };
    
    demoJobs.push(newJob);
    return newJob;
  }
}

export async function searchJobs(query: string, filters?: {
  type?: string;
  remote?: boolean;
  location?: string;
}): Promise<Job[]> {
  try {
    return await db.searchJobs(query, filters);
  } catch (error) {
    console.warn('Database unavailable, using demo data:', error);
    let filteredJobs = demoJobs;
    
    // Text search
    if (query) {
      const searchTerm = query.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    // Filters
    if (filters) {
      if (filters.type) {
        filteredJobs = filteredJobs.filter(job => job.type === filters.type);
      }
      if (filters.remote !== undefined) {
        filteredJobs = filteredJobs.filter(job => job.remote === filters.remote);
      }
      if (filters.location) {
        filteredJobs = filteredJobs.filter(job => 
          job.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
    }
    
    return filteredJobs.sort((a, b) => {
      // Featured jobs first, then by date
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    });
  }
}

export async function incrementApplicationCount(jobId: string): Promise<void> {
  try {
    await db.incrementApplicationCount(jobId);
  } catch (error) {
    console.warn('Database unavailable:', error);
    // Fallback for demo data
    const job = demoJobs.find(j => j.id === jobId);
    if (job) {
      job.applicationCount++;
    }
  }
}
