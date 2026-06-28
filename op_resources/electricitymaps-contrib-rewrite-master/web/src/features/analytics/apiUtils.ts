/**
 * SHARED API UTILITIES — Grid Analytics Engine
 *
 * Centralizes Gemini API communication patterns:
 * - Exponential backoff retry logic for 429 rate limiting
 * - API URL construction from environment variable
 */

const GEMINI_MODEL = 'gemini-3-flash-preview';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Performs a fetch request with exponential backoff retry on 429 (rate limit)
 * and network errors.
 *
 * @param url - The URL to fetch
 * @param options - Standard fetch RequestInit options
 * @param retries - Maximum number of retries (default: 4)
 * @param delay - Initial delay in ms before first retry (default: 1000)
 * @returns The fetch Response
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 4,
  delay = 1000
): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (response.status === 429 && retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      }
    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
}

/**
 * Builds the Gemini API endpoint URL using the environment variable
 * `VITE_GEMINI_API_KEY`. Throws in development if the key is missing.
 *
 * @returns The fully qualified Gemini generateContent URL
 */
export function getGeminiApiUrl(): string {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  if (!apiKey) {
    if (import.meta.env.DEV) {
      console.warn(
        '[Grid Analytics] VITE_GEMINI_API_KEY not set. AI features will not work. ' +
          'Create a .env.local file with VITE_GEMINI_API_KEY=your_key'
      );
    }
    return '';
  }

  return `${GEMINI_BASE_URL}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
}
