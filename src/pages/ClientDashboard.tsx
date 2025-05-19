
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ClientSidebar } from "@/components/layout/ClientSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

// Client Dashboard Pages
import ClientOverview from "@/pages/client/ClientOverview";
import ClientAppointments from "@/pages/client/ClientAppointments";
import ClientNotes from "@/pages/client/ClientNotes";
import ClientMessages from "@/pages/client/ClientMessages";
import ClientProfile from "@/pages/client/ClientProfile";
import ClientResources from "@/pages/client/ClientResources";
import ClientBilling from "@/pages/client/ClientBilling";

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
              <Card>
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

  // Redirect to dashboard overview if just accessing /client without a subpath
  if (location.pathname === '/dashboard' || location.pathname === '/client') {
    return <Navigate to="/client/dashboard" replace />;
  }

  return (
    <ClientSidebar>
      <main className="flex-1 overflow-auto bg-background">
        <div className="container max-w-6xl mx-auto p-6">
          <Routes>
            <Route path="/dashboard" element={<ClientOverview />} />
            <Route path="/appointments" element={<ClientAppointments />} />
            <Route path="/notes" element={<ClientNotes />} />
            <Route path="/messages" element={<ClientMessages />} />
            <Route path="/profile" element={<ClientProfile />} />
            <Route path="/resources" element={<ClientResources />} />
            <Route path="/billing" element={<ClientBilling />} />
            <Route path="/*" element={<Navigate to="/client/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </ClientSidebar>
  );
};

export default ClientDashboard;
