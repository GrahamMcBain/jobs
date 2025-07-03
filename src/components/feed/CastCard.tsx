'use client';

import React, { useState } from 'react';
import { Cast } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate, formatNumber } from '@/lib/utils';
import { 
  HeartIcon, 
  ArrowPathRoundedSquareIcon, 
  ChatBubbleLeftIcon,
  ShareIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartIconSolid,
  ArrowPathRoundedSquareIcon as ArrowPathRoundedSquareIconSolid
} from '@heroicons/react/24/solid';

interface CastCardProps {
  cast: Cast;
  onReaction?: (castHash: string, reactionType: 'like' | 'recast', isAdd: boolean) => void;
}

export default function CastCard({ cast, onReaction }: CastCardProps) {
  const { user, signerUuid } = useAuth();
  const [isReacting, setIsReacting] = useState(false);

  const handleReaction = async (reactionType: 'like' | 'recast') => {
    if (!signerUuid || isReacting) return;
    
    setIsReacting(true);
    
    try {
      const isCurrentlyActive = reactionType === 'like' 
        ? cast.viewerContext?.liked 
        : cast.viewerContext?.recasted;
      
      const method = isCurrentlyActive ? 'DELETE' : 'POST';
      const url = isCurrentlyActive 
        ? `/api/reactions?signerUuid=${signerUuid}&reactionType=${reactionType}&targetHash=${cast.hash}`
        : '/api/reactions';
      
      const body = !isCurrentlyActive ? {
        signerUuid,
        reactionType,
        targetHash: cast.hash,
      } : undefined;

      const response = await fetch(url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : {},
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error('Failed to update reaction');
      }

      // Call the callback to update the UI
      onReaction?.(cast.hash, reactionType, !isCurrentlyActive);
    } catch (error) {
      console.error('Error updating reaction:', error);
    } finally {
      setIsReacting(false);
    }
  };

  const renderEmbeds = () => {
    if (!cast.embeds || cast.embeds.length === 0) return null;

    return (
      <div className="mt-3 space-y-2">
        {cast.embeds.map((embed, index) => (
          <div key={index}>
            {embed.url && (
              <div className="border rounded-lg p-3 bg-gray-50">
                {embed.metadata?.image?.url && (
                  <img
                    src={embed.metadata.image.url}
                    alt={embed.metadata.title || 'Embedded image'}
                    className="w-full rounded-lg mb-2"
                  />
                )}
                <div className="space-y-1">
                  {embed.metadata?.title && (
                    <div className="font-medium text-gray-900">
                      {embed.metadata.title}
                    </div>
                  )}
                  {embed.metadata?.description && (
                    <div className="text-sm text-gray-600">
                      {embed.metadata.description}
                    </div>
                  )}
                  <a
                    href={embed.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-purple-600 hover:text-purple-800"
                  >
                    {embed.url}
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img
            src={cast.author.pfp.url}
            alt={cast.author.displayName}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="font-medium text-gray-900">
              {cast.author.displayName}
            </div>
            <div className="text-sm text-gray-500">
              @{cast.author.username} · {formatDate(cast.timestamp)}
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <EllipsisHorizontalIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="mb-3">
        <div className="text-gray-900 whitespace-pre-wrap">
          {cast.text}
        </div>
        {renderEmbeds()}
      </div>

      {/* Channel */}
      {cast.channel && (
        <div className="mb-3 text-sm text-purple-600">
          /{cast.channel.id}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center space-x-6">
          {/* Like */}
          <button
            onClick={() => handleReaction('like')}
            disabled={!signerUuid || isReacting}
            className={`flex items-center space-x-2 text-sm hover:text-red-600 transition-colors ${
              cast.viewerContext?.liked ? 'text-red-600' : 'text-gray-500'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {cast.viewerContext?.liked ? (
              <HeartIconSolid className="w-4 h-4" />
            ) : (
              <HeartIcon className="w-4 h-4" />
            )}
            <span>{formatNumber(cast.reactions.likesCount)}</span>
          </button>

          {/* Recast */}
          <button
            onClick={() => handleReaction('recast')}
            disabled={!signerUuid || isReacting}
            className={`flex items-center space-x-2 text-sm hover:text-green-600 transition-colors ${
              cast.viewerContext?.recasted ? 'text-green-600' : 'text-gray-500'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {cast.viewerContext?.recasted ? (
              <ArrowPathRoundedSquareIconSolid className="w-4 h-4" />
            ) : (
              <ArrowPathRoundedSquareIcon className="w-4 h-4" />
            )}
            <span>{formatNumber(cast.reactions.recastsCount)}</span>
          </button>

          {/* Reply */}
          <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
            <ChatBubbleLeftIcon className="w-4 h-4" />
            <span>{formatNumber(cast.replies.count)}</span>
          </button>
        </div>

        {/* Share */}
        <button className="text-gray-400 hover:text-gray-600">
          <ShareIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
