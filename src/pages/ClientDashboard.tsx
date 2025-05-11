import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import WalletManager from "@/components/wallet/WalletManager";
import { supabase } from "@/integrations/supabase/client";

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, isLoading } = useAuth();
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);

  useEffect(() => {
    // Check for tab parameter in URL
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['overview', 'appointments', 'wallet', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location]);

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

  // Fetch user's appointments
  useEffect(() => {
    if (user) {
      const fetchAppointments = async () => {
        setIsLoadingAppointments(true);
        try {
          const { data, error } = await supabase
            .from('appointments')
            .select(`
              id,
              start_time,
              end_time,
              status,
              session_type,
              therapist_id,
              profiles:therapist_id (full_name, profile_image_url)
            `)
            .eq('client_id', user.id)
            .order('start_time', { ascending: false });

          if (error) {
            throw error;
          }

          setAppointmentsData(data || []);
        } catch (error) {
          console.error('Error fetching appointments:', error);
        } finally {
          setIsLoadingAppointments(false);
        }
      };

      fetchAppointments();
    }
  }, [user]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL without refreshing the page
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('tab', value);
    window.history.pushState({}, '', newUrl);
  };

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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Client Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {profile?.full_name || 'Client'}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
                  {isLoadingAppointments ? (
                    <p>Loading appointments...</p>
                  ) : appointmentsData.length > 0 ? (
                    <div className="space-y-4">
                      {/* Display upcoming appointments */}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No upcoming appointments.</p>
                  )}
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                  {/* Quick actions */}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appointments">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Your Appointments</h2>
              {/* Appointment listing */}
            </div>
          </TabsContent>

          <TabsContent value="wallet">
            <WalletManager />
          </TabsContent>

          <TabsContent value="settings">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
              {/* Settings form */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientDashboard;
