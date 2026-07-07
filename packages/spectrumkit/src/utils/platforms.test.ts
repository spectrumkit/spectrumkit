import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getPlatform,
  isLinux,
  isMacOS,
  isWindows,
  PlatformType,
} from './platforms';

function setUserAgent(userAgent: string) {
  vi.stubGlobal('navigator', { userAgent });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('platforms', () => {
  it('detects Windows', () => {
    setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    );
    expect(isWindows()).toBe(true);
    expect(isMacOS()).toBe(false);
    expect(isLinux()).toBe(false);
    expect(getPlatform()).toBe(PlatformType.Windows);
  });

  it('detects macOS', () => {
    setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    );
    expect(isMacOS()).toBe(true);
    expect(isWindows()).toBe(false);
    expect(isLinux()).toBe(false);
    expect(getPlatform()).toBe(PlatformType.MacOS);
  });

  it('detects a Linux desktop', () => {
    setUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    );
    expect(isLinux()).toBe(true);
    expect(isWindows()).toBe(false);
    expect(isMacOS()).toBe(false);
    expect(getPlatform()).toBe(PlatformType.Linux);
  });

  it('treats Android as Desktop, not Linux', () => {
    setUserAgent(
      'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    );
    expect(isLinux()).toBe(false);
    expect(isWindows()).toBe(false);
    expect(isMacOS()).toBe(false);
    expect(getPlatform()).toBe(PlatformType.Desktop);
  });

  it('treats iOS as Desktop, not macOS', () => {
    setUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    );
    expect(isMacOS()).toBe(false);
    expect(isWindows()).toBe(false);
    expect(isLinux()).toBe(false);
    expect(getPlatform()).toBe(PlatformType.Desktop);
  });

  it('returns Desktop when navigator is unavailable (SSR)', () => {
    vi.stubGlobal('navigator', undefined);
    expect(getPlatform()).toBe(PlatformType.Desktop);
  });
});
