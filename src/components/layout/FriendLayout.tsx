import { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Users,
  MessageCircle,
  FileText,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Bell
} from "lucide-react";
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TherapistNotificationBell } from './TherapistNotificationBell';
import { useIsMobile } from "@/hooks/use-mobile";

const FriendLayout = () => {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(true);
  
  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  useEffect(() => {
    // Check if user is logged in and has the right role
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page.",
        variant: "destructive",
      });
      navigate('/auth/login');
      return;
    }

    if (profile) {
      // Check if the friend has completed onboarding
      const checkOnboardingStatus = async () => {
        if (profile.role === 'friend') {
          try {
            const { data, error } = await supabase
              .from('friend_details')
              .select('*')
              .eq('friend_id', user.id)
              .single();
            
            // If no data or empty important fields, onboarding is incomplete
            const isComplete = data && data.experience_description;
            
            setOnboardingComplete(!!isComplete);
            
            // Redirect to onboarding if incomplete and not already there
            if (!isComplete && location.pathname !== '/friend/onboarding') {
              toast({
                title: "Complete Your Profile",
                description: "Please complete your friend profile to access all features.",
              });
              navigate('/friend/onboarding');
            }
          } catch (error) {
            console.error('Error checking onboarding status:', error);
          }
        }
        setIsLoading(false);
      };
      
      checkOnboardingStatus();
    }
  }, [user, profile, navigate, toast, location.pathname]);

  // Return early if still loading
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

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

  // Only allow navigation for role=friend
  const navItems = [
    { path: '/friend/dashboard', label: 'Dashboard', icon: User },
    { path: '/friend/clients', label: 'Clients', icon: Users },
    { path: '/friend/messages', label: 'Messages', icon: MessageCircle },
    { path: '/friend/notes', label: 'Notes', icon: FileText },
    { path: '/friend/account', label: 'Account', icon: User },
    { path: '/friend/settings', label: 'Settings', icon: Settings },
  ];

  // Only show nav and routes for friends
  if (profile?.role !== "friend") {
    return (
      <div className="flex items-center justify-center h-screen text-center">
        <div className="p-8 bg-card rounded-lg border shadow-md">
          <div className="text-2xl font-bold mb-2">Access Restricted</div>
          <p className="mb-4 text-muted-foreground">
            You are not authorized to view Friend pages.<br />
            Please log in as a Friend or contact support.
          </p>
        </div>
      </div>
    );
  }

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      {(!isMobile || !isCollapsed) && (
        <aside
          className={`bg-sidebar-background border-r border-sidebar-border transition-all duration-300 ease-in-out fixed md:static inset-y-0 left-0 z-50 ${
            isCollapsed && !isMobile ? 'w-20' : 'w-64'
          } md:flex flex-col ${isMobile ? 'shadow-2xl w-64' : ''}`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
            <Link to="/friend/dashboard" className="flex items-center space-x-2">
              <div className="bg-secondary text-secondary-foreground p-1.5 rounded-md">
                <span className="font-bold text-lg">T</span>
              </div>
              {(!isCollapsed || !isMobile) && <span className="font-bold text-lg text-sidebar-foreground">TheraLink</span>}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-sidebar-foreground"
            >
              {(isCollapsed && !isMobile) ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </Button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-auto py-4">
            <nav className="px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => isMobile && setIsCollapsed(true)}
                  className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                    isActive(item.path)
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  } ${
                    !onboardingComplete && item.path !== '/friend/onboarding'
                      ? 'opacity-50 pointer-events-none'
                      : ''
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {(!isCollapsed || !isMobile) && <span className="ml-3">{item.label}</span>}
                </Link>
              ))}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className={`w-full flex items-center justify-${(isCollapsed && !isMobile) ? 'center' : 'start'} text-sidebar-foreground hover:bg-sidebar-accent/50`}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {(!isCollapsed || !isMobile) && <span className="ml-2">Log Out</span>}
            </Button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${!isMobile && (isCollapsed ? 'ml-20' : 'ml-64')}`}>
        {/* Top bar with notification bell and hamburger (only mobile) */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(false)}
              className="text-sidebar-foreground"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex-1 flex justify-end items-center">
            <TherapistNotificationBell />
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {!onboardingComplete && location.pathname !== '/friend/onboarding' && (
            <div className="bg-yellow-100 p-4 text-yellow-800 text-center mb-4 rounded-md">
              Please complete your profile setup before accessing other features.
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FriendLayout;
