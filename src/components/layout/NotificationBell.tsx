
import { useState, useEffect } from "react";
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { markNotificationAsRead } from "@/utils/notifications";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
  action_url?: string;
  is_read: boolean;
}

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  // Fetch notifications
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          setNotifications(data);
          const unread = data.filter(n => !n.is_read).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Subscribe to new notifications
    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${user.id}` 
      }, payload => {
        setNotifications(prev => [payload.new as Notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleMarkAsRead = async (notificationId: string) => {
    if (!user) return;
    
    // Optimistic update
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );
    setUnreadCount(prev => Math.max(prev - 1, 0));
    
    await markNotificationAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    if (!user || notifications.length === 0) return;
    
    try {
      // Optimistic update
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      
      // Update in database
      await Promise.all(
        notifications
          .filter(n => !n.is_read)
          .map(n => markNotificationAsRead(n.id))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins} mins ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }
    
    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
    
    setOpen(false);
  };

  if (!user) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white"
              variant="destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-8"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {loading ? (
            <div className="p-4 space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            <div>
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 border-b last:border-0 cursor-pointer hover:bg-muted/50 ${!notification.is_read ? 'bg-primary/5' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between items-start">
                    <h5 className="font-medium text-sm">{notification.title}</h5>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(notification.created_at)}
                      </span>
                      {!notification.is_read && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                          className="text-primary hover:text-primary/80 p-1"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 px-4 text-center">
              <p className="text-muted-foreground text-sm">No notifications yet</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
