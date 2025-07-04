# Farcaster Jobs Mini App

A Farcaster Mini App for posting and discovering job opportunities within the Farcaster ecosystem. Built with Next.js and integrated with Farcaster's native payment system.

## Features

### For Job Seekers
- 🔍 Browse and search job listings
- 📱 Apply directly through the mini app
- 🔗 Share interesting jobs with your network
- 🏷️ Filter by job type, location, and remote options
- ⭐ Discover featured job postings

### For Employers
- 📝 Post job listings with rich details
- 💳 Pay posting fees through Farcaster wallet integration
- ✨ Feature listings for increased visibility
- 📊 Track application counts
- 🚀 Viral sharing through Farcaster's social graph

### Mini App Features
- 🎯 Native Farcaster integration
- 💰 Seamless crypto payments (Base network)
- 📲 Optimized for mobile viewing (424x695px)
- 🔔 Push notifications for new opportunities
- 🔄 Real-time updates and interactions

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Farcaster Integration**: @farcaster/miniapp-sdk
- **Blockchain**: Wagmi for Ethereum wallet connections
- **Network**: Base (Layer 2) for low-cost transactions
- **Storage**: In-memory (easily replaceable with database)

## Getting Started

### Prerequisites

- Node.js 22.11.0 or higher
- Farcaster account for testing

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

Add your configuration:
```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEYNAR_API_KEY=your_neynar_api_key_here
```

4. Update the manifest file:
Edit `public/.well-known/farcaster.json` with your domain and signed account association.

5. Run the development server:
```bash
npm run dev
```

6. Open in Farcaster:
Use the [Mini App Debug Tool](https://farcaster.xyz/~/developers/mini-apps/debug) to preview your app.

## Mini App Structure

### Core Components

- **MiniAppProvider**: Handles SDK initialization and context
- **JobCard**: Individual job listing display
- **JobList**: Job feed with search and filtering
- **PostJobForm**: Job posting form with payment integration

### Key Features

#### Payment Integration
- Job posting fee: 0.01 ETH
- Featured listing: +0.05 ETH
- Payments processed through user's connected wallet
- Base network for low gas fees

#### Social Features
- Share jobs through Farcaster casts
- Tag mentions for viral distribution
- Profile integration showing job poster details

### API Routes

- `GET /api/jobs` - Fetch job listings with optional search/filters
- `POST /api/jobs` - Create new job posting (requires payment)
- `GET /api/jobs/[id]` - Get specific job details
- `POST /api/jobs/[id]` - Apply to job (increment counter)

## Manifest Configuration

The app includes a complete manifest at `/.well-known/farcaster.json`:

```json
{
  "miniapp": {
    "version": "1",
    "name": "Farcaster Jobs",
    "description": "Find and post jobs in the Farcaster ecosystem",
    "requiredChains": ["eip155:8453"],
    "requiredCapabilities": [
      "actions.composeCast",
      "actions.openUrl", 
      "wallet.getEthereumProvider"
    ]
  }
}
```

## Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Set environment variables
3. Deploy
4. Update manifest with production URL
5. Sign manifest with your Farcaster account

### Domain Requirements

- HTTPS required for mini apps
- Must serve manifest at `/.well-known/farcaster.json`
- Domain must match manifest configuration

## Payment Flow

1. User fills out job posting form
2. Form validates required fields
3. Payment modal opens with job posting fees
4. User confirms transaction through Farcaster wallet
5. Transaction is verified on Base network
6. Job is created and published
7. Success cast is composed automatically

## Development Notes

### Storage
Currently uses in-memory storage for simplicity. For production:
- Replace with PostgreSQL/MongoDB
- Add proper indexing for search
- Implement job expiration logic

### Security
- Validate all form inputs
- Verify payment transactions
- Implement rate limiting
- Sanitize user content

### Performance
- Optimize images for mobile
- Implement proper caching
- Use pagination for large job lists
- Minimize bundle size

## Testing

Test your mini app using Farcaster's tools:

1. **Debug Tool**: https://farcaster.xyz/~/developers/mini-apps/debug
2. **Manifest Tool**: https://farcaster.xyz/~/developers/mini-apps/manifest
3. **Preview Tool**: https://farcaster.xyz/~/developers/mini-apps/preview

## Contributing

1. Fork the repository
2. Create feature branch
3. Implement changes
4. Test in Farcaster environment
5. Submit pull request

## License

MIT License - see LICENSE file for details.

## Support

- [Farcaster Mini Apps Documentation](https://miniapps.farcaster.xyz)
- [Farcaster Developer Community](https://farcaster.xyz/~/channel/fc-devs)
- [GitHub Issues](https://github.com/GrahamMcBain/job-board/issues)
