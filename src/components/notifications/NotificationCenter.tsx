
import { useState } from 'react';
import { useNotifications } from './NotificationProvider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const { notifications, markAsRead, clearNotification, unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    
    if (notification.action) {
      navigate(notification.action);
      setOpen(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'success':
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>;
      case 'error':
        return <div className="h-2 w-2 rounded-full bg-red-500"></div>;
      case 'warning':
        return <div className="h-2 w-2 rounded-full bg-yellow-500"></div>;
      case 'payment':
        return <div className="h-2 w-2 rounded-full bg-purple-500"></div>;
      case 'appointment':
        return <div className="h-2 w-2 rounded-full bg-blue-500"></div>;
      case 'message':
        return <div className="h-2 w-2 rounded-full bg-indigo-500"></div>;
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500"></div>;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-10 w-10 rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h4 className="text-sm font-medium">Notifications</h4>
          {notifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs" 
              onClick={() => notifications.forEach(n => markAsRead(n.id))}
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center p-4">
            <p className="text-muted-foreground mb-2">No notifications yet</p>
            <p className="text-xs text-muted-foreground">
              We'll notify you when something important happens
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`
                  flex items-start gap-2 px-4 py-3 cursor-pointer border-b last:border-0
                  ${!notification.read ? 'bg-muted/50' : ''}
                  hover:bg-muted/80 transition-colors
                `}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="mt-1">
                  {getIconForType(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-medium line-clamp-1">{notification.title}</p>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                  {!notification.read && (
                    <Badge className="mt-1" variant="secondary">New</Badge>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 opacity-0 hover:opacity-100 group-hover:opacity-100" 
                  onClick={(e) => {
                    e.stopPropagation();
                    clearNotification(notification.id);
                  }}
                >
                  <span className="sr-only">Clear</span>
                  <span className="text-xs">×</span>
                </Button>
              </div>
            ))}
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}
