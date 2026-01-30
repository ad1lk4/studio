'use server';
/**
 * @fileOverview A Genkit flow for the AI language assistant.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {Message} from 'genkit/content';

const ChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({ text: z.string() })),
  })),
  message: z.string(),
});

const ChatOutputSchema = z.string();

export async function getChatResponse(
  history: Message[],
  message: string
): Promise<string> {
  return chatFlow({ history, message });
}

const systemPrompt = `You are a friendly and knowledgeable assistant for the "Sөyle!" application, a platform for learning the Kazakh language. Your primary goal is to help users learn.
- Your name is "Айсұлу".
- Answer questions about Kazakh grammar, vocabulary, and culture.
- Provide examples, translations, and explanations.
- Keep your answers concise, clear, and encouraging.
- CRITICAL: Your entire response must be plain text. Do not use any markdown formatting. Do not use asterisks (*), hashes (#), or any other characters for formatting like bold, italics, or lists.
- If a question is outside the scope of language learning, gently guide the user back to the topic.
- Always respond in Russian.`;

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async ({ history, message }) => {
    const model = 'googleai/gemini-2.5-flash';

    const response = await ai.generate({
      model,
      system: systemPrompt,
      history: history,
      prompt: message,
    });

    return response.text;
  }
);
