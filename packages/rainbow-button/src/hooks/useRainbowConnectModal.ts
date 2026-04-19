import { useCallback } from 'react';
import { useConnectModal } from '@spectrumkit/spectrumkit';

export function useRainbowConnectModal() {
  const { openConnectModal, connectModalOpen } = useConnectModal();

  const connect = useCallback(() => {
    openConnectModal?.();
  }, [openConnectModal]);

  return {
    connect,
    connectModalOpen,
  } as const;
}
