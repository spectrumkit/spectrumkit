// TS 6 requires a type declaration for side-effect CSS imports such as
// `import '@spectrumkit/spectrumkit/styles.css'` under moduleResolution "node".
declare module '*.css';
declare module '@spectrumkit/spectrumkit/styles.css';
