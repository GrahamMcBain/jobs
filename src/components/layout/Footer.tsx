import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FC</span>
              </div>
              <span className="text-lg font-bold text-gray-900">Farcaster Jobs</span>
            </div>
            <p className="text-gray-600 text-sm">
              The premier job board for the Farcaster ecosystem. Connect with opportunities 
              and talent in the decentralized social space.
            </p>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">For Job Seekers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/jobs" className="text-sm text-gray-600 hover:text-purple-600">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/companies" className="text-sm text-gray-600 hover:text-purple-600">
                  Companies
                </Link>
              </li>
              <li>
                <Link href="/feed" className="text-sm text-gray-600 hover:text-purple-600">
                  Job Feed
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-sm text-gray-600 hover:text-purple-600">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">For Employers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/post-job" className="text-sm text-gray-600 hover:text-purple-600">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-gray-600 hover:text-purple-600">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/employer-dashboard" className="text-sm text-gray-600 hover:text-purple-600">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-sm text-gray-600 hover:text-purple-600">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://warpcast.com/~/channel/farcaster-jobs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-purple-600"
                >
                  Warpcast Channel
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/farcaster-jobs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-purple-600"
                >
                  GitHub
                </a>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-purple-600">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-purple-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              © 2024 Farcaster Jobs. Built with ❤️ for the Farcaster community.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-purple-600">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-600 hover:text-purple-600">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
