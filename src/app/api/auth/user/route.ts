import { NextRequest, NextResponse } from 'next/server';
import { neynarClient } from '@/lib/neynar';

export async function POST(request: NextRequest) {
  try {
    const { signerUuid } = await request.json();
    
    if (!signerUuid) {
      return NextResponse.json(
        { error: 'Signer UUID is required' },
        { status: 400 }
      );
    }

    // Get signer details from Neynar
    const signerResponse = await neynarClient.lookupSigner(signerUuid);
    
    if (!signerResponse.fid) {
      return NextResponse.json(
        { error: 'Invalid signer' },
        { status: 400 }
      );
    }

    // Get user details using the FID
    const userResponse = await neynarClient.fetchBulkUsers([signerResponse.fid]);
    
    if (!userResponse.users || userResponse.users.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResponse.users[0];
    
    // Transform the user data to match our interface
    const transformedUser = {
      fid: user.fid,
      username: user.username,
      displayName: user.display_name,
      pfp: {
        url: user.pfp_url,
      },
      profile: {
        bio: {
          text: user.profile.bio.text,
        },
      },
      followerCount: user.follower_count,
      followingCount: user.following_count,
      verifications: user.verifications,
      activeStatus: user.active_status,
    };

    return NextResponse.json({ user: transformedUser });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}
