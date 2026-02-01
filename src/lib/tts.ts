'use client';

let voices: SpeechSynthesisVoice[] = [];

const getVoices = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    voices = window.speechSynthesis.getVoices();
    return voices;
  }
  return [];
};

// Load voices initially and on change
if (typeof window !== 'undefined' && window.speechSynthesis) {
  getVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = getVoices;
  }
}

/**
 * Pronounces the given text using the browser's built-in Web Speech API.
 * This method is free and requires no API key.
 * Voice quality may vary depending on the browser and operating system.
 * @param text The text to speak.
 * @param lang The language code (e.g., 'kk-KZ' for Kazakh).
 */
export const speak = (text: string, lang = 'kk-KZ') => {
  // Check for browser support
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.error('Browser does not support the Web Speech API.');
    alert('Ваш браузер не поддерживает озвучку текста.');
    return;
  }

  // Prevent empty or whitespace-only strings from being processed.
  if (!text || text.trim() === '') {
    console.log('[TTS] Skipped empty text.');
    return;
  }

  // Cancel any currently speaking utterances
  window.speechSynthesis.cancel();

  // Create a new utterance
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set the language
  utterance.lang = lang;

  // Attempt to find a specific voice for the given language
  // We check for the primary language subtag (e.g., 'kk' from 'kk-KZ')
  const voice = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
  if (voice) {
    utterance.voice = voice;
  } else {
    console.warn(`[TTS] No specific voice for lang="${lang}" found. Using browser default for the language.`);
  }
  
  // Speak the text
  window.speechSynthesis.speak(utterance);
};
