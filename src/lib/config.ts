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
  // Payment recipient address
  recipientAddress: "0x436910fD27aae11Dd2A6e790d1420955909deC25",
  // Supported payment tokens
  tokens: {
    ETH: {
      address: null, // Native ETH
      symbol: "ETH",
      decimals: 18,
      jobPostingFee: "10000000000000000", // 0.01 ETH
      featuredJobFee: "50000000000000000", // 0.05 ETH additional
      priceDisplay: {
        jobPosting: "0.01 ETH",
        featured: "0.05 ETH"
      }
    },
    USDC: {
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // Base USDC
      symbol: "USDC",
      decimals: 6,
      jobPostingFee: "25000000", // $25 USDC (6 decimals)
      featuredJobFee: "125000000", // $125 USDC additional
      priceDisplay: {
        jobPosting: "$25 USDC",
        featured: "$125 USDC"
      }
    }
  }
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
