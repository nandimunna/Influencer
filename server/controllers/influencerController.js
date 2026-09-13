import { db } from '../db/database.js';

export const getInfluencers = (req, res) => {
  try {
    let influencers = db.get('influencers');
    const {
      search,
      genre,
      category,
      tier,
      city,
      language,
      minFollowers,
      maxFollowers,
      minViews,
      minER,
      maxBudget,
      minFemalePct,
      sortBy = 'followers_desc'
    } = req.query;

    if (search) {
      const q = search.toLowerCase();
      influencers = influencers.filter(inf =>
        inf.name.toLowerCase().includes(q) ||
        inf.handle.toLowerCase().includes(q) ||
        inf.city.toLowerCase().includes(q) ||
        inf.primaryGenre.toLowerCase().includes(q) ||
        (inf.secondaryGenre && inf.secondaryGenre.toLowerCase().includes(q))
      );
    }

    const targetCategory = category || genre;
    if (targetCategory && targetCategory !== 'All') {
      influencers = influencers.filter(inf =>
        inf.primaryGenre === targetCategory || inf.secondaryGenre === targetCategory
      );
    }

    if (tier && tier !== 'All') {
      influencers = influencers.filter(inf => inf.tier === tier);
    }

    if (city && city !== 'All') {
      influencers = influencers.filter(inf => inf.city === city);
    }

    if (language && language !== 'All') {
      influencers = influencers.filter(inf => inf.languages.includes(language));
    }

    if (minFollowers) {
      influencers = influencers.filter(inf => inf.followerCount >= Number(minFollowers));
    }
    if (maxFollowers) {
      influencers = influencers.filter(inf => inf.followerCount <= Number(maxFollowers));
    }

    if (minViews) {
      influencers = influencers.filter(inf => (inf.avgViews || 0) >= Number(minViews));
    }

    if (minER) {
      influencers = influencers.filter(inf => inf.engagementRate >= Number(minER));
    }

    if (minFemalePct) {
      influencers = influencers.filter(inf => (inf.genderDemographics?.femalePct || 0) >= Number(minFemalePct));
    }

    if (maxBudget) {
      influencers = influencers.filter(inf => (inf.pricing?.reelWithDR || inf.pricing?.reel || 0) <= Number(maxBudget));
    }

    if (sortBy === 'followers_desc') {
      influencers.sort((a, b) => b.followerCount - a.followerCount);
    } else if (sortBy === 'followers_asc') {
      influencers.sort((a, b) => a.followerCount - b.followerCount);
    } else if (sortBy === 'views_desc') {
      influencers.sort((a, b) => (b.avgViews || 0) - (a.avgViews || 0));
    } else if (sortBy === 'er_desc') {
      influencers.sort((a, b) => b.engagementRate - a.engagementRate);
    } else if (sortBy === 'female_desc') {
      influencers.sort((a, b) => (b.genderDemographics?.femalePct || 0) - (a.genderDemographics?.femalePct || 0));
    } else if (sortBy === 'rating_desc') {
      influencers.sort((a, b) => (b.internalRating || 0) - (a.internalRating || 0));
    } else if (sortBy === 'price_asc') {
      influencers.sort((a, b) => (a.pricing?.reelWithDR || a.pricing?.reel || 0) - (b.pricing?.reelWithDR || b.pricing?.reel || 0));
    } else if (sortBy === 'price_desc') {
      influencers.sort((a, b) => (b.pricing?.reelWithDR || b.pricing?.reel || 0) - (a.pricing?.reelWithDR || a.pricing?.reel || 0));
    }

    const userRole = req.user?.role;
    if (userRole === 'Client') {
      influencers = influencers.map(inf => ({
        ...inf,
        phone: 'REDACTED (Direct Contact Hidden)',
        whatsapp: 'REDACTED',
        email: 'partnerships@nexcreator.io (Managed)',
        internalNotes: undefined,
        pricingHistory: undefined
      }));
    }

    return res.json({
      success: true,
      count: influencers.length,
      influencers
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getInfluencerById = (req, res) => {
  try {
    const { id } = req.params;
    let influencer = db.findById('influencers', id);

    if (!influencer) {
      return res.status(404).json({ success: false, message: 'Influencer not found' });
    }

    if (req.user?.role === 'Client') {
      influencer = {
        ...influencer,
        phone: 'REDACTED (Direct Contact Hidden)',
        whatsapp: 'REDACTED',
        email: 'partnerships@nexcreator.io (Managed)',
        internalNotes: undefined,
        pricingHistory: undefined
      };
    }

    return res.json({ success: true, influencer });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const checkDuplicates = (req, res) => {
  try {
    const { handle, email, phone, excludeId } = req.body;
    const influencers = db.get('influencers');

    const duplicates = influencers.filter(inf => {
      if (excludeId && inf.id === excludeId) return false;
      const matchHandle = handle && inf.handle.toLowerCase().replace('@', '') === handle.toLowerCase().replace('@', '');
      const matchEmail = email && inf.email.toLowerCase() === email.toLowerCase();
      const matchPhone = phone && inf.phone.replace(/[\s\-\+]/g, '') === phone.replace(/[\s\-\+]/g, '');
      return matchHandle || matchEmail || matchPhone;
    });

    return res.json({
      success: true,
      hasDuplicate: duplicates.length > 0,
      duplicates: duplicates.map(d => ({ id: d.id, name: d.name, handle: d.handle }))
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createInfluencer = (req, res) => {
  try {
    const body = req.body;
    const influencers = db.get('influencers');

    const duplicate = influencers.find(inf =>
      inf.handle.toLowerCase().replace('@', '') === (body.handle || '').toLowerCase().replace('@', '') ||
      (body.email && inf.email && inf.email.toLowerCase() === body.email.toLowerCase())
    );

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: `Influencer with handle ${body.handle} already exists in database.`
      });
    }

    const followers = Number(body.followerCount) || 0;
    let tier = 'Nano';
    if (followers >= 1000000) tier = 'Mega';
    else if (followers >= 500000) tier = 'Macro';
    else if (followers >= 100000) tier = 'Mid-Tier';
    else if (followers >= 10000) tier = 'Micro';

    const cleanHandle = body.handle.startsWith('@') ? body.handle : `@${body.handle}`;
    const igLink = body.igLink || `https://www.instagram.com/${cleanHandle.replace('@', '')}/`;

    const newInf = db.insert('influencers', {
      ...body,
      handle: cleanHandle,
      igLink,
      followerCount: followers,
      tier: body.tier || tier,
      engagementRate: Number(body.engagementRate) || 3.5,
      avgViews: Number(body.avgViews) || Math.round(followers * 0.25),
      internalRating: Number(body.internalRating) || 4.8,
      languages: Array.isArray(body.languages) ? body.languages : ['Tamil', 'English'],
      genderDemographics: body.genderDemographics || { femalePct: 75.0, malePct: 25.0 },
      pricing: {
        reel: Number(body.pricing?.reel || body.pricingReel || 50000),
        reelWithDR: Number(body.pricing?.reelWithDR || body.pricingReelWithDR || body.pricing?.reel || 50000),
        story: Number(body.pricing?.story || body.pricingStory || 15000),
        staticPost: Number(body.pricing?.staticPost || body.pricingStatic || 25000),
        comboPackage: Math.round((Number(body.pricing?.reel || body.pricingReel || 50000)) * 2.2)
      },
      pricingHistory: [
        { date: new Date().toISOString().split('T')[0], reel: body.pricing?.reel || 50000 }
      ],
      documents: body.documents || [],
      previousCampaigns: body.previousCampaigns || []
    });

    db.log(req.user?.name || 'System', req.user?.role || 'Admin', 'INFLUENCER_CREATED', 'Influencer', newInf.id, `Created influencer profile: ${newInf.name} (${newInf.handle})`);

    return res.status(201).json({ success: true, influencer: newInf });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const bulkImportInfluencers = (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No creator rows found in import.' });
    }

    const currentInfluencers = db.get('influencers');
    const existingHandles = new Set(currentInfluencers.map(i => i.handle.toLowerCase().replace('@', '')));
    let importedCount = 0;
    let skippedCount = 0;

    items.forEach(raw => {
      let followers = 0;
      const rawFollowers = String(raw.followerCount || raw['IG followers'] || raw.followers || '0').trim().toUpperCase();
      if (rawFollowers.endsWith('M')) {
        followers = Math.round(parseFloat(rawFollowers) * 1000000);
      } else if (rawFollowers.endsWith('K')) {
        followers = Math.round(parseFloat(rawFollowers) * 1000);
      } else {
        followers = parseInt(rawFollowers.replace(/[^0-9]/g, ''), 10) || 100000;
      }

      let er = 0;
      const rawER = String(raw.engagementRate || raw.Eng || raw.er || '3.5').replace('%', '').trim();
      er = parseFloat(rawER) || 3.5;
      if (er < 0.1 && er > 0) er = Number((er * 100).toFixed(2));

      const rawPrice = String(raw.pricingReel || raw['1 reel + DR'] || raw.price || '50000').replace(/[^0-9]/g, '');
      const reelPrice = parseInt(rawPrice, 10) || 50000;

      let handle = raw.handle || '';
      const igLink = raw.igLink || raw['IG Link'] || '';
      if (!handle && igLink) {
        const match = igLink.match(/instagram\.com\/([a-zA-Z0-9_\.]+)/);
        if (match) handle = `@${match[1].replace(/\/$/, '')}`;
      }
      if (!handle) handle = `@creator_${Date.now().toString(36)}`;
      if (!handle.startsWith('@')) handle = `@${handle}`;

      const handleKey = handle.toLowerCase().replace('@', '');
      if (existingHandles.has(handleKey)) {
        skippedCount++;
        return;
      }

      const fPct = parseFloat(String(raw.femalePct || raw['F%'] || '75').replace('%', '')) || 75;
      const mPct = parseFloat(String(raw.malePct || raw['M%'] || '25').replace('%', '')) || (100 - fPct);

      let tier = 'Nano';
      if (followers >= 1000000) tier = 'Mega';
      else if (followers >= 500000) tier = 'Macro';
      else if (followers >= 100000) tier = 'Mid-Tier';
      else if (followers >= 10000) tier = 'Micro';

      const newCreator = {
        name: raw.name || raw.Name || 'Creator Profile',
        handle,
        igLink: igLink || `https://www.instagram.com/${handle.replace('@', '')}/`,
        avatar: raw.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        phone: raw.phone || '+91 98400 00000',
        whatsapp: raw.whatsapp || '919840000000',
        email: raw.email || `${handle.replace('@', '')}@management.com`,
        city: raw.city || raw.City || 'Chennai',
        state: raw.state || 'Tamil Nadu',
        languages: Array.isArray(raw.languages) ? raw.languages : [raw.language || raw.Language || 'Tamil'],
        primaryGenre: raw.primaryGenre || raw.category || raw.Category || 'Mom & Lifestyle',
        secondaryGenre: raw.secondaryGenre || 'Lifestyle',
        followerCount: followers,
        tier,
        avgViews: parseInt(String(raw.avgViews || raw['Avg Views'] || Math.round(followers * 0.3)).replace(/[^0-9]/g, ''), 10) || 100000,
        engagementRate: er,
        genderDemographics: { femalePct: fPct, malePct: mPct },
        pricing: {
          reel: reelPrice,
          reelWithDR: reelPrice,
          story: Math.round(reelPrice * 0.3),
          staticPost: Math.round(reelPrice * 0.45),
          comboPackage: Math.round(reelPrice * 1.35)
        },
        internalRating: Number(raw.internalRating) || 4.8,
        internalNotes: raw.internalNotes || 'Imported via Excel dataset.',
        verified: followers > 300000
      };

      db.insert('influencers', newCreator);
      existingHandles.add(handleKey);
      importedCount++;
    });

    db.log(req.user?.name || 'System', req.user?.role || 'Admin', 'BULK_IMPORT', 'Influencer', 'bulk', `Imported ${importedCount} creators from Excel spreadsheet.`);

    return res.json({
      success: true,
      importedCount,
      skippedCount,
      totalNow: db.get('influencers').length
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateInfluencer = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.findById('influencers', id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Influencer not found' });
    }

    const updates = { ...req.body };

    if (updates.pricing && JSON.stringify(updates.pricing) !== JSON.stringify(existing.pricing)) {
      const history = existing.pricingHistory || [];
      history.push({
        date: new Date().toISOString().split('T')[0],
        ...updates.pricing
      });
      updates.pricingHistory = history;
    }

    const updated = db.update('influencers', id, updates);
    db.log(req.user?.name || 'System', req.user?.role || 'Admin', 'INFLUENCER_UPDATED', 'Influencer', id, `Updated profile for ${updated.name}`);

    return res.json({ success: true, influencer: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteInfluencer = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.findById('influencers', id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Influencer not found' });
    }

    db.delete('influencers', id);
    db.log(req.user?.name || 'Admin', req.user?.role || 'Admin', 'INFLUENCER_DELETED', 'Influencer', id, `Deleted influencer ${existing.name}`);

    return res.json({ success: true, message: 'Influencer removed successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getFilterOptions = (req, res) => {
  try {
    const influencers = db.get('influencers');
    const cities = [...new Set(influencers.map(i => i.city))].filter(Boolean);
    const genres = [...new Set(influencers.flatMap(i => [i.primaryGenre, i.secondaryGenre]))].filter(Boolean);
    const languages = [...new Set(influencers.flatMap(i => i.languages || []))].filter(Boolean);
    const tiers = ['Nano', 'Micro', 'Mid-Tier', 'Macro', 'Mega'];

    return res.json({
      success: true,
      options: { cities, genres, languages, tiers }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
