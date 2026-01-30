'use client';

import { useState } from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet
} from '@react-pdf/renderer';
import { pdf } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Printer } from 'lucide-react';
import type { Payment, PaymentMethod } from '@/types';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 25,
    borderBottom: '2 solid #000',
    paddingBottom: 15,
    textAlign: 'center'
  },
  clinicName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4
  },
  clinicAddress: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2
  },
  clinicPhone: {
    fontSize: 10,
    color: '#666'
  },
  receiptTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
    textDecoration: 'underline'
  },
  infoSection: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  infoColumn: {
    flex: 1
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6
  },
  infoLabel: {
    width: 100,
    fontWeight: 'bold',
    color: '#333'
  },
  infoValue: {
    flex: 1
  },
  amountSection: {
    marginTop: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 4
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  amountLabel: {
    fontSize: 12,
    color: '#666'
  },
  amountValue: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1 solid #ccc',
    paddingTop: 10,
    marginTop: 5
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  paymentMethodSection: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#e8f5e9',
    borderRadius: 4
  },
  paymentMethodLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 4
  },
  paymentMethodValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2e7d32'
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    borderTop: '1 solid #ccc',
    paddingTop: 15
  },
  footerText: {
    fontSize: 9,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4
  },
  footerThankYou: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10
  },
  signature: {
    marginTop: 40,
    textAlign: 'right'
  },
  signatureLine: {
    borderTop: '1 solid #000',
    width: 150,
    marginLeft: 'auto',
    paddingTop: 5,
    textAlign: 'center'
  },
  signatureLabel: {
    fontSize: 10,
    color: '#666'
  }
});

// Helper to format payment method display
const formatPaymentMethod = (method: PaymentMethod | null): string => {
  if (!method) return 'N/A';
  const methodMap: Record<PaymentMethod, string> = {
    cash: 'Cash',
    upi: 'UPI',
    card: 'Card',
    pending: 'Pending'
  };
  return methodMap[method] || method;
};

// Helper to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

// Helper to format date
const formatDate = (dateString: string | null): string => {
  if (!dateString) return new Date().toLocaleDateString('en-IN');
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Props for the Receipt Document
export interface ReceiptDocumentProps {
  payment: Payment;
  patientName: string;
  patientId?: string;
  clinicName?: string;
  clinicAddress?: string;
  clinicPhone?: string;
  doctorName?: string;
}

/**
 * ReceiptDocument - The PDF template for payment receipts
 * Uses @react-pdf/renderer Document, Page, Text, View components
 */
export function ReceiptDocument({
  payment,
  patientName,
  patientId,
  clinicName = 'Clinic Name',
  clinicAddress = 'Clinic Address',
  clinicPhone = '',
  doctorName = 'Doctor'
}: ReceiptDocumentProps) {
  const receiptDate = formatDate(payment.paid_at || payment.created_at);
  const receiptNumber = payment.receipt_number || `RCP-${payment.id.slice(0, 8).toUpperCase()}`;

  return (
    <Document>
      <Page size="A5" style={styles.page}>
        {/* Clinic Header */}
        <View style={styles.header}>
          <Text style={styles.clinicName}>{clinicName}</Text>
          <Text style={styles.clinicAddress}>{clinicAddress}</Text>
          {clinicPhone && <Text style={styles.clinicPhone}>Tel: {clinicPhone}</Text>}
        </View>

        {/* Receipt Title */}
        <Text style={styles.receiptTitle}>PAYMENT RECEIPT</Text>

        {/* Receipt Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoColumn}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Receipt No:</Text>
              <Text style={styles.infoValue}>{receiptNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date:</Text>
              <Text style={styles.infoValue}>{receiptDate}</Text>
            </View>
          </View>
        </View>

        {/* Patient Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoColumn}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Patient Name:</Text>
              <Text style={styles.infoValue}>{patientName}</Text>
            </View>
            {patientId && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Patient ID:</Text>
                <Text style={styles.infoValue}>{patientId}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Amount Section */}
        <View style={styles.amountSection}>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Payment Type:</Text>
            <Text style={styles.amountValue}>
              {payment.type === 'consultation' ? 'Consultation Fee' :
               payment.type === 'procedure' ? 'Procedure Fee' :
               payment.type === 'medicine' ? 'Medicine' :
               payment.type}
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Amount Paid:</Text>
            <Text style={styles.totalValue}>{formatCurrency(payment.amount)}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.paymentMethodSection}>
          <Text style={styles.paymentMethodLabel}>Payment Method</Text>
          <Text style={styles.paymentMethodValue}>
            {formatPaymentMethod(payment.method)}
            {payment.upi_ref && ` (Ref: ${payment.upi_ref})`}
          </Text>
        </View>

        {/* Signature */}
        <View style={styles.signature}>
          <View style={styles.signatureLine}>
            <Text style={styles.signatureLabel}>Authorized Signature</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerThankYou}>Thank you for your visit!</Text>
          <Text style={styles.footerText}>
            This is a computer-generated receipt.
          </Text>
          <Text style={styles.footerText}>
            Generated on: {new Date().toLocaleDateString('en-IN')}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

// Props for the Download Button
export interface ReceiptDownloadButtonProps {
  payment: Payment;
  patientName: string;
  patientId?: string;
  clinicName?: string;
  clinicAddress?: string;
  clinicPhone?: string;
  doctorName?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
  showPrint?: boolean;
  className?: string;
}

/**
 * ReceiptDownloadButton - Button component to download or print receipt PDF
 * Generates PDF on-demand and triggers browser download
 */
export function ReceiptDownloadButton({
  payment,
  patientName,
  patientId,
  clinicName,
  clinicAddress,
  clinicPhone,
  doctorName,
  variant = 'outline',
  size = 'sm',
  showIcon = true,
  showPrint = false,
  className
}: ReceiptDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAndDownload = async () => {
    setIsGenerating(true);
    try {
      const doc = (
        <ReceiptDocument
          payment={payment}
          patientName={patientName}
          patientId={patientId}
          clinicName={clinicName}
          clinicAddress={clinicAddress}
          clinicPhone={clinicPhone}
          doctorName={doctorName}
        />
      );

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);

      const receiptNumber = payment.receipt_number || `RCP-${payment.id.slice(0, 8).toUpperCase()}`;
      const filename = `Receipt-${receiptNumber}.pdf`;

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate receipt PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAndPrint = async () => {
    setIsGenerating(true);
    try {
      const doc = (
        <ReceiptDocument
          payment={payment}
          patientName={patientName}
          patientId={patientId}
          clinicName={clinicName}
          clinicAddress={clinicAddress}
          clinicPhone={clinicPhone}
          doctorName={doctorName}
        />
      );

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);

      // Open in new window for printing
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.addEventListener('load', () => {
          printWindow.print();
        });
      }

      // Clean up after a delay to allow print dialog to open
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 5000);
    } catch (error) {
      console.error('Failed to generate receipt PDF for printing:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (showPrint) {
    return (
      <div className="flex gap-2">
        <Button
          variant={variant}
          size={size}
          onClick={generateAndDownload}
          disabled={isGenerating}
          className={className}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {showIcon && <Download className="h-4 w-4 mr-1" />}
              Download
            </>
          )}
        </Button>
        <Button
          variant={variant}
          size={size}
          onClick={generateAndPrint}
          disabled={isGenerating}
          className={className}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {showIcon && <Printer className="h-4 w-4 mr-1" />}
              Print
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={generateAndDownload}
      disabled={isGenerating}
      className={className}
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {showIcon && <Download className="h-4 w-4 mr-1" />}
          Receipt
        </>
      )}
    </Button>
  );
}
