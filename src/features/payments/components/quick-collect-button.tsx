'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Banknote, Loader2 } from 'lucide-react';
import { PaymentForm } from './payment-form';
import type { Payment } from '@/types/database';

interface QuickCollectButtonProps {
  patientId: string;
  patientName: string;
  encounterId?: string;
  isNewPatient?: boolean;
  existingPayment?: Payment | null;
  onPaymentSuccess?: (payment: Payment) => void;
  disabled?: boolean;
}

export function QuickCollectButton({
  patientId,
  patientName,
  encounterId,
  isNewPatient = true,
  existingPayment,
  onPaymentSuccess,
  disabled = false
}: QuickCollectButtonProps) {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Don't show button if payment already exists and is paid/waived
  if (existingPayment && existingPayment.status !== 'pending') {
    return null;
  }

  const handleSuccess = (receiptNumber: string) => {
    setShowPaymentForm(false);
    // Create a mock payment object for the callback
    const payment: Payment = {
      id: 'temp-id',
      owner_id: 'temp',
      encounter_id: encounterId,
      patient_id: patientId,
      amount: 0, // This will be filled by the actual payment
      type: isNewPatient ? 'consultation' : 'follow_up',
      status: 'paid',
      receipt_number: receiptNumber,
      created_at: new Date().toISOString()
    };

    if (onPaymentSuccess) {
      onPaymentSuccess(payment);
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowPaymentForm(true)}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
        className="text-green-600 hover:text-green-700 hover:bg-green-50"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Banknote className="h-4 w-4 mr-2" />
        )}
        Collect Payment
      </Button>

      <PaymentForm
        patientId={patientId}
        patientName={patientName}
        encounterId={encounterId}
        isNewPatient={isNewPatient}
        open={showPaymentForm}
        onOpenChange={setShowPaymentForm}
        onSuccess={handleSuccess}
        onCancel={() => setShowPaymentForm(false)}
      />
    </>
  );
}