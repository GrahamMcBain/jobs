import React from 'react';
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  BriefcaseIcon,
  ClockIcon,
  CurrencyDollarIcon,
  FireIcon
} from '@heroicons/react/24/outline';

// Mock data for demonstration
const mockJobs = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'Farcaster Labs',
    location: 'San Francisco, CA',
    type: 'full-time',
    remote: true,
    salaryRange: { min: 150000, max: 200000, currency: 'USD' },
    description: 'Build the future of decentralized social media with React and TypeScript.',
    requirements: ['5+ years React experience', 'TypeScript', 'Web3 knowledge'],
    benefits: ['Equity', 'Health insurance', 'Remote work'],
    tags: ['React', 'TypeScript', 'Web3', 'Farcaster'],
    postedAt: '2024-01-15T10:00:00Z',
    applications: 12,
    featured: true,
  },
  {
    id: '2',
    title: 'Solidity Smart Contract Developer',
    company: 'Base Protocol',
    location: 'New York, NY',
    type: 'contract',
    remote: false,
    salaryRange: { min: 120000, max: 180000, currency: 'USD' },
    description: 'Design and implement secure smart contracts for DeFi protocols.',
    requirements: ['3+ years Solidity', 'DeFi experience', 'Security auditing'],
    benefits: ['Competitive rates', 'Flexible hours'],
    tags: ['Solidity', 'DeFi', 'Smart Contracts', 'Base'],
    postedAt: '2024-01-14T14:30:00Z',
    applications: 8,
    featured: false,
  },
  {
    id: '3',
    title: 'Product Manager - Social Features',
    company: 'Warpcast',
    location: 'Remote',
    type: 'full-time',
    remote: true,
    salaryRange: { min: 130000, max: 160000, currency: 'USD' },
    description: 'Lead product development for next-generation social features.',
    requirements: ['5+ years product management', 'Social media experience', 'Data-driven'],
    benefits: ['Stock options', 'Health coverage', 'Unlimited PTO'],
    tags: ['Product Management', 'Social Media', 'Growth'],
    postedAt: '2024-01-13T09:15:00Z',
    applications: 15,
    featured: true,
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'Neynar',
    location: 'Austin, TX',
    type: 'full-time',
    remote: true,
    salaryRange: { min: 140000, max: 170000, currency: 'USD' },
    description: 'Scale infrastructure for the next generation of decentralized applications.',
    requirements: ['Kubernetes', 'AWS/GCP', 'Docker', 'Monitoring'],
    benefits: ['401k matching', 'Health insurance', 'Learning budget'],
    tags: ['DevOps', 'Kubernetes', 'AWS', 'Infrastructure'],
    postedAt: '2024-01-12T16:45:00Z',
    applications: 6,
    featured: false,
  },
];

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Next Opportunity
          </h1>
          <p className="text-gray-600">
            Discover amazing job opportunities in the Farcaster ecosystem
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, or skills..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                <option>All Locations</option>
                <option>Remote</option>
                <option>San Francisco</option>
                <option>New York</option>
                <option>Austin</option>
              </select>
              <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                <option>All Types</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {mockJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg border hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {job.title}
                      </h2>
                      {job.featured && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <FireIcon className="w-3 h-3 mr-1" />
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="text-lg font-medium text-purple-600 mb-2">
                      {job.company}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="w-4 h-4" />
                        {job.location}
                        {job.remote && <span className="text-green-600">• Remote</span>}
                      </div>
                      <div className="flex items-center gap-1">
                        <BriefcaseIcon className="w-4 h-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <CurrencyDollarIcon className="w-4 h-4" />
                        ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                      <ClockIcon className="w-4 h-4" />
                      {new Date(job.postedAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {job.applications} applications
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Requirements:</span> {job.requirements.slice(0, 2).join(', ')}
                      {job.requirements.length > 2 && '...'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                      Save
                    </button>
                    <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Load More Jobs
          </button>
        </div>
      </div>
    </div>
  );
}
