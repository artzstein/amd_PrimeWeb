import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

export interface DashboardExportData {
  dashboardName: string;
  generatedAt: Date;
  widgets: Array<{
    title: string;
    type: string;
    data?: any;
  }>;
}

export const generateDashboardPDF = (
  dashboardData: DashboardExportData
): Readable => {
  const doc = new PDFDocument();

  // Title
  doc.fontSize(24).text('Dashboard Report', { align: 'center' }).moveDown(0.5);

  // Dashboard info
  doc.fontSize(12).text(`Dashboard: ${dashboardData.dashboardName}`, { align: 'left' });
  doc.text(`Generated: ${dashboardData.generatedAt.toLocaleString()}`, {
    align: 'left',
  });
  doc.moveDown();

  // Widgets summary
  if (dashboardData.widgets && dashboardData.widgets.length > 0) {
    doc.fontSize(14).text('Widgets Summary', { underline: true }).moveDown();

    dashboardData.widgets.forEach((widget, index) => {
      doc
        .fontSize(12)
        .text(`${index + 1}. ${widget.title}`, {
          align: 'left',
        })
        .fontSize(10)
        .text(`Type: ${widget.type}`, { align: 'left', margin: [0, 0, 0, 20] })
        .moveDown();
    });
  }

  // Footer
  doc.moveDown();
  doc.fontSize(9).text('© Analytics Platform - AI-Powered BI Tool', {
    align: 'center',
    color: '#999',
  });

  doc.end();

  return doc;
};

export const generateReportPDF = (
  title: string,
  content: string,
  data?: any
): Readable => {
  const doc = new PDFDocument();

  doc.fontSize(20).text(title, { align: 'center' }).moveDown();

  doc.fontSize(12).text(content).moveDown();

  if (data) {
    doc.fontSize(10).text(JSON.stringify(data, null, 2));
  }

  doc.end();

  return doc;
};
