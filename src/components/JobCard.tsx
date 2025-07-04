'use client';

import { Job } from '@/types';
import { formatDate, formatSalary, formatJobType, truncateText } from '@/lib/utils';
import { sdk } from '@farcaster/miniapp-sdk';

interface JobCardProps {
  job: Job;
  onApply?: (job: Job) => void;
}

export function JobCard({ job, onApply }: JobCardProps) {
  const handleApply = async () => {
    if (job.applicationUrl) {
      // Open external application URL
      await sdk.actions.openUrl(job.applicationUrl);
    } else if (onApply) {
      onApply(job);
    }
  };

  const handleShare = async () => {
    const shareText = `🚀 ${job.title} at ${job.company}

${truncateText(job.description, 100)}

Apply now!`;

    await sdk.actions.composeCast({
      text: shareText,
      embeds: [window.location.href],
    });
  };

  return (
    <div className="job-card">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg text-gray-900 leading-tight">
              {job.title}
            </h3>
            {job.featured && (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                ✨ Featured
              </span>
            )}
          </div>
          <div className="text-purple-600 font-medium mb-1">{job.company}</div>
          <div className="text-sm text-gray-500">
            {job.location} {job.remote && '• Remote'}
          </div>
        </div>
        
        {job.postedBy.pfpUrl && (
          <img
            src={job.postedBy.pfpUrl}
            alt={job.postedBy.displayName || job.postedBy.username}
            className="w-10 h-10 rounded-full border-2 border-purple-100"
          />
        )}
      </div>

      {/* Job details */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
        <span className="bg-gray-100 px-2 py-1 rounded">
          {formatJobType(job.type)}
        </span>
        <span>{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}</span>
        <span>{formatDate(job.postedAt)}</span>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-3 leading-relaxed">
        {truncateText(job.description, 120)}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {job.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
        {job.tags.length > 4 && (
          <span className="text-xs text-gray-500">
            +{job.tags.length - 4} more
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleApply}
          className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          Apply Now
        </button>
        <button
          onClick={handleShare}
          className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Share
        </button>
      </div>

      {/* Application count */}
      {job.applicationCount > 0 && (
        <div className="text-xs text-gray-500 mt-2 text-center">
          {job.applicationCount} application{job.applicationCount !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
