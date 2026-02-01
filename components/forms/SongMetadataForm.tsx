'use client';

import { useLyricsStore } from '@/lib/tools/lyrics/store';
import { AnimatedInput } from '@/components/reactbits/AnimatedInput';
import { AnimatedTextarea } from '@/components/reactbits/AnimatedTextarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useState } from 'react';

export function SongMetadataForm() {
    const { input, setMetadata } = useLyricsStore();
    const [keywordInput, setKeywordInput] = useState('');

    const handleAddKeyword = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && keywordInput.trim()) {
            e.preventDefault();
            if (!input.metadata.keywords.includes(keywordInput.trim())) {
                setMetadata({ keywords: [...input.metadata.keywords, keywordInput.trim()] });
            }
            setKeywordInput('');
        }
    };

    const removeKeyword = (kw: string) => {
        setMetadata({ keywords: input.metadata.keywords.filter((k) => k !== kw) });
    };

    return (
        <Card className="border-none bg-transparent shadow-none">
            <CardHeader>
                <CardTitle className="text-white drop-shadow-md font-bold text-3xl mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">1. Song Metadata & Story</CardTitle>
                <CardDescription className="text-primary-foreground/70 text-base">Define the core narrative and theme.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-primary font-semibold tracking-wide">Song Title (Optional)</Label>
                    <AnimatedInput
                        id="title"
                        placeholder="e.g., Neon Nights"
                        value={input.metadata.title}
                        onChange={(e) => setMetadata({ title: e.target.value })}
                        className="text-white"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="story" className="text-primary font-semibold tracking-wide">Story / Concept</Label>
                    <AnimatedTextarea
                        id="story"
                        placeholder="Describe the narrative. e.g., A cyberpunk detective..."
                        value={input.metadata.story}
                        onChange={(e) => setMetadata({ story: e.target.value })}
                        className="text-white"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="keywords" className="text-primary font-semibold tracking-wide">Keywords / Motifs</Label>
                    <AnimatedInput
                        id="keywords"
                        placeholder="Type and press Enter... (or paste comma-separated)"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={handleAddKeyword}
                        onPaste={(e) => {
                            e.preventDefault();
                            const pastedData = e.clipboardData.getData('text');
                            if (pastedData) {
                                const newKeywords = pastedData.split(',').map((k) => k.trim()).filter((k) => k);
                                const uniqueKeywords = newKeywords.filter(k => !input.metadata.keywords.includes(k));
                                if (uniqueKeywords.length > 0) {
                                    setMetadata({ keywords: [...input.metadata.keywords, ...uniqueKeywords] });
                                }
                            }
                        }}
                        className="text-white"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                        {input.metadata.keywords.map((kw) => (
                            <Badge key={kw} variant="secondary" className="px-3 py-1 text-sm flex items-center gap-1 bg-primary/20 text-primary border border-primary/30">
                                {kw}
                                <span
                                    role="button"
                                    className="cursor-pointer hover:bg-white/10 rounded-full p-0.5 ml-1 transition-colors"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        removeKeyword(kw);
                                    }}
                                >
                                    <X className="w-3 h-3 hover:text-white" />
                                </span>
                            </Badge>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
