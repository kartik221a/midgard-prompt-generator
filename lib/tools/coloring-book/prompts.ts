import { ColoringBookInput } from './types';
import { CATEGORY_PRESETS } from './constants';

/**
 * Generates a single coloring book page prompt based on input settings
 */
export function generateColoringBookPrompt(
    input: ColoringBookInput,
    pageNumber: number,
    variation: string = ''
): string {
    const preset = CATEGORY_PRESETS[input.category];
    const moodKeywords = preset.moodKeywords.join(', ');

    let prompt = `Create a ${input.style} coloring book page`;

    // Add variation for bulk generation
    if (variation) {
        prompt += ` featuring ${input.subject} - ${variation}`;
    } else {
        prompt += ` featuring ${input.subject}`;
    }

    prompt += `.

**Line Art Specifications:**
- Line thickness: ${input.lineArtSettings.thickness} outlines
- Line quality: ${input.lineArtSettings.smoothness}
- BLACK AND WHITE ONLY - no shading, no color, no gradients
- Clean, continuous outlines suitable for coloring
- All areas should be clearly defined for easy coloring

**Complexity & Detail:**
- Difficulty level: ${input.difficulty}
- ${preset.description}

**Mood & Atmosphere:**
- Mood: ${input.mood}
- Keywords: ${moodKeywords}

**Composition:**
- Framing: ${input.framing}`;

    if (input.includeBackground && input.backgroundType) {
        prompt += `\n- Background: ${input.backgroundType}`;
    } else {
        prompt += `\n- Background: No background, single subject focus`;
    }

    if (input.extraDetails && input.extraDetails.length > 0) {
        prompt += `\n- Additional elements: ${input.extraDetails.join(', ')}`;
    }

    prompt += `\n\n**Critical Requirements:**
- Must be suitable for printing and coloring
- No shading or color fills
- Clear, bold outlines
- All shapes must be closed and colorable
- Professional coloring book quality`;

    return prompt;
}

/**
 * Generates multiple unique prompts for bulk page generation
 */
export function generateBulkColoringBookPrompts(
    input: ColoringBookInput
): string[] {
    const prompts: string[] = [];
    const variations = generateVariations(input.subject, input.pageCount);

    for (let i = 0; i < input.pageCount; i++) {
        const prompt = generateColoringBookPrompt(input, i + 1, variations[i]);
        prompts.push(prompt);
    }

    return prompts;
}

/**
 * Generates unique variations of the subject for bulk generation
 * Example: "fairy" → ["fairy with wings", "fairy in forest", "dancing fairy", etc.]
 */
function generateVariations(subject: string, count: number): string[] {
    const variations: string[] = [];

    // Variation patterns
    const actionVariations = [
        'standing', 'sitting', 'jumping', 'dancing', 'sleeping', 'playing',
        'flying', 'running', 'smiling', 'thinking', 'looking up', 'waving'
    ];

    const settingVariations = [
        'in a garden', 'under a tree', 'near flowers', 'by the water',
        'in the forest', 'among clouds', 'with stars', 'surrounded by nature',
        'in a magical place', 'with friends', 'alone', 'at sunset'
    ];

    const attributeVariations = [
        'with big eyes', 'with detailed patterns', 'with decorative elements',
        'with flowing hair', 'with accessories', 'wearing a hat', 'holding flowers',
        'with a crown', 'with wings', 'with a tail'
    ];

    const viewVariations = [
        'front view', 'side view', 'close-up', 'full body', 'portrait style',
        'from above', 'dynamic pose', 'peaceful pose'
    ];

    // Generate unique variations by combining patterns
    const allPatterns = [
        ...actionVariations.map(v => `${v}`),
        ...settingVariations.map(v => `${v}`),
        ...attributeVariations.map(v => `${v}`),
        ...viewVariations.map(v => `${v}`)
    ];

    // Shuffle and select variations
    const shuffled = allPatterns.sort(() => Math.random() - 0.5);

    for (let i = 0; i < count; i++) {
        if (i < shuffled.length) {
            variations.push(shuffled[i]);
        } else {
            // If we need more variations than patterns, combine them
            const idx1 = i % actionVariations.length;
            const idx2 = Math.floor(i / actionVariations.length) % settingVariations.length;
            variations.push(`${actionVariations[idx1]} ${settingVariations[idx2]}`);
        }
    }

    return variations;
}

/**
 * Build AI system prompt for coloring book generation (if using AI)
 */
export function buildColoringBookSystemPrompt(): string {
    return `You are an expert coloring book designer and illustrator.
Your task is to create detailed text prompts that can be used to generate high-quality coloring book pages.

Key principles:
1. All images must be black and white line art ONLY
2. No shading, gradients, or color fills
3. Clear, bold outlines suitable for coloring
4. Age-appropriate complexity based on category
5. All shapes must be closed for easy coloring

When generating prompts, consider:
- Line thickness and style
- Complexity appropriate for the target age group
- Composition and framing
- Background elements (if requested)
- Decorative details that enhance the design

Output only the complete prompt text, ready to be used for image generation.`;
}

/**
 * Build user message for AI (alternative approach using AI to enhance prompts)
 */
export function buildColoringBookUserMessage(input: ColoringBookInput): string {
    return `Create a coloring book page prompt with these specifications:

Subject: ${input.subject}
Category: ${input.category}
Difficulty: ${input.difficulty}
Style: ${input.style}
Mood: ${input.mood}
Line Art: ${input.lineArtSettings.thickness}, ${input.lineArtSettings.smoothness}
Framing: ${input.framing}
Background: ${input.includeBackground ? input.backgroundType : 'None'}
Extra Details: ${input.extraDetails.join(', ') || 'None'}

Generate a detailed, professional coloring book page prompt.`;
}
