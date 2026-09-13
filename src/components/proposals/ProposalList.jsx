import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { exportProposalToPDF } from '../../utils/exportPdf';
import { exportProposalToExcel } from '../../utils/exportExcel';
import { 
  Plus, 
  Send, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  PlayCircle, 
  Copy, 
  Trash2, 
  Eye, 
  DollarSign,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const ProposalList = ({ onOpenBuilder, onLaunchCampaign }) => {
  const { user, hasRole } = useAuth();
  const isClient = user?.role === 'Client';
  const canManage = hasRole('Admin', 'Campaign Manager');

  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const res = await api.getProposals();
      if (res.success) {
        setProposals(res.proposals);
      }
    } catch (err) {
      console.error('Failed to load proposals', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicateVersion = async (propId) => {
    try {
      await api.createNewProposalVersion(propId);
      fetchProposals();
    } catch (err) {
      alert(err.message || 'Failed to create revision');
    }
  };

  const handleDelete = async (propId) => {
    if (!window.confirm('Delete this proposal?')) return;
    try {
      await api.deleteProposal(propId);
      fetchProposals();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleLaunch = async (prop) => {
    try {
      const res = await api.launchCampaignFromProposal(prop.id);
      if (res.success && res.campaign) {
        onLaunchCampaign(res.campaign);
      }
    } catch (err) {
      alert(err.message || 'Failed to launch campaign');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Proposal & Media Plan Studio</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
              {proposals.length} Proposals
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Build branded creator media plans, customize agency profit margins, export Client-ready PDF/Excel and launch campaign pipelines
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => onOpenBuilder(null)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Media Proposal</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-3"></div>
          <p className="text-xs text-slate-400">Loading proposals...</p>
        </div>
      ) : proposals.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800">
          <Send className="w-8 h-8 text-slate-500 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">No Proposals Created Yet</h3>
          <p className="text-xs text-slate-500 mt-1">Generate a proposal from AI recommendations or build one manually.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((prop) => (
            <div
              key={prop.id}
              className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {prop.proposalCode}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {prop.version}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    prop.status === 'Approved & Active Campaign' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    prop.status === 'Sent to Client' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {prop.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{prop.title}</h3>
                <p className="text-xs text-slate-400">
                  Client: <strong className="text-white">{prop.clientName}</strong> • {prop.creatorsData?.length || 0} Creators in Media Plan
                </p>

                <div className="flex items-center space-x-2 pt-1">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {prop.creatorsData?.map((c, i) => (
                      <img
                        key={i}
                        src={c.avatar}
                        alt={c.name}
                        className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 object-cover"
                        title={c.name}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {prop.creatorsData?.map(c => c.name).slice(0, 3).join(', ')}
                    {prop.creatorsData?.length > 3 ? ` +${prop.creatorsData.length - 3} more` : ''}
                  </span>
                </div>
              </div>

              <div className="flex flex-col md:items-end space-y-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                <div className="text-left md:text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Client Quotation</p>
                  <p className="text-lg font-extrabold text-white">{formatCurrency(prop.finalClientPrice)}</p>
                  {!isClient && (
                    <p className="text-[11px] text-emerald-400 font-medium">
                      Gross Margin: ₹{(prop.totalAgencyMargin || 0).toLocaleString('en-IN')} ({prop.marginPercentage}%)
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => exportProposalToPDF(prop)}
                    title="Export Client-Ready PDF"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5 text-purple-400" />
                    <span>PDF</span>
                  </button>

                  <button
                    onClick={() => exportProposalToExcel(prop, !isClient)}
                    title="Export Excel Media Plan"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors flex items-center gap-1"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Excel</span>
                  </button>

                  {canManage && (
                    <>
                      <button
                        onClick={() => handleDuplicateVersion(prop.id)}
                        title="Create New Revision Version"
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {prop.status !== 'Approved & Active Campaign' && (
                        <button
                          onClick={() => handleLaunch(prop)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>Launch Campaign</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(prop.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-300 border border-slate-700 text-xs transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
