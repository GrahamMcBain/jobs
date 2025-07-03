'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PhotoIcon, FaceSmileIcon, AtSymbolIcon } from '@heroicons/react/24/outline';

interface ComposeCastProps {
  parentHash?: string;
  parentUrl?: string;
  placeholder?: string;
  onCastPublished?: () => void;
  className?: string;
}

export default function ComposeCast({ 
  parentHash, 
  parentUrl, 
  placeholder = "What's happening?",
  onCastPublished,
  className 
}: ComposeCastProps) {
  const { user, signerUuid } = useAuth();
  const [text, setText] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const maxLength = 320; // Farcaster's character limit
  const remainingChars = maxLength - text.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signerUuid || !text.trim()) return;
    
    setIsPublishing(true);
    setError(null);

    try {
      const response = await fetch('/api/casts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          signerUuid,
          parentHash,
          parentUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to publish cast');
      }

      // Reset form
      setText('');
      setError(null);
      
      // Callback to refresh feed or handle success
      onCastPublished?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish cast');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setText(value);
    }
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  if (!user || !signerUuid) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg border p-4 ${className || ''}`}>
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-3">
          <img
            src={user.pfp.url}
            alt={user.displayName}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              placeholder={placeholder}
              className="w-full resize-none border-none focus:ring-0 focus:outline-none text-lg placeholder-gray-500"
              rows={3}
              disabled={isPublishing}
            />
            
            {error && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                {error}
              </div>
            )}
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="text-purple-600 hover:text-purple-700 p-2 rounded-full hover:bg-purple-50"
                  disabled={isPublishing}
                >
                  <PhotoIcon className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="text-purple-600 hover:text-purple-700 p-2 rounded-full hover:bg-purple-50"
                  disabled={isPublishing}
                >
                  <FaceSmileIcon className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="text-purple-600 hover:text-purple-700 p-2 rounded-full hover:bg-purple-50"
                  disabled={isPublishing}
                >
                  <AtSymbolIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className={`text-sm ${remainingChars < 0 ? 'text-red-500' : remainingChars < 20 ? 'text-yellow-500' : 'text-gray-500'}`}>
                  {remainingChars}
                </div>
                <button
                  type="submit"
                  disabled={isPublishing || !text.trim() || remainingChars < 0}
                  className="bg-purple-600 text-white px-6 py-2 rounded-full font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPublishing ? 'Publishing...' : 'Cast'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
