import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';
import { ThumbsUp, Calendar, CheckCircle2, MapPin, ArrowRight, Heart } from 'lucide-react';

export default function MySupportedIssues() {
  const { issues, currentUser } = useApp();
  const navigate = useNavigate();

  const userId = currentUser?.id;
  const supportedIssues = issues.filter(issue => issue.supportedBy.includes(userId));

  // Compute impact stats
  const totalSupported = supportedIssues.length;
  const resolvedCount = supportedIssues.filter(i => i.status === 'Resolved').length;
  const activeCount = totalSupported - resolvedCount;

  return (
    <div class="space-y-6">
      <div>
        <h2 class="text-xl font-bold text-slate-800">My Supported Issues</h2>
        <p class="text-xs text-slate-400">Public issues you have supported to accelerate administrative prioritization</p>
      </div>

      {/* Impact Banner Card */}
      {totalSupported > 0 && (
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div class="absolute -right-6 -bottom-6 opacity-10">
              <ThumbsUp class="w-24 h-24" />
            </div>
            <span class="text-[10px] font-bold text-blue-200 uppercase tracking-wider block">Total Endorsements</span>
            <span class="text-3xl font-extrabold tracking-tight mt-1 block">{totalSupported}</span>
            <p class="text-[11px] text-blue-100 mt-2">Upvotes contributed to community priorities</p>
          </div>

          <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Resolved Issues</span>
            <div class="flex items-baseline space-x-1.5 mt-2">
              <span class="text-3xl font-extrabold text-slate-800 tracking-tight">{resolvedCount}</span>
              <span class="text-xs text-slate-400 font-semibold">completed</span>
            </div>
            <p class="text-[11px] text-slate-500 mt-2">
              {totalSupported > 0 
                ? `${Math.round((resolvedCount / totalSupported) * 100)}% resolution success rate` 
                : '0% success rate'}
            </p>
          </div>

          <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Triage</span>
            <div class="flex items-baseline space-x-1.5 mt-2">
              <span class="text-3xl font-extrabold text-slate-800 tracking-tight">{activeCount}</span>
              <span class="text-xs text-slate-400 font-semibold">in progress</span>
            </div>
            <p class="text-[11px] text-slate-500 mt-2">Currently being tracked by municipal crews</p>
          </div>
        </div>
      )}

      {/* Grid Cards list */}
      {supportedIssues.length === 0 ? (
        <div class="bg-white border border-slate-200/80 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-xs">
          <div class="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <Heart class="h-6 w-6" />
          </div>
          <h3 class="text-base font-bold text-slate-800">No supported issues</h3>
          <p class="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
            You haven't upvoted any issues yet. Explore the Interactive Map or Dashboard to support neighbor reports and increase their prioritization score.
          </p>
          <button
            onClick={() => navigate('/')}
            class="mt-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2 px-4 rounded-xl shadow-md transition-colors"
          >
            Explore Dashboard
          </button>
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {supportedIssues.map((issue) => (
            <div key={issue.id} class="bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group">
              {/* Image Banner */}
              <div class="relative h-44 bg-slate-100 overflow-hidden">
                <img 
                  src={issue.image} 
                  alt={issue.title} 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div class="absolute top-3 left-3">
                  <StatusBadge type="status" value={issue.status} />
                </div>
                <div class="absolute top-3 right-3">
                  <StatusBadge type="severity" value={issue.severity} />
                </div>
              </div>

              {/* Contents */}
              <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div class="space-y-1.5">
                  <span class="text-[10px] font-bold text-blue-600 uppercase tracking-wider capitalize">
                    {issue.category.replace('-', ' ')}
                  </span>
                  <h3 class="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {issue.title}
                  </h3>
                  <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {issue.description}
                  </p>
                </div>

                <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-slate-400 text-xs">
                  <span class="flex items-center gap-1 font-semibold text-slate-500">
                    <MapPin class="h-3.5 w-3.5 text-slate-400" /> NY Metropolitan
                  </span>
                  <span class="flex items-center gap-1 font-semibold text-slate-700 bg-slate-50 border border-slate-100 rounded-md py-1 px-2.5">
                    <ThumbsUp class="h-3.5 w-3.5 text-blue-600 animate-bounce-slow" /> {issue.supportCount}
                  </span>
                </div>
              </div>

              {/* Action Bottom */}
              <button
                onClick={() => navigate(`/issue/${issue.id}`)}
                class="w-full bg-slate-50/50 hover:bg-blue-600 hover:text-white border-t border-slate-100 py-3 text-center text-xs font-semibold text-slate-600 flex items-center justify-center gap-1 transition-all duration-200"
              >
                Track Status & Details
                <ArrowRight class="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
