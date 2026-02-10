import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Leaf, ShieldCheck, Zap, Globe, ChevronRight, BarChart3, Lock, Star, Users, TrendingUp, Award, Sparkles, ArrowUpRight, Shield } from 'lucide-react';
import AnimatedShaderHero from '@/components/ui/animated-shader-hero';

export default function Landing() {
    const navigate = useNavigate();
    
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20">

            {/* Enhanced Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 transition-all duration-300">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25">
                            <Leaf className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <span className="text-2xl font-bold tracking-tight text-gradient">AgroVia</span>
                            <div className="text-xs text-muted-foreground font-medium">Supply Chain Platform</div>
                        </div>
                    </div>
                    <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                        <button onClick={() => scrollToSection('features')} className="hover:text-primary transition-colors duration-200">Features</button>
                        <button onClick={() => scrollToSection('how-it-works')} className="hover:text-primary transition-colors duration-200">Traceability</button>
                        <button onClick={() => scrollToSection('testimonials')} className="hover:text-primary transition-colors duration-200">Testimonials</button>
                        <button onClick={() => scrollToSection('pricing')} className="hover:text-primary transition-colors duration-200">Pricing</button>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/auth">
                            <Button variant="ghost" className="hidden md:inline-flex">Sign In</Button>
                        </Link>
                        <Link to="/auth">
                            <Button variant="default" size="lg" className="rounded-lg px-8 h-11 shadow-md">
                                Get Started <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Enhanced Hero Section with Animated Shader */}
            <section className="relative overflow-hidden">
                <AnimatedShaderHero
                    trustBadge={{
                        text: "🌾 Trusted by 500+ farms across India",
                        icons: ["⭐", "⭐", "⭐", "⭐", "⭐"]
                    }}
                    headline={{
                        line1: "The Future of",
                        line2: "Ethical Agriculture"
                    }}
                    subtitle="AgroVia brings farm-to-table transparency to the modern world. Connect farmers, distributors, and consumers on a single immutable ledger."
                    buttons={{
                        primary: {
                            text: "Launch Platform",
                            onClick: () => navigate('/dashboard')
                        },
                        secondary: {
                            text: "View Public Ledger",
                            onClick: () => navigate('/traceability')
                        }
                    }}
                />

                {/* Enhanced Stats - moved below hero */}
                <div className="relative z-10 bg-background/95 backdrop-blur-sm border-t">
                    <div className="container mx-auto px-6 max-w-7xl py-16">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { label: 'Batches Tracked', value: '10k+', icon: BarChart3 },
                                { label: 'Farm Partners', value: '500+', icon: Users },
                                { label: 'Waste Reduced', value: '45%', icon: TrendingUp },
                                { label: 'Data Uptime', value: '99.9%', icon: Shield },
                            ].map((stat, i) => (
                                <div key={i} className="text-center space-y-3 group">
                                    <div className="inline-flex p-3 rounded-2xl bg-primary/5 group-hover:bg-primary/10 transition-colors mb-2">
                                        <stat.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="text-4xl font-bold text-foreground group-hover:text-primary transition-colors">{stat.value}</div>
                                    <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Features Grid */}
            <section id="features" className="py-32 bg-secondary/20 relative">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gradient">Enterprise-Grade Capabilities</h2>
                        <p className="text-muted-foreground text-xl leading-relaxed">Everything you need to manage the supply chain, from harvest to retail.</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Globe className="h-8 w-8 text-blue-500" />,
                                title: "Global Traceability",
                                desc: "Track produce journey effectively across borders with precise geolocation and timestamping.",
                                color: "blue"
                            },
                            {
                                icon: <ShieldCheck className="h-8 w-8 text-green-500" />,
                                title: "Quality Assurance",
                                desc: "AI-powered grading systems ensure only the best produce reaches the market.",
                                color: "green"
                            },
                            {
                                icon: <Zap className="h-8 w-8 text-yellow-500" />,
                                title: "Instant Settlements",
                                desc: "Smart contracts automate payments to farmers immediately upon quality verification.",
                                color: "yellow"
                            },
                            {
                                icon: <BarChart3 className="h-8 w-8 text-purple-500" />,
                                title: "Advanced Analytics",
                                desc: "Real-time insights into waste reduction, inventory levels, and predicted demand.",
                                color: "purple"
                            },
                            {
                                icon: <Lock className="h-8 w-8 text-red-500" />,
                                title: "Immutable Security",
                                desc: "Blockchain-backed data integrity means records can never be tampered with.",
                                color: "red"
                            },
                            {
                                icon: <CheckCircle2 className="h-8 w-8 text-teal-500" />,
                                title: "Retailer Integration",
                                desc: "Seamless POS systems for retailers to manage stock and verify freshness.",
                                color: "teal"
                            }
                        ].map((feature, i) => (
                            <div key={i} className="group p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-white/60 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-white/15 rounded-xl">
                                <div className="p-0">
                                    <div className="mb-8 inline-flex p-4 rounded-2xl bg-secondary/50 group-hover:bg-white dark:group-hover:bg-secondary transition-all duration-300 group-hover:scale-110">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed text-lg">
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Preview Section */}
            <section id="how-it-works" className="py-32 overflow-hidden">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8 animate-fade-in-up">
                            <h2 className="text-5xl font-bold leading-tight">
                                See the entire journey <br />
                                <span className="text-gradient-fresh">in real-time.</span>
                            </h2>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Our dashboard provides a command center for your entire operation. Monitor live logistics, verify batch quality with AI, and manage warehouse inventory with drag-and-drop simplicity.
                            </p>
                            <div className="space-y-6">
                                {[
                                    "Live Truck Tracking with IoT Sensors",
                                    "Blockchain Verification Explorer",
                                    "Automated Label & Invoice Generation"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 group">
                                        <div className="p-2 rounded-xl bg-fresh/10 group-hover:bg-fresh/20 transition-colors">
                                            <CheckCircle2 className="h-6 w-6 text-fresh" />
                                        </div>
                                        <span className="font-semibold text-lg group-hover:text-primary transition-colors">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <Link to="/dashboard">
                                <Button variant="outline" size="xl" className="rounded-2xl mt-8 hover:bg-secondary/50 border-2">
                                    Explore Dashboard <ChevronRight className="ml-3 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>

                        <div className="relative animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-fresh opacity-20 blur-3xl rounded-full" />
                            <div className="relative rounded-3xl overflow-hidden border-2 border-border/50 shadow-2xl p-8 rotate-3 hover:rotate-0 transition-transform duration-700 bg-white/80 dark:bg-black/60 backdrop-blur-xl border-white/30 dark:border-white/20">
                                <div className="aspect-video rounded-2xl bg-gradient-to-br from-secondary/50 to-secondary/30 flex items-center justify-center border-2 border-border/50">
                                    <div className="text-center space-y-6">
                                        <div className="inline-flex p-6 rounded-full bg-background shadow-2xl mb-6">
                                            <Leaf className="h-16 w-16 text-fresh" />
                                        </div>
                                        <p className="text-lg font-semibold text-muted-foreground">Interactive Dashboard Preview</p>
                                        <div className="flex justify-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                            <div className="w-2 h-2 rounded-full bg-fresh animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: '1s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Testimonials Section */}
            <section id="testimonials" className="py-32 bg-secondary/30">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gradient">Trusted by Industry Leaders</h2>
                        <p className="text-muted-foreground text-xl leading-relaxed">See how AgroVia is transforming supply chains worldwide.</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {[
                            {
                                quote: "AgroVia's blockchain traceability has completely changed how we build trust with our customers. Sales are up 30%.",
                                author: "Kaustubh Jagade",
                                role: "Organic Farmer, India",
                                rating: 5
                            },
                            {
                                quote: "The AI grading system is a game changer. We save hours every day and dispute rates have dropped to near zero.",
                                author: "Anushka Talole",
                                role: "Wholesale Distributor, India",
                                rating: 5
                            },
                            {
                                quote: "Finally, a platform that actually connects the entire supply chain. The real-time logistics tracking is invaluable.",
                                author: "Anuj Pisal",
                                role: "Supply Chain Director, India",
                                rating: 5
                            }
                        ].map((testimonial, i) => (
                            <div key={i} className="p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative bg-white/80 dark:bg-black/60 backdrop-blur-xl border border-white/30 dark:border-white/20 rounded-xl">
                                <div className="p-0">
                                    <div className="absolute top-8 right-8 text-primary/20">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M14.017 21L14.017 18C14.017 16.054 15.337 14.713 17.373 14.713H17.525C17.068 13.069 16.49 11.593 15.426 10.428C14.363 9.263 12.872 8.5 10.975 8.5V4.764C13.844 4.764 16.295 6.075 18.067 8.32C19.839 10.565 20.849 13.91 20.887 18.006L14.017 21ZM5.52901 21L5.52901 18C5.52901 16.054 6.84901 14.713 8.88501 14.713H9.03701C8.58001 13.069 8.00301 11.593 6.93801 10.428C5.87401 9.263 4.38301 8.5 2.48601 8.5V4.764C5.35501 4.764 7.80601 6.075 9.57801 8.32C11.35 10.565 12.36 13.91 12.399 18.006L5.52901 21Z" />
                                        </svg>
                                    </div>
                                    
                                    <div className="flex gap-1 mb-6">
                                        {[...Array(testimonial.rating)].map((_, j) => (
                                            <Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    
                                    <p className="text-xl italic mb-8 leading-relaxed">"{testimonial.quote}"</p>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-fresh flex items-center justify-center text-white font-bold text-lg">
                                            {testimonial.author[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg">{testimonial.author}</div>
                                            <div className="text-sm text-muted-foreground font-medium">{testimonial.role}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced CTA */}
            <section className="py-32">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="relative rounded-[3rem] bg-gradient-to-br from-primary via-primary/95 to-primary/85 overflow-hidden px-12 py-24 text-center text-primary-foreground shadow-2xl">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
                        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
                            <h2 className="text-5xl lg:text-6xl font-bold leading-tight">Ready to modernize your supply chain?</h2>
                            <p className="text-primary-foreground/90 text-2xl leading-relaxed">
                                Join hundreds of forward-thinking agriculture businesses using AgroVia today.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                                <Link to="/dashboard">
                                    <Button size="xl" variant="glass" className="h-20 px-16 rounded-2xl text-2xl font-bold text-primary bg-white hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-2xl">
                                        Get Started Now
                                        <Sparkles className="ml-3 h-6 w-6" />
                                    </Button>
                                </Link>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Footer */}
            <footer className="py-20 border-t border-border/50 bg-secondary/20 backdrop-blur-sm">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid lg:grid-cols-4 gap-12 mb-12">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-12 w-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center">
                                    <Leaf className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gradient">AgroVia</div>
                                    <div className="text-sm text-muted-foreground">Supply Chain Platform</div>
                                </div>
                            </div>
                            <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                                Transforming agriculture through blockchain technology and AI-powered insights.
                            </p>
                        </div>
                        
                        <div>
                            <h4 className="font-bold text-lg mb-4">Product</h4>
                            <div className="space-y-3 text-muted-foreground">
                                <a href="#" className="block hover:text-primary transition-colors">Features</a>
                                <a href="#" className="block hover:text-primary transition-colors">Pricing</a>
                                <a href="#" className="block hover:text-primary transition-colors">API</a>
                                <a href="#" className="block hover:text-primary transition-colors">Documentation</a>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-bold text-lg mb-4">Company</h4>
                            <div className="space-y-3 text-muted-foreground">
                                <a href="#" className="block hover:text-primary transition-colors">About</a>
                                <a href="#" className="block hover:text-primary transition-colors">Blog</a>
                                <a href="#" className="block hover:text-primary transition-colors">Careers</a>
                                <a href="#" className="block hover:text-primary transition-colors">Contact</a>
                            </div>
                        </div>
                    </div>
                    
                    <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-muted-foreground">
                            &copy; 2026 AgroVia Inc. All rights reserved.
                        </div>
                        <div className="flex gap-8 text-sm text-muted-foreground">
                            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
