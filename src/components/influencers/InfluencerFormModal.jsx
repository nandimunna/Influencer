import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { api } from '../../services/api';
import { AlertCircle, CheckCircle2, User, ShieldAlert } from 'lucide-react';

export const InfluencerFormModal = ({ isOpen, onClose, influencer, onSaved }) => {
  const isEditing = !!influencer;

  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    igLink: '',
    avatar: '',
    phone: '',
    whatsapp: '',
    email: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    languages: ['Tamil'],
    primaryGenre: 'Mom & Lifestyle',
    secondaryGenre: 'Lifestyle',
    followerCount: 250000,
    tier: 'Micro',
    avgViews: 100000,
    engagementRate: 3.5,
    pricingReel: 50000,
    pricingReelWithDR: 50000,
    pricingStory: 15000,
    pricingStatic: 25000,
    internalRating: 4.8,
    internalNotes: '',
    verified: false,
    femalePct: 75,
    malePct: 25
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (influencer) {
      setFormData({
        name: influencer.name || '',
        handle: influencer.handle || '',
        igLink: influencer.igLink || '',
        avatar: influencer.avatar || '',
        phone: influencer.phone || '',
        whatsapp: influencer.whatsapp || '',
        email: influencer.email || '',
        city: influencer.city || 'Chennai',
        state: influencer.state || 'Tamil Nadu',
        languages: influencer.languages || ['Tamil'],
        primaryGenre: influencer.primaryGenre || 'Mom & Lifestyle',
        secondaryGenre: influencer.secondaryGenre || 'Lifestyle',
        followerCount: influencer.followerCount || 250000,
        tier: influencer.tier || 'Micro',
        avgViews: influencer.avgViews || 100000,
        engagementRate: influencer.engagementRate || 3.5,
        pricingReel: influencer.pricing?.reel || 50000,
        pricingReelWithDR: influencer.pricing?.reelWithDR || influencer.pricing?.reel || 50000,
        pricingStory: influencer.pricing?.story || 15000,
        pricingStatic: influencer.pricing?.staticPost || 25000,
        internalRating: influencer.internalRating || 4.8,
        internalNotes: influencer.internalNotes || '',
        verified: influencer.verified || false,
        femalePct: influencer.genderDemographics?.femalePct || 75,
        malePct: influencer.genderDemographics?.malePct || 25
      });
    } else {
      setFormData({
        name: '',
        handle: '',
        igLink: '',
        avatar: '',
        phone: '',
        whatsapp: '',
        email: '',
        city: 'Chennai',
        state: 'Tamil Nadu',
        languages: ['Tamil'],
        primaryGenre: 'Mom & Lifestyle',
        secondaryGenre: 'Lifestyle',
        followerCount: 250000,
        tier: 'Micro',
        avgViews: 100000,
        engagementRate: 3.5,
        pricingReel: 50000,
        pricingReelWithDR: 50000,
        pricingStory: 15000,
        pricingStatic: 25000,
        internalRating: 4.8,
        internalNotes: '',
        verified: false,
        femalePct: 75,
        malePct: 25
      });
    }
    setErrorMsg('');
    setDuplicateWarning(null);
  }, [influencer, isOpen]);

  const handleCheckDuplicates = async (handleVal, emailVal, phoneVal) => {
    try {
      if (!handleVal && !emailVal && !phoneVal) return;
      const res = await api.checkDuplicates({
        handle: handleVal,
        email: emailVal,
        phone: phoneVal,
        excludeId: influencer?.id
      });
      if (res.hasDuplicate) {
        setDuplicateWarning(`Potential duplicate profile detected: ${res.duplicates.map(d => `${d.name} (${d.handle})`).join(', ')}`);
      } else {
        setDuplicateWarning(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newVal = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: newVal }));

    if (['handle', 'email', 'phone'].includes(name)) {
      handleCheckDuplicates(
        name === 'handle' ? value : formData.handle,
        name === 'email' ? value : formData.email,
        name === 'phone' ? value : formData.phone
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setErrorMsg('');

      const cleanHandle = formData.handle.startsWith('@') ? formData.handle : `@${formData.handle}`;
      const igLink = formData.igLink || `https://www.instagram.com/${cleanHandle.replace('@', '')}/`;

      const payload = {
        name: formData.name,
        handle: cleanHandle,
        igLink,
        avatar: formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        email: formData.email,
        city: formData.city,
        state: formData.state,
        languages: typeof formData.languages === 'string' ? formData.languages.split(',').map(s => s.trim()) : formData.languages,
        primaryGenre: formData.primaryGenre,
        secondaryGenre: formData.secondaryGenre,
        followerCount: Number(formData.followerCount),
        tier: formData.tier,
        avgViews: Number(formData.avgViews),
        engagementRate: Number(formData.engagementRate),
        pricing: {
          reel: Number(formData.pricingReel),
          reelWithDR: Number(formData.pricingReelWithDR || formData.pricingReel),
          story: Number(formData.pricingStory),
          staticPost: Number(formData.pricingStatic),
          comboPackage: Math.round(Number(formData.pricingReel) * 1.5)
        },
        genderDemographics: {
          femalePct: Number(formData.femalePct) || 75,
          malePct: Number(formData.malePct) || 25
        },
        internalRating: Number(formData.internalRating),
        internalNotes: formData.internalNotes,
        verified: formData.verified
      };

      if (isEditing) {
        await api.updateInfluencer(influencer.id, payload);
      } else {
        await api.createInfluencer(payload);
      }

      onSaved();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save creator profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Creator: ${influencer?.name}` : 'Onboard New Creator'}
      subtitle="Configure profile metadata, commercials, engagement metrics and rate card"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {duplicateWarning && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{duplicateWarning}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Creator Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              placeholder="e.g. Alya Manasa"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Instagram Handle *</label>
            <input
              type="text"
              name="handle"
              required
              value={formData.handle}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              placeholder="@alya_manasa"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Direct Instagram URL</label>
            <input
              type="url"
              name="igLink"
              value={formData.igLink}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              placeholder="https://www.instagram.com/alya_manasa/"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Primary Niche / Category</label>
            <input
              type="text"
              name="primaryGenre"
              value={formData.primaryGenre}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              placeholder="Mom & Lifestyle"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Languages (comma separated)</label>
            <input
              type="text"
              name="languages"
              value={Array.isArray(formData.languages) ? formData.languages.join(', ') : formData.languages}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              placeholder="Tamil, English"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Followers Count</label>
            <input
              type="number"
              name="followerCount"
              value={formData.followerCount}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Avg Views per Reel</label>
            <input
              type="number"
              name="avgViews"
              value={formData.avgViews}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Engagement Rate (ER %)</label>
            <input
              type="number"
              step="0.01"
              name="engagementRate"
              value={formData.engagementRate}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">1 Reel + Direct Rights (DR) Rate (₹)</label>
            <input
              type="number"
              name="pricingReelWithDR"
              value={formData.pricingReelWithDR}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Female Audience % (F%)</label>
            <input
              type="number"
              step="0.1"
              name="femalePct"
              value={formData.femalePct}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Male Audience % (M%)</label>
            <input
              type="number"
              step="0.1"
              name="malePct"
              value={formData.malePct}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">WhatsApp Contact</label>
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              placeholder="919840155210"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Official Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Creator Profile' : 'Save Creator')}
          </button>
        </div>
      </form>
    </Modal>
  );
};
