export const MINIAPP_CONFIG = {
  name: "Farcaster Jobs",
  description: "Find and post jobs in the Farcaster ecosystem",
  iconUrl: "/icon.png",
  homeUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  version: "1",
} as const;

export const PAYMENT_CONFIG = {
  // Base mainnet
  chainId: 8453,
  // Job posting fees (in wei)
  jobPostingFee: "10000000000000000", // 0.01 ETH
  featuredJobFee: "50000000000000000", // 0.05 ETH additional
  // Native ETH payments for simplicity
  tokenAddress: null,
} as const;

export const NEYNAR_CONFIG = {
  apiKey: process.env.NEYNAR_API_KEY,
  baseUrl: "https://api.neynar.com",
} as const;

export const APP_CONFIG = {
  maxJobsPerPage: 20,
  jobExpirationDays: 30,
  maxTitleLength: 100,
  maxDescriptionLength: 2000,
  maxRequirementsLength: 1000,
  maxBenefitsLength: 1000,
  supportedJobTypes: ['full-time', 'part-time', 'contract', 'internship'] as const,
  supportedCurrencies: ['USD', 'EUR', 'GBP', 'ETH'] as const,
} as const;
