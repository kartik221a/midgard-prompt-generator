'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
}

export default function CyberButton({
    children,
    className,
    variant = 'primary',
    ...props
}: CyberButtonProps) {

    const baseStyles = "relative px-6 py-2 font-bold text-white transition-all duration-200 group overflow-hidden rounded-md";
    const variants = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_-5px_hsl(var(--primary))] hover:shadow-[0_0_30px_-5px_hsl(var(--primary))] border border-primary/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-primary/30 hover:border-primary shadow-sm hover:shadow-[0_0_15px_-5px_hsl(var(--primary))]",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[0_0_20px_-5px_rgba(239,68,68,0.6)] border border-red-500/50"
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], className)}
            {...props}
        >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
            <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
        </button>
    );
}
