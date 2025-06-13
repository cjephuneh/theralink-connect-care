
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "./components/layout/Layout";
import ClientLayout from "./components/layout/ClientLayout";
import TherapistLayout from "./components/layout/TherapistLayout";
import FriendLayout from "./components/layout/FriendLayout";

// Import all pages
import Index from "./pages/Index";
import TherapistListing from "./pages/TherapistListing";
import FriendListing from "./pages/FriendListing";
import TherapistProfile from "./pages/TherapistProfile";
import BookingPage from "./pages/BookingPage";
import BookingPaymentPage from "./pages/BookingPaymentPage";
import BookingComplete from "./pages/BookingComplete";
import VideoChat from "./pages/VideoChat";
import ChatPage from "./pages/ChatPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import HowItWorks from "./pages/HowItWorks";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import HIPAAPage from "./pages/HIPAAPage";
import NotFound from "./pages/NotFound";
import BlogPage from "./pages/BlogPage";
import AIMatchingPage from "./pages/AIMatchingPage";
import AIMatchingResults from "./pages/AIMatchingResults";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Therapist pages
import TherapistsLandingPage from "./pages/TherapistsLandingPage";
import FriendsLandingPage from "./pages/FriendsLandingPage";

// Client pages
import ClientDashboard from "./pages/ClientDashboard";
import ClientOverview from "./pages/client/ClientOverview";
import ClientTherapists from "./pages/client/ClientTherapists";
import ClientAppointments from "./pages/client/ClientAppointments";
import ClientMessages from "./pages/client/ClientMessages";
import ClientBilling from "./pages/client/ClientBilling";
import ClientProfile from "./pages/client/ClientProfile";
import ClientNotes from "./pages/client/ClientNotes";
import ClientSettings from "./pages/client/ClientSettings";
import ClientFeedback from "./pages/client/ClientFeedback";
import ClientResources from "./pages/client/ClientResources";

// Therapist pages
import TherapistDashboard from "./pages/therapist/TherapistDashboard";
import TherapistClients from "./pages/therapist/TherapistClients";
import TherapistAppointments from "./pages/therapist/TherapistAppointments";
import TherapistMessages from "./pages/therapist/TherapistMessages";
import TherapistEarnings from "./pages/therapist/TherapistEarnings";
import TherapistReviews from "./pages/therapist/TherapistReviews";
import TherapistAnalytics from "./pages/therapist/TherapistAnalytics";
import TherapistSettings from "./pages/therapist/TherapistSettings";
import TherapistAccount from "./pages/therapist/TherapistAccount";
import TherapistNotifications from "./pages/therapist/TherapistNotifications";
import TherapistOnboarding from "./pages/therapist/TherapistOnboarding";
import TherapistDocuments from "./pages/therapist/TherapistDocuments";
import SessionNotes from "./pages/therapist/SessionNotes";

// Friend pages
import FriendDashboard from "./pages/friend/FriendDashboard";
import FriendClients from "./pages/friend/FriendClients";
import FriendNotes from "./pages/friend/FriendNotes";
import FriendOnboarding from "./pages/friend/FriendOnboarding";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes with Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="therapists" element={<TherapistListing />} />
              <Route path="friends" element={<FriendListing />} />
              <Route path="therapist/:id" element={<TherapistProfile />} />
              <Route path="booking/:therapistId" element={<BookingPage />} />
              <Route path="booking/:therapistId/payment" element={<BookingPaymentPage />} />
              <Route path="booking-complete" element={<BookingComplete />} />
              <Route path="video/:roomId" element={<VideoChat />} />
              <Route path="chat/:friendId" element={<ChatPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="how-it-works" element={<HowItWorks />} />
              <Route path="privacy" element={<PrivacyPolicyPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="hipaa" element={<HIPAAPage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="ai-matching" element={<AIMatchingPage />} />
              <Route path="ai-matching/results" element={<AIMatchingResults />} />
              
              {/* Landing pages */}
              <Route path="for-therapists" element={<TherapistsLandingPage />} />
              <Route path="for-friends" element={<FriendsLandingPage />} />
              
              {/* Auth routes */}
              <Route path="auth/login" element={<Login />} />
              <Route path="auth/register" element={<Register />} />
              <Route path="auth/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Client dashboard routes */}
            <Route path="/client" element={<ClientLayout />}>
              <Route index element={<ClientDashboard />} />
              <Route path="overview" element={<ClientOverview />} />
              <Route path="therapists" element={<ClientTherapists />} />
              <Route path="appointments" element={<ClientAppointments />} />
              <Route path="messages" element={<ClientMessages />} />
              <Route path="billing" element={<ClientBilling />} />
              <Route path="profile" element={<ClientProfile />} />
              <Route path="notes" element={<ClientNotes />} />
              <Route path="settings" element={<ClientSettings />} />
              <Route path="feedback" element={<ClientFeedback />} />
              <Route path="resources" element={<ClientResources />} />
            </Route>

            {/* Therapist dashboard routes */}
            <Route path="/therapist" element={<TherapistLayout />}>
              <Route index element={<TherapistDashboard />} />
              <Route path="dashboard" element={<TherapistDashboard />} />
              <Route path="clients" element={<TherapistClients />} />
              <Route path="appointments" element={<TherapistAppointments />} />
              <Route path="messages" element={<TherapistMessages />} />
              <Route path="earnings" element={<TherapistEarnings />} />
              <Route path="reviews" element={<TherapistReviews />} />
              <Route path="analytics" element={<TherapistAnalytics />} />
              <Route path="settings" element={<TherapistSettings />} />
              <Route path="account" element={<TherapistAccount />} />
              <Route path="notifications" element={<TherapistNotifications />} />
              <Route path="onboarding" element={<TherapistOnboarding />} />
              <Route path="documents" element={<TherapistDocuments />} />
              <Route path="notes" element={<SessionNotes />} />
            </Route>

            {/* Friend dashboard routes */}
            <Route path="/friend" element={<FriendLayout />}>
              <Route index element={<FriendDashboard />} />
              <Route path="dashboard" element={<FriendDashboard />} />
              <Route path="clients" element={<FriendClients />} />
              <Route path="notes" element={<FriendNotes />} />
              <Route path="onboarding" element={<FriendOnboarding />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
