import { NextRequest, NextResponse } from 'next/server';

// --- НАСТРОЙКИ ---
// Сотри 'ВСТАВЬ_СЮДА...' и вставь свой ключ, который начинается на AQVN...
const YANDEX_API_KEY = 'AQWJeNM_EUT0wOyAknBqlanAkFcU_ImOH3wttLRP'; 
const FOLDER_ID = 'ao778cjqlka6rltjut89'; 
// ----------------

export async function POST(req: NextRequest) {
  try {
      const { text } = await req.json();

          const params = new URLSearchParams();
              params.append('text', text);
                  params.append('lang', 'kk-KK');
                      params.append('voice', 'madi'); // Голос
                          params.append('format', 'mp3');
                              params.append('folderId', FOLDER_ID);

                                  const response = await fetch('https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize', {
                                        method: 'POST',
                                              headers: {
                                                      'Authorization': `Api-Key ${YANDEX_API_KEY}`, 
                                                            },
                                                                  body: params,
                                                                      });

                                                                          if (!response.ok) {
                                                                                return NextResponse.json({ error: await response.text() }, { status: response.status });
                                                                                    }

                                                                                        return new NextResponse(await response.arrayBuffer(), {
                                                                                              headers: { 'Content-Type': 'audio/mpeg' },
                                                                                                  });

                                                                                                    } catch (error) {
                                                                                                        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
                                                                                                          }
                                                                                                          }