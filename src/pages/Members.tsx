import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/AuthProvider';
import { createCustomerInFirestore, getCustomerByPhoneFromFirestore, updateCustomerMembership } from '@/lib/services/customerService';
import { Crown, Sparkles, Check, CreditCard, User, QrCode, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

export default function Members() {
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [activeTab, setActiveTab] = useState('register');
    const [memberData, setMemberData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Check if user is already a member
    const handleLookup = async () => {
        if (!phone) {
            toast.error('Please enter your phone number');
            return;
        }
        setLoading(true);
        try {
            const customer = await getCustomerByPhoneFromFirestore(phone);
            if (customer) {
                setMemberData(customer);
                setActiveTab('card');
                toast.success(`Welcome back, ${customer.name || 'Member'}!`);
            } else {
                toast.info('Member not found. Please register.');
                setActiveTab('register');
            }
        } catch (e) {
            toast.error('Error looking up member');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!phone) {
            toast.error('Phone number is required');
            return;
        }
        setLoading(true);
        try {
            const customer = await createCustomerInFirestore({ phone, name, email });
            setMemberData(customer);
            setActiveTab('card');
            toast.success('Membership created successfully!');
        } catch (e) {
            // Service handles toast
        } finally {
            setLoading(false);
        }
    };

    const handleUpgrade = async (tier: 'Standard' | 'Premium', price: number) => {
        if (!memberData) return;

        // Simulate payment processing
        const confirm = window.confirm(`Proceed to pay Rs.${price} for ${tier} Membership?`);
        if (!confirm) return;

        setLoading(true);
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            await updateCustomerMembership(memberData.memberId, tier);

            // Refresh local data
            setMemberData({
                ...memberData,
                membershipTier: tier
            });
            toast.success(`Upgraded to ${tier} Membership!`);
        } catch (e) {
            toast.error("Upgrade failed");
        } finally {
            setLoading(false);
        }
    };

    const TierCard = ({ tier, price, benefits, color, current }: any) => (
        <Card className={`relative overflow-hidden transition-all hover:scale-105 ${current ? 'border-primary ring-2 ring-primary ring-offset-2' : ''}`}>
            {current && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl-lg font-bold">
                    CURRENT
                </div>
            )}
            <div className={`absolute top-0 left-0 w-full h-1 ${color}`} />
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    {tier}
                    {tier === 'Premium' && <Crown className="h-5 w-5 text-purple-500" />}
                    {tier === 'Standard' && <Sparkles className="h-5 w-5 text-yellow-500" />}
                    {tier === 'Free' && <ShieldCheck className="h-5 w-5 text-slate-400" />}
                </CardTitle>
                <CardDescription>
                    {price === 0 ? 'Free Forever' : <span className="text-lg font-bold text-foreground">Rs.{price}<span className="text-xs font-normal text-muted-foreground">/month</span></span>}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 text-sm">
                    {benefits.map((b: string, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" /> {b}
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Button
                    variant={current ? "outline" : "default"}
                    className="w-full"
                    disabled={current || loading}
                    onClick={() => !current && handleUpgrade(tier, price)}
                >
                    {current ? 'Active Plan' : `Upgrade to ${tier}`}
                </Button>
            </CardFooter>
        </Card>
    );

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 p-4">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        AgroVia <span className="text-primary">Members</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Join our exclusive community for fresh produce discounts, priority access, and rewards.
                    </p>
                </div>

                {!memberData ? (
                    <Card className="max-w-md mx-auto shadow-lg">
                        <CardHeader>
                            <CardTitle>Member Login / Register</CardTitle>
                            <CardDescription>Enter your phone number to access your membership</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input
                                    placeholder="e.g. 9876543210"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            {activeTab === 'register' && (
                                <>
                                    <div className="space-y-2">
                                        <Label>Full Name</Label>
                                        <Input
                                            placeholder="Your Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email (Optional)</Label>
                                        <Input
                                            type="email"
                                            placeholder="email@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </>
                            )}
                        </CardContent>
                        <CardFooter className="flex-col gap-3">
                            {activeTab === 'login' ? (
                                <>
                                    <Button className="w-full" onClick={handleLookup} disabled={loading}>
                                        {loading ? 'Checking...' : 'Check Membership'}
                                    </Button>
                                    <Button variant="ghost" className="w-full" onClick={() => setActiveTab('register')}>
                                        New User? Register
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button className="w-full bg-primary" onClick={handleRegister} disabled={loading}>
                                        {loading ? 'Creating...' : 'Create Membership'}
                                    </Button>
                                    <Button variant="ghost" className="w-full" onClick={() => setActiveTab('login')}>
                                        Already a member? Login
                                    </Button>
                                </>
                            )}
                        </CardFooter>
                    </Card>
                ) : (
                    <Tabs defaultValue="card" className="space-y-8">
                        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                            <TabsTrigger value="card">My Card</TabsTrigger>
                            <TabsTrigger value="plans">Membership Plans</TabsTrigger>
                        </TabsList>

                        <TabsContent value="card" className="space-y-6">
                            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 text-white p-8 shadow-2xl max-w-md mx-auto border border-zinc-700">
                                {/* Background Pattern */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl -ml-16 -mb-16" />

                                <div className="relative z-10 flex flex-col h-full min-h-[220px] justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg tracking-wider">AgroVia</h3>
                                            <p className="text-zinc-400 text-xs uppercase tracking-widest">Membership Card</p>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                                            <span className={`font-bold text-sm ${memberData.membershipTier === 'Premium' ? 'text-purple-300' :
                                                    memberData.membershipTier === 'Standard' ? 'text-yellow-300' : 'text-slate-300'
                                                }`}>
                                                {memberData.membershipTier?.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 my-6">
                                        <div className="bg-white p-2 rounded-lg">
                                            {/* Mock QR Code */}
                                            <QrCode className="h-20 w-20 text-black" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-mono tracking-widest">{memberData.memberId}</p>
                                            <p className="text-zinc-400 text-sm mt-1">Show this at checkout</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs text-zinc-500 uppercase">Member Name</p>
                                            <p className="font-medium text-lg">{memberData.name || 'AgroVia Member'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 uppercase text-right">Join Date</p>
                                            <p className="font-medium text-right">{new Date(memberData.membershipJoinDate || memberData.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="max-w-md mx-auto text-center space-y-2">
                                <Button variant="outline" className="w-full" onClick={() => setMemberData(null)}>
                                    <User className="mr-2 h-4 w-4" /> Switch Account
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="plans">
                            <div className="grid md:grid-cols-3 gap-6">
                                <TierCard
                                    tier="Free"
                                    price={0}
                                    color="bg-slate-400"
                                    current={memberData.membershipTier === 'Free' || !memberData.membershipTier}
                                    benefits={[
                                        "Access to fresh produce",
                                        "Digital Membership Card",
                                        "Standard Support"
                                    ]}
                                />
                                <TierCard
                                    tier="Standard"
                                    price={149}
                                    color="bg-yellow-400"
                                    current={memberData.membershipTier === 'Standard'}
                                    benefits={[
                                        "5% Discount on all orders",
                                        "Priority Checkout",
                                        "Weekly Deals access",
                                        "Dedicated Support"
                                    ]}
                                />
                                <TierCard
                                    tier="Premium"
                                    price={259}
                                    color="bg-purple-400"
                                    current={memberData.membershipTier === 'Premium'}
                                    benefits={[
                                        "10% Discount on all orders",
                                        "Free Home Delivery",
                                        "First access to seasonal items",
                                        "VIP Support Line"
                                    ]}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </Layout>
    );
}
