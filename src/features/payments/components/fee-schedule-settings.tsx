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
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Save, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';
import { getFeeSchedule, updateFeeSchedule } from '../api/payments';
import type { FeeSchedule } from '@/types/database';

const feeScheduleSchema = z.object({
  new_consultation: z.number().min(0, 'Amount must be positive'),
  follow_up: z.number().min(0, 'Amount must be positive')
});

type FeeScheduleFormValues = z.infer<typeof feeScheduleSchema>;

interface FeeScheduleSettingsProps {
  onSave?: () => void;
}

export function FeeScheduleSettings({ onSave }: FeeScheduleSettingsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<FeeScheduleFormValues>({
    resolver: zodResolver(feeScheduleSchema),
    defaultValues: {
      new_consultation: 0,
      follow_up: 0
    }
  });

  useEffect(() => {
    const fetchFeeSchedule = async () => {
      setIsLoading(true);
      try {
        const fees = await getFeeSchedule();

        const newConsultationFee = fees.find(
          (f: FeeSchedule) => f.type === 'new_consultation'
        );
        const followUpFee = fees.find(
          (f: FeeSchedule) => f.type === 'follow_up'
        );

        form.reset({
          new_consultation: newConsultationFee?.amount || 0,
          follow_up: followUpFee?.amount || 0
        });
      } catch (error) {
        console.error('Failed to fetch fee schedule:', error);
        toast.error('Failed to load fee schedule');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeeSchedule();
  }, [form]);

  const handleSubmit = async (data: FeeScheduleFormValues) => {
    setIsSaving(true);

    try {
      // Update new consultation fee
      const newConsultResult = await updateFeeSchedule({
        type: 'new_consultation',
        name: 'New Patient Consultation',
        amount: data.new_consultation
      });

      if (newConsultResult.error) {
        toast.error(newConsultResult.error);
        return;
      }

      // Update follow-up fee
      const followUpResult = await updateFeeSchedule({
        type: 'follow_up',
        name: 'Follow-up Consultation',
        amount: data.follow_up
      });

      if (followUpResult.error) {
        toast.error(followUpResult.error);
        return;
      }

      toast.success('Fee schedule saved successfully');

      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('Failed to save fee schedule:', error);
      toast.error('Failed to save fee schedule');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Consultation Fees</CardTitle>
          <CardDescription>Loading fee schedule...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IndianRupee className="h-5 w-5" />
          Consultation Fees
        </CardTitle>
        <CardDescription>
          Set your consultation fees. These will be auto-filled when collecting payments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form form={form} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="new_consultation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Patient Fee</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          ₹
                        </span>
                        <Input
                          type="number"
                          placeholder="500"
                          className="pl-8"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Fee for first-time consultations
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="follow_up"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Follow-up Fee</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          ₹
                        </span>
                        <Input
                          type="number"
                          placeholder="300"
                          className="pl-8"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Fee for follow-up visits
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Fees
              </Button>
            </div>
        </Form>
      </CardContent>
    </Card>
  );
}
