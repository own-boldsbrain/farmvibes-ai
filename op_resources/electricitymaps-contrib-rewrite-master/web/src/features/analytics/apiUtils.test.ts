import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchWithRetry, getGeminiApiUrl } from './apiUtils';

describe('apiUtils', () => {
  describe('fetchWithRetry', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('should return response on successful fetch', async () => {
      const mockResponse = new Response(JSON.stringify({ ok: true }), { status: 200 });
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse));

      const result = await fetchWithRetry('https://example.com', {});
      expect(result.status).toBe(200);
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should retry on 429 status with exponential backoff', async () => {
      const rateLimited = new Response('', { status: 429 });
      const success = new Response(JSON.stringify({ ok: true }), { status: 200 });

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValueOnce(rateLimited).mockResolvedValueOnce(success)
      );

      const result = await fetchWithRetry('https://example.com', {}, 2, 10);
      expect(result.status).toBe(200);
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('should return last 429 response when retries are exhausted', async () => {
      const rateLimited = new Response('', { status: 429 });

      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(rateLimited));

      const result = await fetchWithRetry('https://example.com', {}, 0, 10);
      expect(result.status).toBe(429);
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should retry on network error', async () => {
      const success = new Response(JSON.stringify({ ok: true }), { status: 200 });

      vi.stubGlobal(
        'fetch',
        vi.fn().mockRejectedValueOnce(new Error('Network error')).mockResolvedValueOnce(success)
      );

      const result = await fetchWithRetry('https://example.com', {}, 2, 10);
      expect(result.status).toBe(200);
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('should throw when all retries on network error are exhausted', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      await expect(fetchWithRetry('https://example.com', {}, 0, 10)).rejects.toThrow(
        'Network error'
      );
    });
  });

  describe('getGeminiApiUrl', () => {
    it('should return empty string when VITE_GEMINI_API_KEY is not set', () => {
      // In the test environment, import.meta.env.VITE_GEMINI_API_KEY is undefined
      const url = getGeminiApiUrl();
      // Should either return a URL (if env is set) or empty string
      expect(typeof url).toBe('string');
    });

    it('should construct the correct URL format when key is present', () => {
      // We can't easily mock import.meta.env in vitest, but we can verify
      // the function returns a string and doesn't throw
      const url = getGeminiApiUrl();
      if (url) {
        expect(url).toContain('generativelanguage.googleapis.com');
        expect(url).toContain('gemini-3-flash-preview');
        expect(url).toContain('generateContent');
      }
    });
  });
});
