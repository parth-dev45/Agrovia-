import React from "react";
import { useNavigate } from 'react-router-dom';
import { Sprout, TrendingUp, Users, PackageCheck, Shield, Award, BarChart3, Truck } from "lucide-react";

export default function DashboardGlassHero() {
  const navigate = useNavigate();
  
  return (
    <div className="relative w-full bg-zinc-950 text-white overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2322c55e' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      {/* Compact version - reduced padding */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">AgroVia Dashboard</h1>
          <p className="text-zinc-400">Real-time supply chain monitoring and analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Active Farms Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-green-500/20 bg-white/5 p-6 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-green-500/10 blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-green-500/20 ring-1 ring-green-500/30">
                  <Sprout className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">5,247</div>
                  <div className="text-sm text-zinc-400">Active Farms</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-green-400 font-medium">↑ 12% this month</div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Shipments Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-blue-500/20 bg-white/5 p-6 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-blue-500/20 ring-1 ring-blue-500/30">
                  <PackageCheck className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">2.1M</div>
                  <div className="text-sm text-zinc-400">Shipments</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-blue-400 font-medium">↑ 8% this month</div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Waste Saved Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-white/5 p-6 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-yellow-500/10 blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-yellow-500/20 ring-1 ring-yellow-500/30">
                  <TrendingUp className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">₹52Cr</div>
                  <div className="text-sm text-zinc-400">Waste Saved</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-yellow-400 font-medium">↑ 15% this month</div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Quality Score Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-purple-500/20 bg-white/5 p-6 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-purple-500/20 ring-1 ring-purple-500/30">
                  <Award className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">92%</div>
                  <div className="text-sm text-zinc-400">Quality Score</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-purple-400 font-medium">↑ 3% this month</div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Row */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/reports')}
            className="flex items-center gap-2 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-left"
          >
            <BarChart3 className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-sm font-medium text-white">Analytics</div>
              <div className="text-xs text-zinc-500">View Reports</div>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/warehouse')}
            className="flex items-center gap-2 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-left"
          >
            <Truck className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-sm font-medium text-white">Logistics</div>
              <div className="text-xs text-zinc-500">Track Shipments</div>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/farmer')}
            className="flex items-center gap-2 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-left"
          >
            <Users className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-sm font-medium text-white">Farmers</div>
              <div className="text-xs text-zinc-500">Manage Network</div>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/grading')}
            className="flex items-center gap-2 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-left"
          >
            <Shield className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-sm font-medium text-white">Quality</div>
              <div className="text-xs text-zinc-500">Grade Produce</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}