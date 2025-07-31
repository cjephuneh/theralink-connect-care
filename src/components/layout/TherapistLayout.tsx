
import { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Calendar,
  Users,
  MessageCircle,
  FileText,
  Settings,
  BarChart3,
  Menu,
  X,
  LogOut,
  User,
  FileCheck,
  Star,
  UserCog,
  Wallet,
  BookOpen,
  FileDigit,
  DollarSign,
  ClipboardList,
  Bell,
  Mail,
  Heart,
  Edit3
} from "lucide-react";
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TherapistNotificationBell } from './TherapistNotificationBell';
import { useTherapistNotifications } from '@/hooks/useTherapistNotifications';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

interface NavItem {
  path: string;
  label: string;
  icon: any;
  badge?: number;
}

const TherapistLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const [initialLoading, setInitialLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(true);
  const isMobile = useIsMobile();
  
  // Use the notification hook
  const { unreadCount } = useTherapistNotifications();

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
      setIsAdmin(profile.role === 'admin');

      // Check if the therapist has completed onboarding
      const checkOnboardingStatus = async () => {
        if (profile.role === 'therapist') {
          try {
            const { data, error } = await supabase
              .from('therapists')
              .select('*')
              .eq('id', user.id)
              .single();
            
            // If no data or empty important fields, onboarding is incomplete
            const isComplete = data && 
              data.license_number && 
              data.therapy_approaches;
            
            setOnboardingComplete(!!isComplete);
            
            // Redirect to onboarding if incomplete and not already there
            if (!isComplete && location.pathname !== '/therapist/onboarding') {
              toast({
                title: "Complete Your Profile",
                description: "Please complete your therapist profile to access all features.",
              });
              navigate('/therapist/onboarding');
            }
          } catch (error) {
            console.error('Error checking onboarding status:', error);
          }
        }
        setInitialLoading(false);
      };
      
      checkOnboardingStatus();
    }
  }, [user, profile, navigate, toast, location.pathname]);

  // Return early if still on initial loading
  if (initialLoading) {
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

  // Define nav items based on user role
  const therapistNavItems: NavItem[] = [
    { path: '/therapist/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/therapist/appointments', label: 'Appointments', icon: Calendar },
    { path: '/therapist/bookings', label: 'Bookings', icon: ClipboardList },
    { path: '/therapist/clients', label: 'Clients', icon: Users },
    { path: '/therapist/messages', label: 'Messages', icon: MessageCircle },
    { path: '/therapist/session-notes', label: 'Session Notes', icon: FileText },
    { path: '/therapist/earnings', label: 'Earnings', icon: DollarSign },
    { 
      path: '/therapist/notifications', 
      label: 'Notifications', 
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    { path: '/therapist/onboarding', label: 'Complete Profile', icon: ClipboardList },
    { path: '/therapist/reviews', label: 'Reviews', icon: Star },
    { path: '/therapist/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/therapist/account', label: 'Account', icon: User },
    { path: '/therapist/settings', label: 'Settings', icon: Settings },
  ];

  const adminNavItems: NavItem[] = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin/users', label: 'Manage Users', icon: Users },
    { path: '/admin/therapists', label: 'Manage Therapists', icon: UserCog },
    { path: '/admin/friends', label: 'Manage Friends', icon: Heart },
    { path: '/admin/appointments', label: 'Appointments', icon: Calendar },
    { path: '/admin/transactions', label: 'Transactions', icon: Wallet },
    { path: '/admin/emails', label: 'Send Emails', icon: Mail },
    { path: '/admin/feedback', label: 'Feedback', icon: MessageCircle },
    { path: '/admin/content', label: 'Content Management', icon: BookOpen },
    { path: '/admin/blogs', label: 'Blog Management', icon: Edit3 },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const navItems = isAdmin ? adminNavItems : therapistNavItems;

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const SidebarContent = () => (
    <>
      {/* Navigation Links */}
      <div className="flex-1 overflow-auto py-4">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md transition-colors relative ${
                isActive(item.path)
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              } ${
                !onboardingComplete && item.path !== '/therapist/onboarding' && !isAdmin
                  ? 'opacity-50 pointer-events-none'
                  : ''
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              {(!isCollapsed || isMobile) && (
                <>
                  <span className="ml-3">{item.label}</span>
                  {item.badge && (
                    <Badge variant="destructive" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
              {isCollapsed && !isMobile && item.badge && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center"
                >
                  {item.badge > 9 ? '9+' : item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-start text-sidebar-foreground hover:bg-sidebar-accent/50"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {(!isCollapsed || isMobile) && <span className="ml-2">Log Out</span>}
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Sidebar */}
      {isMobile ? (
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <div className="flex flex-col h-full bg-sidebar-background">
              {/* Mobile Sidebar Header */}
              <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
                <Link to={isAdmin ? "/admin/dashboard" : "/therapist/dashboard"} className="flex items-center space-x-2">
                  <div className="bg-thera-600 text-white p-1.5 rounded-md">
                    <span className="font-bold text-lg">T</span>
                  </div>
                  <span className="font-bold text-lg text-sidebar-foreground">TheraLink</span>
                </Link>
              </div>
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        /* Desktop Sidebar */
        <aside
          className={`bg-sidebar-background border-r border-sidebar-border transition-all duration-300 ease-in-out ${
            isCollapsed ? 'w-20' : 'w-64'
          } flex flex-col`}
        >
          {/* Desktop Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
            <Link to={isAdmin ? "/admin/dashboard" : "/therapist/dashboard"} className="flex items-center space-x-2">
              <div className="bg-thera-600 text-white p-1.5 rounded-md">
                <span className="font-bold text-lg">T</span>
              </div>
              {!isCollapsed && <span className="font-bold text-lg text-sidebar-foreground">TheraLink</span>}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-sidebar-foreground"
            >
              {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </Button>
          </div>
          <SidebarContent />
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar with hamburger menu for mobile */}
        <div className="border-b px-4 py-2 flex justify-between items-center">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="ml-auto">
            <TherapistNotificationBell />
          </div>
        </div>
        
        {!onboardingComplete && location.pathname !== '/therapist/onboarding' && !isAdmin && (
          <div className="bg-yellow-100 p-4 text-yellow-800 text-center text-sm">
            Please complete your profile setup before accessing other features.
          </div>
        )}
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default TherapistLayout;
