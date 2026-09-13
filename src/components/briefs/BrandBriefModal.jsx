import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { api } from '../../services/api';
import { AlertCircle, Upload, FileText } from 'lucide-react';

export const BrandBriefModal = ({ isOpen, onClose, brief, onSaved }) => {
  const isEditing = !!brief;

  const [formData, setFormData] = useState({
    brandName: '',
    campaignTitle: '',
    objective: 'Product Trial & Conversions',
    targetCities: 'Chennai, Bengaluru, Hyderabad',
    targetLanguages: 'Tamil, English',
    creatorTiers: ['Micro', 'Macro'],
    genres: 'Mom & Lifestyle',
    totalBudget: 1500000,
    reelsCount: 8,
    storiesCount: 16,
    timelineStart: '2026-03-15',
    timelineEnd: '2026-04-15',
    targetAudience: 'Families, mothers, and young professionals (20-40)',
    usageRights: '30 days social whitelisting rights',
    clientBriefDoc: '',
    status: 'Active'
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (brief) {
      setFormData({
        brandName: brief.brandName || '',
        campaignTitle: brief.campaignTitle || '',
        objective: brief.objective || 'Product Trial & Conversions',
        targetCities: Array.isArray(brief.targetCities) ? brief.targetCities.join(', ') : (brief.targetCities || ''),
        targetLanguages: Array.isArray(brief.targetLanguages) ? brief.targetLanguages.join(', ') : (brief.targetLanguages || ''),
        creatorTiers: brief.creatorTiers || ['Micro', 'Macro'],
        genres: Array.isArray(brief.genres) ? brief.genres.join(', ') : (brief.genres || 'Mom & Lifestyle'),
        totalBudget: brief.totalBudget || 1500000,
        reelsCount: brief.deliverables?.reelsCount || 8,
        storiesCount: brief.deliverables?.storiesCount || 16,
        timelineStart: brief.timelineStart || '2026-03-15',
        timelineEnd: brief.timelineEnd || '2026-04-15',
        targetAudience: brief.targetAudience || '',
        usageRights: brief.usageRights || '',
        clientBriefDoc: brief.clientBriefDoc || '',
        status: brief.status || 'Active'
      });
    } else {
      setFormData({
        brandName: '',
        campaignTitle: '',
        objective: 'Product Trial & Conversions',
        targetCities: 'Chennai, Bengaluru, Hyderabad',
        targetLanguages: 'Tamil, English',
        creatorTiers: ['Micro', 'Macro'],
        genres: 'Mom & Lifestyle',
        totalBudget: 1500000,
        reelsCount: 8,
        storiesCount: 16,
        timelineStart: '2026-03-15',
        timelineEnd: '2026-04-15',
        targetAudience: 'Families, mothers, and young professionals (20-40)',
        usageRights: '30 days social whitelisting rights',
        clientBriefDoc: '',
        status: 'Active'
      });
    }
    setErrorMsg('');
  }, [brief, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTierToggle = (tier) => {
    setFormData(prev => {
      const current = prev.creatorTiers || [];
      const updated = current.includes(tier)
        ? current.filter(t => t !== tier)
        : [...current, tier];
      return { ...prev, creatorTiers: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setErrorMsg('');

      const payload = {
        brandName: formData.brandName,
        campaignTitle: formData.campaignTitle,
        objective: formData.objective,
        targetCities: formData.targetCities.split(',').map(s => s.trim()).filter(Boolean),
        targetLanguages: formData.targetLanguages.split(',').map(s => s.trim()).filter(Boolean),
        creatorTiers: formData.creatorTiers,
        genres: formData.genres.split(',').map(s => s.trim()).filter(Boolean),
        totalBudget: Number(formData.totalBudget),
        deliverables: {
          reelsCount: Number(formData.reelsCount),
          storiesCount: Number(formData.storiesCount)
        },
        timelineStart: formData.timelineStart,
        timelineEnd: formData.timelineEnd,
        targetAudience: formData.targetAudience,
        usageRights: formData.usageRights,
        clientBriefDoc: formData.clientBriefDoc || 'Client_Brief_Uploaded.pdf',
        status: formData.status
      };

      if (isEditing) {
        await api.updateBrief(brief.id, payload);
      } else {
        await api.createBrief(payload);
      }

      onSaved();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save brand brief.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Brief: ${brief?.campaignTitle}` : 'Create New Brand Campaign Brief'}
      subtitle="Define brand requirements, target cities, creator tiers, and commercial budget"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Brand Name *</label>
            <input
              type="text"
              name="brandName"
              required
              value={formData.brandName}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              placeholder="e.g. AuraTech Electronics"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Campaign Title *</label>
            <input
              type="text"
              name="campaignTitle"
              required
              value={formData.campaignTitle}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              placeholder="e.g. Summer Festival Launch"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Primary Objective</label>
            <select
              name="objective"
              value={formData.objective}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="Brand Awareness & Pre-Orders">Brand Awareness & Pre-Orders</option>
              <option value="Product Trial & Conversions">Product Trial & Conversions</option>
              <option value="Store Footfall & Regional Reach">Store Footfall & Regional Reach</option>
              <option value="Viral Community Engagement">Viral Community Engagement</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Total Campaign Budget (₹) *</label>
            <input
              type="number"
              name="totalBudget"
              required
              value={formData.totalBudget}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Target Categories / Niches</label>
            <input
              type="text"
              name="genres"
              value={formData.genres}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              placeholder="Mom & Lifestyle, Fashion & Lifestyle"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Target Cities (comma separated)</label>
            <input
              type="text"
              name="targetCities"
              value={formData.targetCities}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              placeholder="Chennai, Coimbatore, Bengaluru"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Target Languages</label>
            <input
              type="text"
              name="targetLanguages"
              value={formData.targetLanguages}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              placeholder="Tamil, Telugu, English"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Target Creator Tiers</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {['Nano', 'Micro', 'Mid-Tier', 'Macro', 'Mega'].map((tier) => {
                const isSelected = formData.creatorTiers?.includes(tier);
                return (
                  <button
                    type="button"
                    key={tier}
                    onClick={() => handleTierToggle(tier)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                    }`}
                  >
                    {tier}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Required Reels Count</label>
            <input
              type="number"
              name="reelsCount"
              value={formData.reelsCount}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Required Stories Count</label>
            <input
              type="number"
              name="storiesCount"
              value={formData.storiesCount}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Audience Demographics & Usage Rights</label>
          <textarea
            name="targetAudience"
            rows="2"
            value={formData.targetAudience}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
            placeholder="e.g. Women aged 20-38 with high interest in parenting and household goods..."
          />
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
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Saving Brief...' : (isEditing ? 'Update Brief' : 'Create & Match AI')}
          </button>
        </div>
      </form>
    </Modal>
  );
};
