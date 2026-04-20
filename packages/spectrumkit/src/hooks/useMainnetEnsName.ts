import type { Address } from 'viem';
import { useEnsName } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { useIsMainnetConfigured } from './useIsMainnetConfigured';

export function useMainnetEnsName(address?: Address) {
  const mainnetConfigured = useIsMainnetConfigured();

  const { data: ensName } = useEnsName({
    chainId: mainnet.id,
    address,
    query: {
      enabled: mainnetConfigured,
    },
  });

  return ensName;
}
