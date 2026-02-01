'use client';

import { useColoringBookStore } from '@/lib/tools/coloring-book/store';
import { useAuth } from '@/context/AuthContext';
import CyberButton from '@/components/reactbits/CyberButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, Sparkles, Save, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { generateColoringBookPromptsAction } from '@/app/actions/coloring-book';
import { toast } from 'sonner';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { AnimatedInput } from '@/components/reactbits/AnimatedInput';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ColoringBookResult() {
    const { input, generatedPrompts, isGenerating, setGeneratedPrompts, setIsGenerating, setCurrentBookTitle } = useColoringBookStore();
    const { user } = useAuth();
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [bookTitle, setBookTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleGenerate = async () => {
        if (!input.subject || input.subject.trim() === '') {
            toast.error('Subject is required', { description: 'Please enter a subject for your coloring book pages.' });
            return;
        }

        setIsGenerating(true);
        setGeneratedPrompts([]);

        try {
            const result = await generateColoringBookPromptsAction(input);

            if (result.error) {
                toast.error('Generation Failed', { description: result.error });
            } else {
                setGeneratedPrompts(result.prompts);
                toast.success(`Generated ${result.prompts.length} unique pages!`);
            }
        } catch (e) {
            toast.error('Something went wrong');
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = (prompt: string, index: number) => {
        navigator.clipboard.writeText(prompt);
        setCopiedIndex(index);
        toast.success(`Page ${index + 1} copied to clipboard`);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleSaveBook = async () => {
        if (!generatedPrompts || generatedPrompts.length === 0) return;
        if (!user) {
            toast.error("Please login to save books.");
            return;
        }
        if (!bookTitle.trim()) {
            toast.error("Please enter a book title.");
            return;
        }

        setIsSaving(true);
        try {
            // Sanitize settings to remove undefined values
            const sanitizedSettings = JSON.parse(JSON.stringify(input));

            // Save book with all prompts
            await addDoc(collection(db, 'coloringBooks'), {
                userId: user.uid,
                userEmail: user.email,
                title: bookTitle.trim(),
                category: input.category,
                pageCount: generatedPrompts.length,
                settings: sanitizedSettings,
                prompts: generatedPrompts.map((prompt, index) => ({
                    pageNumber: index + 1,
                    prompt,
                    createdAt: new Date()
                })),
                createdAt: serverTimestamp(),
            });

            toast.success('Book saved to Library!');
            setShowSaveDialog(false);
            setBookTitle('');
            setCurrentBookTitle(bookTitle.trim());
        } catch (e) {
            console.error(e);
            toast.error('Failed to save book');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <CyberButton
                onClick={handleGenerate}
                disabled={isGenerating || !input.subject}
                className="w-full py-4 text-lg"
            >
                {isGenerating ? (
                    <>Generating {input.pageCount} {input.pageCount === 1 ? 'Page' : 'Pages'}... <Sparkles className="w-5 h-5 ml-2 animate-spin" /></>
                ) : (
                    <>Generate Coloring Book Prompts <Sparkles className="w-5 h-5 ml-2" /></>
                )}
            </CyberButton>

            {generatedPrompts.length > 0 && (
                <Card className="border border-primary/20 bg-black/40 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div>
                            <CardTitle className="text-lg font-medium text-primary flex items-center gap-2">
                                <BookOpen className="w-5 h-5" />
                                Generated Coloring Book Pages
                            </CardTitle>
                            <p className="text-sm text-gray-400 mt-1">
                                {generatedPrompts.length} {generatedPrompts.length === 1 ? 'page' : 'pages'} ready
                            </p>
                        </div>

                    </CardHeader>

                    <CardContent>
                        <ScrollArea className="max-h-[600px] pr-4">
                            <div className="space-y-4">
                                {generatedPrompts.map((prompt, index) => (
                                    <Card key={index} className="bg-white/5 border-white/10">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-3">
                                                    Page {index + 1}
                                                </Badge>
                                                <span className="text-xs text-gray-400">
                                                    {input.subject}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleCopy(prompt, index)}
                                                className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors rounded-md hover:bg-white/10"
                                            >
                                                {copiedIndex === index ? (
                                                    <Check className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </button>
                                        </CardHeader>
                                        <CardContent>
                                            <pre className="text-xs md:text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                                                {prompt}
                                            </pre>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="mt-4 pt-4 border-t border-white/10 flex justify-end relative z-10">
                            <CyberButton
                                variant="secondary"
                                onClick={() => setShowSaveDialog(true)}
                                className="bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 w-full md:w-auto"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Book to Library
                            </CyberButton>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Save Dialog */}
            {showSaveDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowSaveDialog(false)}>
                    <Card
                        className="w-full max-w-md bg-black/90 border-white/20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <CardHeader>
                            <CardTitle className="text-white">Save Coloring Book</CardTitle>
                            <p className="text-sm text-gray-400">
                                Give your book a memorable title to save all {generatedPrompts.length} pages
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-300">Book Title</label>
                                <AnimatedInput
                                    placeholder="e.g., Magical Fairy Tales"
                                    value={bookTitle}
                                    onChange={(e) => setBookTitle(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSaveBook();
                                    }}
                                    className="text-white"
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-2 justify-end">
                                <CyberButton
                                    variant="secondary"
                                    onClick={() => setShowSaveDialog(false)}
                                    className="bg-transparent border-white/10"
                                >
                                    Cancel
                                </CyberButton>
                                <CyberButton
                                    onClick={handleSaveBook}
                                    disabled={!bookTitle.trim() || isSaving}
                                    className="bg-green-500/20 border-green-500/30 text-green-400"
                                >
                                    {isSaving ? 'Saving...' : 'Save Book'}
                                </CyberButton>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
