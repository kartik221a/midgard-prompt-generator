import { openai, createOpenAI } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';
import { LanguageModel } from 'ai';

export type AIProvider = 'openai' | 'google' | 'anthropic' | 'openrouter';

const openrouter = createOpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    headers: {
        'HTTP-Referer': 'http://localhost:3000', // Update with your site URL in production
        'X-Title': 'Lyric Prompt Studio',
    },
});

export class AIManager {
    static getModel(provider: AIProvider, modelName?: string): LanguageModel {
        switch (provider) {
            case 'openai':
                return openai(modelName || 'gpt-4o');
            case 'google':
                return google(modelName || 'gemini-1.5-pro');
            case 'anthropic':
                return anthropic(modelName || 'claude-3-5-sonnet-20240620');
            case 'openrouter':
                // Default to a high-quality model available on OpenRouter
                return openrouter(modelName || 'google/gemini-2.0-flash-001');
            default:
                throw new Error(`Unsupported provider: ${provider}`);
        }
    }

    static getProviderName(provider: AIProvider): string {
        switch (provider) {
            case 'openai': return 'OpenAI';
            case 'google': return 'Google Gemini';
            case 'anthropic': return 'Anthropic Claude';
            case 'openrouter': return 'OpenRouter';
            default: return 'Unknown';
        }
    }
}
