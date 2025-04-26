import * as XLSX from 'xlsx';

export class ExcelExportUtil {
  static exportToExcel(
    tableData: any[], // Pass the data directly as an array of arrays
    headers: string[], // Pass the headers for the table
    fileName: string = 'export.xlsx',
    sheetName: string = 'sheet1'
  ) {
    try {
      // Prepare the data for Excel
      const data = [
        headers.slice(), // Reverse headers for RTL support
        ...tableData.map(row => row.slice()).filter(row => row.length > 0)
      ];

      // Create a worksheet
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

      // Set RTL for the worksheet
      ws['!rtl'] = true;

      // Create a workbook
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName);

      // Generate Excel file and trigger download
      XLSX.writeFile(wb, fileName);
      
      return true;
    } catch (error) {
      console.error('Excel export error:', error);
      return false;
    }
  }
}
