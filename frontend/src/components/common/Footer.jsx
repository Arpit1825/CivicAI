import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8">
     <div className="max-w-7xl mx-auto px-6 lg:px-10">

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

    {/* Logo */}
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-white">
          Civic<span className="text-blue-500">AI</span>
        </h2>
      </div>

      <p className="text-slate-400 leading-7">
        AI-powered civic issue reporting platform using Google Gemini Vision,
        real-time geolocation and community validation to improve public
        infrastructure.
      </p>
    </div>

    {/* Quick Links */}

    <div className="text-slate-400">
      <h3 className="text-white font-semibold mb-5">
        Quick Links
      </h3>

      <div className="space-y-3">

        <a href="#how-it-works" className="block hover:text-white">
          How It Works
        </a>

        <a href="#features" className="block hover:text-white">
          Features
        </a>

        <a href="#stats" className="block hover:text-white">
          Community Stats
        </a>

        <a href="/login" className="block hover:text-white">
          Sign In
        </a>

      </div>
    </div>

    {/* Technologies */}

    <div>

      <h3 className="text-white font-semibold mb-5">
        Powered By -
      </h3>

      <div className="space-y-3 text-slate-400">

        <p>React + Vite</p>

        <p>Node.js + Express</p>

        <p>MongoDB</p>

        <p>Google Gemini Vision</p>

        <p>Cloudinary</p>

      </div>

    </div>

    {/* Developer */}

    <div className="text-slate-400">

      <h3 className="text-white font-semibold mb-5">
        Developer -
      </h3>

      <p className="text-white font-medium">
        Arpit Verma
      </p>

      <div className="mt-4 space-y-3">

        <a
          href="https://github.com/Arpit1825"
          target="_blank"
          className="block hover:text-white"
        >
          GitHub
        </a>

        <a
          href="https://www.linkedin.com/in/arpit-verma141/"
          target="_blank"
          className="block hover:text-white"
        >
          LinkedIn
        </a>

        <a
          href="https://portfolio-arpit-verma.vercel.app/"
          target="_blank"
          className="text-blue-400 hover:text-blue-300 font-medium"
        >
          Visit Developer Portfolio →
        </a>

      </div>

    </div>

  </div>

  <div className="border-t border-slate-800 mt-12 pt-6 text-center text-slate-500 text-sm">

    © 2026 CivicAI • Built with ❤️ by Arpit Verma • Powered by Google Gemini Vision

  </div>

</div>
    </footer>
  );
}
