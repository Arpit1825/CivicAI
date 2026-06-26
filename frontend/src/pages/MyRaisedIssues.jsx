import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';
import { ThumbsUp, Calendar, AlertCircle, PlusCircle, ArrowRight } from 'lucide-react';

export default function MyRaisedIssues() {
  const { issues, currentUser } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');

  const userEmail = currentUser?.email;
  const userIssues = issues.filter(i => i.reporterEmail === userEmail);

  // Filter based on activeTab
  const filteredIssues = userIssues.filter(issue => {
    if (activeTab === 'All') return true;
    return issue.status === activeTab;
  });

  const tabs = ['All', 'Reported', 'Verified', 'In Progress', 'Resolved'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">My Raised Issues</h2>
          <p className="text-xs text-slate-400">Track the lifecycle of problems you have reported</p>
        </div>
        <button
          onClick={() => navigate('/report-issue')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-md"
        >
          <PlusCircle className="h-4 w-4" />Report Issue
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6 overflow-x-auto pb-px">
          {tabs.map((tab) => {
            const count = tab === 'All' 
              ? userIssues.length 
              : userIssues.filter(i => i.status === tab).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300'
                }`}
              >
                <span>{tab}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === tab ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Grid List */}
      {filteredIssues.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No issues found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
            {userIssues.length === 0 
              ? "You haven't reported any public issues yet. Start by creating your first civic report."
              : `You do not have any issues currently in status '${activeTab}'.`}
          </p>
          {userIssues.length === 0 && (
            <button
              onClick={() => navigate('/report')}
              className="mt-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-4 rounded-xl shadow-md transition-colors"
            >
              Report First Issue
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className="bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group">
              {/* Image Banner */}
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img 
                  src={issue.image} 
                  alt={issue.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3">
                  <StatusBadge type="status" value={issue.status} />
                </div>
                <div className="absolute top-3 right-3">
                  <StatusBadge type="severity" value={issue.severity} />
                </div>
              </div>

              {/* Contents */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider capitalize">
                    {issue.category.replace('-', ' ')}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {issue.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {issue.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-slate-400 text-xs">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {issue.date}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-700 bg-slate-50 border border-slate-100 rounded-md py-1 px-2.5">
                    <ThumbsUp className="h-3.5 w-3.5 text-blue-600" /> {issue.supportCount}
                  </span>
                </div>
              </div>

              {/* Action Bottom */}
              <button
                onClick={() => navigate(`/issue/${issue.id}`)}
                className="w-full bg-slate-50/50 hover:bg-blue-600 hover:text-white border-t border-slate-100 py-3 text-center text-xs font-semibold text-slate-600 flex items-center justify-center gap-1 transition-all duration-200"
              >
                Track Timeline & Details
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
