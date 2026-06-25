import React from 'react';
import {
  Cpu,
  MapPin,
  Award,
  ShieldCheck,
  Cloud,
  Map,
} from "lucide-react";

const FEATURES = [
  {
    title: "Gemini AI Vision",
    description:
      "Automatically analyzes uploaded images to identify issue category, assess severity, and generate an AI-powered summary for faster reporting.",
    icon: Cpu,
  },
  {
    title: "Real-Time Geolocation",
    description:
      "Automatically captures your current location and pinpoints nearby civic issues on an interactive map for accurate reporting.",
    icon: MapPin,
  },
  {
    title: "Community Validation",
    description:
      "Support existing reports to reduce duplicate complaints and help authorities prioritize verified community issues.",
    icon: Award,
  },
  {
    title: "Secure Image Upload",
    description:
      "Upload issue photos securely through Cloudinary, ensuring reliable image storage and fast access for authorities.",
    icon: Cloud,
  },
  {
    title: "Nearby Issue Detection",
    description:
      "Discover reported issues around your location using geospatial search, helping citizens stay informed and avoid duplicate reports.",
    icon: Map,
  },
  {
    title: "Admin Dashboard",
    description:
      "Authorities can verify reports, update issue status, monitor analytics, and efficiently manage civic complaints from a centralized dashboard.",
    icon: ShieldCheck,
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white border-y border-slate-200 py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-sans">
            Core Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Powerful Features That Transform Civic Reporting
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
           Leverage AI, geolocation, and real-time collaboration to report, track, and resolve civic issues faster than ever.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-slate-50/50 border border-slate-200/80 rounded-2xl p-6 shadow-xs flex gap-4 text-left"
              >
                <div className="h-10 w-10 bg-blue-600 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-500/10">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-slate-800">{feature.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
