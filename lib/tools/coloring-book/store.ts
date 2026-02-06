import { create } from 'zustand';
import { ColoringBookInput, Category, DifficultyLevel, Style, Mood, BackgroundType, Framing, LineThickness, LineSmoothness } from './types';
import { CATEGORY_PRESETS } from './constants';

interface ColoringBookState {
    input: ColoringBookInput;
    generatedPrompts: string[];
    isGenerating: boolean;
    currentBookTitle: string;

    // Actions
    setCategory: (category: Category) => void;
    setSubject: (subject: string) => void;
    setDifficulty: (difficulty: DifficultyLevel) => void;
    setStyle: (style: Style) => void;
    setMood: (mood: Mood) => void;
    setIncludeBackground: (include: boolean) => void;
    setBackgroundType: (type: BackgroundType) => void;
    setLineThickness: (thickness: LineThickness) => void;
    setLineSmoothness: (smoothness: LineSmoothness) => void;
    setFraming: (framing: Framing) => void;
    setExtraDetails: (details: string[]) => void;
    setPageCount: (count: number) => void;
    setGeneratedPrompts: (prompts: string[]) => void;
    setIsGenerating: (isGenerating: boolean) => void;
    setCurrentBookTitle: (title: string) => void;
    reset: () => void;
}

const defaultInput: ColoringBookInput = {
    category: 'kids-6-9',
    subject: '',
    difficulty: 'simple',
    style: 'cute-rounded',
    mood: 'happy-playful',
    includeBackground: false,
    backgroundType: undefined,
    lineArtSettings: {
        thickness: 'medium',
        smoothness: 'smooth-continuous'
    },
    framing: 'centered-subject',
    extraDetails: [],
    pageCount: 1
};

export const useColoringBookStore = create<ColoringBookState>((set) => ({
    input: defaultInput,
    generatedPrompts: [],
    isGenerating: false,
    currentBookTitle: '',

    setCategory: (category) => set((state) => {
        const preset = CATEGORY_PRESETS[category];
        return {
            input: {
                ...state.input,
                category,
                difficulty: preset.defaultDifficulty,
                lineArtSettings: {
                    ...state.input.lineArtSettings,
                    thickness: preset.lineThickness
                }
            }
        };
    }),

    setSubject: (subject) => set((state) => ({
        input: { ...state.input, subject }
    })),

    setDifficulty: (difficulty) => set((state) => ({
        input: { ...state.input, difficulty }
    })),

    setStyle: (style) => set((state) => ({
        input: { ...state.input, style }
    })),

    setMood: (mood) => set((state) => ({
        input: { ...state.input, mood }
    })),

    setIncludeBackground: (include) => set((state) => ({
        input: { ...state.input, includeBackground: include }
    })),

    setBackgroundType: (type) => set((state) => ({
        input: { ...state.input, backgroundType: type }
    })),

    setLineThickness: (thickness) => set((state) => ({
        input: {
            ...state.input,
            lineArtSettings: { ...state.input.lineArtSettings, thickness }
        }
    })),

    setLineSmoothness: (smoothness) => set((state) => ({
        input: {
            ...state.input,
            lineArtSettings: { ...state.input.lineArtSettings, smoothness }
        }
    })),

    setFraming: (framing) => set((state) => ({
        input: { ...state.input, framing }
    })),

    setExtraDetails: (details) => set((state) => ({
        input: { ...state.input, extraDetails: details }
    })),

    setPageCount: (count) => set((state) => ({
        input: { ...state.input, pageCount: Math.min(Math.max(1, count), 100) }
    })),

    setGeneratedPrompts: (prompts) => set({ generatedPrompts: prompts }),
    setIsGenerating: (isGenerating) => set({ isGenerating }),
    setCurrentBookTitle: (title) => set({ currentBookTitle: title }),

    reset: () => set({
        input: defaultInput,
        generatedPrompts: [],
        currentBookTitle: '',
        isGenerating: false
    })
}));
