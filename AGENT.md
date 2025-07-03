# Farcaster Job Board - Agent Context

## Project Overview
This is a Next.js application that integrates with Farcaster using Neynar's SDK to create a job board platform on the Farcaster protocol.

## Key Technologies
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Neynar React SDK (@neynar/react)
- Neynar Node.js SDK (@neynar/nodejs-sdk)
- Farcaster Frame SDK (@farcaster/frame-sdk)
- Wagmi for wallet connections

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
- `NEYNAR_API_KEY`: Server-side API key for Neynar
- `NEXT_PUBLIC_NEYNAR_CLIENT_ID`: Client-side ID for Neynar authentication
- `NEXT_PUBLIC_APP_URL`: Application URL for webhooks and redirects

## Project Structure
- `/src/app`: Next.js App Router pages and API routes
- `/src/components`: Reusable React components
- `/src/lib`: Utility functions and configurations
- `/src/types`: TypeScript type definitions
- `/src/hooks`: Custom React hooks

## Key Features
1. Farcaster authentication with Sign-In with Neynar (SIWN)
2. Personalized job feed from Farcaster
3. Job posting and application functionality
4. User profiles and discovery
5. Real-time updates via webhooks
6. Mini-app (Frame) integration for viral sharing

## Development Notes
- Uses Neynar's hosted infrastructure to avoid managing Farcaster Hubs
- Implements security best practices for API key management
- Follows Farcaster protocol standards for social interactions
- Designed for scalability with proper webhook handling
