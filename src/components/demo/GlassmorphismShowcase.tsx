import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout, Shield, TrendingUp, Star, CheckCircle2 } from 'lucide-react';

const GlassmorphismShowcase = () => {
  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      {/* Background for contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-950/40 via-zinc-950/60 to-amber-950/40" />
      <div 
        className="absolute inset-0 bg-[url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=80)] bg-cover bg-center opacity-20"
      />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            AgroVia Glassmorphism Showcase
          </h1>
          <p className="text-zinc-400 text-lg">
            Premium glass effects with perfect dark mode compatibility
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Premium Glass Card */}
          <div className="glass-premium glass-premium-hover rounded-2xl p-6">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-green-500/20 ring-1 ring-green-500/30">
                  <Sprout className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">5,247</div>
                  <div className="text-sm text-zinc-400">Active Farms</div>
                </div>
              </div>
              <div className="text-xs text-green-400">↑ 12% this month</div>
            </div>
          </div>

          {/* Agricultural Glass Card */}
          <div className="glass-agricultural rounded-2xl p-6 hover:bg-green-500/10 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-green-400" />
              <div>
                <div className="text-xl font-bold text-white">Certified</div>
                <div className="text-sm text-green-300">FSSAI Approved</div>
              </div>
            </div>
            <p className="text-xs text-zinc-400">Government certified for food safety</p>
          </div>

          {/* Stats Glass Card */}
          <div className="relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-white/5 p-6 backdrop-blur-xl">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-yellow-500/10 blur-2xl" />
            <div className="relative z-10">
              <TrendingUp className="h-8 w-8 text-yellow-400 mb-3" />
              <div className="text-2xl font-bold text-white mb-1">₹52Cr</div>
              <div className="text-sm text-zinc-400 mb-3">Waste Saved</div>
              <div className="h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden">
                <div className="h-full w-[75%] bg-gradient-to-r from-yellow-500 to-green-400 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Button Showcase */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Button Variants</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="default" size="lg">
              Primary Button
            </Button>
            <Button variant="glass" size="lg">
              Glass Button
            </Button>
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
              Outline Glass
            </Button>
            <button className="px-6 py-3 rounded-full border border-green-500/20 bg-green-500/5 text-green-300 hover:bg-green-500/10 transition-all backdrop-blur-sm">
              Agricultural Glass
            </button>
          </div>
        </div>

        {/* Trust Badge Showcase */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Trust Elements</h2>
          <div className="flex flex-wrap gap-4">
            
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-white font-medium text-sm">
                5,000+ Farms Trust AgroVia
              </span>
            </div>

            {/* Certification Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/10 backdrop-blur-sm">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-green-300 font-medium text-sm">
                Government Certified
              </span>
            </div>

            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-blue-300 font-medium text-sm">
                Live Tracking
              </span>
            </div>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-red-400 mb-4">❌ Before (Harsh)</h3>
            <div className="p-6 bg-white rounded-2xl">
              <div className="text-black font-bold text-lg mb-2">Harsh White Card</div>
              <div className="text-gray-600">This breaks dark mode completely</div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-green-400 mb-4">✅ After (Glassmorphism)</h3>
            <div className="relative overflow-hidden rounded-2xl border border-green-500/20 bg-white/5 p-6 backdrop-blur-xl">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-green-500/10 blur-2xl" />
              <div className="relative z-10">
                <div className="text-white font-bold text-lg mb-2">Premium Glass Card</div>
                <div className="text-zinc-300">Perfect dark mode integration</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
            <Sprout className="w-5 h-5 text-green-400" />
            <span className="text-white font-medium">
              Built with premium glassmorphism for AgroVia
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlassmorphismShowcase;