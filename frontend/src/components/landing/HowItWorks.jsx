import React from 'react';
import { ListTodo, CheckCircle } from 'lucide-react';

import {
  Bot,
  Camera,
  Cpu,
  MapPinned,
  ShieldCheck,
  Navigation,
} from "lucide-react";

const STEPS = [
  {
    num: "01",
    title: "AI Civic Assistant",
    description:
      "Citizens can report issues naturally in English, Hindi, or Hinglish using our conversational AI assistant, which guides users step-by-step.",
    icon: Bot,
    color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  },
  {
    num: "02",
    title: "Smart Issue Reporting",
    description:
      "Upload images, descriptions, and location data. The platform automatically collects geospatial information for accurate reporting.",
    icon: Camera,
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  {
    num: "03",
    title: "Gemini AI Analysis",
    description:
      "Google Gemini analyzes uploaded content to generate issue category, severity level, priority score, and AI-powered summaries.",
    icon: Cpu,
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
  {
    num: "04",
    title: "GIS & Community Validation",
    description:
      "Issues are visualized on interactive maps while citizens and administrators collaborate to verify and prioritize incidents.",
    icon: MapPinned,
    color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  },
  {
    num: "05",
    title: "Administrative Review",
    description:
      "Authorities monitor analytics dashboards, manage incident status, and optimize civic response workflows.",
    icon: ShieldCheck,
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  {
    num: "06",
    title: "Smart Navigation",
    description:
      "Built-in GPS navigation, route optimization, ETA calculation, and turn-by-turn guidance help officers reach incidents faster.",
    icon: Navigation,
    color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 max-w-7xl mx-auto px-6 lg:px-8 space-y-16"
    >
      {/* Section Header */}
    <div className="text-center space-y-3">
  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
    Intelligent Civic Workflow
  </span>

  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
    How CivicAI Transforms Civic Governance
  </h2>

  <p className="text-base text-slate-500 max-w-4xl mx-auto leading-relaxed">
    From conversational issue reporting and Gemini AI analysis to GIS
    intelligence, administrative decision-making, and smart navigation,
    CivicAI streamlines the complete civic response lifecycle.
  </p>
</div>

      {/* Step Cards */}
     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
               <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${step.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-2xl font-black text-slate-200">{step.num}</span>
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="text-xl font-bold text-slate-800">{step.title}</h4>
                <p className="text-base leading-7 text-slate-500 leading-relaxed">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
