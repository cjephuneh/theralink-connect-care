
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import ClientLayout from "@/components/layout/ClientLayout";
import FriendLayout from "@/components/layout/FriendLayout";
import TherapistLayout from "@/components/layout/TherapistLayout";

// Lazy load components
const Index = lazy(() => import("@/pages/Index"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const TherapistListing = lazy(() => import("@/pages/TherapistListing"));
const TherapistProfile = lazy(() => import("@/pages/TherapistProfile"));
const BookingPage = lazy(() => import("@/pages/BookingPage"));
const BookingPaymentPage = lazy(() => import("@/pages/BookingPaymentPage"));
const BookingComplete = lazy(() => import("@/pages/BookingComplete"));
const ChatPage = lazy(() => import("@/pages/ChatPage"));
const VideoChat = lazy(() => import("@/pages/VideoChat"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const HowItWorks = lazy(() => import("@/pages/HowItWorks"));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("@/pages/TermsPage"));
const HIPAAPage = lazy(() => import("@/pages/HIPAAPage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const TherapistsLandingPage = lazy(() => import("@/pages/TherapistsLandingPage"));
const FriendsLandingPage = lazy(() => import("@/pages/FriendsLandingPage"));
const FriendListing = lazy(() => import("@/pages/FriendListing"));
const AIMatchingPage = lazy(() => import("@/pages/AIMatchingPage"));
const AIMatchingResults = lazy(() => import("@/pages/AIMatchingResults"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Client Dashboard Pages
const ClientDashboard = lazy(() => import("@/pages/ClientDashboard"));
const ClientOverview = lazy(() => import("@/pages/client/ClientOverview"));
const ClientTherapists = lazy(() => import("@/pages/client/ClientTherapists"));
const ClientAppointments = lazy(() => import("@/pages/client/ClientAppointments"));
const ClientMessages = lazy(() => import("@/pages/client/ClientMessages"));
const ClientNotes = lazy(() => import("@/pages/client/ClientNotes"));
const ClientBilling = lazy(() => import("@/pages/client/ClientBilling"));
const ClientProfile = lazy(() => import("@/pages/client/ClientProfile"));
const ClientSettings = lazy(() => import("@/pages/client/ClientSettings"));
const ClientResources = lazy(() => import("@/pages/client/ClientResources"));
const ClientFeedback = lazy(() => import("@/pages/client/ClientFeedback"));

// Friend Dashboard Pages
const FriendDashboard = lazy(() => import("@/pages/friend/FriendDashboard"));
const FriendOnboarding = lazy(() => import("@/pages/friend/FriendOnboarding"));
const FriendClients = lazy(() => import("@/pages/friend/FriendClients"));
const FriendNotes = lazy(() => import("@/pages/friend/FriendNotes"));

// Therapist Dashboard Pages
const TherapistDashboard = lazy(() => import("@/pages/therapist/TherapistDashboard"));
const TherapistOnboarding = lazy(() => import("@/pages/therapist/TherapistOnboarding"));
const TherapistAppointments = lazy(() => import("@/pages/therapist/TherapistAppointments"));
const TherapistClients = lazy(() => import("@/pages/therapist/TherapistClients"));
const TherapistMessages = lazy(() => import("@/pages/therapist/TherapistMessages"));
const SessionNotes = lazy(() => import("@/pages/therapist/SessionNotes"));
const TherapistEarnings = lazy(() => import("@/pages/therapist/TherapistEarnings"));
const TherapistReviews = lazy(() => import("@/pages/therapist/TherapistReviews"));
const TherapistAnalytics = lazy(() => import("@/pages/therapist/TherapistAnalytics"));
const TherapistNotifications = lazy(() => import("@/pages/therapist/TherapistNotifications"));
const TherapistAccount = lazy(() => import("@/pages/therapist/TherapistAccount"));
const TherapistSettings = lazy(() => import("@/pages/therapist/TherapistSettings"));

// Admin Dashboard Pages
const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("@/pages/admin/AdminUsers"));
const AdminTherapists = lazy(() => import("@/pages/admin/AdminTherapists"));
const AdminFriends = lazy(() => import("@/pages/admin/AdminFriends"));
const AdminAppointments = lazy(() => import("@/pages/admin/AdminAppointments"));
const AdminTransactions = lazy(() => import("@/pages/admin/AdminTransactions"));
const AdminContent = lazy(() => import("@/pages/admin/AdminContent"));
const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));
const AdminAnalytics = lazy(() => import("@/pages/admin/AdminAnalytics"));
const AdminFeedback = lazy(() => import("@/pages/admin/AdminFeedback"));
const AdminMessages = lazy(() => import("@/pages/admin/AdminMessages"));
const AdminNotifications = lazy(() => import("@/pages/admin/AdminNotifications"));
const AdminSessionNotes = lazy(() => import("@/pages/admin/AdminSessionNotes"));
const AdminEmails = lazy(() => import("@/pages/admin/AdminEmails"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="therapists" element={<TherapistListing />} />
                <Route path="therapist/:id" element={<TherapistProfile />} />
                <Route path="friends" element={<FriendListing />} />
                <Route path="book/:therapistId" element={<BookingPage />} />
                <Route path="book/:therapistId/payment" element={<BookingPaymentPage />} />
                <Route path="booking-complete" element={<BookingComplete />} />
                <Route path="chat/:appointmentId" element={<ChatPage />} />
                <Route path="video/:appointmentId" element={<VideoChat />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="how-it-works" element={<HowItWorks />} />
                <Route path="privacy" element={<PrivacyPolicyPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="hipaa" element={<HIPAAPage />} />
                <Route path="blog" element={<BlogPage />} />
                <Route path="for-therapists" element={<TherapistsLandingPage />} />
                <Route path="for-friends" element={<FriendsLandingPage />} />
                <Route path="ai-matching" element={<AIMatchingPage />} />
                <Route path="ai-matching-results" element={<AIMatchingResults />} />
              </Route>

              {/* Auth routes */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />

              {/* Client Dashboard */}
              <Route path="/client" element={<ClientLayout />}>
                <Route index element={<ClientDashboard />} />
                <Route path="dashboard" element={<ClientDashboard />} />
                <Route path="overview" element={<ClientOverview />} />
                <Route path="therapists" element={<ClientTherapists />} />
                <Route path="appointments" element={<ClientAppointments />} />
                <Route path="messages" element={<ClientMessages />} />
                <Route path="notes" element={<ClientNotes />} />
                <Route path="billing" element={<ClientBilling />} />
                <Route path="profile" element={<ClientProfile />} />
                <Route path="settings" element={<ClientSettings />} />
                <Route path="resources" element={<ClientResources />} />
                <Route path="feedback" element={<ClientFeedback />} />
              </Route>

              {/* Friend Dashboard */}
              <Route path="/friend" element={<FriendLayout />}>
                <Route index element={<FriendDashboard />} />
                <Route path="dashboard" element={<FriendDashboard />} />
                <Route path="onboarding" element={<FriendOnboarding />} />
                <Route path="clients" element={<FriendClients />} />
                <Route path="notes" element={<FriendNotes />} />
              </Route>

              {/* Therapist Dashboard */}
              <Route path="/therapist" element={<TherapistLayout />}>
                <Route index element={<TherapistDashboard />} />
                <Route path="dashboard" element={<TherapistDashboard />} />
                <Route path="onboarding" element={<TherapistOnboarding />} />
                <Route path="appointments" element={<TherapistAppointments />} />
                <Route path="clients" element={<TherapistClients />} />
                <Route path="messages" element={<TherapistMessages />} />
                <Route path="session-notes" element={<SessionNotes />} />
                <Route path="earnings" element={<TherapistEarnings />} />
                <Route path="reviews" element={<TherapistReviews />} />
                <Route path="analytics" element={<TherapistAnalytics />} />
                <Route path="notifications" element={<TherapistNotifications />} />
                <Route path="account" element={<TherapistAccount />} />
                <Route path="settings" element={<TherapistSettings />} />
              </Route>

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<TherapistLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="therapists" element={<AdminTherapists />} />
                <Route path="friends" element={<AdminFriends />} />
                <Route path="appointments" element={<AdminAppointments />} />
                <Route path="transactions" element={<AdminTransactions />} />
                <Route path="emails" element={<AdminEmails />} />
                <Route path="feedback" element={<AdminFeedback />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="notifications" element={<AdminNotifications />} />
                <Route path="session-notes" element={<AdminSessionNotes />} />
                <Route path="content" element={<AdminContent />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="analytics" element={<AdminAnalytics />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
