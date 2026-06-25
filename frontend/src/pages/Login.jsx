import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Sparkles, Mail, Lock, Shield, User, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login, signup } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    }
  };

  const handleQuickLogin = async (role) => {
    setError('');
    const email = role === 'citizen' ? 'jane@example.com' : 'admin@civicai.gov';
    const password = 'password123';
    const name = role === 'citizen' ? 'Jane Doe' : 'Admin Officer';
    
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      try {
        console.log(`Sandbox account not found on backend. Automatically registering sandbox ${role}...`);
        await signup(name, email, password, role);
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } catch (signupErr) {
        setError(signupErr.message || 'Sandbox authentication failed');
      }
    }
  };

  return (
    <div class="min-h-screen bg-slate-50 flex">
      {/* Left side: Form */}
      <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white relative z-10">
        <div class="mx-auto w-full max-w-md">
          {/* Logo */}
          <div class="flex items-center space-x-2.5 mb-8">
            <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles class="h-5 w-5 text-white" />
            </div>
            <span class="text-2xl font-bold tracking-tight text-slate-900">Civic<span class="text-blue-600">AI</span></span>
          </div>

          <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h2>
          <p class="mt-2.5 text-sm text-slate-500">
            Sign in to track, report, and collaborate on municipal development.
          </p>

          {error && (
            <div class="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} class="mt-6 space-y-4">
            <div>
              <label for="email" class="block text-sm font-semibold text-slate-700">Email Address</label>
              <div class="mt-1 relative rounded-md shadow-xs">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail class="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  class="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-semibold text-slate-700">Password</label>
              <div class="mt-1 relative rounded-md shadow-xs">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock class="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  class="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              class="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              Sign In
              <ArrowRight class="h-4 w-4" />
            </button>
          </form>

          {/* Quick Logins for Testing */}
          <div class="mt-8">
            <div class="relative flex py-2 items-center">
              <div class="flex-grow border-t border-slate-200"></div>
              <span class="flex-shrink mx-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Sandbox Quick Logins</span>
              <div class="flex-grow border-t border-slate-200"></div>
            </div>
            
            <div class="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickLogin('citizen')}
                class="flex items-center justify-center gap-2 py-2 px-3 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all text-slate-700"
              >
                <User class="h-4 w-4 text-slate-500" />
                <div class="text-left">
                  <p class="text-xs font-bold">Citizen Portal</p>
                  <p class="text-[9px] text-slate-400">jane@example.com</p>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                class="flex items-center justify-center gap-2 py-2 px-3 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all text-slate-700"
              >
                <Shield class="h-4 w-4 text-slate-500" />
                <div class="text-left">
                  <p class="text-xs font-bold">Gov Panel</p>
                  <p class="text-[9px] text-slate-400">admin@civicai.gov</p>
                </div>
              </button>
            </div>
          </div>

          <p class="mt-8 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" class="font-bold text-blue-600 hover:text-blue-500">
              Create a free account
            </Link>
          </p>
        </div>
      </div>

      {/* Right side: SaaS Graphic Decoration Panel */}
      <div class="hidden lg:flex lg:flex-1 bg-slate-900 items-center justify-center p-12 relative overflow-hidden bg-grid-dots">
        <div class="absolute inset-0 bg-radial-gradient from-blue-600/20 to-transparent pointer-events-none"></div>
        <div class="max-w-md text-center text-white relative z-10">
          <div class="inline-flex p-3 rounded-full bg-blue-600/10 border border-blue-500/20 mb-6">
            <Sparkles class="h-10 w-10 text-blue-500" />
          </div>
          <h3 class="text-3xl font-extrabold tracking-tight">AI-Powered Municipal Management</h3>
          <p class="mt-4 text-slate-400 text-sm leading-relaxed">
            Report issues in seconds, visualize city-wide status maps in real time, and let neural-net models automatically triage and prioritize cases for maintenance crews.
          </p>
          
          {/* Visual Mini Board */}
          <div class="mt-8 p-6 rounded-2xl bg-slate-800/40 border border-slate-800 backdrop-blur-md text-left shadow-2xl">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-2">
                <span class="w-3 h-3 rounded-full bg-red-500"></span>
                <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span class="w-3 h-3 rounded-full bg-green-500"></span>
              </div>
              <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Model accuracy: 98.4%</span>
            </div>
            <div class="space-y-3">
              <div class="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <p class="text-xs font-bold text-white">Visual Scan Pothole #984</p>
                  <p class="text-[10px] text-slate-500">Category auto-assigned via image</p>
                </div>
                <span class="bg-red-500/10 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/20">Critical</span>
              </div>
              <div class="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <p class="text-xs font-bold text-white">Traffic Sensor Sync</p>
                  <p class="text-[10px] text-slate-500">API trigger priority score 96</p>
                </div>
                <span class="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/20">Dispatching</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
