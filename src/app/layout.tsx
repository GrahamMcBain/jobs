import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Farcaster Jobs - Find Your Dream Job in the Farcaster Ecosystem',
  description: 'The premier job board for the Farcaster ecosystem. Connect with opportunities and talent in the decentralized social space.',
  keywords: ['Farcaster', 'Jobs', 'Web3', 'Blockchain', 'Decentralized', 'Social', 'Careers'],
  authors: [{ name: 'Farcaster Jobs' }],
  creator: 'Farcaster Jobs',
  publisher: 'Farcaster Jobs',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Farcaster Jobs - Find Your Dream Job in the Farcaster Ecosystem',
    description: 'The premier job board for the Farcaster ecosystem. Connect with opportunities and talent in the decentralized social space.',
    url: '/',
    siteName: 'Farcaster Jobs',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Farcaster Jobs',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Farcaster Jobs - Find Your Dream Job in the Farcaster Ecosystem',
    description: 'The premier job board for the Farcaster ecosystem. Connect with opportunities and talent in the decentralized social space.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
        <script 
          dangerouslySetInnerHTML={{
            __html: `
              window.onSignInSuccess = function(data) {
                console.log('Sign in success:', data);
                // Handle the successful sign-in
                window.dispatchEvent(new CustomEvent('neynar-auth-success', { detail: data }));
              };
            `
          }}
        />
      </body>
    </html>
  );
}
