'use client';

import { useState } from 'react';
import { useAccount, useConnect, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { PAYMENT_CONFIG } from '@/lib/config';

export interface PaymentResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export function usePayment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { sendTransaction } = useSendTransaction();

  const processPayment = async (
    amount: string, // Amount in ETH (e.g., "0.01")
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

      // Calculate total amount
      const baseAmount = parseEther(amount);
      const featuredAmount = featured ? parseEther("0.05") : BigInt(0);
      const totalAmount = baseAmount + featuredAmount;

      // Send transaction
      const txHash = await new Promise<string>((resolve, reject) => {
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

      return {
        success: true,
        txHash,
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

  const verifyPayment = async (txHash: string): Promise<boolean> => {
    try {
      // Call your API to verify the transaction on-chain
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ txHash }),
      });

      const data = await response.json();
      return data.verified === true;
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  };

  return {
    processPayment,
    verifyPayment,
    isProcessing,
    isConnected,
    address,
  };
}
