import { company } from '@/data/company';
import { estimateNote, formatRange, totalRange, type EstimateLine } from '@/data/estimate';
import type { EstimateDetails } from '@/lib/estimateStore';

type Color = [number, number, number];
const ink: Color = [32, 11, 56];
const violet: Color = [108, 63, 184];
const gold: Color = [239, 181, 43];
const muted: Color = [120, 112, 130];
const soft: Color = [247, 244, 251];

// Turn the logo into data the PDF can embed. Skip it quietly if it fails.
async function loadLogo() {
  try {
    const response = await fetch(company.logo);
    const blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

const pad = (value: number) => String(value).padStart(2, '0');

// Build a one-page, receipt-style summary and start the download.
// jsPDF only loads when someone actually asks for the PDF.
export async function downloadEstimatePdf(details: EstimateDetails, lines: readonly EstimateLine[], requestReference?: string) {
  const total = totalRange(lines);
  const [{ jsPDF }, logo] = await Promise.all([import('jspdf'), loadLogo()]);
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const left = 64;
  const right = width - 64;
  const now = new Date();
  const reference = requestReference || `CI-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
  const place = [details.address.trim(), details.city === 'Other' ? '' : `${details.city}, AZ`].filter(Boolean).join(', ');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  const contactLines: string[] = [
    `Prepared for ${details.name.trim() || 'customer'}${place ? `  ·  ${place}` : ''}`,
    `Email: ${details.email}`, `Phone: ${details.phone}`,
  ].flatMap((line) => doc.splitTextToSize(line, right - left));
  const headerHeight = Math.max(280, 224 + contactLines.length * 14 + 12);

  // A soft lavender wash behind the top of the page, with a gold edge.
  doc.setFillColor(...soft);
  doc.rect(0, 0, width, headerHeight, 'F');
  doc.setFillColor(...gold);
  doc.rect(0, 0, 6, height, 'F');

  if (logo) doc.addImage(logo, 'PNG', left, 52, 54, 54);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...violet);
  doc.text('INSTANT ESTIMATE', right, 66, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...muted);
  doc.text(reference, right, 80, { align: 'right' });
  doc.text(now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), right, 94, { align: 'right' });
  doc.text('Home / single building', right, 108, { align: 'right' });

  // Big, friendly title.
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(30);
  doc.setTextColor(...ink);
  const givenName = details.name.trim().split(/\s+/)[0] || 'there';
  const firstName = givenName.length > 25 ? 'there' : givenName;
  doc.text(`Hi ${firstName},`, left, 160);
  doc.setTextColor(...violet);
  doc.text("here's your clean.", left, 194);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...muted);
  contactLines.forEach((line, index) => doc.text(line, left, 224 + index * 14));

  // Each service as a receipt line with a dotted leader to its price.
  let y = headerHeight + 36;
  const ensureSpace = (needed: number) => {
    if (y + needed <= height - 56) return;
    doc.addPage();
    y = 72;
  };
  lines.forEach((line, index) => {
    ensureSpace(46);
    const price = line.range ? formatRange(line.range).replace('–', '-') : 'Photo quote';

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...gold);
    doc.text(pad(index + 1), left, y);

    doc.setFontSize(13);
    doc.setTextColor(...ink);
    doc.text(line.name, left + 26, y);
    const nameEnd = left + 26 + doc.getTextWidth(line.name) + 8;

    doc.setFontSize(13);
    const priceStart = right - doc.getTextWidth(price) - 8;
    doc.text(price, right, y, { align: 'right' });

    // Dotted leader.
    doc.setFillColor(205, 196, 218);
    for (let x = nameEnd; x < priceStart; x += 5) doc.circle(x, y - 3.5, 0.6, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...muted);
    doc.text(line.details, left + 26, y + 16);
    y += 46;
  });

  const pending = lines.some((line) => !line.range);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const note = pending ? `Hard water removal is quoted separately after photo review. ${estimateNote}` : estimateNote;
  const noteLines: string[] = doc.splitTextToSize(note, right - left - 26);
  const noteGap = Math.max(48, noteLines.length * 12 + 18);
  ensureSpace(42 + 40 + noteGap + 46);
  // Total: a short gold rule, then a big number.
  y += 8;
  doc.setDrawColor(...gold);
  doc.setLineWidth(2);
  doc.line(right - 160, y, right, y);
  y += 34;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...muted);
  doc.text(`${pending && total ? 'Priced services total' : 'Likely total'} · ${lines.length} service${lines.length === 1 ? '' : 's'}`, left + 26, y - 8);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(total ? 28 : 20);
  doc.setTextColor(...ink);
  doc.text(total ? formatRange(total).replace('–', '-') : 'Quoted from photos', right, y, { align: 'right' });

  y += 40;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...muted);
  doc.text(noteLines, left + 26, y);

  // Next step, set apart with a violet bar instead of a box.
  y += noteGap;
  doc.setFillColor(...violet);
  doc.rect(left + 26, y - 12, 3, 46, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...ink);
  doc.text('Ready to book?', left + 40, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(...muted);
  doc.text(
    doc.splitTextToSize(`Call or text ${company.phone} and mention ${reference}. We'll confirm your price and find a time that works for you.`, right - left - 60),
    left + 40,
    y + 16,
  );

  // Repeat the footer if long contact details needed an additional page.
  for (let page = 1; page <= doc.getNumberOfPages(); page++) {
    doc.setPage(page);
    doc.setFontSize(9);
    doc.setTextColor(...muted);
    doc.text(company.name, left, height - 44);
    doc.text(`${company.phone}  ·  ${company.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}`, right, height - 44, { align: 'right' });
  }

  const safeName = details.name.trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'estimate';
  doc.save(`Clear-Impression-estimate-${safeName}.pdf`);
  return reference;
}
