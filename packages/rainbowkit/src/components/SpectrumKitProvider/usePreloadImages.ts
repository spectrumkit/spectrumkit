import { useCallback, useEffect } from 'react';
import { isMobile } from '../../utils/isMobile';
import { isNotNullish } from '../../utils/isNotNullish';
import { useWalletConnectors } from '../../wallets/useWalletConnectors';
import { loadImages } from '../AsyncImage/useAsyncImage';
import { preloadAssetsIcon } from '../Icons/Assets';
import { preloadLoginIcon } from '../Icons/Login';
import { useAuthenticationStatus } from '../SpectrumKitProvider/AuthenticationContext';
import { signInIcon } from './../SignIn/SignIn';
import { useSpectrumKitChains } from './SpectrumKitChainContext';

export function usePreloadImages() {
  const spectrumKitChains = useSpectrumKitChains();
  const walletConnectors = useWalletConnectors();
  const isUnauthenticated = useAuthenticationStatus() === 'unauthenticated';

  const preloadImages = useCallback(() => {
    loadImages(
      ...walletConnectors.map((wallet) => wallet.iconUrl),
      ...spectrumKitChains.map((chain) => chain.iconUrl).filter(isNotNullish),
    );

    // Preload illustrations used on desktop
    if (!isMobile()) {
      preloadAssetsIcon();
      preloadLoginIcon();
    }

    if (isUnauthenticated) {
      loadImages(signInIcon);
    }
  }, [walletConnectors, spectrumKitChains, isUnauthenticated]);

  useEffect(() => {
    preloadImages();
  }, [preloadImages]);
}
