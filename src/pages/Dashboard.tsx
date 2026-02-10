import { Layout } from '@/components/Layout';
import { getAnalytics } from '@/lib/mockData';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  TrendingDown,
  BarChart3,
  ArrowRight,
  Sparkles,
  Leaf,
  Clock,
  ArrowUpRight,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { QuickActions } from '@/components/QuickActions';

export default function Dashboard() {
  const analytics = getAnalytics();

  return (
    <Layout>
      <div className="relative space-y-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 text-foreground shadow-md">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
          </div>

          {/* Floating Elements */}
          <div className="absolute top-8 right-8 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse-soft" />
          <div className="absolute bottom-8 left-8 w-24 h-24 bg-fresh/20 rounded-full blur-xl animate-bounce-subtle" />

          <div className="relative z-20 p-6 md:p-10 lg:p-12">
            <div className="max-w-5xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-primary/15 rounded-3xl backdrop-blur-sm shadow-lg border border-primary/20">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <span className="text-sm font-bold bg-primary/20 px-6 py-3 rounded-full backdrop-blur-sm border border-primary/30 shadow-lg">
                    🌱 Supply Chain Dashboard
                  </span>
                  <div className="text-muted-foreground text-sm mt-2 font-medium">
                    Real-time insights and analytics • Live tracking enabled
                  </div>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6 leading-tight">
                Welcome back to{' '}
                <span className="relative">
                  <span className="bg-gradient-to-r from-primary via-fresh to-primary bg-clip-text text-transparent animate-gradient-x">
                    AgroVia
                  </span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-fresh/20 blur-lg opacity-30 animate-pulse" />
                </span>
              </h1>

              <div className="bg-primary/10 backdrop-blur-md rounded-md p-5 mb-6 border border-primary/20 shadow-sm">
                <p className="text-foreground text-lg md:text-xl lg:text-2xl leading-relaxed">
                  Your supply chain is currently tracking{' '}
                  <span className="font-bold text-foreground bg-fresh/20 px-3 py-2 rounded-xl border border-fresh/30 shadow-lg inline-flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    {analytics.totalQuantity} kg
                  </span>{' '}
                  of produce with{' '}
                  <span className="font-bold text-foreground bg-fresh/20 px-3 py-2 rounded-xl border border-fresh/30 shadow-lg inline-flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    {analytics.freshBatches} active fresh batches
                  </span>.
                </p>

                <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-fresh animate-pulse" />
                    <span>System Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Last updated: {new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>All systems operational</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary/20 hover:bg-primary/30 text-foreground border-primary/20 hover:border-primary/30 shadow-sm rounded-md h-11 backdrop-blur-sm transition-all duration-200 hover:opacity-90 group"
                >
                  <Link to="/farmer">
                    <Package className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                    New Intake
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-transparent hover:bg-primary/10 text-foreground border-primary/30 hover:border-primary/50 rounded-md h-11 backdrop-blur-sm transition-all duration-200 group"
                >
                  <Link to="/reports">
                    <BarChart3 className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                    View Reports
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-transparent hover:bg-primary/10 text-foreground border-primary/30 hover:border-primary/50 rounded-md h-11 backdrop-blur-sm transition-all duration-200 group"
                >
                  <Link to="/warehouse">
                    <Leaf className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                    Warehouse
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="relative">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">Quick Actions</h2>
              <p className="text-muted-foreground text-lg mt-2">Access common tasks and workflows</p>
            </div>
          </div>
          <QuickActions />
        </section>

        {/* Key Metrics */}
        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-card border border-border rounded-md p-6 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-colors" />
            <div className="flex flex-row items-center justify-between pb-4 relative z-10">
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Total Batches
              </div>
              <div className="h-14 w-14 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/40 transition-all duration-300 group-hover:scale-110 shadow-lg">
                <Package className="h-7 w-7 text-primary" />
              </div>
            </div>
            <div className="pt-0 relative z-10">
              <div className="text-5xl font-black text-foreground group-hover:text-primary transition-colors mb-3">
                {analytics.totalBatches}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
                  <Clock className="h-4 w-4" />
                  {analytics.totalQuantity} kg tracked
                </div>
              </div>
            </div>
          </div>

          <div className="group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-card border border-border rounded-lg p-6 relative overflow-hidden shadow-sm border-fresh/30 bg-fresh/5">
            <div className="absolute top-0 right-0 w-20 h-20 bg-fresh/20 rounded-full blur-xl group-hover:bg-fresh/30 transition-colors" />
            <div className="flex flex-row items-center justify-between pb-4 relative z-10">
              <div className="text-sm font-bold text-fresh/80 uppercase tracking-wider">
                Fresh Batches
              </div>
              <div className="h-14 w-14 rounded-3xl bg-gradient-to-br from-fresh/20 to-fresh/30 flex items-center justify-center group-hover:from-fresh/30 group-hover:to-fresh/40 transition-all duration-300 group-hover:scale-110 shadow-lg shadow-fresh/20">
                <CheckCircle2 className="h-7 w-7 text-fresh" />
              </div>
            </div>
            <div className="pt-0 relative z-10">
              <div className="text-5xl font-black text-fresh group-hover:scale-105 transition-transform mb-3">
                {analytics.freshBatches}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-2 text-fresh/80 bg-fresh/10 px-3 py-1.5 rounded-full border border-fresh/20">
                  <ArrowUpRight className="h-4 w-4" />
                  Ready for distribution
                </div>
              </div>
            </div>
          </div>

          <div className="group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-card border border-border rounded-lg p-6 relative overflow-hidden shadow-sm border-warning/30 bg-warning/5">
            <div className="absolute top-0 right-0 w-20 h-20 bg-warning/20 rounded-full blur-xl group-hover:bg-warning/30 transition-colors" />
            <div className="flex flex-row items-center justify-between pb-4 relative z-10">
              <div className="text-sm font-bold text-warning/80 uppercase tracking-wider">
                Consume Soon
              </div>
              <div className="h-14 w-14 rounded-3xl bg-gradient-to-br from-warning/20 to-warning/30 flex items-center justify-center group-hover:from-warning/30 group-hover:to-warning/40 transition-all duration-300 group-hover:scale-110 shadow-lg shadow-warning/20">
                <AlertTriangle className="h-7 w-7 text-warning animate-pulse" />
              </div>
            </div>
            <div className="pt-0 relative z-10">
              <div className="text-5xl font-black text-warning group-hover:scale-105 transition-transform mb-3">
                {analytics.consumeSoonBatches}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-2 text-warning/80 bg-warning/10 px-3 py-1.5 rounded-full border border-warning/20">
                  <Clock className="h-4 w-4" />
                  Needs priority sale
                </div>
              </div>
            </div>
          </div>

          <div className="group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-card border border-border rounded-lg p-6 relative overflow-hidden shadow-sm border-expired/30 bg-expired/5">
            <div className="absolute top-0 right-0 w-20 h-20 bg-expired/20 rounded-full blur-xl group-hover:bg-expired/30 transition-colors" />
            <div className="flex flex-row items-center justify-between pb-4 relative z-10">
              <div className="text-sm font-bold text-expired/80 uppercase tracking-wider">
                Sales Blocked
              </div>
              <div className="h-14 w-14 rounded-3xl bg-gradient-to-br from-expired/20 to-expired/30 flex items-center justify-center group-hover:from-expired/30 group-hover:to-expired/40 transition-all duration-300 group-hover:scale-110 shadow-lg shadow-expired/20">
                <Shield className="h-7 w-7 text-expired" />
              </div>
            </div>
            <div className="pt-0 relative z-10">
              <div className="text-5xl font-black text-expired group-hover:scale-105 transition-transform mb-3">
                {analytics.preventedSalesCount}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-2 text-expired/80 bg-expired/10 px-3 py-1.5 rounded-full border border-expired/20">
                  <ShieldCheck className="h-4 w-4" />
                  Expired items prevented
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Metrics */}
        <section className="relative">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded-md bg-card border border-border p-6 transition-all hover:shadow-md shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-primary/10 rounded-2xl shadow-sm group-hover:bg-primary/20 transition-colors">
                  <TrendingDown className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl text-foreground">Waste Prevention</h3>
              </div>
              <div className="text-5xl font-bold text-foreground tracking-tight mb-4">
                {analytics.potentialWastePrevented} kg
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Estimated food waste reduced through our early warning grading system
              </p>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-colors" />
              <div className="absolute top-6 right-6 opacity-10">
                <Leaf className="w-12 h-12 text-primary rotate-12" />
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-lg bg-card border border-border p-6 transition-all hover:shadow-md shadow-sm border-fresh/20 bg-fresh/5">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-fresh/10 rounded-2xl shadow-sm group-hover:bg-fresh/20 transition-colors">
                  <TrendingDown className="h-8 w-8 text-fresh" />
                </div>
                <h3 className="font-bold text-xl text-foreground">Shelf Life</h3>
              </div>
              <div className="text-5xl font-bold text-foreground tracking-tight mb-4">+40%</div>
              <p className="text-muted-foreground leading-relaxed">
                Average improvement in shelf life utilization with cold storage tracking
              </p>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-fresh/10 blur-3xl rounded-full group-hover:bg-fresh/20 transition-colors" />
              <div className="absolute top-6 right-6 opacity-10">
                <Package className="w-12 h-12 text-fresh -rotate-12" />
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-lg bg-card border border-border p-6 transition-all hover:shadow-md shadow-sm border-accent/20 bg-accent/5">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-accent/10 rounded-2xl shadow-sm group-hover:bg-accent/20 transition-colors">
                  <Shield className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-bold text-xl text-foreground">Consumer Trust</h3>
              </div>
              <div className="text-5xl font-bold text-foreground tracking-tight mb-4">100%</div>
              <p className="text-muted-foreground leading-relaxed">
                Full transparency on every batch via end-to-end QR code tracking
              </p>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/10 blur-3xl rounded-full group-hover:bg-accent/20 transition-colors" />
              <div className="absolute top-6 right-6 opacity-10">
                <ShieldCheck className="w-12 h-12 text-accent rotate-45" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}