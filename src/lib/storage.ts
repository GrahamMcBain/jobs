import { Job } from '@/types';

// Simple in-memory storage for demo - in production use a database
let jobs: Job[] = [
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

export function getAllJobs(): Job[] {
  return jobs.sort((a, b) => {
    // Featured jobs first, then by date
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
  });
}

export function getJobById(id: string): Job | undefined {
  return jobs.find(job => job.id === id);
}

export function createJob(jobData: Omit<Job, 'id' | 'postedAt' | 'applicationCount'>): Job {
  const newJob: Job = {
    ...jobData,
    id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    postedAt: new Date().toISOString(),
    applicationCount: 0,
  };
  
  jobs.push(newJob);
  return newJob;
}

export function searchJobs(query: string, filters?: {
  type?: string;
  remote?: boolean;
  location?: string;
}): Job[] {
  let filteredJobs = jobs;
  
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

export function incrementApplicationCount(jobId: string): void {
  const job = jobs.find(j => j.id === jobId);
  if (job) {
    job.applicationCount++;
  }
}
