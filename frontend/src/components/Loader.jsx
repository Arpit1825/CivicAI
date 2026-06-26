import { useEffect, useState } from "react";
import { Brain, Trophy, MapPin, BarChart3, Radar } from "lucide-react";

export default function Loader() {
  const messages = [
    "Connecting to Civic Infrastructure...",
    "Initializing Gemini AI Engine...",
    "Loading Smart Location Services...",
    "Activating Civic Reputation System...",
    "Building Analytics Dashboard...",
    "Preparing Citizen Experience..."
  ];

  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Cycle status messages
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  // Simulate progress bar percentage
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) {
          return prev + Math.floor(Math.random() * 12) + 3; // Climbs quickly
        } else if (prev < 99) {
          return prev + 1; // Creeps slowly close to 100% until loaded
        }
        return prev;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col items-center justify-center overflow-hidden">

      {/* Floating Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {Array.from({ length: 20 }).map((_, i) => {
          const delay = i * 0.5;
          const duration = 7 + (i % 5) * 2.5;
          const left = (i * 6.7) % 100;
          const size = 16 + (i % 5) * 8; // sizes range from 16px to 48px
          return (
            <div
              key={i}
              className="absolute bottom-0 border border-blue-400/35 bg-blue-500/5 rounded-full animate-float shadow-[inset_0_2px_4px_rgba(255,255,255,0.25),_0_0_8px_rgba(59,130,246,0.15)] backdrop-blur-[0.5px]"
              style={{
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
              }}
            />
          );
        })}
      </div>

      {/* Radar Sign Logo */}
      <div className="relative flex items-center justify-center w-24 h-24 mb-6">
        <div className="absolute w-24 h-24 rounded-full bg-blue-600/10 border border-blue-500/20 animate-pulse-slow"></div>
        <div className="absolute w-16 h-16 rounded-full bg-blue-600/20 animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 relative z-10">
          <Radar className="h-8 w-8 text-white animate-spin-slow" />
        </div>
      </div>

      {/* Platform Title */}
      <h1 className="text-3xl font-black text-white tracking-wide">
        Civic<span className="text-blue-500">AI</span>
      </h1>

      <p className="text-slate-400 mt-1.5 text-xs font-semibold uppercase tracking-wider">
        Smart City Portal
      </p>

      {/* Progress Bar Line */}
      <div className="mt-8 flex flex-col items-center">
        <span className="text-xs font-bold text-blue-400 tabular-nums">
          {progress}%
        </span>
        <div className="w-64 bg-slate-900 border border-slate-800 rounded-full h-1.5 mt-2 overflow-hidden relative">
          <div 
            className="bg-gradient-to-r from-blue-600 to-indigo-500 h-1.5 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Dynamic Status messages */}
      <div className="mt-8 flex items-center gap-2.5 text-slate-300">
        <Brain className="w-4 h-4 text-blue-400 animate-pulse" />
        <p className="text-xs font-medium tracking-wide">
          {messages[index]}
        </p>
      </div>

      {/* Core Features Badges */}
      <div className="mt-12 flex gap-6 text-slate-400 text-[11px] flex-wrap justify-center font-semibold">
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-yellow-500" />
          Civic Points
        </div>

        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
          Geo Tracking
        </div>

        <div className="flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
          Analytics
        </div>
      </div>

      {/* Tagline Info */}
      <div className="mt-6 text-slate-500 text-xs">
        🏅 Report • Support • Earn Points
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-8 text-[10px] text-slate-600 font-semibold tracking-wider uppercase">
        Powered by Gemini AI • Firebase • Atlas
      </div>
    </div>
  );
}