'use client';

import React, { useEffect, useRef } from 'react';

interface ParticlesProps {
    particleCount?: number;
    particleSpread?: number;
    speed?: number;
    particleColors?: string[];
    moveParticlesOnHover?: boolean;
    particleHoverFactor?: number;
    alphaParticles?: boolean;
    particleBaseSize?: number;
    sizeRandomness?: number;
    cameraDistance?: number;
    disableRotation?: boolean;
    className?: string;
}

export default function Particles({
    particleCount = 200,
    particleSpread = 10,
    speed = 0.1,
    particleColors = ['#ffffff', '#aa99ff', '#88ccff'], // Studio Dark accents
    moveParticlesOnHover = true,
    particleHoverFactor = 1,
    alphaParticles = false,
    particleBaseSize = 100,
    sizeRandomness = 1,
    cameraDistance = 20,
    disableRotation = false,
    className,
}: ParticlesProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles: any[] = [];
        let animationFrameId: number;
        let w = canvas.width;
        let h = canvas.height;

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        const hexToRgb = (hex: string) => {
            const bigint = parseInt(hex.replace('#', ''), 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return { r, g, b };
        };

        const particleColorsRgb = particleColors.map(hexToRgb);

        class Particle {
            x: number;
            y: number;
            z: number;
            color: { r: number; g: number; b: number };
            size: number;

            constructor() {
                this.x = (Math.random() - 0.5) * particleSpread;
                this.y = (Math.random() - 0.5) * particleSpread;
                this.z = Math.random() * particleSpread;
                this.color = particleColorsRgb[Math.floor(Math.random() * particleColorsRgb.length)];
                this.size = particleBaseSize * (Math.random() * sizeRandomness + 0.5);
            }

            update() {
                this.z -= speed;
                if (this.z <= 0) {
                    this.z = particleSpread;
                    this.x = (Math.random() - 0.5) * particleSpread;
                    this.y = (Math.random() - 0.5) * particleSpread;
                }
            }

            draw() {
                if (!ctx) return;
                const perspective = cameraDistance / (cameraDistance - this.z); // Simple perspective
                // Invert perspective for 3D starfield effect moving towards viewer
                // Actually simpler: 2D radial burst or just standard starry depth

                // Let's do standard 3D projection
                const scale = cameraDistance / (this.z);
                const sx = (this.x / this.z) * w + w / 2;
                const sy = (this.y / this.z) * h + h / 2;

                if (scale < 0) return;

                ctx.beginPath();
                const alpha = alphaParticles ? Math.min(scale, 1) : 1;
                ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
                ctx.arc(sx, sy, Math.max(0.5, scale * 1.5), 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Initialize
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, w, h);

            // Sort by Z for proper layering if needed, but for dots it's fine
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [particleCount, particleSpread, speed, particleColors, moveParticlesOnHover, particleHoverFactor, alphaParticles, particleBaseSize, sizeRandomness, cameraDistance, disableRotation]);

    return <canvas ref={canvasRef} className={className} />;
}
