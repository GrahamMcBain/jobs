# Farcaster Jobs Mini App - Agent Context

## Project Overview
This is a Farcaster Mini App that provides job board functionality within the Farcaster ecosystem. Users can browse and post jobs directly within Farcaster clients, with payments handled through integrated crypto wallets.

## Key Technologies
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- @farcaster/miniapp-sdk for native Farcaster integration
- Wagmi for Ethereum wallet connections
- Viem for blockchain interactions
- Base network for low-cost transactions

## Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint

# Start production server
npm start
```

## Environment Variables
- `NEXT_PUBLIC_APP_URL`: Application URL for mini app hosting
- `NEYNAR_API_KEY`: Optional API key for extended Neynar features

## Project Structure
- `/src/app`: Next.js App Router pages and API routes
- `/src/components`: React components optimized for mini app UI
- `/src/lib`: Utility functions and configurations
- `/src/types`: TypeScript type definitions
- `/public/.well-known/`: Mini app manifest and metadata

## Key Features
1. **Native Mini App Experience**: Runs inside Farcaster clients (424x695px)
2. **Job Browsing**: Search and filter job opportunities
3. **Job Posting**: Create listings with crypto payment (0.01 ETH)
4. **Featured Listings**: Premium placement for +0.05 ETH
5. **Social Integration**: Share jobs through Farcaster casts
6. **Wallet Integration**: Seamless payments through connected wallets
7. **Mobile Optimized**: Touch-friendly interface with safe area handling

## Development Notes
- Built specifically as a Farcaster Mini App, not a standalone web app
- Uses Base network for low transaction costs
- Implements Mini App SDK for native Farcaster features
- Handles payment verification and job posting workflow
- Optimized for mobile viewing within Farcaster clients
- Includes proper manifest configuration for mini app distribution
