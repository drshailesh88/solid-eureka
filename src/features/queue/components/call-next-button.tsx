'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Loader2 } from 'lucide-react';
import { callNextPatient } from '../api/queue';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CallNextButtonProps {
  onPatientCalled?: (patientId: string) => void;
  className?: string;
  size?: 'default' | 'sm' | 'lg';
  disabled?: boolean;
}

export function CallNextButton({
  onPatientCalled,
  className,
  size = 'lg',
  disabled = false,
}: CallNextButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCallNext = async () => {
    setIsLoading(true);
    try {
      const result = await callNextPatient();

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (!result.data) {
        toast.info(result.message || 'No patients waiting');
        return;
      }

      const calledEntry = result.data;

      // Show success toast with patient info
      toast.success(
        <div className="flex flex-col gap-1">
          <span className="font-semibold">
            Token #{calledEntry.token_number}
          </span>
          <span>{calledEntry.patient?.name}</span>
        </div>,
        {
          description: 'Patient has been called',
          duration: 5000,
        }
      );

      // Callback for parent component
      if (onPatientCalled) {
        onPatientCalled(calledEntry.patient_id);
      }
    } catch (error) {
      toast.error('Failed to call next patient');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size={size}
      onClick={handleCallNext}
      disabled={disabled || isLoading}
      className={cn(
        'gap-2',
        size === 'lg' && 'h-14 px-8 text-lg font-semibold',
        className
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Calling...
        </>
      ) : (
        <>
          <Phone className="h-5 w-5" />
          Call Next Patient
        </>
      )}
    </Button>
  );
}
