import { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, X, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import {
  useNotifications,
  markNotificationAsRead,
  AppNotification
} from '@/lib/services/notificationService';
import { useAuth } from '@/components/AuthProvider';

export function NotificationCenter() {
  const { profile } = useAuth();
  const { notifications } = useNotifications(profile?.role || 'all');
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => n.priority === 'urgent' && !n.read).length;

  const typeIcons = {
    info: Info,
    warning: AlertTriangle,
    error: AlertTriangle,
    success: CheckCircle2
  };

  const typeColors = {
    info: 'text-blue-500',
    warning: 'text-warning',
    error: 'text-destructive',
    success: 'text-fresh'
  };

  const priorityColors = {
    low: 'bg-muted',
    medium: 'bg-blue-500',
    high: 'bg-warning',
    urgent: 'bg-destructive'
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'urgent':
        return notification.priority === 'urgent';
      default:
        return true;
    }
  });

  const markAsRead = useCallback((id: string) => {
    markNotificationAsRead(id);
  }, []);

  const markAllAsRead = useCallback(() => {
    notifications.forEach(n => {
      if (!n.read) markNotificationAsRead(n.id);
    });
  }, [notifications]);

  const clearAllNotifications = useCallback(() => {
    // Not implemented in service for safety, but UI needs handle
    // Maybe just mark all as read?
    notifications.forEach(n => {
      if (!n.read) markNotificationAsRead(n.id);
    });
  }, [notifications]);

  // Removed Local Dismiss/Clear for now as it affects shared DB state in this simple demo
  // const dismissNotification = ... 

  const formatTimestamp = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' || typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
    if (!(date instanceof Date) || isNaN(date.getTime())) return 'Recently';

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-xl">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
          {urgentCount > 0 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-ping" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 glass" align="end">
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">Notifications</h3>
            <Badge variant="secondary" className="text-xs">
              {notifications.length} total
            </Badge>
          </div>
          {unreadCount > 0 && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-7 px-2 text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                className="h-7 px-2 text-xs text-destructive hover:text-destructive"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 m-2 mb-0">
            <TabsTrigger value="all" className="text-xs">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="urgent" className="text-xs relative">
              Urgent ({urgentCount})
              {urgentCount > 0 && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-0">
            <div className="max-h-96 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">
                    {filter === 'all' ? 'No notifications to show' :
                      filter === 'unread' ? 'No unread notifications' :
                        'No urgent notifications'}
                  </p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {filteredNotifications
                    .sort((a, b) => {
                      // Sort by priority first, then by timestamp
                      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
                      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
                      if (priorityDiff !== 0) return priorityDiff;
                      const timeA = typeof a.timestamp === 'string' ? new Date(a.timestamp).getTime() : a.timestamp.getTime();
                      const timeB = typeof b.timestamp === 'string' ? new Date(b.timestamp).getTime() : b.timestamp.getTime();
                      return timeB - timeA;
                    })
                    .map((notification) => {
                      const Icon = typeIcons[notification.type];
                      return (
                        <Card
                          key={notification.id}
                          className={cn(
                            "cursor-pointer transition-all hover:shadow-md border-0 bg-secondary/20",
                            !notification.read && "bg-primary/5 border-l-4 border-l-primary",
                            notification.priority === 'urgent' && "ring-1 ring-destructive/50 bg-destructive/5"
                          )}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className={cn("mt-0.5", typeColors[notification.type])}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <p className={cn(
                                    "font-medium text-sm truncate",
                                    !notification.read && "font-semibold"
                                  )}>
                                    {notification.title}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={cn(
                                        "w-2 h-2 rounded-full",
                                        priorityColors[notification.priority]
                                      )}
                                      title={`${notification.priority} priority`}
                                    />
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {formatTimestamp(notification.timestamp)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}