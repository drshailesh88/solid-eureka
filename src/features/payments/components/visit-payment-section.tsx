'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Receipt, Clock, CheckCircle } from 'lucide-react';
import { PaymentBadge } from './payment-badge';
import { QuickCollectButton } from './quick-collect-button';
import { getPaymentsByPatient } from '../api/payments';
import type { Payment, Patient } from '@/types/database';

interface VisitPaymentSectionProps {
  patient: Patient;
  encounterId?: string;
  isNewPatient?: boolean;
  isEditable?: boolean;
}

export function VisitPaymentSection({
  patient,
  encounterId,
  isNewPatient = true,
  isEditable = true
}: VisitPaymentSectionProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      try {
        const patientPayments = await getPaymentsByPatient(patient.id);
        setPayments(patientPayments);

        // Find payment for current encounter
        const encounterPayment = patientPayments.find(
          (p) => p.encounter_id === encounterId
        );
        setCurrentPayment(encounterPayment || null);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [patient.id, encounterId]);

  const handlePaymentSuccess = (payment: Payment) => {
    setCurrentPayment(payment);
    // Optionally refresh the payments list
    const fetchPayments = async () => {
      const patientPayments = await getPaymentsByPatient(patient.id);
      setPayments(patientPayments);
    };
    fetchPayments();
  };

  const getPaymentIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <CreditCard className="h-4 w-4 text-gray-500" />;
    }
  };

  const getExpectedFee = () => {
    // This would typically come from fee schedule
    // For now, show placeholder text
    return isNewPatient ? 'Consultation (New Patient)' : 'Follow-up Visit';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Visit Payment */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            Current Visit
          </h4>

          {currentPayment ? (
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getPaymentIcon(currentPayment.status)}
                <div>
                  <p className="font-medium">₹{currentPayment.amount}</p>
                  <p className="text-sm text-muted-foreground">
                    {currentPayment.type} • {currentPayment.method || 'pending'}
                  </p>
                  {currentPayment.receipt_number && (
                    <p className="text-xs text-muted-foreground">
                      Receipt: {currentPayment.receipt_number}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <PaymentBadge status={currentPayment.status} />
                {currentPayment.status === 'pending' && isEditable && (
                  <QuickCollectButton
                    patientId={patient.id}
                    patientName={`${patient.first_name} ${patient.last_name || ''}`.trim()}
                    encounterId={encounterId}
                    isNewPatient={isNewPatient}
                    existingPayment={currentPayment}
                    onPaymentSuccess={handlePaymentSuccess}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 border-2 border-dashed border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-600">No payment recorded</p>
                  <p className="text-sm text-muted-foreground">
                    {getExpectedFee()}
                  </p>
                </div>
              </div>

              {isEditable && (
                <QuickCollectButton
                  patientId={patient.id}
                  patientName={`${patient.first_name} ${patient.last_name || ''}`.trim()}
                  encounterId={encounterId}
                  isNewPatient={isNewPatient}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              )}
            </div>
          )}
        </div>

        {/* Recent Payments */}
        {payments.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Receipt className="h-3 w-3" />
                Recent Payments
              </h4>

              <div className="space-y-1 max-h-32 overflow-y-auto">
                {payments.slice(0, 5).map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 rounded"
                  >
                    <div className="flex items-center gap-2">
                      {getPaymentIcon(payment.status)}
                      <span>₹{payment.amount}</span>
                      <span className="text-muted-foreground">
                        {payment.method || 'pending'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </Badge>
                      <PaymentBadge status={payment.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}