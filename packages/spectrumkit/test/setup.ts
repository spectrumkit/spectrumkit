import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Replace the global WebSocket with an inert implementation before any test
// module loads. WalletConnect's relay client reads `globalThis.WebSocket` at
// connect time; the real (undici) socket fires a cross-realm Event under jsdom
// that surfaces as an unhandled error. A socket that never opens keeps the
// relay silent without touching the network. Assigned directly (not via
// vi.stubGlobal) so it survives vi.unstubAllGlobals() between suites.
class InertWebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;
  readyState = InertWebSocket.CONNECTING;
  send() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {
    return false;
  }
}
(globalThis as { WebSocket: unknown }).WebSocket = InertWebSocket;

afterEach(() => {
  cleanup();
});
