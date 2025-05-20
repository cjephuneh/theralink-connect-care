
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet, Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ClientSidebar } from "@/components/layout/ClientSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const ClientDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, isLoading } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth/login');
      toast({
        title: "Authentication required",
        description: "Please log in to access your dashboard",
      });
    } else {
      // Add a small delay to prevent flickering
      const timer = setTimeout(() => {
        setPageLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [user, isLoading, navigate, toast]);

  // Check if user is a therapist and redirect if needed
  useEffect(() => {
    if (profile && profile.role === 'therapist') {
      navigate('/therapist/dashboard');
      toast({
        title: "Redirecting to therapist dashboard",
        description: "We've detected that you're a therapist",
      });
    }
  }, [profile, navigate, toast]);

  // If still loading or no user, show loading state
  if (isLoading || pageLoading || !user) {
    return (
      <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid gap-6">
              <Skeleton className="h-8 w-1/3" />
              <Card className="card-shadow">
                <CardContent className="p-0">
                  <Skeleton className="h-[400px] w-full rounded-md" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to dashboard overview if just accessing /client or /client/ without a subpath
  if (location.pathname === '/client' || location.pathname === '/client/') {
    return <Navigate to="/client/dashboard" replace />;
  }

  return (
    <ClientSidebar>
      <div className="container max-w-6xl mx-auto p-4 md:p-6 animation-fade-in">
        <Outlet />
      </div>
    </ClientSidebar>
  );
};

export default ClientDashboard;
