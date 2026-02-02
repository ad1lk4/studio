'use client';

// 1. Основная функция озвучки (которую мы писали)
export const speak = async (text: string) => {
  if (!text) return;

    try {
        console.log("🔊 Отправляем запрос в Яндекс:", text);

            const response = await fetch('/api/tts', {
                  method: 'POST',
                        headers: {
                                'Content-Type': 'application/json',
                                      },
                                            body: JSON.stringify({ text }),
                                                });

                                                    if (!response.ok) {
                                                          console.error("Ошибка API озвучки:", await response.text());
                                                                return;
                                                                    }

                                                                        const blob = await response.blob();
                                                                            const audioUrl = URL.createObjectURL(blob);
                                                                                const audio = new Audio(audioUrl);
                                                                                    
                                                                                        await audio.play();

                                                                                          } catch (error) {
                                                                                              console.error("Сбой воспроизведения:", error);
                                                                                                }
                                                                                                };

                                                                                                // 2. ВАЖНО: Добавляем функцию preload, чтобы сайт не ругался
                                                                                                // Мы делаем её пустой ("заглушкой"), чтобы просто убрать ошибку Build Error
                                                                                                export const preload = async (text: string) => {
                                                                                                  // Тут ничего не происходит, это нормально.
                                                                                                    // Главное, что функция существует и экспортируется.
                                                                                                      console.log("Preloading skipped for:", text);
                                                                                                      };