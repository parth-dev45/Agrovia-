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
  MapPin,
  Truck,
  BarChart3
} from "lucide-react";

// --- AGROVIA PARTNERS/CERTIFICATIONS ---
const AGROVIA_PARTNERS = [
  { name: "FSSAI", icon: Shield, color: "text-blue-400" },
  { name: "Govt of India", icon: Award, color: "text-orange-400" },
  { name: "BigBasket", icon: PackageCheck, color: "text-green-400" },
  { name: "Reliance Fresh", icon: Sprout, color: "text-purple-400" },
  { name: "ISO 22000", icon: CheckCircle2, color: "text-yellow-400" },
  { name: "NABARD", icon: Users, color: "text-pink-400" },
  { name: "Digital India", icon: Leaf, color: "text-cyan-400" },
  { name: "FPO Network", icon: MapPin, color: "text-red-400" },
];

// --- SUB-COMPONENTS ---
const StatItem = ({ value, label, trend }: { value: string; label: string; trend?: string }) => (
  <div className="flex flex-col items-center justify-center transition-transform hover:-translate-y-1 cursor-default group">
    <span className="text-xl font-bold text-white sm:text-2xl group-hover:text-green-400 transition-colors">{value}</span>
    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium sm:text-xs">{label}</span>
    {trend && <span className="text-[8px] text-green-400 mt-1">{trend}</span>}
  </div>
);

const FeatureTag = ({ icon: Icon, label, color, pulse = false }: {
  icon: React.ComponentType<any>;
  label: string;
  color: string;
  pulse?: boolean;
}) => (
  <div className={`inline-flex items-center gap-1.5 rounded-full border border-${color}-500/20 bg-${color}-500/10 px-3 py-1 text-[10px] font-medium tracking-wide text-${color}-300`}>
    {pulse && (
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${color}-400 opacity-75`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 bg-${color}-500`}></span>
      </span>
    )}
    <Icon className={`w-3 h-3 text-${color}-500`} />
    {label}
  </div>
);

// --- MAIN COMPONENT ---
export default function AgroviaGlassHero() {
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
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.6); }
        }
        .animate-fade-in {
          animation: fadeSlideIn 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-marquee {
          animation: marquee 45s linear infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
      `}</style>

      {/* Background Image - Indian Agricultural Scene */}
      <div 
        className="absolute inset-0 z-0 bg-[url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=80)] bg-cover bg-center opacity-25"
        style={{
          maskImage: "linear-gradient(180deg, transparent, black 5%, black 75%, transparent)",
          WebkitMaskImage: "linear-gradient(180deg, transparent, black 5%, black 75%, transparent)",
        }}
      />

      {/* Agricultural Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-green-950/50 via-zinc-950/70 to-amber-950/50" />
      
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 md:pt-32 md:pb-20 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-start">
          
          {/* --- LEFT COLUMN --- */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 pt-8">
            
            {/* Trust Badge with Rating */}
            <div className="animate-fade-in delay-100">
              <div className="inline-flex items-center gap-3 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 backdrop-blur-md transition-colors hover:bg-green-500/20">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-green-300">
                  🌾 5,000+ Farms Trust AgroVia
                </span>
                <div className="text-[10px] text-white/60">4.9/5</div>
              </div>
            </div>

            {/* Main Headline */}
            <h1
              className="animate-fade-in delay-200 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-tighter leading-[0.9]"
              style={{
                maskImage: "linear-gradient(180deg, black 0%, black 85%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(180deg, black 0%, black 85%, transparent 100%)"
              }}
            >
              Track Every Crop<br />
              <span className="bg-gradient-to-br from-green-400 via-green-300 to-yellow-400 bg-clip-text text-transparent">
                From Seed
              </span><br />
              To Consumer
            </h1>

            {/* Enhanced Description */}
            <div className="animate-fade-in delay-300 space-y-4">
              <p className="max-w-xl text-lg text-zinc-300 leading-relaxed">
                India's most trusted farm-to-retail platform. Real-time IoT monitoring, 
                blockchain verification, and AI-powered quality grading.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>35% Less Waste</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>25% Better Prices</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>100% Traceable</span>
                </div>
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="animate-fade-in delay-400 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/farmer')}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 px-8 py-4 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/50 active:scale-[0.98] animate-pulse-glow"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button 
                onClick={() => navigate('/hero-demo')}
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10 hover:border-white/30"
              >
                <Play className="w-4 h-4 fill-current" />
                Watch Demo
              </button>
            </div>

            {/* Quick Stats Row */}
            <div className="animate-fade-in delay-500 flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">2M+</div>
                <div className="text-xs text-zinc-500">Shipments</div>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <div className="text-2xl font-bold text-white">15+</div>
                <div className="text-xs text-zinc-500">States</div>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <div className="text-2xl font-bold text-white">₹50Cr</div>
                <div className="text-xs text-zinc-500">Saved</div>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="lg:col-span-5 space-y-6 lg:mt-12">
            
            {/* Enhanced Stats Card */}
            <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-green-500/20 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
              {/* Multiple Glow Effects */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-green-500/10 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-48 w-48 rounded-full bg-yellow-500/5 blur-3xl pointer-events-none" />
              
              <div className="relative z-10">
                {/* Header with Live Indicator */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/20 ring-1 ring-green-500/30">
                      <BarChart3 className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold tracking-tight text-white">Live Stats</div>
                      <div className="text-sm text-zinc-400">Updated every 5 minutes</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-green-400">LIVE</span>
                  </div>
                </div>

                {/* Progress Bars with Enhanced Styling */}
                <div className="space-y-6 mb-8">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-300 font-medium">Waste Reduction</span>
                      <span className="text-green-400 font-bold">35%</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-800/50 ring-1 ring-white/10">
                      <div className="h-full w-[35%] rounded-full bg-gradient-to-r from-green-500 to-green-400 shadow-lg shadow-green-500/50" />
                    </div>
                    <div className="text-xs text-zinc-500">↑ 5% from last month</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-300 font-medium">Quality Score</span>
                      <span className="text-yellow-400 font-bold">92%</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-800/50 ring-1 ring-white/10">
                      <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-yellow-500 to-green-400 shadow-lg shadow-yellow-500/50" />
                    </div>
                    <div className="text-xs text-zinc-500">↑ 3% from last month</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-300 font-medium">Farmer Satisfaction</span>
                      <span className="text-blue-400 font-bold">96%</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-800/50 ring-1 ring-white/10">
                      <div className="h-full w-[96%] rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/50" />
                    </div>
                    <div className="text-xs text-zinc-500">↑ 2% from last month</div>
                  </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-3 gap-4 text-center mb-8">
                  <StatItem value="5K+" label="Farms" trend="↑ 12%" />
                  <StatItem value="15+" label="States" trend="↑ 2 new" />
                  <StatItem value="₹50Cr" label="Saved" trend="↑ 15%" />
                </div>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2">
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
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-[10px] font-medium tracking-wide text-purple-300">
                    <Truck className="w-3 h-3 text-purple-500" />
                    AI POWERED
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Partners Marquee */}
            <div className="animate-fade-in delay-600 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 py-8 backdrop-blur-xl">
              <div className="flex items-center justify-between px-8 mb-6">
                <h3 className="text-sm font-medium text-zinc-300">Trusted Partners & Certifications</h3>
                <div className="text-xs text-zinc-500">{AGROVIA_PARTNERS.length} Partners</div>
              </div>
              
              <div
                className="relative flex overflow-hidden"
                style={{
                  maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                  WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
                }}
              >
                <div className="animate-marquee flex gap-8 whitespace-nowrap px-4">
                  {/* Triple list for seamless loop */}
                  {[...AGROVIA_PARTNERS, ...AGROVIA_PARTNERS, ...AGROVIA_PARTNERS].map((partner, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 opacity-60 transition-all hover:opacity-100 hover:scale-105 cursor-default group"
                    >
                      <div className={`p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors`}>
                        <partner.icon className={`h-5 w-5 ${partner.color} group-hover:scale-110 transition-transform`} />
                      </div>
                      <span className="text-base font-semibold text-white tracking-tight group-hover:text-green-300 transition-colors">
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