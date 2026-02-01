import { Category, DifficultyLevel, Style, Mood, BackgroundType, Framing, LineThickness, LineSmoothness } from './types';

// Category Presets - automatically control complexity and style
export const CATEGORY_PRESETS: Record<Category, {
    lineThickness: LineThickness;
    defaultDifficulty: DifficultyLevel;
    moodKeywords: string[];
    description: string;
}> = {
    'kids-3-6': {
        lineThickness: 'bold-thick',
        defaultDifficulty: 'very-simple',
        moodKeywords: ['happy', 'playful', 'bright', 'simple', 'fun'],
        description: 'Very simple shapes, big areas, minimal details'
    },
    'kids-6-9': {
        lineThickness: 'medium',
        defaultDifficulty: 'simple',
        moodKeywords: ['fun', 'engaging', 'colorful', 'friendly'],
        description: 'Simple with some details, clear shapes'
    },
    'kids-9-12': {
        lineThickness: 'medium',
        defaultDifficulty: 'medium',
        moodKeywords: ['creative', 'adventurous', 'cool', 'engaging'],
        description: 'Moderate complexity, more elements'
    },
    'adult-relaxation': {
        lineThickness: 'thin-clean',
        defaultDifficulty: 'highly-detailed',
        moodKeywords: ['calm', 'peaceful', 'meditative', 'zen', 'relaxing'],
        description: 'Intricate patterns, detailed line work'
    },
    'mandala': {
        lineThickness: 'thin-clean',
        defaultDifficulty: 'highly-detailed',
        moodKeywords: ['symmetrical', 'meditative', 'balanced', 'harmonious'],
        description: 'Circular, symmetrical patterns'
    },
    'fantasy': {
        lineThickness: 'medium',
        defaultDifficulty: 'detailed',
        moodKeywords: ['magical', 'whimsical', 'enchanting', 'imaginative'],
        description: 'Fantasy creatures, magical scenes'
    },
    'nature': {
        lineThickness: 'medium',
        defaultDifficulty: 'medium',
        moodKeywords: ['natural', 'organic', 'peaceful', 'serene'],
        description: 'Animals, plants, landscapes'
    },
    'cute-kawaii': {
        lineThickness: 'medium',
        defaultDifficulty: 'simple',
        moodKeywords: ['cute', 'adorable', 'sweet', 'charming', 'kawaii'],
        description: 'Big eyes, rounded features, adorable'
    },
    'educational': {
        lineThickness: 'bold-thick',
        defaultDifficulty: 'very-simple',
        moodKeywords: ['clear', 'simple', 'learning', 'educational'],
        description: 'Letters, numbers, shapes, learning concepts'
    },
    'seasonal-holiday': {
        lineThickness: 'medium',
        defaultDifficulty: 'medium',
        moodKeywords: ['festive', 'celebratory', 'joyful', 'seasonal'],
        description: 'Holiday themes, seasonal celebrations'
    }
};

export const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
    { value: 'kids-3-6', label: 'Kids (3-6 years)', emoji: '👶' },
    { value: 'kids-6-9', label: 'Kids (6-9 years)', emoji: '🧒' },
    { value: 'kids-9-12', label: 'Kids (9-12 years)', emoji: '👦' },
    { value: 'adult-relaxation', label: 'Adult Relaxation', emoji: '🧘' },
    { value: 'mandala', label: 'Mandala & Patterns', emoji: '🌸' },
    { value: 'fantasy', label: 'Fantasy & Mythical', emoji: '🦄' },
    { value: 'nature', label: 'Nature & Animals', emoji: '🦋' },
    { value: 'cute-kawaii', label: 'Cute / Kawaii', emoji: '🌈' },
    { value: 'educational', label: 'Educational', emoji: '📚' },
    { value: 'seasonal-holiday', label: 'Seasonal & Holiday', emoji: '🎄' }
];

export const DIFFICULTY_LEVELS: { value: DifficultyLevel; label: string; description: string }[] = [
    { value: 'very-simple', label: 'Very Simple', description: 'Big shapes, minimal lines' },
    { value: 'simple', label: 'Simple', description: 'Easy to color, clear outlines' },
    { value: 'medium', label: 'Medium', description: 'Balanced detail level' },
    { value: 'detailed', label: 'Detailed', description: 'More intricate elements' },
    { value: 'highly-detailed', label: 'Highly Detailed', description: 'Intricate patterns, complex' }
];

export const STYLES: { value: Style; label: string }[] = [
    { value: 'cute-rounded', label: 'Cute & Rounded' },
    { value: 'cartoon', label: 'Cartoon' },
    { value: 'realistic', label: 'Realistic' },
    { value: 'kawaii', label: 'Kawaii' },
    { value: 'hand-drawn', label: 'Hand-Drawn' },
    { value: 'doodle', label: 'Doodle' },
    { value: 'zentangle', label: 'Zentangle' },
    { value: 'mandala', label: 'Mandala' },
    { value: 'storybook', label: 'Storybook Illustration' },
    { value: 'intricate-line-art', label: 'Intricate Line Art' },
    { value: 'ornamental', label: 'Ornamental' },
    { value: 'symmetrical', label: 'Symmetrical' },
    { value: 'tattoo-style', label: 'Tattoo Style' }
];

export const MOODS: { value: Mood; label: string }[] = [
    { value: 'happy-playful', label: 'Happy & Playful' },
    { value: 'calm-peaceful', label: 'Calm & Peaceful' },
    { value: 'magical', label: 'Magical' },
    { value: 'whimsical', label: 'Whimsical' },
    { value: 'cozy', label: 'Cozy' },
    { value: 'mysterious', label: 'Mysterious' },
    { value: 'fantasy-dreamlike', label: 'Fantasy Dreamlike' },
    { value: 'relaxing-meditative', label: 'Relaxing / Meditative' }
];

export const BACKGROUND_TYPES: { value: BackgroundType; label: string }[] = [
    { value: 'nature', label: 'Nature (forest, beach, sky)' },
    { value: 'city', label: 'City' },
    { value: 'fantasy-world', label: 'Fantasy World' },
    { value: 'pattern-background', label: 'Pattern Background' },
    { value: 'simple-shapes', label: 'Simple Background Shapes' }
];

export const FRAMINGS: { value: Framing; label: string }[] = [
    { value: 'centered-subject', label: 'Centered Subject' },
    { value: 'full-page-scene', label: 'Full-Page Scene' },
    { value: 'border-frame', label: 'Border Frame' },
    { value: 'circular-mandala', label: 'Circular Mandala' },
    { value: 'square-composition', label: 'Square Composition' }
];

export const LINE_THICKNESS_OPTIONS: { value: LineThickness; label: string }[] = [
    { value: 'bold-thick', label: 'Bold Thick Outlines' },
    { value: 'medium', label: 'Medium Outlines' },
    { value: 'thin-clean', label: 'Thin Clean Outlines' }
];

export const LINE_SMOOTHNESS_OPTIONS: { value: LineSmoothness; label: string }[] = [
    { value: 'smooth-continuous', label: 'Smooth Continuous Lines' },
    { value: 'textured', label: 'Textured Lines' },
    { value: 'hand-drawn-style', label: 'Hand-Drawn Style' }
];

export const EXTRA_DETAILS_OPTIONS = [
    'Decorative patterns',
    'Repeating shapes',
    'Flowers & leaves',
    'Stars & sparkles',
    'Geometric elements',
    'Hidden objects'
];

export const SUBJECT_SUGGESTIONS = [
    // Animals
    'Lion', 'Unicorn', 'Puppy', 'Kitten', 'Elephant', 'Butterfly', 'Owl', 'Fox', 'Dragon',
    // Characters
    'Princess', 'Robot', 'Astronaut', 'Fairy', 'Mermaid', 'Superhero', 'Wizard',
    // Objects
    'House', 'Car', 'Castle', 'Flower', 'Tree', 'Sun', 'Moon', 'Rainbow',
    // Scenes
    'Park', 'Underwater world', 'Space', 'Forest', 'Garden', 'Beach', 'Mountain'
];
