import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import InteractiveMap from '../components/InteractiveMap';
import StatusBadge from '../components/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, Award, ShieldAlert, Sparkles, Filter } from 'lucide-react';

export default function MapView() {
  const { issues } = useApp();
  const navigate = useNavigate();
  
  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [filteredIssues, setFilteredIssues] = useState(issues);
  const [focusedIssue, setFocusedIssue] = useState(null);

  // Sync and Filter
  useEffect(() => {
    let result = issues;

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(i => 
        i.title.toLowerCase().includes(term) || 
        i.description.toLowerCase().includes(term)
      );
    }

    if (categoryFilter !== 'All') {
      result = result.filter(i => i.category === categoryFilter);
    }

    if (statusFilter !== 'All') {
      result = result.filter(i => i.status === statusFilter);
    }

    if (severityFilter !== 'All') {
      result = result.filter(i => i.severity === severityFilter);
    }

    setFilteredIssues(result);
  }, [issues, searchTerm, categoryFilter, statusFilter, severityFilter]);

  // Categories & Severities list for options
  const categories = [
    { value: 'All', label: 'All Categories' },
    { value: 'potholes', label: 'Potholes' },
    { value: 'water leakage', label: 'Water Leakage' },
    { value: 'garbage overflow', label: 'Garbage Overflow' },
    { value: 'drainage problems', label: 'Drainage Problems' },
    { value: 'broken streetlights', label: 'Broken Streetlights' },
    { value: 'traffic hazards', label: 'Traffic Hazards' }
  ];

  const statuses = [
    { value: 'All', label: 'All Statuses' },
    { value: 'Reported', label: 'Reported' },
    { value: 'Verified', label: 'Verified' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Resolved', label: 'Resolved' }
  ];

  const severities = [
    { value: 'All', label: 'All Severities' },
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Critical', label: 'Critical' }
  ];

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col lg:flex-row gap-6 relative">
      
      {/* Left Filter & List Sidebar */}
      <div className="w-full lg:w-80 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between overflow-hidden">
        
        {/* Upper Search Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">Map Directory</h2>
            <p className="text-xs text-slate-400">Search and filter active reports near you</p>
          </div>

          {/* Search bar */}
          <div className="relative rounded-md shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reports..."
              className="block w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Filter Options */}
          <div className="space-y-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
              <SlidersHorizontal className="h-3 w-3" /> Filters
            </div>

            <div className="grid grid-cols-1 gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="block w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-700 bg-white"
              >
                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-700 bg-white"
              >
                {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>

              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="block w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-700 bg-white"
              >
                {severities.map(sv => <option key={sv.value} value={sv.value}>{sv.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Lower Scrollable Incidents List */}
        <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-3 min-h-[150px]">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Results ({filteredIssues.length})</span>
          {filteredIssues.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching issues found.
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => setFocusedIssue(issue)}
                className={`p-3 border rounded-xl hover:border-blue-500/30 hover:bg-slate-50/50 cursor-pointer transition-all duration-200 text-left space-y-2 group select-none ${
                  focusedIssue?.id === issue.id 
                    ? 'border-blue-500 bg-blue-50/20 ring-1 ring-blue-500/10' 
                    : 'border-slate-100 bg-white'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider capitalize">
                    {issue.category.replace('-', ' ')}
                  </span>
                  <StatusBadge type="status" value={issue.status} />
                </div>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {issue.title}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-0.5">
                    <MapPin className="h-3 w-3" /> NY Metropolitan
                  </span>
                  <span className="font-semibold text-slate-600">{issue.supportCount} support</span>
                </div>
                
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/issue/${issue.id}`);
                    }}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                  {focusedIssue?.id === issue.id && (
                    <span className="text-[9px] text-blue-600 font-semibold animate-pulse flex items-center gap-0.5">
                      📍 Selected
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Right Map viewport */}
      <div className="flex-1 h-full min-h-[300px] relative z-10">
        <InteractiveMap issues={filteredIssues} focusedIssue={focusedIssue} />
      </div>

    </div>
  );
}
