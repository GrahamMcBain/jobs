import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MINIAPP_CONFIG } from '@/lib/config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: MINIAPP_CONFIG.name,
  description: MINIAPP_CONFIG.description,
  openGraph: {
    title: MINIAPP_CONFIG.name,
    description: MINIAPP_CONFIG.description,
    images: ['/og-image.png'],
  },
  other: {
    // Mini app embed metadata
    'fc:miniapp': JSON.stringify({
      version: "1",
      imageUrl: `${MINIAPP_CONFIG.homeUrl}/og-image.png`,
      button: {
        title: "Browse Jobs",
        action: {
          type: "launch_miniapp",
          name: MINIAPP_CONFIG.name,
          url: MINIAPP_CONFIG.homeUrl,
          splashImageUrl: `${MINIAPP_CONFIG.homeUrl}/icon.png`,
          splashBackgroundColor: "#7c3aed"
        }
      }
    })
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
        <div className="miniapp-container">
          {children}
        </div>
      </body>
    </html>
  );
}
