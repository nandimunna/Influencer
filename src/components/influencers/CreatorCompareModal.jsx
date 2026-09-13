import React from 'react';
import { Modal } from '../common/Modal';
import { ExternalLink, CheckCircle2, TrendingUp, DollarSign, Users, Award } from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export const CreatorCompareModal = ({ isOpen, onClose, creators = [] }) => {
  if (creators.length === 0) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Side-by-Side Creator Benchmarking"
      subtitle={`Comparing ${creators.length} creators across followers, engagement, price and gender audience split`}
      maxWidth="max-w-5xl"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr>
              <th className="p-3 bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 w-44">
                Metric / Creator
              </th>
              {creators.map((c) => (
                <th key={c.id} className="p-3 bg-slate-900/90 text-white font-bold border-b border-slate-800 text-center min-w-[180px]">
                  <div className="flex flex-col items-center space-y-1.5">
                    <img src={c.avatar} alt={c.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-purple-500/40" />
                    <div>
                      <p className="font-bold text-sm text-white">{c.name}</p>
                      <a 
                        href={c.igLink || `https://instagram.com/${c.handle.replace('@', '')}`}
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[11px] text-purple-400 hover:underline inline-flex items-center gap-1 font-mono"
                      >
                        <span>{c.handle}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-200">
            <tr className="hover:bg-slate-800/30">
              <td className="p-3 font-semibold text-slate-400 bg-slate-900/40">Category / Niche</td>
              {creators.map((c) => (
                <td key={c.id} className="p-3 text-center">
                  <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-medium">
                    {c.primaryGenre}
                  </span>
                </td>
              ))}
            </tr>

            <tr className="hover:bg-slate-800/30">
              <td className="p-3 font-semibold text-slate-400 bg-slate-900/40">Location & Language</td>
              {creators.map((c) => (
                <td key={c.id} className="p-3 text-center">
                  <p className="font-medium text-white">{c.city}</p>
                  <p className="text-[11px] text-slate-400">{c.languages?.join(', ') || 'Tamil'}</p>
                </td>
              ))}
            </tr>

            <tr className="hover:bg-slate-800/30">
              <td className="p-3 font-semibold text-slate-400 bg-slate-900/40">Total Followers</td>
              {creators.map((c) => (
                <td key={c.id} className="p-3 text-center text-sm font-extrabold text-white">
                  {formatNumber(c.followerCount)}
                </td>
              ))}
            </tr>

            <tr className="hover:bg-slate-800/30">
              <td className="p-3 font-semibold text-slate-400 bg-slate-900/40">Average Reel Views</td>
              {creators.map((c) => (
                <td key={c.id} className="p-3 text-center font-bold text-emerald-400">
                  {formatNumber(c.avgViews)}
                </td>
              ))}
            </tr>

            <tr className="hover:bg-slate-800/30">
              <td className="p-3 font-semibold text-slate-400 bg-slate-900/40">Engagement Rate (ER %)</td>
              {creators.map((c) => (
                <td key={c.id} className="p-3 text-center">
                  <span className={`px-2.5 py-1 rounded-lg font-extrabold ${
                    c.engagementRate >= 8 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    c.engagementRate >= 4 ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {c.engagementRate}%
                  </span>
                </td>
              ))}
            </tr>

            <tr className="hover:bg-slate-800/30">
              <td className="p-3 font-semibold text-slate-400 bg-slate-900/40">Gender Audience Split</td>
              {creators.map((c) => {
                const fPct = c.genderDemographics?.femalePct || 75;
                const mPct = c.genderDemographics?.malePct || 25;
                return (
                  <td key={c.id} className="p-3 text-center">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-pink-400">F: {fPct}%</span>
                        <span className="text-blue-400">M: {mPct}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                        <div className="bg-pink-500 h-full" style={{ width: `${fPct}%` }}></div>
                        <div className="bg-blue-500 h-full" style={{ width: `${mPct}%` }}></div>
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>

            <tr className="hover:bg-slate-800/30">
              <td className="p-3 font-semibold text-slate-400 bg-slate-900/40">Commercial Rate (1 Reel + DR)</td>
              {creators.map((c) => (
                <td key={c.id} className="p-3 text-center font-extrabold text-white text-sm">
                  {formatCurrency(c.pricing?.reelWithDR || c.pricing?.reel || 0)}
                </td>
              ))}
            </tr>

            <tr className="hover:bg-slate-800/30">
              <td className="p-3 font-semibold text-slate-400 bg-slate-900/40">Est. CPV (Cost per View)</td>
              {creators.map((c) => {
                const cost = c.pricing?.reelWithDR || c.pricing?.reel || 50000;
                const views = c.avgViews || 100000;
                const cpv = ((cost / views)).toFixed(2);
                return (
                  <td key={c.id} className="p-3 text-center font-mono text-xs text-purple-300 font-bold">
                    ₹{cpv} / view
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow"
        >
          Close Comparison
        </button>
      </div>
    </Modal>
  );
};
