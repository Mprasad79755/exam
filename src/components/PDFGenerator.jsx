import React from 'react';
import jsPDF from 'jspdf';
import { Download, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PDFGenerator({ examData, onDownload }) {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Add decorative border
    doc.setDrawColor(59, 130, 246); // Blue color
    doc.setLineWidth(2);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Add inner border
    doc.setDrawColor(219, 234, 254); // Light blue
    doc.setLineWidth(1);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text('Diplomax Academy', 20, 30);
    
    doc.setFontSize(16);
    doc.setTextColor(75, 85, 99);
    doc.text('SkillUp Exam — Completion Receipt', pageWidth / 2, 45, { align: 'center' });

    // Add watermark
    doc.setFontSize(60);
    doc.setTextColor(240, 245, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('DIPLOMAX', pageWidth / 2, pageHeight / 2, { 
      align: 'center',
      angle: 45
    });

    // Reset for content
    doc.setTextColor(75, 85, 99);
    doc.setFont('helvetica', 'normal');

    // Content
    let yPosition = 70;
    const lineHeight = 12;

    const addLine = (label, value, bold = false) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(label + ':', 20, yPosition);
      
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setFontSize(12);
      const labelWidth = doc.getTextWidth(label + ': ');
      doc.text(value, 20 + labelWidth + 5, yPosition);
      
      yPosition += lineHeight + 3;
    };

    addLine('Student UID', examData.uid);
    addLine('Record ID', examData.recordId, true);
    addLine('Exam Title', examData.examTitle);
    addLine('Status', examData.status === 'completed' ? 'Successfully Completed' : 'Disqualified', true);
    addLine('Submitted At', new Date(examData.submittedAt).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata',
      timeZoneName: 'short'
    }));

    if (examData.score) {
      addLine('Score', `${examData.score.totalScore}/${examData.score.maxScore} marks`);
    }

    // Message
    yPosition += 20;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 197, 94); // Green color

    const message = examData.status === 'completed' 
      ? 'Congratulations! You have successfully completed the SkillUp Exam by Diplomax Academy.'
      : 'Exam was submitted due to rule violations. Please contact administration for further details.';

    const splitMessage = doc.splitTextToSize(message, pageWidth - 40);
    doc.text(splitMessage, 20, yPosition);

    // Footer
    yPosition = pageHeight - 40;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(107, 114, 128);
    doc.text('This is a computer-generated receipt. Contact admin@diplomax.academy for queries.', 
             pageWidth / 2, yPosition, { align: 'center' });

    // Add timestamp
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`, 
             pageWidth / 2, yPosition + 10, { align: 'center' });

    // Save the PDF
    const fileName = `SkillUp_Certificate_${examData.recordId}.pdf`;
    doc.save(fileName);

    if (onDownload) {
      onDownload(fileName);
    }
  };

  return (
    <motion.button
      onClick={generatePDF}
      className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Award className="w-5 h-5" />
      Download Certificate
      <Download className="w-5 h-5" />
    </motion.button>
  );
}