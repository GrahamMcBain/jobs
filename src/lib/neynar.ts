import { NeynarAPIClient } from '@neynar/nodejs-sdk';

if (!process.env.NEYNAR_API_KEY) {
  throw new Error('NEYNAR_API_KEY is required');
}

export const neynarClient = new NeynarAPIClient(process.env.NEYNAR_API_KEY);

export const NEYNAR_CLIENT_ID = process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID;

if (!NEYNAR_CLIENT_ID) {
  throw new Error('NEXT_PUBLIC_NEYNAR_CLIENT_ID is required');
}

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
