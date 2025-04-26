import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from "../../environments/environment";

const HEADER_IMAGE_PATH = 'assets/images/Head letter - Header.png';
const FOOTER_IMAGE_PATH = 'assets/images/Head letter - Footer.png';

export class EvaluationPdfExportUtil {
  static async exportEvaluationToPdf(
    evaluationData: any,
    fileName: string = 'evaluation.pdf'
  ) {
    // Create PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.height;

    // Add header image
    const headerImg = new Image();
    headerImg.src = HEADER_IMAGE_PATH;
    await new Promise((resolve) => {
      headerImg.onload = resolve;
    });
    const headerHeight = (headerImg.height * pageWidth) / headerImg.width;
    pdf.addImage(headerImg, 'PNG', 0, 0, pageWidth, headerHeight);

    // Set up Arabic font support
    pdf.setLanguage('ar');
    pdf.addFileToVFS('Amiri.ttf', environment.amirifont);
    pdf.addFont('Amiri.ttf', 'Amiri', 'normal');
    pdf.setFont('Amiri');

    let yPosition = headerHeight + 10;

    // Add evaluation header information
    pdf.setFontSize(18);
    pdf.setTextColor(44, 61, 138);
    const title = 'تقييم الطالب/ة';
    const titleWidth = pdf.getStringUnitWidth(title) * 18 / pdf.internal.scaleFactor;
    pdf.text(title, (pageWidth - titleWidth) / 2, yPosition);
    yPosition += 10;

    // Add form information
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    
    // Form name
    pdf.setFontSize(14);
    pdf.text(`النموذج: ${evaluationData.formName}`, pageWidth - 15, yPosition, { align: 'right' });
    yPosition += 8;

    // Dates
    pdf.setFontSize(12);
    if (evaluationData.date1) {
      pdf.text(`التاريخ 1: ${evaluationData.date1}`, pageWidth - 15, yPosition, { align: 'right' });
      yPosition += 7;
    }
    
    if (evaluationData.date2) {
      pdf.text(`التاريخ 2: ${evaluationData.date2}`, pageWidth - 15, yPosition, { align: 'right' });
      yPosition += 7;
    }
    
    if (evaluationData.date3) {
      pdf.text(`التاريخ 3: ${evaluationData.date3}`, pageWidth - 15, yPosition, { align: 'right' });
      yPosition += 7;
    }

    // Evaluators
    if (evaluationData.evaluators && evaluationData.evaluators.length > 0) {
      pdf.text(`القائمين بالتقييم: ${evaluationData.evaluators.join(', ')}`, pageWidth - 15, yPosition, { align: 'right' });
      yPosition += 7;
    }

    // Note
    if (evaluationData.note) {
      pdf.text(`ملاحظات: ${evaluationData.note}`, pageWidth - 15, yPosition, { align: 'right' });
      yPosition += 7;
    }

    // Status information
    pdf.text(`انتهى: ${evaluationData.done ? 'نعم' : 'لا'}`, pageWidth - 15, yPosition, { align: 'right' });
    yPosition += 7;
    
    pdf.text(`نجح: ${evaluationData.pass ? 'نعم' : 'لا'}`, pageWidth - 15, yPosition, { align: 'right' });
    yPosition += 10;

    // Add questions and answers
    if (evaluationData.questions && evaluationData.questions.length > 0) {
      pdf.setFontSize(14);
      pdf.setTextColor(44, 61, 138);
      pdf.text('الأسئلة والإجابات', pageWidth - 15, yPosition, { align: 'right' });
      yPosition += 8;

      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);

      // Create table data for questions and answers
      const tableData = evaluationData.questions.map((q: any) => [
        q.note || '',
        q.answer || '',
        q.title || ''
      ]);

      // Add table headers
      const headers = [['ملاحظات', 'الإجابة', 'السؤال']];

      // Add table using autoTable
      autoTable(pdf, {
        head: headers,
        body: tableData,
        startY: yPosition,
        theme: 'striped',
        styles: {
          fontSize: 10,
          cellWidth: 'auto',
          halign: 'right',
          valign: 'middle',
          font: 'Amiri',
        },
        headStyles: {
          fillColor: [44, 61, 138],
          font: 'Amiri',
        },
        columnStyles: {
          0: { cellWidth: 60 }, // Notes
          1: { cellWidth: 50 }, // Answer
          2: { cellWidth: 80 }, // Question
        }
      });

      // Get the final y position after the table
      yPosition = (pdf as any).lastAutoTable.finalY + 10;
    }

    // Add footer image
    const footerImg = new Image();
    footerImg.src = FOOTER_IMAGE_PATH;
    await new Promise((resolve) => {
      footerImg.onload = resolve;
    });
    const footerHeight = (footerImg.height * pageWidth) / footerImg.width;
    pdf.addImage(footerImg, 'PNG', 0, pageHeight - footerHeight, pageWidth, footerHeight);

    // Save the PDF
    pdf.save(fileName);
  }
}
