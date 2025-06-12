
import { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
  Bell
} from "lucide-react";
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TherapistNotificationBell } from './TherapistNotificationBell';

const TherapistLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(true);
  
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
              .from('therapist_details')
              .select('*')
              .eq('therapist_id', user.id)
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

  // Define nav items based on user role
  const therapistNavItems = [
    { path: '/therapist/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/therapist/appointments', label: 'Appointments', icon: Calendar },
    { path: '/therapist/clients', label: 'Clients', icon: Users },
    { path: '/therapist/messages', label: 'Messages', icon: MessageCircle },
    { path: '/therapist/session-notes', label: 'Session Notes', icon: FileText },
    { path: '/therapist/earnings', label: 'Earnings', icon: DollarSign },
    { path: '/therapist/notifications', label: 'Notifications', icon: Bell },
    { path: '/therapist/onboarding', label: 'Complete Profile', icon: ClipboardList },
    { path: '/therapist/reviews', label: 'Reviews', icon: Star },
    { path: '/therapist/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/therapist/account', label: 'Account', icon: User },
    { path: '/therapist/settings', label: 'Settings', icon: Settings },
  ];

  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin/users', label: 'Manage Users', icon: Users },
    { path: '/admin/therapists', label: 'Manage Therapists', icon: UserCog },
    { path: '/admin/appointments', label: 'Appointments', icon: Calendar },
    { path: '/admin/transactions', label: 'Transactions', icon: Wallet },
    { path: '/admin/content', label: 'Content Management', icon: BookOpen },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const navItems = isAdmin ? adminNavItems : therapistNavItems;

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`bg-sidebar-background border-r border-sidebar-border transition-all duration-300 ease-in-out fixed md:static inset-y-0 left-0 z-50 ${
          isCollapsed ? 'w-20' : 'w-64'
        } md:flex flex-col ${isCollapsed ? '' : 'bg-white md:bg-sidebar-background'}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border bg-white md:bg-transparent">
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

        {/* Navigation Links */}
        <div className="flex-1 overflow-auto py-4 bg-white md:bg-transparent">
          <nav className="px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                } ${
                  !onboardingComplete && item.path !== '/therapist/onboarding'
                    ? 'opacity-50 pointer-events-none'
                    : ''
                }`}
              >
                <item.icon className="h-5 w-5" />
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-sidebar-border bg-white md:bg-transparent">
          <Button
            variant="ghost"
            className={`w-full flex items-center justify-${isCollapsed ? 'center' : 'start'} text-sidebar-foreground hover:bg-sidebar-accent/50`}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="ml-2">Log Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar with notification bell */}
        <div className="border-b px-4 py-2 flex justify-end items-center">
          <TherapistNotificationBell />
        </div>
        
        {!onboardingComplete && location.pathname !== '/therapist/onboarding' && (
          <div className="bg-yellow-100 p-4 text-yellow-800 text-center">
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
