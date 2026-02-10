import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    setDoc,
    onSnapshot,
    getDoc,
    query,
    orderBy,
    Timestamp
} from "firebase/firestore";
import { Batch, BatchWithDetails, Farmer, QualityGrade, StorageType } from "@/lib/types";
import { calculateRemainingDays, determineFreshnessStatus, isSaleAllowed } from "@/lib/freshness";
import { useState, useEffect } from "react";

const BATCHES_COLLECTION = "batches";

// Helper to sanitize data for Firestore (remove undefined, convert dates)
const sanitizeForFirestore = (data: any) => {
    const cleaned = JSON.parse(JSON.stringify(data));
    // If you need specific Date -> Timestamp conversion, do it here
    // For now, we assume ISO strings or timestamps are handled or we convert explicit dates
    return cleaned;
};

// Helper to process raw Firestore data into application shape
const processBatchData = (data: any): BatchWithDetails => {
    // Convert Timestamps to Dates if needed, or Strings to Dates
    // Basic reconstruction of Date objects
    const harvestDate = data.harvestDate?.toDate ? data.harvestDate.toDate() : new Date(data.harvestDate);
    const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);

    // Recalculate dynamic fields
    let retailStatus = data.retailStatus;
    if (data.storage && data.retailStatus) {
        const expiryDate = data.storage.expiryDate?.toDate ? data.storage.expiryDate.toDate() : new Date(data.storage.expiryDate);
        const remainingDays = calculateRemainingDays(expiryDate);
        const status = determineFreshnessStatus(remainingDays);

        retailStatus = {
            ...data.retailStatus,
            remainingDays,
            status,
            saleAllowed: isSaleAllowed(status),
            sellByDate: data.retailStatus.sellByDate?.toDate ? data.retailStatus.sellByDate.toDate() : new Date(data.retailStatus.sellByDate)
        };
    }

    return {
        ...data,
        harvestDate,
        createdAt,
        retailStatus,
        storage: data.storage ? {
            ...data.storage,
            entryDate: data.storage.entryDate?.toDate ? data.storage.entryDate.toDate() : new Date(data.storage.entryDate),
            expiryDate: data.storage.expiryDate?.toDate ? data.storage.expiryDate.toDate() : new Date(data.storage.expiryDate),
        } : undefined,
        qualityTest: data.qualityTest ? {
            ...data.qualityTest,
            testDate: data.qualityTest.testDate?.toDate ? data.qualityTest.testDate.toDate() : new Date(data.qualityTest.testDate),
        } : undefined,
    } as BatchWithDetails;
};

// --- Hook for Real-time Batches ---
export function useBatches() {
    const [batches, setBatches] = useState<BatchWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const q = query(collection(db, BATCHES_COLLECTION), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            try {
                const results: BatchWithDetails[] = [];
                snapshot.forEach((doc) => {
                    results.push(processBatchData({ ...doc.data(), batchId: doc.id }));
                });
                setBatches(results);
                setLoading(false);
            } catch (err) {
                console.error("Error processing batches:", err);
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

    return { batches, loading, error };
}

export function useBatch(batchId: string | undefined) {
    const [batch, setBatch] = useState<BatchWithDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!batchId) {
            setLoading(false);
            return;
        }

        const docRef = doc(db, BATCHES_COLLECTION, batchId);

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                try {
                    const data = processBatchData({ ...docSnap.data(), batchId: docSnap.id });
                    setBatch(data);
                } catch (err) {
                    console.error("Error processing batch:", err);
                    setError(err as Error);
                }
            } else {
                setBatch(null);
                setError(new Error("Batch not found"));
            }
            setLoading(false);
        }, (err) => {
            console.error("Firestore Error:", err);
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [batchId]);

    return { batch, loading, error };
}

// --- Async Actions ---

export async function addBatchToFirestore(batch: BatchWithDetails) {
    // Clean up the object to be JSON-compatible / Firestore compatible
    // Firestore doesn't like custom objects or undefineds sometimes
    const { batchId, ...batchData } = batch; // Let Firestore generate ID or use batchId as doc ID?
    // Using batchId as doc ID is better for idempotency

    try {
        const docRef = doc(db, BATCHES_COLLECTION, batch.batchId);
        // Ensure dates are converted to ISO strings or Timestamps
        // For simplicity reusing the object as-is but checking for Dates
        const cleanData = JSON.parse(JSON.stringify(batch));
        // JSON.stringify converts Dates to ISO strings, which is fine, but we might want Timestamps.
        // Let's stick to ISO strings for now as they are easy to migrate from localStorage.

        await setDoc(docRef, cleanData);
    } catch (e) {
        console.error("Error adding batch", e);
        throw e;
    }
}

export async function updateBatchStatusInFirestore(batchId: string, updates: Partial<BatchWithDetails>) {
    const docRef = doc(db, BATCHES_COLLECTION, batchId);
    await updateDoc(docRef, updates);
}

export async function getBatchByIdFromFirestore(batchId: string): Promise<BatchWithDetails | null> {
    try {
        const docRef = doc(db, BATCHES_COLLECTION, batchId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return processBatchData({ ...docSnap.data(), batchId: docSnap.id });
        }
        return null;
    } catch (e) {
        console.error("Error fetching batch:", e);
        return null;
    }
}
