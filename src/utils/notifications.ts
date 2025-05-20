
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface NotificationData {
  user_id: string;
  title: string;
  message: string;
  type: string;
  action_url?: string;
  is_read?: boolean;
}

export const createNotification = async (data: NotificationData) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: data.user_id,
        title: data.title,
        message: data.message,
        type: data.type,
        action_url: data.action_url,
        is_read: data.is_read || false
      });
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error creating notification:', error);
    return false;
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

export const useNotifications = () => {
  const { toast } = useToast();
  
  const showNotificationToast = (notification: NotificationData) => {
    toast({
      title: notification.title,
      description: notification.message,
      action: notification.action_url ? {
        label: "View",
        onClick: () => window.location.href = notification.action_url!,
      } : undefined,
    });
  };
  
  return { showNotificationToast };
};
