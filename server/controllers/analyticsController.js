import { db } from '../db/database.js';

export const getDashboardAnalytics = (req, res) => {
  try {
    const influencers = db.get('influencers');
    const briefs = db.get('brandBriefs');
    const proposals = db.get('proposals');
    const campaigns = db.get('campaigns');

    const totalInfluencers = influencers.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'In-Execution').length;
    const totalProposals = proposals.length;
    
    const totalQuotationValue = proposals.reduce((acc, p) => acc + (p.finalClientPrice || 0), 0);
    const totalAgencyMargin = proposals.reduce((acc, p) => acc + (p.totalAgencyMargin || 0), 0);
    const avgMarginPct = proposals.length ? Math.round((totalAgencyMargin / (totalQuotationValue || 1)) * 100) : 20;

    const genreCounts = {};
    influencers.forEach(inf => {
      const g = inf.primaryGenre || 'Other';
      genreCounts[g] = (genreCounts[g] || 0) + 1;
    });
    const genreDistribution = Object.entries(genreCounts).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / totalInfluencers) * 100)
    }));

    const cityCounts = {};
    influencers.forEach(inf => {
      const c = inf.city || 'Other';
      cityCounts[c] = (cityCounts[c] || 0) + 1;
    });
    const cityDistribution = Object.entries(cityCounts)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);

    const tierCounts = { 'Nano': 0, 'Micro': 0, 'Mid-Tier': 0, 'Macro': 0, 'Mega': 0 };
    influencers.forEach(inf => {
      const t = inf.tier || 'Micro';
      tierCounts[t] = (tierCounts[t] || 0) + 1;
    });
    const tierDistribution = Object.entries(tierCounts).map(([tier, count]) => ({ tier, count }));

    const pipelineFunnel = [
      { stage: 'Brand Briefs', count: briefs.length },
      { stage: 'Proposals Generated', count: proposals.length },
      { stage: 'Active Campaigns', count: activeCampaigns },
      { stage: 'Completed Campaigns', count: campaigns.filter(c => c.status === 'Completed').length }
    ];

    return res.json({
      success: true,
      stats: {
        totalInfluencers,
        activeCampaigns,
        totalProposals,
        totalQuotationValue,
        totalAgencyMargin,
        avgMarginPct,
        activeBriefs: briefs.filter(b => b.status !== 'Completed').length
      },
      genreDistribution,
      cityDistribution,
      tierDistribution,
      pipelineFunnel
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
