import { NextResponse } from 'next/server';

const YANDEX_API_KEY = 'AQWJeNM_EUT0wOyAknBqlanAkFcU_ImOH3wttLRP';
const YANDEX_TTS_URL = 'https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return new NextResponse('Text is required', { status: 400 });
    }

    const formData = new URLSearchParams();
    formData.append('text', text);
    formData.append('lang', 'kk-KK');
    formData.append('voice', 'madi');
    formData.append('format', 'mp3');

    const response = await fetch(YANDEX_TTS_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Api-Key ${YANDEX_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Yandex TTS API error:', errorText);
      return new NextResponse(`Error from Yandex API: ${response.statusText}`, { status: response.status });
    }

    const audioBlob = await response.blob();
    
    return new NextResponse(audioBlob, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });

  } catch (error) {
    console.error('TTS API route error:', error);
    if (error instanceof Error) {
        return new NextResponse(error.message, { status: 500 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
