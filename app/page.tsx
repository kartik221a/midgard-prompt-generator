import Link from 'next/link';
import { ArrowRight, Music2, Sparkles, Wand2, Shield } from 'lucide-react';
import FloatingLines from '@/components/FloatingLines';
import CyberButton from '@/components/reactbits/CyberButton';
import SpotlightCard from '@/components/reactbits/SpotlightCard';

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden flex flex-col">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-background to-background z-10" />
        <FloatingLines
          linesGradient={['#3b82f6', '#8b5cf6']}
          lineCount={[3]}
          animationSpeed={0.5}
        />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-32 pb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-300 mb-8 animate-in fade-in zoom-in duration-500">
          <Sparkles className="w-3 h-3" />
          <span>Next-Gen Prompt Engineering</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-8 duration-700">
          Music Creation,<br />
          <span className="text-primary bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text">Elevated.</span>
        </h1>

        <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          Generate professional, structured prompts for Suno, Udio, and AI music models. Stop guessing, start composing.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <Link href="/tools/lyrics/studio">
            <CyberButton className="h-12 px-8 text-base">
              Start Creating <ArrowRight className="w-4 h-4 ml-2" />
            </CyberButton>
          </Link>
          <Link href="#features">
            <CyberButton variant="secondary" className="h-12 px-8 text-base bg-transparent/50 border-white/10 hover:bg-white/5">
              Learn More
            </CyberButton>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 max-w-6xl mx-auto px-4 py-20 w-full">
        <div className="grid md:grid-cols-3 gap-6">
          <SpotlightCard className="bg-black/40 border-white/5 p-8" spotlightColor="rgba(59, 130, 246, 0.1)">
            <Wand2 className="w-10 h-10 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Smart Generation</h3>
            <p className="text-muted-foreground">Instantly craft complex prompts with genre-specific terminology and structural tags.</p>
          </SpotlightCard>
          <SpotlightCard className="bg-black/40 border-white/5 p-8" spotlightColor="rgba(168, 85, 247, 0.1)">
            <Music2 className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Studio Control</h3>
            <p className="text-muted-foreground">Fine-tune every aspect of your song: from BPM and instruments to vocal styles and mood.</p>
          </SpotlightCard>
          <SpotlightCard className="bg-black/40 border-white/5 p-8" spotlightColor="rgba(236, 72, 153, 0.1)">
            <Shield className="w-10 h-10 text-pink-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Private Library</h3>
            <p className="text-muted-foreground">Save your best prompts. Organize, edit, and reuse your "blueprints" for future tracks.</p>
          </SpotlightCard>
        </div>
      </div>

    </main>
  );
}
