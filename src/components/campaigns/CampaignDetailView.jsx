import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ExternalLink, 
  Edit, 
  Send,
  Eye,
  Heart,
  MessageSquare
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export const CampaignDetailView = ({ campaignId, onBack }) => {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaign();
  }, [campaignId]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const res = await api.getCampaignById(campaignId);
      if (res.success) {
        setCampaign(res.campaign);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMilestoneStatus = async (milestoneId, newStatus) => {
    if (!campaign) return;
    const updated = (campaign.milestones || []).map(m =>
      m.id === milestoneId ? { ...m, status: newStatus } : m
    );
    try {
      const res = await api.updateCampaign(campaign.id, { milestones: updated });
      if (res.success) setCampaign(res.campaign);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateCreatorStage = async (influencerId, newStage) => {
    try {
      const res = await api.updateCreatorMilestone(campaign.id, influencerId, { stage: newStage });
      if (res.success) setCampaign(res.campaign);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-3"></div>
        <p className="text-xs text-slate-400">Loading campaign workflow...</p>
      </div>
    );
  }

  if (!campaign) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Campaigns</span>
        </button>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          Status: {campaign.status}
        </span>
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div>
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">{campaign.brandName}</span>
          <h2 className="text-xl font-bold text-white mt-1">{campaign.title}</h2>
          <p className="text-xs text-slate-400 mt-0.5">Campaign Budget: <strong className="text-white">{formatCurrency(campaign.totalBudget)}</strong></p>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Campaign Milestones Roadmap</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {campaign.milestones?.map((m) => (
              <div key={m.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <p className="text-xs font-bold text-white truncate">{m.title}</p>
                <select
                  value={m.status}
                  onChange={(e) => handleUpdateMilestoneStatus(m.id, e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-200"
                >
                  <option value="Pending">Pending</option>
                  <option value="In-Progress">In-Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white">Creator Deliverables & Content Status</h3>

        <div className="space-y-3">
          {campaign.creatorMilestones?.map((c, idx) => (
            <div key={idx} className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">{c.name}</h4>
                <p className="text-[11px] text-purple-400 font-mono">{c.handle}</p>
                <p className="text-xs text-slate-400">Scope: {c.deliverable}</p>
              </div>

              <div className="flex items-center space-x-3">
                <select
                  value={c.stage}
                  onChange={(e) => handleUpdateCreatorStage(c.influencerId, e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200"
                >
                  <option value="Confirmation Pending">Confirmation Pending</option>
                  <option value="Product Dispatched">Product Dispatched</option>
                  <option value="Script Approved">Script Approved</option>
                  <option value="Draft Under Review">Draft Under Review</option>
                  <option value="Live & Verified">Live & Verified</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
