import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize Genkit with the Google AI plugin
// The googleAI() plugin will automatically use the GEMINI_API_KEY from the environment.
export const ai = genkit({
  plugins: [googleAI()],
});
