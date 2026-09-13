import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink,
  Flame,
  Award
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export const AIMatchingView = ({ initialBrief, onBuildProposalFromMatches }) => {
  const [briefs, setBriefs] = useState([]);
  const [selectedBriefId, setSelectedBriefId] = useState(initialBrief?.id || '');
  const [activeBrief, setActiveBrief] = useState(initialBrief || null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedCreatorIds, setSelectedCreatorIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBriefs();
  }, []);

  useEffect(() => {
    if (selectedBriefId) {
      runAIMatch(selectedBriefId);
    }
  }, [selectedBriefId]);

  const fetchBriefs = async () => {
    try {
      const res = await api.getBriefs();
      if (res.success && res.briefs.length > 0) {
        setBriefs(res.briefs);
        if (!selectedBriefId) {
          setSelectedBriefId(res.briefs[0].id);
          setActiveBrief(res.briefs[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const runAIMatch = async (briefId) => {
    try {
      setLoading(true);
      const res = await api.matchInfluencers(briefId);
      if (res.success) {
        setRecommendations(res.recommendations);
        const top3Ids = new Set(res.recommendations.slice(0, 3).map(r => r.influencer.id));
        setSelectedCreatorIds(top3Ids);
        const found = briefs.find(b => b.id === briefId);
        if (found) setActiveBrief(found);
      }
    } catch (err) {
      console.error('Matching error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCreatorSelect = (creatorId) => {
    const updated = new Set(selectedCreatorIds);
    if (updated.has(creatorId)) {
      updated.delete(creatorId);
    } else {
      updated.add(creatorId);
    }
    setSelectedCreatorIds(updated);
  };

  const handleBuildProposal = () => {
    const selectedRecs = recommendations.filter(r => selectedCreatorIds.has(r.influencer.id));
    if (selectedRecs.length === 0) {
      alert('Please select at least one creator.');
      return;
    }

    const preloaded = {
      brief: activeBrief,
      creators: selectedRecs.map(r => ({
        influencerId: r.influencer.id,
        name: r.influencer.name,
        handle: r.influencer.handle,
        avatar: r.influencer.avatar,
        tier: r.influencer.tier,
        followers: r.influencer.followerCount,
        genre: r.influencer.primaryGenre,
        city: r.influencer.city,
        creatorBuyPrice: r.influencer.pricing?.reelWithDR || r.influencer.pricing?.reel || 50000,
        marginPct: 20,
        selectedDeliverables: ['1x Instagram Reel', '2x Stories with Link'],
        rationale: r.keyStrengths?.[0] || r.aiRationale
      }))
    };

    onBuildProposalFromMatches(preloaded);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span>AI Influencer Match Engine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated multi-criteria discovery weighted by Niche, Demographics, Price, ER% and Regional Authority
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedBriefId}
            onChange={(e) => setSelectedBriefId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
          >
            {briefs.map((b) => (
              <option key={b.id} value={b.id}>
                {b.brandName} - {b.campaignTitle}
              </option>
            ))}
          </select>

          <button
            onClick={handleBuildProposal}
            disabled={selectedCreatorIds.size === 0}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>Build Proposal ({selectedCreatorIds.size} Creators)</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-3"></div>
          <p className="text-xs text-slate-400">Running AI Match Engine across creator graph...</p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800">
          <Sparkles className="w-8 h-8 text-slate-500 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">No Matches Found for Brief</h3>
          <p className="text-xs text-slate-500 mt-1">Try selecting a different brief or modifying the criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Showing top {recommendations.length} AI-ranked recommendations</span>
            <span>{selectedCreatorIds.size} selected for proposal</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec) => {
              const inf = rec.influencer;
              const isSelected = selectedCreatorIds.has(inf.id);
              const score = rec.overallScore;

              return (
                <div
                  key={inf.id}
                  onClick={() => toggleCreatorSelect(inf.id)}
                  className={`glass-panel rounded-2xl p-5 border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-purple-500/80 bg-purple-950/20 shadow-lg shadow-purple-500/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={inf.avatar}
                        alt={inf.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-700"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-sm font-bold text-white">{inf.name}</h4>
                          {inf.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                        </div>
                        <p className="text-xs text-purple-400 font-mono">{inf.handle}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{inf.city} • {inf.primaryGenre}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-1">
                      <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-purple-600 text-white text-xs font-black shadow-md">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{score}% Match</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{inf.tier}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/80 mb-3 text-center text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">Followers</p>
                      <p className="font-bold text-white mt-0.5">{formatNumber(inf.followerCount)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">Avg Views</p>
                      <p className="font-bold text-emerald-400 mt-0.5">{formatNumber(inf.avgViews)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">Reel + DR</p>
                      <p className="font-bold text-white mt-0.5">
                        {formatCurrency(inf.pricing?.reelWithDR || inf.pricing?.reel || 0)}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 mb-3 text-xs text-slate-300">
                    <p className="text-[11px] text-purple-300 font-semibold mb-1">AI Recommendation Insight:</p>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{rec.aiRationale}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <span className="text-pink-400 font-medium">
                      Audience: {inf.genderDemographics?.femalePct || 75}% Female
                    </span>

                    <span className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                      isSelected ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isSelected ? '✓ Selected in Plan' : '+ Add to Plan'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
