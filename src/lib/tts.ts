'use client';

import { textToSpeech } from '@/ai/flows/ttsFlow';

// Cache for storing generated audio to avoid repeated API calls.
const audioCache: { [key: string]: string } = {};
let currentAudio: HTMLAudioElement | null = null;

/**
 * Pronounces the given text using a high-quality TTS model via a Genkit flow.
 * Caches the result to improve performance.
 * @param text The text to speak.
 * @param lang The language code (e.g., 'kk-KZ' for Kazakh).
 */
export const speak = async (text: string, lang = 'kk-KZ') => {
  // Prevent empty or whitespace-only strings from being processed.
  if (!text || text.trim() === '') {
    console.log('[TTS] Skipped empty text.');
    return;
  }

  // Stop any currently playing audio.
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  // Check if the audio is already in the cache.
  if (audioCache[text]) {
    console.log(`[TTS] Playing "${text}" from cache.`);
    const audio = new Audio(audioCache[text]);
    currentAudio = audio;
    audio.play().catch(e => console.error('Error playing cached audio:', e));
    return;
  }

  console.log(`[TTS] Generating new audio for "${text}"...`);
  try {
    // Call the server action to generate audio.
    const response = await textToSpeech(text, lang);
    const audioUrl = response.media;

    if (audioUrl) {
      // Cache the new audio URL.
      audioCache[text] = audioUrl;
      const audio = new Audio(audioUrl);
      currentAudio = audio;
      audio.play().catch(e => console.error('Error playing generated audio:', e));
    } else {
      console.error('TTS generation failed: The server did not return an audio URL.');
      alert('Не удалось озвучить текст.');
    }
  } catch (error) {
    console.error('Error calling the textToSpeech flow:', error);
    alert('Произошла ошибка при генерации речи. Пожалуйста, попробуйте еще раз.');
  }
};
