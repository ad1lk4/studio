'use client';
import { textToSpeech } from '@/ai/flows/ttsFlow';

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

  // 3. Call the Genkit flow
  const flowPromise = textToSpeech(text, lang)
    .then(result => {
      if (!result || !result.media) {
          throw new Error('TTS flow did not return media.');
      }
      // The result.media is a data URI, which can be used directly.
      const audioUrl = result.media;
      audioCache.set(cacheKey, audioUrl);
      requestsInProgress.delete(cacheKey); // Clean up after success
      return audioUrl;
    })
    .catch(error => {
      console.error(`TTS service failed for text "${text}":`, error);
      requestsInProgress.delete(cacheKey); // Clean up after failure
      // Re-throw the error to be caught by the caller (speak or preload)
      throw error;
    });

  requestsInProgress.set(cacheKey, flowPromise);
  return flowPromise;
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
    // Log the error but don't rethrow, so one failure doesn't stop others.
    console.error(`Failed to preload audio for "${text}":`, error);
  }
};


/**
 * Pronounces the given text using the Genkit TTS flow.
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
  
  // Stop any currently playing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  try {
    const audioUrl = await fetchAndCache(text, lang);
    currentAudio = new Audio(audioUrl);
    currentAudio.play().catch(e => console.error("Audio playback failed:", e));
  } catch (error) {
      // The error is already logged in fetchAndCache
      console.error('Failed to get or play TTS audio:', error);
      // Optionally, inform the user via UI
      // alert('Не удалось воспроизвести аудио. Пожалуйста, попробуйте еще раз.');
  }
};
