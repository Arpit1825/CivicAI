import React from 'react';
import { Camera, Cpu, ListTodo, CheckCircle } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    title: 'Report an Issue',
    description:
      'Capture a photo of a civic issue such as a pothole, water leak, garbage dump, or broken streetlight and submit it with your current location.',
    icon: Camera,
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  },
  {
    num: '02',
    title: 'Gemini Vision Analysis',
    description:
      'Google Gemini Vision automatically analyzes the uploaded image, identifies the issue category, estimates severity, and generates an AI-powered summary.',
    icon: Cpu,
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  },
  {
    num: '03',
    title: 'Community & Authority Review',
    description:
      'Citizens can support existing reports to prevent duplicates, while administrators verify and prioritize issues for resolution.',
    icon: ListTodo,
    color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  },
  {
    num: '04',
    title: 'Track Resolution',
    description:
      'Monitor issue progress from Reported to Verified, In Progress, and Resolved through real-time status updates.',
    icon: CheckCircle,
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 max-w-7xl mx-auto px-6 lg:px-8 space-y-16"
    >
      {/* Section Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
          Workflow Lifecycle
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          How CivicAI Works
        </h2>
       <p className="text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
         From reporting a civic issue to AI-powered analysis, community validation,
and administrative resolution, CivicAI streamlines the complete workflow.
        </p>
      </div>

      {/* Step Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
