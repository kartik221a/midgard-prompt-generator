'use server';

import { ColoringBookInput } from '@/lib/tools/coloring-book/types';
import { generateBulkColoringBookPrompts } from '@/lib/tools/coloring-book/prompts';

export interface ColoringBookGenerateResult {
    prompts: string[];
    error?: string;
}

/**
 * Server action to generate coloring book prompts
 */
export async function generateColoringBookPromptsAction(
    input: ColoringBookInput
): Promise<ColoringBookGenerateResult> {
    try {
        // Validate input
        if (!input.subject || input.subject.trim() === '') {
            return {
                prompts: [],
                error: 'Subject is required'
            };
        }

        if (input.pageCount < 1 || input.pageCount > 100) {
            return {
                prompts: [],
                error: 'Page count must be between 1 and 100'
            };
        }

        // Generate prompts using the utility function
        const prompts = generateBulkColoringBookPrompts(input);

        return {
            prompts
        };
    } catch (error) {
        console.error('Coloring Book Generation Error:', error);
        return {
            prompts: [],
            error: error instanceof Error ? error.message : 'Failed to generate prompts'
        };
    }
}
