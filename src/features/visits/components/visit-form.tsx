'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { VitalsForm } from './vitals-form';
import type { Visit, VisitInput, VitalsInput } from '@/types/database';
import { useState } from 'react';

const visitSchema = z.object({
  chief_complaints: z.string().optional(),
  hpi: z.string().optional(),
  investigations: z.string().optional(),
  findings: z.string().optional(),
  diagnosis: z.string().optional(),
  plan: z.string().optional(),
  notes: z.string().optional()
});

type VisitFormValues = z.infer<typeof visitSchema>;

interface VisitFormProps {
  patientId: string;
  visit?: Visit;
  onSubmit: (data: VisitInput, vitals?: VitalsInput) => Promise<void>;
  isLoading?: boolean;
}

export function VisitForm({
  patientId,
  visit,
  onSubmit,
  isLoading
}: VisitFormProps) {
  const [vitals, setVitals] = useState<VitalsInput>({});

  const form = useForm<VisitFormValues>({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      chief_complaints: visit?.chief_complaints || '',
      hpi: visit?.hpi || '',
      investigations: visit?.investigations || '',
      findings: visit?.findings || '',
      diagnosis: visit?.diagnosis || '',
      plan: visit?.plan || '',
      notes: visit?.notes || ''
    }
  });

  const handleSubmit = async (data: VisitFormValues) => {
    await onSubmit(
      {
        patient_id: patientId,
        ...data
      },
      vitals
    );
  };

  return (
    <Form form={form} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Vitals Section */}
        <VitalsForm
          defaultValues={visit?.vitals}
          onChange={setVitals}
        />

        {/* Clinical Notes Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Clinical Notes</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="chief_complaints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chief Complaints</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Patient's main complaints..."
                      className="min-h-[80px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hpi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>History of Present Illness (HPI)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed history..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="investigations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investigations</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Lab tests, imaging..."
                        className="min-h-[80px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="findings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Findings / Examination</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Physical examination findings..."
                        className="min-h-[80px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="diagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnosis</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Working diagnosis..."
                      className="min-h-[60px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan / Advice</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Treatment plan, follow-up advice..."
                      className="min-h-[80px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any other notes..."
                      className="min-h-[60px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {visit ? 'Update Visit' : 'Save & Continue to Prescription'}
          </Button>
        </div>
    </Form>
  );
}
