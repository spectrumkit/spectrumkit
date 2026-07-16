# @spectrumkit/spectrumkit-siwe-next-auth

[Sign-In with Ethereum](https://login.xyz) and [NextAuth](https://next-auth.js.org) authentication adapter for [SpectrumKit](https://github.com/spectrumkit/spectrumkit).

## Usage

### Install

```bash
npm install @spectrumkit/spectrumkit-siwe-next-auth
```

### Set up the provider

In your `App` component, import `SpectrumKitSiweNextAuthProvider` and wrap `SpectrumKitProvider` with it, ensuring it's nested within NextAuth's `SessionProvider` so that it has access to the session.

```tsx
import { SpectrumKitProvider } from '@spectrumkit/spectrumkit';
import { SpectrumKitSiweNextAuthProvider } from '@spectrumkit/spectrumkit-siwe-next-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { WagmiProvider } from 'wagmi';

import { config } from '../wagmi';

const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  return (
    <SessionProvider refetchInterval={0} session={pageProps.session}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <SpectrumKitSiweNextAuthProvider>
            <SpectrumKitProvider>
              <Component {...pageProps} />
            </SpectrumKitProvider>
          </SpectrumKitSiweNextAuthProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </SessionProvider>
  );
}
```

With `SpectrumKitSiweNextAuthProvider` in place, your users will be prompted to authenticate by signing a message once they've connected their wallet.

### Verify the signature server-side

**This step is required.** `SpectrumKitSiweNextAuthProvider` only creates the message and forwards the signature — every security guarantee of SIWE lives in the NextAuth credentials provider you write. It must check all four of the following, and reject the sign-in if any fails:

1. The message parses and is internally valid.
2. `domain` matches the host you actually serve from — this is what stops a signature captured on a phishing site from being replayed against you. The message's `domain` is supplied by the client and is never trustworthy on its own.
3. `nonce` matches the CSRF token for this request, which binds the message to this browser session.
4. The signature genuinely belongs to the claimed address.

```ts
// pages/api/auth/[...nextauth].ts
import type { IncomingMessage } from 'node:http';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getCsrfToken } from 'next-auth/react';
import { type SiweMessage, parseSiweMessage, validateSiweMessage } from 'viem/siwe';

import { publicClient } from '../../../wagmi';

export function getAuthOptions(req: IncomingMessage): NextAuthOptions {
  return {
    providers: [
      CredentialsProvider({
        name: 'Ethereum',
        credentials: {
          message: { label: 'Message', type: 'text', placeholder: '0x0' },
          signature: { label: 'Signature', type: 'text', placeholder: '0x0' },
        },
        async authorize(credentials: any) {
          try {
            const siweMessage = parseSiweMessage(
              credentials?.message,
            ) as SiweMessage;

            // 1. The message is well-formed.
            if (
              !validateSiweMessage({
                address: siweMessage?.address,
                message: siweMessage,
              })
            ) {
              return null;
            }

            // 2. It was signed for *our* domain, not an attacker's.
            const nextAuthUrl = process.env.NEXTAUTH_URL;
            if (!nextAuthUrl) return null;
            if (siweMessage.domain !== new URL(nextAuthUrl).host) return null;

            // 3. The nonce belongs to this session.
            const nonce = await getCsrfToken({ req: { headers: req.headers } });
            if (siweMessage.nonce !== nonce) return null;

            // 4. The signature is really from that address.
            const valid = await publicClient.verifyMessage({
              address: siweMessage.address,
              message: credentials?.message,
              signature: credentials?.signature,
            });
            if (!valid) return null;

            return { id: siweMessage.address };
          } catch {
            return null;
          }
        },
      }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: 'jwt' },
    callbacks: {
      async session({ session, token }) {
        session.address = token.sub;
        session.user = { name: token.sub };
        return session;
      },
    },
  };
}
```

See `packages/example/src/pages/api/auth/[...nextauth].ts` in this repo for the complete working version.

### Customize the SIWE message options

Pass a function to the `getSiweMessageOptions` prop. It's called whenever a new message is created, and what it returns is merged over the defaults.

```tsx
import {
  type GetSiweMessageOptions,
  SpectrumKitSiweNextAuthProvider,
} from '@spectrumkit/spectrumkit-siwe-next-auth';

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'Sign in to my SpectrumKit app',
});

<SpectrumKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
  ...
</SpectrumKitSiweNextAuthProvider>;
```

See the [viem SIWE options](https://viem.sh/docs/siwe/utilities/createSiweMessage#parameters) for the full list. `address`, `chainId`, and `nonce` are supplied by the provider and cannot be overridden.

### Access the session server-side

Use NextAuth's `getToken` from `next-auth/jwt`. If the user authenticated, the token's `sub` (the "subject") is their address.

You can also resolve the session in `getServerSideProps` and pass it down, so NextAuth doesn't resolve it again on the client:

```tsx
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { getSession } from 'next-auth/react';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const token = await getToken({ req: context.req });

  // If `address` is non-null here, the server knows the user is authenticated.
  const address = token?.sub ?? null;

  return { props: { address, session } };
};

type AuthenticatedPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

export default function AuthenticatedPage({
  address,
}: AuthenticatedPageProps) {
  return address ? (
    <h1>Authenticated as {address}</h1>
  ) : (
    <h1>Unauthenticated</h1>
  );
}
```

For more on managing the session:

- [Next.js authentication guide](https://nextjs.org/docs/app/building-your-application/authentication)
- [NextAuth documentation](https://next-auth.js.org)

## Contributing

Please follow our [contributing guidelines](/.github/CONTRIBUTING.md).

## License

Licensed under the MIT License.

See [LICENSE](/LICENSE) for more information.
