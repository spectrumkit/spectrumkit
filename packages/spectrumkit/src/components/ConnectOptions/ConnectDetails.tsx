import { useContext } from 'react';
import { useWindowSize } from '../../hooks/useWindowSize';
import { isSafari } from '../../utils/browsers';
import { isSafeDeepLink } from '../../utils/isSafeDeepLink';
import type { WalletConnector } from '../../wallets/useWalletConnectors';
import { AsyncImage } from '../AsyncImage/AsyncImage';
import { Box, type BoxProps } from '../Box/Box';
import { ActionButton } from '../Button/ActionButton';
import { SpinnerIcon } from '../Icons/Spinner';
import { QRCode } from '../QRCode/QRCode';
import { I18nContext } from '../SpectrumKitProvider/I18nContext';
import { Text } from '../Text/Text';

const LOGO_SIZE: BoxProps['height'] = '44';

/**
 * The right-side pane of the connect modal once a wallet has been picked.
 * Renders the QR code (for WC-style wallets) or a "Connecting…" state (for
 * injected wallets), plus an optional WalletConnect-modal handoff button.
 *
 * The full install/onboarding sub-flow that lived in this file (Get a wallet,
 * Download, Mobile/Desktop/Extension instructions, etc.) has been removed —
 * users are expected to already have a wallet, or use the WalletConnect modal.
 */
export function ConnectDetail({
  compactModeEnabled,
  connectionError,
  onClose,
  qrCodeUri,
  reconnect,
  wallet,
}: {
  compactModeEnabled: boolean;
  connectionError: boolean;
  qrCodeUri?: string;
  reconnect: (wallet: WalletConnector) => void;
  wallet: WalletConnector;
  onClose: () => void;
}) {
  const {
    iconBackground,
    iconUrl,
    name,
    qrCode,
    ready,
    showWalletConnectModal,
    getDesktopUri,
  } = wallet;
  const isDesktopDeepLinkAvailable = !!getDesktopUri;
  const safari = isSafari();

  const { i18n } = useContext(I18nContext);

  const hasExtension = !!wallet.extensionDownloadUrl;
  const hasQrCode = qrCode && qrCodeUri;

  const onDesktopUri = async () => {
    const uri = await getDesktopUri?.();
    if (isSafeDeepLink(uri)) window.open(uri, safari ? '_blank' : '_self');
  };

  const wcModalAction = showWalletConnectModal
    ? {
        description: !compactModeEnabled
          ? i18n.t('connect.walletconnect.description.full')
          : i18n.t('connect.walletconnect.description.compact'),
        label: i18n.t('connect.walletconnect.open.label'),
        onClick: () => {
          onClose();
          showWalletConnectModal();
        },
      }
    : null;

  const { width: windowWidth } = useWindowSize();
  const smallWindow = windowWidth && windowWidth < 768;

  return (
    <Box display="flex" flexDirection="column" height="full" width="full">
      {hasQrCode ? (
        <Box
          alignItems="center"
          display="flex"
          height="full"
          justifyContent="center"
        >
          <QRCode
            logoBackground={iconBackground}
            logoSize={compactModeEnabled ? 60 : 72}
            logoUrl={iconUrl}
            size={
              compactModeEnabled
                ? 318
                : smallWindow
                  ? Math.max(280, Math.min(windowWidth - 308, 382))
                  : 382
            }
            uri={qrCodeUri}
          />
        </Box>
      ) : (
        <Box
          alignItems="center"
          display="flex"
          justifyContent="center"
          style={{ flexGrow: 1 }}
        >
          <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
            gap="8"
          >
            <Box borderRadius="10" height={LOGO_SIZE} overflow="hidden">
              <AsyncImage
                useAsImage={!wallet.isSpectrumKitConnector}
                height={LOGO_SIZE}
                src={iconUrl}
                width={LOGO_SIZE}
              />
            </Box>
            <Box
              alignItems="center"
              display="flex"
              flexDirection="column"
              gap="4"
              paddingX="32"
              style={{ textAlign: 'center' }}
            >
              <Text color="modalText" size="18" weight="bold">
                {ready
                  ? i18n.t('connect.status.opening', { wallet: name })
                  : hasExtension
                    ? i18n.t('connect.status.not_installed', { wallet: name })
                    : i18n.t('connect.status.not_available', { wallet: name })}
              </Text>
              {!ready && hasExtension ? (
                <Box paddingTop="20">
                  <ActionButton
                    href={wallet.extensionDownloadUrl}
                    label={i18n.t('connect.secondary_action.install.label')}
                    type="secondary"
                  />
                </Box>
              ) : null}
              {ready && !hasQrCode && (
                <>
                  <Box
                    alignItems="center"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                  >
                    <Text
                      color="modalTextSecondary"
                      size="14"
                      textAlign="center"
                      weight="medium"
                    >
                      {i18n.t('connect.status.confirm')}
                    </Text>
                  </Box>
                  <Box
                    alignItems="center"
                    color="modalText"
                    display="flex"
                    flexDirection="row"
                    height="32"
                    marginTop="8"
                  >
                    {connectionError ? (
                      <ActionButton
                        label={i18n.t('connect.secondary_action.retry.label')}
                        onClick={async () => {
                          if (isDesktopDeepLinkAvailable) onDesktopUri();
                          reconnect(wallet);
                        }}
                      />
                    ) : (
                      <Box color="modalTextSecondary">
                        <SpinnerIcon />
                      </Box>
                    )}
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>
      )}
      {ready && wcModalAction && (
        <Box
          alignItems="center"
          borderRadius="10"
          display="flex"
          flexDirection="row"
          gap="8"
          height="28"
          justifyContent="space-between"
          marginTop="12"
        >
          <Text color="modalTextSecondary" size="14" weight="medium">
            {wcModalAction.description}
          </Text>
          <ActionButton
            label={wcModalAction.label}
            onClick={wcModalAction.onClick}
            type="secondary"
          />
        </Box>
      )}
    </Box>
  );
}
