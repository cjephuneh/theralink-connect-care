
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-thera-600 text-white p-1.5 rounded-md">
                <span className="font-bold text-lg">T</span>
              </div>
              <span className="font-bold text-xl text-thera-700">TheraLink</span>
            </Link>
            <p className="text-gray-600 text-sm mb-4">
              Connecting you with licensed therapists for a healthier mind and better tomorrow.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4 mt-4">
              <a 
                href="https://facebook.com/theralink" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-thera-600 transition-colors"
                aria-label="TheraLink on Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://twitter.com/theralink" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-thera-600 transition-colors"
                aria-label="TheraLink on Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://instagram.com/theralink" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-thera-600 transition-colors"
                aria-label="TheraLink on Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://linkedin.com/company/theralink" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-thera-600 transition-colors"
                aria-label="TheraLink on LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/therapists" className="text-gray-600 text-sm hover:text-thera-600 transition-colors">
                  Find Therapists
                </Link>
              </li>
              <li>
                <Link to="/ai-matching" className="text-gray-600 text-sm hover:text-thera-600 transition-colors">
                  AI Therapist Matching
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-600 text-sm hover:text-thera-600 transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-800 font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-gray-600 text-sm hover:text-thera-600 transition-colors">
                  Mental Health Blog
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 text-sm hover:text-thera-600 transition-colors">
                  Self-Help Resources
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 text-sm hover:text-thera-600 transition-colors">
                  Crisis Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-800 font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 text-sm hover:text-thera-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/for-therapists" className="text-gray-600 text-sm hover:text-thera-600 transition-colors">
                  For Therapists
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 text-sm hover:text-thera-600 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact information */}
        <div className="border-t border-gray-200 mt-8 pt-8 mb-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Mail size={18} className="text-gray-500 mr-2" />
              <a href="mailto:support@theralink.com" className="text-gray-600 hover:text-thera-600 transition-colors text-sm">
                support@theralink.com
              </a>
            </div>
            <div className="text-gray-600 text-sm">
              123 Therapy Lane, Mental Health City, MH 12345
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-6 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              © {currentYear} TheraLink. All rights reserved.
            </div>
            <div className="flex space-x-4">
              <Link to="/terms" className="text-gray-500 text-sm hover:text-thera-600 transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-gray-500 text-sm hover:text-thera-600 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/hipaa" className="text-gray-500 text-sm hover:text-thera-600 transition-colors">
                HIPAA Compliance
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
