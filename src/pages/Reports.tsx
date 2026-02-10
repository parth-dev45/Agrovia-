import { useState, useMemo } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAllBatches, getAllFarmers, getAnalytics } from '@/lib/mockData';
import { getAllBills, getAllOrders } from '@/lib/orderData';
import { getProductById, getProductPrice, QualityGrade } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar as CalendarIcon,
  TrendingDown,
  Users,
  DollarSign,
  Package,
  Leaf,
  Award,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUpRight,
  TrendingUp,
  LineChart as LineChartIcon,
  Receipt,
  Coins,
  Sparkles,
  Target
} from 'lucide-react';
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type DateRange = {
  from: Date;
  to: Date;
};

// Helper for safe date formatting
const safeDateFormat = (dateInput: any, formatStr: string) => {
  try {
    if (!dateInput) return 'N/A';
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return format(date, formatStr);
  } catch (e) {
    return 'Error';
  }
};

export default function Reports() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [quickRange, setQuickRange] = useState('30');

  const batches = getAllBatches();
  const farmers = getAllFarmers();
  const bills = getAllBills();
  const orders = getAllOrders();

  // Filter batches by date range
  const filteredBatches = useMemo(() => {
    return batches.filter(batch =>
      isWithinInterval(new Date(batch.harvestDate), {
        start: startOfDay(dateRange.from),
        end: endOfDay(dateRange.to)
      })
    );
  }, [batches, dateRange]);

  // Filter bills by date range
  const filteredBills = useMemo(() => {
    return bills.filter(bill =>
      isWithinInterval(new Date(bill.createdAt), {
        start: startOfDay(dateRange.from),
        end: endOfDay(dateRange.to)
      })
    );
  }, [bills, dateRange]);

  // Quick range handler
  const handleQuickRange = (days: string) => {
    setQuickRange(days);
    const daysNum = parseInt(days);
    setDateRange({
      from: subDays(new Date(), daysNum),
      to: new Date()
    });
  };

  // Waste Reduction Metrics
  const wasteMetrics = useMemo(() => {
    const expired = filteredBatches.filter(b => b.retailStatus?.status === 'Expired');
    const consumeSoon = filteredBatches.filter(b => b.retailStatus?.status === 'Consume Soon');
    const fresh = filteredBatches.filter(b => b.retailStatus?.status === 'Fresh');

    const expiredQty = expired.reduce((sum, b) => sum + b.quantity, 0);
    const totalQty = filteredBatches.reduce((sum, b) => sum + b.quantity, 0);
    const wasteRate = totalQty > 0 ? ((expiredQty / totalQty) * 100).toFixed(1) : '0';

    const wastePrevented = consumeSoon.reduce((sum, b) => sum + Math.round(b.quantity * 0.3), 0);

    return {
      totalBatches: filteredBatches.length,
      expiredBatches: expired.length,
      expiredQuantity: expiredQty,
      wasteRate,
      wastePrevented,
      freshBatches: fresh.length,
      consumeSoonBatches: consumeSoon.length
    };
  }, [filteredBatches]);

  // Farmer Performance
  const farmerPerformance = useMemo(() => {
    return farmers.map(farmer => {
      const farmerBatches = filteredBatches.filter(b => b.farmerId === farmer.farmerId);
      const gradeA = farmerBatches.filter(b => b.qualityGrade === 'A').length;
      const gradeB = farmerBatches.filter(b => b.qualityGrade === 'B').length;
      const gradeC = farmerBatches.filter(b => b.qualityGrade === 'C').length;
      const totalQty = farmerBatches.reduce((sum, b) => sum + b.quantity, 0);

      const revenue = farmerBatches.reduce((sum, b) => {
        if (!b.qualityGrade) return sum;
        const price = getProductPrice(b.cropType, b.qualityGrade as QualityGrade);
        return sum + (b.quantity * price);
      }, 0);

      const qualityScore = farmerBatches.length > 0
        ? Math.round(((gradeA * 100) + (gradeB * 70) + (gradeC * 40)) / farmerBatches.length)
        : 0;

      return {
        ...farmer,
        totalBatches: farmerBatches.length,
        gradeA,
        gradeB,
        gradeC,
        totalQuantity: totalQty,
        revenue,
        qualityScore
      };
    }).sort((a, b) => b.qualityScore - a.qualityScore);
  }, [farmers, filteredBatches]);

  // Revenue by Product
  const revenueByProduct = useMemo(() => {
    const productRevenue: Record<string, { revenue: number; quantity: number; gradeA: number; gradeB: number; gradeC: number }> = {};

    filteredBatches.forEach(batch => {
      if (!batch.qualityGrade) return;
      const product = getProductById(batch.cropType);
      if (!product) return;

      const price = getProductPrice(batch.cropType, batch.qualityGrade as QualityGrade);
      const revenue = batch.quantity * price;

      if (!productRevenue[product.name]) {
        productRevenue[product.name] = { revenue: 0, quantity: 0, gradeA: 0, gradeB: 0, gradeC: 0 };
      }

      productRevenue[product.name].revenue += revenue;
      productRevenue[product.name].quantity += batch.quantity;
      productRevenue[product.name][`grade${batch.qualityGrade}` as 'gradeA' | 'gradeB' | 'gradeC']++;
    });

    return Object.entries(productRevenue)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredBatches]);

  // Revenue by Grade
  const revenueByGrade = useMemo(() => {
    const gradeData: Record<QualityGrade, number> = { A: 0, B: 0, C: 0 };

    filteredBatches.forEach(batch => {
      if (!batch.qualityGrade) return;
      const price = getProductPrice(batch.cropType, batch.qualityGrade as QualityGrade);
      gradeData[batch.qualityGrade as QualityGrade] += batch.quantity * price;
    });

    return [
      { name: 'Grade A', value: gradeData.A, color: 'hsl(142, 70%, 45%)', fill: '#22c55e' },
      { name: 'Grade B', value: gradeData.B, color: 'hsl(35, 90%, 55%)', fill: '#f59e0b' },
      { name: 'Grade C', value: gradeData.C, color: 'hsl(0, 0%, 52%)', fill: '#64748b' },
    ];
  }, [filteredBatches]);

  // Daily trend data
  const dailyTrend = useMemo(() => {
    const days = Math.min(parseInt(quickRange), 14);
    const trend = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const formattedDate = safeDateFormat(date, 'yyyy-MM-dd');

      const dayBatches = batches.filter(b =>
        safeDateFormat(b.harvestDate, 'yyyy-MM-dd') === formattedDate
      );
      const dayBills = bills.filter(b =>
        safeDateFormat(b.createdAt, 'yyyy-MM-dd') === formattedDate
      );

      trend.push({
        date: safeDateFormat(date, 'MMM d'),
        batches: dayBatches.length,
        quantity: dayBatches.reduce((sum, b) => sum + b.quantity, 0),
        revenue: dayBills.reduce((sum, b) => sum + b.totalAmount, 0)
      });
    }

    return trend;
  }, [batches, bills, quickRange]);

  // Total revenue
  const totalRevenue = useMemo(() => {
    return filteredBills.reduce((sum, bill) => sum + bill.totalAmount, 0);
  }, [filteredBills]);

  // Status distribution
  const statusData = [
    { name: 'Fresh', value: wasteMetrics.freshBatches, color: 'hsl(142, 70%, 45%)', fill: '#22c55e' },
    { name: 'Consume Soon', value: wasteMetrics.consumeSoonBatches, color: 'hsl(35, 90%, 55%)', fill: '#f59e0b' },
    { name: 'Expired', value: wasteMetrics.expiredBatches, color: 'hsl(0, 72%, 50%)', fill: '#ef4444' },
  ];

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-700">
        {/* Enhanced Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8">
          {/* Background decorations */}
          <div className="absolute top-4 right-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-fresh/20 rounded-full blur-2xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 bg-white/80 dark:bg-black/20 rounded-3xl flex items-center justify-center shadow-xl backdrop-blur-sm border border-primary/20">
                <div className="relative">
                  <TrendingUp className="h-10 w-10 text-primary" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-fresh rounded-full animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>
                <p className="text-lg text-muted-foreground mt-2">Comprehensive Performance & Business Insights</p>
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-fresh/10 px-3 py-1.5 rounded-full border border-fresh/20">
                    <div className="w-2 h-2 rounded-full bg-fresh animate-pulse" />
                    <span className="font-medium">Live Data</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span className="font-medium">Real-time Updates</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full border border-border/50">
                    <Target className="h-3 w-3 text-primary" />
                    <span className="font-medium">AI Insights</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/60 dark:bg-black/20 backdrop-blur-sm p-3 rounded-2xl border border-border/50 shadow-lg">
              <Select value={quickRange} onValueChange={handleQuickRange}>
                <SelectTrigger className="w-[160px] border-0 bg-transparent shadow-none focus:ring-0 font-medium">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="14">Last 14 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <div className="h-8 w-px bg-border mx-1" />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground font-medium">
                    <CalendarIcon className="h-4 w-4" />
                    {safeDateFormat(dateRange.from, 'MMM d')} - {safeDateFormat(dateRange.to, 'MMM d')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        setDateRange({ from: range.from, to: range.to });
                        setQuickRange('custom');
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <Tabs defaultValue="waste" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-secondary/50 p-1 rounded-xl h-14">
            <TabsTrigger value="waste" className="rounded-lg gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm h-12">
              <Leaf className="h-4 w-4" /> Waste Metrics
            </TabsTrigger>
            <TabsTrigger value="farmers" className="rounded-lg gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm h-12">
              <Users className="h-4 w-4" /> Farmer Quality
            </TabsTrigger>
            <TabsTrigger value="revenue" className="rounded-lg gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm h-12">
              <DollarSign className="h-4 w-4" /> Revenue Flow
            </TabsTrigger>
          </TabsList>

          <TabsContent value="waste" className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{wasteMetrics.totalBatches}</span>
                    <span className="text-sm text-muted-foreground">batches</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card bg-expired/5 border-expired/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-expired uppercase tracking-wider">Waste Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-expired">{wasteMetrics.wasteRate}%</span>
                    <TrendingDown className="h-4 w-4 text-expired" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{wasteMetrics.expiredQuantity}kg Lost</p>
                </CardContent>
              </Card>
              <Card className="glass-card bg-fresh/5 border-fresh/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-fresh uppercase tracking-wider">Saved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-fresh">{wasteMetrics.wastePrevented}kg</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Via Early Warnings</p>
                </CardContent>
              </Card>
              <Card className="glass-card bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-primary uppercase tracking-wider">Active</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">{wasteMetrics.freshBatches}</span>
                    <span className="text-sm text-muted-foreground">fresh</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-8 md:grid-cols-2 min-h-[400px]">
              <Card className="glass-card p-6">
                <h3 className="font-semibold mb-6 flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4 text-primary" /> Stock Freshness
                </h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        <linearGradient id="freshGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#16a34a" stopOpacity={1} />
                        </linearGradient>
                        <linearGradient id="warningGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#d97706" stopOpacity={1} />
                        </linearGradient>
                        <linearGradient id="expiredGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#dc2626" stopOpacity={1} />
                        </linearGradient>
                      </defs>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={85}
                        outerRadius={120}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="rgba(255,255,255,0.8)"
                        strokeWidth={2}
                      >
                        {statusData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              index === 0 ? "url(#freshGradient)" :
                                index === 1 ? "url(#warningGradient)" :
                                  "url(#expiredGradient)"
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: '16px',
                          border: 'none',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                          backgroundColor: 'hsl(var(--card))',
                          color: 'hsl(var(--card-foreground))'
                        }}
                      />
                      <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card className="glass-card p-6">
                <h3 className="font-semibold mb-6 flex items-center gap-2">
                  <LineChartIcon className="h-4 w-4 text-primary" /> Daily Intake
                </h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorQty" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(142, 60%, 30%)" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="hsl(142, 60%, 30%)" stopOpacity={0.05} />
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                          <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="hsl(var(--border))"
                        strokeOpacity={0.3}
                      />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tickMargin={15}
                        fontSize={12}
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        fontSize={12}
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '16px',
                          border: 'none',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                          backgroundColor: 'hsl(var(--card))',
                          color: 'hsl(var(--card-foreground))'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="quantity"
                        stroke="hsl(142, 60%, 30%)"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorQty)"
                        filter="url(#glow)"
                        dot={{ fill: 'hsl(142, 60%, 30%)', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: 'hsl(142, 60%, 30%)', strokeWidth: 2, fill: '#fff' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="farmers" className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
            <div className="grid gap-6 md:grid-cols-3 min-h-[200px]">
              {farmerPerformance.slice(0, 3).map((farmer, index) => (
                <Card key={farmer.farmerId} className={cn(
                  "glass-card border-none relative overflow-hidden group hover:scale-105 transition-all duration-300",
                  index === 0 ? "bg-gradient-to-br from-yellow-500/15 via-yellow-400/10 to-transparent ring-2 ring-yellow-500/30 shadow-xl shadow-yellow-500/10" :
                    index === 1 ? "bg-gradient-to-br from-gray-400/15 via-gray-300/10 to-transparent ring-2 ring-gray-400/30 shadow-xl shadow-gray-400/10" :
                      index === 2 ? "bg-gradient-to-br from-orange-500/15 via-orange-400/10 to-transparent ring-2 ring-orange-500/30 shadow-xl shadow-orange-500/10" :
                        "bg-white/40 hover:bg-white/60"
                )}>
                  {index === 0 && (
                    <div className="absolute top-0 right-0 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-bl-2xl text-xs font-bold shadow-lg flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      TOP PERFORMER
                    </div>
                  )}
                  {index === 1 && (
                    <div className="absolute top-0 right-0 bg-gradient-to-br from-gray-400 to-gray-500 text-white px-4 py-2 rounded-bl-2xl text-xs font-bold shadow-lg">
                      2ND PLACE
                    </div>
                  )}
                  {index === 2 && (
                    <div className="absolute top-0 right-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white px-4 py-2 rounded-bl-2xl text-xs font-bold shadow-lg">
                      3RD PLACE
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-4">
                      <div className={cn(
                        "h-14 w-14 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg transition-all duration-300 group-hover:scale-110",
                        index === 0 ? "bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-yellow-500/30" :
                          index === 1 ? "bg-gradient-to-br from-gray-400 to-gray-500 text-white shadow-gray-400/30" :
                            index === 2 ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-orange-500/30" :
                              "bg-gradient-to-br from-secondary to-secondary/80"
                      )}>
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-bold">{farmer.name}</div>
                        <div className="text-sm font-normal text-muted-foreground font-mono">{farmer.farmerCode}</div>
                        <div className="text-xs text-muted-foreground mt-1">{farmer.totalBatches} batches • {farmer.totalQuantity}kg</div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm font-medium">Quality Score</span>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-black text-foreground">{farmer.qualityScore}%</span>
                        {index === 0 && <TrendingUp className="h-5 w-5 text-yellow-500" />}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="w-full bg-secondary/50 h-3 rounded-full overflow-hidden flex shadow-inner">
                        <div
                          style={{ width: `${(farmer.gradeA / farmer.totalBatches) * 100}%` }}
                          className="bg-gradient-to-r from-fresh to-green-500 transition-all duration-500"
                        />
                        <div
                          style={{ width: `${(farmer.gradeB / farmer.totalBatches) * 100}%` }}
                          className="bg-gradient-to-r from-warning to-orange-500 transition-all duration-500"
                        />
                        <div
                          style={{ width: `${(farmer.gradeC / farmer.totalBatches) * 100}%` }}
                          className="bg-gradient-to-r from-muted-foreground to-gray-500 transition-all duration-500"
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-fresh shadow-sm" />
                          Grade A ({farmer.gradeA})
                        </span>
                        <span className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-warning shadow-sm" />
                          Grade B ({farmer.gradeB})
                        </span>
                        <span className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-gray-400 shadow-sm" />
                          Grade C ({farmer.gradeC})
                        </span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-border/50">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Revenue Generated</span>
                        <span className="font-bold text-primary">Rs.{farmer.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="glass-card p-6">
              <h3 className="font-semibold mb-6">Detailed Performance Metrics</h3>
              <div className="h-[450px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={farmerPerformance} barSize={24} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="gradeAGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#16a34a" stopOpacity={1} />
                      </linearGradient>
                      <linearGradient id="gradeBGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#d97706" stopOpacity={1} />
                      </linearGradient>
                      <linearGradient id="gradeCGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#64748b" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#475569" stopOpacity={1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border))"
                      strokeOpacity={0.3}
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tickMargin={15}
                      fontSize={12}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      fontSize={12}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--muted))', fillOpacity: 0.1 }}
                      contentStyle={{
                        borderRadius: '16px',
                        border: 'none',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'hsl(var(--card))',
                        color: 'hsl(var(--card-foreground))'
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar
                      dataKey="gradeA"
                      name="Grade A"
                      stackId="a"
                      fill="url(#gradeAGradient)"
                      radius={[0, 0, 6, 6]}
                    />
                    <Bar
                      dataKey="gradeB"
                      name="Grade B"
                      stackId="a"
                      fill="url(#gradeBGradient)"
                    />
                    <Bar
                      dataKey="gradeC"
                      name="Grade C"
                      stackId="a"
                      fill="url(#gradeCGradient)"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
            {/* Enhanced Revenue Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Total Revenue Card */}
              <Card className="relative overflow-hidden border-none bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white shadow-2xl shadow-emerald-500/25">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
                <CardHeader className="pb-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold uppercase tracking-wider text-white/90">
                      Total Revenue
                    </CardTitle>
                    <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-2">
                    <div className="text-4xl font-black tracking-tight">
                      Rs.{(totalRevenue / 1000).toFixed(1)}k
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <ArrowUpRight className="h-4 w-4" />
                      <span>Period earnings</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transactions Card */}
              <Card className="glass-card border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Transactions
                    </CardTitle>
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Receipt className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-4xl font-black text-foreground">
                      {filteredBills.length}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Processed Bills
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Average Value Card */}
              <Card className="glass-card border-2 border-warning/20 hover:border-warning/40 transition-all duration-300 hover:shadow-lg hover:shadow-warning/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Avg. Value
                    </CardTitle>
                    <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                      <Coins className="h-5 w-5 text-warning" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-4xl font-black text-foreground">
                      Rs.{filteredBills.length > 0 ? Math.round(totalRevenue / filteredBills.length) : 0}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Per Bill
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="glass-card col-span-2 p-6">
                <h3 className="font-semibold mb-6">Revenue Trend</h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="hsl(142, 60%, 30%)" stopOpacity={0.8} />
                          <stop offset="50%" stopColor="hsl(35, 90%, 55%)" stopOpacity={0.6} />
                          <stop offset="100%" stopColor="hsl(142, 60%, 30%)" stopOpacity={0.8} />
                        </linearGradient>
                        <filter id="revenueGlow">
                          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                          <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="hsl(var(--border))"
                        strokeOpacity={0.3}
                      />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tickMargin={15}
                        fontSize={12}
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        fontSize={12}
                        hide
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '16px',
                          border: 'none',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                          backgroundColor: 'hsl(var(--card))',
                          color: 'hsl(var(--card-foreground))'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="url(#revenueGradient)"
                        strokeWidth={4}
                        dot={{
                          r: 5,
                          strokeWidth: 3,
                          stroke: 'hsl(142, 60%, 30%)',
                          fill: '#fff',
                          filter: 'url(#revenueGlow)'
                        }}
                        activeDot={{
                          r: 8,
                          stroke: 'hsl(142, 60%, 30%)',
                          strokeWidth: 3,
                          fill: '#fff',
                          filter: 'url(#revenueGlow)'
                        }}
                        filter="url(#revenueGlow)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card className="glass-card p-6">
                <h3 className="font-semibold mb-6 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" /> Top Products
                </h3>
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                  {revenueByProduct.slice(0, 5).map((product, i) => (
                    <div key={i} className="group relative flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-secondary/30 to-secondary/10 hover:from-primary/5 hover:to-primary/10 transition-all duration-300 border border-border/50 hover:border-primary/20">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-xl font-bold text-lg transition-all duration-300",
                          i === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-500 text-white shadow-lg shadow-yellow-500/25" :
                            i === 1 ? "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700 shadow-lg shadow-gray-400/25" :
                              i === 2 ? "bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-500/25" :
                                "bg-gradient-to-br from-primary/20 to-primary/30 text-primary"
                        )}>
                          {i + 1}
                        </div>
                        <div>
                          <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {product.name}
                          </span>
                          <div className="text-xs text-muted-foreground mt-1">
                            {product.quantity}kg sold • {product.gradeA + product.gradeB + product.gradeC} batches
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-lg text-primary">
                          Rs.{product.revenue.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1 mt-1 justify-end">
                          <div className="flex gap-1">
                            {product.gradeA > 0 && <div className="w-2 h-2 rounded-full bg-fresh" title={`${product.gradeA} Grade A`} />}
                            {product.gradeB > 0 && <div className="w-2 h-2 rounded-full bg-warning" title={`${product.gradeB} Grade B`} />}
                            {product.gradeC > 0 && <div className="w-2 h-2 rounded-full bg-muted-foreground" title={`${product.gradeC} Grade C`} />}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}