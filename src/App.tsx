
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import ClientLayout from "./components/layout/ClientLayout";
import TherapistLayout from "./components/layout/TherapistLayout";
import FriendLayout from "./components/layout/FriendLayout";

// Import pages
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import TherapistListing from "./pages/TherapistListing";
import FriendListing from "./pages/FriendListing";
import TherapistProfile from "./pages/TherapistProfile";
import BookingPage from "./pages/BookingPage";
import BookingComplete from "./pages/BookingComplete";
import BookingPaymentPage from "./pages/BookingPaymentPage";
import ChatPage from "./pages/ChatPage";
import VideoChat from "./pages/VideoChat";
import BlogPage from "./pages/BlogPage";
import BlogDetail from "./pages/BlogDetail";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import HowItWorks from "./pages/HowItWorks";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import HIPAAPage from "./pages/HIPAAPage";
import NotFound from "./pages/NotFound";
import AIMatchingPage from "./pages/AIMatchingPage";
import AIMatchingResults from "./pages/AIMatchingResults";
import TherapistsLandingPage from "./pages/TherapistsLandingPage";
import FriendsLandingPage from "./pages/FriendsLandingPage";
import TherapistOnboardingPage from "./pages/TherapistOnboardingPage";

// Client pages
import ClientOverview from "./pages/client/ClientOverview";
import ClientProfile from "./pages/client/ClientProfile";
import ClientAppointments from "./pages/client/ClientAppointments";
import ClientMessages from "./pages/client/ClientMessages";
import ClientTherapists from "./pages/client/ClientTherapists";
import ClientBilling from "./pages/client/ClientBilling";
import ClientResources from "./pages/client/ClientResources";
import ClientNotes from "./pages/client/ClientNotes";
import ClientSettings from "./pages/client/ClientSettings";
import ClientFeedback from "./pages/client/ClientFeedback";

// Therapist pages
import TherapistDashboard from "./pages/therapist/TherapistDashboard";
import TherapistAccount from "./pages/therapist/TherapistAccount";
import TherapistClients from "./pages/therapist/TherapistClients";
import TherapistAppointments from "./pages/therapist/TherapistAppointments";
import TherapistMessages from "./pages/therapist/TherapistMessages";
import TherapistEarnings from "./pages/therapist/TherapistEarnings";
import TherapistAnalytics from "./pages/therapist/TherapistAnalytics";
import TherapistReviews from "./pages/therapist/TherapistReviews";
import TherapistSettings from "./pages/therapist/TherapistSettings";
import TherapistDocuments from "./pages/therapist/TherapistDocuments";
import TherapistNotifications from "./pages/therapist/TherapistNotifications";
import TherapistOnboarding from "./pages/therapist/TherapistOnboarding";
import SessionNotes from "./pages/therapist/SessionNotes";

// Friend pages
import FriendDashboard from "./pages/friend/FriendDashboard";
import FriendClients from "./pages/friend/FriendClients";
import FriendMessages from "./pages/friend/FriendMessages";
import FriendNotes from "./pages/friend/FriendNotes";
import FriendBookings from "./pages/friend/FriendBookings";
import FriendAccount from "./pages/friend/FriendAccount";
import FriendSettings from "./pages/friend/FriendSettings";
import FriendOnboarding from "./pages/friend/FriendOnboarding";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTherapists from "./pages/admin/AdminTherapists";
import AdminFriends from "./pages/admin/AdminFriends";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminContent from "./pages/admin/AdminContent";
import AdminEmails from "./pages/admin/AdminEmails";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminSessionNotes from "./pages/admin/AdminSessionNotes";

import ClientDashboard from "./pages/ClientDashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<Index />} />
                  <Route path="auth/login" element={<Login />} />
                  <Route path="auth/register" element={<Register />} />
                  <Route path="auth/forgot-password" element={<ForgotPassword />} />
                  <Route path="therapists" element={<TherapistListing />} />
                  <Route path="friends" element={<FriendListing />} />
                  <Route path="therapist/:id" element={<TherapistProfile />} />
                  <Route path="booking/:id" element={<BookingPage />} />
                  <Route path="booking/complete/:therapistId/:date/:time" element={<BookingComplete />} />
                  <Route path="booking/payment/:appointmentId" element={<BookingPaymentPage />} />
                  <Route path="chat/:id" element={<ChatPage />} />
                  <Route path="video/:id" element={<VideoChat />} />
                  <Route path="blog" element={<BlogPage />} />
                  <Route path="blog/:id" element={<BlogDetail />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="how-it-works" element={<HowItWorks />} />
                  <Route path="privacy" element={<PrivacyPolicyPage />} />
                  <Route path="terms" element={<TermsPage />} />
                  <Route path="hipaa" element={<HIPAAPage />} />
                  <Route path="ai-matching" element={<AIMatchingPage />} />
                  <Route path="ai-matching/results" element={<AIMatchingResults />} />
                  <Route path="for-therapists" element={<TherapistsLandingPage />} />
                  <Route path="for-friends" element={<FriendsLandingPage />} />
                  <Route path="therapist-onboarding" element={<TherapistOnboardingPage />} />
                </Route>

                {/* Client routes */}
                <Route path="/client/*" element={<ClientLayout />}>
                  <Route index element={<ClientDashboard />} />
                  <Route path="dashboard" element={<ClientOverview />} />
                  <Route path="profile" element={<ClientProfile />} />
                  <Route path="appointments" element={<ClientAppointments />} />
                  <Route path="messages" element={<ClientMessages />} />
                  <Route path="therapists" element={<ClientTherapists />} />
                  <Route path="billing" element={<ClientBilling />} />
                  <Route path="resources" element={<ClientResources />} />
                  <Route path="notes" element={<ClientNotes />} />
                  <Route path="settings" element={<ClientSettings />} />
                  <Route path="feedback" element={<ClientFeedback />} />
                </Route>

                {/* Therapist routes */}
                <Route path="/therapist/*" element={<TherapistLayout />}>
                  <Route index element={<TherapistDashboard />} />
                  <Route path="dashboard" element={<TherapistDashboard />} />
                  <Route path="account" element={<TherapistAccount />} />
                  <Route path="clients" element={<TherapistClients />} />
                  <Route path="appointments" element={<TherapistAppointments />} />
                  <Route path="messages" element={<TherapistMessages />} />
                  <Route path="earnings" element={<TherapistEarnings />} />
                  <Route path="analytics" element={<TherapistAnalytics />} />
                  <Route path="reviews" element={<TherapistReviews />} />
                  <Route path="settings" element={<TherapistSettings />} />
                  <Route path="documents" element={<TherapistDocuments />} />
                  <Route path="notifications" element={<TherapistNotifications />} />
                  <Route path="onboarding" element={<TherapistOnboarding />} />
                  <Route path="session-notes" element={<SessionNotes />} />
                </Route>

                {/* Friend routes */}
                <Route path="/friend/*" element={<FriendLayout />}>
                  <Route index element={<FriendDashboard />} />
                  <Route path="dashboard" element={<FriendDashboard />} />
                  <Route path="clients" element={<FriendClients />} />
                  <Route path="messages" element={<FriendMessages />} />
                  <Route path="notes" element={<FriendNotes />} />
                  <Route path="bookings" element={<FriendBookings />} />
                  <Route path="account" element={<FriendAccount />} />
                  <Route path="settings" element={<FriendSettings />} />
                  <Route path="onboarding" element={<FriendOnboarding />} />
                </Route>

                {/* Admin routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/therapists" element={<AdminTherapists />} />
                <Route path="/admin/friends" element={<AdminFriends />} />
                <Route path="/admin/messages" element={<AdminMessages />} />
                <Route path="/admin/feedback" element={<AdminFeedback />} />
                <Route path="/admin/appointments" element={<AdminAppointments />} />
                <Route path="/admin/transactions" element={<AdminTransactions />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/blogs" element={<AdminBlogs />} />
                <Route path="/admin/content" element={<AdminContent />} />
                <Route path="/admin/emails" element={<AdminEmails />} />
                <Route path="/admin/notifications" element={<AdminNotifications />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/session-notes" element={<AdminSessionNotes />} />

                {/* 404 page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
