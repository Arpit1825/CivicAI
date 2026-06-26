import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Radar, Mail, Lock, User, Shield, ArrowRight } from 'lucide-react';

export default function Signup() {
  const { signup } = useApp();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');
  const [adminSecretkey, setAdminSecretkey] = useState("");
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (role === "admin" && !adminSecretkey.trim()) {
    setError("Please enter Admin Secret Key");
    return;
}
    try {
      const user = await signup(
    name,
    email,
    password,
    role,
    adminSecretkey
);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left side: Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white relative z-10">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center space-x-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Radar className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Civic<span className="text-blue-600">AI</span></span>
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create an account</h2>
          <p className="mt-2.5 text-sm text-slate-500">
            Join the modern platform improving public infrastructure together.
          </p>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700">Full Name</label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">Email Address</label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
              </div>
            </div>
            {role === "admin" && (
  <div className="mt-4">
    <label className="block text-sm font-semibold text-slate-700">
      Admin Secret Key
    </label>

    <div className="mt-1 relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Lock className="h-4 w-4 text-slate-400" />
      </div>

      <input
        type="password"
        value={adminSecretkey}
        onChange={(e) => setAdminSecretkey(e.target.value)}
        placeholder="Enter Government Admin Secret"
        className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />
    </div>

    <p className="mt-1 text-[11px] text-slate-400">
      Restricted access. Only authorized government officials can create an administrator account.
    </p>
  </div>
)}
            <div>
              <span className="block text-sm font-semibold text-slate-700 mb-2">Select Portal Access</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('citizen')}
                  className={`py-2.5 px-3 border rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${
                    role === 'citizen'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/10 font-semibold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <User className="h-4.5 w-4.5" />
                  <span className="text-sm">Citizen Portal</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-2.5 px-3 border rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${
                    role === 'admin'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/10 font-semibold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Shield className="h-4.5 w-4.5" />
                  <span className="text-sm">Gov Admin</span>
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all mt-2"
            >
              Register Account
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Right side: SaaS Graphic Decoration Panel */}
      <div className="hidden lg:flex lg:flex-1 bg-slate-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-blue-600/20 to-transparent pointer-events-none"></div>
        <div className="max-w-md text-center text-white relative z-10">
          <div className="inline-flex p-3 rounded-full bg-blue-600/10 border border-blue-500/20 mb-6">
            <Radar className="h-10 w-10 text-blue-500" />
          </div>
          <h3 className="text-3xl font-extrabold tracking-tight">Active Citizen Contribution</h3>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed">
            Register to raise issues directly. Earn Civic Contribution Points for each verified issue you submit or upvote, level up your rank, and help prioritize local community repairs.
          </p>

          <div className="mt-8 p-6 rounded-2xl bg-slate-800/40 border border-slate-800 backdrop-blur-md text-left shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Level 4: Civic Guardian</span>
              <span className="text-xs font-bold text-blue-400">720 Points</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '72%' }}></div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Reported</p>
                <p className="text-lg font-bold text-white">8 Issues</p>
              </div>
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Upvoted</p>
                <p className="text-lg font-bold text-white">24 Issues</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
