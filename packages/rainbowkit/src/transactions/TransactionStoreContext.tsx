import React from 'react';
import type { PublicClient, TransactionReceipt } from 'viem';
import { useConnection, useBalance, usePublicClient } from 'wagmi';
import { useChainId } from '../hooks/useChainId';
import { useIsMounted } from '../components/RainbowKitProvider/useIsMounted';
import {
  type TransactionStore,
  createTransactionStore,
} from './transactionStore';

// Only allow a single instance of the store to exist at once
// so that multiple RainbowKitProvider instances can share the same store.
// We delay the creation of the store until the first time it is used
// so that it always has access to a provider.
let storeSingleton: ReturnType<typeof createTransactionStore> | undefined;

const TransactionStoreContext = React.createContext<TransactionStore | null>(
  null,
);

export function TransactionStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // usePublicClient / useConnection / useBalance all depend on wagmi's
  // Config context, which throws on SSR. Skip the real provider until
  // client-mounted; consumers fall back to the null context, which is
  // only reachable via useTransactionStore (client-only).
  const mounted = useIsMounted();
  if (!mounted) {
    return (
      <TransactionStoreContext.Provider value={null}>
        {children}
      </TransactionStoreContext.Provider>
    );
  }
  return (
    <TransactionStoreProviderClient>{children}</TransactionStoreProviderClient>
  );
}

function TransactionStoreProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const provider = usePublicClient() as PublicClient;
  const { address } = useConnection();
  const chainId = useChainId();
  const { refetch } = useBalance({
    address,
    query: {
      enabled: false,
    },
  });

  // Use existing store if it exists, or lazily create one
  const [store] = React.useState(
    () =>
      storeSingleton ?? (storeSingleton = createTransactionStore({ provider })),
  );

  const onTransactionStatus = React.useCallback(
    (txStatus: TransactionReceipt['status']) => {
      if (txStatus === 'success') refetch();
    },
    [refetch],
  );

  // Keep store provider up to date with any wagmi changes
  React.useEffect(() => {
    store.setProvider(provider);
  }, [store, provider]);

  // Wait for pending transactions whenever address or chainId changes
  React.useEffect(() => {
    if (address && chainId) {
      store.waitForPendingTransactions(address, chainId);
    }
  }, [store, address, chainId]);

  React.useEffect(() => {
    if (store && address && chainId) {
      return store.onTransactionStatus(onTransactionStatus);
    }
  }, [store, address, chainId, onTransactionStatus]);

  return (
    <TransactionStoreContext.Provider value={store}>
      {children}
    </TransactionStoreContext.Provider>
  );
}

export function useTransactionStore(): TransactionStore {
  const store = React.useContext(TransactionStoreContext);

  if (!store) {
    throw new Error('Transaction hooks must be used within RainbowKitProvider');
  }

  return store;
}
