'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, getDocs, deleteDoc, doc, where } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Trash2, Calendar, Music } from 'lucide-react';
import { toast } from 'sonner';
import CyberButton from '@/components/reactbits/CyberButton';
import { formatDistanceToNow } from 'date-fns';

interface SavedPrompt {
    id: string;
    prompt: string;
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

export default function LibraryPage() {
    const { user, loading: authLoading } = useAuth();
    const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
    const [loading, setLoading] = useState(true);

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
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Prompt Library</h1>
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
                            <SpotlightCard
                                key={prompt.id}
                                className="bg-card/30 backdrop-blur-md border-white/10 flex flex-col h-full group"
                                spotlightColor="rgba(139, 92, 246, 0.15)"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-lg text-white leading-tight">
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
                                        {prompt.metadata.keywords.slice(0, 2).map(k => (
                                            <Badge key={k} variant="outline" className="border-white/10 text-gray-400 text-[10px]">
                                                {k}
                                            </Badge>
                                        ))}
                                        {prompt.metadata.keywords.length > 2 && (
                                            <Badge variant="outline" className="border-white/10 text-gray-400 text-[10px]">
                                                +{prompt.metadata.keywords.length - 2}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </SpotlightCard>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
