'use client';

import { Button } from '@/components/ui/button';
import type { Payment } from '@/types/database';
import { Download } from 'lucide-react';

interface ExportCSVButtonProps {
  payments: Payment[];
  date?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

function getPatientName(payment: Payment): string {
  if (!payment.patient) return 'Unknown';
  const { first_name, last_name } = payment.patient;
  return last_name ? `${first_name} ${last_name}` : first_name;
}

function formatMethod(method?: string): string {
  if (!method) return 'Pending';
  switch (method) {
    case 'cash':
      return 'Cash';
    case 'upi':
      return 'UPI';
    case 'card':
      return 'Card';
    case 'pending':
      return 'Pending';
    default:
      return method;
  }
}

function escapeCSVField(field: string): string {
  // If the field contains comma, quote, or newline, wrap it in quotes
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    // Escape existing quotes by doubling them
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

function convertToCSV(payments: Payment[]): string {
  const headers = ['Date', 'Patient', 'Amount', 'Method', 'Receipt Number'];
  const headerRow = headers.join(',');

  const dataRows = payments.map((payment) => {
    const date = formatDate(payment.paid_at || payment.created_at);
    const patientName = escapeCSVField(getPatientName(payment));
    const amount = payment.amount.toString();
    const method = formatMethod(payment.method);
    const receiptNumber = payment.receipt_number || '';

    return [date, patientName, amount, method, receiptNumber].join(',');
  });

  return [headerRow, ...dataRows].join('\n');
}

function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function ExportCSVButton({
  payments,
  date,
  variant = 'outline',
  size = 'sm'
}: ExportCSVButtonProps) {
  const handleExport = () => {
    if (payments.length === 0) return;

    const csvContent = convertToCSV(payments);
    const dateStr = date || new Date().toISOString().split('T')[0];
    const filename = `collections-${dateStr}.csv`;

    downloadCSV(csvContent, filename);
  };

  const isDisabled = payments.length === 0;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      disabled={isDisabled}
      title={isDisabled ? 'No payments to export' : 'Export to CSV'}
    >
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">Export</span>
    </Button>
  );
}
