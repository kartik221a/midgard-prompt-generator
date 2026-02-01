import fs from 'fs';
import path from 'path';
import { PromptInput, buildSystemPrompt, buildUserMessage } from '@/lib/ai/prompts';
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
        // Read tags from public/sonauto_tags.txt
        const tagsPath = path.join(process.cwd(), 'public', 'sonauto_tags.txt');
        const tagsContent = await fs.promises.readFile(tagsPath, 'utf-8');
        const availableTags = tagsContent.split('\n').map(t => t.trim()).filter(t => t.length > 0);

        const model = AIManager.getModel(provider, modelName);
        const systemPrompt = buildSystemPrompt(availableTags);
        const userMessage = buildUserMessage(input);

        const { text } = await generateText({
            model,
            system: systemPrompt,
            prompt: userMessage,
            temperature: 0.7,
        });

        // Parse JSON output
        let parsedResult;
        try {
            // Handle potential markdown code block wrapping
            const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
            parsedResult = JSON.parse(cleanText);
        } catch (e) {
            console.error("Failed to parse AI JSON response:", text);
            // Fallback if not JSON (legacy behavior attempt)
            return { prompt: text, tags: [] };
        }

        return {
            prompt: parsedResult.prompt || '',
            tags: parsedResult.tags || []
        };
    } catch (error) {
        console.error('AI Generation Error:', error);
        return {
            prompt: '',
            tags: [],
            error: error instanceof Error ? error.message : 'Failed to generate prompt'
        };
    }
}
