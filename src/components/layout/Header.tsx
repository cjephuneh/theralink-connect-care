
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, User, MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationBell } from "./NotificationBell";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

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

  const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
  >(({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  });
  ListItem.displayName = "ListItem";

  const renderAuthLinks = () => {
    if (user) {
      const dashboardLink = profile?.role === 'therapist' 
        ? '/therapist/dashboard' 
        : '/client/overview';
        
      return (
        <div className="flex items-center gap-2">
          <NotificationBell />
          <Button variant="ghost" size="sm" asChild>
            <Link to={dashboardLink} className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Dashboard
            </Link>
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
        <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
          <Link to="/auth/register">Register</Link>
        </Button>
      </>
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">TheraLink</span>
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
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger>Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <ListItem 
                    href="/therapists" 
                    title="Find Therapists"
                  >
                    Connect with licensed professionals tailored to your needs.
                  </ListItem>
                  <ListItem 
                    href="/ai-matching" 
                    title="AI Matching"
                  >
                    Let our AI find the perfect therapist match for you.
                  </ListItem>
                  <ListItem 
                    href="/how-it-works" 
                    title="How It Works"
                  >
                    Learn about our therapy process and what to expect.
                  </ListItem>
                  <ListItem 
                    href="/for-therapists" 
                    title="For Therapists"
                  >
                    Join our network of mental health professionals.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/20 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/blog"
                      >
                        <MessageSquare className="h-6 w-6 mb-2" />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Mental Health Blog
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Expert articles and resources for your mental wellness journey.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/about" title="About Us">
                    Learn about our mission and the team behind TherapyConnect.
                  </ListItem>
                  <ListItem href="/contact" title="Contact">
                    Get in touch with our support team for assistance.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/contact">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Contact
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

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
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
            <Button
              variant={isActive("/therapists") ? "secondary" : "ghost"}
              size="sm"
              className="justify-start"
              asChild
            >
              <Link to="/therapists">
                <Search className="h-4 w-4 mr-2" />
                Find Therapists
              </Link>
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
              variant={isActive("/blog") ? "secondary" : "ghost"}
              size="sm"
              className="justify-start"
              asChild
            >
              <Link to="/blog">Blog</Link>
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
                    <Link to={profile?.role === 'therapist' ? '/therapist/dashboard' : '/client/overview'}>
                      <User className="h-4 w-4 mr-2" />
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
