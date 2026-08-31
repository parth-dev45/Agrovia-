import { useState, useEffect } from 'react';
import AgroviaHero from '@/components/agrovia/hero-section';
import MobileAgroviaHero from '@/components/agrovia/mobile-hero';
import { TestimonialShowcase } from '@/components/agrovia/farmer-testimonial';
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Shield, 
  Users, 
  TrendingUp,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Leaf,
  Sprout,
  Globe
} from 'lucide-react';

const AgroviaLanding = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Network Status Indicator for Rural Users */}
      <div className={`fixed top-4 right-4 z-50 px-3 py-1 rounded-full text-sm font-medium ${
        isOnline 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}>
        {isOnline ? (
          <div className="flex items-center gap-1">
            <Wifi className="w-4 h-4" />
            <span>Online</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <WifiOff className="w-4 h-4" />
            <span>Offline</span>
          </div>
        )}
      </div>

      {/* Hero Section - Mobile or Desktop */}
      {isMobile ? <MobileAgroviaHero /> : <AgroviaHero />}

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4">
              <Sprout className="w-4 h-4" />
              <span>Simple 3-Step Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How AgroVia Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From farm registration to retail delivery - track every step
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ProcessStep
              step="1"
              icon={<Smartphone className="w-12 h-12 text-primary" />}
              title="Register Your Farm"
              description="Sign up in 2 minutes with your phone number. Add farm details and get your unique farmer ID."
              features={["Free registration", "SMS verification", "Multilingual support"]}
            />
            <ProcessStep
              step="2"
              icon={<Shield className="w-12 h-12 text-primary" />}
              title="Attach IoT Sensors"
              description="Place our smart sensors on your produce shipments. They track temperature, humidity, and location."
              features={["Easy attachment", "Real-time monitoring", "Battery lasts 30 days"]}
            />
            <ProcessStep
              step="3"
              icon={<TrendingUp className="w-12 h-12 text-primary" />}
              title="Track & Earn More"
              description="Retailers see verified freshness data and pay premium prices for quality produce."
              features={["Blockchain verified", "Premium pricing", "Instant payments"]}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialShowcase />

      {/* Trust & Certifications */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Trusted & Certified
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <CertificationBadge
              icon="🏛️"
              title="Government Approved"
              subtitle="Ministry of Agriculture"
            />
            <CertificationBadge
              icon="🛡️"
              title="ISO 22000 Certified"
              subtitle="Food Safety Management"
            />
            <CertificationBadge
              icon="🔒"
              title="Blockchain Secured"
              subtitle="Immutable Records"
            />
            <CertificationBadge
              icon="📱"
              title="FSSAI Partner"
              subtitle="Food Safety Standards"
            />
          </div>

          <div className="bg-card rounded-xl p-8 border">
            <h3 className="text-2xl font-bold mb-4">
              Backed by Leading Organizations
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-lg font-semibold">Government of India</div>
              <div className="text-lg font-semibold">NABARD</div>
              <div className="text-lg font-semibold">FSSAI</div>
              <div className="text-lg font-semibold">Digital India</div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section - Critical for Rural Users */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              24/7 Support in Your Language
            </h2>
            <p className="text-muted-foreground text-lg">
              Get help when you need it, in Hindi, English, and regional languages
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SupportCard
              icon={<Phone className="w-8 h-8 text-primary" />}
              title="Toll-Free Helpline"
              detail="1800-AGROVIA"
              availability="24/7 Available"
            />
            <SupportCard
              icon={<MessageCircle className="w-8 h-8 text-primary" />}
              title="WhatsApp Support"
              detail="+91-XXXXX-XXXXX"
              availability="Instant Response"
            />
            <SupportCard
              icon={<Mail className="w-8 h-8 text-primary" />}
              title="Email Support"
              detail="help@agrovia.com"
              availability="Response in 2 hours"
            />
            <SupportCard
              icon={<MapPin className="w-8 h-8 text-primary" />}
              title="Field Support"
              detail="Local Representatives"
              availability="In 15+ States"
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of farmers already earning more with AgroVia
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <button 
              onClick={() => window.location.href = '/#/farmer'}
              className="flex-1 py-4 px-8 bg-white text-primary rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Start Free Trial
            </button>
            <button 
              onClick={() => window.location.href = 'tel:1800-AGROVIA'}
              className="flex-1 py-4 px-8 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
            >
              Call Now
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm opacity-80">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Free Setup</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>No Hidden Costs</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-muted/50 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sprout className="w-6 h-6 text-primary" />
                <span className="font-bold text-lg">AgroVia</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Empowering farmers with technology for a sustainable future.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">For Farmers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/#/farmer" className="hover:text-primary">Register Farm</a></li>
                <li><a href="/#/demo" className="hover:text-primary">See Demo</a></li>
                <li><a href="#" className="hover:text-primary">Pricing</a></li>
                <li><a href="#" className="hover:text-primary">Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">For Retailers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/#/retailer" className="hover:text-primary">Retailer Portal</a></li>
                <li><a href="#" className="hover:text-primary">Verify Produce</a></li>
                <li><a href="#" className="hover:text-primary">API Integration</a></li>
                <li><a href="#" className="hover:text-primary">Bulk Orders</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="tel:1800-AGROVIA" className="hover:text-primary">1800-AGROVIA</a></li>
                <li><a href="mailto:help@agrovia.com" className="hover:text-primary">help@agrovia.com</a></li>
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-primary">Training Videos</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 AgroVia. Built with 🌾 for Indian Agriculture. Jai Kisan!</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper Components
const ProcessStep = ({ step, icon, title, description, features }: {
  step: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}) => (
  <div className="relative p-6 rounded-xl border bg-card hover:shadow-lg transition-all duration-300">
    <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
      {step}
    </div>
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground mb-4">{description}</p>
    <ul className="space-y-1">
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

const CertificationBadge = ({ icon, title, subtitle }: {
  icon: string;
  title: string;
  subtitle: string;
}) => (
  <div className="p-6 rounded-xl border bg-card text-center">
    <div className="text-4xl mb-3">{icon}</div>
    <h4 className="font-semibold mb-1">{title}</h4>
    <p className="text-sm text-muted-foreground">{subtitle}</p>
  </div>
);

const SupportCard = ({ icon, title, detail, availability }: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  availability: string;
}) => (
  <div className="p-6 rounded-xl border bg-card text-center hover:shadow-lg transition-all duration-300">
    <div className="mb-4 flex justify-center">{icon}</div>
    <h4 className="font-semibold mb-2">{title}</h4>
    <p className="text-primary font-medium mb-1">{detail}</p>
    <p className="text-sm text-muted-foreground">{availability}</p>
  </div>
);

export default AgroviaLanding;