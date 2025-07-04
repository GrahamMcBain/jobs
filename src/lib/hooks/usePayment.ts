'use client';

import { useState } from 'react';
import { useAccount, useConnect, useSendTransaction, useWriteContract } from 'wagmi';
import { parseEther, parseUnits, erc20Abi } from 'viem';
import { PAYMENT_CONFIG } from '@/lib/config';
import { PaymentToken } from '@/types';

export interface PaymentResult {
  success: boolean;
  txHash?: string;
  token?: PaymentToken;
  amount?: string;
  error?: string;
}

export function usePayment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { sendTransaction } = useSendTransaction();
  const { writeContract } = useWriteContract();

  const processPayment = async (
    token: PaymentToken,
    featured: boolean = false
  ): Promise<PaymentResult> => {
    setIsProcessing(true);
    
    try {
      // Ensure wallet is connected
      if (!isConnected) {
        if (connectors.length > 0) {
          await new Promise((resolve, reject) => {
            connect(
              { connector: connectors[0] },
              {
                onSuccess: resolve,
                onError: reject,
              }
            );
          });
        } else {
          throw new Error('No wallet connector available');
        }
      }

      const tokenConfig = PAYMENT_CONFIG.tokens[token];
      
      // Calculate total amount in token's smallest unit
      const baseAmount = BigInt(tokenConfig.jobPostingFee);
      const featuredAmount = featured ? BigInt(tokenConfig.featuredJobFee) : BigInt(0);
      const totalAmount = baseAmount + featuredAmount;

      let txHash: string;

      if (token === 'ETH') {
        // Native ETH transaction
        txHash = await new Promise<string>((resolve, reject) => {
          sendTransaction(
            {
              to: PAYMENT_CONFIG.recipientAddress as `0x${string}`,
              value: totalAmount,
            },
            {
              onSuccess: (hash) => resolve(hash),
              onError: (error) => reject(error),
            }
          );
        });
      } else {
        // ERC-20 token transaction (USDC)
        txHash = await new Promise<string>((resolve, reject) => {
          writeContract(
            {
              address: tokenConfig.address as `0x${string}`,
              abi: erc20Abi,
              functionName: 'transfer',
              args: [PAYMENT_CONFIG.recipientAddress as `0x${string}`, totalAmount],
            },
            {
              onSuccess: (hash) => resolve(hash),
              onError: (error) => reject(error),
            }
          );
        });
      }

      return {
        success: true,
        txHash,
        token,
        amount: totalAmount.toString(),
      };
    } catch (error: any) {
      console.error('Payment failed:', error);
      return {
        success: false,
        error: error.message || 'Payment failed',
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyPayment = async (txHash: string, token: PaymentToken, expectedAmount: string): Promise<boolean> => {
    try {
      // Call your API to verify the transaction on-chain
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ txHash, token, expectedAmount }),
      });

      const data = await response.json();
      return data.verified === true;
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  };

  const calculateTotalAmount = (token: PaymentToken, featured: boolean = false): string => {
    const tokenConfig = PAYMENT_CONFIG.tokens[token];
    const baseAmount = BigInt(tokenConfig.jobPostingFee);
    const featuredAmount = featured ? BigInt(tokenConfig.featuredJobFee) : BigInt(0);
    return (baseAmount + featuredAmount).toString();
  };

  const getTokenPricing = (token: PaymentToken) => {
    return PAYMENT_CONFIG.tokens[token].priceDisplay;
  };

  return {
    processPayment,
    verifyPayment,
    calculateTotalAmount,
    getTokenPricing,
    isProcessing,
    isConnected,
    address,
  };
}
