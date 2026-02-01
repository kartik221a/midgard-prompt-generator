import { create } from 'zustand';
import { PromptInput, SongMetadata, Musicality, Structure } from './types';

interface PromptState {
    input: PromptInput;
    generatedPrompt: string;
    generatedTags: string[];
    isGenerating: boolean;

    // Actions
    setMetadata: (metadata: Partial<SongMetadata>) => void;
    setMusicality: (musicality: Partial<Musicality>) => void;
    setStructure: (structure: Partial<Structure>) => void;
    setTargetPlatform: (platform: string) => void;
    setGeneratedPrompt: (prompt: string) => void;
    setGeneratedTags: (tags: string[]) => void;
    setIsGenerating: (isGenerating: boolean) => void;
    reset: () => void;
}

const defaultInput: PromptInput = {
    metadata: {
        story: '',
        keywords: [],
        title: ''
    },
    musicality: {
        genre: 'Pop',
        vibe: 'Neutral',
        tempo: 'Medium',
        energy: 'Medium',
        vocalStyle: 'Clean',
        instruments: []
    },
    structure: {
        sections: ['Intro', 'Verse 1', 'Chorus', 'Verse 2', 'Chorus', 'Outro'],
        rhymeComplexity: 'Advanced'
    },
    language: 'English'
};

export const useLyricsStore = create<PromptState>((set) => ({
    input: defaultInput,
    generatedPrompt: '',
    generatedTags: [],
    isGenerating: false,

    setMetadata: (metadata) => set((state) => ({
        input: { ...state.input, metadata: { ...state.input.metadata, ...metadata } }
    })),
    setMusicality: (musicality) => set((state) => ({
        input: { ...state.input, musicality: { ...state.input.musicality, ...musicality } }
    })),
    setStructure: (structure) => set((state) => ({
        input: { ...state.input, structure: { ...state.input.structure, ...structure } }
    })),
    setTargetPlatform: (platform) => set((state) => ({
        input: { ...state.input, targetPlatform: platform }
    })),
    setGeneratedPrompt: (prompt) => set({ generatedPrompt: prompt }),
    setGeneratedTags: (tags) => set({ generatedTags: tags }),
    setIsGenerating: (isGenerating) => set({ isGenerating }),
    reset: () => set({ input: defaultInput, generatedPrompt: '', generatedTags: [] }),
}));
