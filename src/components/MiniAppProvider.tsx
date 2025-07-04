'use client';

import { useEffect, useState, ReactNode } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '@/lib/wagmi';
import type { MiniAppContext as MiniAppContextType } from '@/types';

interface MiniAppProviderProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

export function MiniAppProvider({ children }: MiniAppProviderProps) {
  const [context, setContext] = useState<MiniAppContextType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeMiniApp() {
      try {
        // Check if we're in a mini app environment
        const isInMiniApp = await sdk.isInMiniApp();
        
        if (!isInMiniApp) {
          // Running in browser - show preview mode
          setContext({
            user: {
              fid: 12345,
              username: 'preview',
              displayName: 'Preview User',
              pfpUrl: '/preview-avatar.png'
            },
            location: {
              type: 'launcher'
            },
            client: {
              clientFid: 9152,
              added: false
            }
          });
          setIsLoading(false);
          return;
        }

        // We're in a mini app - get real context
        const miniAppContext = await sdk.context;
        setContext(miniAppContext as MiniAppContextType);

        // Apply safe area insets if available
        if (miniAppContext.client.safeAreaInsets) {
          const { top, bottom, left, right } = miniAppContext.client.safeAreaInsets;
          document.documentElement.style.setProperty('--safe-area-inset-top', `${top}px`);
          document.documentElement.style.setProperty('--safe-area-inset-bottom', `${bottom}px`);
          document.documentElement.style.setProperty('--safe-area-inset-left', `${left}px`);
          document.documentElement.style.setProperty('--safe-area-inset-right', `${right}px`);
        }

        // Notify that the app is ready
        await sdk.actions.ready();

      } catch (err) {
        console.error('Failed to initialize mini app:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize');
      } finally {
        setIsLoading(false);
      }
    }

    initializeMiniApp();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-purple-600">
        <div className="text-center text-white">
          <div className="spinner mx-auto mb-4"></div>
          <div className="text-lg font-semibold">{MINIAPP_CONFIG.name}</div>
          <div className="text-sm opacity-80">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="text-center text-red-600">
          <div className="text-lg font-semibold mb-2">Error</div>
          <div className="text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <MiniAppContext.Provider value={context}>
          {children}
        </MiniAppContext.Provider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

// Context for consuming mini app data
import { createContext, useContext } from 'react';
import { MINIAPP_CONFIG } from '@/lib/config';

const MiniAppContext = createContext<MiniAppContextType | null>(null);

export function useMiniApp() {
  const context = useContext(MiniAppContext);
  if (!context) {
    throw new Error('useMiniApp must be used within MiniAppProvider');
  }
  return context;
}
