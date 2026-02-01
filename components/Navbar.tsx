'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutGrid, Music2, LogIn, LogOut, User as UserIcon, Shield, Home } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, userData, signInWithGoogle, logout } = useAuth();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center py-4 pointer-events-none">
            <div className="flex items-center gap-4 p-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl pointer-events-auto">
                {/* Navigation Items */}
                <div className="flex items-center gap-1">
                    {user && (
                        <>
                            <Link
                                href="/"
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                                    pathname === '/'
                                        ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_-5px_hsl(var(--primary))]"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Home className="w-4 h-4" />
                                <span className="hidden sm:inline">Home</span>
                            </Link>
                            <Link
                                href="/studio"
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                                    pathname === '/studio'
                                        ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_-5px_hsl(var(--primary))]"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Music2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Studio</span>
                            </Link>

                            <Link
                                href="/library"
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                                    pathname === '/library'
                                        ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_-5px_hsl(var(--primary))]"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <LayoutGrid className="w-4 h-4" />
                                <span className="hidden sm:inline">Library</span>
                            </Link>

                            {userData?.role === 'admin' && (
                                <Link
                                    href="/admin"
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                                        pathname === '/admin'
                                            ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_-5px_hsl(var(--primary))]"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <Shield className="w-4 h-4" />
                                    <span className="hidden sm:inline">Admin</span>
                                </Link>
                            )}
                        </>
                    )}

                    {!user && (
                        <Link
                            href="/"
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                                pathname === '/'
                                    ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_-5px_hsl(var(--primary))]"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <span className="hidden sm:inline">Home</span>
                        </Link>
                    )}
                </div>

                <div className="h-6 w-[1px] bg-white/10" />

                {/* Auth Section */}
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                <Avatar className="h-9 w-9 border border-white/10">
                                    <AvatarImage src={user.photoURL || undefined} alt="User" />
                                    <AvatarFallback><UserIcon className="w-4 h-4" /></AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user.displayName || "User"}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button
                        onClick={() => signInWithGoogle()}
                        variant="ghost"
                        size="sm"
                        className="rounded-full text-gray-400 hover:text-white hover:bg-white/5 gap-2"
                    >
                        <LogIn className="w-4 h-4" />
                        <span className="hidden sm:inline">Login</span>
                    </Button>
                )}
            </div>
        </nav>
    );
}
