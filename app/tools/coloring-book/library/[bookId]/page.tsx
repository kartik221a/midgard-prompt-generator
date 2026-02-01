'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation'; // Use standard next/navigation
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import CyberButton from '@/components/reactbits/CyberButton';
import { formatDistanceToNow } from 'date-fns';
import { Copy, Trash2, Calendar, BookOpen, ArrowLeft, Download } from 'lucide-react';
import { ColoringBook } from '@/lib/tools/coloring-book/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import FloatingLines from '@/components/FloatingLines';

export default function ColoringBookDetailPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter(); // Initialize router
    const params = useParams();
    const bookId = params?.bookId as string;

    const [book, setBook] = useState<ColoringBook | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && user && bookId) {
            fetchBookDetails();
        } else if (!authLoading && !user) {
            router.push('/');
        }
    }, [user, authLoading, bookId]);

    const fetchBookDetails = async () => {
        try {
            const docRef = doc(db, 'coloringBooks', bookId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                // Check ownership if needed (rules handle it, but UI should also be safe)
                if (data.userId !== user?.uid) {
                    toast.error("You don't have permission to view this book.");
                    router.push('/tools/coloring-book/library');
                    return;
                }

                setBook({
                    id: docSnap.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date()
                } as ColoringBook);
            } else {
                toast.error("Book not found");
                router.push('/tools/coloring-book/library');
            }
        } catch (error) {
            console.error("Error fetching book:", error);
            toast.error("Could not load book details.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Delete this coloring book? This action cannot be undone.")) return;

        try {
            await deleteDoc(doc(db, 'coloringBooks', bookId));
            toast.success("Book deleted.");
            router.push('/tools/coloring-book/library');
        } catch (error) {
            toast.error("Failed to delete.");
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`Prompt copied to clipboard!`);
    };

    const handleDownloadTxt = () => {
        if (!book) return;

        const content = book.prompts.map((p, i) => {
            // Flatten multiline prompts into a single line
            const flatPrompt = p.prompt.replace(/[\r\n]+/g, ' ').trim();
            return `Prompt ${i + 1}: ${flatPrompt}`;
        }).join('\n\n');

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_prompts.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Prompts downloaded!");
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-background text-foreground pt-24 px-4 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading book details...</p>
                </div>
            </main>
        );
    }

    if (!book) return null;

    return (
        <main className="min-h-screen bg-background text-foreground pt-24 px-4 pb-12 relative overflow-x-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-900/20 via-background to-background -z-10" />
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <FloatingLines linesGradient={['#ec4899', '#f472b6']} />
            </div>

            <div className="max-w-[95%] mx-auto space-y-8 relative z-10">
                {/* Header / Nav */}
                <div className="flex items-center justify-between">
                    <CyberButton
                        variant="secondary"
                        onClick={() => router.push('/tools/coloring-book/library')}
                        className="bg-transparent border-white/10 hover:bg-white/10 pl-2 pr-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Library
                    </CyberButton>

                    <div className="flex gap-3">
                        <CyberButton
                            variant="secondary"
                            onClick={handleDownloadTxt}
                            className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download Prompts
                        </CyberButton>

                        <CyberButton
                            variant="secondary"
                            onClick={handleDelete}
                            className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Book
                        </CyberButton>
                    </div>
                </div>

                {/* Book Meta Header */}
                <div className="bg-card/30 backdrop-blur-md border border-white/10 rounded-xl p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white via-pink-200 to-purple-300 bg-clip-text text-transparent">
                                {book.title}
                            </h1>
                            <div className="flex flex-wrap gap-3">
                                <Badge variant="outline" className="bg-pink-500/10 text-pink-300 border-pink-500/30 px-3 py-1 text-sm">
                                    {book.category}
                                </Badge>
                                <span className="flex items-center gap-1.5 text-muted-foreground text-sm bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                    <BookOpen className="w-4 h-4" /> {book.pageCount} pages
                                </span>
                                <span className="flex items-center gap-1.5 text-muted-foreground text-sm bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                    <Calendar className="w-4 h-4" />
                                    {formatDistanceToNow(book.createdAt, { addSuffix: true })}
                                </span>
                            </div>
                        </div>

                        <div className="bg-black/40 rounded-lg p-4 border border-white/10 min-w-[250px]">
                            <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Settings Used</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Style:</span>
                                    <span className="text-gray-200">{book.settings.style}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Difficulty:</span>
                                    <span className="text-gray-200">{book.settings.difficulty}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Mood:</span>
                                    <span className="text-gray-200">{book.settings.mood}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Prompts Grid */}
                <div>
                    <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-pink-400" />
                        Generated Pages
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {book.prompts.map((promptData, index) => (
                            <Card key={index} className="bg-white/5 border-white/10 hover:border-white/20 transition-all flex flex-col h-full">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-0">
                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-2 py-0 text-xs">
                                        Page {promptData.pageNumber}
                                    </Badge>
                                    <button
                                        onClick={() => copyToClipboard(promptData.prompt)}
                                        className="p-1.5 rounded-md hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                                        title="Copy Prompt"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                    </button>
                                </CardHeader>
                                <CardContent className="p-3 pt-2 flex-grow">
                                    <div className="bg-black/30 rounded-md p-2.5 h-full">
                                        <p className="text-xs text-gray-300 font-mono leading-relaxed line-clamp-3 overflow-hidden text-ellipsis">
                                            {promptData.prompt}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
