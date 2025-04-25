import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {environment} from "../../environments/environment";

const HEADER_IMAGE_PATH = 'assets/images/Head letter - Header.png';
const FOOTER_IMAGE_PATH = 'assets/images/Head letter - Footer.png';

export class PdfExportUtil {
  static async exportToPdf(
      tableData: any[], // Pass the data directly as an array of arrays
      headers: string[], // Pass the headers for the table
      fileName: string = 'export.pdf'
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

    pdf.setLanguage('ar');
    pdf.addFileToVFS('Amiri.ttf', environment.amirifont);
    pdf.addFont('Amiri.ttf', 'Amiri', 'normal');
    pdf.setFont('Amiri');

    const head = [headers.reverse()];
    const body = tableData.map(row => row.reverse()).filter(row => row.length > 0);

    // Add table using autoTable
    autoTable(pdf, {
      head: head,
      body: body,
      startY: headerHeight + 10,
      theme: 'striped',
      styles: {
        fontSize: 7,
        cellWidth: 'auto',
        minCellWidth: 20,
        halign: 'right',
        valign: 'middle',
        font: 'Amiri',
      },
      headStyles: {
        fillColor: [44, 61, 138],
        font: 'Amiri',
      }
    });

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