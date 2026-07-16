/**
 * Connect Flow Tests
 *
 * Tests for Rainbow wallet connection flows through the SpectrumKit modal:
 * - EIP-1193 (window.ethereum) provider detection and connector selection
 * - EIP-6963 provider discovery via browser events
 * - WalletConnect fallback when no browser extension is detected
 * - Modal interactions and wallet-list state
 *
 * We mock only the browser window providers while using the actual
 * rainbowWallet connector implementation from the source code.
 *
 * ## Environment constraints these tests are written against
 *
 * Two properties of this jsdom setup shape what can be asserted. Both were
 * established empirically; ignoring them produces tests that cannot fail.
 *
 * 1. **Injected-provider detection is frozen at module-import time.**
 *    `createWallet()` calls `hasInjectedProvider()` in its own body, which runs
 *    when `rainbowWallet.ts` is first imported. Setting `window.ethereum` in a
 *    `beforeEach` therefore has *no effect* on a statically imported wallet —
 *    it is always resolved as "not injected". To genuinely exercise detection,
 *    the EIP-1193 tests below inject the provider and then re-import the wallet
 *    module via `vi.resetModules()` + dynamic `import()`.
 *
 * 2. **WalletConnect can never establish a session.** `test/setup.ts` replaces
 *    the global WebSocket with an inert stub, so the relay never connects and
 *    `display_uri` never fires. `getQrCodeUri()` returns a promise that never
 *    resolves, so `DesktopOptions.onQrCode` awaits forever and the Connect pane
 *    never opens for a WC-backed wallet. Anything downstream of a live WC
 *    session — QR rendering, the `Scan with Rainbow` header, session storage —
 *    is unobservable here and is asserted at the connector level instead.
 *
 * Note also that `test/mockWalletConnect.ts` installs a closure-backed
 * localStorage mock, so `Object.keys(localStorage)` only ever returns the
 * mock's method names. Storage must be read through `getItem`.
 *
 * ## What we're NOT testing (unlike Wagmi):
 * - Network requests to the WalletConnect relay
 * - WalletConnect pairing/session management
 * - QR code generation and scanning
 * - Deep WalletConnect protocol implementation
 */

import { screen, waitFor, fireEvent, within } from '@testing-library/react';
import {
  describe,
  expect,
  it,
  vi,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from 'vitest';
import { mainnet } from 'wagmi/chains';
import { renderWithProviders } from '../../../test';
import { rainbowWallet, mockWallet } from '../../../test/mockRainbow';
import {
  walletConnectServer,
  setupMatchMedia,
  setupLocalStorage,
} from '../../../test/mockWalletConnect';
import { metaMaskWallet } from '../../wallets/walletConnectors/metaMaskWallet/metaMaskWallet';
import type { Wallet } from '../../wallets/Wallet';
import { ConnectButton } from '../ConnectButton/ConnectButton';
import { ConnectModal } from './ConnectModal';

const RAINBOW_OPTION = 'rk-wallet-option-rainbow';
// EIP-6963 connectors are keyed by rdns, not by the SpectrumKit wallet id.
const RAINBOW_6963_OPTION = 'rk-wallet-option-me.rainbow';

const renderModal = (wallets: Wallet[] = [rainbowWallet]) =>
  renderWithProviders(<ConnectModal onClose={() => {}} open={true} />, {
    chains: [mainnet],
    mockWallets: [{ groupName: 'Popular', wallets }],
  });

const waitForModal = () =>
  waitFor(() =>
    expect(screen.getByTestId('rk-connect-header-label')).toBeDefined(),
  );

/**
 * Re-import the Rainbow wallet so that its injected-provider detection runs
 * against the `window.ethereum` currently in place. See note 1 in the header.
 */
const importFreshRainbowWallet = async () => {
  vi.resetModules();
  const mod = await import(
    '../../wallets/walletConnectors/rainbowWallet/rainbowWallet'
  );
  return mod.rainbowWallet;
};

/** Announce an EIP-6963 provider, both immediately and on future requests. */
const announceProvider = (detail: {
  info: { uuid: string; name: string; icon: string; rdns: string };
  provider: unknown;
}) => {
  const announce = () =>
    window.dispatchEvent(
      new CustomEvent('eip6963:announceProvider', { detail }),
    );
  announce();
  window.addEventListener('eip6963:requestProvider', announce);
  const w = window as unknown as { __eip6963Listeners?: (() => void)[] };
  w.__eip6963Listeners = w.__eip6963Listeners || [];
  w.__eip6963Listeners.push(announce);
};

const requestProviders = () =>
  window.dispatchEvent(new Event('eip6963:requestProvider'));

describe('Connect Flow Tests', () => {
  beforeAll(() => {
    walletConnectServer.listen({ onUnhandledRequest: 'warn' });
    setupMatchMedia();
    setupLocalStorage();
  });

  beforeEach(() => {
    mockWallet.cleanup();
  });

  afterEach(() => {
    mockWallet.cleanup();
    walletConnectServer.resetHandlers();
    localStorage.clear();
    // Drop any wallet module re-imported against a mocked window.ethereum.
    vi.resetModules();
  });

  afterAll(() => {
    walletConnectServer.close();
    vi.unstubAllGlobals();
  });

  describe('Wallet list rendering', () => {
    it('should list each configured wallet under its group heading', async () => {
      renderModal();
      await waitForModal();

      const option = await screen.findByTestId(RAINBOW_OPTION);
      expect(option).toHaveTextContent('Rainbow');
      // `Popular` is the group name passed to connectorsForWallets, rendered
      // through the `connector_group.popular` i18n key.
      expect(screen.getByText('Popular')).toBeInTheDocument();
    });

    it('should record the latest wallet id and mark the option selected on click', async () => {
      renderModal();
      await waitForModal();

      const option = await screen.findByTestId(RAINBOW_OPTION);
      expect(option).not.toBeDisabled();
      expect(localStorage.getItem('rk-latest-id')).toBeNull();

      fireEvent.click(option);

      expect(localStorage.getItem('rk-latest-id')).toBe('rainbow');
      await waitFor(() =>
        expect(screen.getByTestId(RAINBOW_OPTION)).toBeDisabled(),
      );
    });
  });

  describe('Injected provider detection (EIP-1193)', () => {
    it('should select the injected connector when window.ethereum sets the wallet flag', async () => {
      mockWallet.setupEIP1193(); // sets window.ethereum.isRainbow = true
      const freshRainbow = await importFreshRainbowWallet();

      const wallet = freshRainbow({ projectId: 'test' });

      // Detected as installed, so no WalletConnect fallback is wired up.
      expect(wallet.installed).toBe(true);
      expect(wallet.qrCode).toBeUndefined();
      expect(wallet.mobile?.getUri).toBeUndefined();
    });

    it('should fall back to WalletConnect when no injected provider is present', async () => {
      // No window.ethereum at import time.
      const freshRainbow = await importFreshRainbowWallet();

      const wallet = freshRainbow({ projectId: 'test' });

      // `installed` stays undefined so the UI treats it as WC-connectable
      // rather than "not installed", and the QR/mobile URIs are wired up.
      expect(wallet.installed).toBeUndefined();
      expect(wallet.qrCode?.getUri).toBeDefined();
      expect(wallet.mobile?.getUri).toBeDefined();
    });

    it('should open the connect pane when an injected wallet is selected', async () => {
      mockWallet.setupEIP1193();
      const freshRainbow = await importFreshRainbowWallet();

      renderModal([freshRainbow]);
      await waitForModal();

      fireEvent.click(await screen.findByTestId(RAINBOW_OPTION));

      // An injected wallet has no QR URI to await, so DesktopOptions advances
      // straight to the Connect pane. (A WC-backed wallet never gets here —
      // see note 2 in the header.)
      expect(await screen.findByText('Opening Rainbow...')).toBeInTheDocument();
      expect(
        screen.getByText('Confirm connection in the extension'),
      ).toBeInTheDocument();
    });
  });

  describe('EIP-6963 provider discovery', () => {
    it('should list an announced provider under the Installed group', async () => {
      mockWallet.setupEIP6963();

      renderModal();
      requestProviders();
      await waitForModal();

      const option = await screen.findByTestId(RAINBOW_6963_OPTION);
      expect(option).toHaveTextContent('Rainbow');
      // EIP-6963 connectors are forced into the `Installed` group.
      expect(screen.getByText('Installed')).toBeInTheDocument();
      expect(screen.queryByText('Popular')).not.toBeInTheDocument();
    });

    it('should replace the SpectrumKit connector when an announced provider matches its rdns', async () => {
      mockWallet.setupEIP6963(); // announces rdns "me.rainbow"

      renderModal();
      requestProviders();
      await waitForModal();

      // rainbowWallet declares rdns "me.rainbow", so useWalletConnectors drops
      // the SpectrumKit connector in favour of the announced one — Rainbow must
      // appear exactly once, via the EIP-6963 entry.
      expect(
        await screen.findByTestId(RAINBOW_6963_OPTION),
      ).toBeInTheDocument();
      expect(screen.queryByTestId(RAINBOW_OPTION)).not.toBeInTheDocument();
      expect(screen.getAllByText('Rainbow')).toHaveLength(1);
    });

    it('should list every announced provider', async () => {
      mockWallet.setupEIP6963();
      announceProvider({
        info: {
          uuid: 'other-wallet-uuid',
          name: 'Other Wallet',
          icon: 'data:image/svg+xml;base64,other_icon',
          rdns: 'com.other.wallet',
        },
        provider: {
          request: vi.fn(),
          on: vi.fn(),
          removeListener: vi.fn(),
          emit: vi.fn(),
        },
      });

      renderModal();
      requestProviders();
      await waitForModal();

      expect(
        await screen.findByTestId(RAINBOW_6963_OPTION),
      ).toBeInTheDocument();
      const other = await screen.findByTestId(
        'rk-wallet-option-com.other.wallet',
      );
      expect(other).toHaveTextContent('Other Wallet');
    });

    it('should open the connect pane when an announced provider is selected', async () => {
      mockWallet.setupEIP6963();

      renderModal();
      requestProviders();
      await waitForModal();

      fireEvent.click(await screen.findByTestId(RAINBOW_6963_OPTION));

      // The announced provider is keyed by rdns, so that is what gets recorded.
      expect(localStorage.getItem('rk-latest-id')).toBe('me.rainbow');
      expect(await screen.findByText('Opening Rainbow...')).toBeInTheDocument();
    });
  });

  describe('Connect Button Integration', () => {
    it('should open the connect modal when the connect button is clicked', async () => {
      renderWithProviders(<ConnectButton />, {
        chains: [mainnet],
        mockWallets: [{ groupName: 'Popular', wallets: [rainbowWallet] }],
      });

      expect(screen.queryByTestId('rk-connect-header-label')).toBeNull();

      fireEvent.click(screen.getByRole('button', { name: /connect wallet/i }));

      await waitForModal();
      expect(await screen.findByTestId(RAINBOW_OPTION)).toBeInTheDocument();
    });

    it('should list announced providers in the modal it opens', async () => {
      mockWallet.setupEIP6963();

      renderWithProviders(<ConnectButton />, {
        chains: [mainnet],
        mockWallets: [{ groupName: 'Popular', wallets: [rainbowWallet] }],
      });

      fireEvent.click(screen.getByRole('button', { name: /connect wallet/i }));
      requestProviders();
      await waitForModal();

      fireEvent.click(await screen.findByTestId(RAINBOW_6963_OPTION));
      expect(localStorage.getItem('rk-latest-id')).toBe('me.rainbow');
    });
  });

  describe('Recent Wallets', () => {
    it('should badge a wallet held in recent storage as Recent', async () => {
      localStorage.setItem('rk-recent', JSON.stringify(['rainbow']));

      renderModal();
      await waitForModal();

      const option = await screen.findByTestId(RAINBOW_OPTION);
      expect(within(option).getByText('Recent')).toBeInTheDocument();
    });

    it('should list recent wallets ahead of the rest', async () => {
      localStorage.setItem('rk-recent', JSON.stringify(['metaMask']));

      renderModal([rainbowWallet, metaMaskWallet]);
      await waitForModal();

      await screen.findByTestId('rk-wallet-option-metaMask');
      const options = screen
        .getAllByTestId(/^rk-wallet-option-/)
        .map((el) => el.getAttribute('data-testid'));

      // MetaMask is declared second but is recent, so it must be hoisted above
      // Rainbow. Only the recent one carries the badge.
      expect(options).toEqual([
        'rk-wallet-option-metaMask',
        'rk-wallet-option-rainbow',
      ]);
      expect(
        within(screen.getByTestId('rk-wallet-option-metaMask')).getByText(
          'Recent',
        ),
      ).toBeInTheDocument();
      expect(
        within(screen.getByTestId(RAINBOW_OPTION)).queryByText('Recent'),
      ).toBeNull();
    });
  });
});
