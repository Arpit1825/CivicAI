import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Map, 
  ClipboardList, 
  ThumbsUp, 
  ShieldAlert, 
  LogOut, 
  Menu, 
  X, 
  User, 
  Award,
  Sparkles
} from 'lucide-react';

export default function Layout({ children }) {
  const { currentUser, logout, getUserScore } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  if (!currentUser) return <>{children}</>;

  const score = getUserScore();
  const isAdmin = currentUser.role === 'admin';

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Report Issue', path: '/report-issue', icon: PlusCircle, highlight: true },
    { name: 'Interactive Map', path: '/nearby', icon: Map },
    { name: 'My Raised Issues', path: '/my-raised', icon: ClipboardList, hideForAdmin: true },
    { name: 'My Supported Issues', path: '/my-supported', icon: ThumbsUp, hideForAdmin: true },
    { name: 'Admin Dashboard', path: '/admin', icon: ShieldAlert, showOnlyAdmin: true },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <div class="min-h-screen bg-slate-50 flex">
      {/* Sidebar for Desktop */}
      <aside class="hidden lg:flex lg:flex-shrink-0 lg:w-64 bg-slate-900 border-r border-slate-800 flex-col text-slate-300">
        {/* Brand Logo */}
        <div class="h-16 flex items-center px-6 border-b border-slate-800">
          <Link to="/dashboard" class="flex items-center space-x-2.5">
            <div class="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/25">
              <Sparkles class="h-5 w-5 text-white" />
            </div>
            <span class="text-xl font-bold tracking-tight text-white">Civic<span class="text-blue-500">AI</span></span>
          </Link>
        </div>

        {/* Sidebar Nav Links */}
        <nav class="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            if (item.showOnlyAdmin && !isAdmin) return null;
            if (item.hideForAdmin && isAdmin) return null;

            const ActiveIcon = item.icon;
            const isItemActive = isActive(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                class={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isItemActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div class="flex items-center space-x-3">
                  <ActiveIcon class={`h-4.5 w-4.5 ${isItemActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                  <span>{item.name}</span>
                </div>
                {item.highlight && !isItemActive && (
                  <span class="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full font-semibold animate-pulse-slow">
                    New
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info (Bottom Sidebar) */}
        <div class="p-4 border-t border-slate-800 bg-slate-950/40">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3 overflow-hidden">
              <div class="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-slate-700">
                {currentUser.name[0]}
              </div>
              <div class="overflow-hidden">
                <p class="text-sm font-semibold text-white truncate">{currentUser.name}</p>
                <p class="text-xs text-slate-500 truncate">{currentUser.role === 'admin' ? 'Gov Official' : 'Citizen'}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              title="Logout" 
              class="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
            >
              <LogOut class="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-40 sticky top-0">
          <div class="flex items-center space-x-4 lg:space-x-0">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              class="lg:hidden p-2 rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <Menu class="h-5 w-5" />
            </button>

            {/* Dynamic Page Header Title */}
            <h1 class="text-lg font-bold text-slate-800 capitalize">
              {location.pathname === '/dashboard' ? 'Civic Dashboard' : location.pathname.substring(1).replace('-', ' ')}
            </h1>
          </div>

          {/* Header Right Actions */}
          <div class="flex items-center space-x-4">
            {/* Contribution Score (Header Display) */}
            {!isAdmin && (
              <div class="hidden sm:flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg px-3 py-1.5">
                <Award class="h-5 w-5 text-blue-600" />
                <div>
                  <div class="flex items-center space-x-1.5">
                    <span class="text-xs font-semibold text-slate-500">Lv.{score.level}</span>
                    <span class="text-xs font-bold text-blue-700">{score.title}</span>
                  </div>
                  <div class="w-24 bg-blue-200/50 rounded-full h-1 mt-0.5 overflow-hidden">
                    <div class="bg-blue-600 h-1 rounded-full" style={{ width: `${score.progress}%` }}></div>
                  </div>
                </div>
                <div class="text-right border-l border-blue-200 pl-3">
                  <span class="text-xs text-slate-400 block">Civic Score</span>
                  <span class="text-sm font-bold text-slate-800">{score.points} pts</span>
                </div>
              </div>
            )}

            {/* Profile Dropdown */}
            <div class="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                class="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div class="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {currentUser.name[0]}
                </div>
                <span class="hidden md:block text-sm font-medium text-slate-700">{currentUser.name}</span>
              </button>

              {profileDropdownOpen && (
                <>
                  <div 
                    onClick={() => setProfileDropdownOpen(false)} 
                    class="fixed inset-0 z-10"
                  ></div>
                  <div class="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-20">
                    <div class="px-4 py-2 border-b border-slate-100">
                      <p class="text-sm font-bold text-slate-800">{currentUser.name}</p>
                      <p class="text-xs text-slate-500 truncate">{currentUser.email}</p>
                      <span class={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 uppercase ${
                        isAdmin ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {currentUser.role === 'admin' ? 'Government Admin' : 'Citizen User'}
                      </span>
                    </div>

                    {!isAdmin && (
                      <div class="px-4 py-2 bg-slate-50 border-b border-slate-100 sm:hidden">
                        <div class="flex justify-between items-center text-xs mb-1">
                          <span class="font-bold text-slate-700">{score.title} (Lv.{score.level})</span>
                          <span class="text-blue-600 font-bold">{score.points} pts</span>
                        </div>
                        <div class="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div class="bg-blue-600 h-1.5 rounded-full" style={{ width: `${score.progress}%` }}></div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleLogout}
                      class="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors mt-1"
                    >
                      <LogOut class="h-4 w-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Main Workspace Container */}
        <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 relative">
          {children}
        </main>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)} 
          class="fixed inset-0 bg-slate-900/60 z-50 lg:hidden backdrop-blur-xs"
        ></div>
      )}

      {/* Mobile Drawer Menu */}
      <div class={`fixed top-0 bottom-0 left-0 w-72 bg-slate-900 text-slate-300 z-55 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div class="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <Link to="/dashboard" class="flex items-center space-x-2.5" onClick={() => setMobileMenuOpen(false)}>
            <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md">
              <Sparkles class="h-4 w-4 text-white" />
            </div>
            <span class="text-lg font-bold tracking-tight text-white">Civic<span class="text-blue-500">AI</span></span>
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(false)} 
            class="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <nav class="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            if (item.showOnlyAdmin && !isAdmin) return null;
            if (item.hideForAdmin && isAdmin) return null;

            const ActiveIcon = item.icon;
            const isItemActive = isActive(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                class={`flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isItemActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div class="flex items-center space-x-3">
                  <ActiveIcon class="h-5 w-5" />
                  <span>{item.name}</span>
                </div>
                {item.highlight && !isItemActive && (
                  <span class="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full font-semibold animate-pulse-slow">
                    New
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div class="p-4 border-t border-slate-800 bg-slate-950/40">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3 overflow-hidden">
              <div class="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300">
                {currentUser.name[0]}
              </div>
              <div class="overflow-hidden">
                <p class="text-sm font-semibold text-white truncate">{currentUser.name}</p>
                <p class="text-xs text-slate-500 truncate">{currentUser.email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              class="p-2 rounded-md hover:bg-slate-800 text-slate-400 hover:text-red-400"
            >
              <LogOut class="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
