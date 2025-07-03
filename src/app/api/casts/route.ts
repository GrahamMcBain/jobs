import { NextRequest, NextResponse } from 'next/server';
import { neynarClient } from '@/lib/neynar';

export async function POST(request: NextRequest) {
  try {
    const { text, signerUuid, parentHash, parentUrl, embeds, mentions } = await request.json();
    
    if (!signerUuid) {
      return NextResponse.json(
        { error: 'Signer UUID is required' },
        { status: 400 }
      );
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Cast text is required' },
        { status: 400 }
      );
    }

    // Prepare the cast data
    const castData: any = {
      signerUuid,
      text: text.trim(),
    };

    // Add parent if replying to a cast
    if (parentHash) {
      castData.parent = parentHash;
    } else if (parentUrl) {
      castData.parent = parentUrl;
    }

    // Add embeds if provided
    if (embeds && embeds.length > 0) {
      castData.embeds = embeds;
    }

    // Add mentions if provided
    if (mentions && mentions.length > 0) {
      castData.mentions = mentions;
    }

    // Publish the cast
    const response = await neynarClient.publishCast(castData);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error publishing cast:', error);
    return NextResponse.json(
      { error: 'Failed to publish cast' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const castHash = searchParams.get('hash');
    const signerUuid = searchParams.get('signerUuid');
    
    if (!castHash || !signerUuid) {
      return NextResponse.json(
        { error: 'Cast hash and signer UUID are required' },
        { status: 400 }
      );
    }

    // Delete the cast
    await neynarClient.deleteCast(signerUuid, castHash);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting cast:', error);
    return NextResponse.json(
      { error: 'Failed to delete cast' },
      { status: 500 }
    );
  }
}
