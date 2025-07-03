'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import FeedList from '@/components/feed/FeedList';
import ComposeCast from '@/components/compose/ComposeCast';
import { FeedFilters } from '@/types';
import { NeynarAuthButton } from '@neynar/react';
import { NEYNAR_CLIENT_ID } from '@/lib/neynar';

export default function FeedPage() {
  const { user, isAuthenticated, login } = useAuth();
  const [activeFilter, setActiveFilter] = useState<'following' | 'trending' | 'jobs'>('trending');
  const [filters, setFilters] = useState<FeedFilters>({
    feedType: 'filter',
    filterType: 'global_trending',
    limit: 25,
  });
  const [feedKey, setFeedKey] = useState(0);

  useEffect(() => {
    // Set up the global callback for Neynar auth
    const handleAuthSuccess = async (event: any) => {
      const { signer_uuid } = event.detail;
      if (signer_uuid) {
        try {
          await login(signer_uuid);
        } catch (error) {
          console.error('Login failed:', error);
        }
      }
    };

    window.addEventListener('neynar-auth-success', handleAuthSuccess);
    return () => window.removeEventListener('neynar-auth-success', handleAuthSuccess);
  }, [login]);

  const handleFilterChange = (filterType: 'following' | 'trending' | 'jobs') => {
    setActiveFilter(filterType);
    
    switch (filterType) {
      case 'following':
        setFilters({
          feedType: 'following',
          limit: 25,
        });
        break;
      case 'trending':
        setFilters({
          feedType: 'filter',
          filterType: 'global_trending',
          limit: 25,
        });
        break;
      case 'jobs':
        setFilters({
          feedType: 'filter',
          filterType: 'channel_id',
          channelId: 'farcaster-jobs',
          limit: 25,
        });
        break;
    }
  };

  const handleCastPublished = () => {
    // Refresh the feed by changing the key
    setFeedKey(prev => prev + 1);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-white rounded-lg border p-8 shadow-sm">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold text-2xl">🔐</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Connect Your Farcaster Account
              </h1>
              <p className="text-gray-600 mb-6">
                Sign in with your Farcaster account to view your personalized feed and interact with casts.
              </p>
              <NeynarAuthButton
                client_id={NEYNAR_CLIENT_ID}
                success_callback="onSignInSuccess"
                variant="primary"
                theme="light"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Farcaster Feed
          </h1>
          <p className="text-gray-600">
            Stay up to date with the latest from your network and the Farcaster community.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg border mb-6">
          <div className="flex border-b">
            <button
              onClick={() => handleFilterChange('following')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeFilter === 'following'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Following
            </button>
            <button
              onClick={() => handleFilterChange('trending')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeFilter === 'trending'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Trending
            </button>
            <button
              onClick={() => handleFilterChange('jobs')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeFilter === 'jobs'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Jobs
            </button>
          </div>
        </div>

        {/* Compose Cast */}
        <ComposeCast 
          placeholder="Share a job opportunity or career update..."
          onCastPublished={handleCastPublished}
          className="mb-6"
        />

        {/* Feed */}
        <FeedList 
          key={`${activeFilter}-${JSON.stringify(filters)}-${feedKey}`}
          initialFilters={filters}
        />
      </div>
    </div>
  );
}
