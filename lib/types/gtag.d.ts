declare global {
  interface Window {
    gtag: (
      command: string,
      target: string | Date,
      config?: Record<string, unknown>
    ) => void;
  }
}

export {}; 