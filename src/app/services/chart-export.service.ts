import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';

export interface ChartData {
  title: string;
  headers: string[];
  rows: any[][];
}

@Injectable({
  providedIn: 'root'
})
export class ChartExportService {
  constructor(private toastService: ToastService) {}

  /**
   * Export chart data to CSV format
   */
  exportToCSV(data: ChartData): void {
    try {
      // Create CSV content
      const csvContent = [
        data.headers.join(','),
        ...data.rows.map(row => row.map(cell => this.escapeCSV(cell)).join(','))
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const filename = `${this.sanitizeFilename(data.title)}_${this.getTimestamp()}.csv`;
      this.downloadBlob(blob, filename);

      this.toastService.success(`Exported to ${filename}`);
    } catch (error) {
      console.error('CSV export error:', error);
      this.toastService.error('Failed to export CSV');
    }
  }

  /**
   * Export chart data to JSON format
   */
  exportToJSON(data: ChartData): void {
    try {
      const jsonData = {
        title: data.title,
        exportedAt: new Date().toISOString(),
        headers: data.headers,
        data: data.rows.map(row => {
          const obj: any = {};
          data.headers.forEach((header, index) => {
            obj[header] = row[index];
          });
          return obj;
        })
      };

      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
      const filename = `${this.sanitizeFilename(data.title)}_${this.getTimestamp()}.json`;
      this.downloadBlob(blob, filename);

      this.toastService.success(`Exported to ${filename}`);
    } catch (error) {
      console.error('JSON export error:', error);
      this.toastService.error('Failed to export JSON');
    }
  }

  /**
   * Export chart as PNG image using ECharts instance
   * @param chartInstance - The ECharts instance
   * @param title - Chart title for filename
   */
  exportToPNG(chartInstance: any, title: string): void {
    try {
      if (!chartInstance) {
        this.toastService.error('Chart not available for export');
        return;
      }

      // Get chart as data URL
      const dataURL = chartInstance.getDataURL({
        type: 'png',
        pixelRatio: 2, // Higher quality
        backgroundColor: '#ffffff'
      });

      // Create download link
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `${this.sanitizeFilename(title)}_${this.getTimestamp()}.png`;
      link.click();

      this.toastService.success('Chart exported as PNG');
    } catch (error) {
      console.error('PNG export error:', error);
      this.toastService.error('Failed to export PNG');
    }
  }

  /**
   * Export chart as SVG image using ECharts instance
   * @param chartInstance - The ECharts instance
   * @param title - Chart title for filename
   */
  exportToSVG(chartInstance: any, title: string): void {
    try {
      if (!chartInstance) {
        this.toastService.error('Chart not available for export');
        return;
      }

      // Get chart as SVG string
      const svg = chartInstance.renderToSVGString();

      // Create blob and download
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const filename = `${this.sanitizeFilename(title)}_${this.getTimestamp()}.svg`;
      this.downloadBlob(blob, filename);

      this.toastService.success('Chart exported as SVG');
    } catch (error) {
      console.error('SVG export error:', error);
      this.toastService.error('Failed to export SVG');
    }
  }

  /**
   * Escape special characters for CSV
   */
  private escapeCSV(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  }

  /**
   * Sanitize filename for download
   */
  private sanitizeFilename(filename: string): string {
    return filename
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Get formatted timestamp for filename
   */
  private getTimestamp(): string {
    const now = new Date();
    return now.toISOString().split('T')[0].replace(/-/g, '');
  }

  /**
   * Download blob as file
   */
  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
