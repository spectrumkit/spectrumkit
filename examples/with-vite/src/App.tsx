import { useState } from 'react';

import {
  ConnectButton,
  SpectrumKitProvider,
  WalletButton,
  darkTheme,
  lightTheme,
  midnightTheme,
  useAccountModal,
  useChainModal,
  useConnectModal,
} from '@spectrumkit/spectrumkit';

const THEMES = {
  light: lightTheme,
  dark: darkTheme,
  midnight: midnightTheme,
} as const;
type ThemeName = keyof typeof THEMES;

const ACCENTS = ['blue', 'green', 'purple', 'red'] as const;
type Accent = (typeof ACCENTS)[number];

const PAGE_BACKGROUND: Record<ThemeName, string> = {
  light: '#f9fafb',
  dark: '#090913',
  midnight: '#0b0e17',
};

function App() {
  const [themeName, setThemeName] = useState<ThemeName>('light');
  const [accent, setAccent] = useState<Accent>('blue');

  const themeFn = THEMES[themeName];
  const theme = themeFn({ ...themeFn.accentColors[accent] });
  const dark = themeName !== 'light';

  return (
    <SpectrumKitProvider theme={theme}>
      <div
        style={{
          background: PAGE_BACKGROUND[themeName],
          color: dark ? '#fff' : '#111',
          minHeight: '100vh',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
          }}
        >
          <strong style={{ fontSize: 18 }}>SpectrumKit</strong>
          <ConnectButton />
        </header>

        <main
          style={{
            maxWidth: 720,
            margin: '0 auto',
            padding: '8px 24px 64px',
            display: 'flex',
            flexDirection: 'column',
            gap: 32,
          }}
        >
          <Controls
            themeName={themeName}
            setThemeName={setThemeName}
            accent={accent}
            setAccent={setAccent}
          />
          <WalletButtons />
          <ModalHooks />
        </main>
      </div>
    </SpectrumKitProvider>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 style={{ margin: '0 0 12px', fontSize: 15, opacity: 0.7 }}>
        {title}
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {children}
      </div>
    </section>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: 999,
        border: '1px solid #8884',
        background: active ? '#0e76fd' : 'transparent',
        color: active ? '#fff' : 'inherit',
        cursor: 'pointer',
        textTransform: 'capitalize',
      }}
    >
      {children}
    </button>
  );
}

function Controls({
  themeName,
  setThemeName,
  accent,
  setAccent,
}: {
  themeName: ThemeName;
  setThemeName: (t: ThemeName) => void;
  accent: Accent;
  setAccent: (a: Accent) => void;
}) {
  return (
    <>
      <Section title="Theme">
        {(Object.keys(THEMES) as ThemeName[]).map((name) => (
          <Pill
            key={name}
            active={name === themeName}
            onClick={() => setThemeName(name)}
          >
            {name}
          </Pill>
        ))}
      </Section>
      <Section title="Accent">
        {ACCENTS.map((name) => (
          <Pill
            key={name}
            active={name === accent}
            onClick={() => setAccent(name)}
          >
            {name}
          </Pill>
        ))}
      </Section>
    </>
  );
}

function WalletButtons() {
  return (
    <Section title="Wallet buttons">
      <WalletButton wallet="rainbow" />
      <WalletButton wallet="metaMask" />
      <WalletButton wallet="walletConnect" />
    </Section>
  );
}

function ModalHooks() {
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const { openAccountModal } = useAccountModal();

  const btn = {
    padding: '8px 14px',
    borderRadius: 8,
    border: '1px solid #8884',
    background: 'transparent',
    color: 'inherit',
    cursor: 'pointer',
  } as const;

  return (
    <Section title="Modal hooks">
      <button type="button" style={btn} onClick={openConnectModal}>
        Open connect modal
      </button>
      <button
        type="button"
        style={{ ...btn, opacity: openChainModal ? 1 : 0.4 }}
        onClick={openChainModal}
      >
        Open chain modal
      </button>
      <button
        type="button"
        style={{ ...btn, opacity: openAccountModal ? 1 : 0.4 }}
        onClick={openAccountModal}
      >
        Open account modal
      </button>
    </Section>
  );
}

export default App;
