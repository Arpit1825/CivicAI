import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';
import { 
  ResponsiveContainer, 
  AreaChart, Area, 
  PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  SlidersHorizontal,
  X,
  FileText,
  Wrench,
  Search,
  MessageSquare
} from 'lucide-react';

const TIMELINE_DATA = [
  { month: 'Jan', reported: 14, resolved: 10 },
  { month: 'Feb', reported: 22, resolved: 18 },
  { month: 'Mar', reported: 29, resolved: 21 },
  { month: 'Apr', reported: 38, resolved: 31 },
  { month: 'May', reported: 55, resolved: 42 },
  { month: 'Jun', reported: 68, resolved: 52 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#8b5cf6', '#ef4444'];

export default function AdminDashboard() {
  const { issues, updateIssueStatus } = useApp();

  // Search & Filtering state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Drawer / Editing state
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  // Computations
  const totalCount = issues.length;
  const reportedCount = issues.filter(i => i.status === 'Reported').length;
  const verifiedCount = issues.filter(i => i.status === 'Verified').length;
  const inProgressCount = issues.filter(i => i.status === 'In Progress').length;
  const resolvedCount = issues.filter(i => i.status === 'Resolved').length;

  // Category chart counts
  const categoryCounts = {};
  issues.forEach(i => {
    categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1;
  });
  const categoryChartData = Object.keys(categoryCounts).map(cat => ({
    name: cat.replace('-', ' '),
    value: categoryCounts[cat]
  }));

  // Filtering issues list
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(search.toLowerCase()) || 
                          issue.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDrawer = (issue) => {
    setSelectedIssue(issue);
    setNewStatus(issue.status);
    setAdminNotes('');
  };

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    if (!selectedIssue) return;

    updateIssueStatus(selectedIssue.id, newStatus, adminNotes);
    setSelectedIssue(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Upper Analytics Grid summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Admin Queue</span>
            <span className="text-2xl font-black text-slate-800 mt-1 block">{reportedCount} reported</span>
          </div>
          <div className="h-11 w-11 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Inspected & Verified</span>
            <span className="text-2xl font-black text-slate-800 mt-1 block">{verifiedCount} tickets</span>
          </div>
          <div className="h-11 w-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Active Dispatches</span>
            <span className="text-2xl font-black text-slate-800 mt-1 block">{inProgressCount} in-progress</span>
          </div>
          <div className="h-11 w-11 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
            <Wrench className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Resolved Issues</span>
            <span className="text-2xl font-black text-slate-800 mt-1 block">{resolvedCount} closed</span>
          </div>
          <div className="h-11 w-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Chart 1 (AreaChart - Volume): Col span 3 */}
        <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col h-[300px]">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Incidents Performance Analysis</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TIMELINE_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area name="Reported Volume" type="monotone" dataKey="reported" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorReported)" />
                <Area name="Resolved Issues" type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2 (PieChart - Categories): Col span 2 */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col h-[300px]">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Category Distribution</h3>
          <div className="flex-1 min-h-0 relative flex items-center justify-center">
            {categoryChartData.length === 0 ? (
              <span className="text-xs text-slate-400">No category stats.</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '9px', lineHeight: '14px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Database Issue Directory Management Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 pb-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-800">Operational Directory</h3>
            <p className="text-xs text-slate-400">Triage, dispatch, and close public infrastructure tickets</p>
          </div>
          
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Search */}
            <div className="relative rounded-md shadow-xs flex-1 sm:flex-none">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Search className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="block w-full pl-8 pr-4 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 bg-slate-50/50"
              />
            </div>

            {/* Filter select */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-200 rounded-lg p-1.5 text-xs text-slate-700 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Reported">Reported</option>
              <option value="Verified">Verified</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Database grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-500">
            <thead className="text-xs font-bold text-slate-400 uppercase border-b border-slate-100 bg-slate-50/50">
              <tr>
                <th className="py-3 px-4">Title & ID</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-xs text-slate-400">
                    No tickets matching search query.
                  </td>
                </tr>
              ) : (
                filteredIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800 line-clamp-1">{issue.title}</span>
                        <span className="text-[9px] text-slate-400 font-mono">ID: {issue.id} | Date: {issue.date}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-bold text-slate-700">
                      {issue.priorityScore}%
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 capitalize">
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
                        onClick={() => handleOpenDrawer(issue)}
                        className="bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white text-[10px] font-bold py-1.5 px-3 rounded-lg transition-all"
                      >
                        Manage Status
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sidebar Edit Drawer Overlay */}
      {selectedIssue && (
        <>
          <div 
            onClick={() => setSelectedIssue(null)} 
            className="fixed inset-0 bg-slate-900/60 z-50 backdrop-blur-xs"
          ></div>
          <div className="fixed top-0 bottom-0 right-0 w-full sm:w-96 bg-white shadow-2xl border-l border-slate-200 z-55 p-6 flex flex-col justify-between transform transition-transform duration-300">
            
            {/* Upper Drawer Header */}
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="h-4.5 w-4.5 text-blue-600" /> Issue Status Panel
                </h3>
                <button 
                  onClick={() => setSelectedIssue(null)} 
                  className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Summary Issue Details */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/50 space-y-2">
                <span className="text-[9px] font-bold text-blue-600 uppercase block tracking-wider">{selectedIssue.category}</span>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-2">{selectedIssue.title}</h4>
                <p className="text-[10px] text-slate-400 font-mono">Current Status: {selectedIssue.status}</p>
              </div>

              {/* Status Update Form */}
              <form onSubmit={handleStatusSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Update Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="block w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-white"
                  >
                    <option value="Reported">Reported (Review pending)</option>
                    <option value="Verified">Verified (Inspector confirmed)</option>
                    <option value="In Progress">In Progress (Dispatch crew sent)</option>
                    <option value="Resolved">Resolved (Repair completed)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" /> Administrative log notes
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows="4"
                    placeholder="Provide details about inspector findings or maintenance team dispatch (e.g. excavation completed, new bulb installed)..."
                    className="block w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  ></textarea>
                </div>

                <div className="pt-4 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-colors"
                  >
                  Update Issue Status
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedIssue(null)}
                    className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs py-2.5 px-4 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            {/* Locked note helper */}
            <div className="text-[10px] text-slate-400 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/50">
              💡 Submitting updates automatically logs an event in the public timeline, including inspector details and timestamp.
            </div>

          </div>
        </>
      )}

    </div>
  );
}
