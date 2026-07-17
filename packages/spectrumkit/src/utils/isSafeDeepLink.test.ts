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
    expect(
      isSafeDeepLink('wc:8a5e5bdc-a0e4@1?bridge=https%3A%2F%2Fb.org'),
    ).toBe(true);
  });

  it('rejects script-executing schemes', () => {
    expect(isSafeDeepLink('javascript:alert(1)')).toBe(false);
    expect(isSafeDeepLink('JavaScript:alert(1)')).toBe(false);
    expect(isSafeDeepLink('  javascript:alert(1)')).toBe(false);
    expect(isSafeDeepLink('data:text/html,<script>alert(1)</script>')).toBe(
      false,
    );
    expect(isSafeDeepLink('vbscript:msgbox(1)')).toBe(false);
    expect(isSafeDeepLink('blob:https://evil.example/uuid')).toBe(false);
  });

  // A browser strips leading C0 controls and all embedded tabs/newlines before
  // resolving a scheme, so each of these navigates to `javascript:` / `data:`
  // despite not matching a raw-string scheme check.
  it('rejects schemes disguised by characters the URL parser strips', () => {
    expect(isSafeDeepLink('\x01javascript:alert(1)')).toBe(false);
    expect(isSafeDeepLink('\x00javascript:alert(1)')).toBe(false);
    expect(isSafeDeepLink('java\nscript:alert(1)')).toBe(false);
    expect(isSafeDeepLink('java\tscript:alert(1)')).toBe(false);
    expect(isSafeDeepLink('java\rscript:alert(1)')).toBe(false);
    expect(isSafeDeepLink('da\tta:text/html,<script>alert(1)</script>')).toBe(
      false,
    );
  });

  it('rejects relative URIs, which carry no scheme of their own', () => {
    expect(isSafeDeepLink('//evil.example')).toBe(false);
    expect(isSafeDeepLink('/wc?uri=wc%3A123')).toBe(false);
    expect(isSafeDeepLink('wc?uri=wc%3A123')).toBe(false);
  });

  it('rejects empty / nullish input', () => {
    expect(isSafeDeepLink('')).toBe(false);
    expect(isSafeDeepLink(undefined)).toBe(false);
    expect(isSafeDeepLink(null)).toBe(false);
  });
});
