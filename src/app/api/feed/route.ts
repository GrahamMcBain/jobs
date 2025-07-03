import { NextRequest, NextResponse } from 'next/server';
import { neynarClient } from '@/lib/neynar';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const feedType = searchParams.get('feedType') || 'filter';
    const filterType = searchParams.get('filterType') || 'global_trending';
    const limit = parseInt(searchParams.get('limit') || '25');
    const cursor = searchParams.get('cursor');
    const fid = searchParams.get('fid');
    const channelId = searchParams.get('channelId');

    let feedResponse;

    if (feedType === 'following' && fid) {
      // Get personalized feed for authenticated user
      feedResponse = await neynarClient.fetchFeedForYou(parseInt(fid), {
        limit,
        cursor,
      });
    } else if (channelId) {
      // Get feed for specific channel
      feedResponse = await neynarClient.fetchFeed(feedType as any, {
        filterType: 'channel_id' as any,
        channelId,
        limit,
        cursor,
      });
    } else {
      // Get trending/global feed
      feedResponse = await neynarClient.fetchFeed(feedType as any, {
        filterType: filterType as any,
        limit,
        cursor,
      });
    }

    // Transform the feed data to match our interface
    const transformedCasts = feedResponse.casts.map((cast: any) => ({
      hash: cast.hash,
      parentHash: cast.parent_hash,
      parentUrl: cast.parent_url,
      threadHash: cast.thread_hash,
      author: {
        fid: cast.author.fid,
        username: cast.author.username,
        displayName: cast.author.display_name,
        pfp: {
          url: cast.author.pfp_url,
        },
        profile: {
          bio: {
            text: cast.author.profile?.bio?.text || '',
          },
        },
        followerCount: cast.author.follower_count,
        followingCount: cast.author.following_count,
        verifications: cast.author.verifications || [],
        activeStatus: cast.author.active_status,
      },
      text: cast.text,
      timestamp: cast.timestamp,
      embeds: cast.embeds || [],
      frames: cast.frames || [],
      reactions: {
        likes: cast.reactions?.likes || [],
        recasts: cast.reactions?.recasts || [],
        likesCount: cast.reactions?.likes_count || 0,
        recastsCount: cast.reactions?.recasts_count || 0,
      },
      replies: {
        count: cast.replies?.count || 0,
      },
      channel: cast.channel || null,
      mentioned_profiles: cast.mentioned_profiles || [],
      viewerContext: cast.viewer_context || null,
    }));

    return NextResponse.json({
      casts: transformedCasts,
      next: feedResponse.next,
    });
  } catch (error) {
    console.error('Error fetching feed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feed' },
      { status: 500 }
    );
  }
}
