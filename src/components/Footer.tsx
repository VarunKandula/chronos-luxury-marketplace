
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-luxury-navy text-white">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="text-xl font-serif mb-4">CHRONOS</h3>
            <p className="mt-4 text-sm text-gray-300">
              The premier luxury watch rental marketplace, connecting watch enthusiasts with exclusive timepieces.
            </p>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/?featured=true" className="text-gray-300 hover:text-white">
                  Featured Watches
                </Link>
              </li>
              <li>
                <Link to="/list-watch" className="text-gray-300 hover:text-white">
                  List Your Watch
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-4">Help</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="text-gray-300 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-300 hover:text-white">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-300 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-300 hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-300 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-300 hover:text-white">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-center text-sm text-gray-300">
            &copy; {new Date().getFullYear()} Chronos Luxury Watch Marketplace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
