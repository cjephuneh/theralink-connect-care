
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
            <Link to="/therapists" className="text-gray-600 hover:text-thera-600 transition-colors">
              Find Therapists
            </Link>
            <Link to="/how-it-works" className="text-gray-600 hover:text-thera-600 transition-colors">
              How It Works
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-thera-600 transition-colors">
              Contact Us
            </Link>
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
              to="/how-it-works" 
              className="block py-2 text-gray-600 hover:text-thera-600"
              onClick={closeMenu}
            >
              How It Works
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
