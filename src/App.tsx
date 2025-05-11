
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import BookingComplete from "./pages/BookingComplete";
import HowItWorks from "./pages/HowItWorks";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <SonnerToaster />
      <BrowserRouter>
        <Routes>
          {/* Client Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="therapists" element={<TherapistListing />} />
            <Route path="therapists/:id" element={<TherapistProfile />} />
            <Route path="therapists/:therapistId/book" element={<BookingPage />} />
            <Route path="booking/complete/:therapistId/:date/:time" element={<BookingComplete />} />
            <Route path="chat/:therapistId" element={<ChatPage />} />
            <Route path="video/:therapistId" element={<VideoChat />} />
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="how-it-works" element={<HowItWorks />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/auth">
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Therapist Routes */}
          <Route path="/therapist" element={<TherapistLayout />}>
            <Route path="dashboard" element={<TherapistDashboard />} />
            <Route path="appointments" element={<TherapistAppointments />} />
            <Route path="clients" element={<TherapistClients />} />
            <Route path="messages" element={<TherapistMessages />} />
            <Route path="documents" element={<TherapistDocuments />} />
            <Route path="account" element={<TherapistAccount />} />
            <Route path="settings" element={<TherapistSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
