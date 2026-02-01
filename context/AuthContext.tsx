'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    User
} from 'firebase/auth';
import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp,
    onSnapshot
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { toast } from 'sonner';

interface UserData {
    role: 'user' | 'admin';
    blocked: boolean;
    email: string;
    createdAt: any;
}

interface AuthContextType {
    user: User | null;
    userData: UserData | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userData: null,
    loading: true,
    signInWithGoogle: async () => { },
    logout: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                // Set cookie for middleware
                const token = await currentUser.getIdToken();
                document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Strict; Secure`;

                // Real-time listener for user data (to handle blocking immediately)
                const userRef = doc(db, 'users', currentUser.uid);

                const unsubUserData = onSnapshot(userRef, async (docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const data = docSnapshot.data() as UserData;

                        if (data.blocked) {
                            await signOut(auth);
                            document.cookie = "token=; path=/; max-age=0"; // Clear cookie
                            toast.error("Your account has been blocked by an administrator.");
                            setUser(null);
                            setUserData(null);
                        } else {
                            setUserData(data);
                        }
                    } else {
                        // Create user if not exists
                        const newUserData: UserData = {
                            email: currentUser.email || '',
                            role: 'user',
                            blocked: false,
                            createdAt: serverTimestamp()
                        };
                        await setDoc(userRef, newUserData);
                        setUserData(newUserData);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Error fetching user data:", error);
                    setLoading(false);
                });

                return () => unsubUserData();
            } else {
                document.cookie = "token=; path=/; max-age=0"; // Clear cookie
                setUserData(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            // Cookie set by onAuthStateChanged
            toast.success("Successfully signed in!");
        } catch (error: any) {
            console.error("Login error:", error);
            toast.error("Failed to sign in: " + error.message);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            document.cookie = "token=; path=/; max-age=0"; // Clear cookie
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Failed to logout");
        }
    };

    return (
        <AuthContext.Provider value={{ user, userData, loading, signInWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
