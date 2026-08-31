import Hero from "@/components/ui/animated-shader-hero";
import { useNavigate } from 'react-router-dom';
import {
  Leaf,
  TrendingUp,
  Shield,
  Truck,
  CheckCircle2,
  Users,
  Globe,
  Sprout
} from "lucide-react";

const AgroviaHero = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    // Navigate to farmer onboarding
    navigate('/farmer');
  };

  const handleWatchDemo = () => {
    // Open demo video or tour
    navigate('/demo');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Shader Hero */}
      <Hero
        trustBadge={{
          text: "🌾 Trusted by 5,000+ farms across India",
          icons: ["⭐", "⭐", "⭐", "⭐", "⭐"]
        }}
        headline={{
          line1: "Track Freshness from",
          line2: "Farm to Retail Shelf"
        }}
        subtitle="Ensure crop quality, reduce waste, and build consumer trust with real-time freshness tracking powered by IoT sensors and blockchain verification."
        buttons={{
          primary: {
            text: "Start Tracking Free",
            onClick: handleGetStarted
          },
          secondary: {
            text: "See How It Works",
            onClick: handleWatchDemo
          }
        }}
        className="agrovia-hero"
      />

      {/* Key Features Section */}
      <section className="relative z-10 bg-background py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4">
              <Sprout className="w-4 h-4" />
              <span>Complete Supply Chain Visibility</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Farmers & Retailers Choose AgroVia
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built by farmers, for the agricultural ecosystem
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Leaf className="w-10 h-10 text-primary" />}
              title="Real-Time Monitoring"
              description="Track temperature, humidity, and freshness indicators throughout the supply chain"
              stat="99.9% accuracy"
            />
            <FeatureCard
              icon={<Shield className="w-10 h-10 text-primary" />}
              title="Blockchain Verified"
              description="Immutable records ensure transparency and prevent fraud in the supply chain"
              stat="100% traceable"
            />
            <FeatureCard
              icon={<TrendingUp className="w-10 h-10 text-primary" />}
              title="Reduce Waste"
              description="Predictive analytics help optimize harvest timing and reduce post-harvest losses"
              stat="30% less waste"
            />
            <FeatureCard
              icon={<Truck className="w-10 h-10 text-primary" />}
              title="Smart Logistics"
              description="Optimize routes and storage conditions to maintain peak freshness during transport"
              stat="2x faster delivery"
            />
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="relative z-10 bg-muted/50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <StatCard
              icon={<Users className="w-8 h-8 text-primary mx-auto mb-3" />}
              value="5,000+"
              label="Active Farms"
            />
            <StatCard
              icon={<CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-3" />}
              value="2M+"
              label="Shipments Tracked"
            />
            <StatCard
              icon={<Globe className="w-8 h-8 text-primary mx-auto mb-3" />}
              value="15+"
              label="States Covered"
            />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="relative z-10 bg-background py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-3xl text-yellow-400">⭐</span>
              ))}
            </div>
            <blockquote className="text-2xl md:text-3xl font-medium mb-6">
              "AgroVia reduced our post-harvest losses by 35% and increased buyer trust tremendously. Now retailers can see exactly when our produce was harvested."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Sprout className="w-8 h-8 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-lg">Rajesh Kumar</p>
                <p className="text-muted-foreground">Organic Farmer, Maharashtra</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({
  icon,
  title,
  description,
  stat
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  stat: string;
}) => (
  <div className="group p-6 rounded-xl border bg-card hover:shadow-xl hover:border-primary/50 transition-all duration-300">
    <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground mb-4 text-sm">{description}</p>
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
      <TrendingUp className="w-4 h-4" />
      {stat}
    </div>
  </div>
);

// Stat Card Component
const StatCard = ({
  icon,
  value,
  label
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) => (
  <div className="p-6">
    {icon}
    <p className="text-4xl md:text-5xl font-bold text-foreground mb-2">{value}</p>
    <p className="text-muted-foreground font-medium">{label}</p>
  </div>
);

export default AgroviaHero;