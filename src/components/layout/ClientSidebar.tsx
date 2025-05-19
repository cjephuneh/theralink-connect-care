
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
            <div className="gradient-bg w-8 h-8 flex items-center justify-center rounded-md">
              <span className="font-bold text-white text-lg">T</span>
            </div>
            <span className="font-bold text-lg gradient-text">TheraLink</span>
          </Link>
        </div>
        <div className="flex justify-end p-2">
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="mt-2">
        {/* User Profile Section */}
        <div className="px-4 py-4 mx-2 mb-5 rounded-xl bg-sidebar-accent/50 border border-sidebar-border/50 shadow-sm">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src={profile?.profile_image_url} />
              <AvatarFallback className="bg-primary/10 text-primary">{profile ? getInitials(profile.full_name) : 'U'}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium truncate">{profile?.full_name || 'Client'}</p>
              <p className="text-xs text-muted-foreground truncate max-w-[140px]">{profile?.email || ''}</p>
            </div>
          </div>
        </div>
        
        {/* Modern Navigation */}
        <SidebarMenu>
          <div className="px-3 mb-2">
            <h6 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Menu</h6>
          </div>
          <div className="space-y-1.5 px-1.5">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.path)}
                  tooltip={item.label}
                  className={`
                    group transition-all duration-200 rounded-lg 
                    ${isActive(item.path) 
                      ? 'bg-primary/15 text-primary font-medium border-l-2 border-primary shadow-sm' 
                      : 'hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground hover:translate-x-1'}
                  `}
                >
                  <Link to={item.path} className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-md transition-colors 
                        ${isActive(item.path) 
                          ? 'text-primary' 
                          : 'text-muted-foreground group-hover:text-primary'}
                      `}>
                        <item.icon size={18} strokeWidth={isActive(item.path) ? 2.5 : 2} />
                      </div>
                      <span className={`text-sm ${isActive(item.path) ? 'font-medium' : ''} whitespace-nowrap`}>{item.label}</span>
                    </div>
                    {item.badge && (
                      <Badge variant={isActive(item.path) ? "default" : "secondary"} 
                        className={`
                          ml-auto text-xs px-2 py-0.5 rounded-full
                          ${isActive(item.path) 
                            ? 'bg-primary/20 text-primary border border-primary/20' 
                            : 'bg-muted text-muted-foreground'}
                        `}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </div>
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="px-2 py-2 mx-2 mb-2">
          <Button
            variant="outline"
            className="w-full justify-start rounded-lg hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-colors gap-3"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
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
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <style>
        {`
          .gradient-bg {
            background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)));
          }
          .gradient-text {
            background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            color: transparent;
          }
        `}
      </style>
    </SidebarProvider>
  );
}
