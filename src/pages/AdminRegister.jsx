import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, ShieldAlert, ArrowRight, Cpu, Key, CheckCircle, RefreshCw } from 'lucide-react';
import { message } from 'antd';

const AdminRegister = () => {
  const { register, loading, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [systemLogs, setSystemLogs] = useState([
    'Awaiting operator provisioning credentials...',
    'System authorization layer ready.',
    'Validation checks status: ONLINE'
  ]);

  // Terminal background activity simulation
  useEffect(() => {
    const logsList = [
      'Scanning local network nodes...',
      'Validating security key integrity...',
      'Encryption method: AES-256 GCM.',
      'Token validation listener: ACTIVE.',
      'Checking user constraints...',
      'Database status: READY'
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
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      message.error('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      message.error('Passwords do not match.');
      return;
    }
    if (securityCode !== 'ADMIN123' && securityCode !== 'admin') {
      message.error('Invalid System Administration Security Code.');
      return;
    }

    const res = await register(name, email, phone, password, confirmPassword, 'admin');
    if (res.success) {
      message.success('Administrator account provisioned successfully!');
      navigate('/');
    } else {
      message.error(res.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#030712] text-slate-100 overflow-hidden relative">
      {/* Background neon flows */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-violet-600/10 rounded-full blur-[160px] pointer-events-none z-0"></div>

      {/* LEFT PANEL: Live Security Node Monitor */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between border-r border-slate-900 bg-slate-950/45 backdrop-blur-md relative z-10 select-none">
        {/* V-TOPUP-STORE Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-violet-500/20 border border-violet-400/20">
            <Cpu size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black bg-gradient-to-r from-violet-400 to-indigo-200 bg-clip-text text-transparent">V-TOPUP-STORE</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Admin Control System</p>
          </div>
        </div>

        {/* Content details */}
        <div className="space-y-8 my-auto max-w-md">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-950/50 px-3 py-1 rounded-full border border-amber-900/30">System Operator Provisioning</span>
            <h2 className="text-4xl font-extrabold text-white leading-tight">Enroll New Control Console Nodes</h2>
            <p className="text-sm text-slate-400">Configure credentials for authorized administrative operators. Enforced security keys and cryptographic validations prevent unauthorized deployment.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-2xl flex items-center gap-3">
              <Key size={18} className="text-amber-400" />
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Provision Check</p>
                <p className="text-xs text-white font-bold">PASSCODE REQUIRED</p>
              </div>
            </div>
            <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-2xl flex items-center gap-3">
              <CheckCircle size={18} className="text-violet-400" />
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Compliance</p>
                <p className="text-xs text-white font-bold">ISO-27001 SECURE</p>
              </div>
            </div>
          </div>

          {/* Simulated terminal console */}
          <div className="bg-slate-950/80 border border-slate-900 p-5 rounded-2xl font-mono text-[11px] text-slate-400 space-y-2.5 shadow-xl relative overflow-hidden">
            <div className="absolute top-2 right-2 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center"><RefreshCw size={8} className="animate-spin text-slate-600" /></span>
              <span className="text-[9px] text-slate-600 uppercase font-bold">Secure Guard</span>
            </div>
            <div className="flex gap-2 border-b border-slate-900 pb-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
              <span className="ml-2 text-slate-600 font-bold">provisioning_monitor.log</span>
            </div>
            {systemLogs.map((log, idx) => (
              <p key={idx} className={`${idx === systemLogs.length - 1 ? 'text-amber-400 font-semibold' : ''}`}>
                &gt; {log}
              </p>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-650">© 2026 V-TOPUP-STORE Inc. Secure administrative framework.</p>
      </div>

      {/* RIGHT SIDE: Admin Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-20 relative z-10 overflow-y-auto">
        <div className="w-full max-w-md space-y-6 text-left my-auto">
          
          {/* Mobile view Logo */}
          <div className="flex lg:hidden items-center gap-3 mb-6">
            <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 p-2.5 rounded-xl text-white">
              <Cpu size={20} />
            </div>
            <h1 className="text-lg font-black text-white">V-TOPUP-STORE ADMIN</h1>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-3xl font-black text-white tracking-tight">Provision Member</h3>
            <p className="text-slate-400 text-xs font-medium">Provision new operator node in the administrative group.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-slate-550" size={16} />
                <input
                  id="admin-reg-fullname"
                  type="text"
                  placeholder="Operator Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900/75 border border-slate-800 rounded-xl pl-11 pr-4 h-12 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Secure Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-550" size={16} />
                <input
                  id="admin-reg-emailaddr"
                  type="email"
                  placeholder="admin@vtopup.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/75 border border-slate-800 rounded-xl pl-11 pr-4 h-12 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 text-slate-550" size={16} />
                <input
                  id="admin-reg-phonenumber"
                  type="tel"
                  placeholder="+855 12 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900/75 border border-slate-800 rounded-xl pl-11 pr-4 h-12 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Credentials Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-555" size={16} />
                <input
                  id="admin-reg-pwd"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/75 border border-slate-800 rounded-xl pl-11 pr-4 h-12 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-555" size={16} />
                <input
                  id="admin-reg-pwd-confirm"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-900/75 border border-slate-800 rounded-xl pl-11 pr-4 h-12 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Security Code */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Access Authorization Passcode</label>
              </div>
              <div className="relative">
                <ShieldAlert className="absolute left-4 top-3.5 text-amber-500" size={16} />
                <input
                  id="admin-reg-auth-passcode"
                  type="text"
                  placeholder="Enter signup passcode (e.g. ADMIN123)"
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value)}
                  className="w-full bg-slate-900/75 border border-slate-850 rounded-xl pl-11 pr-4 h-12 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-semibold"
                  required
                />
              </div>
              <p className="text-[10px] text-amber-500">Provide V-TOPUP-STORE security passcode key (Use `ADMIN123` to authorize registration).</p>
            </div>

            <button
              id="admin-register-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-extrabold transition-all shadow-lg shadow-violet-600/10 hover:shadow-violet-600/25 active:scale-98 disabled:opacity-50 mt-2"
            >
              {loading ? 'Registering operator...' : (
                <>
                  Confirm System Provision
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="h-px bg-slate-900 my-6"></div>

          <div className="space-y-3 text-xs">
            <p className="text-slate-500">
              Already have administrative credentials?{' '}
              <Link to="/login" className="text-violet-400 font-bold hover:text-violet-350 transition-colors">
                Log in as Administrator
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

export default AdminRegister;
