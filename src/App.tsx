import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingOverlay } from "@/components/LoadingSpinner";
import { AuthProvider } from "@/components/AuthProvider";

// Lazy load pages for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const FarmerIntake = lazy(() => import("./pages/FarmerIntake"));
const QualityGrading = lazy(() => import("./pages/QualityGrading"));
const WarehouseDashboard = lazy(() => import("./pages/WarehouseDashboard"));
const RetailerDashboard = lazy(() => import("./pages/RetailerDashboard"));
const CustomerTraceability = lazy(() => import("./pages/CustomerTraceability"));
const ConsumerScan = lazy(() => import("./pages/ConsumerScan"));
const Reports = lazy(() => import("./pages/Reports"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Landing = lazy(() => import("./pages/Landing"));
const Auth = lazy(() => import("./pages/Auth"));
const Login = lazy(() => import("./pages/Login"));
const AgroviaLanding = lazy(() => import("./pages/AgroviaLanding"));
const FeaturesGlass = lazy(() => import("./pages/FeaturesGlass"));
const HeroDemo = lazy(() => import("./pages/HeroDemo"));
const ComponentDemo = lazy(() => import("./pages/ComponentDemo"));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <AuthProvider>
            <Suspense fallback={<LoadingOverlay text="Loading..." />}>
              <Routes>
                {/* Public / Auth */}
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />

                {/* Marketing Pages - Public */}
                <Route path="/landing" element={<Landing />} />
                <Route path="/agrovia" element={<AgroviaLanding />} />
                <Route path="/features-glass" element={<FeaturesGlass />} />
                <Route path="/hero-demo" element={<HeroDemo />} />

                {/* Protected Routes - Role Based Access logic is handled in Layout/AuthContext */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/farmer" element={<FarmerIntake />} />
                <Route path="/grading" element={<QualityGrading />} />
                <Route path="/warehouse" element={<WarehouseDashboard />} />
                <Route path="/retailer" element={<RetailerDashboard />} />
                <Route path="/customer" element={<CustomerTraceability defaultTab="customer" />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/scan/:batchId" element={<ConsumerScan />} />
                <Route path="/traceability" element={<CustomerTraceability defaultTab="traceability" />} />
                <Route path="/demo" element={<ComponentDemo />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
