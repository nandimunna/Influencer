import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Users, 
  Send, 
  Kanban, 
  DollarSign, 
  TrendingUp, 
  Sparkles, 
  PieChart as PieIcon,
  MapPin,
  ArrowUpRight
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export const DashboardView = ({ onNavigate }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboardAnalytics();
      if (res.success) {
        setAnalytics(res);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-3"></div>
        <p className="text-xs text-slate-400">Aggregating real-time analytics...</p>
      </div>
    );
  }

  const stats = analytics?.stats || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Executive Intelligence Overview</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time pipeline metrics, creator database distribution, agency gross margin, and revenue tracking
          </p>
        </div>

        <button
          onClick={() => onNavigate('influencers')}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md"
        >
          <span>Explore Creator Database</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Indexed Creators</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white">{stats.totalInfluencers || 0}</p>
          <p className="text-[11px] text-purple-300">Live Instagram & Multi-Genre Sync</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Active Campaigns</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Kanban className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white">{stats.activeCampaigns || 0}</p>
          <p className="text-[11px] text-emerald-400">Execution pipelines active</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Total Proposals</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white">{stats.totalProposals || 0}</p>
          <p className="text-[11px] text-blue-300">Total Quotation: {formatCurrency(stats.totalQuotationValue)}</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Agency Gross Profit</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white">{formatCurrency(stats.totalAgencyMargin)}</p>
          <p className="text-[11px] text-amber-300">Average Margin: {stats.avgMarginPct}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white">Top Creator Categories & Verticals</h3>
          <div className="space-y-2">
            {analytics?.genreDistribution?.map((g, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">{g.name}</span>
                  <span className="font-mono text-purple-300">{g.count} ({g.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full" style={{ width: `${g.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white">Regional Hub Distribution</h3>
          <div className="space-y-2">
            {analytics?.cityDistribution?.map((c, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-white font-medium">{c.city}</span>
                </div>
                <span className="font-mono font-bold text-slate-300">{c.count} creators</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
