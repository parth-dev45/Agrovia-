import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Database, User } from 'lucide-react';
import CustomerLookup from '@/pages/CustomerLookup';
import TraceabilityExplorer from '@/pages/TraceabilityExplorer';
import { getAllCustomers } from '@/lib/customers'; // Type only if needed, or remove?
// Actually we need the hook now.
import { useCustomers } from '@/lib/services/customerService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ConsumerChatbot from '@/components/ConsumerChatbot';

export default function CustomerTraceability({ defaultTab }: { defaultTab?: 'customer' | 'traceability' }) {
  const [tab, setTab] = useState<'customer' | 'traceability' | 'members'>(defaultTab || 'customer');
  // Use Firestore hook
  const { customers, loading: customersLoading } = useCustomers();
  const [newPhone, setNewPhone] = useState('');
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (defaultTab) setTab(defaultTab);
  }, [defaultTab]);

  const handleAddMember = async () => {
    const phone = newPhone.trim();
    if (!phone) return;

    try {
      const { createCustomerInFirestore } = await import('@/lib/services/customerService');
      await createCustomerInFirestore({ phone, name: newName });
      setNewPhone('');
      setNewName('');
      // No need to manually refresh, hook handles real-time updates
    } catch (e) {
      // Service handles toast
    }
  };

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-700">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border p-6 shadow-sm">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-fresh/20 to-transparent rounded-full blur-2xl" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 bg-white/80 dark:bg-black/20 rounded-3xl flex items-center justify-center shadow-xl backdrop-blur-sm">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Customer & Traceability Hub
                </h1>
                <p className="text-lg text-muted-foreground mt-1">Complete customer management and product traceability in one place</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-fresh animate-pulse" />
                    <span>Live Verification</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span>Blockchain Secured</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Badge variant="outline" className="font-mono bg-white/60 dark:bg-black/20 backdrop-blur-sm border-primary/30">
                Unified Platform
              </Badge>
              <div className="bg-white/60 dark:bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-border/50 shadow-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Database className="h-4 w-4 text-primary" />
                  <span className="font-medium">{customers.length} Members</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-secondary/50 p-1 rounded-lg">
            <TabsTrigger value="customer" className="gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <User className="h-4 w-4" />
              Customer
            </TabsTrigger>
            <TabsTrigger value="members" className="gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <User className="h-4 w-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="traceability" className="gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <Database className="h-4 w-4" />
              Traceability
            </TabsTrigger>
          </TabsList>

          <div className="flex justify-end">
            <Button onClick={() => window.location.hash = '#/scan'} className="gap-2 bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/20 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /></svg>
              Scan QR Code
            </Button>
          </div>

          <TabsContent value="customer" className="animate-in slide-in-from-bottom-2 duration-500">
            <CustomerLookup embedded />
          </TabsContent>

          <TabsContent value="members" className="animate-in slide-in-from-bottom-2 duration-500">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Register Member</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    placeholder="Customer phone number"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                  />
                  <Input
                    placeholder="Customer name (optional)"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                  <Button className="w-full" onClick={handleAddMember}>
                    Create Member ID
                  </Button>
                </CardContent>
              </Card>

              <Card className="max-h-[360px] overflow-y-auto">
                <CardHeader>
                  <CardTitle>Existing Members</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {customers.length === 0 ? (
                    <p className="text-muted-foreground">No members registered yet.</p>
                  ) : (
                    customers.map((c) => (
                      <div key={c.memberId} className="flex items-center justify-between border-b border-border/40 py-2">
                        <div>
                          <p className="font-medium">{c.name || 'Member'}</p>
                          <p className="text-xs text-muted-foreground">{c.phone}</p>
                        </div>
                        <Badge variant="outline" className="font-mono text-xs">
                          {c.memberId}
                        </Badge>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="traceability" className="animate-in slide-in-from-bottom-2 duration-500">
            {/* @ts-ignore */}
            <TraceabilityExplorer embedded />
          </TabsContent>
        </Tabs>
      </div>
      <ConsumerChatbot />
    </Layout>
  );
}

