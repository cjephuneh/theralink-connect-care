
import { createContext, useContext, useEffect, useState } from 'react';
import { Notification } from '@/components/notifications/NotificationTypes';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from "@/contexts/AuthContext";
import { v4 as uuidv4 } from 'uuid';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  clearNotification: (id: string) => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  // Load notifications from Supabase when user is authenticated
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      if (data) {
        const formattedNotifications = data.map(notification => ({
          id: notification.id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          read: notification.is_read,
          createdAt: new Date(notification.created_at),
          action: notification.action_url,
        }));
        
        setNotifications(formattedNotifications);
        setUnreadCount(formattedNotifications.filter(n => !n.read).length);
      }
    };

    fetchNotifications();

    // Subscribe to realtime notifications
    const channel = supabase
      .channel('notification_changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, payload => {
        const newNotification = {
          id: payload.new.id,
          title: payload.new.title,
          message: payload.new.message,
          type: payload.new.type,
          read: payload.new.is_read,
          createdAt: new Date(payload.new.created_at),
          action: payload.new.action_url,
        };
        
        setNotifications(current => [newNotification, ...current]);
        setUnreadCount(count => count + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Add a new notification
  const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    if (!user) return;

    const newNotification = {
      id: uuidv4(),
      ...notification,
      createdAt: new Date()
    };

    // Add to local state immediately for responsiveness
    setNotifications(current => [newNotification, ...current]);
    setUnreadCount(current => current + 1);

    // Save to Supabase
    try {
      await supabase.from('notifications').insert({
        id: newNotification.id,
        user_id: user.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        is_read: false,
        action_url: notification.action || null
      });
    } catch (error) {
      console.error('Error saving notification:', error);
    }
  };

  // Mark a notification as read
  const markAsRead = async (id: string) => {
    if (!user) return;

    // Update local state
    setNotifications(current => 
      current.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    setUnreadCount(current => Math.max(0, current - 1));

    // Update in Supabase
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Clear a notification
  const clearNotification = async (id: string) => {
    if (!user) return;

    // Check if notification was unread before removing
    const wasUnread = notifications.find(n => n.id === id && !n.read);
    
    // Remove from local state
    setNotifications(current => current.filter(n => n.id !== id));
    if (wasUnread) {
      setUnreadCount(current => Math.max(0, current - 1));
    }

    // Delete from Supabase
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      addNotification, 
      markAsRead, 
      clearNotification, 
      unreadCount
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
