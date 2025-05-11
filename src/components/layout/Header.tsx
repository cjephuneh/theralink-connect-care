
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  User,
  MessageCircle,
  Calendar,
  Star,
  Menu,
  X,
} from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // For demo purposes, we'll assume the user is not logged in initially
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Toggle login status for demo purposes
  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
    closeMenu();
  };

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
            <Link to="/about" className="text-gray-600 hover:text-thera-600 transition-colors">
              About Us
            </Link>
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/dashboard" 
                  className="text-gray-600 hover:text-thera-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Button onClick={toggleLogin} variant="outline">
                  Log Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button onClick={toggleLogin} variant="outline">
                  Log In
                </Button>
                <Button onClick={toggleLogin} className="bg-thera-600 hover:bg-thera-700">
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
              to="/about" 
              className="block py-2 text-gray-600 hover:text-thera-600"
              onClick={closeMenu}
            >
              About Us
            </Link>
            {isLoggedIn ? (
              <>
                <Link 
                  to="/dashboard"
                  className="block py-2 text-gray-600 hover:text-thera-600"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <Button 
                  onClick={toggleLogin} 
                  variant="outline" 
                  className="w-full justify-start mt-2"
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={toggleLogin} 
                  variant="outline" 
                  className="w-full justify-start mt-2"
                >
                  Log In
                </Button>
                <Button 
                  onClick={toggleLogin}
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
