// Types for Coloring Book Generator

export type Category =
    | 'kids-3-6' | 'kids-6-9' | 'kids-9-12'
    | 'adult-relaxation' | 'mandala' | 'fantasy'
    | 'nature' | 'cute-kawaii' | 'educational'
    | 'seasonal-holiday';

export type DifficultyLevel =
    | 'very-simple' | 'simple' | 'medium'
    | 'detailed' | 'highly-detailed';

export type Style =
    | 'cute-rounded' | 'cartoon' | 'realistic'
    | 'kawaii' | 'hand-drawn' | 'doodle'
    | 'zentangle' | 'mandala' | 'storybook'
    | 'intricate-line-art' | 'ornamental'
    | 'symmetrical' | 'tattoo-style';

export type Mood =
    | 'happy-playful' | 'calm-peaceful' | 'magical'
    | 'whimsical' | 'cozy' | 'mysterious'
    | 'fantasy-dreamlike' | 'relaxing-meditative';

export type BackgroundType =
    | 'nature' | 'city' | 'fantasy-world'
    | 'pattern-background' | 'simple-shapes';

export type Framing =
    | 'centered-subject' | 'full-page-scene'
    | 'border-frame' | 'circular-mandala'
    | 'square-composition';

export type LineThickness =
    | 'bold-thick' | 'medium' | 'thin-clean';

export type LineSmoothness =
    | 'smooth-continuous' | 'textured' | 'hand-drawn-style';

export interface ColoringBookInput {
    category: Category;
    subject: string;
    difficulty: DifficultyLevel;
    style: Style;
    mood: Mood;
    includeBackground: boolean;
    backgroundType?: BackgroundType;
    lineArtSettings: {
        thickness: LineThickness;
        smoothness: LineSmoothness;
    };
    framing: Framing;
    extraDetails: string[];
    pageCount: number;  // For bulk generation
}

export interface ColoringBookPrompt {
    id: string;
    bookId: string;
    bookTitle: string;
    pageNumber: number;
    prompt: string;
    settings: ColoringBookInput;
    createdAt: Date;
}

export interface ColoringBook {
    id: string;
    userId: string;
    title: string;
    category: Category;
    pageCount: number;
    prompts: ColoringBookPrompt[];
    settings: ColoringBookInput;  // Shared settings across all pages
    createdAt: Date;
}
