'use client';

export const speak = async (text: string) => {
  if (!text?.trim()) return;

  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.trim() }),
    });

    if (!response.ok) {
      let message = `Ошибка ${response.status}`;
      try {
        const json = await response.json();
        if (json.debug) {
            console.error('TTS V3 Response Structure:', json.debug);
        }
        message = json.error || message;
      } catch (e) {
        message = await response.text();
      }
      console.error(`Ошибка озвучки:`, message);
      return;
    }

    const blob = await response.blob();
    
    if (blob.type.includes('application/json')) {
        const errorText = await blob.text();
        console.error('Сервер вернул JSON вместо аудио:', errorText);
        return;
    }

    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);

    audio.onended = () => URL.revokeObjectURL(audioUrl);
    audio.onerror = (e) => {
      URL.revokeObjectURL(audioUrl);
      console.error('Ошибка воспроизведения аудио (onerror)', e);
    };

    await audio.play();

  } catch (error) {
    console.error('Сбой speak():', error);
  }
};

export const preload = async (text: string) => {
  console.log('Preload skipped:', text);
};