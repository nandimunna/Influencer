import React from 'react';
import { 
  Users, 
  FileText, 
  Sparkles, 
  Send, 
  Kanban, 
  LayoutDashboard, 
  ShieldAlert,
  Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, hasRole } = useAuth();
  const isAdmin = hasRole('Admin');
  const isClient = user?.role === 'Client';

  const navItems = [
    {
      id: 'influencers',
      label: 'Creator Database',
      icon: Database,
      badge: 'Excel Sync',
      badgeColor: 'bg-purple-500/20 text-purple-300'
    },
    {
      id: 'dashboard',
      label: 'Executive Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'briefs',
      label: 'Brand Briefs',
      icon: FileText,
      badge: 'Active'
    },
    {
      id: 'ai_matching',
      label: 'AI Match Engine',
      icon: Sparkles,
      badge: 'Smart ML',
      badgeColor: 'bg-indigo-500/20 text-indigo-300'
    },
    {
      id: 'proposals',
      label: 'Proposal Studio',
      icon: Send,
      badge: null
    },
    {
      id: 'campaigns',
      label: 'Execution Tracker',
      icon: Kanban,
      badge: null
    }
  ];

  if (isAdmin) {
    navItems.push({
      id: 'admin',
      label: 'Governance & Security',
      icon: ShieldAlert,
      badge: 'Admin'
    });
  }

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/40 p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-1">
        <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Core Workspaces
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${item.badgeColor || 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Role info footer card */}
      <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Active Role</span>
          <span className="text-[10px] text-purple-400 font-semibold">{user?.role}</span>
        </div>
        <p className="font-bold text-white truncate">{user?.name}</p>
        <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email}</p>
      </div>
    </aside>
  );
};
