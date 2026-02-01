import { SongMetadataForm } from '@/components/forms/SongMetadataForm';
import { MusicalityForm } from '@/components/forms/MusicalityForm';
import { ExtraFeaturesForm } from '@/components/forms/ExtraFeaturesForm';
import { GeneratedResult } from '@/components/GeneratedResult';
import { Music4 } from 'lucide-react';
import FloatingLines from '@/components/FloatingLines';
import BlurText from '@/components/reactbits/BlurText';
import SpotlightCard from '@/components/reactbits/SpotlightCard';

export default function LyricsStudioPage() {
    return (
        <main className="relative min-h-screen bg-background text-foreground overflow-hidden pt-20">

            {/* Animated Background */}
            <div className="absolute inset-0 z-0 opacity-40 bg-black">
                <FloatingLines
                    linesGradient={['#8b5cf6', '#a78bfa']} // Violet gradients
                />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto p-6 md:p-12 space-y-12">

                {/* Header */}
                <div className="text-center space-y-6 pt-6">
                    <div className="space-y-2">
                        <BlurText
                            text="Lyrics Studio"
                            className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-br from-white via-primary/80 to-purple-500 bg-clip-text text-transparent drop-shadow-sm"
                            delay={150}
                        />
                        <p className="text-muted-foreground text-lg max-w-2x mx-auto font-light tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both">
                            Craft your next hit with AI-powered lyric prompts.
                        </p>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid gap-8">
                    <SpotlightCard className="bg-card/30 backdrop-blur-md border-white/10" spotlightColor="rgba(139, 92, 246, 0.15)">
                        <SongMetadataForm />
                    </SpotlightCard>

                    <SpotlightCard className="bg-card/30 backdrop-blur-md border-white/10" spotlightColor="rgba(139, 92, 246, 0.15)">
                        <MusicalityForm />
                    </SpotlightCard>

                    <SpotlightCard className="bg-card/30 backdrop-blur-md border-white/10" spotlightColor="rgba(139, 92, 246, 0.15)">
                        <ExtraFeaturesForm />
                    </SpotlightCard>

                    <div className="pt-4">
                        <GeneratedResult />
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
