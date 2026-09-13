import * as XLSX from 'xlsx';

export const exportProposalToExcel = (proposal, isInternalView = false) => {
  const creators = proposal.creatorsData || [];

  const headers = isInternalView ? [
    'Creator Name',
    'Handle',
    'Niche / Genre',
    'City',
    'Followers',
    'Deliverables Scope',
    'Creator Buy Rate (₹)',
    'Agency Margin (%)',
    'Client Final Price (₹)',
    'AI / Strategy Rationale'
  ] : [
    'Creator Name',
    'Handle',
    'Niche / Genre',
    'City',
    'Followers',
    'Deliverables Scope',
    'Client Quotation (₹)',
    'Target Audience Resonance'
  ];

  const rows = creators.map(c => {
    const deliverables = Array.isArray(c.selectedDeliverables) ? c.selectedDeliverables.join(' + ') : (c.selectedDeliverables || '1x Reel');
    if (isInternalView) {
      return [
        c.name,
        c.handle,
        c.genre || 'Creator',
        c.city || 'India',
        c.followers || 0,
        deliverables,
        c.creatorBuyPrice || 0,
        `${c.marginPct || proposal.marginPercentage || 20}%`,
        c.clientQuotePrice || 0,
        c.rationale || ''
      ];
    } else {
      return [
        c.name,
        c.handle,
        c.genre || 'Creator',
        c.city || 'India',
        c.followers || 0,
        deliverables,
        c.clientQuotePrice || 0,
        c.rationale || ''
      ];
    }
  });

  if (isInternalView) {
    rows.push([
      'TOTAL MEDIA PLAN',
      '',
      '',
      '',
      '',
      `${creators.length} Creators`,
      proposal.totalCreatorCost || 0,
      `${proposal.marginPercentage || 20}% Avg Margin`,
      proposal.finalClientPrice || 0,
      `Gross Profit: ₹${(proposal.totalAgencyMargin || 0).toLocaleString('en-IN')}`
    ]);
  } else {
    rows.push([
      'TOTAL PACKAGE QUOTATION',
      '',
      '',
      '',
      '',
      `${creators.length} Creators`,
      proposal.finalClientPrice || 0,
      'Exclusive of 18% GST'
    ]);
  }

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Media Plan');

  const filename = `${proposal.proposalCode || 'MediaPlan'}_${isInternalView ? 'INTERNAL' : 'CLIENT'}.xlsx`;
  XLSX.writeFile(workbook, filename);
};
