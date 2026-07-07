import { describe, expect, it } from 'vitest';
import { isSafeDeepLink } from './isSafeDeepLink';

describe('isSafeDeepLink', () => {
  it('allows legitimate wallet deep-link schemes', () => {
    expect(isSafeDeepLink('https://mewwallet.com/wc?uri=wc%3A123')).toBe(true);
    expect(isSafeDeepLink('zilpay://wc?uri=wc%3A123')).toBe(true);
    expect(isSafeDeepLink('imtokenv2://wc?uri=wc%3A123')).toBe(true);
    expect(isSafeDeepLink('bnc://app.binance.com/cedefi/wc?uri=wc%3A123')).toBe(
      true,
    );
  });

  it('rejects script-executing schemes', () => {
    expect(isSafeDeepLink('javascript:alert(1)')).toBe(false);
    expect(isSafeDeepLink('JavaScript:alert(1)')).toBe(false);
    expect(isSafeDeepLink('  javascript:alert(1)')).toBe(false);
    expect(isSafeDeepLink('data:text/html,<script>alert(1)</script>')).toBe(
      false,
    );
    expect(isSafeDeepLink('vbscript:msgbox(1)')).toBe(false);
  });

  it('rejects empty / nullish input', () => {
    expect(isSafeDeepLink('')).toBe(false);
    expect(isSafeDeepLink(undefined)).toBe(false);
    expect(isSafeDeepLink(null)).toBe(false);
  });
});
