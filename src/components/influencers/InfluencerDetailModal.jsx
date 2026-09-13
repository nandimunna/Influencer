import React from 'react';
import { Modal } from '../common/Modal';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Award, 
  CheckCircle2, 
  Lock, 
  ExternalLink, 
  ShieldAlert, 
  Users 
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

export const InfluencerDetailModal = ({ isOpen, onClose, influencer, onEdit }) => {
  const { user, hasRole } = useAuth();
  const isClient = user?.role === 'Client';
  const canEdit = hasRole('Admin', 'Campaign Manager', 'Agency Member');

  if (!influencer) return null;

  const femalePct = influencer.genderDemographics?.femalePct || 75;
  const malePct = influencer.genderDemographics?.malePct || 25;
  const igUrl = influencer.igLink || `https://www.instagram.com/${influencer.handle.replace('@', '')}/`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Creator Intelligence Profile"
      subtitle={`${influencer.name} • ${influencer.handle}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-900/30 via-slate-800/60 to-slate-900 border border-purple-500/20">
          <div className="flex items-center space-x-4">
            <img
              src={influencer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt={influencer.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500/40 shadow-xl"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white">{influencer.name}</h2>
                {influencer.verified && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-blue-400" />
                    Verified
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2 mt-1">
                <a
                  href={igUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-purple-300 hover:text-purple-200 hover:underline font-mono flex items-center gap-1"
                >
                  <span>{influencer.handle}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                </a>
              </div>

              <div className="flex items-center space-x-3 mt-1.5 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {influencer.city}, {influencer.state || 'India'}
                </span>
                <span>•</span>
                <span>Language: {influencer.languages?.join(', ') || 'Tamil'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700 text-center">
              <p className="text-[10px] text-slate-400 uppercase">Eng. Rate</p>
              <p className="text-sm font-bold text-purple-300">{influencer.engagementRate}%</p>
            </div>
            <div className="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700 text-center">
              <p className="text-[10px] text-slate-400 uppercase">Tier</p>
              <p className="text-sm font-bold text-white">{influencer.tier}</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Audience Gender Split (F% vs M%)</span>
            </h4>
            <span className="text-xs font-bold text-pink-400">{femalePct}% Female Dominant</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-pink-400">Female Audience: {femalePct}%</span>
              <span className="text-blue-400">Male Audience: {malePct}%</span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
              <div className="bg-pink-500 h-full transition-all" style={{ width: `${femalePct}%` }}></div>
              <div className="bg-blue-500 h-full transition-all" style={{ width: `${malePct}%` }}></div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact & Direct Channels</p>
            {isClient && (
              <span className="text-[11px] text-amber-400 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Agency Privacy Guard Active
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center space-x-2.5 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/60">
              <Phone className="w-4 h-4 text-purple-400" />
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400">Direct Phone</p>
                <p className={`text-xs font-mono truncate ${isClient ? 'text-slate-500 italic' : 'text-slate-200 font-bold'}`}>
                  {influencer.phone || '+91 98400 00000'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/60">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400">WhatsApp</p>
                <p className={`text-xs font-mono truncate ${isClient ? 'text-slate-500 italic' : 'text-slate-200 font-bold'}`}>
                  {influencer.whatsapp ? `+${influencer.whatsapp}` : '+91 98400 00000'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/60">
              <Mail className="w-4 h-4 text-blue-400" />
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400">Official Email</p>
                <p className={`text-xs font-mono truncate ${isClient ? 'text-slate-500 italic' : 'text-slate-200'}`}>
                  {influencer.email || 'collabs@management.com'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Commercial Rate Card</span>
            <span className="text-[11px] text-purple-300 font-normal">Base Rate Cards</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/40">
              <p className="text-[11px] text-purple-300 font-bold">1 Reel + Direct Rights (DR)</p>
              <p className="text-lg font-extrabold text-white mt-1">
                {formatCurrency(influencer.pricing?.reelWithDR || influencer.pricing?.reel || 0)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/70">
              <p className="text-[11px] text-slate-400">Instagram Story (24hr)</p>
              <p className="text-base font-bold text-white mt-1">{formatCurrency(influencer.pricing?.story || 0)}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/70">
              <p className="text-[11px] text-slate-400">Static Carousel / Post</p>
              <p className="text-base font-bold text-white mt-1">{formatCurrency(influencer.pricing?.staticPost || 0)}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/70">
              <p className="text-[11px] text-slate-400">Average Views / Reel</p>
              <p className="text-base font-bold text-emerald-400 mt-1">{formatNumber(influencer.avgViews)}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/70">
              <p className="text-[11px] text-slate-400">Total Followers</p>
              <p className="text-base font-bold text-white mt-1">{formatNumber(influencer.followerCount)}</p>
            </div>
            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30">
              <p className="text-[11px] text-indigo-300">Campaign Combo Package</p>
              <p className="text-base font-bold text-indigo-200 mt-1">{formatCurrency(influencer.pricing?.comboPackage || (influencer.pricing?.reel * 1.5 || 0))}</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Previous Brand Experience & Collaborations</h4>
          <div className="flex flex-wrap gap-2">
            {influencer.previousCampaigns?.map((camp, idx) => (
              <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
                <Award className="w-3 h-3 text-purple-400" />
                {camp}
              </span>
            ))}
            {(!influencer.previousCampaigns || influencer.previousCampaigns.length === 0) && (
              <span className="text-xs text-slate-500 italic">No past campaigns logged</span>
            )}
          </div>
        </div>

        {!isClient && (
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-2">
            <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              Internal Agency Notes & Community Insights
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {influencer.internalNotes || 'High audience engagement with quick turnaround on script reviews.'}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
        <a
          href={igUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-pink-600/20 hover:bg-pink-600 text-pink-300 hover:text-white text-xs font-bold transition-all border border-pink-500/30"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Open Instagram Profile</span>
        </a>

        <div className="flex items-center space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Close
          </button>

          {canEdit && (
            <button
              onClick={() => {
                onClose();
                if (onEdit) onEdit(influencer);
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors"
            >
              Edit Creator Profile
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
