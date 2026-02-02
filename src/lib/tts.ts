'use client';

const audioCache = new Map<string, string>();
const requestsInProgress = new Map<string, Promise<string>>();
let currentAudio: HTMLAudioElement | null = null;

const fetchAndCache = (text: string, lang = 'kk-KZ'): Promise<string> => {
  const cacheKey = `${lang}:${text}`;
  
  // 1. Check if already in cache
  if (audioCache.has(cacheKey)) {
    return Promise.resolve(audioCache.get(cacheKey)!);
  }

  // 2. Check if a request is already in progress
  if (requestsInProgress.has(cacheKey)) {
    return requestsInProgress.get(cacheKey)!;
  }

  // 3. Fetch new audio
  const fetchPromise = fetch('/api/tts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, lang }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`TTS service failed with status: ${response.status}`);
    }
    return response.blob();
  })
  .then(audioBlob => {
    const audioUrl = URL.createObjectURL(audioBlob);
    audioCache.set(cacheKey, audioUrl);
    requestsInProgress.delete(cacheKey); // Clean up after success
    return audioUrl;
  })
  .catch(error => {
    requestsInProgress.delete(cacheKey); // Clean up after failure
    // Re-throw the error to be caught by the caller (speak or preload)
    throw error;
  });

  requestsInProgress.set(cacheKey, fetchPromise);
  return fetchPromise;
}

/**
 * Fetches and caches audio without playing it.
 * Errors are caught and logged to the console, but not thrown,
 * to prevent one failed preload from stopping others.
 * @param text The text to preload.
 * @param lang The language code.
 */
export const preload = async (text: string, lang = 'kk-KZ') => {
  if (!text || text.trim() === '') {
    return;
  }
  try {
    await fetchAndCache(text, lang);
  } catch (error) {
    console.error(`Failed to preload audio for "${text}":`, error);
  }
};


/**
 * Pronounces the given text using a server-side API route.
 * Uses a cache to prevent redundant API calls.
 * @param text The text to speak.
 */
export const speak = async (text: string, lang = 'kk-KZ') => {
  if (typeof window === 'undefined' || !window.Audio) {
    console.error('Browser does not support the Audio API.');
    return;
  }

  if (!text || text.trim() === '') {
    return;
  }
  
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  try {
    const audioUrl = await fetchAndCache(text, lang);
    currentAudio = new Audio(audioUrl);
    currentAudio.play().catch(e => console.error("Audio playback failed:", e));
  } catch (error) {
      console.error('Failed to fetch TTS audio:', error);
      alert('Не удалось воспроизвести аудио. Пожалуйста, попробуйте еще раз.');
  }
};
