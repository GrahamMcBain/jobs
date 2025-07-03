# Farcaster Job Board

A Next.js application that integrates with Farcaster using Neynar's SDK to create a job board platform on the Farcaster protocol.

## Features

- **Farcaster Authentication**: Sign in with Neynar (SIWN) for seamless user onboarding
- **Personalized Feed**: View and interact with Farcaster casts related to jobs and opportunities
- **Job Posting**: Post job opportunities directly to the Farcaster network
- **Real-time Interactions**: Like, recast, and comment on job-related casts
- **Cast Composition**: Create new casts to share job opportunities
- **User Profiles**: Display Farcaster user information and social proof
- **Job Discovery**: Browse and search for job opportunities in the ecosystem

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Neynar Node.js SDK
- **Authentication**: Neynar Sign-In (SIWN)
- **Social Integration**: Neynar React SDK, Farcaster Protocol
- **Styling**: Tailwind CSS, Heroicons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Neynar API Key and Client ID

### Installation

1. Clone the repository:
```bash
git clone https://github.com/GrahamMcBain/job-board.git
cd job-board
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your Neynar credentials:
```env
NEYNAR_API_KEY=your_neynar_api_key_here
NEXT_PUBLIC_NEYNAR_CLIENT_ID=your_neynar_client_id_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEYNAR_API_KEY` | Server-side API key for Neynar | Yes |
| `NEXT_PUBLIC_NEYNAR_CLIENT_ID` | Client-side ID for Neynar authentication | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL for webhooks and redirects | No |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── casts/         # Cast management
│   │   ├── feed/          # Feed data
│   │   ├── reactions/     # Like/recast handling
│   │   └── webhooks/      # Webhook endpoints
│   ├── feed/              # Feed page
│   ├── jobs/              # Job listings page
│   ├── post-job/          # Job posting page
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── compose/           # Cast composition
│   ├── feed/              # Feed components
│   └── layout/            # Layout components
├── contexts/              # React contexts
├── lib/                   # Utility functions
└── types/                 # TypeScript types
```

## API Routes

- `POST /api/auth/user` - Fetch user data after authentication
- `GET /api/feed` - Get Farcaster feed with filters
- `POST /api/casts` - Publish new casts
- `DELETE /api/casts` - Delete casts
- `POST /api/reactions` - Add reactions (like/recast)
- `DELETE /api/reactions` - Remove reactions
- `POST /api/webhooks/neynar` - Handle Neynar webhooks

## Key Features Implementation

### Authentication with SIWN
The app uses Neynar's Sign-In with Neynar (SIWN) for authentication, which covers gas fees for new users and provides a seamless onboarding experience.

### Feed Integration
Leverages Neynar's Feed API to display personalized content, trending casts, and job-specific feeds from the Farcaster network.

### Real-time Interactions
Implements like, recast, and comment functionality using Neynar's reaction APIs with optimistic UI updates.

### Cast Composition
Allows users to compose and publish new casts directly to Farcaster, with support for mentions, embeds, and replies.

### Webhook Support
Includes webhook endpoints for real-time event processing, enabling features like live notifications and feed updates.

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

## Deployment

The application can be deployed on platforms like Vercel, Netlify, or any Node.js hosting service.

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables in the Vercel dashboard
3. Deploy automatically on push to main branch

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Neynar](https://neynar.com) for providing the Farcaster infrastructure and SDKs
- [Farcaster](https://farcaster.xyz) for the decentralized social protocol
- The Farcaster community for inspiration and support

## Support

For support, please open an issue on GitHub or reach out on Farcaster [@yourusername](https://warpcast.com/yourusername).
