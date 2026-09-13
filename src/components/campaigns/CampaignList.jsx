import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Kanban, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Calendar, 
  DollarSign, 
  Layers 
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const CampaignList = ({ onSelectCampaign }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await api.getCampaigns();
      if (res.success) {
        setCampaigns(res.campaigns);
      }
    } catch (err) {
      console.error('Failed to load campaigns', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Campaign Execution & Tracking Pipeline</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              {campaigns.length} Active
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track end-to-end deliverables, script reviews, draft submissions, live post analytics, and invoice milestones
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-3"></div>
          <p className="text-xs text-slate-400">Loading campaign pipelines...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800">
          <Kanban className="w-8 h-8 text-slate-500 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">No Active Campaigns Running</h3>
          <p className="text-xs text-slate-500 mt-1">Launch a campaign from an approved proposal in the Proposal Studio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {campaigns.map((camp) => {
            const completedMilestones = (camp.milestones || []).filter(m => m.status === 'Completed').length;
            const totalMilestones = camp.milestones?.length || 1;
            const progressPct = Math.round((completedMilestones / totalMilestones) * 100);

            return (
              <div
                key={camp.id}
                onClick={() => onSelectCampaign(camp.id)}
                className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {camp.brandName}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1.5">{camp.title}</h3>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {camp.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Execution Progress</span>
                      <span className="font-bold text-purple-300">{progressPct}% ({completedMilestones}/{totalMilestones})</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full transition-all" style={{ width: `${progressPct}%` }}></div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {camp.creatorMilestones?.map((c, i) => (
                        <div key={i} className="inline-block h-6 w-6 rounded-full bg-purple-700 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-slate-900">
                          {c.name.charAt(0)}
                        </div>
                      ))}
                    </div>
                    <span>{camp.creatorMilestones?.length || 0} Creators Active</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-white">{formatCurrency(camp.totalBudget)}</span>
                  <button className="flex items-center space-x-1 text-xs font-bold text-purple-400 hover:text-purple-300">
                    <span>Manage Workflow</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
