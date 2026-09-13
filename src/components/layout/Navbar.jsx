import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Sparkles, 
  ChevronDown, 
  Search, 
  Bell, 
  UserCheck, 
  ShieldCheck, 
  Eye, 
  Lock,
  Layers,
  Database
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onGlobalSearch }) => {
  const { user, demoUsers, switchUser, logout } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin': return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Campaign Manager': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'Agency Member': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Client': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default: return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (onGlobalSearch) onGlobalSearch(e.target.value);
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand Logo & Name */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('influencers')}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-extrabold text-base tracking-tight text-white">NexCreator</h1>
            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">AI Enterprise</span>
          </div>
          <p className="text-[11px] text-slate-400">Influencer Intelligence & Campaign Suite</p>
        </div>
      </div>

      {/* Global Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Quick search creators, handles, niches, briefs..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 transition-all"
          />
        </div>
      </div>

      {/* Role Switcher & Profile dropdown */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:bg-slate-800 transition-colors text-xs"
          >
            <div className="flex items-center space-x-1.5">
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${getRoleBadgeColor(user?.role)}`}>
                {user?.role || 'Guest'}
              </span>
              <span className="text-slate-300 font-medium hidden sm:inline">{user?.name}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-800 mb-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Role-Based Persona Switcher</p>
                <p className="text-xs text-slate-500">Test platform permissions in real-time</p>
              </div>
              <div className="space-y-1">
                {demoUsers.map((demo) => {
                  const isActive = user?.id === demo.id;
                  return (
                    <button
                      key={demo.id}
                      onClick={() => {
                        switchUser(demo);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl flex items-center space-x-3 transition-all ${
                        isActive ? 'bg-purple-600/20 border border-purple-500/40 text-purple-200' : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <img src={demo.avatar} alt={demo.name} className="w-8 h-8 rounded-lg object-cover border border-slate-700" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold truncate">{demo.name}</p>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded border ${getRoleBadgeColor(demo.role)}`}>
                            {demo.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{demo.title}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {user?.role === 'Client' && (
                <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>Client Mode active: Creator direct phone numbers and agency margins are redacted.</span>
                </div>
              )}

              <div className="mt-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setShowRoleMenu(false);
                    logout();
                    window.location.reload();
                  }}
                  className="w-full py-1.5 px-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 text-[11px] font-semibold text-center transition-colors"
                >
                  Sign Out / In-House Login Screen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
