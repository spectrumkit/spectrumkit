import type React from 'react';
import { type ReactNode, createContext } from 'react';

export type DisclaimerComponent = React.FunctionComponent<{
  Text: React.FunctionComponent<{ children: ReactNode }>;
  Link: React.FunctionComponent<{ children: ReactNode; href: string }>;
}>;

export const defaultAppInfo = {
  appName: undefined,
  disclaimer: undefined,
  // Default empty — the modal's "Learn more" link is hidden when this is
  // unset. Consumers can supply their own URL via SpectrumKitProviderProps.
  learnMoreUrl: undefined as string | undefined,
};

export const AppContext = createContext<{
  appName?: string;
  learnMoreUrl?: string;
  disclaimer?: DisclaimerComponent;
}>(defaultAppInfo);
