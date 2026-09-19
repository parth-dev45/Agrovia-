import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, Eye, EyeOff, Key, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const PASSKEY = 'PB2806';

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passkeyModalOpen, setPasskeyModalOpen] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  const handlePasskeySubmit = () => {
    if (passkeyInput === PASSKEY) {
      setPasskeyError(false);
      setPasskeyModalOpen(false);
      setPasskeyInput('');
      navigate('/warehouse');
    } else {
      setPasskeyError(true);
    }
  };

  const openPasskeyModal = () => {
    setPasskeyError(false);
    setPasskeyInput(PASSKEY);
    setPasskeyModalOpen(true);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Branding / Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary from-20% via-primary/95 to-primary/80">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-100" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Leaf className="h-7 w-7" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight">AgroVia</span>
              <div className="text-sm text-white/80">Supply Chain Platform</div>
            </div>
          </div>
          <div>
            <p className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
              Transparent Supply Chain from Farm to Table
            </p>
            <p className="text-white/90 text-lg max-w-md">
              Track products from farm to customer through quality control, warehouse, and retail—all on one platform.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-white/80">
            <span>Farm → QC → Warehouse → Retail → Customer</span>
          </div>
        </div>
      </div>

      {/* Right: Auth form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 py-12 bg-background">
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">AgroVia</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {isLogin
                ? 'Sign in to access your supply chain dashboard.'
                : 'Register to get started with AgroVia.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-lg border-border focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 rounded-lg border-border focus:ring-2 focus:ring-primary/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(v) => setRememberMe(!!v)}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Link
                  to="#"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
            )}
            <Button
              type="submit"
              className="w-full h-11 rounded-lg font-medium"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : isLogin ? (
                'Sign in'
              ) : (
                'Create account'
              )}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase text-muted-foreground">
              <span className="bg-background px-2">Or</span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Warehouse or Retailer? Sign in with your secure passkey.
            </p>
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 rounded-lg border-2 border-primary/30 text-primary hover:bg-primary/5"
              onClick={openPasskeyModal}
            >
              <Key className="h-4 w-4 mr-2" />
              Sign in with Passkey
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-medium hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>

      {/* Passkey modal */}
      <Dialog open={passkeyModalOpen} onOpenChange={setPasskeyModalOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Key className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-center">Warehouse / Retailer Access</DialogTitle>
            <DialogDescription className="text-center">
              Enter your secure passkey to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Demo Passkey: Pre-filled (<code className="font-mono font-bold bg-emerald-100 dark:bg-emerald-900/80 px-1 py-0.5 rounded text-emerald-900 dark:text-emerald-200">PB2806</code>)
              </span>
              <button
                type="button"
                onClick={() => {
                  setPasskeyInput(PASSKEY);
                  setPasskeyError(false);
                }}
                className="text-emerald-700 dark:text-emerald-300 font-bold hover:underline"
              >
                Autofill
              </button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passkey">Passkey</Label>
              <Input
                id="passkey"
                type="text"
                placeholder="PB2806"
                value={passkeyInput}
                onChange={(e) => {
                  setPasskeyInput(e.target.value);
                  setPasskeyError(false);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handlePasskeySubmit()}
                className={cn(
                  'h-11 rounded-lg font-mono text-center tracking-wider',
                  passkeyError && 'border-destructive focus-visible:ring-destructive animate-shake'
                )}
                autoFocus
              />
              {passkeyError && (
                <p className="text-sm text-destructive">Incorrect passkey (Hint: PB2806). Please try again.</p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setPasskeyModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePasskeySubmit}>
              Verify <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
