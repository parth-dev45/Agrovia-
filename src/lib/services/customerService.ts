import { db } from "@/lib/firebase";
import {
    collection,
    doc,
    setDoc,
    onSnapshot,
    query,
    orderBy,
    where,
    getDocs,
    Timestamp
} from "firebase/firestore";
import { Customer } from "@/lib/customers"; // Reuse interface
import { useState, useEffect } from "react";
import { toast } from "sonner";

const CUSTOMERS_COLLECTION = "customers";

// --- Hook for Real-time Customers ---
export function useCustomers() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const q = query(collection(db, CUSTOMERS_COLLECTION), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            try {
                const results: Customer[] = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    results.push({
                        ...data,
                        // Ensure createdAt is compatible
                        createdAt: data.createdAt instanceof Timestamp
                            ? data.createdAt.toDate().toISOString()
                            : data.createdAt
                    } as Customer);
                });
                setCustomers(results);
                setLoading(false);
            } catch (err) {
                console.error("Error processing customers:", err);
                setError(err as Error);
                setLoading(false);
            }
        }, (err) => {
            console.error("Firestore Error:", err);
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { customers, loading, error };
}

// --- Async Actions ---

export async function createCustomerInFirestore(opts: {
    phone: string;
    name?: string;
    email?: string;
}) {
    const normalizedPhone = opts.phone.trim();
    if (!normalizedPhone) throw new Error("Phone number is required");

    // Check if exists
    const existing = await getCustomerByPhoneFromFirestore(normalizedPhone);
    if (existing) {
        toast.info("Customer already exists");
        return existing;
    }

    const suffix = normalizedPhone.replace(/\D/g, '').slice(-6) || Math.random().toString(36).slice(2, 8).toUpperCase();
    const memberId = `AGV-${suffix}`;

    const customer: Customer = {
        phone: normalizedPhone,
        memberId,
        name: opts.name?.trim(),
        email: opts.email?.trim(),
        createdAt: new Date().toISOString(),
        membershipTier: 'Free',
        membershipJoinDate: new Date().toISOString(),
        points: 0
    };

    try {
        const docRef = doc(db, CUSTOMERS_COLLECTION, memberId);
        // Save to Firestore with Timestamp for consistency if needed, or ISO string
        // The type expects string for createdAt, but Firestore handles it. 
        // Let's stick to storing as serialized object if we want to match the type EXACTLY, 
        // but typically we store Timestamps. 
        // Based on existing code reading it back: 
        // createdAt: data.createdAt instanceof Timestamp ? ... : ...
        // So we can store proper Firestore data.

        await setDoc(docRef, {
            ...customer,
            createdAt: Timestamp.now(),
            membershipJoinDate: Timestamp.now()
        });

        toast.success(`Member created: ${memberId}`);
        return customer;
    } catch (e) {
        console.error("Error adding customer", e);
        toast.error("Failed to create member");
        throw e;
    }
}

export async function getCustomerByPhoneFromFirestore(phone: string): Promise<Customer | null> {
    try {
        const q = query(collection(db, CUSTOMERS_COLLECTION), where("phone", "==", phone.trim()));
        const snapshot = await getDocs(q);

        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];
        const data = doc.data();
        return {
            ...data,
            createdAt: data.createdAt instanceof Timestamp
                ? data.createdAt.toDate().toISOString()
                : data.createdAt
        } as Customer;
    } catch (e) {
        console.error("Error fetching customer by phone", e);
        return null;
    }
}

export async function updateCustomerMembership(memberId: string, tier: 'Free' | 'Standard' | 'Premium') {
    try {
        const docRef = doc(db, CUSTOMERS_COLLECTION, memberId);
        await setDoc(docRef, {
            membershipTier: tier,
            membershipJoinDate: new Date().toISOString()
        }, { merge: true });

        toast.success(`Membership upgraded to ${tier}!`);
        return true;
    } catch (e) {
        console.error("Error updating membership", e);
        toast.error("Failed to update membership");
        throw e;
    }
}
