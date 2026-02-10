import { useState, useRef, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
// import { getAllBatches } from '@/lib/mockData'; // Removed
import { useBatches, updateBatchStatusInFirestore } from '@/lib/services/batchService';
import { determineGradeFromVisualAndFirmness, calculateExpiryDate, calculateRemainingDays, determineFreshnessStatus, isSaleAllowed } from '@/lib/freshness';
import { Firmness, QualityGrade, BatchWithDetails, getProductById, getProductPrice, BatchPricing, WarehouseId } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ClipboardCheck, Star, CheckCircle2, AlertCircle, TrendingUp, Thermometer, Camera, Sparkles, Loader2, Scan, RefreshCw, Microscope, Beaker, Zap, Target, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { computeThreeTierPricing, getModalPriceForWarehouse } from '@/lib/marketPricing';
import { ProductIcon } from '@/components/ProductIcon';

export default function QualityGrading() {
  const { toast } = useToast();
  const { batches: allBatches, loading: batchesLoading } = useBatches(); // Use hook

  const untestedBatches = allBatches.filter(b => b.qualityGrade === null);
  const testedBatches = allBatches.filter(b => b.qualityGrade !== null);

  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [visualQuality, setVisualQuality] = useState([3]);
  const [firmness, setFirmness] = useState<Firmness>('Medium');
  const [gradedBatch, setGradedBatch] = useState<{ batch: BatchWithDetails; grade: QualityGrade } | null>(null);

  // AI Simulator State
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResult, setAiResult] = useState<{ grade: QualityGrade; confidence: number; defects: string[]; batchId?: string; cropType?: string } | null>(null);

  const selectedBatch = untestedBatches.find(b => b.batchId === selectedBatchId);
  const calculatedGrade = determineGradeFromVisualAndFirmness(visualQuality[0], firmness);

  const simulateAiAnalysis = () => {
    if (!selectedBatch) return;
    setIsAnalysing(true);
    setAiResult(null);

    // Mock analysis delay
    setTimeout(() => {
      setIsAnalysing(false);
      const randomScore = Math.random();
      let result = {
        grade: 'A' as QualityGrade,
        confidence: 98,
        defects: [] as string[],
        batchId: selectedBatch.batchId,
        cropType: selectedBatch.cropType
      };

      if (randomScore > 0.6) {
        result = {
          grade: 'A',
          confidence: 96,
          defects: ['None detected'],
          batchId: selectedBatch.batchId,
          cropType: selectedBatch.cropType
        };
      } else if (randomScore > 0.3) {
        result = {
          grade: 'B',
          confidence: 89,
          defects: ['Minor surface blemishes'],
          batchId: selectedBatch.batchId,
          cropType: selectedBatch.cropType
        };
      } else {
        result = {
          grade: 'C',
          confidence: 92,
          defects: ['Visible bruising', 'Size variance'],
          batchId: selectedBatch.batchId,
          cropType: selectedBatch.cropType
        };
      }

      setAiResult(result);

      // Auto-apply logic
      if (result.grade === 'A') {
        setVisualQuality([5]);
        setFirmness('High');
      } else if (result.grade === 'B') {
        setVisualQuality([3]);
        setFirmness('Medium');
      } else {
        setVisualQuality([2]);
        setFirmness('Low');
      }

      toast({
        title: "AI Analysis Complete",
        description: `Detected Grade ${result.grade} with ${result.confidence}% confidence.`,
      });

    }, 2500);
  };

  const handleGrade = async () => {
    if (!selectedBatch) return;
    setIsSubmitting(true);

    const grade = calculatedGrade;
    const storageType = selectedBatch.storage?.storageType || 'Normal';
    const harvestDate = new Date(selectedBatch.harvestDate);
    const productId = selectedBatch.cropType;
    const expiryDate = calculateExpiryDate(harvestDate, grade, storageType, productId);
    const remainingDays = calculateRemainingDays(expiryDate);
    const status = determineFreshnessStatus(remainingDays);

    const updateBatchBaseUpdates: Partial<BatchWithDetails> = {
      qualityGrade: grade,
      status: 'Stored' as const, // Update status: Test Pending → Tested → Stored
      qualityTest: {
        testId: `TEST-${selectedBatchId}`,
        batchId: selectedBatchId,
        visualQuality: visualQuality[0],
        freshnessDays: remainingDays,
        firmness,
        finalGrade: grade,
        testDate: new Date(),
      },
      storage: {
        ...selectedBatch.storage!,
        expiryDate,
        expectedShelfLife: expiryDate.getTime() - harvestDate.getTime(),
      },
      retailStatus: {
        batchId: selectedBatchId,
        sellByDate: expiryDate,
        remainingDays,
        status,
        saleAllowed: isSaleAllowed(status),
      },
    };

    // Try to attach market-based pricing from CSV
    let pricing: BatchPricing | undefined;
    try {
      const warehouseId = selectedBatch.warehouseId as WarehouseId | undefined;
      const info = await getModalPriceForWarehouse(productId, warehouseId);
      if (info) {
        const threeTier = computeThreeTierPricing(info.modalPrice, grade);
        pricing = {
          market: info.market,
          commodity: info.commodity,
          modalPrice: info.modalPrice,
          farmerPayoutPerUnit: threeTier.farmerPayoutPerUnit,
          warehousePricePerUnit: threeTier.warehousePricePerUnit,
          retailerSellingPricePerUnit: threeTier.retailerSellingPricePerUnit,
          csvDate: String(info.dateSerial),
          computedAt: new Date().toISOString(),
          source: 'csv',
        };
      }
    } catch {
      // If CSV pricing fails, we silently fall back to default pricing
    }

    const updates = {
      ...updateBatchBaseUpdates,
      ...(pricing ? { pricing } : {}),
    };

    try {
      await updateBatchStatusInFirestore(selectedBatchId, updates);

      // Construct full object for display
      const updateBatch: BatchWithDetails = {
        ...selectedBatch,
        ...updates,
        storage: { ...selectedBatch.storage, ...updates.storage } as any, // Type assertion for brevity
        qualityTest: { ...selectedBatch.qualityTest, ...updates.qualityTest } as any,
        retailStatus: { ...selectedBatch.retailStatus, ...updates.retailStatus } as any,
      };

      const pricePerUnit =
        pricing?.retailerSellingPricePerUnit ?? getProductPrice(productId, grade);
      setGradedBatch({ batch: updateBatch, grade });
      setAiResult(null);

      toast({
        title: 'Quality Test Complete',
        description: `Batch graded as ${grade}. Farmer: Rs.${pricing?.farmerPayoutPerUnit ?? Math.round(pricePerUnit * 0.95)}/${getProductById(productId)?.unit || 'kg'}, Retailer: Rs.${pricePerUnit}/${getProductById(productId)?.unit || 'kg'}`,
      });
    } catch (error) {
      toast({
        title: "Error Grading Batch",
        description: "Failed to update batch status.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedBatchId('');
    setVisualQuality([3]);
    setFirmness('Medium');
    setGradedBatch(null);
    setAiResult(null);
  };

  const gradeColors = {
    A: 'bg-fresh text-fresh-foreground shadow-fresh/25',
    B: 'bg-warning text-warning-foreground shadow-warning/25',
    C: 'bg-expired text-expired-foreground shadow-expired/25',
  };

  const gradeDescription = {
    A: 'Premium Export Quality',
    B: 'Standard Market Quality',
    C: 'Processing / Low Quality',
  };

  if (gradedBatch) {
    const product = getProductById(gradedBatch.batch.cropType);
    const productName = product?.name || gradedBatch.batch.cropType;
    const productUnit = product?.unit || 'kg';
    const pricing = gradedBatch.batch.pricing;
    const fallbackPrice = getProductPrice(gradedBatch.batch.cropType, gradedBatch.grade);

    // Calculate 3-tier pricing (use pricing if available, otherwise compute from fallback)
    const farmerPayout = pricing?.farmerPayoutPerUnit ?? Math.round(fallbackPrice * 0.95);
    const warehousePrice = pricing?.warehousePricePerUnit ?? Math.round((fallbackPrice + 2) * 1.08);
    const retailerPrice = pricing?.retailerSellingPricePerUnit ?? Math.round(warehousePrice * 1.15);

    return (
      <Layout>
        <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
          <Card className="glass-card border-2 border-fresh/50 shadow-2xl">
            <CardHeader className="text-center pb-8 border-b border-border/50">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-fresh to-fresh/80 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-fresh/20 animate-in spin-in-12 duration-1000">
                <CheckCircle2 className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fresh to-primary">Quality Test Complete!</CardTitle>
              <CardDescription className="text-lg">
                {productName} has been graded and priced accordingly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-8">
              <div className="text-center space-y-4">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Final Grade Assigned</p>
                <div className={`text-7xl font-black px-12 py-8 rounded-3xl inline-block shadow-2xl ${gradeColors[gradedBatch.grade]} transition-all hover:scale-105`}>
                  {gradedBatch.grade}
                </div>
                <p className="text-xl font-medium text-muted-foreground">{gradeDescription[gradedBatch.grade]}</p>
              </div>

              {/* 3-Tier Pricing Display */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center mb-4">Pricing Structure</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-500/10 rounded-2xl border border-green-500/30 text-center hover:bg-green-500/15 transition-colors">
                    <p className="text-sm text-muted-foreground mb-2">Farmer Payout</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">Rs.{farmerPayout}<span className="text-sm font-normal text-muted-foreground">/{productUnit}</span></p>
                    <p className="text-xs text-muted-foreground mt-1">What farmer receives</p>
                  </div>
                  <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/30 text-center hover:bg-blue-500/15 transition-colors">
                    <p className="text-sm text-muted-foreground mb-2">Warehouse Price</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">Rs.{warehousePrice}<span className="text-sm font-normal text-muted-foreground">/{productUnit}</span></p>
                    <p className="text-xs text-muted-foreground mt-1">Retailer purchase price</p>
                  </div>
                  <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/30 text-center hover:bg-purple-500/15 transition-colors">
                    <p className="text-sm text-muted-foreground mb-2">Retailer Selling Price</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">Rs.{retailerPrice}<span className="text-sm font-normal text-muted-foreground">/{productUnit}</span></p>
                    <p className="text-xs text-muted-foreground mt-1">Customer price (includes testing & logistics)</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 text-sm max-w-lg mx-auto">
                <div className="p-4 bg-secondary/30 rounded-2xl border border-border/50 text-center hover:bg-secondary/50 transition-colors">
                  <p className="text-muted-foreground mb-1">Predicted Shelf Life</p>
                  <p className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                    {gradedBatch.batch.retailStatus?.remainingDays} <span className="text-sm font-normal text-muted-foreground">days</span>
                  </p>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Farmer Payout Impact
                </h4>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Excellent work! Highest quality grading means better prices for farmers.
                  Grade {gradedBatch.grade} earns <span className="font-bold">Rs.{retailerPrice}</span> for customers
                  (vs Rs.{getProductPrice(gradedBatch.batch.cropType, 'C')} for Grade C).
                </p>
              </div>

              <Button onClick={resetForm} className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
                Grade Another Batch
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="relative">
        {/* Background Decorative Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-32 -left-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-60 -right-20 w-80 h-80 bg-fresh/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
          <div className="absolute bottom-40 left-32 w-48 h-48 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '6s' }} />
        </div>

        {/* Floating Lab Equipment Graphics */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-40 right-32 opacity-10 animate-bounce" style={{ animationDuration: '8s' }}>
            <Beaker className="w-12 h-12 text-primary rotate-12" />
          </div>
          <div className="absolute top-80 left-40 opacity-10 animate-bounce" style={{ animationDuration: '6s', animationDelay: '2s' }}>
            <Microscope className="w-16 h-16 text-fresh -rotate-12" />
          </div>
          <div className="absolute bottom-60 right-20 opacity-10 animate-bounce" style={{ animationDuration: '7s', animationDelay: '4s' }}>
            <Target className="w-14 h-14 text-accent rotate-45" />
          </div>
          <div className="absolute bottom-40 left-60 opacity-10 animate-bounce" style={{ animationDuration: '9s', animationDelay: '1s' }}>
            <Zap className="w-10 h-10 text-warning -rotate-45" />
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Enhanced Hero Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8 text-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-fresh/20 to-transparent rounded-full blur-xl" />

            {/* Side Lab Graphics */}
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 hidden lg:block opacity-20 pointer-events-none">
              <div className="relative">
                <Layers className="w-20 h-20 text-primary animate-pulse" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-fresh/30 rounded-full animate-ping" />
              </div>
            </div>
            <div className="absolute -right-8 top-1/2 -translate-y-1/2 hidden lg:block opacity-20 pointer-events-none">
              <div className="relative">
                <Beaker className="w-16 h-16 text-accent animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-primary/30 rounded-full animate-ping" />
              </div>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center justify-center p-4 bg-white/80 dark:bg-black/20 rounded-2xl mb-4 shadow-lg backdrop-blur-sm">
                <ClipboardCheck className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Quality Grading
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                AI-powered quality assessment with real-time pricing optimization
              </p>
              <div className="flex items-center justify-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-fresh animate-pulse" />
                  <span>AI Vision Active</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Market Pricing Live</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Grading Form */}
            <Card className="glass-card shadow-xl h-fit relative overflow-hidden">
              {/* Card Decoration */}
              <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
                <Camera className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Quality Assessment</CardTitle>
                <CardDescription>
                  Evaluate visual and physical parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {untestedBatches.length === 0 ? (
                  <div className="text-center py-12 px-4 rounded-xl border-dashed border-2 border-border/50 bg-secondary/20">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground font-medium">No batches pending test.</p>
                    <Button variant="link" asChild className="mt-2 text-primary">
                      <a href="/farmer">Register new batches</a>
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      <Label className="text-base">Select Batch to Test</Label>
                      <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
                        <SelectTrigger className="h-12 rounded-xl bg-white/50 dark:bg-black/20">
                          <SelectValue placeholder="Choose a pending batch..." />
                        </SelectTrigger>
                        <SelectContent className="glass">
                          {untestedBatches.map((batch) => {
                            const product = getProductById(batch.cropType);
                            return (
                              <SelectItem key={batch.batchId} value={batch.batchId} className="py-3">
                                <span className="font-medium">{product?.name || batch.cropType}</span>
                                <span className="text-muted-foreground mx-2 text-xs font-mono">{batch.batchId}</span>
                                <span className="text-xs bg-secondary px-2 py-0.5 rounded-md">{batch.quantity}{product?.unit || 'kg'}</span>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedBatch && (
                      <div className="animate-in slide-in-from-top-4 fade-in duration-300 space-y-8">
                        {/* AI Vision Scanner */}
                        <div className="relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6 text-center group">
                          <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                            <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
                          </div>

                          {!aiResult ? (
                            <div className="space-y-4">
                              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                {isAnalysing ? (
                                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                ) : (
                                  <Camera className="h-8 w-8 text-primary" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{isAnalysing ? "Analyzing Produce..." : "AgroVision AI Scan"}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {isAnalysing ? "Detecting size, color, and surface defects." : "Upload photo for instant quality grading."}
                                </p>
                              </div>
                              <Button
                                onClick={simulateAiAnalysis}
                                disabled={isAnalysing}
                                className="rounded-full px-8 shadow-lg shadow-primary/20"
                              >
                                {isAnalysing ? "Processing..." : (
                                  <><Scan className="mr-2 h-4 w-4" /> Start AI Scan</>
                                )}
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4 animate-in zoom-in-95 duration-300">
                              <div className="mx-auto w-16 h-16 rounded-full bg-fresh/10 flex items-center justify-center mb-2 border-2 border-fresh">
                                <CheckCircle2 className="h-8 w-8 text-fresh" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">AI Analysis Complete</h3>
                                <div className="flex justify-center gap-2 text-sm mt-1">
                                  <Badge variant="outline" className="bg-white/50">{aiResult.confidence}% Confidence</Badge>
                                  <Badge variant="default" className={cn(gradeColors[aiResult.grade])}>Grade {aiResult.grade}</Badge>
                                </div>
                                <div className="grid grid-cols-1 gap-6">
                                  {/* Results Card */}
                                  <Card className="glass-card shadow-2xl border-primary/20 overflow-hidden relative">
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-fresh to-primary animate-gradient" />
                                    <CardHeader className="text-center pb-2">
                                      <div className="mx-auto h-24 w-24 bg-gradient-to-br from-secondary to-background rounded-full flex items-center justify-center mb-4 shadow-inner ring-4 ring-background">
                                        <ProductIcon productId={aiResult.cropType} size={48} className="text-primary" />
                                      </div>
                                      <CardTitle className="text-3xl font-bold">{getProductById(aiResult.cropType)?.name || 'Product'}</CardTitle>
                                      <CardDescription className="text-lg">Batch: {aiResult.batchId || 'N/A'}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-8">
                                      {/* Grade & Score */}
                                      <div className="flex justify-center gap-6">
                                        <div className="text-center p-4 bg-secondary/30 rounded-2xl min-w-[120px]">
                                          <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Quality Grade</div>
                                          <div className={`text-4xl font-black ${aiResult.grade === 'A' ? 'text-fresh' :
                                            aiResult.grade === 'B' ? 'text-warning' : 'text-destructive'
                                            }`}>
                                            {aiResult.grade}
                                          </div>
                                        </div>
                                        <div className="text-center p-4 bg-secondary/30 rounded-2xl min-w-[120px]">
                                          <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">AI Confidence</div>
                                          <div className="text-4xl font-black text-primary">
                                            {aiResult.confidence}%
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex flex-col gap-3 mt-8">
                                        <Button
                                          className="w-full h-14 text-base font-bold shadow-xl shadow-primary/25 bg-gradient-to-r from-primary to-green-600 hover:scale-[1.02] transition-transform rounded-xl"
                                          onClick={async () => {
                                            if (!selectedBatch) return;

                                            // Determine grade based on AI result
                                            const grade = aiResult.grade;
                                            const product = getProductById(selectedBatch.cropType);

                                            // Calculate expiry and freshness
                                            const storageType = selectedBatch.storage?.storageType || 'Normal';
                                            const harvestDate = new Date(selectedBatch.harvestDate);
                                            const productId = selectedBatch.cropType;
                                            const expiryDate = calculateExpiryDate(harvestDate, grade, storageType, productId);
                                            const remainingDays = calculateRemainingDays(expiryDate);
                                            const status = determineFreshnessStatus(remainingDays);

                                            // Update batch in localStorage
                                            // Firestore Update Logic
                                            const updateBatchBaseUpdates: Partial<BatchWithDetails> = {
                                              qualityGrade: grade,
                                              status: 'Stored' as const,
                                              qualityTest: {
                                                testId: `TEST-${selectedBatch.batchId}`,
                                                batchId: selectedBatch.batchId,
                                                visualQuality: grade === 'A' ? 5 : grade === 'B' ? 3 : 2,
                                                freshnessDays: remainingDays,
                                                firmness: grade === 'A' ? 'High' : grade === 'B' ? 'Medium' : 'Low',
                                                finalGrade: grade,
                                                testDate: new Date(),
                                                performedBy: 'AI System',
                                                notes: `AI Confidence: ${aiResult.confidence}%`
                                              },
                                              storage: {
                                                ...selectedBatch.storage!,
                                                expiryDate,
                                                expectedShelfLife: expiryDate.getTime() - harvestDate.getTime(),
                                              },
                                              retailStatus: {
                                                batchId: selectedBatch.batchId,
                                                sellByDate: expiryDate,
                                                remainingDays,
                                                status,
                                                saleAllowed: isSaleAllowed(status),
                                              },
                                            };

                                            // Try to attach market-based pricing
                                            let pricing: BatchPricing | undefined;
                                            try {
                                              const warehouseId = selectedBatch.warehouseId as WarehouseId | undefined;
                                              const info = await getModalPriceForWarehouse(productId, warehouseId);
                                              if (info) {
                                                const threeTier = computeThreeTierPricing(info.modalPrice, grade);
                                                pricing = {
                                                  market: info.market,
                                                  commodity: info.commodity,
                                                  modalPrice: info.modalPrice,
                                                  farmerPayoutPerUnit: threeTier.farmerPayoutPerUnit,
                                                  warehousePricePerUnit: threeTier.warehousePricePerUnit,
                                                  retailerSellingPricePerUnit: threeTier.retailerSellingPricePerUnit,
                                                  csvDate: String(info.dateSerial),
                                                  computedAt: new Date().toISOString(),
                                                  source: 'csv',
                                                };
                                              }
                                            } catch {
                                              // Silently fall back to default pricing
                                            }

                                            const updates = {
                                              ...updateBatchBaseUpdates,
                                              ...(pricing ? { pricing } : {}),
                                            };

                                            try {
                                              await updateBatchStatusInFirestore(selectedBatch.batchId, updates);

                                              const updateBatch: BatchWithDetails = {
                                                ...selectedBatch,
                                                ...updates,
                                                storage: { ...selectedBatch.storage, ...updates.storage } as any,
                                                qualityTest: { ...selectedBatch.qualityTest, ...updates.qualityTest } as any,
                                                retailStatus: { ...selectedBatch.retailStatus, ...updates.retailStatus } as any,
                                              };

                                              const pricePerUnit = pricing?.retailerSellingPricePerUnit ?? getProductPrice(selectedBatch.cropType, grade);
                                              setGradedBatch({ batch: updateBatch, grade });
                                              setAiResult(null);

                                              toast({
                                                title: 'Quality Test Complete',
                                                description: `Batch graded as ${grade}. Farmer: Rs.${pricing?.farmerPayoutPerUnit ?? Math.round(pricePerUnit * 0.95)}/${product?.unit || 'kg'}, Retailer: Rs.${pricePerUnit}/${product?.unit || 'kg'}`,
                                              });
                                            } catch (error) {
                                              toast({
                                                title: "Error Grading Batch",
                                                description: "Failed to update batch status.",
                                                variant: "destructive"
                                              });
                                            } finally {
                                              setIsSubmitting(false);
                                            }
                                          }}
                                        >
                                          <CheckCircle2 className="mr-2 h-6 w-6" /> Apply Grade & Continue
                                        </Button>

                                        <Button
                                          onClick={() => setAiResult(null)}
                                          variant="outline"
                                          className="w-full h-12 text-sm font-medium border-2 hover:bg-secondary/80 hover:border-primary/50 transition-all rounded-xl text-muted-foreground"
                                        >
                                          <RefreshCw className="mr-2 h-4 w-4" /> Scan Again
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Details Panel */}
                                  <div className="space-y-6">
                                    <Card className="glass-card">
                                      <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                          <Microscope className="h-5 w-5 text-primary" /> Analysis Details
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-6">
                                        <div className="space-y-4">
                                          <div>
                                            <div className="flex justify-between text-sm mb-2">
                                              <span>Visual Consistency</span>
                                              <span className="font-bold">94%</span>
                                            </div>
                                            <Progress value={94} className="h-2" />
                                          </div>
                                          <div>
                                            <div className="flex justify-between text-sm mb-2">
                                              <span>Size Uniformity</span>
                                              <span className="font-bold">88%</span>
                                            </div>
                                            <Progress value={88} className="h-2" />
                                          </div>
                                          <div>
                                            <div className="flex justify-between text-sm mb-2">
                                              <span>Color Vibrancy</span>
                                              <span className="font-bold">92%</span>
                                            </div>
                                            <Progress value={92} className="h-2" />
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-white/40 rounded-lg p-3 text-sm text-left border">
                                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Detailed Findings:</p>
                                <ul className="list-disc pl-4 space-y-1">
                                  {aiResult.defects.map((defect, i) => <li key={i}>{defect}</li>)}
                                </ul>
                              </div>
                              <Button
                                variant="outline"
                                onClick={() => setAiResult(null)}
                                size="sm"
                                className="text-xs"
                              >
                                Rescan Batch
                              </Button>
                            </div>
                          )}
                        </div>

                        {(() => {
                          const product = getProductById(selectedBatch.cropType);
                          return (
                            <div className="grid grid-cols-2 gap-3 p-4 bg-secondary/30 rounded-2xl border border-border/50">
                              <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Product</p>
                                <p className="font-semibold">{product?.name}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Storage</p>
                                <p className="font-semibold">{selectedBatch.storage?.storageType}</p>
                              </div>
                            </div>
                          );
                        })()}

                        <div className="space-y-6">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <Label className="text-base">Visual Appearance (1-5)</Label>
                              <span className="text-2xl font-bold text-primary">{visualQuality[0]}</span>
                            </div>

                            <div className="bg-secondary/30 p-2 rounded-xl">
                              <Slider
                                value={visualQuality}
                                onValueChange={setVisualQuality}
                                min={1}
                                max={5}
                                step={1}
                                className="py-4 cursor-pointer"
                              />
                            </div>

                            <div className="flex justify-between px-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => setVisualQuality([star])}
                                  className={`flex flex-col items-center gap-1 transition-all hover:scale-110 ${star === visualQuality[0] ? 'scale-110' : 'opacity-50'}`}
                                >
                                  <Star
                                    className={`h-8 w-8 transition-colors ${star <= visualQuality[0] ? 'text-warning fill-warning' : 'text-muted-foreground'}`}
                                  />
                                  <span className="text-[10px] font-medium uppercase text-muted-foreground">
                                    {star === 1 ? 'Poor' : star === 5 ? 'Perfect' : ''}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label className="text-base">Firmness Level</Label>
                            <div className="grid grid-cols-3 gap-3">
                              {(['Low', 'Medium', 'High'] as Firmness[]).map((level) => (
                                <button
                                  key={level}
                                  onClick={() => setFirmness(level)}
                                  className={cn(
                                    "py-3 px-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1",
                                    firmness === level
                                      ? "border-primary bg-primary/5 text-primary shadow-sm"
                                      : "border-transparent bg-secondary/50 text-muted-foreground hover:bg-secondary"
                                  )}
                                >
                                  <Thermometer className={cn("h-5 w-5", firmness === level ? "text-primary" : "text-muted-foreground")} />
                                  <span className="font-semibold">{level}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Predicted Grade Preview */}
                        <div className="p-5 bg-gradient-to-r from-secondary to-secondary/30 rounded-2xl border border-white/20 shadow-inner">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-1">Predicted Result</p>
                              <p className="text-xs text-muted-foreground max-w-[150px]">Based on current parameters</p>
                            </div>
                            <div className="text-right">
                              <Badge className={`text-2xl py-2 px-6 rounded-xl overflow-hidden shadow-lg transition-colors duration-500 ${gradeColors[calculatedGrade]}`}>
                                {calculatedGrade}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={handleGrade}
                          disabled={isSubmitting}
                          className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-primary/90 hover:scale-[1.02] transition-transform"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Saving Grade...
                            </>
                          ) : (
                            "Confirm Quality Grade"
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Recent Tests Sidebar */}
            <div className="space-y-4 relative">
              {/* Side Decoration */}
              <div className="absolute -right-8 top-20 hidden xl:block opacity-10 pointer-events-none">
                <div className="relative">
                  <Star className="w-16 h-16 text-accent animate-spin" style={{ animationDuration: '15s' }} />
                  <div className="absolute top-4 left-4 w-8 h-8 bg-primary/20 rounded-full animate-pulse" />
                </div>
              </div>

              <h3 className="text-lg font-semibold px-2">Recently Graded</h3>
              <div className="space-y-4">
                {testedBatches.slice(0, 5).map((batch) => {
                  const product = getProductById(batch.cropType);
                  const pricePerUnit = batch.qualityGrade ? getProductPrice(batch.cropType, batch.qualityGrade) : 0;
                  return (
                    <div
                      key={batch.batchId}
                      className="group glass-card p-4 rounded-2xl border border-white/10 hover:border-primary/20 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold shadow-sm ${gradeColors[batch.qualityGrade!]}`}>
                          {batch.qualityGrade}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{product?.name || batch.cropType}</p>
                          <p className="text-xs text-muted-foreground font-mono">{batch.batchId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">Rs.{pricePerUnit}</p>
                        <p className="text-xs text-muted-foreground">per {product?.unit}</p>
                      </div>
                    </div>
                  );
                })}
                {testedBatches.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border/50 rounded-2xl">
                    No batches have been graded yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
