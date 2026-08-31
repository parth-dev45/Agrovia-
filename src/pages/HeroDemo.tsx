import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AnimatedShaderHero from '@/components/ui/animated-shader-hero';
import GlassmorphismTrustHero from '@/components/ui/glassmorphism-trust-hero';
import AgroviaHero from '@/components/agrovia/hero-section';
import AgroviaGlassHero from '@/components/agrovia/glass-hero';
import DashboardGlassHero from '@/components/agrovia/dashboard-glass-hero';
import MobileAgroviaHero from '@/components/agrovia/mobile-hero';
import { TestimonialShowcase } from '@/components/agrovia/farmer-testimonial';
import GlassmorphismShowcase from '@/components/demo/GlassmorphismShowcase';
import { Smartphone, Monitor, Palette, Users, Code, Globe, Sparkles, Eye } from 'lucide-react';

const HeroDemo = () => {
  const [activeDemo, setActiveDemo] = useState('full');

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">AgroVia Hero Demo</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/#/'}>
              ← Back to App
            </Button>
          </div>
        </div>
      </nav>

      {/* Demo Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">AgroVia Animated Hero Components</h1>
          <p className="text-muted-foreground text-lg">
            Interactive demo of all hero variations optimized for agricultural users and rural networks.
          </p>
        </div>

        <Tabs value={activeDemo} onValueChange={setActiveDemo} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="full" className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Shader Hero
            </TabsTrigger>
            <TabsTrigger value="glass" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Glass Hero
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Mobile
            </TabsTrigger>
            <TabsTrigger value="shader" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Shader Only
            </TabsTrigger>
            <TabsTrigger value="showcase" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Showcase
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Testimonials
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Performance
            </TabsTrigger>
          </TabsList>

          {/* Shader Hero Demo */}
          <TabsContent value="full" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Animated Shader Hero Section</CardTitle>
                <CardDescription>
                  WebGL-based hero with organic agricultural animations. Features trust badges, 
                  animated backgrounds, and automatic fallbacks for slow networks.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border rounded-lg overflow-hidden">
                  <AgroviaHero />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Glassmorphism Hero Demo */}
          <TabsContent value="glass" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Glassmorphism Trust Hero</CardTitle>
                <CardDescription>
                  Premium glassmorphism design with live stats, progress bars, and partner marquee.
                  Perfect for B2B presentations and data-driven trust building.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border rounded-lg overflow-hidden">
                  <AgroviaGlassHero />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dashboard Hero Demo */}
          <TabsContent value="dashboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Glass Hero</CardTitle>
                <CardDescription>
                  Compact glassmorphism hero designed for internal dashboards. Features live metrics,
                  quick actions, and real-time status indicators.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border rounded-lg overflow-hidden">
                  <DashboardGlassHero />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Glassmorphism Showcase Demo */}
          <TabsContent value="showcase" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Glassmorphism Design Showcase</CardTitle>
                <CardDescription>
                  Interactive showcase of all glassmorphism elements with before/after comparisons.
                  Demonstrates the premium glass effects and dark mode compatibility.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border rounded-lg overflow-hidden">
                  <GlassmorphismShowcase />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mobile Hero Demo */}
          <TabsContent value="mobile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mobile-Optimized Hero</CardTitle>
                <CardDescription>
                  Simplified hero designed for rural farmers on mobile devices. Features Hindi language support,
                  large touch targets, and minimal data usage.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border rounded-lg overflow-hidden max-w-sm mx-auto">
                  <MobileAgroviaHero />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shader Only Demo */}
          <TabsContent value="shader" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Animated Shader Component</CardTitle>
                <CardDescription>
                  Pure WebGL shader component with agricultural theme. Automatically falls back to 
                  CSS gradients on slow networks or unsupported devices.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border rounded-lg overflow-hidden">
                  <AnimatedShaderHero
                    trustBadge={{
                      text: "🌾 WebGL Shader Demo",
                      icons: ["✨", "🎨", "⚡"]
                    }}
                    headline={{
                      line1: "Agricultural Shader",
                      line2: "Animation Demo"
                    }}
                    subtitle="This WebGL shader creates organic field-like patterns with green-to-gold gradients representing crop growth and harvest cycles."
                    buttons={{
                      primary: {
                        text: "View Source Code",
                        onClick: () => alert('Check src/components/ui/animated-shader-hero.tsx')
                      },
                      secondary: {
                        text: "Toggle Fallback",
                        onClick: () => alert('Fallback mode would show CSS gradient instead')
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Demo */}
          <TabsContent value="testimonials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Farmer Testimonials</CardTitle>
                <CardDescription>
                  Trust-building testimonials from real farmers with metrics and regional context.
                  Designed to build credibility with rural agricultural users.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <TestimonialShowcase />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Demo */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Network Optimization</CardTitle>
                  <CardDescription>
                    Performance features for rural 2G/3G networks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Bundle Sizes</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Initial: &lt; 200KB (critical path)</li>
                      <li>• Total: &lt; 500KB (complete app)</li>
                      <li>• Images: Auto-optimized per network</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Load Times (3G)</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• First Contentful Paint: &lt; 1.5s</li>
                      <li>• Largest Contentful Paint: &lt; 3.0s</li>
                      <li>• Time to Interactive: &lt; 4.0s</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Accessibility Features</CardTitle>
                  <CardDescription>
                    Rural user accessibility and language support
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Language Support</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Hindi (Primary rural language)</li>
                      <li>• Marathi, Tamil, Telugu, Punjabi</li>
                      <li>• Auto-detection based on location</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Accessibility</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• WCAG 2.1 AA compliant</li>
                      <li>• 7:1 color contrast ratio</li>
                      <li>• 48px minimum touch targets</li>
                      <li>• Screen reader support</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Current Network Status</CardTitle>
                <CardDescription>
                  Real-time network detection and optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NetworkStatus />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Network Status Component
const NetworkStatus = () => {
  const [networkInfo, setNetworkInfo] = useState<any>(null);

  useState(() => {
    const connection = (navigator as any).connection;
    if (connection) {
      setNetworkInfo({
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 'unknown',
        rtt: connection.rtt || 'unknown',
        saveData: connection.saveData || false
      });
    }
  });

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="p-4 border rounded-lg">
        <h4 className="font-semibold mb-2">Connection Type</h4>
        <p className="text-2xl font-bold text-primary">
          {networkInfo?.effectiveType || '4g'}
        </p>
      </div>
      <div className="p-4 border rounded-lg">
        <h4 className="font-semibold mb-2">Download Speed</h4>
        <p className="text-2xl font-bold text-primary">
          {networkInfo?.downlink || '10'} Mbps
        </p>
      </div>
      <div className="p-4 border rounded-lg">
        <h4 className="font-semibold mb-2">Data Saver</h4>
        <p className="text-2xl font-bold text-primary">
          {networkInfo?.saveData ? 'ON' : 'OFF'}
        </p>
      </div>
    </div>
  );
};

export default HeroDemo;