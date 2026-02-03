'use server';
/**
 * @fileOverview A Genkit flow for generating high-quality speech from text.
 *
 * - textToSpeech - A server action that converts text to an audio data URI.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import wav from 'wav';
import {Buffer} from 'buffer';

const TtsInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech.'),
  lang: z.string().describe('The language of the text (e.g., "kk-KZ").'),
});

const TtsOutputSchema = z.object({
  media: z
    .string()
    .describe(
      "A data URI for the generated WAV audio file: 'data:audio/wav;base64,...'"
    ),
});

/**
 * Converts raw PCM audio data into a Base64-encoded WAV file.
 * @param pcmData The raw audio buffer from the TTS model.
 * @returns A promise that resolves to the Base64-encoded WAV string.
 */
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d: Buffer) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

/**
 * The Genkit flow that calls the TTS model.
 */
const ttsFlow = ai.defineFlow(
  {
    name: 'ttsFlow',
    inputSchema: TtsInputSchema,
    outputSchema: TtsOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            // Use a high-quality prebuilt voice. The model is multilingual.
            prebuiltVoiceConfig: {voiceName: 'Ceres'},
          },
        },
      },
      prompt: input.text,
    });

    if (!media?.url) {
      throw new Error('Audio generation failed: no media returned.');
    }

    // The model returns PCM data in a data URI.
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavBase64 = await toWav(audioBuffer);

    return {
      media: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);

/**
 * A server action that wraps the Genkit flow, making it callable from client components.
 * @param text The text to synthesize.
 * @param lang The language code.
 * @returns The TTS output containing the audio data URI.
 */
export async function textToSpeech(
  text: string,
  lang: string
): Promise<z.infer<typeof TtsOutputSchema>> {
  return ttsFlow({text, lang});
}
