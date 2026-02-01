// Interfaces for prompt generation

export interface SongMetadata {
    title?: string;
    story: string;
    keywords: string[];
}

export interface Musicality {
    genre: string;
    vibe: string;
    tempo: 'Slow' | 'Medium' | 'Fast';
    energy: 'Low' | 'Medium' | 'High';
    vocalStyle: string;
    instruments: string[];
}

export interface Structure {
    sections: string[]; // Still in interface for type compatibility, but ignored in generation logic if we want AI to decide
    rhymeComplexity: 'Simple' | 'Advanced' | 'Free Verse';
}

export interface PromptInput {
    metadata: SongMetadata;
    musicality: Musicality;
    structure: Structure;
    targetPlatform?: string;
    language?: string;
}

export const MASTER_PROMPT_TEMPLATE = `
🎧 MASTER LYRIC PROMPT — STORY-DRIVEN ({{GENRE_BLEND}})
You are writing lyrics for a modern {{GENRE}} blend with:
{{LYRIC_TONE_DESCRIPTION}}

🔹 NON-NEGOTIABLE RULES (QUALITY LOCK)
Lyrics must feel human, natural, and performable

Avoid clichés, filler, and robotic phrasing

Emotion must come from tone, pacing, and imagery, not over-explanation

The song should feel alive, intentional, and emotionally grounded


🔹 STORY FOUNDATION (CHANGE THIS EVERY SONG)
Before writing lyrics, internally anchor the song to the following story:
Story Context:
 {{GENERATED_STORY_CONTEXT}}
Narrative Perspective:
 {{GENERATED_PERSPECTIVE}}
Core Emotional Truth:
 {{GENERATED_EMOTIONAL_TRUTH}}
Key Motifs or Details:
 {{GENERATED_MOTIFS}}
Rules:
The lyrics must stay loyal to this story

Do not introduce unrelated events or emotions

Do not resolve the story unless the story explicitly calls for resolution


🔹 VIBE PARAMETERS (CHANGE THESE EACH TIME)
Before writing, internally define a clear identity for the song based on:
Primary mood: {{VIBE}}

Energy level: {{ENERGY}}

Time & place feeling: {{GENERATED_SETTING}}

Emotional angle: {{GENERATED_EMOTIONAL_ANGLE}}

Genre lean: {{GENRE}}

Do NOT reuse the same combination repeatedly.

🔹 LYRIC STYLE
Use imagery and language that serve the story and vibe

Verses should advance the story or deepen the moment

Chorus should express the emotional center of the story

Repetition is allowed only if it reinforces meaning or feeling


🔹 STRUCTURE & PERFORMANCE
Use sections as needed:
 [Intro]
 [Verse]
 [Build-up]
 [Chorus]
 [Drop]
 [Bridge]
 [Outro]
You may include performance cues such as:
 [instrumental]
 [drop]
 [bass drop]
 [build-up]
 [cut]
 [echo]
 [whisper]
 [break]
 [fade in]
 [fade out]
Rules:
One cue per line

Cues must be on their own line

Use cues to shape emotional and musical flow, not decoration


🔹 CREATIVE FREEDOM RULE
Each song must feel distinct from previous ones in at least one major way:
Mood OR

Tempo OR

Imagery OR

Emotional intent

Do not default to nighttime, cities, longing, or drifting unless the story requires it.

📤 OUTPUT REQUIREMENTS
Output ONLY the full song lyrics

Include performance cues inside the lyrics

Do NOT explain choices

Do NOT add commentary or metadata
`;

export function buildSystemPrompt(): string {
    return `You are an expert Creative Director and Prompt Engineer for Music AI.
Your goal is to generate a "Master Lyric Prompt" for a specific song concept.
You will be given raw details (Story, Genre, Vibe, Keywords).
You must transform these details into the provided "MASTER LYRIC PROMPT" template.

CRITICAL INSTRUCTIONS:
1. **Invent**: You must creatively invent the "Story Context", "Narrative Perspective", "Core Emotional Truth", "Time & place feeling", and "Emotional angle" based on the user's raw story/keywords. Make them specific, evocative, and artistic.
2. **Format**: Output the final text exactly in the format of the MASTER PROMPT TEMPLATE.
3. **No Structure List**: Do NOT output the user's manual structure list (Intro -> Verse). Instead, keep the static "STRUCTURE & PERFORMANCE" section regarding "Use sections as needed" exactly as is in the template, so the downstream AI decides the structure.
4. **Tone**: Use the "Vibe" and "Genre" to write a short "LYRIC_TONE_DESCRIPTION" (e.g., "storytelling lyrics, emotional vocals, soft synths...").
5. **NO GENEREATION**: You are writing a SPECIFICATION/PROMPT for another AI. Do NOT write the actual lyrics. Your output must end after the "OUTPUT REQUIREMENTS" section. Do not provide any example lyrics.

Template to Fill:
${MASTER_PROMPT_TEMPLATE}`;
}

export function buildUserMessage(input: PromptInput): string {
    const { metadata, musicality, language } = input;

    return `
Create a Master Lyric Prompt for this song idea:

Raw Story/Concept: ${metadata.story}
Keywords: ${metadata.keywords.join(', ')}
Genre: ${musicality.genre}
Vibe: ${musicality.vibe}
Energy: ${musicality.energy}
Tempo: ${musicality.tempo}
Instruments: ${musicality.instruments.join(', ')}
Language: ${language || 'English'}

Fill in the template creatively.
`;
}
