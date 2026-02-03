import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, Zap } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem("token");
  const username = localStorage.getItem("username");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("playerName");
    setIsOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Play', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Profile', path: '/profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div className={`max-w-6xl mx-auto transition-all duration-300 ${isScrolled
          ? 'glass-card py-2 px-4'
          : 'bg-transparent py-2 px-4'
        }`} style={{ borderRadius: '9999px' }}>
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <Zap className="w-7 h-7 text-[#00ff99] group-hover:drop-shadow-[0_0_8px_rgba(0,255,153,0.8)] transition-all" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Code<span className="text-[#00ff99]">Clash</span>
            </span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ${isActive(link.path)
                    ? 'text-[#00ff99]'
                    : 'text-white/70 hover:text-white'
                  }`}
              >
                {link.name}
                {/* Hover/Active underline glow */}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#00ff99] transition-all duration-300 ${isActive(link.path)
                    ? 'w-6 shadow-[0_0_10px_rgba(0,255,153,0.8)]'
                    : 'w-0 group-hover:w-6'
                  }`} />
              </Link>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-2 px-3 py-1.5 glass-card">
                  <div className="w-7 h-7 bg-gradient-to-br from-[#00ff99] to-[#00cc7a] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-[#0a1612]" />
                  </div>
                  <span className="text-sm font-medium text-white">{username}</span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/60 hover:text-red-400 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="glow-btn text-sm"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white/80 hover:text-[#00ff99] transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-x-4 top-20 transition-all duration-300 ease-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}>
        <div className="glass-card p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(link.path)
                  ? 'bg-[#00ff99]/10 text-[#00ff99] border border-[#00ff99]/30'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-2 border-t border-white/10 mt-2">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#00ff99] to-[#00cc7a] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-[#0a1612]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{username}</p>
                    <p className="text-xs text-white/50">Online</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-2 text-sm font-medium text-red-400 bg-red-400/10 rounded-xl border border-red-400/20 hover:bg-red-400/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center glow-btn text-sm mt-2"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
