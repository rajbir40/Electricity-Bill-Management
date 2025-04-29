import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { authStore } from '../store/auth.store';
import { Home, Info, User, Shield, LogOut, Menu, X } from 'lucide-react';

// Function to combine class names conditionally
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const { authUser } = authStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // Define navigation with icons
  const navigation = [
    { name: 'Home', href: '/home', icon: Home, current: window.location.pathname === '/home' },
    { name: 'About us', href: '/about', icon: Info, current: window.location.pathname === '/about' },
    { name: 'Profile', href: '/profile', icon: User, current: window.location.pathname === '/profile' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">SmartBill</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors flex items-center"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          {authUser ? (
            <Link
              to="/profile"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Profile
            </Link>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login" className="px-4 py-2 rounded-lg text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors">
                Log In
              </Link>
              <Link to="/signup" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                <div className="flex items-center">
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </div>
              </Link>
            ))}
            
            {/* Logout in mobile menu */}
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                handleLogout(e);
                setMobileMenuOpen(false);
              }}
              className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              <div className="flex items-center">
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}