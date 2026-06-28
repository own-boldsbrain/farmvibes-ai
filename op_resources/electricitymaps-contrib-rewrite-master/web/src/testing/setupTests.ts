import './polyfillGlobals';
import '@testing-library/jest-dom';
import mediaQuery from 'css-mediaquery';
import server from './mocks/server';
import { DESKTOP_RESOLUTION_HEIGHT, DESKTOP_RESOLUTION_WIDTH } from './testUtils';
import 'whatwg-fetch';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });

  Object.defineProperty(window, 'IS_REACT_ACT_ENVIRONMENT', {
    writable: true,
    value: true,
  });
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => {
      function matchQuery(): boolean {
        return mediaQuery.match(query, {
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }

      const listeners: (() => void)[] = [];
      const instance = {
        matches: matchQuery(),
        addEventListener: (_: 'change', listener: () => void): void => {
          listeners.push(listener);
        },
        removeEventListener: (_: 'change', listener: () => void): void => {
          const index = listeners.indexOf(listener);
          if (index >= 0) {
            listeners.splice(index, 1);
          }
        },
      };
      window.addEventListener('resize', () => {
        const change = matchQuery();
        if (change !== instance.matches) {
          instance.matches = change;
          for (const listener of listeners) {
            listener();
          }
        }
      });

      return instance;
    },
  });
  Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: () => {},
  });
  Object.defineProperty(window, 'resizeTo', {
    writable: true,
    value: (width: number, height: number) => {
      Object.assign(window, {
        innerWidth: width,
        innerHeight: height,
      }).dispatchEvent(new Event('resize'));
    },
  });
});

beforeEach(() => {
  window.resizeTo(DESKTOP_RESOLUTION_WIDTH, DESKTOP_RESOLUTION_HEIGHT);
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

vi.mock('react-map-gl', () => ({
  useControl: () => ({ getMap: () => ({ getZoom: () => 5, project: () => ({ x: 0, y: 0 }) }) }),
  useMap: () => ({ current: { getZoom: () => 5, project: () => ({ x: 0, y: 0 }) } }),
  MapProvider: ({ children }: any) => children,
  NavigationControl: () => null,
  Source: ({ children }: any) => children,
  Layer: () => null,
}));

vi.mock('api/getState', () => ({
  default: () => ({
    data: {
      data: {
        zones: {},
        exchanges: {},
      },
    },
    isLoading: false,
    error: null,
  }),
}));

vi.mock('api/getZone', () => ({
  default: () => ({
    data: {
      data: {
        zoneStates: {},
      },
    },
    isLoading: false,
    error: null,
  }),
}));

vi.mock('api/getWeatherData', () => ({
  default: () => ({
    data: null,
    isLoading: false,
    error: null,
  }),
}));

vi.mock('api/getAppVersion', () => ({
  default: () => ({
    data: '1.0.0',
    isLoading: false,
    error: null,
  }),
}));
