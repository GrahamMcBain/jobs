# 💰 Multi-Token Payment System Guide

Your Farcaster Jobs Mini App now supports both **ETH** and **USDC** payments! This gives users flexibility and potentially increases conversions.

## 🪙 Supported Payment Tokens

### **ETH (Ethereum)**
- **Job Posting**: 0.01 ETH (~$25)
- **Featured Listing**: +0.05 ETH (~$125)
- **Network**: Base (low gas fees)
- **Type**: Native token

### **USDC (USD Coin)**
- **Job Posting**: $25 USDC
- **Featured Listing**: +$125 USDC  
- **Network**: Base
- **Address**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **Type**: ERC-20 token

## 🎯 How It Works

### **User Experience**
1. User fills out job posting form
2. **Token selection** - Choose between ETH or USDC
3. **Price display** - Shows cost in selected token
4. **Payment processing** - Different flows for ETH vs USDC
5. **Verification** - On-chain verification for both token types

### **Payment Flows**

#### **ETH Payments**
```typescript
// Native ETH transfer
sendTransaction({
  to: "0x436910fD27aae11Dd2A6e790d1420955909deC25",
  value: totalAmount // in wei
})
```

#### **USDC Payments**
```typescript
// ERC-20 token transfer
writeContract({
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC
  abi: erc20Abi,
  functionName: 'transfer',
  args: [recipientAddress, totalAmount] // in USDC units (6 decimals)
})
```

## 🔧 Technical Implementation

### **Configuration**
```typescript
// src/lib/config.ts
export const PAYMENT_CONFIG = {
  chainId: 8453, // Base
  recipientAddress: "0x436910fD27aae11Dd2A6e790d1420955909deC25",
  tokens: {
    ETH: {
      address: null, // Native token
      symbol: "ETH",
      decimals: 18,
      jobPostingFee: "10000000000000000", // 0.01 ETH in wei
      featuredJobFee: "50000000000000000"  // 0.05 ETH in wei
    },
    USDC: {
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      symbol: "USDC", 
      decimals: 6,
      jobPostingFee: "25000000",  // $25 USDC (6 decimals)
      featuredJobFee: "125000000" // $125 USDC (6 decimals)
    }
  }
}
```

### **Database Schema**
```sql
-- Added payment_token field to jobs table
ALTER TABLE jobs ADD COLUMN payment_token VARCHAR(10) DEFAULT 'ETH' 
CHECK (payment_token IN ('ETH', 'USDC'));
```

### **Payment Verification**
The system verifies payments differently based on token type:

**ETH Verification:**
- Checks `transaction.to` matches recipient
- Verifies `transaction.value` meets minimum amount
- Direct value comparison

**USDC Verification:**
- Checks `transaction.to` matches USDC contract
- Verifies transaction success (simplified)
- In production: Parse transaction logs for transfer details

## 💡 Benefits for Users

### **ETH Payments**
- ✅ Familiar to crypto users
- ✅ No token approval needed
- ✅ Direct value transfer
- ✅ Price fluctuates with ETH

### **USDC Payments**  
- ✅ Stable $25/$125 pricing
- ✅ Familiar to traditional users
- ✅ No price volatility
- ✅ Easy accounting

## 🚀 Deployment Steps

### 1. **Update Supabase Schema**
Run this in your Supabase SQL Editor:

```sql
-- Add payment_token column
ALTER TABLE jobs ADD COLUMN payment_token VARCHAR(10) DEFAULT 'ETH' 
CHECK (payment_token IN ('ETH', 'USDC'));

-- Update payment_transactions table  
ALTER TABLE payment_transactions 
ALTER COLUMN currency DROP DEFAULT,
ADD CONSTRAINT check_currency CHECK (currency IN ('ETH', 'USDC'));
```

### 2. **Deploy to Production**
Your existing deployment process remains the same. The multi-token support is backwards compatible.

### 3. **Test Both Payment Types**
- Test ETH payments with small amounts
- Test USDC payments (ensure wallet has USDC on Base)
- Verify payment verification works for both

## 📊 Analytics & Tracking

Track payment preferences in your database:

```sql
-- Payment token usage
SELECT 
  payment_token,
  COUNT(*) as job_count,
  SUM(CASE WHEN featured THEN 1 ELSE 0 END) as featured_count
FROM jobs 
WHERE payment_verified = true
GROUP BY payment_token;
```

## 🔮 Future Enhancements

### **Additional Tokens**
Easy to add more tokens:

```typescript
// Add to PAYMENT_CONFIG.tokens
DAI: {
  address: "0x...", // DAI on Base
  symbol: "DAI",
  decimals: 18,
  jobPostingFee: "25000000000000000000", // $25 DAI
  featuredJobFee: "125000000000000000000" // $125 DAI
}
```

### **Dynamic Pricing**
Implement oracle-based pricing:
- Keep USDC at fixed $25/$125
- Adjust ETH amount based on current price
- Update pricing via API or on-chain oracle

### **Payment Subscriptions**
For high-volume recruiters:
- Monthly unlimited posting plans
- Bulk payment discounts
- Subscription management

## 🎯 Business Impact

### **User Acquisition**
- **Stablecoin users**: Attract users who prefer predictable costs
- **ETH holders**: Serve existing crypto community
- **Traditional businesses**: USDC feels more familiar

### **Revenue Optimization**
- **Price stability**: USDC ensures consistent revenue
- **Market expansion**: Reach broader audience
- **Conversion rates**: Users can choose preferred payment method

Your Farcaster Jobs Mini App now offers the flexibility users want while maintaining your target pricing! 🎉
