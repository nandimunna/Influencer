import { db } from '../db/database.js';

export const getBriefs = (req, res) => {
  try {
    const briefs = db.get('brandBriefs');
    return res.json({ success: true, count: briefs.length, briefs });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getBriefById = (req, res) => {
  try {
    const { id } = req.params;
    const brief = db.findById('brandBriefs', id);
    if (!brief) {
      return res.status(404).json({ success: false, message: 'Brand brief not found' });
    }
    return res.json({ success: true, brief });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createBrief = (req, res) => {
  try {
    const body = req.body;
    if (!body.brandName || !body.campaignTitle) {
      return res.status(400).json({ success: false, message: 'Brand name and campaign title are required.' });
    }

    const newBrief = db.insert('brandBriefs', {
      ...body,
      status: body.status || 'Draft',
      targetCities: body.targetCities || [],
      targetLanguages: body.targetLanguages || ['English', 'Hindi', 'Tamil'],
      creatorTiers: body.creatorTiers || ['Micro', 'Macro'],
      genres: body.genres || ['Mom & Lifestyle'],
      totalBudget: Number(body.totalBudget) || 1000000,
      deliverables: body.deliverables || { reelsCount: 5, storiesCount: 10 }
    });

    db.log(req.user?.name || 'User', req.user?.role || 'Campaign Manager', 'BRIEF_CREATED', 'BrandBrief', newBrief.id, `Created brand brief: "${newBrief.campaignTitle}" for ${newBrief.brandName}`);

    return res.status(201).json({ success: true, brief: newBrief });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateBrief = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.findById('brandBriefs', id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Brand brief not found' });
    }

    const updated = db.update('brandBriefs', id, req.body);
    db.log(req.user?.name || 'User', req.user?.role || 'Campaign Manager', 'BRIEF_UPDATED', 'BrandBrief', id, `Updated brief "${updated.campaignTitle}"`);

    return res.json({ success: true, brief: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteBrief = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.findById('brandBriefs', id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Brand brief not found' });
    }

    db.delete('brandBriefs', id);
    db.log(req.user?.name || 'User', req.user?.role || 'Admin', 'BRIEF_DELETED', 'BrandBrief', id, `Deleted brand brief "${existing.campaignTitle}"`);

    return res.json({ success: true, message: 'Brand brief deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
