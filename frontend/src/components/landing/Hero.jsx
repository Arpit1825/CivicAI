import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Radar, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Hero() {
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
    <section className="relative bg-white border-b border-slate-200 py-16 sm:py-24 overflow-hidden bg-grid-dots">
      <div className="absolute inset-0 bg-radial-gradient from-blue-600/5 to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center space-y-8 relative z-10">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
          <Radar className="h-3 w-3 animate-spin-slow" />
          <span>AI-Powered Civic Issue Reporting</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Build Better Neighborhoods <br className="hidden sm:inline" />
          With{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            AI-Powered
          </span>{' '}
          Issue Reporting
        </h1>

        {/* Subtitle */}
       <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
  Transform citizen reports into actionable insights using Google Gemini Vision. Upload an image,
  detect the exact location, and let AI classNameify, prioritize, and streamline civic issue management.
</p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3.5 pt-4">
          <button
            onClick={handleCtaClick}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3 px-6 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-lg"
          >
            Launch Citizen App
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate(currentUser ? '/map' : '/login')}
            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm py-3 px-6 rounded-xl border border-slate-200 shadow-sm transition-colors"
          >
            Explore Incident Map
          </button>
        </div>

        {/* Sandbox Credentials */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 max-w-md mx-auto text-left shadow-xs">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2 text-center">
            Experience the demo feature
          </span>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2 border border-slate-100 bg-white rounded-lg">
              <p className="font-bold text-slate-700">Citizen Profile</p>
              <p className="text-slate-400 text-[10px] mt-0.5">citizen@example.com</p>
            </div>
            <div className="p-2 border border-slate-100 bg-white rounded-lg">
              <p className="font-bold text-slate-700">Gov Official</p>
              <p className="text-slate-400 text-[10px] mt-0.5">admin@civicai.gov</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
