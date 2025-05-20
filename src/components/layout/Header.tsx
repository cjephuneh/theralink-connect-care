
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  User,
  MessageCircle,
  Menu,
  X,
  LogOut,
  CreditCard,
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    closeMenu();
  };

  const isTherapist = profile?.role === 'therapist';

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <div className="bg-thera-600 text-white p-1.5 rounded-md">
              <span className="font-bold text-lg">T</span>
            </div>
            <span className="font-bold text-xl text-thera-700">TheraLink</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Find Help</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-thera-50 to-thera-100 p-6 no-underline outline-none focus:shadow-md"
                            href="/ai-matching"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium text-thera-900">
                              AI Therapist Matching
                            </div>
                            <p className="text-sm leading-tight text-thera-700">
                              Answer a few questions and let our AI find your perfect therapist match based on your needs.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <Link to="/therapists" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Browse Therapists</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Search our directory of qualified professionals
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link to="/how-it-works" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">How It Works</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Learn about our therapy process and approach
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link to="/blog" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Mental Health Blog</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Articles and resources on mental wellness
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/about" className="text-gray-600 hover:text-thera-600 transition-colors">
                    About Us
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/contact" className="text-gray-600 hover:text-thera-600 transition-colors">
                    Contact Us
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>{profile?.full_name || 'My Account'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate(isTherapist ? '/therapist/dashboard' : '/dashboard')}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(isTherapist ? '/therapist/messages' : '/messages')}>
                      <MessageCircle className="h-4 w-4 mr-2" /> Messages
                    </DropdownMenuItem>
                    {!isTherapist && (
                      <DropdownMenuItem onClick={() => navigate('/dashboard?tab=wallet')}>
                        <CreditCard className="h-4 w-4 mr-2" /> Wallet
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" /> Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button onClick={() => navigate('/auth/login')} variant="outline">
                  Log In
                </Button>
                <Button onClick={() => navigate('/auth/register')} className="bg-thera-600 hover:bg-thera-700">
                  Sign Up
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4">
          <div className="container mx-auto px-4 space-y-3">
            <Link 
              to="/therapists" 
              className="block py-2 text-gray-600 hover:text-thera-600"
              onClick={closeMenu}
            >
              Find Therapists
            </Link>
            <Link 
              to="/ai-matching" 
              className="block py-2 text-gray-600 hover:text-thera-600"
              onClick={closeMenu}
            >
              AI Therapist Matching
            </Link>
            <Link 
              to="/how-it-works" 
              className="block py-2 text-gray-600 hover:text-thera-600"
              onClick={closeMenu}
            >
              How It Works
            </Link>
            <Link 
              to="/blog" 
              className="block py-2 text-gray-600 hover:text-thera-600"
              onClick={closeMenu}
            >
              Blog
            </Link>
            <Link 
              to="/about" 
              className="block py-2 text-gray-600 hover:text-thera-600"
              onClick={closeMenu}
            >
              About Us
            </Link>
            <Link 
              to="/contact" 
              className="block py-2 text-gray-600 hover:text-thera-600"
              onClick={closeMenu}
            >
              Contact Us
            </Link>
            {user ? (
              <>
                <Link 
                  to={isTherapist ? '/therapist/dashboard' : '/dashboard'}
                  className="block py-2 text-gray-600 hover:text-thera-600"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <Link 
                  to={isTherapist ? '/therapist/messages' : '/messages'}
                  className="block py-2 text-gray-600 hover:text-thera-600"
                  onClick={closeMenu}
                >
                  Messages
                </Link>
                {!isTherapist && (
                  <Link 
                    to="/dashboard?tab=wallet"
                    className="block py-2 text-gray-600 hover:text-thera-600"
                    onClick={closeMenu}
                  >
                    Wallet
                  </Link>
                )}
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  className="w-full justify-start mt-2"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Log Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => {
                    navigate('/auth/login');
                    closeMenu();
                  }} 
                  variant="outline" 
                  className="w-full justify-start mt-2"
                >
                  Log In
                </Button>
                <Button 
                  onClick={() => {
                    navigate('/auth/register');
                    closeMenu();
                  }}
                  className="w-full justify-start mt-2 bg-thera-600 hover:bg-thera-700"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
