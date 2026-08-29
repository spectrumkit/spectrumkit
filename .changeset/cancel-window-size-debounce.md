---
"@spectrumkit/spectrumkit": patch
---

Cancel the pending `useWindowSize` debounce timer on unmount so it no longer fires after the component (or test environment) is gone.
