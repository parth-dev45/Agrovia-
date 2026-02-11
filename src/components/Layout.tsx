import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Leaf,
  Warehouse,
  Store,
  BarChart3,
  ClipboardCheck,
  Menu,
  X,
  User,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Search,
  Settings,
  LayoutDashboard,
  LogOut,
  Crown
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NotificationCenter } from '@/components/NotificationCenter';
import { SettingsDialog } from '@/components/SettingsDialog';
import { HelpDialog } from '@/components/HelpDialog';
import { PrivacyLink, TermsLink, HelpLink } from '@/components/LegalDialogs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/AuthProvider';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview & Analytics', roles: ['super_admin'] }, // Hidden for now
  { path: '/farmer', label: 'Product Management', icon: Leaf, description: 'Intake & Processing', roles: ['admin'] },
  { path: '/grading', label: 'Quality Reports', icon: ClipboardCheck, description: 'Quality Control', roles: ['admin'] },
  { path: '/warehouse', label: 'Warehouse Inventory', icon: Warehouse, description: 'Inventory Management', roles: ['admin'] },
  { path: '/retailer', label: 'Retailer', icon: Store, description: 'Retail Operations', roles: ['retailer'] },
  { path: '/customer', label: 'Traceability', icon: User, description: 'Customer & Tracking', roles: ['customer'] },
  { path: '/consumer/members', label: 'Membership', icon: Crown, description: 'Join or View Status', roles: ['customer'] },
  { path: '/reports', label: 'Analytics', icon: BarChart3, description: 'Reports', roles: ['super_admin'] }, // Hidden for now
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Filter navigation items based on user role
  const userRole = profile?.role || 'customer';
  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          'hidden lg:flex flex-col fixed left-0 top-0 z-40 h-full bg-card border-r border-border transition-all duration-200 ease-in-out',
          sidebarCollapsed ? 'w-[4.5rem]' : 'w-64'
        )}
      >
        <div className="flex h-14 items-center border-b border-border px-3 gap-2">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <div className="h-9 w-9 shrink-0 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            {!sidebarCollapsed && (
              <span className="font-semibold text-foreground truncate">AgroVia</span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto shrink-0 h-8 w-8"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-2 space-y-0.5">
          <SettingsDialog>
            <Button
              variant="ghost"
              className={cn(
                'w-full flex items-center gap-3 justify-start px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground h-auto',
                sidebarCollapsed && 'justify-center px-2'
              )}
              title={sidebarCollapsed ? 'Settings' : undefined}
            >
              <Settings className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && <span>Settings</span>}
            </Button>
          </SettingsDialog>
          <HelpDialog>
            <Link
              to="#"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground',
                sidebarCollapsed && 'justify-center'
              )}
              title={sidebarCollapsed ? 'Help' : undefined}
            >
              <HelpCircle className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && <span>Help & Support</span>}
            </Link>
          </HelpDialog>
        </div>
      </aside>

      {/* Main area */}
      <div className={cn('flex-1 flex flex-col min-w-0', sidebarCollapsed ? 'lg:pl-[4.5rem]' : 'lg:pl-64')}>
        {/* Fixed Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Global search */}
          <div className="flex-1 hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products, batches, orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 rounded-lg bg-secondary/50 border-0 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <NotificationCenter />
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL || ''} alt={profile?.displayName} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {profile?.displayName?.slice(0, 2).toUpperCase() || 'US'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm">
                  <div className="font-medium">{profile?.displayName || 'User'}</div>
                  <div className="text-xs text-muted-foreground capitalize">{profile?.role || 'Guest'}</div>
                </div>
                <DropdownMenuSeparator />
                {profile?.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => logout()} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-secondary/30 py-6 px-4 sm:px-6">
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">AgroVia</span>
              <span>Supply Chain Platform</span>
            </div>
            <div className="flex gap-6">
              <PrivacyLink className="hover:text-primary transition-colors cursor-pointer" />
              <TermsLink className="hover:text-primary transition-colors cursor-pointer" />
              <HelpLink className="hover:text-primary transition-colors cursor-pointer" />
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border lg:hidden animate-in slide-in-left duration-200">
            <div className="flex h-14 items-center justify-between border-b border-border px-4">
              <span className="font-semibold">Menu</span>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="p-4 space-y-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                      isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
