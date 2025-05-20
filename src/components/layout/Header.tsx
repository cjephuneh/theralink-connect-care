
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationBell } from "./NotificationBell";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const renderAuthLinks = () => {
    if (user) {
      const dashboardLink = profile?.role === 'therapist' 
        ? '/therapist/dashboard' 
        : '/client/dashboard';
        
      return (
        <div className="flex items-center gap-2">
          <NotificationBell />
          <Button variant="ghost" size="sm" asChild>
            <Link to={dashboardLink}>Dashboard</Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
        </div>
      );
    }

    return (
      <>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/auth/login">Sign In</Link>
        </Button>
        <Button size="sm" asChild>
          <Link to="/auth/register">Register</Link>
        </Button>
      </>
    );
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between px-4 h-16">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold text-primary">TherapyConnect</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Button
            variant={isActive("/") ? "secondary" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/">Home</Link>
          </Button>
          <Button
            variant={isActive("/therapists") ? "secondary" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/therapists">Find Therapists</Link>
          </Button>
          <Button
            variant={isActive("/how-it-works") ? "secondary" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/how-it-works">How It Works</Link>
          </Button>
          <Button
            variant={isActive("/for-therapists") ? "secondary" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/for-therapists">For Therapists</Link>
          </Button>
          <Button
            variant={isActive("/contact") ? "secondary" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/contact">Contact</Link>
          </Button>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          {renderAuthLinks()}
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b shadow-lg z-50 md:hidden p-4 flex flex-col space-y-2">
            <Button
              variant={isActive("/") ? "secondary" : "ghost"}
              size="sm"
              className="justify-start"
              asChild
            >
              <Link to="/">Home</Link>
            </Button>
            <Button
              variant={isActive("/therapists") ? "secondary" : "ghost"}
              size="sm"
              className="justify-start"
              asChild
            >
              <Link to="/therapists">Find Therapists</Link>
            </Button>
            <Button
              variant={isActive("/how-it-works") ? "secondary" : "ghost"}
              size="sm"
              className="justify-start"
              asChild
            >
              <Link to="/how-it-works">How It Works</Link>
            </Button>
            <Button
              variant={isActive("/for-therapists") ? "secondary" : "ghost"}
              size="sm"
              className="justify-start"
              asChild
            >
              <Link to="/for-therapists">For Therapists</Link>
            </Button>
            <Button
              variant={isActive("/contact") ? "secondary" : "ghost"}
              size="sm"
              className="justify-start"
              asChild
            >
              <Link to="/contact">Contact</Link>
            </Button>
            <div className="pt-2 border-t flex flex-col gap-2">
              {user ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-start"
                    asChild
                  >
                    <Link to={profile?.role === 'therapist' ? '/therapist/dashboard' : '/client/dashboard'}>
                      Dashboard
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-start"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="justify-start" asChild>
                    <Link to="/auth/login">Sign In</Link>
                  </Button>
                  <Button size="sm" className="justify-start" asChild>
                    <Link to="/auth/register">Register</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
