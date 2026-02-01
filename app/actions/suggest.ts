'use server';

import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import { AIManager } from '@/lib/ai/AIManager';

const MusicalitySchema = z.object({
    genre: z.string().describe('The most fitting musical genre from: Pop, Hip-Hop, Rock, Electronic, R&B, Country, Metal, Jazz, Classical, Lo-Fi'),
    vibe: z.string().describe('The primary emotional vibe: Energetic, Melancholic, Chill, Aggressive, Romantic, Dark, Uplifting, Dreamy'),
    tempo: z.enum(['Slow', 'Medium', 'Fast']).describe('Tempo of the track'),
    energy: z.enum(['Low', 'Medium', 'High']).describe('Energy level of the track'),
    vocalStyle: z.string().describe('Suggested vocal style: Male, Female, Duet, Choir, Robot/Synth, None (Instrumental)'),
});

export async function suggestMusicalityAction(story: string, keywords: string[]) {
    try {
        const model = AIManager.getModel('openrouter', 'google/gemini-2.0-flash-001');

        // We use generateObject to get structured JSON efficiently
        const { object } = await generateObject({
            model,
            schema: MusicalitySchema,
            prompt: `
        Analyze the following song concept and suggest the best musicality settings.
        
        Story: "${story}"
        Keywords: ${keywords.join(', ')}

        Choose the most suitable Genre, Vibe, Tempo, Energy, and Vocal Style.
      `,
            temperature: 0.5,
        });

        return { musicality: object };
    } catch (error) {
        console.error("Suggestion Error (generateObject):", error);

        // Fallback: Try generating text and parsing manually if structured generation fails
        try {
            console.log("Attempting fallback text generation...");
            const model = AIManager.getModel('openrouter', 'google/gemini-2.0-flash-001');
            const { text } = await generateText({
                model,
                prompt: `
                Analyze this song concept: Story="${story}", Keywords="${keywords.join(', ')}".
                Return a valid JSON object strictly matching this schema:
                {
                  "genre": "Pop" | "Hip-Hop" | "Rock" | "Electronic" | "R&B" | "Country" | "Metal" | "Jazz" | "Classical" | "Lo-Fi",
                  "vibe": "Energetic" | "Melancholic" | "Chill" | "Aggressive" | "Romantic" | "Dark" | "Uplifting" | "Dreamy",
                  "tempo": "Slow" | "Medium" | "Fast",
                  "energy": "Low" | "Medium" | "High",
                  "vocalStyle": "Male" | "Female" | "Duet" | "Choir" | "Robot/Synth" | "None (Instrumental)"
                }
                Do not include markdown formatting like \`\`\`json. Just the raw JSON string.
                `
            });

            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const manuallyParsed = JSON.parse(cleanText);
            // Basic validation
            if (manuallyParsed.genre && manuallyParsed.vibe) {
                return { musicality: manuallyParsed };
            }
        } catch (fallbackError) {
            console.error("Fallback Error:", fallbackError);
        }

        return { error: 'Failed to suggest musicality. Please check your API key quotas.' };
    }
}
