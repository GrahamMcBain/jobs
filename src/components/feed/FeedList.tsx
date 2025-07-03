'use client';

import React, { useState, useEffect } from 'react';
import { Cast, FeedFilters } from '@/types';
import CastCard from './CastCard';
import { useAuth } from '@/contexts/AuthContext';

interface FeedListProps {
  initialFilters?: FeedFilters;
  className?: string;
}

export default function FeedList({ initialFilters, className }: FeedListProps) {
  const { user } = useAuth();
  const [casts, setCasts] = useState<Cast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [filters, setFilters] = useState<FeedFilters>(initialFilters || {});

  const fetchFeed = async (reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      
      if (filters.feedType) params.append('feedType', filters.feedType);
      if (filters.filterType) params.append('filterType', filters.filterType);
      if (filters.channelId) params.append('channelId', filters.channelId);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (user?.fid) params.append('fid', user.fid.toString());
      if (cursor && !reset) params.append('cursor', cursor);

      const response = await fetch(`/api/feed?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch feed');
      }

      const data = await response.json();
      
      if (reset) {
        setCasts(data.casts);
      } else {
        setCasts(prev => [...prev, ...data.casts]);
      }
      
      setCursor(data.next?.cursor || null);
      setHasMore(!!data.next?.cursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed(true);
  }, [filters, user?.fid]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchFeed(false);
    }
  };

  const handleReaction = async (castHash: string, reactionType: 'like' | 'recast', isAdd: boolean) => {
    // Optimistically update the UI
    setCasts(prev => prev.map(cast => {
      if (cast.hash === castHash) {
        const newCast = { ...cast };
        if (reactionType === 'like') {
          newCast.reactions.likesCount += isAdd ? 1 : -1;
          if (newCast.viewerContext) {
            newCast.viewerContext.liked = isAdd;
          }
        } else if (reactionType === 'recast') {
          newCast.reactions.recastsCount += isAdd ? 1 : -1;
          if (newCast.viewerContext) {
            newCast.viewerContext.recasted = isAdd;
          }
        }
        return newCast;
      }
      return cast;
    }));
  };

  if (loading && casts.length === 0) {
    return (
      <div className={`space-y-4 ${className || ''}`}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border p-4 animate-pulse">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/6" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className || ''}`}>
        <div className="text-red-800 font-medium">Error loading feed</div>
        <div className="text-red-600 text-sm mt-1">{error}</div>
        <button
          onClick={() => fetchFeed(true)}
          className="mt-3 text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {casts.map((cast) => (
        <CastCard
          key={cast.hash}
          cast={cast}
          onReaction={handleReaction}
        />
      ))}
      
      {hasMore && (
        <div className="flex justify-center py-4">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
      
      {!hasMore && casts.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          No more casts to load
        </div>
      )}
    </div>
  );
}
