
import { Toaster } from "@/components/ui/toaster";
import { SonnerToaster } from "@/components/ui/index";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import Layout from "@/components/layout/Layout";

// Pages
import Index from "./pages/Index";
import TherapistListing from "./pages/TherapistListing";
import TherapistProfile from "./pages/TherapistProfile";
import ChatPage from "./pages/ChatPage";
import VideoChat from "./pages/VideoChat";
import ClientDashboard from "./pages/ClientDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <SonnerToaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="therapists" element={<TherapistListing />} />
            <Route path="therapists/:id" element={<TherapistProfile />} />
            <Route path="chat/:therapistId" element={<ChatPage />} />
            <Route path="video/:therapistId" element={<VideoChat />} />
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
