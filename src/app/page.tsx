'use client';

import { useState } from 'react';
import { MiniAppProvider, useMiniApp } from '@/components/MiniAppProvider';
import { JobList } from '@/components/JobList';
import { sdk } from '@farcaster/miniapp-sdk';

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'browse' | 'post'>('browse');
  const context = useMiniApp();

  const handlePostJob = async () => {
    setActiveTab('post');
  };

  const handleShareApp = async () => {
    await sdk.actions.composeCast({
      text: "🚀 Check out Farcaster Jobs - find and post opportunities in the Farcaster ecosystem!",
      embeds: [window.location.href],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">🚀</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Farcaster Jobs</h1>
                <p className="text-xs text-gray-500">
                  Welcome, {context.user.displayName || context.user.username}!
                </p>
              </div>
            </div>
            <button
              onClick={handleShareApp}
              className="text-purple-600 text-sm font-medium"
            >
              Share
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('browse')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'browse'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Browse Jobs
            </button>
            <button
              onClick={() => setActiveTab('post')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'post'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Post Job
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {activeTab === 'browse' ? (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div className="absolute left-3 top-3.5 text-gray-400">
                🔍
              </div>
            </div>

            {/* Job List */}
            <JobList searchQuery={searchQuery} />
          </div>
        ) : (
          <PostJobForm />
        )}
      </div>
    </div>
  );
}

function PostJobForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time' as const,
    remote: false,
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'USD',
    description: '',
    requirements: '',
    benefits: '',
    tags: '',
    applicationUrl: '',
    featured: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real implementation, this would:
      // 1. Validate form data
      // 2. Process payment through Farcaster wallet
      // 3. Save job to database
      // 4. Show success message

      console.log('Job posting data:', formData);
      
      // Mock payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success and reset form
      await sdk.actions.composeCast({
        text: `🎉 Just posted a new job: ${formData.title} at ${formData.company}!\n\nCheck it out on Farcaster Jobs 🚀`,
        embeds: [window.location.href],
      });

      // Reset form
      setFormData({
        title: '',
        company: '',
        location: '',
        type: 'full-time',
        remote: false,
        salaryMin: '',
        salaryMax: '',
        salaryCurrency: 'USD',
        description: '',
        requirements: '',
        benefits: '',
        tags: '',
        applicationUrl: '',
        featured: false,
      });

    } catch (error) {
      console.error('Error posting job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Basic Info */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Job Details</h3>
        
        <div className="space-y-3">
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          
          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={formData.company}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />

          <div className="flex gap-2">
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>

            <label className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg">
              <input
                type="checkbox"
                name="remote"
                checked={formData.remote}
                onChange={handleInputChange}
                className="text-purple-600"
              />
              <span className="text-sm">Remote</span>
            </label>
          </div>
        </div>
      </div>

      {/* Salary */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Compensation</h3>
        
        <div className="flex gap-2">
          <input
            type="number"
            name="salaryMin"
            placeholder="Min Salary"
            value={formData.salaryMin}
            onChange={handleInputChange}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <input
            type="number"
            name="salaryMax"
            placeholder="Max Salary"
            value={formData.salaryMax}
            onChange={handleInputChange}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <select
            name="salaryCurrency"
            value={formData.salaryCurrency}
            onChange={handleInputChange}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="ETH">ETH</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
        
        <textarea
          name="description"
          placeholder="Job description..."
          value={formData.description}
          onChange={handleInputChange}
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Additional Info</h3>
        
        <div className="space-y-3">
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma-separated)"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          
          <input
            type="url"
            name="applicationUrl"
            placeholder="Application URL (optional)"
            value={formData.applicationUrl}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              className="text-purple-600"
            />
            <span className="text-sm">Featured listing (+0.05 ETH)</span>
          </label>
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
        <h3 className="font-semibold text-purple-900 mb-2">💰 Payment Required</h3>
        <div className="text-sm text-purple-700">
          <div>• Job posting: 0.01 ETH</div>
          {formData.featured && <div>• Featured listing: +0.05 ETH</div>}
          <div className="font-medium mt-1">
            Total: {formData.featured ? '0.06' : '0.01'} ETH
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Processing Payment...' : 'Post Job & Pay'}
      </button>
    </form>
  );
}

export default function App() {
  return (
    <MiniAppProvider>
      <HomePage />
    </MiniAppProvider>
  );
}
