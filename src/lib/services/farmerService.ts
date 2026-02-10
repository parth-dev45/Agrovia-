import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    setDoc,
    doc,
    onSnapshot,
    query,
    orderBy
} from "firebase/firestore";
import { Farmer } from "@/lib/types";
import { useState, useEffect } from "react";

const FARMERS_COLLECTION = "farmers";

export function useFarmers() {
    const [farmers, setFarmers] = useState<Farmer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const q = query(collection(db, FARMERS_COLLECTION), orderBy("name", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            try {
                const results: Farmer[] = [];
                snapshot.forEach((doc) => {
                    results.push(doc.data() as Farmer);
                });
                setFarmers(results);
                setLoading(false);
            } catch (err) {
                console.error("Error processing farmers:", err);
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

    return { farmers, loading, error };
}

export async function addFarmerToFirestore(farmer: Farmer) {
    try {
        // Use farmerId as doc ID if available for consistency
        if (farmer.farmerId) {
            await setDoc(doc(db, FARMERS_COLLECTION, farmer.farmerId), farmer);
        } else {
            await addDoc(collection(db, FARMERS_COLLECTION), farmer);
        }
    } catch (e) {
        console.error("Error adding farmer", e);
        throw e;
    }
}
