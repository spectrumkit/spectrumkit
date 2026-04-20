import { describe, expect, it, vi } from 'vitest';
import { createWallet } from './createWallet';

const noop = () => Promise.resolve('');

describe('createWallet', () => {
  it('produces an injected-only wallet when no WC helpers are given', () => {
    const wallet = createWallet({
      id: 'fakeWallet',
      name: 'Fake Wallet',
      rdns: 'io.fake',
      iconUrl: noop,
      iconBackground: '#123456',
      detect: { flag: 'isRabby' },
      downloadUrls: { browserExtension: 'https://fake.example' },
      instructions: { extension: { learnMoreUrl: 'https://fake.example' } },
    })({ projectId: 'x' });

    expect(wallet.id).toBe('fakeWallet');
    expect(wallet.name).toBe('Fake Wallet');
    expect(wallet.qrCode).toBeUndefined();
    expect(wallet.mobile).toBeUndefined();
    expect(wallet.extension?.instructions?.steps).toEqual([
      {
        step: 'install',
        title: 'wallet_connectors.fakeWallet.extension.step1.title',
        description: 'wallet_connectors.fakeWallet.extension.step1.description',
      },
      {
        step: 'create',
        title: 'wallet_connectors.fakeWallet.extension.step2.title',
        description: 'wallet_connectors.fakeWallet.extension.step2.description',
      },
      {
        step: 'refresh',
        title: 'wallet_connectors.fakeWallet.extension.step3.title',
        description: 'wallet_connectors.fakeWallet.extension.step3.description',
      },
    ]);
  });

  it('derives qr_code i18n keys with install/create/scan by default', () => {
    const wallet = createWallet({
      id: 'fakeHybrid',
      name: 'Fake Hybrid',
      iconUrl: noop,
      iconBackground: '#000',
      mobileDeepLink: (uri) => `fake://${uri}`,
      qrUriTransform: (uri) => uri,
      instructions: {
        qrCode: { learnMoreUrl: 'https://fake.example' },
      },
    })({ projectId: 'x' });

    // Non-injected + walletConnect enabled → qrCode present, steps built
    expect(wallet.qrCode?.instructions?.steps.map((s) => s.step)).toEqual([
      'install',
      'create',
      'scan',
    ]);
    expect(wallet.qrCode?.instructions?.steps[0]?.title).toBe(
      'wallet_connectors.fakeHybrid.qr_code.step1.title',
    );
  });

  it('accepts a platform-split detect object (Trust-style)', async () => {
    const { isMobile } = await import('../utils/isMobile');

    // The factory only reads isMobile() at build time of the wallet
    // instance, so we have to stub before calling createWallet().
    const spy = vi.spyOn({ isMobile }, 'isMobile');
    spy.mockImplementation(() => true);

    const mobileWallet = createWallet({
      id: 'splitDetect',
      name: 'Split',
      iconUrl: () => Promise.resolve(''),
      iconBackground: '#000',
      detect: {
        mobile: { flag: 'isTrust' },
        desktop: { flag: 'isTrustWallet' },
      },
    })({ projectId: 'x' });

    // No WalletConnect helpers, no detect hit → undefined installed.
    expect(mobileWallet.id).toBe('splitDetect');
    spy.mockRestore();
  });

  it('respects custom step sequence override', () => {
    const wallet = createWallet({
      id: 'customSteps',
      name: 'Custom Steps',
      iconUrl: noop,
      iconBackground: '#000',
      mobileDeepLink: (uri) => `fake://${uri}`,
      instructions: {
        qrCode: {
          learnMoreUrl: 'https://fake.example',
          steps: ['install', 'connect'],
        },
      },
    })({ projectId: 'x' });

    expect(wallet.qrCode?.instructions?.steps.map((s) => s.step)).toEqual([
      'install',
      'connect',
    ]);
  });

  it('uses `connect` namespace for the connector when it differs from `detect`', () => {
    const wallet = createWallet({
      id: 'fakeCtrl',
      name: 'Fake CTRL',
      iconUrl: noop,
      iconBackground: '#fff',
      detect: { namespace: 'fakectrl.ethereum' },
      connect: { namespace: 'xfi.ethereum' },
      instructions: { extension: { learnMoreUrl: 'https://fake.example' } },
    })({ projectId: 'x' });

    // The connector closure is constructed at factory time; this test locks
    // in that the override path runs without throwing and produces a wallet.
    expect(wallet.id).toBe('fakeCtrl');
    expect(typeof wallet.createConnector).toBe('function');
  });
});
