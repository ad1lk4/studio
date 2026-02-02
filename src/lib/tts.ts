'use client';

const audioCache = new Map<string, string>();
let currentAudio: HTMLAudioElement | null = null;

/**
 * Pronounces the given text using a server-side Yandex SpeechKit API route.
 * Caches the audio to prevent redundant API calls.
 * @param text The text to speak.
 * @param lang The language code (e.g., 'kk-KZ'), ignored in this version as it's set on the server.
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

  let audioUrl: string;

  if (audioCache.has(text)) {
    audioUrl = audioCache.get(text)!;
  } else {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`TTS service failed with status: ${response.status}`);
      }

      const audioBlob = await response.blob();
      audioUrl = URL.createObjectURL(audioBlob);
      audioCache.set(text, audioUrl);

    } catch (error) {
      console.error('Failed to fetch TTS audio:', error);
      alert('Не удалось воспроизвести аудио. Пожалуйста, попробуйте еще раз.');
      return;
    }
  }

  currentAudio = new Audio(audioUrl);
  currentAudio.play().catch(e => console.error("Audio playback failed:", e));
};
