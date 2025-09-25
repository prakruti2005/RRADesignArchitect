import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export type BudgetKey = 'basic' | 'balanced' | 'premium';
export type CategoryKey = 'design' | 'materials' | 'lighting' | 'furniture' | 'execution';
export type ProjectSize = 'small' | 'medium' | 'large';

export type PdfCategory = {
  id: CategoryKey;
  label: string;
  percentage: number;
  amount: number; 
  level: BudgetKey; 
};

export type PdfPayload = {
  
  name: string;
  email: string;
  phone: string;
  propertySubtype: string;
  location: string;
  purpose: string;
  priorities: string[];
  notes: string;

  
  area: number; 
  projectSize: ProjectSize;
  projectSizeLabel: string; 
  projectSizeSqftHint: string; 

  
  totalCost: number;
  perSqFt: number | null;

  
  categories: PdfCategory[];
};

const formatINR = (value: number) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export async function generateDesignQuotePdf(payload: PdfPayload) {
  const {
    name,
    email,
    phone,
    propertySubtype,
    location,
    purpose,
    priorities,
    notes,
    area,
    projectSizeLabel,
    projectSizeSqftHint,
    totalCost,
    perSqFt,
    categories,
  } = payload;

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  

  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Design Quotient — Quote Summary', margin, 60);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const dateStr = new Date().toLocaleString();
  doc.text(dateStr, pageWidth - margin, 60, { align: 'right' });

  
  let y = 90;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Client Details', margin, y);
  doc.setFont('helvetica', 'normal');
  y += 16;
  const detailsLeft = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
  ];
  const detailsRight = [
    `Property Type: ${propertySubtype}`,
    `Purpose: ${purpose}`,
    `Location: ${location}`,
  ];
  detailsLeft.forEach((t, i) => {
    doc.text(t, margin, y + i * 14);
  });
  detailsRight.forEach((t, i) => {
    doc.text(t, pageWidth / 2, y + i * 14);
  });

  
  y += 14 * Math.max(detailsLeft.length, detailsRight.length) + 8;

  
  doc.setFont('helvetica', 'bold');
  doc.text('Project Summary', margin, y);
  y += 16;
  doc.setFont('helvetica', 'normal');
  doc.text(`Declared Area: ${area} sq.ft`, margin, y);
  y += 14;
  doc.text(`Size: ${projectSizeLabel} (${projectSizeSqftHint} sq.ft)`, margin, y);
  y += 14;
  doc.text(`Estimated Total: ${formatINR(totalCost)}`, margin, y);
  if (perSqFt) {
    y += 14;
    doc.text(`Approx. per sq.ft: ${formatINR(perSqFt)}`, margin, y);
  }

  
  y += 20;
  doc.setFont('helvetica', 'bold');
  doc.text('Design Priorities', margin, y);
  y += 14;
  doc.setFont('helvetica', 'normal');
  const priText = priorities.length ? priorities.join(', ') : '—';
  doc.text(priText, margin, y, { maxWidth: pageWidth - margin * 2 });

  if (notes && notes.trim()) {
    y += 20;
    doc.setFont('helvetica', 'bold');
    doc.text('Notes', margin, y);
    y += 14;
    doc.setFont('helvetica', 'normal');
    const split = doc.splitTextToSize(notes, pageWidth - margin * 2);
    split.forEach((line: string) => {
      y += 12;
      doc.text(line, margin, y);
    });
  }

  y += 22;

  
  autoTable(doc, {
    startY: y,
    head: [[
      'Category',
      'Budget Level',
      'Share %',
      'Amount',
    ]],
    body: categories.map((c) => [
      c.label,
      c.level.charAt(0).toUpperCase() + c.level.slice(1),
      `${c.percentage}%`,
      formatINR(c.amount),
    ]),
    styles: { fontSize: 10, cellPadding: 6 },
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    theme: 'striped',
    margin: { left: margin, right: margin },
  });

  
  const footerY = doc.internal.pageSize.getHeight() - margin;
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text('Estimates are indicative and may vary after site survey, scope finalization, and vendor quotes.', margin, footerY);
  doc.setTextColor(0);

  const fileNameSafe = name ? name.trim().replace(/\s+/g, '_') : 'quote';
  const fileName = `Design_Quote_${fileNameSafe}.pdf`;
  doc.save(fileName);
}
