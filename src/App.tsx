
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Layouts
import Layout from "@/components/layout/Layout";
import TherapistLayout from "@/components/layout/TherapistLayout";

// Client Pages
import Index from "./pages/Index";
import TherapistListing from "./pages/TherapistListing";
import TherapistProfile from "./pages/TherapistProfile";
import ChatPage from "./pages/ChatPage";
import VideoChat from "./pages/VideoChat";
import ClientDashboard from "./pages/ClientDashboard";
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

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

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

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTherapists from "./pages/admin/AdminTherapists";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminContent from "./pages/admin/AdminContent";

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
              <Route path="therapists" element={<TherapistListing />} />
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
              <Route path="for-therapists" element={<TherapistOnboardingPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Client Dashboard Routes */}
            <Route path="/client/*" element={<ClientDashboard />}>
              <Route path="dashboard" element={<ClientOverview />} />
              <Route path="appointments" element={<ClientAppointments />} />
              <Route path="notes" element={<ClientNotes />} />
              <Route path="messages" element={<ClientMessages />} />
              <Route path="resources" element={<ClientResources />} />
              <Route path="billing" element={<ClientBilling />} />
              <Route path="profile" element={<ClientProfile />} />
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

            {/* Admin Routes */}
            <Route path="/admin/*" element={<TherapistLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="therapists" element={<AdminTherapists />} />
              <Route path="transactions" element={<AdminTransactions />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="content" element={<AdminContent />} />
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
