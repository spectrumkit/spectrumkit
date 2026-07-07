import {
  SpectrumKitAuthenticationProvider,
  createAuthenticationAdapter,
} from '@spectrumkit/spectrumkit';
import { getCsrfToken, signIn, signOut, useSession } from 'next-auth/react';
import { type ReactNode, useMemo } from 'react';
import type { Address } from 'viem';
import { type SiweMessage, createSiweMessage } from 'viem/siwe';

type UnconfigurableMessageOptions = {
  address: Address;
  chainId: number;
  nonce: string;
};

type ConfigurableMessageOptions = Partial<
  Omit<SiweMessage, keyof UnconfigurableMessageOptions>
> & {
  [_Key in keyof UnconfigurableMessageOptions]?: never;
};

export type GetSiweMessageOptions = () => ConfigurableMessageOptions;

interface SpectrumKitSiweNextAuthProviderProps {
  enabled?: boolean;
  getSiweMessageOptions?: GetSiweMessageOptions;
  children: ReactNode;
}

export function SpectrumKitSiweNextAuthProvider({
  children,
  enabled,
  getSiweMessageOptions,
}: SpectrumKitSiweNextAuthProviderProps) {
  const { status } = useSession() ?? { status: 'loading' as const };
  const adapter = useMemo(
    () =>
      createAuthenticationAdapter({
        createMessage: ({ address, chainId, nonce }) => {
          const defaultConfigurableOptions: Required<
            Pick<
              ConfigurableMessageOptions,
              'domain' | 'uri' | 'version' | 'statement'
            >
          > = {
            domain: window.location.host,
            statement: 'Sign in with Ethereum to the app.',
            uri: window.location.origin,
            version: '1',
          };

          const unconfigurableOptions: UnconfigurableMessageOptions = {
            address,
            chainId,
            nonce,
          };

          return createSiweMessage({
            ...defaultConfigurableOptions,

            // Spread custom SIWE message options provided by the consumer
            ...getSiweMessageOptions?.(),

            // Spread unconfigurable options last so they can't be overridden
            ...unconfigurableOptions,
          });
        },

        getNonce: async () => {
          const nonce = await getCsrfToken();
          if (!nonce) throw new Error();
          return nonce;
        },

        signOut: async () => {
          await signOut({ redirect: false });
        },

        verify: async ({ message, signature }) => {
          const response = await signIn('credentials', {
            message,
            signature,
            redirect: false,
          });

          return response?.ok ?? false;
        },
      }),
    [getSiweMessageOptions],
  );

  return (
    <SpectrumKitAuthenticationProvider
      adapter={adapter}
      enabled={enabled}
      status={status}
    >
      {children}
    </SpectrumKitAuthenticationProvider>
  );
}
