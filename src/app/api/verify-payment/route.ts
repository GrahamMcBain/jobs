import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { PAYMENT_CONFIG } from '@/lib/config';

// Create a public client for Base network
const client = createPublicClient({
  chain: base,
  transport: http()
});

export async function POST(request: NextRequest) {
  try {
    const { txHash, expectedAmount, jobId } = await request.json();

    if (!txHash) {
      return NextResponse.json(
        { error: 'Transaction hash required' },
        { status: 400 }
      );
    }

    // Get transaction details
    const transaction = await client.getTransaction({
      hash: txHash as `0x${string}`,
    });

    if (!transaction) {
      return NextResponse.json(
        { verified: false, error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Get transaction receipt to check if it was successful
    const receipt = await client.getTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

    if (!receipt || receipt.status !== 'success') {
      return NextResponse.json(
        { verified: false, error: 'Transaction failed' },
        { status: 400 }
      );
    }

    // Verify the transaction details
    const isValidRecipient = transaction.to?.toLowerCase() === PAYMENT_CONFIG.recipientAddress.toLowerCase();
    const isValidChain = client.chain.id === PAYMENT_CONFIG.chainId;
    const amount = transaction.value;

    // Convert expected amount to BigInt for comparison
    const expectedAmountWei = BigInt(expectedAmount || PAYMENT_CONFIG.jobPostingFee);
    const isValidAmount = amount >= expectedAmountWei;

    const verified = isValidRecipient && isValidChain && isValidAmount;

    if (verified && jobId) {
      // TODO: Update job in database to mark payment as verified
      // await db.verifyPayment(txHash, jobId);
    }

    return NextResponse.json({
      verified,
      transaction: {
        hash: txHash,
        from: transaction.from,
        to: transaction.to,
        value: amount.toString(),
        chainId: client.chain.id,
        blockNumber: Number(receipt.blockNumber),
      },
      checks: {
        validRecipient: isValidRecipient,
        validChain: isValidChain,
        validAmount: isValidAmount,
      }
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { 
        verified: false, 
        error: error.message || 'Verification failed' 
      },
      { status: 500 }
    );
  }
}
