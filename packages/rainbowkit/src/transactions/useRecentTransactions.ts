import { useCallback, useSyncExternalStore } from 'react';
import { useConnection } from 'wagmi';
import { useChainId } from '../hooks/useChainId';
import { useTransactionStore } from './TransactionStoreContext';
import type { Transaction } from './transactionStore';

const EMPTY: Transaction[] = [];

export function useRecentTransactions(): Transaction[] {
  const store = useTransactionStore();
  const { address } = useConnection();
  const chainId = useChainId();

  const subscribe = useCallback(
    (onChange: () => void) => (store ? store.onChange(onChange) : () => {}),
    [store],
  );

  const getSnapshot = useCallback(
    () =>
      store && address && chainId
        ? store.getTransactions(address, chainId)
        : EMPTY,
    [store, address, chainId],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}
