import React, {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Address } from 'viem';
import { type Config, useConnection, useConnectionEffect } from 'wagmi';
import { useIsMounted } from './useIsMounted';

export type AuthenticationStatus =
  | 'loading'
  | 'unauthenticated'
  | 'authenticated';

export interface AuthenticationAdapter<Message> {
  getNonce: () => Promise<string>;
  createMessage: (args: {
    nonce: string;
    address: Address;
    chainId: number;
  }) => Message;
  verify: (args: { message: Message; signature: string }) => Promise<boolean>;
  signOut: () => Promise<void>;
}

export interface AuthenticationConfig<Message> {
  adapter: AuthenticationAdapter<Message>;
  status: AuthenticationStatus;
}

// Right now this function only serves to infer the generic Message type
export function createAuthenticationAdapter<Message>(
  adapter: AuthenticationAdapter<Message>,
) {
  return adapter;
}

const AuthenticationContext = createContext<AuthenticationConfig<any> | null>(
  null,
);

interface SpectrumKitAuthenticationProviderProps<Message>
  extends AuthenticationConfig<Message> {
  enabled?: boolean;
  children: ReactNode;
}

export function SpectrumKitAuthenticationProvider<Message = unknown>(
  props: SpectrumKitAuthenticationProviderProps<Message>,
) {
  // useConnection/useConnectionEffect require the WagmiProvider's Config
  // context, which is only populated on the client. Defer all wagmi-hook
  // use to after the first client render to avoid SSR throwing
  // WagmiProviderNotFoundError.
  const mounted = useIsMounted();
  if (!mounted) {
    return (
      <AuthenticationContext.Provider
        value={
          props.enabled !== false
            ? { adapter: props.adapter, status: props.status }
            : null
        }
      >
        {props.children}
      </AuthenticationContext.Provider>
    );
  }
  return <AuthenticationProviderClient {...props} />;
}

function AuthenticationProviderClient<Message = unknown>({
  adapter,
  children,
  enabled = true,
  status,
}: SpectrumKitAuthenticationProviderProps<Message>) {
  // When the wallet is disconnected, we want to tell the auth
  // adapter that the user session is no longer active.
  const { connector } = useConnection();
  // Used to track whether an active connector is changed to log user out.
  // Wagmi supports multiple connections.
  const [currentConnectorUid, setCurrentConnectorUid] = useState<string>();

  useConnectionEffect({
    onDisconnect: () => {
      adapter.signOut();
      setCurrentConnectorUid(undefined);
    },
  });

  const handleChangedAccount = (
    data: Parameters<Config['_internal']['events']['change']>[0],
  ) => {
    // Only if account changes
    if (data.accounts) {
      // If account is changed we automatically log user out.
      // Current connector uid only should be available only at "authenticated"
      setCurrentConnectorUid(undefined);
      adapter.signOut();
    }
  };

  // Wait for user authentication before listening to "change" event.
  // Avoid listening immediately after wallet connection due to potential SIWE authentication delay.
  // Ensure to turn off the "change" event listener for cleanup.
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // Wagmi renders emitter's partially on page load. We wanna make sure
    // the event emitters gets updated before proceeding
    if (
      typeof connector?.emitter?.on === 'function' &&
      status === 'authenticated'
    ) {
      // Set current connector uid
      setCurrentConnectorUid(connector?.uid);

      // Attach the event listener when status is 'authenticated'
      connector.emitter.on('change', handleChangedAccount);

      // Cleanup function to remove the event listener
      return () => {
        connector.emitter.off('change', handleChangedAccount);
      };
    }
  }, [connector?.emitter, status]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (
      currentConnectorUid &&
      typeof connector?.emitter?.on === 'function' &&
      status === 'authenticated'
    ) {
      // If the current connector is not
      // equal to previous connector then logout
      if (connector?.uid !== currentConnectorUid) {
        setCurrentConnectorUid(undefined);
        adapter.signOut();
      }
    }
  }, [connector?.emitter, currentConnectorUid, status]);

  return (
    <AuthenticationContext.Provider
      value={useMemo(
        () => (enabled ? { adapter, status } : null),
        [enabled, adapter, status],
      )}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export function useAuthenticationAdapter() {
  const { adapter } = useContext(AuthenticationContext) ?? {};

  if (!adapter) {
    throw new Error('No authentication adapter found');
  }

  return adapter;
}

export function useAuthenticationStatus() {
  const contextValue = useContext(AuthenticationContext);

  return contextValue?.status ?? null;
}
