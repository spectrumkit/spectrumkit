import type React from 'react';
import { type ReactNode, createContext, useContext } from 'react';
import { EmojiAvatar } from '../Avatar/EmojiAvatar';

export type DisclaimerComponent = React.FunctionComponent<{
  Text: React.FunctionComponent<{ children: ReactNode }>;
  Link: React.FunctionComponent<{ children: ReactNode; href: string }>;
}>;

export type AvatarComponentProps = {
  address: string;
  ensImage?: string | null;
  size: number;
};
export type AvatarComponent = React.FunctionComponent<AvatarComponentProps>;

export interface AppInfo {
  appName?: string;
  learnMoreUrl?: string;
  disclaimer?: DisclaimerComponent;
}

/**
 * The static slice of RainbowKitProvider props — values that are set once
 * from the consumer and never change at runtime. Held in a single context
 * to flatten the provider tree (was 4 separate contexts).
 *
 * Dynamic state lives in its own contexts (ShowBalance, WalletButton),
 * computed state too (ModalSize), and lifecycle state too (Modal).
 */
export interface RainbowKitConfig {
  appInfo: AppInfo;
  avatar: AvatarComponent;
  showRecentTransactions: boolean;
  themeId: string | undefined;
}

export const defaultAppInfo: AppInfo = {
  appName: undefined,
  disclaimer: undefined,
  learnMoreUrl:
    'https://learn.rainbow.me/understanding-web3?utm_source=rainbowkit&utm_campaign=learnmore',
};

const defaultConfig: RainbowKitConfig = {
  appInfo: defaultAppInfo,
  avatar: EmojiAvatar,
  showRecentTransactions: false,
  themeId: undefined,
};

export const RainbowKitConfigContext =
  createContext<RainbowKitConfig>(defaultConfig);

// Selector hooks — kept narrow so consumers only pull the slice they need.
// (Without React's experimental useContextSelector, every consumer still
// re-renders when any field changes, but in practice the config object is
// memoized once at provider mount and only changes on consumer re-mount.)
export const useAppInfo = (): AppInfo =>
  useContext(RainbowKitConfigContext).appInfo;
export const useAvatar = (): AvatarComponent =>
  useContext(RainbowKitConfigContext).avatar;
export const useShowRecentTransactions = (): boolean =>
  useContext(RainbowKitConfigContext).showRecentTransactions;
export const useThemeId = (): string | undefined =>
  useContext(RainbowKitConfigContext).themeId;
