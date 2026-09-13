import { db } from '../db/database.js';

export const getCampaigns = (req, res) => {
  try {
    const campaigns = db.get('campaigns');
    return res.json({ success: true, count: campaigns.length, campaigns });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getCampaignById = (req, res) => {
  try {
    const { id } = req.params;
    const campaign = db.findById('campaigns', id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    return res.json({ success: true, campaign });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createCampaignFromProposal = (req, res) => {
  try {
    const { proposalId } = req.body;
    const proposal = db.findById('proposals', proposalId);

    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    const defaultMilestones = [
      { id: 'm1', title: 'Creator Onboarding & Agreement Signed', status: 'In-Progress', date: new Date().toISOString().split('T')[0] },
      { id: 'm2', title: 'Product Sample Dispatch', status: 'Pending', date: '' },
      { id: 'm3', title: 'Script & Storyboard Approval', status: 'Pending', date: '' },
      { id: 'm4', title: 'Video Shoot & Internal Draft QC', status: 'Pending', date: '' },
      { id: 'm5', title: 'Client Draft Approval & Scheduling', status: 'Pending', date: '' },
      { id: 'm6', title: 'Live Posting & Collaborative Links', status: 'Pending', date: '' },
      { id: 'm7', title: 'Live Performance Insights & ROI Metrics', status: 'Pending', date: '' },
      { id: 'm8', title: 'Final Invoicing & Settlement', status: 'Pending', date: '' }
    ];

    const creatorMilestones = (proposal.creatorsData || []).map(c => ({
      influencerId: c.influencerId,
      name: c.name,
      handle: c.handle,
      deliverable: Array.isArray(c.selectedDeliverables) ? c.selectedDeliverables.join(', ') : (c.selectedDeliverables || '1x Reel'),
      stage: 'Confirmation Pending',
      draftUrl: '',
      livePostUrl: '',
      views: 0,
      likes: 0,
      comments: 0,
      invoiceStatus: 'Pending',
      notes: ''
    }));

    const newCampaign = db.insert('campaigns', {
      proposalId: proposal.id,
      briefId: proposal.briefId,
      title: proposal.title.replace('Proposal', 'Campaign').replace(/\(v\d+\)/, '').trim(),
      brandName: proposal.clientName,
      status: 'In-Execution',
      totalBudget: proposal.finalClientPrice,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      milestones: defaultMilestones,
      creatorMilestones
    });

    db.update('proposals', proposal.id, { status: 'Approved & Active Campaign' });
    db.log(req.user?.name || 'User', req.user?.role || 'Campaign Manager', 'CAMPAIGN_LAUNCHED', 'Campaign', newCampaign.id, `Launched execution pipeline for campaign: ${newCampaign.title}`);

    return res.status(201).json({ success: true, campaign: newCampaign });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCampaign = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.findById('campaigns', id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    const updated = db.update('campaigns', id, req.body);
    db.log(req.user?.name || 'User', req.user?.role || 'Campaign Manager', 'CAMPAIGN_UPDATED', 'Campaign', id, `Updated campaign execution status for ${updated.title}`);

    return res.json({ success: true, campaign: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCreatorMilestone = (req, res) => {
  try {
    const { id } = req.params;
    const { influencerId, updates } = req.body;
    const campaign = db.findById('campaigns', id);

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    const creatorList = campaign.creatorMilestones || [];
    const idx = creatorList.findIndex(c => c.influencerId === influencerId);

    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Creator not found in this campaign' });
    }

    creatorList[idx] = { ...creatorList[idx], ...updates };
    const updatedCampaign = db.update('campaigns', id, { creatorMilestones: creatorList });

    db.log(req.user?.name || 'User', req.user?.role || 'Campaign Manager', 'CREATOR_MILESTONE_UPDATED', 'Campaign', id, `Updated milestone for ${creatorList[idx].name}: stage -> ${updates.stage || 'updated'}`);

    return res.json({ success: true, campaign: updatedCampaign });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
