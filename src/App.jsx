import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { InfluencerList } from './components/influencers/InfluencerList';
import { BrandBriefList } from './components/briefs/BrandBriefList';
import { AIMatchingView } from './components/matching/AIMatchingView';
import { ProposalList } from './components/proposals/ProposalList';
import { ProposalBuilder } from './components/proposals/ProposalBuilder';
import { CampaignList } from './components/campaigns/CampaignList';
import { CampaignDetailView } from './components/campaigns/CampaignDetailView';
import { AdminSettingsView } from './components/admin/AdminSettingsView';
import { LoginView } from './components/auth/LoginView';

function MainLayout() {
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('influencers');

  const [targetBriefForAIMatch, setTargetBriefForAIMatch] = useState(null);
  const [preloadedProposalData, setPreloadedProposalData] = useState(null);
  const [isBuildingProposal, setIsBuildingProposal] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center animate-pulse shadow-xl shadow-purple-600/30">
          <span className="text-white font-extrabold text-lg">N</span>
        </div>
        <div className="text-xs text-slate-400 font-medium">Initializing NexCreator Platform...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginView onLoginSuccess={() => setActiveTab('influencers')} />;
  }

  const handleRunAIMatchFromBrief = (brief) => {
    setTargetBriefForAIMatch(brief);
    setActiveTab('ai_matching');
  };

  const handleBuildProposalFromMatches = (data) => {
    setPreloadedProposalData(data);
    setIsBuildingProposal(true);
    setActiveTab('proposals');
  };

  const handleOpenProposalBuilder = (data) => {
    setPreloadedProposalData(data);
    setIsBuildingProposal(true);
  };

  const handleCampaignLaunched = (campaign) => {
    setSelectedCampaignId(campaign.id);
    setIsBuildingProposal(false);
    setActiveTab('campaigns');
  };

  const handleSelectCampaign = (id) => {
    setSelectedCampaignId(id);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab !== 'proposals') {
      setIsBuildingProposal(false);
    }
    if (tab !== 'campaigns') {
      setSelectedCampaignId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col font-sans text-slate-100 antialiased selection:bg-purple-500 selection:text-white">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={handleTabChange} 
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView onNavigate={handleTabChange} />
          )}

          {activeTab === 'influencers' && (
            <InfluencerList 
              onOpenProposalWithCreators={(selectedList) => {
                const preloaded = {
                  brief: null,
                  creators: selectedList.map(inf => ({
                    influencerId: inf.id,
                    name: inf.name,
                    handle: inf.handle,
                    avatar: inf.avatar,
                    tier: inf.tier,
                    followers: inf.followerCount,
                    genre: inf.primaryGenre,
                    city: inf.city,
                    creatorBuyPrice: inf.pricing?.reelWithDR || inf.pricing?.reel || 50000,
                    marginPct: 20,
                    selectedDeliverables: ['1x Reel + Direct Rights (DR)'],
                    rationale: `${inf.name} delivers strong engagement (${inf.engagementRate}%) in ${inf.city}.`
                  }))
                };
                handleBuildProposalFromMatches(preloaded);
              }}
            />
          )}

          {activeTab === 'briefs' && (
            <BrandBriefList 
              onRunAIMatch={handleRunAIMatchFromBrief}
            />
          )}

          {activeTab === 'ai_matching' && (
            <AIMatchingView 
              initialBrief={targetBriefForAIMatch}
              onBuildProposalFromMatches={handleBuildProposalFromMatches}
            />
          )}

          {activeTab === 'proposals' && (
            isBuildingProposal ? (
              <ProposalBuilder 
                preloadedData={preloadedProposalData}
                onBack={() => setIsBuildingProposal(false)}
                onCampaignLaunched={handleCampaignLaunched}
              />
            ) : (
              <ProposalList 
                onOpenBuilder={handleOpenProposalBuilder}
                onLaunchCampaign={handleCampaignLaunched}
              />
            )
          )}

          {activeTab === 'campaigns' && (
            selectedCampaignId ? (
              <CampaignDetailView 
                campaignId={selectedCampaignId}
                onBack={() => setSelectedCampaignId(null)}
              />
            ) : (
              <CampaignList 
                onSelectCampaign={handleSelectCampaign}
              />
            )
          )}

          {activeTab === 'admin' && (
            <AdminSettingsView />
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
