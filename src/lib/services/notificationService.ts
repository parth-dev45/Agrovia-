import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    query,
    where,
    orderBy,
    onSnapshot,
    Timestamp,
    limit
} from "firebase/firestore";
import { useState, useEffect } from "react";

export interface AppNotification {
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    title: string;
    message: string;
    timestamp: Date | string; // Handle both for UI
    read: boolean;
    recipientRole?: 'admin' | 'retailer' | 'farmer' | 'all'; // Target audience
    actionLink?: string; // URL to navigate to
}

const NOTIFICATIONS_COLLECTION = "notifications";

// --- Hook for Real-time Notifications ---
export function useNotifications(role: string = 'all') {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Query: Get notifications for 'all' OR specific user role, ordered by time
        // Note: Complex OR queries needs an index, so for now we might just fetch 'all' and filter client side 
        // or just fetch 'all' for this demo.
        const q = query(
            collection(db, NOTIFICATIONS_COLLECTION),
            orderBy("createdAt", "desc"),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const results: AppNotification[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                // Client-side filtering for role (simple version)
                if (data.recipientRole === 'all' || data.recipientRole === role) {
                    results.push({
                        id: doc.id,
                        ...data,
                        timestamp: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt || Date.now())
                    } as AppNotification);
                }
            });
            setNotifications(results);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [role]);

    return { notifications, loading };
}

// --- Actions ---

export async function addNotification(notification: Omit<AppNotification, "id" | "timestamp" | "read">) {
    try {
        await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
            ...notification,
            read: false,
            createdAt: Timestamp.now()
        });
    } catch (error) {
        console.error("Error sending notification:", error);
    }
}

export async function markNotificationAsRead(id: string) {
    try {
        const docRef = doc(db, NOTIFICATIONS_COLLECTION, id);
        await updateDoc(docRef, { read: true });
    } catch (error) {
        console.error("Error marking notification as read:", error);
    }
}

export async function clearAllNotifications() {
    // CAUTION: In a real app, you'd only clear YOUR notifications. 
    // For this demo, we might just mark all visible as read or actually delete them?
    // Let's just mark user's view as read for now, or skip "Clear All" back-end logic to avoid deleting shared data.
    console.warn("Clear Global Notifications not implemented for safety.");
}
