import AgroviaGlassHero from '@/components/agrovia/glass-hero';
import { 
  Leaf, 
  Shield, 
  TrendingUp, 
  Truck, 
  Smartphone, 
  BarChart, 
  Users,
  Award,
  CheckCircle2,
  Zap,
  Globe,
  Lock
} from 'lucide-react';

function FeaturesGlass() {
  return (
    <div className="bg-zinc-950 min-h-screen">
      {/* Glassmorphism Hero Section */}
      <AgroviaGlassHero />

      {/* Features Grid */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Complete Supply Chain Visibility
            </h2>
            <p className="text-zinc-400 text-xl leading-relaxed max-w-3xl mx-auto">
              Everything you need to manage the agricultural supply chain, from harvest to retail shelf.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature Card 1 - Real-Time Monitoring */}
            <FeatureCard
              icon={<Leaf className="w-10 h-10 text-green-400" />}
              title="Real-Time Monitoring"
              description="Track temperature, humidity, and freshness with IoT sensors throughout the entire supply chain journey."
              gradient="from-green-500/20 to-transparent"
              stats="99.9% Accuracy"
              features={["Temperature tracking", "Humidity monitoring", "GPS location", "Battery alerts"]}
            />

            {/* Feature Card 2 - Blockchain Security */}
            <FeatureCard
              icon={<Shield className="w-10 h-10 text-blue-400" />}
              title="Blockchain Verified"
              description="Immutable records ensure complete transparency and prevent fraud throughout the supply chain."
              gradient="from-blue-500/20 to-transparent"
              stats="100% Traceable"
              features={["Immutable records", "Smart contracts", "Fraud prevention", "Audit trails"]}
            />

            {/* Feature Card 3 - Waste Reduction */}
            <FeatureCard
              icon={<TrendingUp className="w-10 h-10 text-yellow-400" />}
              title="Reduce Waste 35%"
              description="Predictive analytics optimize harvest timing and reduce post-harvest losses significantly."
              gradient="from-yellow-500/20 to-transparent"
              stats="₹50Cr+ Saved"
              features={["Predictive analytics", "Optimal harvest timing", "Loss prevention", "Quality alerts"]}
            />

            {/* Feature Card 4 - Smart Logistics */}
            <FeatureCard
              icon={<Truck className="w-10 h-10 text-purple-400" />}
              title="Smart Logistics"
              description="AI-powered route optimization and storage condition management to maintain peak freshness."
              gradient="from-purple-500/20 to-transparent"
              stats="2x Faster Delivery"
              features={["Route optimization", "Cold chain management", "Delivery tracking", "Storage alerts"]}
            />

            {/* Feature Card 5 - Mobile Apps */}
            <FeatureCard
              icon={<Smartphone className="w-10 h-10 text-pink-400" />}
              title="Mobile First"
              description="Farmer and retailer apps with Hindi support, designed for rural connectivity and ease of use."
              gradient="from-pink-500/20 to-transparent"
              stats="5K+ Downloads"
              features={["Hindi language", "Offline mode", "Voice commands", "Simple interface"]}
            />

            {/* Feature Card 6 - Analytics Dashboard */}
            <FeatureCard
              icon={<BarChart className="w-10 h-10 text-orange-400" />}
              title="Advanced Analytics"
              description="Real-time insights into shipment status, quality metrics, profitability, and market trends."
              gradient="from-orange-500/20 to-transparent"
              stats="Live Insights"
              features={["Real-time dashboards", "Quality metrics", "Profit analysis", "Market trends"]}
            />

          </div>
        </div>
      </section>

      {/* Trust & Certifications Section */}
      <section className="relative z-10 py-20 px-4 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Trusted & Certified Platform
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Government approved and industry certified for food safety and quality standards.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CertificationCard
              icon="🏛️"
              title="Government Approved"
              subtitle="Ministry of Agriculture & Farmers Welfare"
              description="Official partnership with Government of India for digital agriculture initiatives."
            />
            <CertificationCard
              icon="🛡️"
              title="ISO 22000 Certified"
              subtitle="Food Safety Management System"
              description="International certification for food safety management throughout the supply chain."
            />
            <CertificationCard
              icon="🔒"
              title="Blockchain Secured"
              subtitle="Immutable Data Records"
              description="Enterprise-grade blockchain security ensuring data integrity and transparency."
            />
            <CertificationCard
              icon="📱"
              title="FSSAI Partner"
              subtitle="Food Safety Standards Authority"
              description="Authorized partner for food safety compliance and quality assurance."
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative overflow-hidden rounded-3xl border border-green-500/20 bg-white/5 p-12 backdrop-blur-xl">
            {/* Glow effect */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-green-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-yellow-500/10 blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Supply Chain?
              </h2>
              <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
                Join thousands of farmers and retailers already using AgroVia to reduce waste, 
                increase profits, and build consumer trust.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => window.location.href = '/#/farmer'}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/50"
                >
                  Start Free Trial
                  <CheckCircle2 className="w-5 h-5" />
                </button>
                
                <button 
                  onClick={() => window.location.href = 'tel:1800-AGROVIA'}
                  className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
                >
                  Call Sales Team
                  <Users className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-8 flex items-center justify-center gap-8 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>Free Setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>No Hidden Costs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Feature Card Component
const FeatureCard = ({
  icon,
  title,
  description,
  gradient,
  stats,
  features
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  stats: string;
  features: string[];
}) => (
  <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]">
    {/* Gradient overlay */}
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
    
    <div className="relative z-10">
      <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-green-300 transition-colors">
        {title}
      </h3>
      
      <p className="text-zinc-400 text-sm leading-relaxed mb-4">
        {description}
      </p>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium mb-4">
        <TrendingUp className="w-3 h-3" />
        {stats}
      </div>

      <ul className="space-y-2">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2 text-xs text-zinc-500">
            <CheckCircle2 className="w-3 h-3 text-green-400" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// Certification Card Component
const CertificationCard = ({
  icon,
  title,
  subtitle,
  description
}: {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
}) => (
  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl text-center hover:bg-white/10 transition-all duration-300 group">
    <div className="text-4xl mb-4">{icon}</div>
    <h4 className="font-semibold text-white mb-2 group-hover:text-green-300 transition-colors">{title}</h4>
    <p className="text-sm text-green-400 mb-3 font-medium">{subtitle}</p>
    <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>
  </div>
);

// Export as named export to avoid conflicts
export { FeaturesGlass as default };