// Polyfill JSDOM globals before any other imports to prevent reference mismatches in Radix UI / other libraries
globalThis.Event = window.Event;
globalThis.CustomEvent = window.CustomEvent;
globalThis.KeyboardEvent = window.KeyboardEvent;
globalThis.MouseEvent = window.MouseEvent;
globalThis.FocusEvent = window.FocusEvent;
globalThis.PointerEvent = window.PointerEvent || window.MouseEvent;
