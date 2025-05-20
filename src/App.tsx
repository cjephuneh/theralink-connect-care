
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import page components
import Index from '@/pages/Index';
import AboutPage from '@/pages/AboutPage';
import HowItWorks from '@/pages/HowItWorks';
import ContactPage from '@/pages/ContactPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsPage from '@/pages/TermsPage';
import HIPAAPage from '@/pages/HIPAAPage';
import TherapistListing from '@/pages/TherapistListing';
import TherapistProfile from '@/pages/TherapistProfile';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import NotFound from '@/pages/NotFound';
import BookingPage from '@/pages/BookingPage';
import BookingPaymentPage from '@/pages/BookingPaymentPage';
import BookingComplete from '@/pages/BookingComplete';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import AIMatchingPage from '@/pages/AIMatchingPage';
import AIMatchingResults from '@/pages/AIMatchingResults';
import BlogPage from '@/pages/BlogPage';
import VideoChat from '@/pages/VideoChat';
import ChatPage from '@/pages/ChatPage';
import ClientDashboard from '@/pages/ClientDashboard';
import ClientOverview from '@/pages/client/ClientOverview';
import ClientAppointments from '@/pages/client/ClientAppointments';
import ClientNotes from '@/pages/client/ClientNotes';
import ClientMessages from '@/pages/client/ClientMessages';
import ClientResources from '@/pages/client/ClientResources';
import ClientBilling from '@/pages/client/ClientBilling';
import ClientProfile from '@/pages/client/ClientProfile';
import TherapistDashboard from '@/pages/therapist/TherapistDashboard';
import TherapistOverview from '@/pages/therapist/TherapistDashboard';
import TherapistAppointments from '@/pages/therapist/TherapistAppointments';
import TherapistClients from '@/pages/therapist/TherapistClients';
import TherapistMessages from '@/pages/therapist/TherapistMessages';
import TherapistSettings from '@/pages/therapist/TherapistSettings';
import TherapistReviews from '@/pages/therapist/TherapistReviews';
import TherapistEarnings from '@/pages/therapist/TherapistEarnings';
import TherapistDocuments from '@/pages/therapist/TherapistDocuments';
import TherapistAnalytics from '@/pages/therapist/TherapistAnalytics';
import SessionNotes from '@/pages/therapist/SessionNotes';
import TherapistAccount from '@/pages/therapist/TherapistAccount';
import TherapistOnboarding from '@/pages/therapist/TherapistOnboarding';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminTherapists from '@/pages/admin/AdminTherapists';
import AdminAppointments from '@/pages/admin/AdminAppointments';
import AdminTransactions from '@/pages/admin/AdminTransactions';
import AdminContent from '@/pages/admin/AdminContent';
import TherapistOnboardingPage from '@/pages/TherapistOnboardingPage';

// Import layout components
import Layout from '@/components/layout/Layout';
import TherapistLayout from '@/components/layout/TherapistLayout';

// Authentication context
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Additional imports for notifications
import { NotificationProvider } from './components/notifications/NotificationProvider';
import { Toaster } from './components/ui/toaster';

// Pages and routes
function App() {
  // Add Google Analytics tracking (placeholder)
  useEffect(() => {
    console.log('App initialized');
  }, []);

  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
          <Toaster />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Index />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="hipaa" element={<HIPAAPage />} />
        <Route path="therapists" element={<TherapistListing />} />
        <Route path="therapists/:id" element={<TherapistProfile />} />
        <Route path="booking/:therapistId" element={<BookingPage />} />
        <Route path="booking/payment/:appointmentId" element={<BookingPaymentPage />} />
        <Route path="booking/complete/:therapistId/:date/:time" element={<BookingComplete />} />
        <Route path="chat/:therapistId" element={<ChatPage />} />
        <Route path="video/:therapistId" element={<VideoChat />} />
        <Route path="ai-matching" element={<AIMatchingPage />} />
        <Route path="ai-matching/results" element={<AIMatchingResults />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="become-therapist" element={<TherapistOnboardingPage />} />
        
        {/* Auth routes */}
        <Route path="auth/login" element={<Login />} />
        <Route path="auth/register" element={<Register />} />
        <Route path="auth/forgot-password" element={<ForgotPassword />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
      
      {/* Client Dashboard Routes */}
      <Route path="/client" element={<ClientDashboard />}>
        <Route path="overview" element={<ClientOverview />} />
        <Route path="appointments" element={<ClientAppointments />} />
        <Route path="notes" element={<ClientNotes />} />
        <Route path="messages" element={<ClientMessages />} />
        <Route path="resources" element={<ClientResources />} />
        <Route path="billing" element={<ClientBilling />} />
        <Route path="profile" element={<ClientProfile />} />
      </Route>
      
      {/* Therapist Dashboard Routes */}
      <Route path="/therapist" element={<TherapistDashboard />}>
        <Route path="dashboard" element={<TherapistOverview />} />
        <Route path="appointments" element={<TherapistAppointments />} />
        <Route path="clients" element={<TherapistClients />} />
        <Route path="messages" element={<TherapistMessages />} />
        <Route path="documents" element={<TherapistDocuments />} />
        <Route path="reviews" element={<TherapistReviews />} />
        <Route path="earnings" element={<TherapistEarnings />} />
        <Route path="settings" element={<TherapistSettings />} />
        <Route path="analytics" element={<TherapistAnalytics />} />
        <Route path="session-notes/:appointmentId" element={<SessionNotes />} />
        <Route path="account" element={<TherapistAccount />} />
        <Route path="onboarding" element={<TherapistOnboarding />} />
      </Route>
      
      {/* Admin Dashboard Routes */}
      <Route path="/admin" element={<AdminDashboard />}>
        <Route path="users" element={<AdminUsers />} />
        <Route path="therapists" element={<AdminTherapists />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="transactions" element={<AdminTransactions />} />
        <Route path="content" element={<AdminContent />} />
      </Route>
    </Routes>
  );
}

export default App;
