import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { touchableStyles } from '../../css/touchableStyles';
import { isSafari } from '../../utils/browsers';
import { groupBy } from '../../utils/groupBy';
import {
  type WalletConnector,
  useWalletConnectors,
} from '../../wallets/useWalletConnectors';
import { addLatestWalletId } from '../../wallets/latestWalletId';
import { Box } from '../Box/Box';
import { CloseButton } from '../CloseButton/CloseButton';
import { DisclaimerLink } from '../Disclaimer/DisclaimerLink';
import { DisclaimerText } from '../Disclaimer/DisclaimerText';
import { BackIcon } from '../Icons/Back';
import { ModalSelection } from '../ModalSelection/ModalSelection';
import { AppContext } from '../SpectrumKitProvider/AppContext';
import { I18nContext } from '../SpectrumKitProvider/I18nContext';
import {
  ModalSizeContext,
  ModalSizeOptions,
} from '../SpectrumKitProvider/ModalSizeContext';
import { WalletButtonContext } from '../SpectrumKitProvider/WalletButtonContext';
import { Text } from '../Text/Text';
import { ConnectDetail } from './ConnectDetails';
import {
  ScrollClassName,
  sidebar,
  sidebarCompactMode,
} from './DesktopOptions.css';

export enum WalletStep {
  None = 'NONE',
  Connect = 'CONNECT',
}

export function DesktopOptions({ onClose }: { onClose: () => void }) {
  const titleId = 'rk_connect_title';
  const [selectedOptionId, setSelectedOptionId] = useState<
    string | undefined
  >();
  const [selectedWallet, setSelectedWallet] = useState<WalletConnector>();
  const [qrCodeUri, setQrCodeUri] = useState<string>();
  const [connectionError, setConnectionError] = useState(false);
  const [walletStep, setWalletStep] = useState<WalletStep>(WalletStep.None);

  const modalSize = useContext(ModalSizeContext);
  const compactModeEnabled = modalSize === ModalSizeOptions.COMPACT;
  const { disclaimer: Disclaimer } = useContext(AppContext);
  const { i18n } = useContext(I18nContext);
  const safari = isSafari();

  const initialized = useRef(false);
  const { connector } = useContext(WalletButtonContext);

  // The `WalletButton` component made the connect modal appear empty when
  // trying to connect, due to a mix-up between EIP-6963 and SpectrumKit
  // connectors. `WalletButton` uses SpectrumKit's id, but EIP-6963 uses `rdns`.
  // We don't merge EIP-6963 and SpectrumKit connectors when the user is going
  // through the WalletButton flow.
  const mergeEIP6963WithRkConnectors = !connector;

  const wallets = useWalletConnectors(mergeEIP6963WithRkConnectors)
    .filter((wallet) => wallet.ready || !!wallet.extensionDownloadUrl)
    .sort((a, b) => a.groupIndex - b.groupIndex);

  const groupedWallets = groupBy(wallets, (wallet) => wallet.groupName);

  const supportedI18nGroupNames = [
    'Recommended',
    'Other',
    'Popular',
    'More',
    'Others',
    'Installed',
  ];

  // biome-ignore lint/correctness/useExhaustiveDependencies: only react to step transitions
  useEffect(() => {
    setConnectionError(false);
  }, [walletStep, selectedWallet]);

  // Auto-advance to Connect step when invoked via the WalletButton API.
  // biome-ignore lint/correctness/useExhaustiveDependencies: run once when connector is first provided (guarded by initialized ref)
  useEffect(() => {
    if (connector && !initialized.current) {
      setWalletStep(WalletStep.Connect);
      selectWallet(connector);
      initialized.current = true;
    }
  }, [connector]);

  const connectToWallet = (wallet: WalletConnector) => {
    setConnectionError(false);
    if (wallet.ready) {
      wallet?.connect?.()?.catch(() => setConnectionError(true));
    }
  };

  const onDesktopUri = async (wallet: WalletConnector) => {
    const sWallet = wallets.find((w) => wallet.id === w.id);
    if (!sWallet?.getDesktopUri) return;
    setTimeout(async () => {
      const uri = await sWallet?.getDesktopUri?.();
      if (uri) window.open(uri, safari ? '_blank' : '_self');
    }, 0);
  };

  const onQrCode = async (wallet: WalletConnector) => {
    const sWallet = wallets.find((w) => wallet.id === w.id);
    const uri = await sWallet?.getQrCodeUri?.();
    setQrCodeUri(uri);
    // The brief delay prevents a UI flash when connection is instant.
    setTimeout(
      () => {
        setSelectedWallet(sWallet);
        setWalletStep(WalletStep.Connect);
      },
      uri ? 0 : 50,
    );
  };

  const selectWallet = async (wallet: WalletConnector) => {
    // Track latest wallet id for the WalletButton "connected" badge.
    addLatestWalletId(wallet.id);
    if (wallet.ready) {
      onQrCode(wallet);
      onDesktopUri(wallet);
    } else {
      // Not installed (and not WC-connectable): just show the Connect pane
      // with the "not installed" copy + extension install link.
      setSelectedWallet(wallet);
      setWalletStep(WalletStep.Connect);
    }
    connectToWallet(wallet);
    setSelectedOptionId(wallet.id);
  };

  const clearSelectedWallet = () => {
    setSelectedOptionId(undefined);
    setSelectedWallet(undefined);
    setQrCodeUri(undefined);
    setWalletStep(WalletStep.None);
  };

  const hasQrCode = !!selectedWallet?.qrCode && qrCodeUri;
  const showSidebar = !compactModeEnabled || walletStep === WalletStep.None;
  const showDetail = !compactModeEnabled || walletStep !== WalletStep.None;

  const headerLabel =
    walletStep === WalletStep.Connect && selectedWallet && hasQrCode
      ? selectedWallet.name === 'WalletConnect'
        ? i18n.t('connect_scan.fallback_title')
        : i18n.t('connect_scan.title', { wallet: selectedWallet.name })
      : null;

  // In compact mode, the back button on the Connect pane returns to the wallet
  // list. In wide mode the list is always visible so no back button needed.
  const showBackButton =
    compactModeEnabled && walletStep === WalletStep.Connect && !connector;

  return (
    <Box
      display="flex"
      flexDirection="row"
      style={{ maxHeight: compactModeEnabled ? 468 : 504 }}
    >
      {showSidebar && (
        <Box
          className={compactModeEnabled ? sidebarCompactMode : sidebar}
          display="flex"
          flexDirection="column"
          marginTop="16"
        >
          <Box display="flex" justifyContent="space-between">
            <Box
              marginLeft={compactModeEnabled ? '16' : '6'}
              paddingBottom="8"
              paddingTop="2"
              paddingX="18"
            >
              <Text
                as="h1"
                color="modalText"
                id={titleId}
                size="18"
                weight="heavy"
                testId={'connect-header-label'}
              >
                {i18n.t('connect.title')}
              </Text>
            </Box>
            {compactModeEnabled && (
              <Box marginRight="16">
                <CloseButton onClose={onClose} />
              </Box>
            )}
          </Box>
          <Box className={ScrollClassName} paddingBottom="18">
            {Object.entries(groupedWallets).map(
              ([groupName, wallets], index) =>
                wallets.length > 0 && (
                  <Fragment key={index}>
                    {groupName ? (
                      <Box marginBottom="8" marginTop="16" marginX="6">
                        <Text
                          color={
                            groupName === 'Installed'
                              ? 'accentColor'
                              : 'modalTextSecondary'
                          }
                          size="14"
                          weight="bold"
                        >
                          {supportedI18nGroupNames.includes(groupName)
                            ? i18n.t(
                                `connector_group.${groupName.toLowerCase()}`,
                              )
                            : groupName}
                        </Text>
                      </Box>
                    ) : null}
                    <Box display="flex" flexDirection="column" gap="4">
                      {wallets.map((wallet) => (
                        <ModalSelection
                          currentlySelected={wallet.id === selectedOptionId}
                          iconBackground={wallet.iconBackground}
                          iconUrl={wallet.iconUrl}
                          key={wallet.id}
                          name={wallet.name}
                          onClick={() => selectWallet(wallet)}
                          ready={wallet.ready}
                          recent={wallet.recent}
                          testId={`wallet-option-${wallet.id}`}
                          isSpectrumKitConnector={wallet.isSpectrumKitConnector}
                        />
                      ))}
                    </Box>
                  </Fragment>
                ),
            )}
          </Box>
          {compactModeEnabled && Disclaimer && (
            <>
              <Box background="generalBorder" height="1" marginTop="-1" />
              <Box paddingX="24" paddingY="16" textAlign="center">
                <Disclaimer Link={DisclaimerLink} Text={DisclaimerText} />
              </Box>
            </>
          )}
        </Box>
      )}
      {showDetail && (
        <>
          {!compactModeEnabled && (
            <Box background="generalBorder" minWidth="1" width="1" />
          )}
          <Box
            display="flex"
            flexDirection="column"
            margin="16"
            style={{ flexGrow: 1 }}
          >
            <Box
              alignItems="center"
              display="flex"
              justifyContent="space-between"
              marginBottom="12"
            >
              <Box width="28">
                {showBackButton && (
                  <Box
                    as="button"
                    className={touchableStyles({
                      active: 'shrinkSm',
                      hover: 'growLg',
                    })}
                    color="accentColor"
                    onClick={clearSelectedWallet}
                    paddingX="8"
                    paddingY="4"
                    style={{
                      boxSizing: 'content-box',
                      height: 17,
                      willChange: 'transform',
                    }}
                    transition="default"
                    type="button"
                  >
                    <BackIcon />
                  </Box>
                )}
              </Box>
              <Box
                display="flex"
                justifyContent="center"
                style={{ flexGrow: 1 }}
              >
                {headerLabel && (
                  <Text
                    color="modalText"
                    size="18"
                    textAlign="center"
                    weight="heavy"
                  >
                    {headerLabel}
                  </Text>
                )}
              </Box>
              <CloseButton onClose={onClose} />
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              style={{ minHeight: compactModeEnabled ? 396 : 432 }}
            >
              <Box
                alignItems="center"
                display="flex"
                flexDirection="column"
                gap="6"
                height="full"
                justifyContent="center"
                marginX="8"
              >
                {walletStep === WalletStep.Connect && selectedWallet && (
                  <ConnectDetail
                    compactModeEnabled={compactModeEnabled}
                    connectionError={connectionError}
                    onClose={onClose}
                    qrCodeUri={qrCodeUri}
                    reconnect={connectToWallet}
                    wallet={selectedWallet}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
