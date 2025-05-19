
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Book,
  Calendar,
  FileText,
  Home,
  LogOut,
  MessageCircle,
  User,
  CreditCard,
  BookOpen,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

export function ClientSidebarContent() {
  const location = useLocation();
  const { signOut, profile, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState(0);
  
  // Fetch unread messages count
  useEffect(() => {
    if (!user) return;
    
    const fetchUnreadCount = async () => {
      try {
        const { count, error } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('receiver_id', user.id)
          .eq('is_read', false);
          
        if (error) throw error;
        setUnreadMessages(count || 0);
      } catch (error) {
        console.error('Error fetching unread messages:', error);
      }
    };
    
    fetchUnreadCount();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `receiver_id=eq.${user.id},is_read=eq.false` 
      }, () => {
        fetchUnreadCount();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
  // Fetch upcoming appointments count
  useEffect(() => {
    if (!user) return;
    
    const fetchUpcomingAppointments = async () => {
      try {
        const { count, error } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('client_id', user.id)
          .eq('status', 'scheduled')
          .gte('start_time', new Date().toISOString());
          
        if (error) throw error;
        setUpcomingAppointments(count || 0);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    
    fetchUpcomingAppointments();
  }, [user]);
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Failed",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Client menu items
  const menuItems = [
    { icon: Home, label: "Overview", path: "/client/dashboard" },
    { 
      icon: Calendar, 
      label: "Appointments", 
      path: "/client/appointments",
      badge: upcomingAppointments > 0 ? upcomingAppointments : null
    },
    { icon: FileText, label: "Notes", path: "/client/notes" },
    { 
      icon: MessageCircle, 
      label: "Messages", 
      path: "/client/messages",
      badge: unreadMessages > 0 ? unreadMessages : null
    },
    { icon: BookOpen, label: "Resources", path: "/client/resources" },
    { icon: CreditCard, label: "Billing", path: "/client/billing" },
    { icon: User, label: "Profile", path: "/client/profile" },
  ];

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarRail />
      
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-thera-600 text-white p-1.5 rounded-md">
              <span className="font-bold text-lg">T</span>
            </div>
            <span className="font-bold text-lg">TheraLink</span>
          </Link>
        </div>
        <div className="flex justify-end p-2">
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="mt-4">
        {/* User Profile Section */}
        <div className="px-4 py-3 mb-4 border rounded-md bg-muted/20">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={profile?.profile_image_url} />
              <AvatarFallback>{profile ? getInitials(profile.full_name) : 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{profile?.full_name || 'Client'}</p>
              <p className="text-xs text-muted-foreground">{profile?.email || ''}</p>
            </div>
          </div>
        </div>
        
        {/* Main Navigation */}
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.path)}
                tooltip={item.label}
              >
                <Link to={item.path} className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <item.icon />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="px-4 py-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            <span>Log Out</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export function ClientSidebar({ children }) {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <ClientSidebarContent />
        {children}
      </div>
    </SidebarProvider>
  );
}
