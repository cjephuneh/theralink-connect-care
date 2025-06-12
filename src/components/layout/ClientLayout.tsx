
import { SidebarProvider } from "@/components/ui/sidebar";
import { ClientSidebar } from "./ClientSidebar";
import { Outlet } from "react-router-dom";

const ClientLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ClientSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container max-w-7xl mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ClientLayout;
