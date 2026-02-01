'use server';

import fs from 'fs';
import path from 'path';
import { PromptInput } from '@/lib/tools/lyrics/types';
import { buildSystemPrompt, buildUserMessage } from '@/lib/tools/lyrics/prompts';
import { AIManager, AIProvider } from '@/lib/ai/AIManager';
import { generateText } from 'ai';

export interface GenerateResult {
    prompt: string;
    tags?: string[];
    error?: string;
}

export async function generateLyricPromptAction(
    input: PromptInput,
    provider: AIProvider,
    modelName?: string
): Promise<GenerateResult> {
    try {
        // Validate input
        if (!input.metadata?.story) {
            return {
                prompt: '',
                tags: [],
                error: 'Story/concept is required to generate a prompt'
            };
        }

        // Read tags from public/sonauto_tags.txt
        const tagsPath = path.join(process.cwd(), 'public', 'sonauto_tags.txt');
        const tagsContent = await fs.promises.readFile(tagsPath, 'utf-8');
        const availableTags = tagsContent.split('\n').map(t => t.trim()).filter(t => t.length > 0);

        const model = AIManager.getModel(provider, modelName);
        const systemPrompt = buildSystemPrompt(availableTags);
        const userMessage = buildUserMessage(input);

        console.log('[Lyrics Action] Generating with:', { provider, modelName });

        const { text } = await generateText({
            model,
            system: systemPrompt,
            prompt: userMessage,
            temperature: 0.7,
        });

        // Validate response
        if (!text || text.trim().length === 0) {
            console.error('[Lyrics Action] Empty response from AI');
            return {
                prompt: '',
                tags: [],
                error: 'AI returned an empty response. Please try again.'
            };
        }

        // Parse JSON output
        let parsedResult;
        try {
            // Handle potential markdown code block wrapping
            const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
            parsedResult = JSON.parse(cleanText);
        } catch (e) {
            console.error("[Lyrics Action] Failed to parse AI JSON response:", text);
            // Fallback if not JSON (legacy behavior attempt)
            return { prompt: text, tags: [] };
        }

        return {
            prompt: parsedResult.prompt || '',
            tags: parsedResult.tags || []
        };
    } catch (error) {
        console.error('[Lyrics Action] Generation Error:', error);
        return {
            prompt: '',
            tags: [],
            error: error instanceof Error ? error.message : 'Failed to generate prompt'
        };
    }
}
