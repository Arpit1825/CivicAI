import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Navbar() {
  const { currentUser } = useApp();
  const navigate = useNavigate();

  const handleCtaClick = () => {
    if (currentUser) {
      navigate(currentUser.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="bg-white/80 border-b border-slate-200/80 sticky top-0 backdrop-blur-md z-50 h-16 flex items-center px-4 sm:px-8 justify-between">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-md">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">
          Civic<span className="text-blue-600">AI</span>
        </span>
      </div>

      {/* Nav Links */}
      <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold text-slate-500">
        <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
        <a href="#features" className="hover:text-slate-900 transition-colors">Key Features</a>
        <a href="#stats" className="hover:text-slate-900 transition-colors">Community Stats</a>
      </nav>

      {/* Auth Buttons */}
      <div className="flex items-center space-x-3">
        {currentUser ? (
          <button
            onClick={handleCtaClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-lg shadow-md transition-all flex items-center gap-1"
          >
            Enter App <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-lg shadow-md transition-all"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
