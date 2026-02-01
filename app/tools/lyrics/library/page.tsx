'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, getDocs, deleteDoc, doc, where } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import CyberButton from '@/components/reactbits/CyberButton';
import { formatDistanceToNow } from 'date-fns';
import { X, Copy, Trash2, Calendar, Music, Sparkles, Tag } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface SavedPrompt {
    id: string;
    prompt: string;
    tags?: string[];
    metadata: {
        title?: string;
        story: string;
        keywords: string[];
    };
    musicality: {
        genre: string;
        vibe: string;
    };
    createdAt: any;
}

function PromptDetailsModal({ prompt, onClose }: { prompt: SavedPrompt; onClose: () => void }) {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-white/5 bg-white/5">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">
                            {prompt.metadata.title || "Untitled Song"}
                        </h2>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <span className="flex items-center gap-1.5">
                                <Music className="w-4 h-4" /> {prompt.musicality.genre}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4" /> {prompt.musicality.vibe}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6">
                        {/* Story Section */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Concept / Story</h3>
                            <p className="text-gray-300 italic leading-relaxed border-l-2 border-indigo-500/30 pl-4 py-1">
                                "{prompt.metadata.story}"
                            </p>
                        </div>

                        {/* Generated Tags Section */}
                        {prompt.tags && prompt.tags.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-pink-400 uppercase tracking-wider flex items-center gap-2">
                                    <Tag className="w-3 h-3" /> AI Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {prompt.tags.map(tag => (
                                        <Badge key={tag} variant="outline" className="bg-pink-500/5 text-pink-300 border-pink-500/20">
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Keywords Section (User input) */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Keywords</h3>
                            <div className="flex flex-wrap gap-2">
                                {prompt.metadata.keywords.map(k => (
                                    <Badge key={k} variant="secondary" className="bg-white/5 border-white/10 text-gray-400">
                                        {k}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Master Prompt Section */}
                        <div className="space-y-3 pt-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Master Prompt</h3>
                                <CyberButton
                                    onClick={() => copyToClipboard(prompt.prompt)}
                                    variant="secondary"
                                    className="h-7 text-xs px-3 bg-white/5 hover:bg-white/10 border-white/10"
                                >
                                    <Copy className="w-3 h-3 mr-2" /> Copy Full
                                </CyberButton>
                            </div>
                            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40">
                                <pre className="p-4 text-xs md:text-sm font-mono text-gray-300 whitespace-pre-wrap leading-normal">
                                    {prompt.prompt}
                                </pre>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 bg-black/20 flex justify-end gap-2">
                    <CyberButton onClick={onClose} variant="secondary" className="text-gray-400 hover:text-white bg-transparent border-transparent hover:bg-white/5">
                        Close
                    </CyberButton>
                </div>
            </motion.div>
        </div>
    );
}

export default function LyricsLibraryPage() {
    const { user, loading: authLoading } = useAuth();
    const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPrompt, setSelectedPrompt] = useState<SavedPrompt | null>(null);

    useEffect(() => {
        if (!authLoading) {
            fetchPrompts();
        }
    }, [user, authLoading]);

    const fetchPrompts = async () => {
        try {
            if (!user) {
                setPrompts([]);
                setLoading(false);
                return;
            }
            const q = query(
                collection(db, 'prompts'),
                where('userId', '==', user.uid),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const fetched: SavedPrompt[] = [];
            querySnapshot.forEach((doc) => {
                fetched.push({ id: doc.id, ...doc.data() } as SavedPrompt);
            });
            setPrompts(fetched);
        } catch (error) {
            console.error("Error fetching library:", error);
            toast.error("Could not load library.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Delete this prompt?")) return;

        try {
            await deleteDoc(doc(db, 'prompts', id));
            setPrompts(prev => prev.filter(p => p.id !== id));
            if (selectedPrompt?.id === id) setSelectedPrompt(null);
            toast.success("Prompt deleted.");
        } catch (error) {
            toast.error("Failed to delete.");
        }
    };

    const copyToClipboard = (text: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    return (
        <main className="min-h-screen bg-background text-foreground pt-24 px-4 pb-12 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background -z-10" />

            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Lyrics Library</h1>
                        <p className="text-muted-foreground mt-2">Your collection of AI-generated song blueprints.</p>
                    </div>
                    <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10 px-4 py-1">
                        {prompts.length} Saved
                    </Badge>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 rounded-xl bg-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : prompts.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <Music className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>No prompts saved yet. Go to the Studio to create one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {prompts.map((prompt) => (
                            <div key={prompt.id} onClick={() => setSelectedPrompt(prompt)} className="cursor-pointer h-full">
                                <SpotlightCard
                                    className="bg-card/30 backdrop-blur-md border-white/10 flex flex-col h-full group transition-all hover:border-indigo-500/50"
                                    spotlightColor="rgba(139, 92, 246, 0.15)"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="space-y-1">
                                            <h3 className="font-semibold text-lg text-white leading-tight line-clamp-1">
                                                {prompt.metadata.title || "Untitled Song"}
                                            </h3>
                                            <div className="flex gap-2 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Music className="w-3 h-3" /> {prompt.musicality.genre}
                                                </span>
                                                {prompt.createdAt && (
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" /> {formatDistanceToNow(prompt.createdAt.toDate(), { addSuffix: true })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <CyberButton
                                                variant="secondary"
                                                onClick={(e) => copyToClipboard(prompt.prompt, e)}
                                                className="h-8 w-8 p-0 bg-transparent border-white/10 hover:bg-white/10"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </CyberButton>
                                            <CyberButton
                                                variant="secondary"
                                                onClick={(e) => handleDelete(prompt.id, e)}
                                                className="h-8 w-8 p-0 bg-transparent border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </CyberButton>
                                        </div>
                                    </div>

                                    <div className="space-y-3 flex-1 flex flex-col">
                                        <p className="text-sm text-gray-400 line-clamp-3 italic">
                                            "{prompt.metadata.story}"
                                        </p>

                                        <div className="flex flex-wrap gap-1.5 mt-auto pt-4">
                                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                                                {prompt.musicality.vibe}
                                            </Badge>
                                            {/* Show generated tags in card preview if available, else keywords */}
                                            {(prompt.tags && prompt.tags.length > 0 ? prompt.tags : prompt.metadata.keywords).slice(0, 2).map(k => (
                                                <Badge key={k} variant="outline" className="border-white/10 text-gray-400 text-[10px]">
                                                    {prompt.tags && prompt.tags.length > 0 ? `#${k}` : k}
                                                </Badge>
                                            ))}
                                            {(prompt.tags ? prompt.tags.length : prompt.metadata.keywords.length) > 2 && (
                                                <Badge variant="outline" className="border-white/10 text-gray-400 text-[10px]">
                                                    +{(prompt.tags ? prompt.tags.length : prompt.metadata.keywords.length) - 2}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </SpotlightCard>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedPrompt && (
                    <PromptDetailsModal
                        prompt={selectedPrompt}
                        onClose={() => setSelectedPrompt(null)}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}
