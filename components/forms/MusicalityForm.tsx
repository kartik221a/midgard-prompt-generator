'use client';

import { useLyricsStore } from '@/lib/tools/lyrics/store';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CyberButton from '@/components/reactbits/CyberButton';
import { cn } from '@/lib/utils';

import { suggestMusicalityAction } from '@/app/actions/suggest';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';

const GENRES = ['Pop', 'Hip-Hop', 'Rock', 'Electronic', 'R&B', 'Country', 'Metal', 'Jazz', 'Classical', 'Lo-Fi'];
const VIBES = ['Energetic', 'Melancholic', 'Chill', 'Aggressive', 'Romantic', 'Dark', 'Uplifting', 'Dreamy'];
const VOCAL_STYLES = ['Male', 'Female', 'Duet', 'Choir', 'Robot/Synth', 'None (Instrumental)'];

export function MusicalityForm() {
    const { input, setMusicality } = useLyricsStore();
    const { musicality } = input;
    const [isSuggesting, setIsSuggesting] = useState(false);

    const handleAutoSuggest = async () => {
        if (!input.metadata.story && input.metadata.keywords.length === 0) {
            toast.error("Enter a story or keywords first!");
            return;
        }

        setIsSuggesting(true);
        const loadingToast = toast.loading("Analyzing vibe...");

        try {
            const result = await suggestMusicalityAction(input.metadata.story, input.metadata.keywords);
            if (result.musicality) {
                setMusicality(result.musicality);
                toast.success("Musicality adjusted to story!");
            } else {
                toast.error("Could not determine style.");
            }
        } catch (e) {
            toast.error("Auto-suggest failed.");
        } finally {
            setIsSuggesting(false);
            toast.dismiss(loadingToast);
        }
    };

    return (
        <Card className="border-none bg-transparent shadow-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-white drop-shadow-md font-bold text-3xl mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">2. Musicality & Style</CardTitle>
                    <CardDescription className="text-primary-foreground/70 text-base">Define the sonic landscape.</CardDescription>
                </div>
                <CyberButton
                    onClick={handleAutoSuggest}
                    disabled={isSuggesting}
                    className="h-8 text-xs px-3 bg-primary/20 hover:bg-primary/40 text-primary-foreground border-primary/30"
                >
                    <Sparkles className={`w-3 h-3 mr-2 ${isSuggesting ? 'animate-spin' : ''}`} />
                    {isSuggesting ? 'Analysing...' : 'Auto-Match Vibe'}
                </CyberButton>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Genre Selection */}
                <div className="space-y-3">
                    <Label className="text-primary font-semibold tracking-wide">Genre</Label>
                    <div className="flex flex-wrap gap-2">
                        {GENRES.map((g) => (
                            <CyberButton
                                key={g}
                                type="button"
                                variant={musicality.genre === g ? "primary" : "secondary"}
                                onClick={() => setMusicality({ genre: g })}
                                className={cn("px-4 py-1.5 text-xs font-normal transition-all hover:scale-105", musicality.genre !== g && "bg-transparent border-primary/20 text-primary-foreground/60 hover:text-white hover:border-primary/50")}
                            >
                                {g}
                            </CyberButton>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-primary font-semibold tracking-wide">Vibe</Label>
                        <Select value={musicality.vibe} onValueChange={(v) => setMusicality({ vibe: v })}>
                            <SelectTrigger className="bg-zinc-900/80 border-none text-white shadow-input">
                                <SelectValue placeholder="Select Vibe" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                {VIBES.map(v => <SelectItem key={v} value={v} className="focus:bg-zinc-800 focus:text-white">{v}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-primary font-semibold tracking-wide">Vocal Style</Label>
                        <Select value={musicality.vocalStyle} onValueChange={(v) => setMusicality({ vocalStyle: v })}>
                            <SelectTrigger className="bg-zinc-900/80 border-none text-white shadow-input">
                                <SelectValue placeholder="Select Vocals" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                {VOCAL_STYLES.map(v => <SelectItem key={v} value={v} className="focus:bg-zinc-800 focus:text-white">{v}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-4 pt-2">
                    <div className="flex justify-between">
                        <Label className="text-primary font-semibold tracking-wide">Tempo ({musicality.tempo})</Label>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-primary-foreground/60 w-12">Slow</span>
                        <Slider
                            defaultValue={[50]}
                            min={0}
                            max={100}
                            step={1}
                            value={[musicality.tempo === 'Slow' ? 25 : musicality.tempo === 'Medium' ? 50 : 75]}
                            onValueChange={(vals) => {
                                const v = vals[0];
                                let t = 'Medium';
                                if (v < 33) t = 'Slow';
                                else if (v > 66) t = 'Fast';
                                setMusicality({ tempo: t as any });
                            }}
                            className="flex-1"
                        />
                        <span className="text-xs text-primary-foreground/60 w-12 text-right">Fast</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between">
                        <Label className="text-primary font-semibold tracking-wide">Energy Level ({musicality.energy})</Label>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-primary-foreground/60 w-12">Low</span>
                        <Slider
                            defaultValue={[50]}
                            min={0}
                            max={100}
                            step={1}
                            value={[musicality.energy === 'Low' ? 25 : musicality.energy === 'Medium' ? 50 : 75]}
                            onValueChange={(vals) => {
                                const v = vals[0];
                                let e = 'Medium';
                                if (v < 33) e = 'Low';
                                else if (v > 66) e = 'High';
                                setMusicality({ energy: e as any });
                            }}
                            className="flex-1"
                        />
                        <span className="text-xs text-primary-foreground/60 w-12 text-right">High</span>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
