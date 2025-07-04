'use client';

import { useState } from 'react';
import { MiniAppProvider, useMiniApp } from '@/components/MiniAppProvider';
import { JobList } from '@/components/JobList';
import { PostJobForm } from '@/components/PostJobForm';
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
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src="/icon.png" alt="Logo" className="w-full h-full object-cover" />
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



export default function App() {
  return (
    <MiniAppProvider>
      <HomePage />
    </MiniAppProvider>
  );
}
