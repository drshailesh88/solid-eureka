'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Loader2, User, Clock } from 'lucide-react';
import { addToQueue } from '../api/queue';
import { toast } from 'sonner';

// Appointment with patient info for check-in
export interface AppointmentForCheckIn {
  id: string;
  patient_id: string;
  patient_name: string;
  appointment_time: string; // ISO string or formatted time
  patient_phone?: string | null;
  patient_uhid?: string | null;
}

interface CheckInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  appointment: AppointmentForCheckIn | null;
}

// Format time for display
function formatTime(timeString: string): string {
  try {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return timeString;
  }
}

export function CheckInDialog({
  open,
  onOpenChange,
  onSuccess,
  appointment,
}: CheckInDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignedToken, setAssignedToken] = useState<number | null>(null);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setAssignedToken(null);
    }
  }, [open]);

  const handleCheckIn = async () => {
    if (!appointment) return;

    setIsSubmitting(true);
    try {
      const result = await addToQueue(
        appointment.patient_id,
        'scheduled',
        appointment.id
      );

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.data) {
        setAssignedToken(result.data.token_number);
        toast.success(result.message);

        // Wait a moment to show the token, then close
        setTimeout(() => {
          onSuccess();
          onOpenChange(false);
        }, 2000);
      }
    } catch (error) {
      toast.error('Failed to check in patient');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render if no appointment
  if (!appointment) {
    return null;
  }

  // Show token assigned view
  if (assignedToken !== null) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Checked In Successfully</h3>
            <div className="flex items-center justify-center bg-primary text-primary-foreground rounded-xl px-8 py-4 mb-4">
              <span className="text-5xl font-bold">{assignedToken}</span>
            </div>
            <p className="text-muted-foreground text-center">
              {appointment.patient_name} has been added to the queue
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Check In Patient</DialogTitle>
          <DialogDescription>
            Confirm check-in for scheduled appointment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Patient Info Card */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-lg">{appointment.patient_name}</p>
                <p className="text-sm text-muted-foreground">
                  {appointment.patient_uhid && (
                    <span>{appointment.patient_uhid}</span>
                  )}
                  {appointment.patient_uhid && appointment.patient_phone && (
                    <span> | </span>
                  )}
                  {appointment.patient_phone && (
                    <span>{appointment.patient_phone}</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Appointment Time */}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Scheduled for:</span>
            <span className="font-medium">{formatTime(appointment.appointment_time)}</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCheckIn} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking In...
              </>
            ) : (
              'Check In'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
