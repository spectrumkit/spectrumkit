import {
  type ReactNode,
  createContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { type Locale, i18n, setLocale } from '../../locales';
import { detectedBrowserLocale } from '../../utils/locale';

export const I18nContext = createContext<{ i18n: typeof i18n }>({ i18n });

interface I18nProviderProps {
  children: ReactNode;
  locale?: Locale;
}

export const I18nProvider = ({ children, locale }: I18nProviderProps) => {
  const [updateCount, setUpdateCount] = useState(0);

  const browserLocale: Locale = useMemo(
    () => detectedBrowserLocale() as Locale,
    [],
  );

  useEffect(() => {
    const unsubscribe = i18n.onChange(() => {
      setUpdateCount((count) => count + 1);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (locale && locale !== i18n.locale) {
      setLocale(locale);
    } else if (!locale && browserLocale && browserLocale !== i18n.locale) {
      setLocale(browserLocale);
    }
  }, [locale, browserLocale]);

  // A new object identity on every `updateCount` change is the point here — it
  // is what re-renders consumers when the locale swaps.
  // biome-ignore lint/correctness/useExhaustiveDependencies: incorrect warning
  const memoizedValue = useMemo(() => ({ i18n }), [updateCount]);

  return (
    <I18nContext.Provider value={memoizedValue}>
      {children}
    </I18nContext.Provider>
  );
};
