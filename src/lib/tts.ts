'use client';

/**
 * Pronounces the given text using the Web Speech API.
 * @param text The text to speak.
 * @param lang The language code (e.g., 'kk-KZ' for Kazakh).
 */
export const speak = (text: string, lang = 'kk-KZ') => {
  // Check for browser support
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    // Notify the user that TTS is not supported.
    // Using alert for simplicity as per user context.
    alert('К сожалению, ваш браузер не поддерживает синтез речи.');
    return;
  }
  
  // Cancel any ongoing speech to prevent overlap
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  
  // The voices are loaded asynchronously. We need to find a suitable voice.
  const setVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    // Find a voice that matches the language code exactly or the primary language.
    const voice = voices.find(v => v.lang === lang || v.lang.startsWith(lang.split('-')[0]));
    if (voice) {
      utterance.voice = voice;
    }
  };

  // If voices are already loaded, set the voice. Otherwise, wait for the event.
  if (window.speechSynthesis.getVoices().length > 0) {
    setVoice();
  } else {
    window.speechSynthesis.onvoiceschanged = setVoice;
  }

  window.speechSynthesis.speak(utterance);
};
