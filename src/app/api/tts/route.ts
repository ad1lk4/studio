import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.YANDEX_TTS_API_KEY;
    const voiceName = process.env.YANDEX_TTS_VOICE ?? 'saule'; 

    if (!apiKey) {
      return NextResponse.json(
        { error: 'YANDEX_TTS_API_KEY не задан в .env' },
        { status: 503 }
      );
    }

    const body = await req.json();
    const text = typeof body?.text === 'string' ? body.text.trim() : '';

    if (!text) {
      return NextResponse.json({ error: 'Текст не передан' }, { status: 400 });
    }

    const requestBody = {
      text: text,
      outputAudioSpec: {
        containerAudio: {
          containerAudioType: 'MP3'
        }
      },
      hints: [
        { voice: voiceName },
        { speed: 1.0 }
      ]
    };

    const url = 'https://tts.api.ml.yandexcloud.kz/tts/v3/utteranceSynthesis';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Api-Key ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[TTS KZ V3] HTTP Error: ${response.status}`, errorBody);
      return NextResponse.json(
        { error: `Ошибка синтеза (KZ V3 API): ${errorBody}` },
        { status: response.status }
      );
    }

    const responseData = await response.json();

    const audioChunk = 
      responseData.result?.audioChunk || 
      responseData.audioChunk || 
      responseData.result?.audio_chunk || 
      responseData.audio_chunk;

    if (!audioChunk || !audioChunk.data) {
      console.error('[TTS] Некорректная структура ответа:', JSON.stringify(responseData).substring(0, 500));
      return NextResponse.json(
        { error: 'Пустой ответ от TTS (нет audioChunk)', debug: responseData }, 
        { status: 502 }
      );
    }

    const audioBuffer = Buffer.from(audioChunk.data, 'base64');

    return new NextResponse(audioBuffer, {
      headers: { 
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString()
      },
    });

  } catch (error) {
    console.error('[TTS] Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}