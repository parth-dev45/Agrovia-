import { db } from '../firebase';
import {
    collection,
    onSnapshot,
    doc,
    setDoc,
    updateDoc,
    query,
    orderBy,
    limit,
    where,
    getDocs,
    Timestamp
} from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { Order, Crate, Bill } from '../orderData';
import { toast } from 'sonner';

const ORDERS_COLLECTION = 'orders';
const CRATES_COLLECTION = 'crates';

export function useOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // Sort orders by orderDate descending
        const q = query(collection(db, ORDERS_COLLECTION), orderBy('orderDate', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ordersList = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    // Convert Firestore Timestamps to Dates
                    orderDate: data.orderDate instanceof Timestamp ? data.orderDate.toDate() : new Date(data.orderDate),
                    fulfillmentDate: data.fulfillmentDate instanceof Timestamp ? data.fulfillmentDate.toDate() : data.fulfillmentDate ? new Date(data.fulfillmentDate) : undefined,
                    estimatedDelivery: data.estimatedDelivery instanceof Timestamp ? data.estimatedDelivery.toDate() : data.estimatedDelivery ? new Date(data.estimatedDelivery) : undefined,
                    stages: data.stages?.map((stage: any) => ({
                        ...stage,
                        startTime: stage.startTime instanceof Timestamp ? stage.startTime.toDate() : stage.startTime ? new Date(stage.startTime) : undefined,
                        completedTime: stage.completedTime instanceof Timestamp ? stage.completedTime.toDate() : stage.completedTime ? new Date(stage.completedTime) : undefined,
                        estimatedTime: stage.estimatedTime instanceof Timestamp ? stage.estimatedTime.toDate() : stage.estimatedTime ? new Date(stage.estimatedTime) : undefined,
                    }))
                } as Order;
            });
            setOrders(ordersList);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching orders:", err);
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { orders, loading, error };
}

export function useCrates() {
    const [crates, setCrates] = useState<Crate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, CRATES_COLLECTION), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const cratesList = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt)
                } as Crate;
            });
            setCrates(cratesList);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching crates:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { crates, loading };
}

export async function addOrderToFirestore(order: Order) {
    try {
        const docRef = doc(db, ORDERS_COLLECTION, order.orderId);
        // Sanitize dates for Firestore
        const firestoreOrder = {
            ...order,
            orderDate: Timestamp.fromDate(order.orderDate),
            fulfillmentDate: order.fulfillmentDate ? Timestamp.fromDate(order.fulfillmentDate) : null,
            estimatedDelivery: order.estimatedDelivery ? Timestamp.fromDate(order.estimatedDelivery) : null,
            stages: order.stages?.map(stage => ({
                ...stage,
                startTime: stage.startTime ? Timestamp.fromDate(stage.startTime) : null,
                completedTime: stage.completedTime ? Timestamp.fromDate(stage.completedTime) : null,
                estimatedTime: stage.estimatedTime ? Timestamp.fromDate(stage.estimatedTime) : null,
            }))
        };

        // Remove undefined values
        const cleanOrder = JSON.parse(JSON.stringify(firestoreOrder));

        await setDoc(docRef, cleanOrder);
        toast.success('Order placed successfully');
    } catch (error) {
        console.error("Error adding order:", error);
        toast.error('Failed to place order');
        throw error;
    }
}

export async function updateOrderStatusInFirestore(orderId: string, status: Order['status'], updates?: Partial<Order>) {
    try {
        const docRef = doc(db, ORDERS_COLLECTION, orderId);
        const updateData: any = { status, ...updates };

        if (status === 'Fulfilled' && !updates?.fulfillmentDate) {
            updateData.fulfillmentDate = Timestamp.now();
        }


        await updateDoc(docRef, updateData);
        toast.success(`Order updated to ${status}`);
    } catch (error) {
        console.error("Error updating order status:", error);
        toast.error('Failed to update order status');
        throw error;
    }
}

export async function fulfillOrderTransaction(
    order: Order,
    batch: any, // Using 'any' for now to avoid circular dependency with Batch type, or import it if possible
    fulfillmentData: Partial<Order>
) {
    try {
        const { runTransaction, doc } = await import('firebase/firestore');
        const { getProductPrice } = await import('../types');

        await runTransaction(db, async (transaction) => {
            const orderRef = doc(db, ORDERS_COLLECTION, order.orderId);
            const batchRef = doc(db, 'batches', batch.batchId);

            // 1. Read fresh data
            const batchDoc = await transaction.get(batchRef);
            if (!batchDoc.exists()) throw "Batch not found";

            const currentBatch = batchDoc.data();
            const currentCrateCount = currentBatch.crateCount || 0;

            if (currentCrateCount < order.quantity) {
                throw `Insufficient stock. Requested: ${order.quantity}, Available: ${currentCrateCount}`;
            }

            // 2. Writes
            // Deduct crates from batch
            transaction.update(batchRef, {
                crateCount: currentCrateCount - order.quantity
            });

            // Update order status
            transaction.update(orderRef, {
                status: 'Fulfilled',
                ...fulfillmentData,
                fulfillmentDate: Timestamp.now()
            });

            // Note: Retailer inventory is derived from Fulfilled Orders, so no need to write to a separate collection
        });

        toast.success(`Order ${order.orderId} fulfilled successfully!`);
    } catch (error) {
        console.error("Fulfillment Transaction Failed:", error);
        toast.error(typeof error === 'string' ? error : 'Fulfillment failed');
        throw error;
    }
}

export async function addCrateToFirestore(crate: Crate) {
    try {
        const docRef = doc(db, CRATES_COLLECTION, crate.crateId);
        const firestoreCrate = {
            ...crate,
            createdAt: Timestamp.fromDate(crate.createdAt)
        };
        await setDoc(docRef, firestoreCrate);
        toast.success('Crate created successfully');
    } catch (error) {
        console.error("Error adding crate:", error);
        toast.error('Failed to create crate');
        throw error;
    }
}

const BILLS_COLLECTION = 'bills';

export function useBills() {
    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, BILLS_COLLECTION), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const billsList = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
                } as Bill;
            });
            setBills(billsList);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching bills:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { bills, loading };
}

export async function addBillToFirestore(bill: Bill) {
    try {
        const docRef = doc(db, BILLS_COLLECTION, bill.billId);
        const firestoreBill = {
            ...bill,
            createdAt: Timestamp.fromDate(bill.createdAt)
        };

        // Remove undefined values to prevent Firestore errors
        const cleanBill = JSON.parse(JSON.stringify(firestoreBill));

        await setDoc(docRef, cleanBill);
        toast.success('Bill generated successfully');
    } catch (error) {
        console.error("Error adding bill:", error);
        toast.error('Failed to generate bill');
        throw error;
    }
}

export async function getBillByCodeFromFirestore(code: string): Promise<Bill | null> {
    try {
        const q = query(collection(db, BILLS_COLLECTION), where('uniqueCode', '==', code.toUpperCase()));
        const snapshot = await getDocs(q);

        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];
        const data = doc.data();
        return {
            ...data,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
        } as Bill;
    } catch (error) {
        console.error("Error fetching bill by code:", error);
        return null;
    }
}
