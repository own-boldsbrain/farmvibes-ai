// Polyfill JSDOM globals before any other imports to prevent reference mismatches in Radix UI / other libraries
globalThis.Event = window.Event;
globalThis.CustomEvent = window.CustomEvent;
globalThis.KeyboardEvent = window.KeyboardEvent;
globalThis.MouseEvent = window.MouseEvent;
globalThis.FocusEvent = window.FocusEvent;
globalThis.PointerEvent = window.PointerEvent || window.MouseEvent;

// ResizeObserver Polyfill for Radix UI and standard charts under JSDOM
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Also mock translation helper functions globally to prevent getZoneName/getCountryName resolution errors
vi.mock('translation/translation', () => ({
  useTranslation: () => ({
    __: (key: string) => key,
    i18n: { language: 'pt-BR', exists: () => true },
  }),
  getZoneName: (zoneId: string) => `Zone-${zoneId}`,
  getCountryName: (zoneId: string) => `Country-${zoneId}`,
  getShortenedZoneNameWithCountry: (zoneId: string) => `ShortZone-${zoneId}`,
}));
