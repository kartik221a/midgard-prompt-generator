import { ColoringBookForm } from '@/components/tools/coloring-book/ColoringBookForm';
import { ColoringBookResult } from '@/components/tools/coloring-book/ColoringBookResult';
import FloatingLines from '@/components/FloatingLines';
import BlurText from '@/components/reactbits/BlurText';
import SpotlightCard from '@/components/reactbits/SpotlightCard';

export default function ColoringBookStudioPage() {
    return (
        <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden pt-20">

            {/* Animated Background */}
            <div className="absolute inset-0 z-0 opacity-40 bg-black">
                <FloatingLines
                    linesGradient={['#ec4899', '#f472b6']} // Pink gradients for coloring book
                />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto p-6 md:p-12 space-y-12">

                {/* Header */}
                <div className="text-center space-y-6 pt-6">
                    <div className="space-y-2">
                        <BlurText
                            text="Coloring Book Studio"
                            className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-br from-white via-pink-300 to-purple-500 bg-clip-text text-transparent drop-shadow-sm"
                            delay={150}
                        />
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both">
                            Create professional prompts for AI-generated coloring book pages.
                        </p>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid gap-8">
                    <SpotlightCard className="bg-card/30 backdrop-blur-md border-white/10" spotlightColor="rgba(236, 72, 153, 0.15)">
                        <ColoringBookForm />
                    </SpotlightCard>

                    <div className="pt-4">
                        <ColoringBookResult />
                    </div>
                </div>

                {/* Footer */}
                <footer className="text-center text-sm text-muted-foreground/60 pt-10 pb-4">
                    <p>© 2026 Prompt Studio. Built for creators.</p>
                </footer>
            </div>
        </main>
    );
}
