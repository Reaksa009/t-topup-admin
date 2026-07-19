import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ShieldCheck, ArrowRight, Server, RefreshCw, Cpu, Activity } from 'lucide-react';
import { message } from 'antd';

const AdminLogin = () => {
  const { login, logout, loading, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [systemLogs, setSystemLogs] = useState([
    'Initializing secure handshakes...',
    'V-TOPUP-STORE Node listener active on port 8000',
    'MySQL connection database verified.'
  ]);

  // Append dummy log entries periodically to make the terminal look active/alive!
  useEffect(() => {
    const logsList = [
      'Auth module loaded successfully.',
      'ABA Webhook listener initialized.',
      'KHQR gateway service: ACTIVE.',
      'Memory usage: 48.2 MB / 512 MB',
      'System latency: 12ms',
      'Audit log synchronizer daemon running.',
      'Backup process scheduled for 00:00 UTC.'
    ];
    
    const interval = setInterval(() => {
      const randomLog = logsList[Math.floor(Math.random() * logsList.length)];
      setSystemLogs(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${randomLog}`]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Redirect if logged in
  useEffect(() => {
    if (isAuthenticated && isAdmin()) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      message.error('Please enter both email and password.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      if (res.user.role === 'admin' || res.user.role === 'super-admin') {
        message.success('Welcome back to the Control Panel, ' + res.user.name);
        navigate('/');
      } else {
        message.error('Access Denied: Customer accounts are unauthorized here.');
        await logout();
      }
    } else {
      message.error(res.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#030712] text-slate-100 overflow-hidden relative">
      {/* Dynamic ambient color glows */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-violet-600/10 rounded-full blur-[160px] pointer-events-none z-0"></div>

      {/* LEFT SIDE: Control Panel Console & Analytics Graphic (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between border-r border-slate-900 bg-slate-950/45 backdrop-blur-md relative z-10 select-none">
        {/* Brand/App Title */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-violet-500/20 border border-violet-400/20">
            <Cpu size={24} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black bg-gradient-to-r from-violet-400 to-indigo-200 bg-clip-text text-transparent">V-TOPUP-STORE</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Admin Control System</p>
          </div>
        </div>

        {/* Console Hub Visual */}
        <div className="space-y-8 my-auto max-w-md">
          <div className="space-y-2">
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest bg-violet-950/50 px-3 py-1 rounded-full border border-violet-900/30">System Operator Portal</span>
            <h2 className="text-4xl font-extrabold text-white leading-tight">Manage and Auditing Top-Up Operations</h2>
            <p className="text-sm text-slate-400">Secure cryptographic gate to access transaction databases, game catalogs, payment manual verification and system settings.</p>
          </div>

          {/* Micro Status Monitor */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-2xl flex items-center gap-3">
              <Server size={18} className="text-emerald-400" />
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Api Gateway</p>
                <p className="text-xs text-white font-bold">ONLINE & STABLE</p>
              </div>
            </div>
            <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-2xl flex items-center gap-3">
              <Activity size={18} className="text-violet-400" />
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">CPU Load</p>
                <p className="text-xs text-white font-bold">0.84% (OPTIMIZED)</p>
              </div>
            </div>
          </div>

          {/* Running Terminal Simulator */}
          <div className="bg-slate-950/80 border border-slate-900 p-5 rounded-2xl font-mono text-[11px] text-slate-400 space-y-2.5 shadow-xl relative overflow-hidden">
            <div className="absolute top-2 right-2 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center"><RefreshCw size={8} className="animate-spin text-slate-600" /></span>
              <span className="text-[9px] text-slate-600 uppercase font-bold">Live Stats</span>
            </div>
            <div className="flex gap-2 border-b border-slate-900 pb-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
              <span className="ml-2 text-slate-600 font-bold">vtopup_console_audit.log</span>
            </div>
            {systemLogs.map((log, idx) => (
              <p key={idx} className={`${idx === systemLogs.length - 1 ? 'text-violet-400 font-semibold' : ''}`}>
                &gt; {log}
              </p>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <p className="text-xs text-slate-650">© 2026 V-TOPUP-STORE Inc. Secure administrative framework.</p>
      </div>

      {/* RIGHT SIDE: Admin Login Form Container */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-20 relative z-10">
        <div className="w-full max-w-md space-y-8 text-left">
          
          {/* Logo / Title shown only on Mobile/Tablet */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 p-2.5 rounded-xl text-white">
              <Cpu size={20} />
            </div>
            <h1 className="text-lg font-black text-white">V-TOPUP-STORE ADMIN</h1>
          </div>

          <div className="space-y-2">
            <h3 className="text-3xl font-black text-white tracking-tight">Access Control</h3>
            <p className="text-slate-400 text-xs font-medium">Verify credentials to initialize administrative session.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Administrator Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-550" size={16} />
                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@vtopup.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/75 border border-slate-800 rounded-xl pl-11 pr-4 h-12 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Secure Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-555" size={16} />
                <input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/75 border border-slate-800 rounded-xl pl-11 pr-4 h-12 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                  required
                />
              </div>
            </div>

            <button
              id="admin-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-extrabold transition-all shadow-lg shadow-violet-600/10 hover:shadow-violet-600/25 active:scale-98 disabled:opacity-50"
            >
              {loading ? 'Decrypting Session...' : (
                <>
                  Enter Control Room
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="h-px bg-slate-900 my-6"></div>

          <div className="space-y-3 text-xs">
            <p className="text-slate-500">
              Need to provision new administrative node?{' '}
              <Link to="/register" className="text-violet-400 font-bold hover:text-violet-350 transition-colors">
                Register Admin
              </Link>
            </p>
            <p className="text-slate-500">
              Not an administrator?{' '}
              <a href="http://localhost:5173/login" className="text-slate-300 font-semibold hover:text-white transition-colors">
                Back to Customer Storefront
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
