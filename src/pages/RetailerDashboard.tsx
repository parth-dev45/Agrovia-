import { useState, useRef, useEffect, useMemo } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { WAREHOUSES, WarehouseId, convertCratesToKg, getCrateCapacity, getProductById as getProduct } from '@/lib/types';
import {
  Order,
  Bill,
  generateOrderId,
  generateBillId,
  generateUniqueCode,
} from '@/lib/orderData';

import { getBatchById } from '@/lib/mockData'; // Still needed for some utility? Maybe replace later.
import { useBatches } from '@/lib/services/batchService';
import {
  useOrders,
  addOrderToFirestore,
  addBillToFirestore,
  useBills
} from '@/lib/services/orderService';
import { PRODUCTS, getProductById, getProductPrice, QualityGrade } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ShoppingCart,
  Receipt,
  Plus,
  Trash2,
  Printer,
  Package,
  Search,
  Leaf,
  CreditCard,
  ArrowRight,
  Store,
  TrendingUp,
  AlertCircle,
  Filter,
  Clock,
  QrCode
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInventoryStore, Product } from '@/lib/store';
import { getRetailerStoreById } from '@/lib/retailers';
import { getNearestWarehouse, createDeliveryStages } from '@/lib/retailers';
import { ProductIcon } from '@/components/ProductIcon';

interface CartItem {
  batchId: string;
  productName: string;
  quantity: number;
  grade: string;
  pricePerKg: number;
}

// Safe date formatting helper
const safeDateFormat = (date: any, formatStr: string) => {
  try {
    if (!date) return 'N/A';
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';
    return format(d, formatStr);
  } catch (e) {
    return 'Error';
  }
};

export default function RetailerDashboard() {
  const retailerId = 'RET-001';
  const [activeTab, setActiveTab] = useState('inventory');
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseId | 'all'>('all');

  // Firestore Integration
  const { batches: allBatches, loading: batchesLoading } = useBatches();
  const { orders: allOrders, loading: ordersLoading } = useOrders();
  const { bills } = useBills();

  // For ordering: Show warehouse inventory (available for ordering) from Firestore
  const orderableBatches = useMemo(() => {
    return allBatches.filter(b => b.qualityGrade !== null && b.status === 'Stored' && b.retailStatus?.saleAllowed && (selectedWarehouse === 'all' || b.warehouseId === selectedWarehouse));
  }, [allBatches, selectedWarehouse]);

  // For POS: Calculate retailer's own inventory dynamically from Firestore (Event Sourcing)
  // Inventory = Sum(Fulfilled Orders) - Sum(Billed Items)
  const retailerInventory = useMemo(() => {
    const invMap = new Map<string, any>();

    // 1. Add Stock from Fulfilled Orders
    allOrders.forEach(order => {
      // Ensure we only count fulfilled orders for this retailer
      if (order.retailerId === retailerId && order.status === 'Fulfilled') {
        const batch = allBatches.find(b => b.batchId === order.batchId);
        if (!batch) return;

        const qtyKg = order.quantityKg || convertCratesToKg(order.quantity, batch.cropType);

        if (!invMap.has(order.batchId)) {
          invMap.set(order.batchId, {
            ...batch, // Include all batch details (retailStatus, etc.)
            quantity: 0, // This will track available KG
            origBatch: batch
          });
        }

        const current = invMap.get(order.batchId);
        current.quantity += qtyKg;
      }
    });

    // 2. Subtract Sales from Bills
    bills.forEach(bill => {
      if (bill.retailerId === retailerId) {
        bill.items.forEach(item => {
          const current = invMap.get(item.batchId);
          if (current) {
            current.quantity -= item.quantity;
          }
        });
      }
    });

    // 3. Filter out empty/negative stock and sort by expiry
    return Array.from(invMap.values())
      .filter(item => item.quantity > 0.1) // Tolerance for float math
      .sort((a, b) => {
        const dateA = a.retailStatus?.sellByDate ? new Date(a.retailStatus.sellByDate).getTime() : 0;
        const dateB = b.retailStatus?.sellByDate ? new Date(b.retailStatus.sellByDate).getTime() : 0;
        return dateA - dateB;
      });

  }, [allOrders, bills, allBatches, retailerId]);

  // Filter orders for this retailer
  const orders = useMemo(() => allOrders.filter(o => o.retailerId === retailerId), [allOrders, retailerId]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [orderCrateQuantity, setOrderCrateQuantity] = useState('');
  const [billItems, setBillItems] = useState<CartItem[]>([]);
  const [generatedBill, setGeneratedBill] = useState<Bill | null>(null);
  const [billQuantity, setBillQuantity] = useState('');
  const [billBatchId, setBillBatchId] = useState('');
  const barcodeRef = useRef<SVGSVGElement>(null);
  const [customerPhoneInput, setCustomerPhoneInput] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<{
    phone: string;
    memberId: string;
    name?: string;
    membershipTier?: 'Free' | 'Standard' | 'Premium' | 'Basic';
  } | null>(null);
  const [orderPaymentOption, setOrderPaymentOption] = useState<'Pay Instantly' | 'Pay Later'>('Pay Later');
  const [billPaymentMethod, setBillPaymentMethod] = useState<'Cash' | 'Card' | 'UPI' | 'Card Swipe/NFC'>('Cash');

  const expiringSoonCount = retailerInventory.filter(i => {
    // Check if sellByDate exists and handles potential string/date types
    if (!i.retailStatus?.sellByDate) return false;
    const sellBy = new Date(i.retailStatus.sellByDate).getTime();
    if (isNaN(sellBy)) return false;

    const daysLeft = (sellBy - Date.now()) / (1000 * 3600 * 24);
    return daysLeft <= 3 && daysLeft > 0;
  }).length;


  // Removed syncFulfilledOrdersToInventory effect as we now derive state directly

  // Refresh orderable batches based on warehouse selection
  // Refresh retailer inventory with FIFO sort (Local Storage Sync)
  // Removed syncFulfilledOrdersToInventory effect as we now derive state directly

  useEffect(() => {
    // @ts-ignore
    if (generatedBill && barcodeRef.current && window.JsBarcode) {
      // @ts-ignore
      window.JsBarcode(barcodeRef.current, generatedBill.uniqueCode, {
        format: 'CODE128',
        width: 2,
        height: 50,
        displayValue: true
      });
    }
  }, [generatedBill]);

  const handleAddToOrder = async () => {
    if (!selectedBatch || !orderCrateQuantity) {
      toast.error('Please select a batch and quantity');
      return;
    }

    if (!selectedWarehouse || selectedWarehouse === 'all') {
      toast.error('Please select a warehouse first');
      return;
    }

    // Use batches from Firestore hook instead of legacy getBatchById
    const batch = allBatches.find(b => b.batchId === selectedBatch);
    if (!batch || !batch.qualityGrade || !batch.warehouseId) {
      toast.error('Invalid batch selected');
      return;
    }

    // Validate batch is from selected warehouse
    if (batch.warehouseId !== selectedWarehouse) {
      toast.error(`Batch is not available in ${WAREHOUSES.find(w => w.id === selectedWarehouse)?.name}`);
      return;
    }

    const requestedCrates = parseInt(orderCrateQuantity);
    const availableCrates = batch.crateCount || 0;

    if (requestedCrates > availableCrates) {
      toast.error(`Only ${availableCrates} crates available in ${WAREHOUSES.find(w => w.id === selectedWarehouse)?.name}`);
      return;
    }

    if (requestedCrates <= 0) {
      toast.error('Quantity must be at least 1 crate');
      return;
    }

    // Calculate derived KG
    const quantityKg = convertCratesToKg(requestedCrates, batch.cropType);
    const product = getProduct(batch.cropType);
    const store = getRetailerStoreById(retailerId);

    // Determine routing: source warehouse → nearest warehouse → retailer
    const sourceWarehouseId = batch.warehouseId;
    const destinationWarehouseId = getNearestWarehouse(store?.address || '');
    const stages = createDeliveryStages(sourceWarehouseId, destinationWarehouseId, store?.address || '');

    const order: Order = {
      orderId: generateOrderId(),
      retailerId: retailerId,
      batchId: selectedBatch,
      sourceWarehouseId: sourceWarehouseId,
      destinationWarehouseId: destinationWarehouseId,
      quantity: requestedCrates, // In crates
      quantityKg, // Derived KG (read-only)
      orderDate: new Date(),
      status: 'Pending',
      paymentOption: orderPaymentOption,
      paymentStatus: orderPaymentOption === 'Pay Instantly' ? 'Paid' : 'Pending',
      retailerStoreName: store?.storeName,
      retailerPhone: store?.phone,
      retailerAddress: store?.address,
      retailerCity: store?.address?.split(',')[1]?.trim(),
      stages: stages,
      currentStage: 0,
      trackingNumber: `TRK-${generateOrderId().slice(-8)}`,
      estimatedDelivery: new Date(Date.now() + (stages.length === 1 ? 24 : 48) * 60 * 60 * 1000), // 1-2 days based on stages
    };

    try {
      await addOrderToFirestore(order);
      toast.success(`Order ${order.orderId} placed: ${requestedCrates} crates (≈${quantityKg}kg ${product?.name || ''})`);
      setSelectedBatch('');
      setOrderCrateQuantity('');
    } catch (e) {
      // service handles toast
    }
  };

  const handleAddToBill = () => {
    // Check if batch is in retailer inventory (from fulfilled orders)
    const retailerBatch = retailerInventory.find(b => b.batchId === billBatchId.toUpperCase());

    if (!retailerBatch) {
      // Try to find by partial match
      const foundBatch = retailerInventory.find(b => b.batchId.toLowerCase().includes(billBatchId.toLowerCase()));
      if (foundBatch) {
        setBillBatchId(foundBatch.batchId);
        toast.info(`Using batch: ${foundBatch.batchId}`);
        return;
      }
      toast.error('Product not found in your inventory. Please scan a valid QR code from products you own.');
      return;
    }

    if (!retailerBatch.retailStatus?.saleAllowed) {
      toast.error('This product is expired and cannot be sold');
      return;
    }
    if (!billQuantity || parseFloat(billQuantity) <= 0) {
      toast.error('Please enter a valid quantity (kg)');
      return;
    }

    const requestedQty = parseFloat(billQuantity);
    // Use derived quantity from Firestore state
    const availableQty = retailerBatch.quantity;

    // Check if already in bill items
    const alreadyInBill = billItems.filter(item => item.batchId === retailerBatch.batchId)
      .reduce((sum, item) => sum + item.quantity, 0);

    if (requestedQty > (availableQty - alreadyInBill)) {
      toast.error(`Only ${(availableQty - alreadyInBill).toFixed(1)} kg available in your inventory`);
      return;
    }

    const product = getProductById(retailerBatch.cropType);
    const productName = product?.name || 'Produce';
    // Use retailer selling price (what customer pays), fallback to computed price
    const pricePerKg =
      retailerBatch.pricing?.retailerSellingPricePerUnit ??
      (retailerBatch.qualityGrade
        ? Math.round(getProductPrice(retailerBatch.cropType, retailerBatch.qualityGrade as QualityGrade) * 1.15) // Add 15% margin
        : 50);

    const newItem: CartItem = {
      batchId: retailerBatch.batchId,
      productName,
      quantity: requestedQty,
      grade: retailerBatch.qualityGrade || 'C',
      pricePerKg
    };

    setBillItems([...billItems, newItem]);
    setBillBatchId('');
    setBillQuantity('');
    toast.success('Item added to bill');
  };

  const handleRemoveFromBill = (index: number) => {
    setBillItems(billItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    const subtotal = billItems.reduce((sum, item) => sum + (item.quantity * item.pricePerKg), 0);

    // Apply Membership Discount
    let discount = 0;
    if (selectedCustomer?.membershipTier === 'Standard') {
      discount = subtotal * 0.05;
    } else if (selectedCustomer?.membershipTier === 'Premium') {
      discount = subtotal * 0.10;
    }

    return Math.max(0, subtotal - discount);
  };

  const calculateSubtotal = () => {
    return billItems.reduce((sum, item) => sum + (item.quantity * item.pricePerKg), 0);
  };

  const getDiscountAmount = () => {
    const subtotal = calculateSubtotal();
    if (selectedCustomer?.membershipTier === 'Standard') return subtotal * 0.05;
    if (selectedCustomer?.membershipTier === 'Premium') return subtotal * 0.10;
    return 0;
  };

  const handleGenerateBill = async () => {
    if (billItems.length === 0) {
      toast.error('Add items to the bill first');
      return;
    }

    const uniqueCode = generateUniqueCode();
    const customerPhone = selectedCustomer?.phone || (customerPhoneInput.trim() || undefined);
    const customerMemberId = selectedCustomer?.memberId;
    const customerName = selectedCustomer?.name;
    const bill: Bill = {
      billId: generateBillId(),
      retailerId: 'RET-001',
      items: billItems.map(item => ({
        batchId: item.batchId,
        quantity: item.quantity,
        grade: item.grade,
        pricePerKg: item.pricePerKg,
        amount: item.quantity * item.pricePerKg,
        productName: item.productName
      })),
      totalAmount: calculateTotal(),
      createdAt: new Date(),
      uniqueCode,
      customerPhone,
      customerMemberId,
      customerName,
      paymentMethod: billPaymentMethod,
      paymentStatus: 'Paid',
    };

    // Inventory is automatically updated via useMemo when bills change

    try {
      await addBillToFirestore(bill);
      setGeneratedBill(bill);
      setBillItems([]);
      toast.success(`Bill generated with code: ${uniqueCode}`);
    } catch (e) {
      // service handles toast
    }
  };

  const handlePrintBill = () => {
    if (!generatedBill) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Bill - ${generatedBill.billId}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; margin: 20px; max-width: 400px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 20px; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; }
            .info { margin: 15px 0; font-size: 14px; }
            table { width: 100%; margin: 15px 0; font-size: 14px; }
            th { text-align: left; border-bottom: 1px solid #000; }
            td { padding: 4px 0; }
            .total { font-size: 18px; font-weight: bold; text-align: right; margin: 20px 0; border-top: 2px dashed #000; padding-top: 10px; }
            .barcode { text-align: center; margin: 30px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">AGROVIA</div>
            <div>Premium Fresh Produce</div>
            <div>Retail Partner: RET-001</div>
          </div>
          <div class="info">
            <div><strong>Bill ID:</strong> ${generatedBill.billId}</div>
            <div><strong>Date:</strong> ${format(generatedBill.createdAt, 'PPpp')}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Trace</th>
                <th>Qty</th>
                <th style="text-align:right">Amt</th>
              </tr>
            </thead>
            <tbody>
              ${generatedBill.items.map((item, index) => `
                <tr>
                  <td>
                    ${item.productName}<br/>
                    <small>Batch ${item.batchId} (Gr ${item.grade})</small>
                  </td>
                  <td>
                    <div id="qr-${index}"></div>
                  </td>
                  <td>${item.quantity.toFixed(3)}kg x ${item.pricePerKg.toFixed(3)}</td>
                  <td style="text-align:right">Rs.${item.amount.toFixed(3)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
            </tbody>
          </table>
          <div style="text-align: right; margin-bottom: 5px;">
            Subtotal: Rs.${calculateSubtotal().toFixed(3)}
          </div>
          ${getDiscountAmount() > 0 ? `
          <div style="text-align: right; margin-bottom: 5px; color: green;">
             Discount (${selectedCustomer?.membershipTier}): -Rs.${getDiscountAmount().toFixed(3)}
          </div>
          ` : ''}
          <div class="total">TOTAL: Rs.${generatedBill.totalAmount.toFixed(3)}</div>
          <div class="barcode">
            <svg id="barcode"></svg>
          </div>
          <div class="footer">
            <p>Scan for Quality Verification</p>
            <p><strong>agrovia.app</strong></p>
            <p>Thank you for shopping fresh!</p>
          </div>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
          <script>
            // Generate Barcode for Bill ID
            JsBarcode("#barcode", "${generatedBill.uniqueCode}", { format: "CODE128", width: 1.5, height: 40, displayValue: true });

            // Generate QR Codes for each item
            const items = ${JSON.stringify(generatedBill.items)};
            const origin = "${window.location.origin}";
            
            items.forEach((item, index) => {
              const container = document.getElementById('qr-' + index);
              if (container) {
                new QRCode(container, {
                  text: origin + "/scan/" + item.batchId,
                  width: 50,
                  height: 50,
                  correctLevel: QRCode.CorrectLevel.L
                });
              }
            });

            // Wait for QR codes to render before printing
            setTimeout(() => {
                window.print();
            }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleNewBill = () => {
    setBillItems([]);
    setGeneratedBill(null);
    setSelectedCustomer(null);
    setCustomerPhoneInput('');
  };

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-700">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border p-6 shadow-sm">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-fresh/20 to-transparent rounded-full blur-2xl" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 bg-white/80 dark:bg-black/20 rounded-3xl flex items-center justify-center shadow-xl backdrop-blur-sm">
                <Store className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Retailer Portal
                </h1>
                <p className="text-lg text-muted-foreground mt-1">Complete POS & Inventory Management Solution</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-fresh animate-pulse" />
                    <span>Live Inventory</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span>Real-time Pricing</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="bg-white/60 dark:bg-black/20 backdrop-blur-sm px-6 py-3 rounded-2xl border border-border/50 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-fresh animate-pulse" />
                    <span className="text-sm font-medium">System Online</span>
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <span className="text-sm text-muted-foreground font-mono">{format(new Date(), 'HH:mm')}</span>
                </div>
              </div>
              {expiringSoonCount > 0 && (
                <div className="bg-warning/10 border border-warning/30 px-4 py-2 rounded-xl">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium text-warning">{expiringSoonCount} items expiring soon</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="billing" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 bg-secondary/50 p-1 rounded-lg h-12">
            <TabsTrigger value="billing" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm h-12">
              <Receipt className="h-4 w-4" />
              Customer Billing (POS)
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm h-12">
              <ShoppingCart className="h-4 w-4" />
              Inventory Procurement
            </TabsTrigger>
          </TabsList>

          {/* Billing Tab (POS) */}
          <TabsContent value="billing" className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
            {!generatedBill ? (
              <div className="grid gap-6 lg:grid-cols-3 min-h-[700px]">
                {/* Left: Product Entry + Customer */}
                <div className="lg:col-span-2 space-y-6 overflow-y-auto max-h-[700px]">
                  <Card className="bg-card border border-border rounded-lg shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Customer Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex gap-3 items-end">
                        <div className="flex-1">
                          <Label className="text-xs">Customer Phone</Label>
                          <Input
                            placeholder="Enter phone number"
                            value={customerPhoneInput}
                            onChange={(e) => setCustomerPhoneInput(e.target.value)}
                            onBlur={async () => {
                              const phone = customerPhoneInput.trim();
                              if (!phone) {
                                setSelectedCustomer(null);
                                return;
                              }
                              try {
                                const { getCustomerByPhoneFromFirestore } = await import('@/lib/services/customerService');
                                const existing = await getCustomerByPhoneFromFirestore(phone);
                                if (existing) {
                                  setSelectedCustomer({
                                    phone: existing.phone,
                                    memberId: existing.memberId,
                                    name: existing.name,
                                    membershipTier: existing.membershipTier as any
                                  });
                                  toast.success(`Member found: ${existing.memberId}`);
                                } else {
                                  setSelectedCustomer(null);
                                }
                              } catch (e) {
                                console.error("Error looking up customer", e);
                              }
                            }}
                            className="h-10 text-sm"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="default"
                          size="default"
                          className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md whitespace-nowrap px-4"
                          onClick={async () => {
                            const phone = customerPhoneInput.trim();
                            if (!phone) {
                              toast.error('Enter a phone number first');
                              return;
                            }
                            try {
                              const { createCustomerInFirestore } = await import('@/lib/services/customerService');
                              const customer = await createCustomerInFirestore({ phone });
                              setSelectedCustomer({
                                phone: customer.phone,
                                memberId: customer.memberId,
                                name: customer.name,
                                membershipTier: customer.membershipTier as any
                              });
                            } catch (e) {
                              // Service handles toast
                            }
                          }}
                        >
                          Create Member ID
                        </Button>
                      </div>
                      {selectedCustomer && (
                        <div className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/40 px-3 py-2 text-xs">
                          <div>
                            <p className="font-medium">
                              {selectedCustomer.name || 'Member'} ({selectedCustomer.phone})
                            </p>
                            <p className="text-muted-foreground">
                              ID: <span className="font-mono">{selectedCustomer.memberId}</span>
                            </p>
                          </div>
                          <Badge variant="outline" className={`text-[10px] ${selectedCustomer.membershipTier === 'Premium' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                            selectedCustomer.membershipTier === 'Standard' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : ''
                            }`}>
                            {selectedCustomer.membershipTier?.toUpperCase() || 'MEMBER'}
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  <Card className="bg-card border border-border rounded-lg shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        Add Items
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-3 space-y-2">
                          <Label>Scan Batch ID / Select from Your Inventory</Label>
                          <Select
                            value={billBatchId}
                            onValueChange={setBillBatchId}
                          >
                            <SelectTrigger className="pl-9 h-12 text-lg bg-white/50">
                              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                              <SelectValue placeholder="Scan QR or Select from your inventory..." />
                            </SelectTrigger>
                            <SelectContent>
                              {retailerInventory.length === 0 ? (
                                <div className="p-4 text-center text-muted-foreground text-sm">
                                  No products in your inventory. Place orders from warehouse first.
                                </div>
                              ) : (
                                retailerInventory
                                  .filter(b => b.retailStatus?.saleAllowed && b.quantity > 0)
                                  .map(batch => {
                                    const product = getProductById(batch.cropType);
                                    const available = batch.quantity;
                                    return (
                                      <SelectItem key={batch.batchId} value={batch.batchId}>
                                        <div className="flex items-center gap-2">
                                          <ProductIcon productId={batch.cropType} size={18} className="text-primary" />
                                          <span className="font-medium">{product?.name}</span>
                                          <Badge variant="outline" className="ml-2 font-mono text-xs">{batch.batchId}</Badge>
                                          <span className="text-muted-foreground text-xs ml-2">{available.toFixed(1)}kg available</span>
                                        </div>
                                      </SelectItem>
                                    );
                                  })
                              )}
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Or type batch ID to scan..."
                            value={billBatchId}
                            onChange={(e) => setBillBatchId(e.target.value.toUpperCase())}
                            className="h-10 text-sm font-mono tracking-wide bg-secondary/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Quantity (kg)</Label>
                          <div className="relative">
                            <Input
                              type="number"
                              min="0"
                              step="0.1"
                              placeholder="0.00"
                              value={billQuantity}
                              onChange={(e) => setBillQuantity(e.target.value)}
                              className="h-12 text-lg pr-12"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">
                              kg
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button onClick={handleAddToBill} className="w-full h-12 text-lg shadow-lg shadow-primary/10">
                        <Plus className="h-5 w-5 mr-2" /> Add to Cart
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Quick Keypad (Visual Only) */}
                  <div className="grid grid-cols-3 gap-3">
                    {PRODUCTS.slice(0, 4).map(product => {
                      // Only show products from retailer's inventory for POS
                      const available = retailerInventory
                        .filter(b => b.cropType === product.id && b.retailStatus?.saleAllowed)
                        .reduce((sum, b) => sum + b.quantity, 0);

                      return (
                        <button
                          key={product.id}
                          className={cn(
                            "p-4 rounded-xl border flex flex-col items-center gap-2 transition-all hover:scale-105 active:scale-95 bg-white shadow-sm",
                            available > 0 ? "border-border" : "opacity-50 border-dashed"
                          )}
                          onClick={() => toast.info(`Please scan a specific batch of ${product.name}`)}
                        >
                          <ProductIcon productId={product.id} size={24} className="text-primary" />
                          <span className="font-medium text-sm">{product.name}</span>
                          <span className={cn("text-xs font-bold", available > 0 ? "text-fresh" : "text-destructive")}>
                            {available > 0 ? `${available}kg` : 'Out of Stock'}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Right: Cart & Totals */}
                <Card className="flex flex-col h-full max-h-[700px] shadow-sm border border-border rounded-lg">
                  <CardHeader className="bg-secondary/30 pb-4 border-b">
                    <CardTitle className="flex justify-between items-center">
                      <span>Current Bill</span>
                      <Badge variant="outline" className="font-mono">{billItems.length} items</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto p-0">
                    {billItems.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-2">
                        <ShoppingCart className="h-12 w-12" />
                        <p>Cart is empty</p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {billItems.map((item, index) => (
                          <div key={index} className="p-4 flex justify-between items-start group hover:bg-secondary/20 transition-colors">
                            <div>
                              <p className="font-medium">{item.productName} <span className="text-xs font-normal text-muted-foreground">({item.grade})</span></p>
                              <p className="text-xs font-mono text-muted-foreground">{item.batchId}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">Rs.{(item.quantity * item.pricePerKg).toFixed(3)}</p>
                              <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                                <span>{item.quantity}kg x {item.pricePerKg}</span>
                                <button onClick={() => handleRemoveFromBill(index)} className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1">
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <div className="p-4 bg-secondary/50 border-t space-y-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total to Pay</span>
                      <span className="text-2xl text-primary">Rs.{calculateTotal().toFixed(3)}</span>
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <Select value={billPaymentMethod} onValueChange={(v: 'Cash' | 'Card' | 'UPI' | 'Card Swipe/NFC') => setBillPaymentMethod(v)}>
                        <SelectTrigger className="h-12 bg-white/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Card">Card</SelectItem>
                          <SelectItem value="UPI">UPI</SelectItem>
                          <SelectItem value="Card Swipe/NFC">Card Swipe/NFC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleGenerateBill}
                      className="w-full h-14 text-lg font-bold shadow-xl rounded-xl"
                      size="lg"
                      disabled={billItems.length === 0}
                    >
                      <CreditCard className="mr-2 h-5 w-5" /> Checkout
                    </Button>
                  </div>
                </Card>
              </div>
            ) : (
              /* Generated Bill View */
              <div className="flex justify-center py-8 animate-in zoom-in-95 duration-300">
                <Card className="w-full max-w-md shadow-md border border-border rounded-xl">
                  <div className="bg-primary h-2 w-full" />
                  <CardHeader className="text-center pb-2">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
                      <Store className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl uppercase tracking-widest">AgroVia</CardTitle>
                    <CardDescription>Official Receipt</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 px-8 pb-8">
                    <div className="border-y border-dashed py-4 space-y-1 text-sm text-center">
                      <p>Bill ID: <span className="font-mono font-bold">{generatedBill.billId}</span></p>
                      <p className="text-muted-foreground">{format(generatedBill.createdAt, 'PPpp')}</p>
                      {generatedBill.customerMemberId && (
                        <p className="text-xs text-muted-foreground">
                          Member: <span className="font-mono">{generatedBill.customerMemberId}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      {generatedBill.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-dashed border-border/30 last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="bg-white p-1 rounded-sm border shrink-0">
                              <QRCodeSVG
                                value={`${window.location.origin}/scan/${item.batchId}`}
                                size={32}
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium">{item.productName}</span>
                              <span className="text-muted-foreground text-xs">Qty: {item.quantity} • Gr {item.grade}</span>
                            </div>
                          </div>
                          <span className="font-medium text-right">Rs.{item.amount.toFixed(3)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-dashed pt-4 flex justify-between items-end">
                      <span className="text-sm font-bold uppercase text-muted-foreground">Total</span>
                      <span className="text-2xl font-black">Rs.{generatedBill.totalAmount.toFixed(3)}</span>
                    </div>

                    {generatedBill.paymentMethod && (
                      <div className="bg-secondary/30 p-3 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground mb-1">Payment Method</p>
                        <p className="font-semibold">{generatedBill.paymentMethod}</p>
                      </div>
                    )}

                    {generatedBill.paymentMethod === 'UPI' && (
                      <div className="bg-white p-6 rounded-xl border-2 border-primary/20 flex flex-col items-center space-y-3">
                        <p className="text-sm font-semibold">Scan QR Code to Pay</p>
                        <div className="w-48 h-48 bg-white border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center">
                          <QrCode className="h-32 w-32 text-primary/50" />
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          Amount: <span className="font-bold">Rs.{generatedBill.totalAmount.toFixed(3)}</span>
                        </p>
                        <p className="text-xs text-muted-foreground text-center">
                          UPI ID: agrovia@paytm
                        </p>
                      </div>
                    )}

                    {generatedBill.paymentMethod === 'Card Swipe/NFC' && (
                      <div className="bg-white p-6 rounded-xl border-2 border-primary/20 flex flex-col items-center space-y-3">
                        <CreditCard className="h-16 w-16 text-primary/50" />
                        <p className="text-sm font-semibold">Swipe Card or Tap to Pay</p>
                        <p className="text-xs text-muted-foreground text-center">
                          Amount: <span className="font-bold">Rs.{generatedBill.totalAmount.toFixed(3)}</span>
                        </p>
                      </div>
                    )}

                    <div className="bg-secondary/50 p-4 rounded-xl text-center space-y-2">
                      <svg ref={barcodeRef} className="w-full h-12" />
                      <p className="font-mono font-bold tracking-[0.2em] text-lg">{generatedBill.uniqueCode}</p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex gap-3">
                        <Button onClick={handlePrintBill} variant="outline" className="flex-1">
                          <Printer className="mr-2 h-4 w-4" /> Print
                        </Button>
                        <Button onClick={handleNewBill} className="flex-1">
                          <Plus className="mr-2 h-4 w-4" /> New Customer
                        </Button>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 text-xs"
                          onClick={async () => {
                            const textLines = [
                              `AgroVia Receipt - ${generatedBill.billId}`,
                              `Date: ${format(generatedBill.createdAt, 'PPpp')}`,
                              generatedBill.customerMemberId ? `Member: ${generatedBill.customerMemberId}` : '',
                              '--- Items ---',
                              ...generatedBill.items.map(
                                (item) =>
                                  `${item.productName} - ${item.quantity}kg x Rs.${item.pricePerKg} = Rs.${item.amount}`
                              ),
                              `TOTAL: Rs.${generatedBill.totalAmount.toFixed(3)}`,
                              `Code: ${generatedBill.uniqueCode}`,
                            ].filter(Boolean);
                            const text = textLines.join('\n');
                            try {
                              await navigator.clipboard.writeText(text);
                              toast.success('Bill copied to clipboard');
                            } catch {
                              toast.error('Could not copy bill text');
                            }
                          }}
                        >
                          Copy Bill Text
                        </Button>
                        {generatedBill.customerPhone && (
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1 text-xs"
                            onClick={() => {
                              const billText = [
                                `*AGROVIA - OFFICIAL RECEIPT*`,
                                ``,
                                `Bill ID: ${generatedBill.billId}`,
                                `Date: ${format(generatedBill.createdAt, 'dd MMM yyyy, hh:mm a')}`,
                                generatedBill.customerMemberId ? `Member ID: ${generatedBill.customerMemberId}` : '',
                                generatedBill.customerName ? `Customer: ${generatedBill.customerName}` : '',
                                ``,
                                `*ITEMS:*`,
                                ...generatedBill.items.map(
                                  (item) =>
                                    `• ${item.productName} (Grade ${item.grade})\n  ${item.quantity.toFixed(3)}kg × Rs.${item.pricePerKg.toFixed(3)} = Rs.${item.amount.toFixed(3)}`
                                ),
                                ``,
                                `*TOTAL: Rs.${generatedBill.totalAmount.toFixed(3)}*`,
                                `Payment: ${generatedBill.paymentMethod || 'Cash'}`,
                                ``,
                                `Unique Code: ${generatedBill.uniqueCode}`,
                                ``,
                                `Thank you for shopping with AgroVia! 🌱`,
                                `Visit us again for fresh produce.`
                              ].filter(Boolean).join('\n');
                              const text = encodeURIComponent(billText);
                              const phone = generatedBill.customerPhone.replace(/\D/g, '');
                              const url = `https://wa.me/${phone}?text=${text}`;
                              window.open(url, '_blank');
                            }}
                          >
                            Send via WhatsApp
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Procurement Tab */}
          <TabsContent value="orders" className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
            <div className="grid gap-6 lg:grid-cols-2 min-h-[600px]">
              <Card className="bg-card border border-border rounded-lg shadow-sm">
                <CardHeader>
                  <CardTitle>Place Warehouse Order</CardTitle>
                  <CardDescription>Select warehouse and order crates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Warehouse <span className="text-destructive">*</span></Label>
                    <Select value={selectedWarehouse} onValueChange={(v) => setSelectedWarehouse(v as WarehouseId | 'all')}>
                      <SelectTrigger className="h-12 bg-white/50">
                        <SelectValue placeholder="Choose warehouse..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Warehouses</SelectItem>
                        {WAREHOUSES.map(wh => (
                          <SelectItem key={wh.id} value={wh.id}>{wh.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedWarehouse === 'all' && (
                      <p className="text-xs text-warning">⚠️ Please select a specific warehouse to place orders</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Select Product Batch</Label>
                    <Select value={selectedBatch} onValueChange={setSelectedBatch} disabled={selectedWarehouse === 'all'}>
                      <SelectTrigger className="h-12 bg-white/50">
                        <SelectValue placeholder={selectedWarehouse === 'all' ? "Select warehouse first..." : "Choose available stock..."} />
                      </SelectTrigger>
                      <SelectContent>
                        {orderableBatches.length === 0 ? (
                          <div className="p-4 text-center text-muted-foreground text-sm">
                            {selectedWarehouse === 'all'
                              ? 'Select a warehouse to view inventory'
                              : 'No stock available in this warehouse'}
                          </div>
                        ) : (
                          orderableBatches.map(batch => {
                            const product = getProductById(batch.cropType);
                            const availableCrates = batch.crateCount || 0;
                            const availableKg = convertCratesToKg(availableCrates, batch.cropType);
                            if (availableCrates <= 0) return null;
                            return (
                              <SelectItem key={batch.batchId} value={batch.batchId}>
                                <div className="flex items-center gap-2">
                                  <ProductIcon productId={batch.cropType} size={18} className="text-primary" />
                                  <span className="font-medium">{product?.name}</span>
                                  <Badge variant="outline" className="ml-2 font-mono text-xs">{batch.batchId}</Badge>
                                  <span className="text-muted-foreground text-xs ml-2">Grade {batch.qualityGrade} • {availableCrates} crates (≈{availableKg.toFixed(1)}kg)</span>
                                </div>
                              </SelectItem>
                            );
                          })
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity (crates) <span className="text-destructive">*</span></Label>
                    <div className="relative">
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="0"
                        value={orderCrateQuantity}
                        onChange={(e) => setOrderCrateQuantity(e.target.value)}
                        className="h-12 bg-white/50 pr-20"
                        disabled={!selectedBatch || selectedWarehouse === 'all'}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm flex items-center gap-1">
                        <span>crates</span>
                        {selectedBatch && orderCrateQuantity && (() => {
                          const batch = getBatchById(selectedBatch);
                          if (!batch) return null;
                          const kg = convertCratesToKg(parseInt(orderCrateQuantity) || 0, batch.cropType);
                          return <span className="text-xs">(≈{kg.toFixed(1)}kg)</span>;
                        })()}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Option</Label>
                    <Select value={orderPaymentOption} onValueChange={(v: 'Pay Instantly' | 'Pay Later') => setOrderPaymentOption(v)}>
                      <SelectTrigger className="h-12 bg-white/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pay Instantly">Pay Instantly</SelectItem>
                        <SelectItem value="Pay Later">Pay Later</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleAddToOrder}
                    className="w-full h-12 text-lg"
                    disabled={!selectedBatch || !orderCrateQuantity || selectedWarehouse === 'all'}
                  >
                    <Package className="mr-2 h-5 w-5" /> Submit Order
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-none bg-transparent">
                <CardHeader className="px-0">
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="space-y-3">
                    {orders.slice(-5).reverse().map(order => (
                      <div key={order.orderId} className="bg-white/60 border p-4 rounded-xl flex items-center justify-between shadow-sm">
                        <div>
                          <p className="font-mono font-bold text-sm">{order.orderId}</p>
                          <div className="text-xs text-muted-foreground mt-1">
                            <span className="font-medium text-foreground">{order.quantity} crates</span>
                            {order.quantityKg && <span> (≈{order.quantityKg.toFixed(1)}kg)</span>}
                            <span className="block mt-1">from {order.batchId}</span>
                            {order.sourceWarehouseId && <span className="block">{WAREHOUSES.find(w => w.id === order.sourceWarehouseId)?.name}</span>}
                            {order.paymentOption && (
                              <span className="block mt-1 text-xs">
                                Payment: <span className={cn(
                                  "font-medium",
                                  order.paymentOption === 'Pay Instantly' ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"
                                )}>
                                  {order.paymentOption}
                                </span>
                                {order.paymentStatus && (
                                  <span className={cn(
                                    "ml-1",
                                    order.paymentStatus === 'Paid' ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                                  )}>
                                    ({order.paymentStatus})
                                  </span>
                                )}
                              </span>
                            )}
                            {order.status === 'Delivered' && (order.assignedDriverName || order.assignedTruckNumber) && (
                              <span className="block mt-1 text-foreground/80">
                                Assigned: {order.assignedDriverName || 'Driver'} • {order.assignedTruckNumber || 'Truck'}
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'} className={order.status === 'Delivered' ? 'bg-fresh hover:bg-fresh/90' : ''}>
                          {order.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
