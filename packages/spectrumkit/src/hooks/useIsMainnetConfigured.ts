import { mainnet } from 'wagmi/chains';
import { useSpectrumKitChains } from '../components/SpectrumKitProvider/SpectrumKitChainContext';

export function useIsMainnetConfigured() {
  const spectrumKitChains = useSpectrumKitChains();

  const chainId = mainnet.id;

  const configured = spectrumKitChains.some(
    (spectrumKitChain) => spectrumKitChain.id === chainId,
  );

  return configured;
}
