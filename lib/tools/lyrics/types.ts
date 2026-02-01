// Interfaces for lyrics prompt generation

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

export interface SavedPrompt {
    id: string;
    userId: string;
    prompt: string;
    tags: string[];
    input: PromptInput;
    createdAt: Date;
}
