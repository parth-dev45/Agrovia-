import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { BatchWithDetails, Order } from './types';
import { format } from 'date-fns';

// Export batches to CSV (existing function - keep it)
export function exportBatchesToCSV(batches: BatchWithDetails[], filename: string = 'batches.csv') {
  const headers = ['Batch ID', 'Product', 'Farmer', 'Quantity (kg)', 'Grade', 'Harvest Date', 'Status'];
  const rows = batches.map(b => [
    b.batchId,
    b.cropType,
    b.farmerId,
    b.quantity,
    b.qualityGrade || 'N/A',
    format(b.harvestDate, 'yyyy-MM-dd'),
    b.status || 'N/A'
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// NEW: Export to Excel
export function exportToExcel(data: any[], filename: string = 'export.xlsx', sheetName: string = 'Sheet1') {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filename);
}

// NEW: Export batches to Excel with rich formatting
export function exportBatchesToExcel(batches: BatchWithDetails[], filename: string = 'batches.xlsx') {
  const data = batches.map(b => ({
    'Batch ID': b.batchId,
    'Product': b.cropType,
    'Farmer ID': b.farmerId,
    'Quantity (kg)': b.quantity,
    'Crates': b.crateCount,
    'Quality Grade': b.qualityGrade || 'N/A',
    'Harvest Date': format(b.harvestDate, 'yyyy-MM-dd'),
    'Warehouse': b.warehouseId || 'N/A',
    'Status': b.status || 'N/A',
    'Freshness': b.retailStatus?.status || 'N/A',
    'Days Remaining': b.retailStatus?.remainingDays || 'N/A'
  }));

  exportToExcel(data, filename, 'Batches');
}

// NEW: Export orders to Excel
export function exportOrdersToExcel(orders: Order[], filename: string = 'orders.xlsx') {
  const data = orders.map(o => ({
    'Order ID': o.orderId,
    'Batch ID': o.batchId,
    'Retailer ID': o.retailerId,
    'Warehouse': o.sourceWarehouseId,
    'Quantity (Crates)': o.quantity,
    'Quantity (kg)': o.quantityKg,
    'Status': o.status,
    'Order Date': o.orderDate ? format(o.orderDate, 'yyyy-MM-dd HH:mm') : 'N/A',
    'Fulfillment Date': o.fulfillmentDate ? format(o.fulfillmentDate, 'yyyy-MM-dd HH:mm') : 'N/A'
  }));

  exportToExcel(data, filename, 'Orders');
}

// NEW: Export element to PDF
export async function exportElementToPDF(
  elementId: string,
  filename: string = 'export.pdf',
  orientation: 'portrait' | 'landscape' = 'portrait'
) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found`);
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = orientation === 'portrait' ? 210 : 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(filename);
  } catch (error) {
    console.error('Failed to export PDF:', error);
  }
}

// NEW: Generate invoice PDF
export async function generateInvoicePDF(order: Order, batch: BatchWithDetails, filename?: string) {
  const pdf = new jsPDF();

  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('AGROVIA', 105, 20, { align: 'center' });

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Food Traceability & Quality Assurance', 105, 27, { align: 'center' });

  // Invoice details
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INVOICE', 20, 45);

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Order ID: ${order.orderId}`, 20, 55);
  pdf.text(`Date: ${order.orderDate ? format(order.orderDate, 'yyyy-MM-dd') : 'N/A'}`, 20, 62);
  pdf.text(`Retailer: ${order.retailerId}`, 20, 69);

  // Batch details
  pdf.setFont('helvetica', 'bold');
  pdf.text('Product Details', 20, 85);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Batch ID: ${batch.batchId}`, 20, 92);
  pdf.text(`Product: ${batch.cropType}`, 20, 99);
  pdf.text(`Quality Grade: ${batch.qualityGrade || 'N/A'}`, 20, 106);
  pdf.text(`Quantity: ${order.quantity} crates (${order.quantityKg || 0} kg)`, 20, 113);

  pdf.save(filename || `invoice_${order.orderId}.pdf`);
}
