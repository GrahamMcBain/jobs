import { NextRequest, NextResponse } from 'next/server';
import { neynarClient } from '@/lib/neynar';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    console.log('Webhook received:', { type, data });

    // Handle different webhook events
    switch (type) {
      case 'cast.created':
        await handleCastCreated(data);
        break;
      case 'reaction.created':
        await handleReactionCreated(data);
        break;
      case 'follow.created':
        await handleFollowCreated(data);
        break;
      case 'user.updated':
        await handleUserUpdated(data);
        break;
      default:
        console.log('Unhandled webhook type:', type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCastCreated(data: any) {
  console.log('New cast created:', data);
  
  // Example: Check if cast mentions job-related keywords
  const jobKeywords = ['hiring', 'job', 'position', 'opportunity', 'work', 'career'];
  const text = data.text?.toLowerCase() || '';
  
  if (jobKeywords.some(keyword => text.includes(keyword))) {
    console.log('Job-related cast detected:', data.hash);
    
    // TODO: Add to job feed, send notifications, etc.
    // You could store this in a database, trigger notifications, etc.
  }
}

async function handleReactionCreated(data: any) {
  console.log('New reaction created:', data);
  
  // TODO: Update cast reaction counts in real-time
  // You could use WebSockets, Server-Sent Events, or other real-time methods
}

async function handleFollowCreated(data: any) {
  console.log('New follow created:', data);
  
  // TODO: Update follower counts, send notifications
}

async function handleUserUpdated(data: any) {
  console.log('User updated:', data);
  
  // TODO: Update user profiles in cache/database
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
}
