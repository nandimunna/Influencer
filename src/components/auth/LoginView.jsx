import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  UserCheck, 
  KeyRound, 
  AlertCircle
} from 'lucide-react';

export const LoginView = ({ onLoginSuccess }) => {
  const { switchUser } = useAuth();
  const [email, setEmail] = useState('admin@nexcreator.io');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const IN_HOUSE_ACCOUNTS = [
    {
      role: 'Admin',
      name: 'Aditya Roy',
      title: 'Head of Operations & Agency Director',
      email: 'admin@nexcreator.io',
      password: 'admin123',
      color: 'border-purple-500/50 bg-purple-950/20 text-purple-300',
      tag: 'Full Access & Security'
    },
    {
      role: 'Campaign Manager',
      name: 'Shreya Sengupta',
      title: 'Senior Campaign Strategist',
      email: 'shreya@nexcreator.io',
      password: 'admin123',
      color: 'border-blue-500/50 bg-blue-950/20 text-blue-300',
      tag: 'AI Matching & Proposals'
    },
    {
      role: 'Agency Member',
      name: 'Rohan Mehra',
      title: 'Influencer Talent Lead',
      email: 'rohan@nexcreator.io',
      password: 'admin123',
      color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300',
      tag: 'Excel Imports & Discovery'
    },
    {
      role: 'Client',
      name: 'Pooja Verma',
      title: 'Brand Marketing Director @ AuraTech',
      email: 'client@brandcorp.com',
      password: 'admin123',
      color: 'border-amber-500/50 bg-amber-950/20 text-amber-300',
      tag: 'Client Deck & Approvals'
    }
  ];

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const res = await api.login(email, password);
      if (res.success) {
        localStorage.setItem('nex_token', res.token);
        if (onLoginSuccess) onLoginSuccess(res.user);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (account) => {
    try {
      setLoading(true);
      setError('');
      await switchUser(account);
      if (onLoginSuccess) onLoginSuccess(account);
    } catch (err) {
      setError('Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center p-6 text-slate-100">
      <div className="w-full max-w-4xl space-y-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Influencer Intelligence Platform</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            NexCreator <span className="text-gradient">AI Portal</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Sign in with in-house team credentials to access creator database, run AI matching and build proposals
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <KeyRound className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">In-House Staff Sign In</h3>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleStandardLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Corporate Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    placeholder="name@nexcreator.io"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-[11px] text-slate-500 text-center">
              Protected by Enterprise JWT Authentication & RBAC Policy
            </p>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">In-House Team Pre-Configured Accounts</span>
              <span className="text-[11px] text-purple-400 font-semibold">1-Click Sign In</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {IN_HOUSE_ACCOUNTS.map((acc, idx) => (
                <div
                  key={idx}
                  onClick={() => handleQuickLogin(acc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] flex flex-col justify-between space-y-3 ${acc.color}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-extrabold uppercase tracking-wide">{acc.role}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 font-medium">
                        {acc.tag}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white">{acc.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{acc.title}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <div className="font-mono text-slate-300 text-[10px] truncate max-w-[140px]">
                      {acc.email}
                    </div>
                    <span className="font-bold flex items-center gap-1 text-purple-300 hover:text-white">
                      <span>Login</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Password for all in-house accounts is <strong className="text-white font-mono">admin123</strong>.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
