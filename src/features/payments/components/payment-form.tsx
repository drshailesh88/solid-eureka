'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Banknote,
  Smartphone,
  XCircle,
  Loader2,
  ArrowLeft,
  Receipt
} from 'lucide-react';
import { toast } from 'sonner';
import { UPIQRCode } from './upi-qr-code';
import { createPayment, getFeeByType } from '../api/payments';
import type { PaymentInput } from '@/types/database';

const paymentSchema = z.object({
  amount: z.number().min(0, 'Amount must be positive'),
  upi_ref: z.string().optional()
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  patientId?: string;
  patientName: string;
  encounterId?: string;
  isNewPatient?: boolean;
  defaultAmount?: number;
  // Doctor's UPI settings - should come from settings
  doctorUpiId?: string;
  doctorName?: string;
  onSuccess?: (receiptNumber: string) => void;
  onCancel?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type PaymentStep = 'method' | 'upi' | 'upi_confirm';

export function PaymentForm({
  patientId,
  patientName,
  encounterId,
  isNewPatient = true,
  defaultAmount,
  doctorUpiId = '',
  doctorName = 'Doctor',
  onSuccess,
  onCancel,
  open,
  onOpenChange
}: PaymentFormProps) {
  const [step, setStep] = useState<PaymentStep>('method');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feeAmount, setFeeAmount] = useState(defaultAmount || 0);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: defaultAmount || 0,
      upi_ref: ''
    }
  });

  // Fetch fee from schedule if not provided
  useEffect(() => {
    const fetchFee = async () => {
      if (defaultAmount !== undefined) {
        setFeeAmount(defaultAmount);
        form.setValue('amount', defaultAmount);
        return;
      }

      const feeType = isNewPatient ? 'new_consultation' : 'follow_up';
      const fee = await getFeeByType(feeType);
      setFeeAmount(fee);
      form.setValue('amount', fee);
    };

    fetchFee();
  }, [defaultAmount, isNewPatient, form]);

  const handlePayment = async (
    method: 'cash' | 'upi' | 'waived',
    upiRef?: string
  ) => {
    setIsSubmitting(true);

    try {
      const amount = form.getValues('amount');

      const paymentData: PaymentInput = {
        patient_id: patientId,
        encounter_id: encounterId,
        amount: method === 'waived' ? 0 : amount,
        type: isNewPatient ? 'consultation' : 'follow_up',
        method: method === 'waived' ? undefined : method,
        status: method === 'waived' ? 'waived' : 'paid',
        upi_ref: upiRef
      };

      const result = await createPayment(paymentData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      const receiptNumber = result.data?.receipt_number || '';
      toast.success(
        method === 'waived'
          ? 'Payment waived'
          : `Payment recorded! Receipt: ${receiptNumber}`
      );

      if (onSuccess) {
        onSuccess(receiptNumber);
      }

      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to record payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCashPayment = () => {
    handlePayment('cash');
  };

  const handleUPIClick = () => {
    setStep('upi');
  };

  const handleUPIConfirm = () => {
    const upiRef = form.getValues('upi_ref');
    handlePayment('upi', upiRef || undefined);
  };

  const handleWaive = () => {
    handlePayment('waived');
  };

  const handleBack = () => {
    setStep('method');
  };

  const handleClose = () => {
    setStep('method');
    form.reset();
    if (onCancel) {
      onCancel();
    }
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const amount = form.watch('amount');

  const content = (
    <Form form={form} onSubmit={(e) => e.preventDefault()} className="space-y-4">
        {step === 'method' && (
          <>
            {/* Amount Input */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        ₹
                      </span>
                      <Input
                        type="number"
                        placeholder="500"
                        className="pl-8 text-lg font-semibold"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment Method Buttons */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="h-20 flex-col gap-2 hover:bg-green-50 hover:border-green-500 dark:hover:bg-green-950"
                onClick={handleCashPayment}
                disabled={isSubmitting || amount <= 0}
              >
                {isSubmitting ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Banknote className="h-6 w-6 text-green-600" />
                )}
                <span className="text-sm font-medium">Cash</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-20 flex-col gap-2 hover:bg-blue-50 hover:border-blue-500 dark:hover:bg-blue-950"
                onClick={handleUPIClick}
                disabled={isSubmitting || amount <= 0 || !doctorUpiId}
              >
                <Smartphone className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium">UPI</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-20 flex-col gap-2 hover:bg-gray-50 hover:border-gray-500 dark:hover:bg-gray-900"
                onClick={handleWaive}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <XCircle className="h-6 w-6 text-gray-500" />
                )}
                <span className="text-sm font-medium">Waive</span>
              </Button>
            </div>

            {!doctorUpiId && (
              <p className="text-xs text-muted-foreground text-center">
                Configure UPI ID in Settings to enable UPI payments
              </p>
            )}
          </>
        )}

        {step === 'upi' && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium">UPI Payment</span>
            </div>

            <UPIQRCode
              payeeVPA={doctorUpiId}
              payeeName={doctorName}
              amount={amount}
              patientName={patientName}
            />

            {/* UPI Reference Input */}
            <FormField
              control={form.control}
              name="upi_ref"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>UPI Reference Number (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter UPI transaction ID"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="button"
              className="w-full mt-4"
              onClick={handleUPIConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Receipt className="h-4 w-4 mr-2" />
              )}
              Confirm Payment Received
            </Button>
          </>
        )}
    </Form>
  );

  // If open/onOpenChange are provided, render as dialog
  if (open !== undefined && onOpenChange) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Collect Payment - {patientName}
            </DialogTitle>
          </DialogHeader>
          {content}
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Otherwise render as card
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Collect Payment - {patientName}
        </CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
