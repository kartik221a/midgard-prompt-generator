'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Shield, Ban, Trash2, CheckCircle, User as UserIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface UserData {
    id: string;
    email: string;
    role: 'user' | 'admin';
    blocked: boolean;
    createdAt?: any;
    photoURL?: string;
    displayName?: string;
}

export default function AdminPage() {
    const { userData, loading: authLoading } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && userData?.role !== 'admin') {
            router.push('/');
        }
    }, [authLoading, userData, router]);

    useEffect(() => {
        if (userData?.role === 'admin') {
            fetchUsers();
        }
    }, [userData]);

    const fetchUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const fetchedUsers: UserData[] = [];
            querySnapshot.forEach((doc) => {
                fetchedUsers.push({ id: doc.id, ...doc.data() } as UserData);
            });
            // Sort by creation date if available, or just email
            setUsers(fetchedUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    const toggleBlockUser = async (user: UserData) => {
        try {
            const userRef = doc(db, 'users', user.id);
            await updateDoc(userRef, {
                blocked: !user.blocked
            });

            setUsers(prev => prev.map(u =>
                u.id === user.id ? { ...u, blocked: !u.blocked } : u
            ));

            toast.success(`User ${user.blocked ? 'unblocked' : 'blocked'} successfully.`);
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Failed to update user status.");
        }
    };

    const deleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;

        try {
            await deleteDoc(doc(db, 'users', userId));
            setUsers(prev => prev.filter(u => u.id !== userId));
            toast.success("User deleted successfully.");
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user.");
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse text-foreground">Loading Admin Dashboard...</div>
            </div>
        );
    }

    if (userData?.role !== 'admin') {
        return null; // Will redirect via useEffect
    }

    return (
        <main className="min-h-screen bg-background text-foreground pt-24 px-4 pb-12">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Shield className="w-8 h-8 text-primary" />
                            Admin Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-2">Manage users and permissions.</p>
                    </div>
                    <Badge variant="outline" className="px-4 py-1">
                        {users.length} Users
                    </Badge>
                </div>

                <div className="rounded-md border border-white/10 bg-black/20 backdrop-blur-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/10 hover:bg-white/5">
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.photoURL} />
                                                <AvatarFallback><UserIcon className="w-4 h-4" /></AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span>{user.email}</span>
                                                <span className="text-xs text-muted-foreground">{user.id}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'admin' ? "default" : "secondary"}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.blocked ? "destructive" : "outline"} className={user.blocked ? "" : "text-green-500 border-green-500/20 bg-green-500/10"}>
                                            {user.blocked ? "Blocked" : "Active"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {user.createdAt ? (
                                            formatDistanceToNow(user.createdAt.toDate(), { addSuffix: true })
                                        ) : (
                                            "Unknown"
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => toggleBlockUser(user)}
                                                className={user.blocked ? "text-green-500 hover:text-green-400 hover:bg-green-500/10" : "text-orange-500 hover:text-orange-400 hover:bg-orange-500/10"}
                                                title={user.blocked ? "Unblock User" : "Block User"}
                                            >
                                                {user.blocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => deleteUser(user.id)}
                                                className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </main>
    );
}
