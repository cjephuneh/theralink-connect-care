
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Calendar, 
  Home, 
  Users, 
  MessageSquare, 
  Settings, 
  CreditCard,
  FileText,
  Heart,
  LogOut,
  User,
  Menu
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const menuItems = [
  {
    title: "Dashboard",
    url: "/client/dashboard",
    icon: Home,
  },
  {
    title: "My Appointments",
    url: "/client/appointments",
    icon: Calendar,
  },
  {
    title: "My Bookings",
    url: "/client/bookings",
    icon: Calendar,
  },
  {
    title: "Find Therapists",
    url: "/client/therapists",
    icon: Users,
  },
  {
    title: "Messages",
    url: "/client/messages",
    icon: MessageSquare,
  },
  {
    title: "My Notes",
    url: "/client/notes",
    icon: FileText,
  },
  {
    title: "Resources",
    url: "/client/resources",
    icon: Heart,
  },
  {
    title: "Billing",
    url: "/client/billing",
    icon: CreditCard,
  },
  {
    title: "Feedback",
    url: "/client/feedback",
    icon: MessageSquare,
  },
];

const settingsItems = [
  {
    title: "Profile Settings",
    url: "/client/profile",
    icon: User,
  },
  {
    title: "Preferences",
    url: "/client/settings",
    icon: Settings,
  },
];

export function ClientSidebar() {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (url: string) => location.pathname === url;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>
              {profile?.full_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{profile?.full_name || "User"}</p>
            <p className="text-xs text-muted-foreground">Client</p>
          </div>
        </div>
      </div>
      
      {/* Main Menu */}
      <div className="flex-1 overflow-auto py-4">
        <div className="px-2 space-y-1">
          <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Main Menu
          </div>
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive(item.url)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
              onClick={() => isMobile && setIsMobileMenuOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              <span className="text-sm">{item.title}</span>
            </Link>
          ))}
        </div>

        <div className="px-2 space-y-1 mt-6">
          <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Settings
          </div>
          {settingsItems.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive(item.url)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
              onClick={() => isMobile && setIsMobileMenuOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              <span className="text-sm">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-3" />
          <span className="text-sm">Sign Out</span>
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop sidebar
  return (
    <aside className="w-64 border-r bg-background">
      <SidebarContent />
    </aside>
  );
}
