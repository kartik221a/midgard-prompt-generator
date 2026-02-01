'use client';

import { usePromptStore } from '@/store/usePromptStore';
import { useAuth } from '@/context/AuthContext';
import CyberButton from '@/components/reactbits/CyberButton';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AnimatedTextarea } from '@/components/reactbits/AnimatedTextarea';
import { Copy, Check, Sparkles, Save } from 'lucide-react';
import { useState } from 'react';
import { generateLyricPromptAction } from '@/app/actions/generate';
import { toast } from 'sonner';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function GeneratedResult() {
    const { input, generatedPrompt, generatedTags, isGenerating, setGeneratedPrompt, setGeneratedTags, setIsGenerating } = usePromptStore();
    const { user } = useAuth();
    const [copied, setCopied] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const result = await generateLyricPromptAction(input, 'openrouter', 'google/gemini-2.0-flash-001');
            if (result.error) {
                toast.error('Generation Failed', { description: result.error });
            } else {
                setGeneratedPrompt(result.prompt);
                setGeneratedTags(result.tags || []);
                toast.success('Prompt Generated!');
            }
        } catch (e) {
            toast.error('Something went wrong');
        } finally {
            setIsGenerating(false);
        }
    };

    // ... (inside handleSave)
    const handleSave = async () => {
        if (!generatedPrompt) return;
        if (!user) {
            toast.error("Please login to save prompts.");
            return;
        }

        setIsSaving(true);
        try {
            await addDoc(collection(db, 'prompts'), {
                userId: user.uid, // Add User ID
                userEmail: user.email, // Optional: helpful for admin debugging
                prompt: generatedPrompt,
                tags: generatedTags,
                metadata: input.metadata,
                musicality: input.musicality,
                structure: input.structure,
                createdAt: serverTimestamp(),
            });
            toast.success('Saved to Library');
        } catch (e) {
            console.error(e);
            toast.error('Failed to save', { description: 'Make sure you are authenticated if rules require it.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCopy = () => {
        if (!generatedPrompt) return;
        navigator.clipboard.writeText(generatedPrompt);
        setCopied(true);
        toast.success('Copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-4">
            <CyberButton
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-4 text-lg"
            >
                {isGenerating ? (
                    <>Generating <Sparkles className="w-5 h-5 ml-2 animate-spin" /></>
                ) : (
                    <>Generate Master Prompt <Sparkles className="w-5 h-5 ml-2" /></>
                )}
            </CyberButton>

            {generatedPrompt && (
                <Card className="border border-primary/20 bg-black/40 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-primary">Generated Master Prompt</CardTitle>
                        <div className="flex gap-2">
                            <CyberButton variant="secondary" onClick={handleSave} disabled={isSaving} className="text-xs px-3 py-1 bg-transparent border-primary/30">
                                <Save className="w-3 h-3 mr-2" />
                                {isSaving ? 'Saving...' : 'Save'}
                            </CyberButton>
                            <button onClick={handleCopy} className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <AnimatedTextarea
                            readOnly
                            value={generatedPrompt}
                            className="min-h-[300px] font-mono text-sm border-0 focus-visible:ring-0 resize-y text-gray-300"
                        />

                        {generatedTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                                {generatedTags.map((tag) => (
                                    <span key={tag} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-400">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="text-xs text-gray-500 pt-0">
                        Ready to paste into Suno, Udio, or ChatGPT.
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
