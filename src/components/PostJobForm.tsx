'use client';

import { useState } from 'react';
import { useMiniApp } from './MiniAppProvider';
import { usePayment } from '@/lib/hooks/usePayment';
import { uploadCompanyLogo, getImagePreviewUrl, revokeImagePreviewUrl, validateImage } from '@/lib/upload';
import { sdk } from '@farcaster/miniapp-sdk';
import { PAYMENT_CONFIG } from '@/lib/config';

export function PostJobForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'form' | 'payment' | 'success'>('form');
  const context = useMiniApp();
  const { processPayment, verifyPayment, isProcessing, isConnected } = usePayment();

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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImage(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    // Clean up previous preview
    if (logoPreview) {
      revokeImagePreviewUrl(logoPreview);
    }

    setCompanyLogo(file);
    setLogoPreview(getImagePreviewUrl(file));
  };

  const calculateTotalAmount = () => {
    const baseAmount = 0.01; // Base job posting fee
    const featuredAmount = formData.featured ? 0.05 : 0;
    return baseAmount + featuredAmount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.company || !formData.location || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    setPaymentStep('payment');
    setIsSubmitting(true);

    try {
      // Step 1: Process payment
      const totalAmount = calculateTotalAmount();
      const paymentResult = await processPayment(totalAmount.toString(), formData.featured);

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment failed');
      }

      // Step 2: Upload company logo if provided
      let companyLogoUrl = '';
      if (companyLogo) {
        const uploadResult = await uploadCompanyLogo(companyLogo);
        if (uploadResult.success) {
          companyLogoUrl = uploadResult.url!;
        }
      }

      // Step 3: Verify payment (optional - can be done in background)
      const paymentVerified = paymentResult.txHash ? 
        await verifyPayment(paymentResult.txHash) : false;

      // Step 4: Create job posting
      const jobData = {
        ...formData,
        companyLogoUrl,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
        requirements: formData.requirements.split('\n').filter(Boolean),
        benefits: formData.benefits.split('\n').filter(Boolean),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        postedBy: context.user,
        paymentTxHash: paymentResult.txHash,
        paymentAmount: (BigInt(totalAmount * 1e18)).toString(), // Convert to wei
        paymentVerified,
      };

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error('Failed to create job posting');
      }

      const { job } = await response.json();

      // Step 5: Show success and share
      setPaymentStep('success');
      
      await sdk.actions.composeCast({
        text: `🎉 Just posted a new job: ${formData.title} at ${formData.company}!\n\n💼 ${formData.location}${formData.remote ? ' (Remote)' : ''}\n\nCheck it out on Farcaster Jobs 🚀`,
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

      if (logoPreview) {
        revokeImagePreviewUrl(logoPreview);
        setLogoPreview(null);
      }
      setCompanyLogo(null);

    } catch (error: any) {
      console.error('Error posting job:', error);
      alert(error.message || 'Failed to post job');
      setPaymentStep('form');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (paymentStep === 'success') {
    return (
      <div className="text-center py-12">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Posted Successfully!</h3>
        <p className="text-gray-600 mb-4">
          Your job posting is now live and has been shared to your Farcaster feed.
        </p>
        <button
          onClick={() => setPaymentStep('form')}
          className="bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700"
        >
          Post Another Job
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Payment Processing Overlay */}
      {paymentStep === 'payment' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
              <p className="text-gray-600 text-sm">
                Please confirm the transaction in your wallet...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Job Details</h3>
        
        <div className="space-y-3">
          <input
            type="text"
            name="title"
            placeholder="Job Title *"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          
          <input
            type="text"
            name="company"
            placeholder="Company Name *"
            value={formData.company}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />

          {/* Company Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
            <div className="flex items-center space-x-3">
              {logoPreview ? (
                <div className="relative">
                  <img
                    src={logoPreview}
                    alt="Company logo preview"
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (logoPreview) revokeImagePreviewUrl(logoPreview);
                      setLogoPreview(null);
                      setCompanyLogo(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-sm">📷</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="text-sm text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
          </div>
          
          <input
            type="text"
            name="location"
            placeholder="Location *"
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
        <h3 className="font-semibold text-gray-900 mb-3">Description *</h3>
        
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
          <textarea
            name="requirements"
            placeholder="Requirements (one per line)"
            value={formData.requirements}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />

          <textarea
            name="benefits"
            placeholder="Benefits (one per line)"
            value={formData.benefits}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          
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
            Total: {calculateTotalAmount()} ETH
          </div>
          <div className="text-xs mt-2 text-purple-600">
            Payment to: {PAYMENT_CONFIG.recipientAddress}
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || isProcessing}
        className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Processing...' : `Post Job & Pay ${calculateTotalAmount()} ETH`}
      </button>

      {!isConnected && (
        <p className="text-sm text-gray-600 text-center">
          Your wallet will be connected automatically when you submit
        </p>
      )}
    </form>
  );
}
