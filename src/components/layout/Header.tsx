'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { NeynarAuthButton } from '@neynar/react';
import { NEYNAR_CLIENT_ID } from '@/lib/neynar';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Farcaster Jobs</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-purple-600 font-medium">
              Jobs
            </Link>
            <Link href="/post-job" className="text-gray-700 hover:text-purple-600 font-medium">
              Post Job
            </Link>
            <Link href="/companies" className="text-gray-700 hover:text-purple-600 font-medium">
              Companies
            </Link>
            <Link href="/feed" className="text-gray-700 hover:text-purple-600 font-medium">
              Feed
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user?.pfp?.url && (
                  <img
                    src={user.pfp.url}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {user?.displayName || user?.username}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <NeynarAuthButton
                client_id={NEYNAR_CLIENT_ID}
                success_callback="onSignInSuccess"
                variant="primary"
                theme="light"
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
