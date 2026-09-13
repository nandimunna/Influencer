import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportProposalToPDF = (proposal, brandBrief) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [109, 40, 217];
  const darkTextColor = [30, 41, 59];
  const mutedTextColor = [100, 116, 139];

  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 36, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('NexCreator | Media Proposal', 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Proposal Ref: ${proposal.proposalCode || 'PROP-2026'} | Version: ${proposal.version || 'v1'}`, 14, 28);
  doc.text(`Date: ${new Date().toLocaleDateString('en-US', { dateStyle: 'medium' })}`, 145, 28);

  let currentY = 46;
  doc.setTextColor(...darkTextColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(proposal.title || 'Creator Media Plan', 14, currentY);

  currentY += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...mutedTextColor);
  doc.text(`Client Brand: ${proposal.clientName || 'Partner'}`, 14, currentY);
  doc.text(`Prepared By: NexCreator Campaign Solutions`, 120, currentY);

  currentY += 6;
  if (brandBrief) {
    doc.text(`Campaign Objective: ${brandBrief.objective || 'Brand Awareness'}`, 14, currentY);
    doc.text(`Target Timeline: ${brandBrief.timelineStart || 'Immediate'} to ${brandBrief.timelineEnd || '30 Days'}`, 120, currentY);
    currentY += 6;
  }

  currentY += 4;
  doc.setDrawColor(226, 232, 240);
  doc.line(14, currentY, 196, currentY);

  currentY += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text('Recommended Creator Lineup & Deliverables', 14, currentY);

  const creators = proposal.creatorsData || [];
  const tableData = creators.map((c, index) => {
    const deliverablesStr = Array.isArray(c.selectedDeliverables) 
      ? c.selectedDeliverables.join('\n• ') 
      : (c.selectedDeliverables || '1x Reel');
    
    return [
      `${index + 1}. ${c.name}\n${c.handle}\n(${c.genre || 'Creator'})`,
      c.city || 'India',
      c.followers ? `${(c.followers / 1000).toFixed(0)}K` : 'Verified',
      `• ${deliverablesStr}`,
      `Rs. ${(c.clientQuotePrice || 0).toLocaleString('en-IN')}`
    ];
  });

  autoTable(doc, {
    startY: currentY + 4,
    head: [['Creator & Niche', 'Location', 'Reach', 'Scope of Deliverables', 'Commercial Quote']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: darkTextColor,
      cellPadding: 3.5
    },
    columnStyles: {
      0: { cellWidth: 42 },
      1: { cellWidth: 24 },
      2: { cellWidth: 20 },
      3: { cellWidth: 68 },
      4: { cellWidth: 30, halign: 'right', fontStyle: 'bold' }
    }
  });

  currentY = doc.lastAutoTable.finalY + 10;

  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(120, currentY, 76, 28, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(120, currentY, 76, 28, 3, 3, 'D');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...mutedTextColor);
  doc.text('Total Package Value:', 125, currentY + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text(`INR ${(proposal.finalClientPrice || 0).toLocaleString('en-IN')}`, 125, currentY + 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...mutedTextColor);
  doc.text('(Exclusive of 18% GST)', 125, currentY + 24);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...darkTextColor);
  doc.text('Key Campaign Terms & Scope:', 14, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...mutedTextColor);
  const terms = [
    '• Includes 1 round of script draft review and 1 round of video cut revisions.',
    '• 30-day digital whitelisting and organic brand collaboration rights included.',
    '• Direct contact coordinates and commercial contracts are managed end-to-end by NexCreator.',
    '• Deliverables will be posted in accordance with agreed timeline upon 50% advance sign-off.'
  ];
  let termY = currentY + 12;
  terms.forEach(t => {
    doc.text(t, 14, termY);
    termY += 5;
  });

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`NexCreator Platform • Confidential Client Proposal • Page ${i} of ${pageCount}`, 14, 288);
  }

  doc.save(`${proposal.proposalCode || 'Proposal'}_Client_Ready.pdf`);
};
