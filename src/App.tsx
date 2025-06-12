
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Layouts
import Layout from "@/components/layout/Layout";
import TherapistLayout from "@/components/layout/TherapistLayout";
import FriendLayout from "@/components/layout/FriendLayout";
import ClientLayout from "@/components/layout/ClientLayout";

// Client Pages
import Index from "./pages/Index";
import TherapistsLandingPage from "./pages/TherapistsLandingPage";
import FriendsLandingPage from "./pages/FriendsLandingPage";
import TherapistListing from "./pages/TherapistListing";
import FriendListing from "./pages/FriendListing";
import TherapistProfile from "./pages/TherapistProfile";
import ChatPage from "./pages/ChatPage";
import VideoChat from "./pages/VideoChat";
import NotFound from "./pages/NotFound";
import BookingPage from "./pages/BookingPage";
import BookingPaymentPage from "./pages/BookingPaymentPage";
import BookingComplete from "./pages/BookingComplete";
import HowItWorks from "./pages/HowItWorks";
import ContactPage from "./pages/ContactPage";
import AIMatchingPage from "./pages/AIMatchingPage";
import AIMatchingResults from "./pages/AIMatchingResults";
import BlogPage from "./pages/BlogPage";
import AboutPage from "./pages/AboutPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import HIPAAPage from "./pages/HIPAAPage";
import TherapistOnboardingPage from "./pages/TherapistOnboardingPage";

// Client Dashboard Pages
import ClientOverview from "./pages/client/ClientOverview";
import ClientAppointments from "./pages/client/ClientAppointments";
import ClientNotes from "./pages/client/ClientNotes";
import ClientMessages from "./pages/client/ClientMessages";
import ClientProfile from "./pages/client/ClientProfile";
import ClientResources from "./pages/client/ClientResources";
import ClientBilling from "./pages/client/ClientBilling";
import ClientFeedback from "./pages/client/ClientFeedback";
import ClientTherapists from "./pages/client/ClientTherapists";
import ClientSettings from "./pages/client/ClientSettings";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AdminLogin from "./pages/admin/AdminLogin";

// Therapist Pages
import TherapistDashboard from "./pages/therapist/TherapistDashboard";
import TherapistAppointments from "./pages/therapist/TherapistAppointments";
import TherapistClients from "./pages/therapist/TherapistClients";
import TherapistMessages from "./pages/therapist/TherapistMessages";
import TherapistDocuments from "./pages/therapist/TherapistDocuments";
import TherapistAccount from "./pages/therapist/TherapistAccount";
import TherapistSettings from "./pages/therapist/TherapistSettings";
import TherapistReviews from "./pages/therapist/TherapistReviews";
import TherapistAnalytics from "./pages/therapist/TherapistAnalytics";
import SessionNotes from "./pages/therapist/SessionNotes";
import TherapistEarnings from "./pages/therapist/TherapistEarnings";
import TherapistOnboarding from "./pages/therapist/TherapistOnboarding";
import TherapistNotifications from "./pages/therapist/TherapistNotifications";

// Friend Pages
import FriendDashboard from "./pages/friend/FriendDashboard";
import FriendClients from "./pages/friend/FriendClients";
import FriendNotes from "./pages/friend/FriendNotes";
import FriendOnboarding from "./pages/friend/FriendOnboarding";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTherapists from "./pages/admin/AdminTherapists";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminContent from "./pages/admin/AdminContent";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminSessionNotes from "./pages/admin/AdminSessionNotes";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminFriends from "./pages/admin/AdminFriends";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminMessages from "./pages/admin/AdminMessages";

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
        <BrowserRouter>
          <Toaster />
          <SonnerToaster />
          <Routes>
            {/* Client Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="for-therapists" element={<TherapistsLandingPage />} />
              <Route path="for-friends" element={<FriendsLandingPage />} />
              <Route path="therapists" element={<TherapistListing />} />
              <Route path="friends" element={<FriendListing />} />
              <Route path="therapists/:id" element={<TherapistProfile />} />
              <Route path="therapists/:therapistId/book" element={<BookingPage />} />
              <Route path="payment/:appointmentId" element={<BookingPaymentPage />} />
              <Route path="booking/complete/:therapistId/:date/:time" element={<BookingComplete />} />
              <Route path="chat/:therapistId" element={<ChatPage />} />
              <Route path="video/:therapistId" element={<VideoChat />} />
              <Route path="how-it-works" element={<HowItWorks />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="ai-matching" element={<AIMatchingPage />} />
              <Route path="ai-matching/results" element={<AIMatchingResults />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="privacy" element={<PrivacyPolicyPage />} />
              <Route path="hipaa" element={<HIPAAPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Client Dashboard Routes with New Layout */}
            <Route path="/client/*" element={<ClientLayout />}>
              <Route path="dashboard" element={<ClientOverview />} />
              <Route path="appointments" element={<ClientAppointments />} />
              <Route path="therapists" element={<ClientTherapists />} />
              <Route path="messages" element={<ClientMessages />} />
              <Route path="notes" element={<ClientNotes />} />
              <Route path="resources" element={<ClientResources />} />
              <Route path="billing" element={<ClientBilling />} />
              <Route path="feedback" element={<ClientFeedback />} />
              <Route path="profile" element={<ClientProfile />} />
              <Route path="settings" element={<ClientSettings />} />
              <Route index element={<Navigate to="/client/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/client/dashboard" replace />} />
            </Route>

            {/* Legacy dashboard route - redirects to /client/dashboard */}
            <Route path="/dashboard" element={<Navigate to="/client/dashboard" replace />} />

            {/* Auth Routes */}
            <Route path="/auth">
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
            </Route>
            
            {/* Hidden Admin Login - not linked in UI */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Therapist Routes */}
            <Route path="/therapist/*" element={<TherapistLayout />}>
              <Route path="dashboard" element={<TherapistDashboard />} />
              <Route path="appointments" element={<TherapistAppointments />} />
              <Route path="clients" element={<TherapistClients />} />
              <Route path="messages" element={<TherapistMessages />} />
              <Route path="documents" element={<TherapistDocuments />} />
              <Route path="account" element={<TherapistAccount />} />
              <Route path="settings" element={<TherapistSettings />} />
              <Route path="reviews" element={<TherapistReviews />} />
              <Route path="analytics" element={<TherapistAnalytics />} />
              <Route path="session-notes" element={<SessionNotes />} />
              <Route path="earnings" element={<TherapistEarnings />} />
              <Route path="onboarding" element={<TherapistOnboarding />} />
              <Route path="notifications" element={<TherapistNotifications />} />
              <Route index element={<Navigate to="/therapist/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/therapist/dashboard" replace />} />
            </Route>

            {/* Friend Routes */}
            <Route path="/friend/*" element={<FriendLayout />}>
              <Route path="dashboard" element={<FriendDashboard />} />
              <Route path="clients" element={<FriendClients />} />
              <Route path="notes" element={<FriendNotes />} />
              <Route path="messages" element={<TherapistMessages />} />
              <Route path="notifications" element={<TherapistNotifications />} />
              <Route path="account" element={<TherapistAccount />} />
              <Route path="settings" element={<TherapistSettings />} />
              <Route path="onboarding" element={<FriendOnboarding />} />
              <Route index element={<Navigate to="/friend/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/friend/dashboard" replace />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/*" element={<TherapistLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="therapists" element={<AdminTherapists />} />
              <Route path="transactions" element={<AdminTransactions />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="feedback" element={<AdminFeedback />} />
              <Route path="session-notes" element={<AdminSessionNotes />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="friends" element={<AdminFriends />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

// Add service worker registration at the end of the App component
import { register } from './serviceWorker';

// Register the service worker
register({
  onUpdate: (registration) => {
    const waitingServiceWorker = registration.waiting;
    
    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener("statechange", (event) => {
        // @ts-ignore
        if (event.target.state === "activated") {
          window.location.reload();
        }
      });
      waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
    }
  },
});

export default App;
