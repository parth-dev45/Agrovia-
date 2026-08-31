import React from "react";
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Play,
  Sprout,
  Shield,
  Star,
  TrendingUp,
  Users,
  PackageCheck,
  Leaf,
  Award,
  CheckCircle2,
  MapPin
} from "lucide-react";

// --- AGROVIA PARTNERS/CERTIFICATIONS ---
// Replace with actual partner logos or certifications
const PARTNERS = [
  { name: "FSSAI", icon: Shield },
  { name: "Organic India", icon: Leaf },
  { name: "BigBasket", icon: PackageCheck },
  { name: "Reliance Fresh", icon: Sprout },
  { name: "ISO 22000", icon: Award },
  { name: "FPO Partners", icon: Users },
];

// --- SUB-COMPONENTS ---
const StatItem = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center justify-center transition-transform hover:-translate-y-1 cursor-default">
    <span className="text-xl font-bold text-white sm:text-2xl">{value}</span>
    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium sm:text-xs">{label}</span>
  </div>
);

// --- MAIN COMPONENT ---
export default function GlassmorphismTrustHero() {
  const navigate = useNavigate();
  
  return (
    <div className="relative w-full bg-zinc-950 text-white overflow-hidden font-sans">
      {/* SCOPED ANIMATIONS */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-fade-in {
          animation: fadeSlideIn 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>

      {/* Background Image - Agricultural Scene */}
      <div 
        className="absolute inset-0 z-0 bg-[url(https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1600&q=80)] bg-cover bg-center opacity-30"
        style={{
          maskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
          WebkitMaskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
        }}
      />

      {/* Green Gradient Overlay for Agricultural Feel */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-green-950/40 via-zinc-950/60 to-amber-950/40" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 md:pt-32 md:pb-20 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-start">
          
          {/* --- LEFT COLUMN --- */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 pt-8">
            
            {/* Badge */}
            <div className="animate-fade-in delay-100">
              <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 backdrop-blur-md transition-colors hover:bg-green-500/20">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-green-300 flex items-center gap-2">
                  🌾 Trusted by 5,000+ Farms
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                </span>
              </div>
            </div>

            {/* Heading - AgroVia Focused */}
            <h1
              className="animate-fade-in delay-200 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-tighter leading-[0.9]"
              style={{
                maskImage: "linear-gradient(180deg, black 0%, black 80%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(180deg, black 0%, black 80%, transparent 100%)"
              }}
            >
              Track Freshness<br />
              <span className="bg-gradient-to-br from-green-400 via-green-300 to-yellow-400 bg-clip-text text-transparent">
                From Farm
              </span><br />
              To Retail Shelf
            </h1>

            {/* Description - Value Proposition */}
            <p className="animate-fade-in delay-300 max-w-xl text-lg text-zinc-400 leading-relaxed">
              Real-time IoT monitoring and blockchain verification ensure your produce 
              maintains peak quality throughout the supply chain. Reduce waste, increase 
              profits, and build consumer trust.
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-in delay-400 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/farmer')}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 px-8 py-4 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/50 active:scale-[0.98]"
              >
                Start Tracking Free
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button 
                onClick={() => navigate('/demo')}
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10 hover:border-white/20"
              >
                <Play className="w-4 h-4 fill-current" />
                See How It Works
              </button>
            </div>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="lg:col-span-5 space-y-6 lg:mt-12">
            
            {/* Stats Card - Real AgroVia Metrics */}
            <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-green-500/20 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
              {/* Card Glow Effect */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-green-500/10 blur-3xl pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/20 ring-1 ring-green-500/30">
                    <Sprout className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold tracking-tight text-white">2M+</div>
                    <div className="text-sm text-zinc-400">Shipments Tracked</div>
                  </div>
                </div>

                {/* Progress Bar Section - Waste Reduction */}
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Waste Reduction</span>
                    <span className="text-green-400 font-medium">35%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800/50">
                    <div className="h-full w-[35%] rounded-full bg-gradient-to-r from-green-500 to-green-400" />
                  </div>
                </div>

                {/* Second Progress - Freshness Score */}
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Avg Freshness Score</span>
                    <span className="text-yellow-400 font-medium">92%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800/50">
                    <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-yellow-500 to-green-400" />
                  </div>
                </div>

                <div className="h-px w-full bg-white/10 mb-6" />

                {/* Mini Stats Grid - AgroVia Specific */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <StatItem value="5K+" label="Farms" />
                  <div className="w-px h-full bg-white/10 mx-auto" />
                  <StatItem value="15+" label="States" />
                  <div className="w-px h-full bg-white/10 mx-auto" />
                  <StatItem value="₹50Cr" label="Saved" />
                </div>

                {/* Tag Pills - Certifications */}
                <div className="mt-8 flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-[10px] font-medium tracking-wide text-green-300">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    LIVE TRACKING
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-[10px] font-medium tracking-wide text-yellow-300">
                    <Shield className="w-3 h-3 text-yellow-500" />
                    BLOCKCHAIN
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-medium tracking-wide text-blue-300">
                    <Award className="w-3 h-3 text-blue-500" />
                    CERTIFIED
                  </div>
                </div>
              </div>
            </div>

            {/* Marquee Card - Partners */}
            <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 py-8 backdrop-blur-xl">
              <h3 className="mb-6 px-8 text-sm font-medium text-zinc-400">Trusted Partners & Certifications</h3>
              
              <div
                className="relative flex overflow-hidden"
                style={{
                  maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
                  WebkitMaskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)"
                }}
              >
                <div className="animate-marquee flex gap-12 whitespace-nowrap px-4">
                  {/* Triple list for seamless loop */}
                  {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 opacity-50 transition-all hover:opacity-100 hover:scale-105 cursor-default grayscale hover:grayscale-0"
                    >
                      <partner.icon className="h-6 w-6 text-white" />
                      <span className="text-lg font-bold text-white tracking-tight">
                        {partner.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}