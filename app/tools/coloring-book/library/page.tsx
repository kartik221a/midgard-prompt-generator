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
import { useRouter } from 'next/navigation';
import { Copy, Trash2, Calendar, BookOpen, ChevronRight } from 'lucide-react';
import { ColoringBook } from '@/lib/tools/coloring-book/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function ColoringBookLibraryPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [books, setBooks] = useState<ColoringBook[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            fetchBooks();
        }
    }, [user, authLoading]);

    const fetchBooks = async () => {
        try {
            if (!user) {
                setBooks([]);
                setLoading(false);
                return;
            }
            const q = query(
                collection(db, 'coloringBooks'),
                where('userId', '==', user.uid),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const fetched: ColoringBook[] = [];
            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();
                fetched.push({
                    id: docSnap.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date()
                } as ColoringBook);
            });
            setBooks(fetched);
        } catch (error) {
            console.error("Error fetching library:", error);
            toast.error("Could not load library.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Delete this coloring book? All pages will be removed.")) return;

        try {
            await deleteDoc(doc(db, 'coloringBooks', id));
            setBooks(prev => prev.filter(b => b.id !== id));
            toast.success("Book deleted.");
        } catch (error) {
            toast.error("Failed to delete.");
        }
    };

    return (
        <main className="min-h-screen bg-background text-foreground pt-24 px-4 pb-12 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-900/20 via-background to-background -z-10" />

            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            Coloring Book Library
                        </h1>
                        <p className="text-muted-foreground mt-2">Your collection of saved coloring book prompts.</p>
                    </div>
                    <Badge variant="outline" className="text-pink-400 border-pink-400/30 bg-pink-400/10 px-4 py-1">
                        {books.length} {books.length === 1 ? 'Book' : 'Books'}
                    </Badge>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-48 rounded-xl bg-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : books.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>No coloring books saved yet. Go to the Studio to create one!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {books.map((book) => (
                            <SpotlightCard
                                key={book.id}
                                className="bg-card/30 backdrop-blur-md border-white/10 transition-all hover:border-pink-500/50"
                                spotlightColor="rgba(236, 72, 153, 0.15)"
                            >
                                {/* Book Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-2xl text-white">
                                                {book.title}
                                            </h3>
                                            <Badge variant="outline" className="bg-pink-500/10 text-pink-300 border-pink-500/30">
                                                {book.category}
                                            </Badge>
                                        </div>
                                        <div className="flex gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <BookOpen className="w-4 h-4" /> {book.pageCount} pages
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {formatDistanceToNow(book.createdAt, { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <CyberButton
                                            variant="secondary"
                                            onClick={() => router.push(`/tools/coloring-book/library/${book.id}`)}
                                            className="h-10 px-4 bg-transparent border-white/10 hover:bg-white/10"
                                        >
                                            <ChevronRight className="w-4 h-4 mr-2" />
                                            View Pages
                                        </CyberButton>
                                        <CyberButton
                                            variant="secondary"
                                            onClick={(e) => handleDelete(book.id, e)}
                                            className="h-10 w-10 p-0 bg-transparent border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </CyberButton>
                                    </div>
                                </div>

                                {/* Book Settings Summary */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="secondary" className="text-xs">
                                        {book.settings.style}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                        {book.settings.difficulty}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                        {book.settings.mood}
                                    </Badge>
                                </div>
                            </SpotlightCard>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
