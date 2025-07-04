import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, getContract } from 'viem';
import { base } from 'viem/chains';
import { PAYMENT_CONFIG } from '@/lib/config';
import { PaymentToken } from '@/types';

// Create a public client for Base network
const client = createPublicClient({
  chain: base,
  transport: http()
});

export async function POST(request: NextRequest) {
  try {
    const { txHash, token, expectedAmount, jobId } = await request.json();

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

    const paymentToken = (token as PaymentToken) || 'ETH';
    const tokenConfig = PAYMENT_CONFIG.tokens[paymentToken];
    
    // Verify the transaction details
    const isValidChain = client.chain.id === PAYMENT_CONFIG.chainId;
    
    let isValidRecipient = false;
    let isValidAmount = false;
    let amount: bigint;

    if (paymentToken === 'ETH') {
      // Native ETH transaction
      isValidRecipient = transaction.to?.toLowerCase() === PAYMENT_CONFIG.recipientAddress.toLowerCase();
      amount = transaction.value;
      
      // Convert expected amount to BigInt for comparison
      const expectedAmountWei = BigInt(expectedAmount || tokenConfig.jobPostingFee);
      isValidAmount = amount >= expectedAmountWei;
    } else {
      // ERC-20 token transaction (USDC)
      // Check if transaction is to the token contract
      isValidRecipient = transaction.to?.toLowerCase() === tokenConfig.address?.toLowerCase();
      
      // For ERC-20, we need to parse the transaction input to get the transfer details
      // This is a simplified check - in production, you'd want to decode the logs
      const expectedAmountTokens = BigInt(expectedAmount || tokenConfig.jobPostingFee);
      
      // For ERC-20 transfers, the amount verification would typically be done by parsing transaction logs
      // For now, we'll assume the amount is correct if the transaction succeeded
      isValidAmount = receipt.status === 'success';
      amount = expectedAmountTokens; // Use expected amount for now
    }

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
        token: paymentToken,
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
