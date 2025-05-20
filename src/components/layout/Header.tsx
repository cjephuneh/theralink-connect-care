
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';

interface HeaderProps {
  toggleSidebar?: () => void;
  isMobile?: boolean;
}

export function Header({ toggleSidebar, isMobile }: HeaderProps) {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      navigate('/');
      toast({
        title: "Logged out successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToDashboard = () => {
    if (!user) return;
    
    const role = user.user_metadata?.role;
    if (role === 'therapist') {
      navigate('/therapist/dashboard');
    } else {
      navigate('/client/overview');
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center">
          {toggleSidebar && isMobile && (
            <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden" onClick={toggleSidebar}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          )}
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">MindfulMatch</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex flex-1 items-center mx-4 md:mx-6 space-x-4 lg:space-x-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/therapists" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Find Therapists
          </Link>
          <Link to="/how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            How it Works
          </Link>
          <Link to="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            About Us
          </Link>
          <Link to="/blog" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Blog
          </Link>
        </nav>
        
        <div className="flex-1 flex items-center justify-end space-x-4">
          {user ? (
            <div className="flex items-center space-x-2">
              <NotificationCenter />
              
              <Button 
                variant="outline" 
                onClick={navigateToDashboard}
              >
                Dashboard
              </Button>
              
              <Button onClick={handleSignOut} disabled={isLoading}>
                {isLoading ? "Signing out..." : "Sign Out"}
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => navigate('/auth/login')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/auth/register')}>
                Create Account
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
