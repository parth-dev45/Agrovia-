import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Leaf,
  ClipboardCheck,
  Warehouse,
  Store,
  User,
  ArrowRight,
  Key,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import { useAuth } from '@/components/AuthProvider';

const PASSKEY = 'PB2806';

export default function Login() {
  const navigate = useNavigate();
  const [passkeyModalOpen, setPasskeyModalOpen] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState(false);
  const [targetPath, setTargetPath] = useState<string | null>(null);

  const roles = [
    {
      label: 'Operations & Management',
      description: 'Manage Farmers, Quality, and Warehouse',
      icon: Warehouse,
      path: '/warehouse', // Acts as the main admin entry for now, or could be /dashboard if we have one
      color: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
      dotColor: 'bg-emerald-400',
      requiresPasskey: true,
    },
    {
      label: 'Retailer',
      description: 'POS system and procurement',
      icon: Store,
      path: '/retailer',
      color: 'bg-amber-50 text-amber-700 ring-amber-100',
      dotColor: 'bg-amber-400',
      requiresPasskey: true,
    },
    {
      label: 'Consumer',
      description: 'Track orders and verify products',
      icon: User,
      path: '/customer',
      color: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
      dotColor: 'bg-indigo-400',
      requiresPasskey: false,
    },
  ] as const;

  const { loginWithRole } = useAuth();

  const roleMap: Record<string, 'admin' | 'retailer' | 'customer'> = {
    '/warehouse': 'admin',
    '/retailer': 'retailer',
    '/customer': 'customer'
  };

  const handleRoleClick = (path: string, requiresPasskey?: boolean) => {
    if (requiresPasskey) {
      setTargetPath(path);
      setPasskeyInput('');
      setPasskeyError(false);
      setPasskeyModalOpen(true);
    } else {
      // Direct access (Consumer)
      const role = roleMap[path] || 'customer';
      loginWithRole(role);
    }
  };

  const handlePasskeySubmit = () => {
    if (passkeyInput === PASSKEY && targetPath) {
      setPasskeyError(false);
      setPasskeyModalOpen(false);

      const role = roleMap[targetPath] || 'admin';
      loginWithRole(role);

      // Navigation is now handled inside loginWithRole after success
    } else {
      setPasskeyError(true);
    }
  };

  return (
    <div className="min-h-screen flex bg-background font-sans selection:bg-primary/20">
      {/* Left: Branding / Hero - NOW NAVY BLUE */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
        {/* Animated Background Elements - Subtler & Blended */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse duration-[4000ms]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse duration-[5000ms] delay-1000" />

        {/* Pattern Overlay - Keeping strictly subtle */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%221%22%20cy%3D%221%22%20r%3D%221%22/%3E%3C/g%3E%3C/svg%3E')] opacity-30" />

        <div className="relative z-10 flex flex-col justify-between p-16 text-white h-full">
          {/* Logo */}
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-8 duration-700">
            <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <div>
              <span className="text-3xl font-bold tracking-tight text-white">AgroVia</span>
              <div className="text-sm font-medium text-blue-100/80 tracking-wide uppercase">Supply Chain Platform</div>
            </div>
          </div>

          <div className="space-y-8 max-w-xl">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 text-white">
              Fresh from{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-200">Farm</span>
              {' '}to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-200">Table</span>
            </h1>
            <p className="text-lg text-blue-50/90 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 border-l-4 border-white/30 pl-6">
              Join thousands of stakeholders building trust through complete supply chain transparency. Track every step, ensure quality, and deliver freshness.
            </p>

            {/* Tag Cloud */}
            <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
              {['🌱 Sustainable', '🛡️ Quality Assured', '🚛 Real-time Tracking', '🏪 Retail Ready'].map((label, i) => (
                <div
                  key={label}
                  className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white hover:bg-white/20 transition-colors cursor-default"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="flex gap-8 text-sm text-blue-200/60 animate-in fade-in duration-1000 delay-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              System Operational
            </div>
            <div>v2.4.0 (Stable)</div>
          </div>
        </div>
      </div>

      {/* Right: Role selection */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 py-12 bg-white dark:bg-slate-950">
        <div className="w-full max-w-[480px] space-y-10">

          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-slate-900">AgroVia</span>
          </div>

          <div className="space-y-2 text-center lg:text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Select your portal to continue</p>
          </div>

          <div className="space-y-4">
            {roles.map(({ label, description, icon: Icon, path, color, dotColor, requiresPasskey }, index) => (
              <button
                key={label}
                type="button"
                onClick={() => handleRoleClick(path, requiresPasskey)}
                className="w-full group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/20 animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative flex items-center gap-5 p-5 z-10">
                  <div className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 shadow-sm",
                    color
                  )}>
                    <Icon className="h-7 w-7" />
                  </div>

                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">
                        {label}
                      </span>
                      {requiresPasskey && (
                        <Key className="h-3.5 w-3.5 text-slate-400 opacity-50" />
                      )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      {description}
                    </p>
                  </div>

                  <div className="h-8 w-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>

                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800/50 animate-in fade-in duration-1000 delay-500">
            <p className="text-xs text-center text-slate-400">
              Protected by enterprise-grade security. <br />
              By accessing the portal, you agree to our{' '}
              <Link to="#" className="text-slate-600 hover:text-primary transition-colors underline decoration-slate-300 hover:decoration-primary">Terms</Link>
              {' '}and{' '}
              <Link to="#" className="text-slate-600 hover:text-primary transition-colors underline decoration-slate-300 hover:decoration-primary">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>

      {/* Passkey modal (Unchanged but styled) */}
      <Dialog open={passkeyModalOpen} onOpenChange={setPasskeyModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden gap-0 border-slate-200 shadow-2xl">
          <div className="bg-slate-50 dark:bg-slate-900 p-6 text-center border-b border-slate-100 dark:border-slate-800">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5">
              <Key className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">Security Verification</DialogTitle>
            <DialogDescription className="mt-2 text-slate-500">
              Please enter your employee passkey to access this secure portal.
            </DialogDescription>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="passkey" className="text-xs font-bold uppercase text-slate-400 tracking-wider">Passkey</Label>
              <Input
                id="passkey"
                type="password"
                placeholder="••••••"
                value={passkeyInput}
                onChange={(e) => {
                  setPasskeyInput(e.target.value);
                  setPasskeyError(false);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handlePasskeySubmit()}
                className={cn(
                  'h-12 rounded-xl font-mono text-lg tracking-widest text-center border-slate-200 bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:bg-white dark:focus:bg-slate-900 transition-all',
                  passkeyError && 'border-destructive focus-visible:ring-destructive bg-destructive/5 animate-shake'
                )}
                autoFocus
              />
              {passkeyError && (
                <p className="text-sm font-medium text-destructive text-center flex items-center justify-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                  Incorrect passkey
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => setPasskeyModalOpen(false)} className="h-11 rounded-xl border-slate-200 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 dark:text-slate-200">
                Cancel
              </Button>
              <Button onClick={handlePasskeySubmit} className="h-11 rounded-xl shadow-lg shadow-primary/20">
                Verify Access
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

