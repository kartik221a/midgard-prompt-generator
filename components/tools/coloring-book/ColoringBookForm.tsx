'use client';

import { useColoringBookStore } from '@/lib/tools/coloring-book/store';
import {
    CATEGORIES,
    DIFFICULTY_LEVELS,
    STYLES,
    MOODS,
    BACKGROUND_TYPES,
    FRAMINGS,
    LINE_THICKNESS_OPTIONS,
    LINE_SMOOTHNESS_OPTIONS,
    EXTRA_DETAILS_OPTIONS,
    SUBJECT_SUGGESTIONS,
    CATEGORY_PRESETS
} from '@/lib/tools/coloring-book/constants';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AnimatedInput } from '@/components/reactbits/AnimatedInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { ChevronDown, Info, Sparkles } from 'lucide-react';

export function ColoringBookForm() {
    const { input, setCategory, setSubject, setDifficulty, setStyle, setMood, setIncludeBackground, setBackgroundType, setFraming, setLineThickness, setLineSmoothness, setExtraDetails, setPageCount } = useColoringBookStore();
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const currentPreset = CATEGORY_PRESETS[input.category];

    const toggleDetail = (detail: string) => {
        if (input.extraDetails.includes(detail)) {
            setExtraDetails(input.extraDetails.filter(d => d !== detail));
        } else {
            setExtraDetails([...input.extraDetails, detail]);
        }
    };

    return (
        <div className="space-y-6">
            {/* Category Selector */}
            <Card className="border-none bg-transparent shadow-none">
                <CardHeader>
                    <CardTitle className="text-white drop-shadow-md font-bold text-3xl mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        1. Coloring Book Category
                    </CardTitle>
                    <CardDescription className="text-primary-foreground/70 text-base flex items-center gap-2">
                        Choose a category - it auto-adjusts complexity and style
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/30">
                            <Info className="w-3 h-3 mr-1" />
                            {currentPreset.description}
                        </Badge>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={input.category} onValueChange={(value: any) => setCategory(value)}>
                        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 !h-auto bg-transparent w-full">
                            {CATEGORIES.map((cat) => (
                                <TabsTrigger
                                    key={cat.value}
                                    value={cat.value}
                                    className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border-primary/40 border border-white/10 rounded-lg"
                                >
                                    <span className="text-2xl">{cat.emoji}</span>
                                    <span className="text-xs text-center">{cat.label}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Main Settings */}
            <Card className="border-none bg-transparent shadow-none">
                <CardHeader>
                    <CardTitle className="text-white drop-shadow-md font-bold text-3xl mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        2. Page Settings
                    </CardTitle>
                    <CardDescription className="text-primary-foreground/70 text-base">
                        Define what you want to create
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Subject */}
                    <div className="space-y-2">
                        <Label htmlFor="subject" className="text-primary font-semibold tracking-wide">
                            Subject / Theme <span className="text-red-400">*</span>
                        </Label>
                        <div className="relative">
                            <AnimatedInput
                                id="subject"
                                placeholder="e.g., unicorn, princess, underwater world..."
                                value={input.subject}
                                onChange={(e) => setSubject(e.target.value)}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                className="text-white"
                            />
                            {showSuggestions && input.subject.length === 0 && (
                                <div className="absolute z-10 w-full mt-2 p-3 bg-black/90 border border-white/20 rounded-lg shadow-xl">
                                    <p className="text-xs text-gray-400 mb-2">Popular suggestions:</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {SUBJECT_SUGGESTIONS.map((suggestion) => (
                                            <button
                                                key={suggestion}
                                                onMouseDown={() => setSubject(suggestion)}
                                                className="px-2 py-1 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 rounded text-xs text-gray-300 hover:text-primary transition-colors"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Difficulty */}
                    <div className="space-y-2">
                        <Label className="text-primary font-semibold tracking-wide">Difficulty Level</Label>
                        <Select value={input.difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                            <SelectTrigger className="bg-zinc-900/80 border-none text-white shadow-input">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {DIFFICULTY_LEVELS.map((level) => (
                                    <SelectItem key={level.value} value={level.value}>
                                        <div className="flex flex-col items-start">
                                            <span className="font-medium">{level.label}</span>
                                            <span className="text-xs text-gray-400">{level.description}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Style */}
                    <div className="space-y-2">
                        <Label className="text-primary font-semibold tracking-wide">Art Style</Label>
                        <Select value={input.style} onValueChange={(value: any) => setStyle(value)}>
                            <SelectTrigger className="bg-zinc-900/80 border-none text-white shadow-input">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {STYLES.map((style) => (
                                    <SelectItem key={style.value} value={style.value}>
                                        {style.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Mood */}
                    <div className="space-y-2">
                        <Label className="text-primary font-semibold tracking-wide">Mood / Vibe</Label>
                        <Select value={input.mood} onValueChange={(value: any) => setMood(value)}>
                            <SelectTrigger className="bg-zinc-900/80 border-none text-white shadow-input">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {MOODS.map((mood) => (
                                    <SelectItem key={mood.value} value={mood.value}>
                                        {mood.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Background Toggle */}
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="space-y-0.5">
                            <Label className="text-primary font-semibold">Include Background</Label>
                            <p className="text-xs text-gray-400">Add scenery or keep subject focused</p>
                        </div>
                        <Switch
                            checked={input.includeBackground}
                            onCheckedChange={setIncludeBackground}
                        />
                    </div>

                    {/* Background Type (conditional) */}
                    {input.includeBackground && (
                        <div className="space-y-2 ml-4 pl-4 border-l-2 border-primary/30">
                            <Label className="text-primary font-semibold tracking-wide text-sm">Background Type</Label>
                            <Select value={input.backgroundType} onValueChange={(value: any) => setBackgroundType(value)}>
                                <SelectTrigger className="bg-zinc-900/80 border-none text-white shadow-input">
                                    <SelectValue placeholder="Select background..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {BACKGROUND_TYPES.map((bg) => (
                                        <SelectItem key={bg.value} value={bg.value}>
                                            {bg.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Framing */}
                    <div className="space-y-2">
                        <Label className="text-primary font-semibold tracking-wide">Page Composition</Label>
                        <Select value={input.framing} onValueChange={(value: any) => setFraming(value)}>
                            <SelectTrigger className="bg-zinc-900/80 border-none text-white shadow-input">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {FRAMINGS.map((frame) => (
                                    <SelectItem key={frame.value} value={frame.value}>
                                        {frame.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Extra Details */}
                    <div className="space-y-2">
                        <Label className="text-primary font-semibold tracking-wide">Extra Details (Optional)</Label>
                        <div className="flex flex-wrap gap-2">
                            {EXTRA_DETAILS_OPTIONS.map((detail) => (
                                <button
                                    key={detail}
                                    type="button"
                                    onClick={() => toggleDetail(detail)}
                                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${input.extraDetails.includes(detail)
                                        ? 'bg-primary/20 text-primary border-2 border-primary/50'
                                        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    {detail}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Advanced Options */}
            <Card className="border-none bg-transparent shadow-none">
                <CardHeader>
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center justify-between w-full text-left"
                    >
                        <div>
                            <CardTitle className="text-white drop-shadow-md font-bold text-2xl mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                3. Advanced Options
                            </CardTitle>
                            <CardDescription className="text-primary-foreground/70 text-sm">
                                Fine-tune line art settings (optional)
                            </CardDescription>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                    </button>
                </CardHeader>
                {showAdvanced && (
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-primary font-semibold tracking-wide text-sm">Line Thickness</Label>
                            <Select value={input.lineArtSettings.thickness} onValueChange={(value: any) => setLineThickness(value)}>
                                <SelectTrigger className="bg-zinc-900/80 border-none text-white shadow-input">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {LINE_THICKNESS_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-primary font-semibold tracking-wide text-sm">Line Smoothness</Label>
                            <Select value={input.lineArtSettings.smoothness} onValueChange={(value: any) => setLineSmoothness(value)}>
                                <SelectTrigger className="bg-zinc-900/80 border-none text-white shadow-input">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {LINE_SMOOTHNESS_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* Page Count */}
            <Card className="border-none bg-transparent shadow-none">
                <CardHeader>
                    <CardTitle className="text-white drop-shadow-md font-bold text-3xl mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent flex items-center gap-2">
                        4. Bulk Generation
                        <Sparkles className="w-6 h-6 text-yellow-400" />
                    </CardTitle>
                    <CardDescription className="text-primary-foreground/70 text-base">
                        Generate multiple unique pages at once (max 50)
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="pageCount" className="text-primary font-semibold tracking-wide">
                            Number of Pages
                        </Label>
                        <div className="flex items-center gap-4">
                            <AnimatedInput
                                id="pageCount"
                                type="number"
                                min="1"
                                max="50"
                                value={input.pageCount}
                                onChange={(e) => setPageCount(parseInt(e.target.value) || 1)}
                                className="text-white w-24"
                            />
                            <span className="text-gray-400 text-sm">
                                {input.pageCount === 1 ? '1 page' : `${input.pageCount} pages`}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            Each page will have unique variations while maintaining your chosen style and settings.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
