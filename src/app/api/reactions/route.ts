import { NextRequest, NextResponse } from 'next/server';
import { neynarClient } from '@/lib/neynar';

export async function POST(request: NextRequest) {
  try {
    const { signerUuid, reactionType, targetHash } = await request.json();
    
    if (!signerUuid || !reactionType || !targetHash) {
      return NextResponse.json(
        { error: 'Signer UUID, reaction type, and target hash are required' },
        { status: 400 }
      );
    }

    if (!['like', 'recast'].includes(reactionType)) {
      return NextResponse.json(
        { error: 'Reaction type must be "like" or "recast"' },
        { status: 400 }
      );
    }

    // Publish the reaction
    const response = await neynarClient.publishReaction(
      signerUuid,
      reactionType,
      targetHash
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error publishing reaction:', error);
    return NextResponse.json(
      { error: 'Failed to publish reaction' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const signerUuid = searchParams.get('signerUuid');
    const reactionType = searchParams.get('reactionType');
    const targetHash = searchParams.get('targetHash');
    
    if (!signerUuid || !reactionType || !targetHash) {
      return NextResponse.json(
        { error: 'Signer UUID, reaction type, and target hash are required' },
        { status: 400 }
      );
    }

    if (!['like', 'recast'].includes(reactionType)) {
      return NextResponse.json(
        { error: 'Reaction type must be "like" or "recast"' },
        { status: 400 }
      );
    }

    // Delete the reaction
    await neynarClient.deleteReaction(
      signerUuid,
      reactionType,
      targetHash
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reaction:', error);
    return NextResponse.json(
      { error: 'Failed to delete reaction' },
      { status: 500 }
    );
  }
}
