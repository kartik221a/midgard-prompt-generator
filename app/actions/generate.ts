'use server';

import { generateText } from 'ai';
import { AIManager, AIProvider } from '@/lib/ai/AIManager';
import { PromptInput, buildSystemPrompt, buildUserMessage } from '@/lib/ai/prompts';

export interface GenerateResult {
    prompt: string;
    error?: string;
}

export async function generateLyricPromptAction(
    input: PromptInput,
    provider: AIProvider,
    modelName?: string
): Promise<GenerateResult> {
    try {
        const model = AIManager.getModel(provider, modelName);
        const systemPrompt = buildSystemPrompt();
        const userMessage = buildUserMessage(input);

        const { text } = await generateText({
            model,
            system: systemPrompt,
            prompt: userMessage,
            temperature: 0.7,
        });

        return { prompt: text };
    } catch (error) {
        console.error('AI Generation Error:', error);
        return {
            prompt: '',
            error: error instanceof Error ? error.message : 'Failed to generate prompt'
        };
    }
}
