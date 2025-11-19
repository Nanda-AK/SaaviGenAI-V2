// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import logo from "../assets/logo.png";

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Events', path: '/events' },
    { name: 'Articles', path: '/articles' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-xl border-b border-gray-800 shadow-lg shadow-cyan-500/5' 
          : 'bg-black/80 backdrop-blur-md border-b border-gray-800/50'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group transition-transform hover:scale-105"
          >
            <div className="relative">
              <img 
                src={logo} 
                alt="SaaviGen.AI" 
                className="h-8 w-8 md:h-10 md:w-10 object-contain transition-transform group-hover:rotate-12" 
              />
              {/* Glow effect on logo */}
              <div className="absolute inset-0 bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
            </div>
            {/* [#00d0ff] */}
            <div className="hidden sm:block">
              <div className="font-bold text-base md:text-lg flex items-center">
                <span className="text-[#00d0ff]">SaaviGen</span>
                <span className="text-red-600">.</span>
                <span className="text-white">AI</span>
              </div>
              <div className="text-[10px] md:text-xs text-gray-400 leading-tight">
                Responsible GenAI for Enterprises
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                  isActive(item.path)
                    ? 'text-cyan-400'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {item.name}
                {/* Active indicator */}
                {isActive(item.path) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full" />
                )}
              </Link>
            ))}
            
            {/* CTA Button */}
            <Link
              to="/services"
              className="ml-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold rounded-lg text-sm transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105"
            >
              Get Started
            </Link>

            {/* Admin Link (if logged in) */}
            {user && (
              <Link
                to="/admin"
                className="ml-2 px-4 py-2 bg-gray-800 text-cyan-400 font-medium rounded-lg text-sm border border-gray-700 hover:bg-gray-700 transition-all"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
            aria-label="Toggle menu"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="py-4 space-y-1 border-t border-gray-800">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'text-cyan-400 bg-cyan-500/10'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile CTA */}
            <Link
              to="/contact"
              className="block mx-4 mt-4 px-4 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold rounded-lg text-sm text-center"
            >
              Get Started
            </Link>

            {/* Mobile Admin Link */}
            {user && (
              <div className="px-4 pt-4 border-t border-gray-800 mt-4">
                <Link
                  to="/admin"
                  className="block px-4 py-3 bg-gray-800 text-cyan-400 font-medium rounded-lg text-sm text-center border border-gray-700"
                >
                  Admin Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="block w-full mt-2 px-4 py-3 bg-red-500/10 text-red-400 font-medium rounded-lg text-sm text-center border border-red-500/30 hover:bg-red-500/20"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}