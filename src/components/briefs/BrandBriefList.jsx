import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { BrandBriefModal } from './BrandBriefModal';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  FileText, 
  Sparkles, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Trash2, 
  Edit,
  ArrowRight,
  Target
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const BrandBriefList = ({ onRunAIMatch }) => {
  const { hasRole } = useAuth();
  const canManage = hasRole('Admin', 'Campaign Manager', 'Agency Member');

  const [briefs, setBriefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrief, setSelectedBrief] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchBriefs();
  }, []);

  const fetchBriefs = async () => {
    try {
      setLoading(true);
      const res = await api.getBriefs();
      if (res.success) {
        setBriefs(res.briefs);
      }
    } catch (err) {
      console.error('Failed to load briefs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedBrief(null);
    setIsModalOpen(true);
  };

  const handleEdit = (brief) => {
    setSelectedBrief(brief);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this brand brief?')) return;
    try {
      await api.deleteBrief(id);
      fetchBriefs();
    } catch (err) {
      alert(err.message || 'Failed to delete brief');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Brand Briefs & Campaign Requirements</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
              {briefs.length} Active
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Capture campaign objectives, city targets, demographics, budgets, and trigger AI match recommendations
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleCreate}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Campaign Brief</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-3"></div>
          <p className="text-xs text-slate-400">Loading campaign briefs...</p>
        </div>
      ) : briefs.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800">
          <FileText className="w-8 h-8 text-slate-500 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">No Brand Briefs Yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Create your first brand brief to start AI-assisted creator discovery and proposal generation.
          </p>
          {canManage && (
            <button
              onClick={handleCreate}
              className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 transition-colors"
            >
              Create Brief Now
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {briefs.map((b) => (
            <div
              key={b.id}
              className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {b.brandName}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">{b.campaignTitle}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-slate-500" />
                      <span>{b.objective}</span>
                    </p>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    b.status === 'In-Execution' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    b.status === 'Proposed' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                    'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {b.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-900/60 rounded-xl p-3 border border-slate-800/80 mb-3 text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Budget</p>
                    <p className="text-sm font-extrabold text-white mt-0.5">{formatCurrency(b.totalBudget)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Deliverables</p>
                    <p className="text-xs font-bold text-purple-300 mt-0.5">
                      {b.deliverables?.reelsCount || 0} Reels • {b.deliverables?.storiesCount || 0} Stories
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 mb-4">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">Cities: {b.targetCities?.join(', ') || 'Pan India'}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Timeline: {formatDate(b.timelineStart)} - {formatDate(b.timelineEnd)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {canManage && (
                    <>
                      <button
                        onClick={() => handleEdit(b)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Edit Brief"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                        title="Delete Brief"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={() => onRunAIMatch(b)}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run AI Match</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <BrandBriefModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        brief={selectedBrief}
        onSaved={fetchBriefs}
      />
    </div>
  );
};
