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
        console.log('[Lyrics Action] Starting generation request...', { provider, modelName });

        // 1. Validate API Key for OpenRouter (since that's the default/likely provider)
        if (provider === 'openrouter' && !process.env.OPENROUTER_API_KEY) {
            console.error('[Lyrics Action] CRITICAL: OPENROUTER_API_KEY is missing in environment variables.');
            return {
                prompt: '',
                tags: [],
                error: 'Configuration Error: OpenRouter API Key is missing. Please check server logs and .env file.'
            };
        }

        // Validate input
        if (!input.metadata?.story) {
            return {
                prompt: '',
                tags: [],
                error: 'Story/concept is required to generate a prompt'
            };
        }

        // 2. Read tags with fallback
        let availableTags: string[] = [];
        try {
            const tagsPath = path.join(process.cwd(), 'public', 'sonauto_tags.txt');
            const tagsContent = await fs.promises.readFile(tagsPath, 'utf-8');
            availableTags = tagsContent.split('\n').map(t => t.trim()).filter(t => t.length > 0);
        } catch (fileError) {
            console.warn('[Lyrics Action] Warning: Could not read sonauto_tags.txt. Using default fallback tags.', fileError);
            availableTags = ['Pop', 'Rock', 'Indie', 'Alternative', 'Electronic', 'Hip Hop', 'R&B', 'Jazz', 'Classical', 'Folk', 'Country']; 
        }

        const model = AIManager.getModel(provider, modelName);
        const systemPrompt = buildSystemPrompt(availableTags);
        const userMessage = buildUserMessage(input);

        console.log('[Lyrics Action] Sending request to AI Provider...');

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
    } catch (error: any) {
        // Log the FULL error object to see the real cause (headers, auth, etc.)
        console.error('[Lyrics Action] FATAL Generation Error:', error);
        
        // Check for common error patterns from providers
        const errorMessage = error?.message || 'Unknown error';
        
        if (errorMessage.includes('401') || errorMessage.includes('unauthorized') || errorMessage.includes('api key')) {
             return {
                prompt: '',
                tags: [],
                error: 'Authentication failed with AI Provider. Please check valid API Key.'
            };
        }

        return {
            prompt: '',
            tags: [],
            error: \`Generation Failed: \${errorMessage}\`
        };
    }
}
