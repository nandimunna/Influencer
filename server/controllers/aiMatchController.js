import { db } from '../db/database.js';

export const matchInfluencersForBrief = (req, res) => {
  try {
    const { briefId } = req.params;
    const brief = db.findById('brandBriefs', briefId);

    if (!brief) {
      return res.status(404).json({ success: false, message: 'Brand brief not found' });
    }

    const influencers = db.get('influencers');
    const matchedResults = influencers.map(creator => {
      return evaluateCreatorMatch(creator, brief);
    });

    matchedResults.sort((a, b) => b.overallScore - a.overallScore);
    const recommended = matchedResults.filter(r => r.overallScore >= 40);

    return res.json({
      success: true,
      brief: {
        id: brief.id,
        brandName: brief.brandName,
        campaignTitle: brief.campaignTitle,
        totalBudget: brief.totalBudget,
        genres: brief.genres,
        targetCities: brief.targetCities,
        creatorTiers: brief.creatorTiers
      },
      matchCount: recommended.length,
      recommendations: recommended
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const matchByCustomCriteria = (req, res) => {
  try {
    const customBrief = req.body;
    const influencers = db.get('influencers');

    const matchedResults = influencers.map(creator => {
      return evaluateCreatorMatch(creator, customBrief);
    });

    matchedResults.sort((a, b) => b.overallScore - a.overallScore);
    const recommended = matchedResults.filter(r => r.overallScore >= 35);

    return res.json({
      success: true,
      matchCount: recommended.length,
      recommendations: recommended
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

function evaluateCreatorMatch(creator, brief) {
  let genreScore = 0;
  let cityScore = 0;
  let languageScore = 0;
  let tierScore = 0;
  let budgetScore = 0;
  let performanceScore = 0;
  let reliabilityScore = 0;

  const reasons = [];
  const flags = [];

  const targetGenres = brief.genres || [];
  if (targetGenres.length === 0) {
    genreScore = 20;
  } else if (targetGenres.includes(creator.primaryGenre)) {
    genreScore = 25;
    reasons.push(`Primary vertical "${creator.primaryGenre}" directly matches campaign focus.`);
  } else if (targetGenres.includes(creator.secondaryGenre)) {
    genreScore = 18;
    reasons.push(`Secondary vertical "${creator.secondaryGenre}" aligns with campaign theme.`);
  } else {
    genreScore = 5;
    flags.push(`Genre mismatch (${creator.primaryGenre} vs ${targetGenres.join(', ')})`);
  }

  const targetCities = brief.targetCities || [];
  const topAudienceCities = creator.audienceDemographics?.topCities || [];
  if (targetCities.length === 0) {
    cityScore = 15;
  } else if (targetCities.includes(creator.city)) {
    cityScore = 15;
    reasons.push(`Based locally in target market ${creator.city} with high regional authority.`);
  } else if (targetCities.some(c => topAudienceCities.includes(c))) {
    cityScore = 12;
    reasons.push(`Strong audience concentration in target hub (${topAudienceCities.filter(c => targetCities.includes(c)).join(', ')}).`);
  } else {
    cityScore = 5;
  }

  const targetLanguages = brief.targetLanguages || [];
  const creatorLangs = creator.languages || [];
  if (targetLanguages.length === 0) {
    languageScore = 15;
  } else {
    const commonLangs = creatorLangs.filter(l => targetLanguages.includes(l));
    if (commonLangs.length >= 2) {
      languageScore = 15;
      reasons.push(`Fluent in multiple campaign languages (${commonLangs.join(', ')}).`);
    } else if (commonLangs.length === 1) {
      languageScore = 11;
      reasons.push(`Reaches target linguistic cohort in ${commonLangs[0]}.`);
    } else {
      languageScore = 3;
    }
  }

  const targetTiers = brief.creatorTiers || [];
  if (targetTiers.length === 0 || targetTiers.includes(creator.tier)) {
    tierScore = 15;
    reasons.push(`Tier (${creator.tier} ~ ${(creator.followerCount / 1000).toFixed(0)}k followers) matches targeted campaign tier.`);
  } else {
    tierScore = 7;
  }

  const totalBudget = Number(brief.totalBudget) || 1000000;
  const targetDeliverablesCount = (brief.deliverables?.reelsCount || 4) + (brief.deliverables?.youtubeIntegratedCount || 1);
  const avgCreatorBudgetCap = totalBudget / Math.max(1, targetDeliverablesCount);
  const creatorReelRate = creator.pricing?.reelWithDR || creator.pricing?.reel || 50000;

  if (creatorReelRate <= avgCreatorBudgetCap) {
    budgetScore = 15;
    reasons.push(`Commercial rate (₹${creatorReelRate.toLocaleString('en-IN')}) fits comfortably within per-creator allocation.`);
  } else if (creatorReelRate <= avgCreatorBudgetCap * 1.35) {
    budgetScore = 10;
    reasons.push(`Rate slightly premium (₹${creatorReelRate.toLocaleString('en-IN')}) but justifiable given reach.`);
  } else {
    budgetScore = 4;
    flags.push(`Rate card (₹${creatorReelRate.toLocaleString('en-IN')}) requires margin negotiation.`);
  }

  const er = creator.engagementRate || 3.0;
  if (er >= 6.0) {
    performanceScore = 10;
    reasons.push(`Outstanding engagement rate of ${er}% (industry benchmark: 2.5-3.5%).`);
  } else if (er >= 4.5) {
    performanceScore = 8;
    reasons.push(`Healthy engagement rate of ${er}%.`);
  } else if (er >= 3.0) {
    performanceScore = 6;
  } else {
    performanceScore = 3;
  }

  const rating = creator.internalRating || 4.0;
  if (rating >= 4.8) {
    reliabilityScore = 5;
    reasons.push(`Top internal agency reliability rating (${rating}/5.0).`);
  } else if (rating >= 4.5) {
    reliabilityScore = 4;
  } else {
    reliabilityScore = 2;
  }

  const overallScore = Math.min(100, Math.round(
    genreScore + cityScore + languageScore + tierScore + budgetScore + performanceScore + reliabilityScore
  ));

  const rationale = generateAIRationale(creator, brief, overallScore, reasons);

  return {
    influencer: creator,
    overallScore,
    breakdown: {
      genre: { score: genreScore, max: 25 },
      city: { score: cityScore, max: 15 },
      language: { score: languageScore, max: 15 },
      tier: { score: tierScore, max: 15 },
      budget: { score: budgetScore, max: 15 },
      performance: { score: performanceScore, max: 10 },
      reliability: { score: reliabilityScore, max: 5 }
    },
    keyStrengths: reasons.slice(0, 3),
    flags,
    aiRationale: rationale
  };
}

function generateAIRationale(creator, brief, score, reasons) {
  if (score >= 85) {
    return `🔥 High-Priority Recommendation (${score}% Match): ${creator.name} is exceptionally well-suited for ${brief.brandName || 'this campaign'}. ${reasons.slice(0, 2).join(' ')} Expect strong community resonance.`;
  } else if (score >= 70) {
    return `⚡ Recommended Match (${score}%): Strong contender for the media plan. ${reasons[0] || ''} Deliverable pricing is aligned with campaign ROI benchmarks.`;
  } else {
    return `💡 Potential Complement (${score}%): Recommended as a secondary tier or regional niche addition.`;
  }
}
