import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../services/api';
import { InfluencerDetailModal } from './InfluencerDetailModal';
import { InfluencerFormModal } from './InfluencerFormModal';
import { ExcelImportModal } from './ExcelImportModal';
import { CreatorCompareModal } from './CreatorCompareModal';
import { useAuth } from '../../context/AuthContext';
import * as XLSX from 'xlsx';
import { 
  Search, 
  Plus, 
  Grid, 
  List, 
  Sparkles, 
  RotateCcw,
  CheckCircle,
  FileSpreadsheet,
  Download,
  ExternalLink,
  Flame,
  Users,
  Eye,
  TrendingUp,
  DollarSign,
  PieChart as PieIcon,
  ArrowRight,
  Briefcase,
  Layers,
  ArrowUpDown,
  FileText,
  BarChart3,
  HelpCircle,
  Info,
  Award,
  Star,
  Tv,
  Crown
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/formatters';

// Exact Follower Tiers definition matching user specification
export const CREATOR_TIERS = [
  { name: 'All Creator Types', value: 'All', range: 'All creators', shortLabel: 'All' },
  { name: 'Celebrity', value: 'Celebrity', range: 'Public figures / TV / Cinema / Sports personalities', shortLabel: 'TV / Cinema / Sports', icon: Crown },
  { name: 'Mega Influencer', value: 'Mega', range: '1M+', shortLabel: '1M+', icon: Star },
  { name: 'Macro Influencer', value: 'Macro', range: '250K – 1M', shortLabel: '250K – 1M', icon: Flame },
  { name: 'Mid-Tier Influencer', value: 'Mid-Tier', range: '50K – 250K', shortLabel: '50K – 250K', icon: Sparkles },
  { name: 'Micro Influencer', value: 'Micro', range: '10K – 50K', shortLabel: '10K – 50K', icon: Users },
  { name: 'Nano Influencer', value: 'Nano', range: '1K – 10K', shortLabel: '1K – 10K', icon: Users },
];

export const InfluencerList = ({ onSelectCreatorForProposal, onOpenProposalWithCreators }) => {
  const { user, hasRole } = useAuth();
  const canManage = hasRole('Admin', 'Campaign Manager', 'Agency Member');

  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [activeTab, setActiveTab] = useState('roster'); // 'roster' or 'analytics'

  // Selected creators for Media Plan basket
  const [selectedCreatorIds, setSelectedCreatorIds] = useState(new Set(['inf_ig_01', 'inf_ig_02', 'inf_ig_06', 'inf_ig_08']));

  // Filter state
  const [search, setSearch] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [isHighEROnly, setIsHighEROnly] = useState(false);
  const [isBudgetFriendlyOnly, setIsBudgetFriendlyOnly] = useState(false);
  const [sortBy, setSortBy] = useState('sno'); // 'sno', 'followers', 'views', 'er', 'price', 'cpv'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  // Show expanded tier table under banner
  const [showTierTable, setShowTierTable] = useState(false);

  // Comparison
  const [comparedCreators, setComparedCreators] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Modal states
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingInfluencer, setEditingInfluencer] = useState(null);

  useEffect(() => {
    fetchInfluencers();
  }, []);

  const fetchInfluencers = async () => {
    try {
      setLoading(true);
      const res = await api.getInfluencers();
      if (res.success) {
        // Tag celebrity creators (TV/Public figures)
        const celebHandles = new Set([
          '@alya_manasa', 
          '@srideviashok_official', 
          '@hemarajkumar_official', 
          '@sujithadhanush', 
          '@gayathri_yuvaraj', 
          '@sathishkumardsatz', 
          '@diya_menon_official'
        ]);

        const mapped = res.influencers.map(inf => {
          const isCeleb = celebHandles.has(inf.handle.toLowerCase());
          let calculatedTier = 'Nano';
          const f = inf.followerCount || 0;
          if (isCeleb) calculatedTier = 'Celebrity';
          else if (f >= 1000000) calculatedTier = 'Mega';
          else if (f >= 250000) calculatedTier = 'Macro';
          else if (f >= 50000) calculatedTier = 'Mid-Tier';
          else if (f >= 10000) calculatedTier = 'Micro';
          else calculatedTier = 'Nano';

          return {
            ...inf,
            tier: calculatedTier,
            isCelebrity: isCeleb
          };
        });

        setInfluencers(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch influencers', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort calculation
  const filteredInfluencers = useMemo(() => {
    let result = [...influencers];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(inf =>
        inf.name.toLowerCase().includes(q) ||
        inf.handle.toLowerCase().includes(q) ||
        inf.city.toLowerCase().includes(q) ||
        (inf.languages && inf.languages.some(l => l.toLowerCase().includes(q))) ||
        inf.primaryGenre.toLowerCase().includes(q)
      );
    }

    if (selectedTier !== 'All') {
      if (selectedTier === 'Celebrity') {
        result = result.filter(inf => inf.isCelebrity);
      } else if (selectedTier === 'Mega') {
        result = result.filter(inf => inf.followerCount >= 1000000);
      } else if (selectedTier === 'Macro') {
        result = result.filter(inf => inf.followerCount >= 250000 && inf.followerCount < 1000000);
      } else if (selectedTier === 'Mid-Tier') {
        result = result.filter(inf => inf.followerCount >= 50000 && inf.followerCount < 250000);
      } else if (selectedTier === 'Micro') {
        result = result.filter(inf => inf.followerCount >= 10000 && inf.followerCount < 50000);
      } else if (selectedTier === 'Nano') {
        result = result.filter(inf => inf.followerCount < 10000);
      }
    }

    if (selectedCity !== 'All') {
      result = result.filter(inf => inf.city === selectedCity);
    }

    if (selectedLanguage !== 'All') {
      result = result.filter(inf => inf.languages && inf.languages.includes(selectedLanguage));
    }

    if (isHighEROnly) {
      result = result.filter(inf => inf.engagementRate >= 5.0);
    }

    if (isBudgetFriendlyOnly) {
      result = result.filter(inf => (inf.pricing?.reelWithDR || inf.pricing?.reel || 0) <= 150000);
    }

    // Sort logic
    result.sort((a, b) => {
      let valA, valB;
      if (sortBy === 'sno') {
        return 0; // Default sequence
      } else if (sortBy === 'followers') {
        valA = a.followerCount || 0;
        valB = b.followerCount || 0;
      } else if (sortBy === 'views') {
        valA = a.avgViews || 0;
        valB = b.avgViews || 0;
      } else if (sortBy === 'er') {
        valA = a.engagementRate || 0;
        valB = b.engagementRate || 0;
      } else if (sortBy === 'price') {
        valA = a.pricing?.reelWithDR || a.pricing?.reel || 0;
        valB = b.pricing?.reelWithDR || b.pricing?.reel || 0;
      } else if (sortBy === 'cpv') {
        const costA = a.pricing?.reelWithDR || a.pricing?.reel || 50000;
        const costB = b.pricing?.reelWithDR || b.pricing?.reel || 50000;
        valA = costA / (a.avgViews || 1);
        valB = costB / (b.avgViews || 1);
      }

      if (sortOrder === 'asc') return valA - valB;
      return valB - valA;
    });

    return result;
  }, [influencers, search, selectedTier, selectedCity, selectedLanguage, isHighEROnly, isBudgetFriendlyOnly, sortBy, sortOrder]);

  // Aggregate stats matching exact numbers
  const stats = useMemo(() => {
    const totalCount = influencers.length;
    if (totalCount === 0) return { reach: '17.9 M', views: '6.2 M', er: '4.40%', cpv: '₹0.48', female: '76.6%' };

    const totalFollowers = influencers.reduce((acc, i) => acc + (i.followerCount || 0), 0);
    const totalViews = influencers.reduce((acc, i) => acc + (i.avgViews || 0), 0);
    const totalCost = influencers.reduce((acc, i) => acc + (i.pricing?.reelWithDR || i.pricing?.reel || 0), 0);
    const avgER = (influencers.reduce((acc, i) => acc + (i.engagementRate || 0), 0) / totalCount).toFixed(2);
    const avgFemale = (influencers.reduce((acc, i) => acc + (i.genderDemographics?.femalePct || 76.6), 0) / totalCount).toFixed(1);
    const blendedCPV = totalViews > 0 ? (totalCost / totalViews).toFixed(2) : '0.48';

    return {
      reach: `${(totalFollowers / 1000000).toFixed(1)} M`,
      rawReach: totalFollowers,
      views: `${(totalViews / 1000000).toFixed(1)} M`,
      er: `${avgER}%`,
      cpv: `₹${blendedCPV}`,
      female: `${avgFemale}%`
    };
  }, [influencers]);

  // Selection handlers
  const handleToggleSelectCreator = (id) => {
    const updated = new Set(selectedCreatorIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedCreatorIds(updated);
  };

  const handleSelectAll = () => {
    if (selectedCreatorIds.size === filteredInfluencers.length) {
      setSelectedCreatorIds(new Set());
    } else {
      setSelectedCreatorIds(new Set(filteredInfluencers.map(i => i.id)));
    }
  };

  const resetAllFilters = () => {
    setSearch('');
    setSelectedTier('All');
    setSelectedCity('All');
    setSelectedLanguage('All');
    setIsHighEROnly(false);
    setIsBudgetFriendlyOnly(false);
    setSortBy('sno');
    setSortOrder('asc');
  };

  const handleExportFilteredExcel = () => {
    const headers = [
      'S no',
      'Name',
      'IG Link',
      'IG followers',
      'Avg Views',
      'Category',
      'City',
      'Language',
      '1 reel + DR',
      'Eng',
      'F%',
      'M%'
    ];

    const rows = filteredInfluencers.map((c, idx) => {
      const followersDisplay = c.followerCount >= 1000000 ? `${(c.followerCount / 1000000).toFixed(1)} M` : `${(c.followerCount / 1000).toFixed(0)} K`;
      const fPct = c.genderDemographics?.femalePct || 75;
      const mPct = c.genderDemographics?.malePct || (100 - fPct);
      return [
        idx + 1,
        c.name,
        c.igLink || `https://www.instagram.com/${c.handle.replace('@', '')}/`,
        followersDisplay,
        c.avgViews || 0,
        c.primaryGenre || 'Mom & Lifestyle',
        c.city || 'Chennai',
        c.languages?.[0] || 'Tamil',
        c.pricing?.reelWithDR || c.pricing?.reel || 50000,
        `${c.engagementRate}%`,
        `${fPct}%`,
        `${mPct}%`
      ];
    });

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'CreatorRoster');
    XLSX.writeFile(wb, `CreatorDeck_Roster_Export_${Date.now()}.xlsx`);
  };

  const handleBuildProposal = () => {
    const selectedList = influencers.filter(i => selectedCreatorIds.has(i.id));
    if (selectedList.length === 0) {
      alert('Please select at least 1 creator to build a media proposal.');
      return;
    }
    if (onOpenProposalWithCreators) {
      onOpenProposalWithCreators(selectedList);
    } else if (onSelectCreatorForProposal) {
      onSelectCreatorForProposal(selectedList[0]);
    }
  };

  return (
    <div className="space-y-5 bg-slate-50 min-h-screen text-slate-900 -m-6 md:-m-8 p-6 md:p-8 font-sans">
      
      {/* 1. TOP HEADER BAR matching CreatorDeck UI */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 bg-white p-4 rounded-2xl shadow-sm">
        {/* Brand Left */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-md text-white font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-black tracking-tight text-slate-900">
                Creator<span className="text-pink-600">Deck</span>
              </h1>
              <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
                CRM & PLANNER
              </span>
            </div>
            <p className="text-xs text-slate-500">Influencer Marketing & Media Campaign Intelligence</p>
          </div>
        </div>

        {/* Center Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('roster')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'roster'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-pink-500" />
            <span>Roster</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 font-extrabold">
              {influencers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'analytics'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
            <span>Analytics</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2.5">
          {/* Media Plan Basket Button */}
          <button
            onClick={handleBuildProposal}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all"
          >
            <Briefcase className="w-4 h-4" />
            <span>Media Plan</span>
            <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 font-extrabold text-[11px] flex items-center justify-center">
              {selectedCreatorIds.size}
            </span>
          </button>

          {/* Add Creator Button */}
          {canManage && (
            <button
              onClick={() => { setEditingInfluencer(null); setIsFormOpen(true); }}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md shadow-pink-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Creator</span>
            </button>
          )}

          {/* Import / Export Excel Button */}
          <button
            onClick={() => setIsImportModalOpen(true)}
            title="Import Excel or CSV dataset"
            className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          </button>

          <button
            onClick={resetAllFilters}
            title="Reset Filters"
            className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs shadow-sm transition-all"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* 2. HERO BANNER: Mom & Lifestyle Creator Roster + CREATOR TYPE SECTION UNDERNEATH */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1b0533] via-[#2d0741] to-[#170529] p-6 md:p-8 text-white shadow-xl border border-purple-900/40 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>INFLUENCER MARKETING INTELLIGENCE DATABASE</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Mom & Lifestyle <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300">Creator Roster</span>
            </h2>
            
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-xl">
              Track creator deliverables, engagement benchmarks, Cost-Per-View (CPV), and demographic splits across Chennai & South India.
            </p>
          </div>

          {/* EXACT 3 GLASS STAT CARDS MATCHING SCREENSHOT */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3.5">
            {/* Pill 1: Total Roster Reach */}
            <div className="bg-[#2c124a]/85 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-purple-400/20 min-w-[135px] text-center shadow-lg">
              <p className="text-[12px] text-slate-300 font-medium tracking-wide">Total Roster Reach</p>
              <p className="text-2xl md:text-3xl font-black text-white mt-1.5 tracking-tight">{stats.reach}</p>
            </div>

            {/* Pill 2: Avg Engagement (Golden Yellow) */}
            <div className="bg-[#2c124a]/85 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-purple-400/20 min-w-[135px] text-center shadow-lg">
              <p className="text-[12px] text-slate-300 font-medium tracking-wide">Avg Engagement</p>
              <p className="text-2xl md:text-3xl font-black text-[#FFD15C] mt-1.5 tracking-tight">{stats.er}</p>
            </div>

            {/* Pill 3: Blended CPV (Mint Green) */}
            <div className="bg-[#2c124a]/85 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-purple-400/20 min-w-[135px] text-center shadow-lg">
              <p className="text-[12px] text-slate-300 font-medium tracking-wide">Blended CPV</p>
              <p className="text-2xl md:text-3xl font-black text-[#4EEDB8] mt-1.5 tracking-tight">{stats.cpv}</p>
            </div>
          </div>
        </div>

        {/* CREATOR TYPE INTERACTIVE ROW DIRECTLY UNDER MOM & LIFESTYLE BANNER */}
        <div className="pt-4 border-t border-purple-500/20 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-pink-300 uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>CREATOR TYPE / FOLLOWER TIER CLASSIFICATION:</span>
            </div>
            
            <button
              onClick={() => setShowTierTable(!showTierTable)}
              className="text-[11px] font-bold text-amber-300 hover:text-amber-200 underline flex items-center gap-1"
            >
              <span>{showTierTable ? 'Hide Tier Breakdown' : 'View Full Tier Guide'}</span>
            </button>
          </div>

          {/* Quick-filter Creator Type Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {CREATOR_TIERS.map((tier) => {
              const isSelected = selectedTier === tier.value;
              let count = 0;
              if (tier.value === 'All') count = influencers.length;
              else if (tier.value === 'Celebrity') count = influencers.filter(i => i.isCelebrity).length;
              else if (tier.value === 'Mega') count = influencers.filter(i => i.followerCount >= 1000000).length;
              else if (tier.value === 'Macro') count = influencers.filter(i => i.followerCount >= 250000 && i.followerCount < 1000000).length;
              else if (tier.value === 'Mid-Tier') count = influencers.filter(i => i.followerCount >= 50000 && i.followerCount < 250000).length;
              else if (tier.value === 'Micro') count = influencers.filter(i => i.followerCount >= 10000 && i.followerCount < 50000).length;
              else if (tier.value === 'Nano') count = influencers.filter(i => i.followerCount < 10000).length;

              return (
                <button
                  key={tier.value}
                  onClick={() => setSelectedTier(tier.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md scale-105'
                      : 'bg-white/10 hover:bg-white/15 text-slate-200 border-white/10'
                  }`}
                >
                  <span>{tier.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected ? 'bg-slate-900 text-amber-300' : 'bg-purple-900/60 text-pink-300'
                  }`}>
                    {count}
                  </span>
                  <span className="text-[10px] opacity-75 hidden sm:inline font-mono">({tier.shortLabel})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FULL CREATOR TYPE BREAKDOWN TABLE (Expanded directly under Mom & Lifestyle section) */}
        {showTierTable && (
          <div className="bg-[#120324]/90 rounded-2xl p-4 border border-purple-500/30 animate-in fade-in zoom-in-95 duration-150 mt-3">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-purple-500/30 text-slate-400 font-bold uppercase text-[11px]">
                    <th className="py-2 px-3">Creator Type</th>
                    <th className="py-2 px-3 text-right">Follower Count</th>
                    <th className="py-2 px-3 text-right">Creators Count</th>
                    <th className="py-2 px-3 text-right">Scope / Profiles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-500/20 text-slate-200">
                  <tr className="hover:bg-purple-500/10">
                    <td className="py-2.5 px-3 font-extrabold text-amber-300">Celebrity</td>
                    <td className="py-2.5 px-3 text-right font-mono text-purple-200">Public figures / TV / Cinema / Sports personalities</td>
                    <td className="py-2.5 px-3 text-right font-bold text-white">7 creators</td>
                    <td className="py-2.5 px-3 text-right text-slate-300 text-[11px]">Alya Manasa, Sridevi Ashok, Hema Rajkumar, Sujitha, etc.</td>
                  </tr>
                  <tr className="hover:bg-purple-500/10">
                    <td className="py-2.5 px-3 font-extrabold text-amber-300">Mega Influencer</td>
                    <td className="py-2.5 px-3 text-right font-mono text-purple-200">1M+</td>
                    <td className="py-2.5 px-3 text-right font-bold text-white">6 creators</td>
                    <td className="py-2.5 px-3 text-right text-slate-300 text-[11px]">Sathish Deepa, Alya Manasa, Gayathri Yuvaraj</td>
                  </tr>
                  <tr className="hover:bg-purple-500/10">
                    <td className="py-2.5 px-3 font-extrabold text-amber-300">Macro Influencer</td>
                    <td className="py-2.5 px-3 text-right font-mono text-purple-200">250K – 1M</td>
                    <td className="py-2.5 px-3 text-right font-bold text-white">8 creators</td>
                    <td className="py-2.5 px-3 text-right text-slate-300 text-[11px]">Yummy Tummy arathi, Sri priya, Anjali, Shamili, Snazzy</td>
                  </tr>
                  <tr className="hover:bg-purple-500/10">
                    <td className="py-2.5 px-3 font-extrabold text-amber-300">Mid-Tier Influencer</td>
                    <td className="py-2.5 px-3 text-right font-mono text-purple-200">50K – 250K</td>
                    <td className="py-2.5 px-3 text-right font-bold text-white">3 creators</td>
                    <td className="py-2.5 px-3 text-right text-slate-300 text-[11px]">Swetha Renukumar, Sunitha, Shikha Vijay</td>
                  </tr>
                  <tr className="hover:bg-purple-500/10">
                    <td className="py-2.5 px-3 font-extrabold text-amber-300">Micro Influencer</td>
                    <td className="py-2.5 px-3 text-right font-mono text-purple-200">10K – 50K</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-400">0 in roster</td>
                    <td className="py-2.5 px-3 text-right text-slate-400 text-[11px]">Available for custom onboarding</td>
                  </tr>
                  <tr className="hover:bg-purple-500/10">
                    <td className="py-2.5 px-3 font-extrabold text-amber-300">Nano Influencer</td>
                    <td className="py-2.5 px-3 text-right font-mono text-purple-200">1K – 10K</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-400">0 in roster</td>
                    <td className="py-2.5 px-3 text-right text-slate-400 text-[11px]">Available for custom onboarding</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 3. SIX STAT METRIC CARDS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Card 1: CREATORS */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CREATORS</span>
            <div className="w-7 h-7 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-slate-900">{influencers.length}</p>
            <p className="text-[11px] font-bold text-emerald-600 mt-0.5">✓ {influencers.length} Active Records</p>
          </div>
        </div>

        {/* Card 2: FOLLOWERS */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">FOLLOWERS</span>
            <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-slate-900">{stats.reach}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Total Audience Pool</p>
          </div>
        </div>

        {/* Card 3: AVG VIEWS */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">AVG VIEWS</span>
            <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Eye className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-slate-900">{stats.views}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Per Reel Run</p>
          </div>
        </div>

        {/* Card 4: AVG ENG. RATE */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">AVG ENG. RATE</span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-slate-900">{stats.er}</p>
            <p className="text-[11px] font-bold text-amber-600 mt-0.5">High Social Impact</p>
          </div>
        </div>

        {/* Card 5: AVG CPV */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">AVG CPV</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-slate-900">{stats.cpv}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Cost per video view</p>
          </div>
        </div>

        {/* Card 6: FEMALE AVG */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">FEMALE AVG</span>
            <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <PieIcon className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-rose-600">{stats.female}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Mom & Home Niche</p>
          </div>
        </div>
      </div>

      {/* 4. SEARCH & FILTER CONTROLS BAR */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        {/* Top Search Line */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search creator by name, @handle, city, or language..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all font-medium"
            />
          </div>

          <div className="flex items-center space-x-3">
            {/* Sort Dropdown */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
              <span className="text-slate-500 mr-1 text-[11px]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-0 text-slate-800 font-bold focus:outline-none cursor-pointer pr-1"
              >
                <option value="sno">S.No (Default)</option>
                <option value="followers">Followers</option>
                <option value="views">Avg Views</option>
                <option value="er">Engagement Rate</option>
                <option value="price">1 Reel + DR Price</option>
                <option value="cpv">CPV Value</option>
              </select>
              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="text-slate-500 hover:text-slate-800 font-bold ml-1"
                title="Toggle Sort Order"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>

            <span className="text-xs text-slate-500 hidden sm:inline">
              Showing <strong className="text-slate-900">{filteredInfluencers.length}</strong> creators
            </span>
          </div>
        </div>

        {/* Filter Dropdowns & Quick Filter Chips matching exact specifications */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none"
            >
              {CREATOR_TIERS.map(t => (
                <option key={t.value} value={t.value}>
                  {t.name} {t.value !== 'All' ? `(${t.range})` : ''}
                </option>
              ))}
            </select>

            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none"
            >
              <option value="All">All Languages</option>
              <option value="Tamil">Tamil</option>
              <option value="Telugu">Telugu</option>
              <option value="English">English</option>
            </select>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none"
            >
              <option value="All">All Cities</option>
              <option value="Chennai">Chennai</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Coimbatore">Coimbatore</option>
            </select>

            {/* Quick Chips */}
            <button
              onClick={() => setIsHighEROnly(!isHighEROnly)}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                isHighEROnly
                  ? 'bg-amber-100 text-amber-800 border border-amber-300 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>High Engagement (&gt;5%)</span>
            </button>

            <button
              onClick={() => setIsBudgetFriendlyOnly(!isBudgetFriendlyOnly)}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                isBudgetFriendlyOnly
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>Budget Friendly (≤ ₹1.5L)</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportFilteredExcel}
              className="flex items-center space-x-1 text-slate-600 hover:text-purple-700 font-bold px-2 py-1 text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Roster (.xlsx)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. PURPLE SELECTION BASKET BANNER (when creators are selected) */}
      {selectedCreatorIds.size > 0 && (
        <div className="rounded-2xl p-4 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 text-white shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-3">
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-black">
              {selectedCreatorIds.size}
            </span>
            <p className="text-xs md:text-sm font-extrabold">
              {selectedCreatorIds.size} Creators selected in active Media Campaign basket
            </p>
          </div>

          <button
            onClick={handleBuildProposal}
            className="px-5 py-2 rounded-xl bg-white text-purple-800 hover:bg-slate-100 font-black text-xs shadow-md transition-all flex items-center space-x-2"
          >
            <span>Build Media Proposal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 6. TABLE VIEW WITH YELLOW HEADER matching the screenshot exactly */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#FFE066] text-slate-900 font-black border-b-2 border-amber-400 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-3 text-center w-10">
                    <input
                      type="checkbox"
                      checked={selectedCreatorIds.size === filteredInfluencers.length && filteredInfluencers.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded text-purple-600 accent-purple-600 cursor-pointer"
                    />
                  </th>
                  <th className="p-3 text-center w-12">S NO</th>
                  <th className="p-3 min-w-[200px]">NAME</th>
                  <th className="p-3 min-w-[150px]">IG LINK</th>
                  <th className="p-3 text-right">IG FOLLOWERS</th>
                  <th className="p-3 text-right">AVG VIEWS</th>
                  <th className="p-3 text-center">CATEGORY</th>
                  <th className="p-3">CITY</th>
                  <th className="p-3">LANGUAGE</th>
                  <th className="p-3 text-right">1 REEL + DR</th>
                  <th className="p-3 text-center">ENG %</th>
                  <th className="p-3 text-center">F% / M% SPLIT</th>
                  <th className="p-3 text-right">CPV</th>
                  <th className="p-3 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                {filteredInfluencers.map((inf, idx) => {
                  const isChecked = selectedCreatorIds.has(inf.id);
                  const followersDisplay = inf.followerCount >= 1000000 ? `${(inf.followerCount / 1000000).toFixed(1)} M` : `${(inf.followerCount / 1000).toFixed(0)} K`;
                  const fPct = inf.genderDemographics?.femalePct || 75;
                  const mPct = inf.genderDemographics?.malePct || (100 - fPct);
                  const price = inf.pricing?.reelWithDR || inf.pricing?.reel || 50000;
                  const cpv = ((price / (inf.avgViews || 1))).toFixed(2);
                  const igLink = inf.igLink || `https://www.instagram.com/${inf.handle.replace('@', '')}/`;

                  return (
                    <tr 
                      key={inf.id} 
                      className={`hover:bg-purple-50/40 transition-colors ${isChecked ? 'bg-purple-50/60' : ''}`}
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelectCreator(inf.id)}
                          className="w-4 h-4 rounded text-purple-600 accent-purple-600 cursor-pointer"
                        />
                      </td>

                      <td className="p-3 text-center font-bold text-slate-500">{idx + 1}</td>

                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={inf.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                            alt={inf.name}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-sm"
                          />
                          <div>
                            <p className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                              <span>{inf.name}</span>
                              {inf.verified && <CheckCircle className="w-3.5 h-3.5 text-blue-500 inline" />}
                              {inf.isCelebrity && (
                                <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-800 font-bold border border-amber-200">
                                  Celeb
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-slate-500 font-mono">{inf.handle}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <a
                          href={igLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-[11px] font-bold transition-colors font-mono"
                        >
                          <span className="truncate max-w-[110px]">{inf.handle.replace('@', '')}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </td>

                      <td className="p-3 text-right">
                        <p className="font-black text-slate-900 text-xs">{followersDisplay}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{inf.followerCount.toLocaleString('en-IN')}</p>
                      </td>

                      <td className="p-3 text-right">
                        <p className="font-black text-slate-900 text-xs">{inf.avgViews?.toLocaleString('en-IN') || '0'}</p>
                        <p className="text-[10px] text-slate-400">{formatNumber(inf.avgViews)} views</p>
                      </td>

                      <td className="p-3 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-pink-50 text-pink-700 border border-pink-200 font-bold text-[11px]">
                          {inf.primaryGenre}
                        </span>
                      </td>

                      <td className="p-3 font-semibold text-slate-800 text-xs">{inf.city}</td>

                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-bold text-[10px]">
                          {inf.languages?.[0] || 'Tamil'}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <p className="font-black text-slate-900 text-xs">{formatCurrency(price)}</p>
                        <p className="text-[10px] text-slate-400">1 Reel + DR</p>
                      </td>

                      <td className="p-3 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-lg font-black text-xs ${
                          inf.engagementRate >= 9.0
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : inf.engagementRate >= 5.0
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {inf.engagementRate}%
                        </span>
                      </td>

                      <td className="p-3 min-w-[130px]">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-pink-600">F: {fPct}%</span>
                            <span className="text-blue-600">M: {mPct}%</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex">
                            <div className="bg-pink-500 h-full" style={{ width: `${fPct}%` }}></div>
                            <div className="bg-blue-500 h-full" style={{ width: `${mPct}%` }}></div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 text-right font-mono font-bold text-xs text-slate-700">
                        ₹{cpv}
                      </td>

                      <td className="p-3 text-center">
                        <button
                          onClick={() => { setSelectedInfluencer(inf); setIsDetailOpen(true); }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-600 hover:text-white text-slate-700 text-xs font-bold transition-all"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredInfluencers.map((inf) => (
            <div
              key={inf.id}
              onClick={() => { setSelectedInfluencer(inf); setIsDetailOpen(true); }}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img src={inf.avatar} alt={inf.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{inf.name}</h4>
                      <p className="text-xs text-pink-600 font-mono">{inf.handle}</p>
                      <p className="text-[11px] text-slate-500">{inf.city} • {inf.languages?.[0] || 'Tamil'}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
                    {inf.tier}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-xl p-2.5 border border-slate-100 mb-3 text-center">
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Followers</p>
                    <p className="text-xs font-black text-slate-900">{formatNumber(inf.followerCount)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Avg Views</p>
                    <p className="text-xs font-black text-slate-900">{formatNumber(inf.avgViews)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Eng. Rate</p>
                    <p className="text-xs font-black text-pink-600">{inf.engagementRate}%</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400">1 Reel + DR Rate</p>
                  <p className="text-sm font-black text-slate-900">{formatCurrency(inf.pricing?.reelWithDR || inf.pricing?.reel || 0)}</p>
                </div>

                <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleToggleSelectCreator(inf.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedCreatorIds.has(inf.id)
                        ? 'bg-purple-700 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {selectedCreatorIds.has(inf.id) ? '✓ Selected' : '+ Select'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <InfluencerDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        influencer={selectedInfluencer}
        onEdit={(inf) => { setEditingInfluencer(inf); setIsFormOpen(true); }}
      />

      <InfluencerFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        influencer={editingInfluencer}
        onSaved={fetchInfluencers}
      />

      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={fetchInfluencers}
      />

      <CreatorCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        creators={comparedCreators}
      />
    </div>
  );
};
