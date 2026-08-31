import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  QrCode, 
  ClipboardCheck, 
  Package, 
  TrendingUp, 
  Search,
  ArrowRight,
  Zap,
  Clock,
  Users,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  badge?: string;
  urgent?: boolean;
  count?: number;
  lastUsed?: Date;
  category?: 'primary' | 'secondary' | 'analytics';
}

const quickActions: QuickAction[] = [
  {
    id: 'new-batch',
    title: 'Register Batch',
    description: 'Add new harvest to system',
    icon: Plus,
    href: '/farmer',
    color: 'from-primary to-primary/80',
    badge: 'Most Used',
    category: 'primary',
    count: 24,
    lastUsed: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: 'scan-qr',
    title: 'Scan QR Code',
    description: 'Track product journey',
    icon: QrCode,
    href: '/traceability',
    color: 'from-blue-500 to-blue-600',
    category: 'primary'
  },
  {
    id: 'quality-test',
    title: 'Quality Testing',
    description: 'Grade and certify batches',
    icon: ClipboardCheck,
    href: '/grading',
    color: 'from-fresh to-fresh/80',
    urgent: true,
    category: 'primary',
    count: 7
  },
  {
    id: 'inventory',
    title: 'Warehouse',
    description: 'Manage stock levels',
    icon: Package,
    href: '/warehouse',
    color: 'from-warning to-warning/80',
    category: 'secondary',
    count: 156
  },
  {
    id: 'analytics',
    title: 'Reports',
    description: 'View insights & trends',
    icon: TrendingUp,
    href: '/reports',
    color: 'from-purple-500 to-purple-600',
    category: 'analytics'
  },
  {
    id: 'search',
    title: 'Search Batches',
    description: 'Find specific products',
    icon: Search,
    href: '/customer',
    color: 'from-gray-500 to-gray-600',
    category: 'secondary'
  },
  {
    id: 'farmers',
    title: 'Farmer Management',
    description: 'Manage farmer profiles',
    icon: Users,
    href: '/farmers',
    color: 'from-green-500 to-green-600',
    category: 'secondary',
    count: 45
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Overview and metrics',
    icon: BarChart3,
    href: '/dashboard',
    color: 'from-indigo-500 to-indigo-600',
    category: 'analytics'
  }
];

interface QuickActionsProps {
  className?: string;
  compact?: boolean;
  showCategories?: boolean;
  maxItems?: number;
  onActionClick?: (actionId: string) => void;
}

export function QuickActions({ 
  className, 
  compact = false, 
  showCategories = false,
  maxItems,
  onActionClick
}: QuickActionsProps) {
  const [recentActions, setRecentActions] = useState<string[]>([]);
  const [actionCounts, setActionCounts] = useState<Record<string, number>>({});

  // Load recent actions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('quickActions:recent');
    if (stored) {
      setRecentActions(JSON.parse(stored));
    }
    
    const counts = localStorage.getItem('quickActions:counts');
    if (counts) {
      setActionCounts(JSON.parse(counts));
    }
  }, []);

  const handleActionClick = (actionId: string) => {
    // Update recent actions
    const newRecent = [actionId, ...recentActions.filter(id => id !== actionId)].slice(0, 5);
    setRecentActions(newRecent);
    localStorage.setItem('quickActions:recent', JSON.stringify(newRecent));

    // Update click counts
    const newCounts = { ...actionCounts, [actionId]: (actionCounts[actionId] || 0) + 1 };
    setActionCounts(newCounts);
    localStorage.setItem('quickActions:counts', JSON.stringify(newCounts));

    if (onActionClick) {
      onActionClick(actionId);
    }
  };

  const formatLastUsed = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  // Sort actions by category and usage
  const sortedActions = [...quickActions]
    .sort((a, b) => {
      // Prioritize recent actions
      const aRecent = recentActions.indexOf(a.id);
      const bRecent = recentActions.indexOf(b.id);
      
      if (aRecent !== -1 && bRecent !== -1) {
        return aRecent - bRecent;
      }
      if (aRecent !== -1) return -1;
      if (bRecent !== -1) return 1;
      
      // Then by usage count
      const aCount = actionCounts[a.id] || 0;
      const bCount = actionCounts[b.id] || 0;
      if (aCount !== bCount) return bCount - aCount;
      
      // Finally by category priority
      const categoryOrder = { primary: 0, secondary: 1, analytics: 2 };
      return (categoryOrder[a.category || 'secondary'] || 1) - (categoryOrder[b.category || 'secondary'] || 1);
    })
    .slice(0, maxItems);

  if (compact) {
    return (
      <div className={cn("flex gap-2 overflow-x-auto pb-2", className)}>
        {sortedActions.slice(0, 4).map((action) => {
          const Icon = action.icon;
          const isRecent = recentActions.includes(action.id);
          
          return (
            <Link key={action.id} to={action.href} onClick={() => handleActionClick(action.id)}>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap rounded-xl hover:scale-105 transition-all relative",
                  isRecent && "ring-1 ring-primary/50 bg-primary/5"
                )}
              >
                <Icon className="h-4 w-4" />
                {action.title}
                {action.urgent && (
                  <Zap className="h-3 w-3 text-warning animate-pulse" />
                )}
                {action.count && (
                  <Badge variant="secondary" className="text-xs h-4 px-1">
                    {action.count}
                  </Badge>
                )}
                {isRecent && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                )}
              </Button>
            </Link>
          );
        })}
      </div>
    );
  }

  const groupedActions = showCategories 
    ? sortedActions.reduce((acc, action) => {
        const category = action.category || 'secondary';
        if (!acc[category]) acc[category] = [];
        acc[category].push(action);
        return acc;
      }, {} as Record<string, QuickAction[]>)
    : { all: sortedActions };

  const categoryTitles = {
    primary: 'Primary Actions',
    secondary: 'Management',
    analytics: 'Analytics & Reports'
  };

  return (
    <div className={cn("space-y-6", className)}>
      {Object.entries(groupedActions).map(([category, actions]) => (
        <div key={category}>
          {showCategories && category !== 'all' && (
            <h3 className="text-lg font-semibold mb-4 text-foreground/80">
              {categoryTitles[category as keyof typeof categoryTitles] || category}
            </h3>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {actions.map((action) => {
              const Icon = action.icon;
              const isRecent = recentActions.includes(action.id);
              const clickCount = actionCounts[action.id] || 0;
              
              return (
                <Link key={action.id} to={action.href} onClick={() => handleActionClick(action.id)}>
                  <Card className={cn(
                    "group cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border border-border bg-card overflow-hidden relative shadow-sm rounded-lg",
                    isRecent && "ring-1 ring-primary/20"
                  )}>
                    <CardContent className="p-6 relative">
                      {action.urgent && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="destructive" className="text-xs animate-pulse">
                            Urgent
                          </Badge>
                        </div>
                      )}
                      
                      {isRecent && (
                        <div className="absolute top-2 left-2">
                          <Badge variant="outline" className="text-xs bg-primary/10 border-primary/30">
                            Recent
                          </Badge>
                        </div>
                      )}
                      
                      <div className="flex items-start justify-between mb-4">
                        <div 
                          className={cn(
                            "p-3 rounded-2xl bg-gradient-to-br shadow-lg transition-transform group-hover:scale-110 relative",
                            action.color
                          )}
                        >
                          <Icon className="h-6 w-6 text-white" />
                          {action.count && (
                            <Badge 
                              variant="secondary" 
                              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                            >
                              {action.count > 99 ? '99+' : action.count}
                            </Badge>
                          )}
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {action.title}
                          </h3>
                          {action.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {action.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                        
                        {/* Usage stats */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                          {action.lastUsed && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatLastUsed(action.lastUsed)}
                            </div>
                          )}
                          {clickCount > 0 && (
                            <div className="text-xs">
                              Used {clickCount} times
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Decorative gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}