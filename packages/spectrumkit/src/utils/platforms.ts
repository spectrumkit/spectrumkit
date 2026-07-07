export enum PlatformType {
  Windows = 'Windows',
  MacOS = 'macOS',
  Linux = 'Linux',
  Desktop = 'Desktop',
}

function getUserAgent(): string {
  if (typeof navigator === 'undefined') return '';
  return navigator.userAgent ?? '';
}

function isAndroid(ua: string): boolean {
  return ua.includes('Android');
}

function isIOS(ua: string): boolean {
  return /iPhone|iPad|iPod/.test(ua);
}

export function isWindows(): boolean {
  return getUserAgent().includes('Windows');
}

export function isMacOS(): boolean {
  const ua = getUserAgent();
  // iOS user agents contain "Mac OS X" (e.g. "like Mac OS X"), so they must be
  // excluded to avoid being classified as macOS.
  if (isIOS(ua)) return false;
  return ua.includes('Macintosh') || ua.includes('Mac OS X');
}

export function isLinux(): boolean {
  const ua = getUserAgent();
  // Android user agents contain "Linux" but must not be treated as Linux.
  if (isAndroid(ua)) return false;
  return ua.includes('Linux') || ua.includes('X11');
}

export function getPlatform(): PlatformType {
  if (isWindows()) return PlatformType.Windows;
  if (isMacOS()) return PlatformType.MacOS;
  if (isLinux()) return PlatformType.Linux;
  return PlatformType.Desktop;
}
