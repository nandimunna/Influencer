const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('nex_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
}

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },
  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },
  getDemoUsers: async () => {
    const res = await fetch(`${API_BASE}/auth/demo-users`);
    return handleResponse(res);
  },

  // Influencers
  getInfluencers: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/influencers?${query}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },
  getInfluencerById: async (id) => {
    const res = await fetch(`${API_BASE}/influencers/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },
  getFilterOptions: async () => {
    const res = await fetch(`${API_BASE}/influencers/filters`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },
  checkDuplicates: async (data) => {
    const res = await fetch(`${API_BASE}/influencers/check-duplicate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  bulkImportInfluencers: async (items) => {
    const res = await fetch(`${API_BASE}/influencers/bulk-import`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ items })
    });
    return handleResponse(res);
  },
  createInfluencer: async (data) => {
    const res = await fetch(`${API_BASE}/influencers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  updateInfluencer: async (id, data) => {
    const res = await fetch(`${API_BASE}/influencers/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  deleteInfluencer: async (id) => {
    const res = await fetch(`${API_BASE}/influencers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Brand Briefs
  getBriefs: async () => {
    const res = await fetch(`${API_BASE}/briefs`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },
  getBriefById: async (id) => {
    const res = await fetch(`${API_BASE}/briefs/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },
  createBrief: async (data) => {
    const res = await fetch(`${API_BASE}/briefs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  updateBrief: async (id, data) => {
    const res = await fetch(`${API_BASE}/briefs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  deleteBrief: async (id) => {
    const res = await fetch(`${API_BASE}/briefs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // AI Matching
  matchInfluencers: async (briefId) => {
    const res = await fetch(`${API_BASE}/ai/match/${briefId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },
  matchCustom: async (briefData) => {
    const res = await fetch(`${API_BASE}/ai/match-custom`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(briefData)
    });
    return handleResponse(res);
  },

  // Proposals
  getProposals: async () => {
    const res = await fetch(`${API_BASE}/proposals`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },
  getProposalById: async (id, view) => {
    const url = view ? `${API_BASE}/proposals/${id}?view=${view}` : `${API_BASE}/proposals/${id}`;
    const res = await fetch(url, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },
  createProposal: async (data) => {
    const res = await fetch(`${API_BASE}/proposals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  updateProposal: async (id, data) => {
    const res = await fetch(`${API_BASE}/proposals/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  createNewProposalVersion: async (id) => {
    const res = await fetch(`${API_BASE}/proposals/${id}/new-version`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },
  deleteProposal: async (id) => {
    const res = await fetch(`${API_BASE}/proposals/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Campaigns
  getCampaigns: async () => {
    const res = await fetch(`${API_BASE}/campaigns`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },
  getCampaignById: async (id) => {
    const res = await fetch(`${API_BASE}/campaigns/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },
  launchCampaignFromProposal: async (proposalId) => {
    const res = await fetch(`${API_BASE}/campaigns/launch-from-proposal`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ proposalId })
    });
    return handleResponse(res);
  },
  updateCampaign: async (id, data) => {
    const res = await fetch(`${API_BASE}/campaigns/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  updateCreatorMilestone: async (id, influencerId, updates) => {
    const res = await fetch(`${API_BASE}/campaigns/${id}/creator-milestone`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ influencerId, updates })
    });
    return handleResponse(res);
  },

  // Analytics & Admin
  getDashboardAnalytics: async () => {
    const res = await fetch(`${API_BASE}/analytics/dashboard`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },
  getAuditLogs: async () => {
    const res = await fetch(`${API_BASE}/admin/audit-logs`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};
