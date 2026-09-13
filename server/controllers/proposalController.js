import { db } from '../db/database.js';

export const getProposals = (req, res) => {
  try {
    let proposals = db.get('proposals');
    const userRole = req.user?.role;

    if (userRole === 'Client') {
      proposals = proposals.map(prop => sanitizeProposalForClient(prop));
    }

    return res.json({ success: true, count: proposals.length, proposals });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getProposalById = (req, res) => {
  try {
    const { id } = req.params;
    let proposal = db.findById('proposals', id);

    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    const isClient = req.user?.role === 'Client' || req.query.view === 'client';
    if (isClient) {
      proposal = sanitizeProposalForClient(proposal);
    }

    return res.json({ success: true, proposal });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createProposal = (req, res) => {
  try {
    const body = req.body;
    const creatorsData = body.creatorsData || [];
    const marginPct = Number(body.marginPercentage) || 20;

    let totalCreatorCost = 0;
    const enrichedCreators = creatorsData.map(c => {
      const buyPrice = Number(c.creatorBuyPrice) || 50000;
      const cMargin = Number(c.marginPct) || marginPct;
      const clientPrice = Math.round(buyPrice * (1 + cMargin / 100));
      totalCreatorCost += buyPrice;

      return {
        ...c,
        creatorBuyPrice: buyPrice,
        marginPct: cMargin,
        clientQuotePrice: clientPrice
      };
    });

    const totalAgencyMargin = Math.round(enrichedCreators.reduce((acc, c) => acc + (c.clientQuotePrice - c.creatorBuyPrice), 0));
    const finalClientPrice = totalCreatorCost + totalAgencyMargin;

    const proposalCode = `PROP-${(body.clientName || 'CAMPAIGN').replace(/[^a-zA-Z0-9]/g, '').slice(0, 5).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const newProposal = db.insert('proposals', {
      briefId: body.briefId || null,
      proposalCode,
      title: body.title || 'Influencer Campaign Proposal',
      clientName: body.clientName || 'Client Brand',
      version: 'v1',
      status: body.status || 'Draft',
      marginPercentage: marginPct,
      totalCreatorCost,
      totalAgencyMargin,
      finalClientPrice,
      creatorsData: enrichedCreators,
      notes: body.notes || 'Deliverables include 30-day digital usage rights.',
      createdBy: req.user?.name || 'Agency Team'
    });

    db.log(req.user?.name || 'User', req.user?.role || 'Campaign Manager', 'PROPOSAL_CREATED', 'Proposal', newProposal.id, `Generated proposal ${newProposal.proposalCode} (Total: ₹${finalClientPrice.toLocaleString('en-IN')})`);

    return res.status(201).json({ success: true, proposal: newProposal });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProposal = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.findById('proposals', id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    const body = req.body;
    const creatorsData = body.creatorsData || existing.creatorsData || [];
    const marginPct = body.marginPercentage !== undefined ? Number(body.marginPercentage) : existing.marginPercentage;

    let totalCreatorCost = 0;
    const enrichedCreators = creatorsData.map(c => {
      const buyPrice = Number(c.creatorBuyPrice) || 0;
      const cMargin = c.marginPct !== undefined ? Number(c.marginPct) : marginPct;
      const clientPrice = Math.round(buyPrice * (1 + cMargin / 100));
      totalCreatorCost += buyPrice;

      return {
        ...c,
        creatorBuyPrice: buyPrice,
        marginPct: cMargin,
        clientQuotePrice: clientPrice
      };
    });

    const totalAgencyMargin = Math.round(enrichedCreators.reduce((acc, c) => acc + (c.clientQuotePrice - c.creatorBuyPrice), 0));
    const finalClientPrice = totalCreatorCost + totalAgencyMargin;

    const updated = db.update('proposals', id, {
      ...body,
      marginPercentage: marginPct,
      totalCreatorCost,
      totalAgencyMargin,
      finalClientPrice,
      creatorsData: enrichedCreators
    });

    db.log(req.user?.name || 'User', req.user?.role || 'Campaign Manager', 'PROPOSAL_UPDATED', 'Proposal', id, `Updated proposal ${updated.proposalCode}`);

    return res.json({ success: true, proposal: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createNewVersion = (req, res) => {
  try {
    const { id } = req.params;
    const original = db.findById('proposals', id);

    if (!original) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    const currentVerNum = parseInt((original.version || 'v1').replace('v', ''), 10) || 1;
    const nextVer = `v${currentVerNum + 1}`;

    const newProposal = db.insert('proposals', {
      ...original,
      id: undefined,
      version: nextVer,
      title: `${original.title.replace(/\(v\d+\)/, '').trim()} (${nextVer})`,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    db.log(req.user?.name || 'User', req.user?.role || 'Campaign Manager', 'PROPOSAL_VERSION_CREATED', 'Proposal', newProposal.id, `Created revision ${nextVer} for ${original.proposalCode}`);

    return res.status(201).json({ success: true, proposal: newProposal });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteProposal = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.findById('proposals', id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    db.delete('proposals', id);
    db.log(req.user?.name || 'User', req.user?.role || 'Admin', 'PROPOSAL_DELETED', 'Proposal', id, `Deleted proposal ${existing.proposalCode}`);

    return res.json({ success: true, message: 'Proposal deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

function sanitizeProposalForClient(proposal) {
  return {
    ...proposal,
    totalCreatorCost: undefined,
    totalAgencyMargin: undefined,
    marginPercentage: undefined,
    creatorsData: (proposal.creatorsData || []).map(c => ({
      influencerId: c.influencerId,
      name: c.name,
      handle: c.handle,
      avatar: c.avatar,
      tier: c.tier,
      followers: c.followers,
      genre: c.genre,
      city: c.city,
      selectedDeliverables: c.selectedDeliverables,
      clientQuotePrice: c.clientQuotePrice,
      rationale: c.rationale,
      creatorBuyPrice: undefined,
      marginPct: undefined
    }))
  };
}
