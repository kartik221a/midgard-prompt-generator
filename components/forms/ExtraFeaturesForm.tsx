'use client';

import { useLyricsStore } from '@/lib/tools/lyrics/store';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useState } from 'react';
import { AnimatedInput } from '@/components/reactbits/AnimatedInput';

const TARGET_PLATFORMS = ['Generic', 'Suno', 'Udio', 'ChatGPT', 'Claude', 'Gemini'];
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Korean', 'Italian', 'Portuguese'];

export function ExtraFeaturesForm() {
    const { input, setMusicality, setTargetPlatform, input: { musicality } } = useLyricsStore();
    const [instrumentInput, setInstrumentInput] = useState('');

    const handleAddInstrument = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && instrumentInput.trim()) {
            e.preventDefault();
            if (!musicality.instruments.includes(instrumentInput.trim())) {
                setMusicality({ instruments: [...musicality.instruments, instrumentInput.trim()] });
            }
            setInstrumentInput('');
        }
    };

    const removeInstrument = (inst: string) => {
        setMusicality({ instruments: musicality.instruments.filter((i) => i !== inst) });
    };

    return (
        <Card className="border-none bg-transparent shadow-none">
            <CardHeader>
                <CardTitle className="text-white drop-shadow-md font-bold text-3xl mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">4. Fine Tuning</CardTitle>
                <CardDescription className="text-primary-foreground/70 text-base">Target platform and specific instrumentation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

                <div className="space-y-2">
                    <Label className="text-primary font-semibold tracking-wide">Instrument Focus (Press Enter)</Label>
                    <AnimatedInput
                        placeholder="e.g., Heavy 808s, Acoustic Guitar... (paste allowed)"
                        value={instrumentInput}
                        onChange={(e) => setInstrumentInput(e.target.value)}
                        onKeyDown={handleAddInstrument}
                        onPaste={(e) => {
                            e.preventDefault();
                            const pastedData = e.clipboardData.getData('text');
                            if (pastedData) {
                                const newInstruments = pastedData.split(',').map((i) => i.trim()).filter((i) => i);
                                const uniqueInstruments = newInstruments.filter(i => !musicality.instruments.includes(i));
                                if (uniqueInstruments.length > 0) {
                                    setMusicality({ instruments: [...musicality.instruments, ...uniqueInstruments] });
                                }
                            }
                        }}
                        className="text-white"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                        {musicality.instruments.map((inst) => (
                            <Badge key={inst} variant="secondary" className="px-3 py-1 flex items-center gap-1">
                                {inst}
                                <span
                                    role="button"
                                    className="cursor-pointer hover:bg-white/10 rounded-full p-0.5 ml-1 transition-colors"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        removeInstrument(inst);
                                    }}
                                >
                                    <X className="w-3 h-3 hover:text-red-400" />
                                </span>
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-primary font-semibold tracking-wide">Language</Label>
                        <Select
                            value={input.language}
                            onValueChange={(v) => useLyricsStore.setState(s => ({ input: { ...s.input, language: v } }))}
                        >
                            <SelectTrigger className="bg-zinc-900/80 border-none text-white shadow-input">
                                <SelectValue placeholder="English" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                {LANGUAGES.map(l => <SelectItem key={l} value={l} className="focus:bg-zinc-800 focus:text-white">{l}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-primary font-semibold tracking-wide">Target AI Platform</Label>
                        <Select
                            value={input.targetPlatform || 'Generic'}
                            onValueChange={(v) => setTargetPlatform(v)}
                        >
                            <SelectTrigger className="bg-zinc-900/80 border-none text-white shadow-input">
                                <SelectValue placeholder="Generic" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                {TARGET_PLATFORMS.map(p => <SelectItem key={p} value={p} className="focus:bg-zinc-800 focus:text-white">{p}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
