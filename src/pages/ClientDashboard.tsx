
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ClientSidebar } from "@/components/layout/ClientSidebar";

// Client Dashboard Pages
import ClientOverview from "@/pages/client/ClientOverview";
import ClientAppointments from "@/pages/client/ClientAppointments";
import ClientNotes from "@/pages/client/ClientNotes";
import ClientMessages from "@/pages/client/ClientMessages";
import ClientProfile from "@/pages/client/ClientProfile";

const ClientDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth/login');
      toast({
        title: "Authentication required",
        description: "Please log in to access your dashboard",
      });
    }
  }, [user, isLoading, navigate, toast]);

  // Check if user is a therapist and redirect if needed
  useEffect(() => {
    if (profile && profile.role === 'therapist') {
      navigate('/therapist/dashboard');
    }
  }, [profile, navigate]);

  // If still loading or no user, show loading state
  if (isLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p>Loading your dashboard...</p>
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
        <div className="container mx-auto p-6">
          <Routes>
            <Route path="/dashboard" element={<ClientOverview />} />
            <Route path="/appointments" element={<ClientAppointments />} />
            <Route path="/notes" element={<ClientNotes />} />
            <Route path="/messages" element={<ClientMessages />} />
            <Route path="/profile" element={<ClientProfile />} />
            <Route path="/*" element={<Navigate to="/client/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </ClientSidebar>
  );
};

export default ClientDashboard;
