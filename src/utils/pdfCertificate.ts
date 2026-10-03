import { jsPDF } from 'jspdf';
import { IssuedCertificateRecord } from './certificateRegistry';
import { getCertificateSignatories } from './certificateSignatories';

export interface GeneratePdfOptions {
  record: IssuedCertificateRecord;
  courseTitleEn: string;
  courseTitleSw: string;
  categoryName?: string;
}

/**
 * Generates an official, high-resolution landscape A4 PDF certificate
 * ready for immediate download.
 * Incorporates KFE authenticity elements and exact attained percentage score.
 */
export function generateCertificatePdf({
  record,
  courseTitleEn,
  courseTitleSw,
}: GeneratePdfOptions): void {
  const signatories = getCertificateSignatories();
  // A4 Landscape is 297mm wide by 210mm high
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 297;
  const pageHeight = 210;
  const centerX = pageWidth / 2;

  // 1. Soft Parchment / Ivory Canvas Background
  doc.setFillColor(254, 253, 248);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // 2. Multi-Tiered Decorative Borders
  // Outer Border: Rich Amber / Gold
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(1.2);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

  // Inner Accent Border: Deep Civic Forest Green
  doc.setDrawColor(15, 76, 58);
  doc.setLineWidth(0.4);
  doc.rect(11, 11, pageWidth - 22, pageHeight - 22);

  // Thin hairline inner border
  doc.setDrawColor(220, 200, 150);
  doc.setLineWidth(0.2);
  doc.rect(13, 13, pageWidth - 26, pageHeight - 26);

  // Corner decorative flourishes
  const drawCornerAccent = (x: number, y: number, xDir: number, yDir: number) => {
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(0.8);
    doc.line(x, y, x + xDir * 8, y);
    doc.line(x, y, x, y + yDir * 8);
  };
  drawCornerAccent(14, 14, 1, 1);
  drawCornerAccent(pageWidth - 14, 14, -1, 1);
  drawCornerAccent(14, pageHeight - 14, 1, -1);
  drawCornerAccent(pageWidth - 14, pageHeight - 14, -1, -1);

  // 3. National Kenyan Ribbon at Top and Bottom
  const drawKenyaRibbon = (yPos: number) => {
    const startX = 14;
    const width = pageWidth - 28;
    // Black band
    doc.setFillColor(15, 23, 42);
    doc.rect(startX, yPos, width, 1.8, 'F');
    // White spacer
    doc.setFillColor(255, 255, 255);
    doc.rect(startX, yPos + 1.8, width, 0.5, 'F');
    // Kenyan Red band
    doc.setFillColor(185, 28, 28);
    doc.rect(startX, yPos + 2.3, width, 1.8, 'F');
    // White spacer
    doc.setFillColor(255, 255, 255);
    doc.rect(startX, yPos + 4.1, width, 0.5, 'F');
    // Kenyan Green band
    doc.setFillColor(16, 120, 60);
    doc.rect(startX, yPos + 4.6, width, 1.8, 'F');
  };

  drawKenyaRibbon(14.5);
  drawKenyaRibbon(pageHeight - 21);

  // 4. Header Section: Kwale Focus Empowerment CBO & The Samaritan Initiative
  doc.setFont('times', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(180, 83, 9); // Amber-700
  doc.text('KWALE FOCUS EMPOWERMENT CBO', centerX, 29, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105); // Slate-600
  doc.text(
    'THE SAMARITAN • DIGITAL CIVIC EDUCATION & GOVERNMENT LITERACY INITIATIVE',
    centerX,
    34,
    { align: 'center' }
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'REPUBLIC OF KENYA • KOMBANI, MATUGA SUB-COUNTY, KWALE COUNTY',
    centerX,
    38,
    { align: 'center' }
  );

  // Divider Line with Diamond Center Accent
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.3);
  doc.line(centerX - 60, 41, centerX - 5, 41);
  doc.line(centerX + 5, 41, centerX + 60, 41);
  doc.setFillColor(217, 119, 6);
  doc.rect(centerX - 2, 39.8, 4, 2.4, 'F');

  // 5. Certificate Main Title
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text('CERTIFICATE OF CIVIC COURSE COMPETENCY', centerX, 50, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(146, 64, 14); // Amber-800
  doc.text(
    'Issued under the Constitutional Literacy & Devolved Governance Framework',
    centerX,
    55.5,
    { align: 'center' }
  );

  // 6. Presentation Statement
  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text('This is to solemnly certify that', centerX, 67, { align: 'center' });

  // 7. Recipient Full Name
  doc.setFont('times', 'bold');
  doc.setFontSize(23);
  doc.setTextColor(6, 78, 59); // Deep Emerald
  doc.text(record.recipientName, centerX, 79, { align: 'center' });

  // Underline beneath Recipient Name
  const nameWidth = Math.min(doc.getTextWidth(record.recipientName) + 16, 170);
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.6);
  doc.line(centerX - nameWidth / 2, 82, centerX + nameWidth / 2, 82);

  // 8. Competency Description
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  doc.text(
    'has satisfactorily completed the curriculum requirements, analyzed constitutional provisions,',
    centerX,
    91,
    { align: 'center' }
  );
  doc.text(
    'and successfully demonstrated proficiency in the specialized civic education course:',
    centerX,
    96,
    { align: 'center' }
  );

  // 9. Course Info Container Box
  const boxWidth = 200;
  const boxHeight = 25;
  const boxX = centerX - boxWidth / 2;
  const boxY = 101;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 2.5, 2.5, 'FD');

  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(courseTitleEn, centerX, boxY + 7.5, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(courseTitleSw, centerX, boxY + 13.5, { align: 'center' });

  const percentage = Math.round((record.score / record.total) * 100);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(13, 148, 136); // Teal-600
  doc.text(
    `Assessment Score: ${percentage}%   •   Grade: ${record.grade}   •   Official Civic Accreditation`,
    centerX,
    boxY + 20,
    { align: 'center' }
  );

  // 10. Signatures and Official Stamp Section
  const leftSigX = 65;
  const centerStampX = centerX;
  const rightSigX = pageWidth - 65;
  const sigLineY = 145;

  // Left Signature: Signatory 1 (e.g. KFE Program Coordinator Amina Ntsiki Bedzengah)
  doc.setFont('times', 'italic');
  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59);
  doc.text(signatories.signatory1Name, leftSigX, sigLineY - 2, { align: 'center' });

  doc.setDrawColor(100, 116, 139);
  doc.setLineWidth(0.4);
  doc.line(leftSigX - 35, sigLineY, leftSigX + 35, sigLineY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(signatories.signatory1TitleEn.toUpperCase(), leftSigX, sigLineY + 4, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(signatories.signatory1Org, leftSigX, sigLineY + 8, { align: 'center' });

  // Center Official Seal & Authenticity Box
  doc.setDrawColor(217, 119, 6);
  doc.setFillColor(254, 243, 199);
  doc.setLineWidth(0.8);
  doc.circle(centerStampX, sigLineY - 1, 13, 'FD');

  doc.setDrawColor(180, 83, 9);
  doc.setLineWidth(0.3);
  doc.circle(centerStampX, sigLineY - 1, 11.2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(180, 83, 9);
  doc.text('KFE VERIFIED', centerStampX, sigLineY - 2.5, { align: 'center' });

  doc.setFontSize(5.5);
  doc.setTextColor(146, 64, 14);
  doc.text('AUTHENTICITY BOX', centerStampX, sigLineY + 1.5, { align: 'center' });

  doc.setFontSize(4.5);
  doc.setTextColor(161, 98, 7);
  doc.text('KWALE FOCUS EMPOWERMENT', centerStampX, sigLineY + 4.5, { align: 'center' });

  // Right Signature: Signatory 2 (e.g. KFE Executive Director Mesalim Ali Rambo)
  doc.setFont('times', 'italic');
  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59);
  doc.text(signatories.signatory2Name, rightSigX, sigLineY - 2, { align: 'center' });

  doc.setDrawColor(100, 116, 139);
  doc.setLineWidth(0.4);
  doc.line(rightSigX - 35, sigLineY, rightSigX + 35, sigLineY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(signatories.signatory2TitleEn.toUpperCase(), rightSigX, sigLineY + 4, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(signatories.signatory2Org, rightSigX, sigLineY + 8, { align: 'center' });

  // 11. Bottom Serial & Authentication Metadata
  doc.setFont('courier', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Official Serial No: ${record.id}`, centerX, 172, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Non-transferable official citizen record • Verify at The Samaritan Civic Portal • Verification Hash: ${record.checksum}`,
    centerX,
    177,
    { align: 'center' }
  );

  // 12. Save PDF with a clean, descriptive file name
  const cleanName = record.recipientName.replace(/[^a-zA-Z0-9]/g, '_');
  const cleanCourse = courseTitleEn.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `The_Samaritan_Certificate_${cleanName}_${cleanCourse}.pdf`;

  doc.save(filename);
}
