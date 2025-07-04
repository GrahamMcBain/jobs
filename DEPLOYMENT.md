# Farcaster Jobs Mini App - Deployment Guide

## ✅ Production Features Implemented

### ✅ Payment Processing
- Payments sent to: `0x436910fD27aae11Dd2A6e790d1420955909deC25`
- Base network integration (low transaction costs)
- 0.01 ETH base fee + 0.05 ETH for featured listings
- Real payment verification through on-chain transaction checking
- Wagmi integration for seamless wallet connection

### ✅ Database Persistence  
- PostgreSQL schema with full job management
- Graceful fallback to demo data when database unavailable
- Payment tracking and verification
- Application counting and analytics

### ✅ Image Upload System
- Company logo upload with validation
- File size limits (5MB max)
- Image preview and management
- Ready for cloud storage integration

## 🚀 Quick Deployment (Vercel)

### 1. Environment Variables
Set these in your Vercel dashboard:

```bash
# Required
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app

# Optional (for enhanced features)
NEYNAR_API_KEY=your_neynar_api_key

# Database (for production persistence)
POSTGRES_URL=your_postgres_connection_string
```

### 2. Deploy to Vercel
```bash
# Connect your GitHub repo to Vercel
# Or deploy directly:
npx vercel --prod
```

### 3. Update Manifest URLs
After deployment, update these files with your actual domain:

```json
// public/.well-known/farcaster.json
{
  "miniapp": {
    "iconUrl": "https://your-actual-domain.vercel.app/icon.png",
    "homeUrl": "https://your-actual-domain.vercel.app",
    "imageUrl": "https://your-actual-domain.vercel.app/og-image.jpg"
  }
}
```

### 4. Register Your Mini App
1. Go to: https://farcaster.xyz/~/developers/mini-apps/manifest
2. Enter your domain: `your-actual-domain.vercel.app`
3. Sign the manifest to prove ownership
4. Update your `farcaster.json` with the signed `accountAssociation`

## 🏗️ Production Setup Requirements

### Database Setup (Recommended)

**Option 1: Vercel Postgres**
```bash
# Add Vercel Postgres to your project
# Set POSTGRES_URL automatically in environment
```

**Option 2: External PostgreSQL**
```bash
# Use the schema in src/lib/db/schema.sql
# Set POSTGRES_URL environment variable
```

### Image Storage (Production)

Current implementation saves to local filesystem (development only).
For production, integrate with:

**Option 1: Vercel Blob Storage**
```bash
npm install @vercel/blob
# Update src/app/api/upload/route.ts
```

**Option 2: AWS S3**
```bash
npm install aws-sdk
# Update upload configuration
```

**Option 3: Cloudinary**
```bash
npm install cloudinary
# Update upload endpoint
```

## 💰 Payment Configuration

The app is configured to send payments to:
```
Address: 0x436910fD27aae11Dd2A6e790d1420955909deC25
Network: Base (Chain ID: 8453)
Fees: 0.01 ETH base + 0.05 ETH featured
```

### Payment Flow:
1. User fills job form
2. Wallet connection (automatic via Farcaster)
3. Transaction sent to your address
4. Payment verification on-chain
5. Job posted to database
6. Success notification + social share

## 🔧 Configuration Files

### Key Files to Update:
- `public/.well-known/farcaster.json` - Manifest with your domain
- `src/lib/config.ts` - App configuration
- `NEXT_PUBLIC_APP_URL` - Environment variable

### Images Required:
- `public/icon.png` (200x200px) - App icon & splash screen  
- `public/og-image.jpg` (1200x800px) - Social share image

## 🧪 Testing Your Deployment

### 1. Preview Tool
Test your embed: 
```
https://farcaster.xyz/~/developers/mini-apps/preview?url=YOUR_ENCODED_URL
```

### 2. Payment Testing
- Use Base testnet for testing
- Test with small amounts first
- Verify transactions appear in your wallet

### 3. Image Upload Testing
- Test company logo uploads
- Verify file size limits
- Check image preview functionality

## 📱 Features Overview

### For Job Seekers:
- Browse jobs in Farcaster ecosystem
- Search by title, company, tags
- Filter by type, location, remote
- Apply directly or visit company links
- Share interesting jobs

### For Companies:
- Post jobs with crypto payment
- Upload company logos
- Featured listing option
- Automatic social sharing
- Application tracking

### Integration Features:
- Runs inside Farcaster clients (424x695px)
- Wallet integration (Base network)
- Social sharing through casts
- Mobile-optimized interface
- Safe area handling for mobile

## 🔒 Security Notes

- All payments go directly to your specified address
- Payment verification prevents fake job postings
- Input validation and sanitization
- File upload restrictions and validation
- SQL injection protection via parameterized queries

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify environment variables are set
3. Test database connection
4. Ensure images are accessible
5. Validate manifest JSON structure

Built with ❤️ for the Farcaster ecosystem!
