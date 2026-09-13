import React from 'react';
import { 
  MapPin, 
  Sparkles, 
  Star, 
  MessageCircle, 
  Eye, 
  CheckCircle, 
  PlusCircle, 
  Lock, 
  ExternalLink,
  Flame,
  Users
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

export const InfluencerCard = ({ influencer, onViewDetail, onAddToProposal, onToggleCompare, isCompared }) => {
  const { user } = useAuth();
  const isClient = user?.role === 'Client';

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Mega': return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Macro': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'Mid-Tier': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Micro': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default: return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    if (isClient || !influencer.whatsapp) return;
    const cleanNumber = influencer.whatsapp.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hi ${influencer.name}, reaching out from NexCreator regarding brand collaboration opportunities.`);
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const handleOpenIG = (e) => {
    e.stopPropagation();
    const url = influencer.igLink || `https://www.instagram.com/${influencer.handle.replace('@', '')}/`;
    window.open(url, '_blank');
  };

  const femalePct = influencer.genderDemographics?.femalePct || 75;
  const malePct = influencer.genderDemographics?.malePct || 25;
  const isHighER = influencer.engagementRate >= 7.0;

  return (
    <div 
      onClick={() => onViewDetail(influencer)}
      className="glass-panel glass-panel-hover rounded-2xl p-5 cursor-pointer flex flex-col justify-between relative group border border-slate-800"
    >
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              <img 
                src={influencer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'} 
                alt={influencer.name} 
                className="w-13 h-13 rounded-2xl object-cover border-2 border-slate-700/80 shadow-md group-hover:border-purple-500/60 transition-colors"
                style={{ width: '52px', height: '52px' }}
              />
              {influencer.verified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 text-white shadow">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors truncate max-w-[130px]">
                  {influencer.name}
                </h4>
              </div>

              <button
                onClick={handleOpenIG}
                title="Open Instagram Profile"
                className="text-xs text-purple-400 hover:text-purple-300 hover:underline font-mono flex items-center gap-1 mt-0.5"
              >
                <span>{influencer.handle}</span>
                <ExternalLink className="w-3 h-3 text-purple-400" />
              </button>

              <div className="flex items-center space-x-1 mt-1 text-[11px] text-slate-400">
                <MapPin className="w-3 h-3 text-slate-500" />
                <span>{influencer.city} • {influencer.languages?.[0] || 'Tamil'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-1.5">
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getTierColor(influencer.tier)}`}>
              {influencer.tier}
            </span>
            {isHighER && (
              <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 font-bold">
                <Flame className="w-3 h-3 text-orange-400" />
                <span>Viral ER</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
            {influencer.primaryGenre}
          </span>
          {influencer.secondaryGenre && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
              {influencer.secondaryGenre}
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/80 mb-3 text-center">
          <div>
            <p className="text-[10px] text-slate-400 font-medium uppercase">Followers</p>
            <p className="text-xs font-bold text-white mt-0.5">{formatNumber(influencer.followerCount)}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium uppercase">Avg Views</p>
            <p className="text-xs font-bold text-emerald-400 mt-0.5">{formatNumber(influencer.avgViews)}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium uppercase">Eng. Rate</p>
            <p className={`text-xs font-extrabold mt-0.5 ${isHighER ? 'text-orange-400' : 'text-purple-300'}`}>
              {influencer.engagementRate}%
            </p>
          </div>
        </div>

        <div className="bg-slate-900/40 rounded-xl p-2.5 border border-slate-800/60 mb-3 space-y-1">
          <div className="flex justify-between text-[10px] font-bold">
            <span className="text-pink-400">Female: {femalePct}%</span>
            <span className="text-blue-400">Male: {malePct}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
            <div className="bg-pink-500 h-full" style={{ width: `${femalePct}%` }}></div>
            <div className="bg-blue-500 h-full" style={{ width: `${malePct}%` }}></div>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-slate-400">1 Reel + DR Rate</p>
          <p className="text-sm font-extrabold text-white">
            {formatCurrency(influencer.pricing?.reelWithDR || influencer.pricing?.reel || 0)}
          </p>
        </div>

        <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
          {onToggleCompare && (
            <button
              onClick={() => onToggleCompare(influencer)}
              title="Compare Influencer"
              className={`p-1.5 rounded-xl border text-[11px] font-semibold transition-colors ${
                isCompared
                  ? 'bg-purple-600 text-white border-purple-500'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {isCompared ? '✓ Added' : '+ Compare'}
            </button>
          )}

          {!isClient && (
            <button
              onClick={handleWhatsApp}
              title="Quick WhatsApp Chat"
              className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onViewDetail(influencer)}
            className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/30 hover:border-purple-600 text-xs font-medium transition-all"
          >
            Profile
          </button>
        </div>
      </div>
    </div>
  );
};
