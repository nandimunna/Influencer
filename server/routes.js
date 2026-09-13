import express from 'express';
import * as authCtrl from './controllers/authController.js';
import * as infCtrl from './controllers/influencerController.js';
import * as briefCtrl from './controllers/briefController.js';
import * as aiCtrl from './controllers/aiMatchController.js';
import * as propCtrl from './controllers/proposalController.js';
import * as campCtrl from './controllers/campaignController.js';
import * as analCtrl from './controllers/analyticsController.js';
import * as auditCtrl from './controllers/auditController.js';
import { authenticate, requireRoles } from './middleware/auth.js';

const router = express.Router();

// Auth routes
router.post('/auth/login', authCtrl.login);
router.get('/auth/me', authenticate, authCtrl.getCurrentUser);
router.get('/auth/demo-users', authCtrl.getDemoUsers);

// Influencer routes
router.get('/influencers', authenticate, infCtrl.getInfluencers);
router.get('/influencers/filters', authenticate, infCtrl.getFilterOptions);
router.get('/influencers/:id', authenticate, infCtrl.getInfluencerById);
router.post('/influencers/check-duplicate', authenticate, infCtrl.checkDuplicates);
router.post('/influencers/bulk-import', authenticate, requireRoles('Admin', 'Campaign Manager', 'Agency Member'), infCtrl.bulkImportInfluencers);
router.post('/influencers', authenticate, requireRoles('Admin', 'Campaign Manager', 'Agency Member'), infCtrl.createInfluencer);
router.put('/influencers/:id', authenticate, requireRoles('Admin', 'Campaign Manager', 'Agency Member'), infCtrl.updateInfluencer);
router.delete('/influencers/:id', authenticate, requireRoles('Admin'), infCtrl.deleteInfluencer);

// Brand Brief routes
router.get('/briefs', authenticate, briefCtrl.getBriefs);
router.get('/briefs/:id', authenticate, briefCtrl.getBriefById);
router.post('/briefs', authenticate, requireRoles('Admin', 'Campaign Manager', 'Agency Member'), briefCtrl.createBrief);
router.put('/briefs/:id', authenticate, requireRoles('Admin', 'Campaign Manager', 'Agency Member'), briefCtrl.updateBrief);
router.delete('/briefs/:id', authenticate, requireRoles('Admin', 'Campaign Manager'), briefCtrl.deleteBrief);

// AI Matching routes
router.get('/ai/match/:briefId', authenticate, aiCtrl.matchInfluencersForBrief);
router.post('/ai/match-custom', authenticate, aiCtrl.matchByCustomCriteria);

// Proposal routes
router.get('/proposals', authenticate, propCtrl.getProposals);
router.get('/proposals/:id', authenticate, propCtrl.getProposalById);
router.post('/proposals', authenticate, requireRoles('Admin', 'Campaign Manager', 'Agency Member'), propCtrl.createProposal);
router.put('/proposals/:id', authenticate, requireRoles('Admin', 'Campaign Manager', 'Agency Member'), propCtrl.updateProposal);
router.post('/proposals/:id/new-version', authenticate, requireRoles('Admin', 'Campaign Manager'), propCtrl.createNewVersion);
router.delete('/proposals/:id', authenticate, requireRoles('Admin'), propCtrl.deleteProposal);

// Campaign Pipeline routes
router.get('/campaigns', authenticate, campCtrl.getCampaigns);
router.get('/campaigns/:id', authenticate, campCtrl.getCampaignById);
router.post('/campaigns/launch-from-proposal', authenticate, requireRoles('Admin', 'Campaign Manager'), campCtrl.createCampaignFromProposal);
router.put('/campaigns/:id', authenticate, requireRoles('Admin', 'Campaign Manager'), campCtrl.updateCampaign);
router.put('/campaigns/:id/creator-milestone', authenticate, requireRoles('Admin', 'Campaign Manager', 'Agency Member'), campCtrl.updateCreatorMilestone);

// Analytics & Audit
router.get('/analytics/dashboard', authenticate, analCtrl.getDashboardAnalytics);
router.get('/admin/audit-logs', authenticate, requireRoles('Admin', 'Campaign Manager'), auditCtrl.getAuditLogs);

export default router;
