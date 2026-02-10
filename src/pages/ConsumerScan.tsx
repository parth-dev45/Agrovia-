import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBatch } from '@/lib/services/batchService';
import { calculateDaysSinceHarvest } from '@/lib/freshness';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, XCircle, Leaf, ArrowLeft, Calendar, Clock, MapPin, Truck, ChevronRight, ShieldCheck, Warehouse } from 'lucide-react';
import { getWarehouseById } from '@/lib/types';
import { cn } from '@/lib/utils';
import { getProductById } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { ProductIcon } from '@/components/ProductIcon';

// Helper for safe date formatting
const safeDateFormat = (dateInput: any, formatStr?: Intl.DateTimeFormatOptions) => {
  try {
    if (!dateInput) return 'N/A';
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString(undefined, formatStr || { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return 'Error';
  }
};

export default function ConsumerScan() {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();
  const { batch, loading } = useBatch(batchId);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 animate-in fade-in duration-500">
        <Card className="w-full max-w-md glass-card shadow-xl border-destructive/20">
          <CardContent className="pt-8 text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center animate-pulse">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold">Product Not Found</h1>
            <p className="text-muted-foreground">
              We couldn't find information for this product. The QR code may be invalid or expired.
            </p>
            <Link to="/">
              <Button variant="outline" className="mt-4 w-full rounded-xl">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Homepage
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Resolve product from cropType (which stores productId)
  const product = getProductById(batch.cropType);
  const productName = product?.name || batch.cropType;
  const productUnit = product?.unit || 'kg';

  // Ensure dates are valid before usage
  const harvestDate = batch.harvestDate ? new Date(batch.harvestDate) : new Date();
  const daysSinceHarvest = calculateDaysSinceHarvest(harvestDate);
  const remainingDays = batch.retailStatus?.remainingDays || 0;
  const status = batch.retailStatus?.status || 'Unknown';

  const statusConfig = {
    Fresh: {
      icon: CheckCircle2,
      color: 'text-fresh',
      bg: 'bg-fresh',
      lightBg: 'bg-fresh/10',
      border: 'border-fresh/30',
      label: 'Guaranteed Fresh',
      message: 'Verified safe & fresh from farm to you.',
      gradient: 'from-fresh/20 to-transparent'
    },
    'Consume Soon': {
      icon: AlertTriangle,
      color: 'text-warning',
      bg: 'bg-warning',
      lightBg: 'bg-warning/10',
      border: 'border-warning/30',
      label: 'Consume Soon',
      message: 'Best quality if consumed within days.',
      gradient: 'from-warning/20 to-transparent'
    },
    Expired: {
      icon: XCircle,
      color: 'text-expired',
      bg: 'bg-expired',
      lightBg: 'bg-expired/10',
      border: 'border-expired/30',
      label: 'Expired',
      message: 'This product has passed its shelf life.',
      gradient: 'from-expired/20 to-transparent'
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Fresh;
  const StatusIcon = config.icon;

  const steps = [
    {
      icon: MapPin,
      title: 'Harvested',
      date: harvestDate,
      detail: batch.farmer?.name || 'Partner Farm',
      active: true
    },
    {
      icon: ShieldCheck,
      title: 'Quality Tested',
      date: batch.qualityTest?.testDate || harvestDate,
      detail: batch.qualityGrade ? `Grade ${batch.qualityGrade} Verified` : 'Pending',
      active: !!batch.qualityGrade
    },
    {
      icon: Truck,
      title: batch.warehouseId ? 'Stored at Warehouse' : 'In Transit/Storage',
      date: batch.storage?.entryDate || new Date(),
      detail: batch.warehouseId
        ? `${getWarehouseById(batch.warehouseId)?.name || batch.warehouseId} - ${batch.storage?.storageType === 'Cold' ? 'Cold Chain' : 'Standard Storage'}`
        : batch.storage?.storageType === 'Cold' ? 'Cold Chain Preserved' : 'Standard Storage',
      active: true
    },
    {
      icon: Leaf,
      title: 'Ready for You',
      date: new Date(),
      detail: config.label,
      active: true
    }
  ];

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Enhanced Mobile-first Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50 px-4 py-4 pb-5 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                AgroVia
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                Trust Verified
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full hover:bg-secondary/80 h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-8 animate-in slide-in-from-bottom-4 duration-700">

        {/* Enhanced Hero Product Card */}
        <div className="relative">
          <div className={cn("absolute inset-0 bg-gradient-to-b rounded-3xl blur-2xl opacity-40", config.gradient)} />
          <Card className="relative overflow-hidden border-2 shadow-2xl rounded-3xl backdrop-blur-sm">
            <div className={cn("absolute top-0 left-0 w-full h-3", config.bg)} />
            <CardContent className="pt-10 pb-8 text-center space-y-6">
              <div className="mx-auto w-28 h-28 bg-gradient-to-br from-white/90 to-white/70 dark:from-secondary dark:to-background rounded-full flex items-center justify-center shadow-2xl border-4 border-white/50 dark:border-border/50 backdrop-blur-sm">
                <ProductIcon productId={batch.cropType} size={64} className="text-primary" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  {productName}
                </h2>
                <div className="flex items-center justify-center gap-3">
                  <Badge variant="outline" className="px-4 py-2 text-sm font-bold uppercase tracking-wider bg-white/80 dark:bg-black/20 backdrop-blur-sm border-2">
                    Batch {batch.batchId}
                  </Badge>
                  {batch.qualityGrade && (
                    <Badge className={cn("px-4 py-2 text-sm font-bold", config.lightBg, config.border)}>
                      Grade {batch.qualityGrade}
                    </Badge>
                  )}
                </div>
              </div>

              <div className={cn("inline-flex items-center gap-3 px-6 py-3 rounded-2xl border-2 shadow-lg backdrop-blur-sm", config.lightBg, config.border)}>
                <StatusIcon className={cn("h-6 w-6", config.color)} />
                <span className={cn("font-bold text-lg", config.color)}>{config.label}</span>
              </div>

              <p className="text-muted-foreground text-base max-w-[300px] mx-auto leading-relaxed">
                {config.message}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Journey Timeline */}
        <Card className="glass-card shadow-2xl rounded-3xl overflow-hidden border-2 border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-6 border-b border-border/30">
            <CardTitle className="text-xl flex items-center gap-3">
              <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              Farm to Fork Journey
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">Complete traceability from harvest to your table</p>
          </CardHeader>
          <CardContent className="pt-8 relative">
            <div className="absolute left-10 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary z-0" />
            <div className="space-y-10 relative z-10">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-6">
                  <div className={cn(
                    "flex-none h-10 w-10 rounded-2xl flex items-center justify-center border-4 border-background shadow-lg backdrop-blur-sm",
                    step.active ? "bg-primary text-white shadow-primary/25" : "bg-muted text-muted-foreground"
                  )}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div className="pt-2 flex-1">
                    <p className="font-bold text-lg leading-none mb-2">{step.title}</p>
                    <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{step.detail}</p>
                    <p className="text-xs text-muted-foreground/70 font-mono bg-secondary/30 px-2 py-1 rounded-md inline-block">
                      {safeDateFormat(step.date, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Details Grid */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 border-2 shadow-lg">
            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
              <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Harvest Age</p>
                <p className="text-2xl font-bold text-primary">{daysSinceHarvest} <span className="text-base font-normal text-muted-foreground">days</span></p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-fresh/10 to-fresh/5 border-fresh/20 border-2 shadow-lg">
            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
              <div className="h-12 w-12 bg-fresh/10 rounded-2xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-fresh" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Remaining</p>
                <p className={cn("text-2xl font-bold", remainingDays <= 2 ? "text-warning" : "text-fresh")}>
                  {remainingDays} <span className="text-base font-normal text-muted-foreground">days</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Warehouse Info */}
        {batch.warehouseId && (
          <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-2 border-primary/20 shadow-xl">
            <CardContent className="p-6 flex items-center gap-6">
              <div className="h-16 w-16 bg-white/80 dark:bg-black/20 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm">
                <Warehouse className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium uppercase mb-2 tracking-wider">Warehouse Location</p>
                <p className="font-bold text-xl text-foreground">{getWarehouseById(batch.warehouseId)?.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{getWarehouseById(batch.warehouseId)?.location}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-fresh animate-pulse" />
                  <span className="text-xs text-muted-foreground">Verified Storage Facility</span>
                </div>
              </div>
              {batch.qualityGrade && (
                <div className="text-right bg-white/50 dark:bg-black/20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Quality Grade</p>
                  <p className="text-3xl font-bold text-primary">{batch.qualityGrade}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Enhanced Provenance Certificate */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-3xl border-2 border-primary/20 shadow-xl">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 bg-white/90 dark:bg-black/20 rounded-2xl flex items-center justify-center shadow-xl backdrop-blur-sm">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl text-primary mb-2">Authenticity Verified</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This product's journey is secured by blockchain technology and verified by AgroVia's trust network.
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-fresh animate-pulse" />
                  <span>Blockchain Secured</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Trust Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}