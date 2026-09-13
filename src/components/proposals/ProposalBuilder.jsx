import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Sliders, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  DollarSign, 
  Users 
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export const ProposalBuilder = ({ preloadedData, onBack, onCampaignLaunched }) => {
  const [title, setTitle] = useState(
    preloadedData?.brief ? `${preloadedData.brief.brandName} - Influencer Media Proposal` : 'Influencer Media Proposal'
  );
  const [clientName, setClientName] = useState(preloadedData?.brief?.brandName || 'Brand Partner');
  const [marginPercentage, setMarginPercentage] = useState(20);
  const [creators, setCreators] = useState(preloadedData?.creators || []);
  const [availableInfluencers, setAvailableInfluencers] = useState([]);
  const [notes, setNotes] = useState('Deliverables include 30-day whitelisting and organic collaboration tags.');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAvailableCreators();
  }, []);

  const fetchAvailableCreators = async () => {
    try {
      const res = await api.getInfluencers();
      if (res.success) {
        setAvailableInfluencers(res.influencers);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddCreatorFromDatabase = (creator) => {
    if (creators.some(c => c.influencerId === creator.id)) return;
    const buyPrice = creator.pricing?.reelWithDR || creator.pricing?.reel || 50000;
    const clientPrice = Math.round(buyPrice * (1 + marginPercentage / 100));

    const newEntry = {
      influencerId: creator.id,
      name: creator.name,
      handle: creator.handle,
      avatar: creator.avatar,
      tier: creator.tier,
      followers: creator.followerCount,
      genre: creator.primaryGenre,
      city: creator.city,
      creatorBuyPrice: buyPrice,
      marginPct: marginPercentage,
      clientQuotePrice: clientPrice,
      selectedDeliverables: ['1x Reel + Direct Rights (DR)'],
      rationale: `${creator.name} brings high regional resonance in ${creator.city} with strong engagement.`
    };
    setCreators([...creators, newEntry]);
  };

  const handleRemoveCreator = (idx) => {
    setCreators(creators.filter((_, i) => i !== idx));
  };

  const handleUpdateCreatorPrice = (idx, newBuyPrice) => {
    const updated = [...creators];
    const buy = Number(newBuyPrice) || 0;
    const margin = updated[idx].marginPct || marginPercentage;
    updated[idx].creatorBuyPrice = buy;
    updated[idx].clientQuotePrice = Math.round(buy * (1 + margin / 100));
    setCreators(updated);
  };

  const handleUpdateCreatorMargin = (idx, newMargin) => {
    const updated = [...creators];
    const margin = Number(newMargin) || 0;
    const buy = updated[idx].creatorBuyPrice || 0;
    updated[idx].marginPct = margin;
    updated[idx].clientQuotePrice = Math.round(buy * (1 + margin / 100));
    setCreators(updated);
  };

  const handleGlobalMarginChange = (val) => {
    const margin = Number(val);
    setMarginPercentage(margin);
    setCreators(creators.map(c => ({
      ...c,
      marginPct: margin,
      clientQuotePrice: Math.round(c.creatorBuyPrice * (1 + margin / 100))
    })));
  };

  const totalCreatorCost = creators.reduce((acc, c) => acc + (c.creatorBuyPrice || 0), 0);
  const totalClientPrice = creators.reduce((acc, c) => acc + (c.clientQuotePrice || 0), 0);
  const totalAgencyMargin = totalClientPrice - totalCreatorCost;

  const handleSaveProposal = async () => {
    if (creators.length === 0) {
      alert('Please include at least one creator in proposal.');
      return;
    }
    try {
      setIsSaving(true);
      const payload = {
        briefId: preloadedData?.brief?.id || null,
        title,
        clientName,
        marginPercentage,
        creatorsData: creators,
        notes,
        status: 'Sent to Client'
      };

      const res = await api.createProposal(payload);
      if (res.success) {
        alert('Proposal successfully created and ready for client delivery!');
        onBack();
      }
    } catch (err) {
      alert(err.message || 'Failed to save proposal');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Proposals</span>
        </button>

        <button
          onClick={handleSaveProposal}
          disabled={isSaving || creators.length === 0}
          className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving Proposal...' : 'Finalize & Save Proposal'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Proposal & Client Metadata</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Proposal Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Client Brand Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Campaign Notes & Rights</label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Selected Creator Lineup ({creators.length})</h3>
            </div>

            {creators.map((c, idx) => (
              <div key={idx} className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-xl object-cover border border-slate-700" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{c.name}</h4>
                      <p className="text-[11px] text-purple-400 font-mono">{c.handle} • {formatNumber(c.followers)} followers</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveCreator(idx)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/60 text-xs">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Creator Buy Rate (₹)</label>
                    <input
                      type="number"
                      value={c.creatorBuyPrice}
                      onChange={(e) => handleUpdateCreatorPrice(idx, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Margin %</label>
                    <input
                      type="number"
                      value={c.marginPct}
                      onChange={(e) => handleUpdateCreatorMargin(idx, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Client Final Price (₹)</label>
                    <div className="p-1.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-xs font-bold text-purple-300">
                      {formatCurrency(c.clientQuotePrice)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Commercial Pricing Summary</h3>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400">Global Agency Margin (%)</label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={marginPercentage}
                  onChange={(e) => handleGlobalMarginChange(e.target.value)}
                  className="w-full accent-purple-500"
                />
                <span className="text-xs font-bold text-purple-300 font-mono w-10">{marginPercentage}%</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-slate-800 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Total Creator Buy Cost:</span>
                <span className="font-mono text-slate-200">{formatCurrency(totalCreatorCost)}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Agency Gross Profit:</span>
                <span className="font-mono font-bold">+{formatCurrency(totalAgencyMargin)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                <span>Final Client Quote:</span>
                <span className="font-mono text-purple-300">{formatCurrency(totalClientPrice)}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Quick Add From Database</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {availableInfluencers.map((inf) => (
                <div
                  key={inf.id}
                  onClick={() => handleAddCreatorFromDatabase(inf)}
                  className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <img src={inf.avatar} alt={inf.name} className="w-7 h-7 rounded-lg object-cover" />
                    <span className="font-medium text-white truncate">{inf.name}</span>
                  </div>
                  <span className="text-[10px] text-purple-400 font-bold">+ Add</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
