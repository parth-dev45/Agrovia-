import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithPopup, signOut, signInAnonymously } from "firebase/auth";
import { doc, getDoc, setDoc, writeBatch, collection } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

// Standard LocalStorage Keys for Migration
const STORAGE_KEYS = {
    BATCHES: 'agrovia_batches',
    ORDERS: 'agrovia_orders',
    INVENTORY: 'agrovia_retailer_inventory',
    CUSTOMERS: 'agrovia_customers',
    WAREHOUSES: 'agrovia_warehouses'
} as const;

export type UserRole = 'admin' | 'retailer' | 'customer' | 'pending';

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    role: UserRole;
    organizationId?: string;
    createdAt: string;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    login: () => Promise<void>;
    loginWithRole: (role: UserRole) => Promise<void>;
    logout: () => Promise<void>;
    migrateLocalData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    login: async () => { },
    loginWithRole: async () => { },
    logout: async () => { },
    migrateLocalData: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                await loadUserProfile(firebaseUser);
            } else {
                setUser(null);
                setProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const loadUserProfile = async (firebaseUser: User) => {
        try {
            const userRef = doc(db, "users", firebaseUser.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                setProfile(userSnap.data() as UserProfile);

                // Redirect logic based on role if on login page
                if (location.pathname === '/' || location.pathname === '/login') {
                    const role = userSnap.data().role;
                    switch (role) {
                        case 'admin': navigate('/warehouse'); break;
                        case 'retailer': navigate('/retailer'); break;
                        case 'customer': navigate('/traceability'); break;
                        default: navigate('/warehouse'); // Default fallback
                    }
                }
            } else {
                // First time login - create default profile
                // For demo purposes, we'll auto-assign 'admin' based on email or default to 'admin' for now
                // In production, new users might be 'pending' or 'customer' by default
                const newProfile: UserProfile = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    displayName: firebaseUser.displayName || 'User',
                    photoURL: firebaseUser.photoURL || '',
                    role: 'admin', // Defaulting to Admin for immediate demo access
                    createdAt: new Date().toISOString()
                };

                await setDoc(userRef, newProfile);
                setProfile(newProfile);

                // Auto-migrate data on first account creation
                migrateLocalData();
            }
        } catch (error) {
            console.error("Error loading profile:", error);
            toast.error("Failed to load user profile");
        }
    };

    const login = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Login failed:", error);
            toast.error("Login failed. Please try again.");
        }
    };

    const loginWithRole = async (role: UserRole) => {
        setLoading(true);
        try {
            // we use anonymous login to get a UID for Firestore rules
            // In a real app, you might want distinct login flows for each (e.g. email/pass for admin)
            const { user: firebaseUser } = await signInAnonymously(auth);

            // Force update the profile with the selected role
            const userRef = doc(db, "users", firebaseUser.uid);
            const newProfile: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: role === 'admin' ? 'Administrator' : role.charAt(0).toUpperCase() + role.slice(1),
                photoURL: firebaseUser.photoURL || '',
                role: role,
                createdAt: new Date().toISOString()
            };

            await setDoc(userRef, newProfile);
            setProfile(newProfile);
            setUser(firebaseUser);

            // Navigate based on role
            switch (role) {
                case 'admin': navigate('/dashboard'); break; // Operations -> Dashboard/Warehouse
                case 'retailer': navigate('/retailer'); break;
                case 'customer': navigate('/traceability'); break;
                default: navigate('/dashboard');
            }

            toast.success(`Welcome, ${newProfile.displayName}`);
        } catch (error: any) {
            console.error("Role login failed:", error);
            const errorMessage = error?.code === 'auth/admin-restricted-operation' || error?.code === 'auth/operation-not-allowed'
                ? "Anonymous Auth disabled in Firebase Console."
                : error?.message || "Failed to sign in.";

            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setProfile(null); // Clear profile on logout
            navigate('/');
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Migration function to move LocalStorage data to Firestore
    const migrateLocalData = async () => {
        if (!user) return;

        const toastId = toast.loading("Migrating local data to cloud...");
        try {
            const batch = writeBatch(db);
            let operationCount = 0;
            const MAX_BATCH_SIZE = 450; // Firestore limit is 500

            // 1. Migrate Batches
            const rawBatches = localStorage.getItem(STORAGE_KEYS.BATCHES);
            if (rawBatches) {
                const batches = JSON.parse(rawBatches);
                batches.forEach((item: any) => {
                    if (item.batchId) {
                        const ref = doc(db, "batches", item.batchId);
                        batch.set(ref, { ...item, migratedAt: new Date().toISOString(), createdBy: user.uid });
                        operationCount++;
                    }
                });
            }

            // 2. Migrate Orders
            const rawOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
            if (rawOrders) {
                const orders = JSON.parse(rawOrders);
                orders.forEach((item: any) => {
                    if (item.orderId) {
                        const ref = doc(db, "orders", item.orderId);
                        batch.set(ref, { ...item, migratedAt: new Date().toISOString() });
                        operationCount++;
                    }
                });
            }

            // Commit if we have operations
            if (operationCount > 0) {
                await batch.commit();
                toast.success(`Successfully migrated ${operationCount} records to cloud!`, { id: toastId });
            } else {
                toast.dismiss(toastId);
            }

        } catch (error) {
            console.error("Migration failed:", error);
            toast.error("Data migration failed", { id: toastId });
        }
    };

    const value = {
        user,
        profile,
        loading,
        login,
        loginWithRole,
        logout,
        migrateLocalData
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
