import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import InteractiveMap from '../components/InteractiveMap';
import StatusBadge from '../components/StatusBadge';
import { Radar,
  ClipboardList, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  MapPin, 
  ArrowRight,
  TrendingUp,
  Award,
  Users
} from 'lucide-react';

export default function Dashboard() {
  const { issues, currentUser, getUserScore } = useApp();
  const navigate = useNavigate();
  
  const score = getUserScore();
  const isAdmin = currentUser?.role === 'admin';

  // Compute Statistics
  const total = issues.length;
  const reported = issues.filter(i => i.status === 'Reported').length;
  const verified = issues.filter(i => i.status === 'Verified').length;
  const inProgress = issues.filter(i => i.status === 'In Progress').length;
  const resolved = issues.filter(i => i.status === 'Resolved').length;

  const stats = [
    { name: 'Total Issues', value: total, icon: ClipboardList, color: 'text-slate-600 bg-slate-100' },
    { name: 'Reported', value: reported, icon: MapPin, color: 'text-amber-600 bg-amber-100' },
    { name: 'Verified', value: verified, icon: ShieldCheck, color: 'text-indigo-600 bg-indigo-100' },
    { name: 'In Progress', value: inProgress, icon: RefreshCw, color: 'text-blue-600 bg-blue-100 animate-spin-slow' },
    { name: 'Resolved', value: resolved, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-100' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-blue-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-blue-950/15">
        <div className="absolute inset-0 bg-grid-dots opacity-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 p-8 opacity-10 hidden sm:block">
          <Radar className="h-24 w-24 text-white" />
        </div>
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/20 mb-4 animate-pulse-slow">
            <Radar className="h-3.5 w-3.5" />
            CivicAI Core Activated
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome, {currentUser?.name}!</h2>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            {isAdmin 
              ? 'Analyze municipal metrics, manage community issues, verify citizen-reported incidents, and direct maintenance dispatch operations.'
              : 'Report potholes, faulty lighting, leakage, or safety hazards. Track your reports and support community improvements.'}
          </p>
          {!isAdmin && (
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/report-issue')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2 px-4 rounded-xl shadow-md transition-all duration-200"
              >
                Report New Issue
              </button>
              <button
                onClick={() => navigate('/nearby')}
                className="bg-white/10 hover:bg-white/15 text-white font-semibold text-sm py-2 px-4 rounded-xl border border-white/20 transition-all duration-200"
              >
                Interactive Map
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold text-slate-500">{stat.name}</span>
                <div className={`p-2 rounded-xl ${stat.color}`}>
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</span>
                <div className="flex items-center gap-1 mt-1 text-[10px] sm:text-xs font-semibold text-slate-400">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  <span>Real-time update</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Map & Contribution / Recent Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns (Col Span 2): Map and Table */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Map Widget */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col h-[350px] sm:h-[400px]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Local Incidents Map</h3>
                <p className="text-xs text-slate-400">Visual mapping of all active civic reports</p>
              </div>
              <button 
                onClick={() => navigate('/nearby')} 
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-all cursor-pointer"
              >
                View Nearby Issues
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex-1 min-h-0 relative">
              <InteractiveMap issues={issues} />
            </div>
          </div>

          {/* Recent Issues Table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Recent Incidents</h3>
                <p className="text-xs text-slate-400">Latest active issues reported by citizens</p>
              </div>
              <button 
                onClick={() => navigate(isAdmin ? '/admin' : '/raised')} 
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-all"
              >
                View All
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-500">
                <thead className="text-xs font-bold text-slate-400 uppercase border-b border-slate-100 bg-slate-50/50">
                  <tr>
                    <th className="py-3 px-4">Issue details</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {issues.slice(0, 5).map((issue) => (
                    <tr key={issue.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-800 max-w-[200px] truncate">
                        <div className="flex flex-col">
                          <span className="truncate block text-sm font-semibold text-slate-800">{issue.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">Reported on {issue.date}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-600 capitalize">
                        {issue.category.replace('-', ' ')}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge type="severity" value={issue.severity} />
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge type="status" value={issue.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => navigate(`/issue/${issue.id}`)}
                          className="inline-flex items-center gap-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-semibold py-1.5 px-3 rounded-lg transition-all duration-200"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side Column (Col Span 1): Score or Action Cards */}
        <div className="space-y-6">
          
          {/* Civic Contribution Card */}
          {!isAdmin ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                <Award className="h-32 w-32 text-blue-900" />
              </div>
              <div className="border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-800">Civic Contribution</h3>
                  <Award className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-xs text-slate-400">Your engagement score and badge status</p>
              </div>

              {/* Progress Panel */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
                    <Award className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{score.title}</h4>
                    <p className="text-xs text-slate-500">Level {score.level} Contributor</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Progress to next tier</span>
                    <span>{score.points} / {score.nextLevelPoints} pts</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                    <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${score.progress}%` }}></div>
                  </div>
                </div>

                {/* Score Stats grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Raised</span>
                    <span className="text-lg font-bold text-slate-800">{score.reportsCount} Issues</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Supported</span>
                    <span className="text-lg font-bold text-slate-800">{score.supportsCount} Issues</span>
                  </div>
                </div>

                {/* Score Rules explanation */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                  📢 <strong>Points Rule:</strong> Receive <strong>100</strong> startup points, <strong>50</strong> points for submitting a new issue, and <strong>15</strong> points for voting support to community issues.
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <div className="border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-800">Official Tasks</h3>
                  <ShieldCheck className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-xs text-slate-400">Queue overview and quick links</p>
              </div>

              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-amber-800">Pending Verification</p>
                    <p className="text-xs text-amber-600 mt-0.5">{reported} issues require inspection</p>
                  </div>
                  <span className="text-lg font-bold text-amber-800">{reported}</span>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-blue-800">Active Works</p>
                    <p className="text-xs text-blue-600 mt-0.5">{inProgress} construction teams dispatched</p>
                  </div>
                  <span className="text-lg font-bold text-blue-800">{inProgress}</span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-emerald-800">Completed Tickets</p>
                    <p className="text-xs text-emerald-600 mt-0.5">{resolved} issues marked resolved</p>
                  </div>
                  <span className="text-lg font-bold text-emerald-800">{resolved}</span>
                </div>

                <button
                  onClick={() => navigate('/admin')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-md mt-2"
                >
                  Open Admin Command Center
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Quick Support Guide */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-5 shadow-md relative overflow-hidden">
            <div className="absolute -right-10 -top-10 bg-white/10 w-28 h-28 rounded-full pointer-events-none"></div>
            <h3 className="font-bold text-sm">Need Assistance?</h3>
            <p className="text-xs text-blue-100 mt-1.5 leading-relaxed">
              If an issue poses an immediate safety hazard, contact local utility services directly or request priority review by upvoting the issue.
            </p>
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs font-bold">
              <span>Emergency Services</span>
              <span className="bg-white text-blue-700 py-1 px-2.5 rounded-lg">911 / 311</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
