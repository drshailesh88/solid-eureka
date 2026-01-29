'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { VitalsInput } from '@/types/database';
import { useEffect } from 'react';

const vitalsSchema = z.object({
  bp_systolic: z.number().min(50).max(300).optional(),
  bp_diastolic: z.number().min(30).max(200).optional(),
  pulse: z.number().min(30).max(250).optional(),
  temperature: z.number().min(90).max(110).optional(),
  spo2: z.number().min(50).max(100).optional(),
  weight: z.number().min(1).max(500).optional(),
  height: z.number().min(30).max(300).optional()
});

type VitalsFormValues = z.infer<typeof vitalsSchema>;

interface VitalsFormProps {
  defaultValues?: VitalsInput;
  onChange?: (data: VitalsInput) => void;
}

export function VitalsForm({ defaultValues, onChange }: VitalsFormProps) {
  const form = useForm<VitalsFormValues>({
    resolver: zodResolver(vitalsSchema),
    defaultValues: {
      bp_systolic: defaultValues?.bp_systolic,
      bp_diastolic: defaultValues?.bp_diastolic,
      pulse: defaultValues?.pulse,
      temperature: defaultValues?.temperature,
      spo2: defaultValues?.spo2,
      weight: defaultValues?.weight,
      height: defaultValues?.height
    }
  });

  // Calculate BMI
  const weight = form.watch('weight');
  const height = form.watch('height');
  const bmi = weight && height && typeof weight === 'number' && typeof height === 'number'
    ? (weight / ((height / 100) ** 2)).toFixed(1)
    : null;

  // Notify parent of changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (onChange) {
        const vitals: VitalsInput = {};
        if (value.bp_systolic && typeof value.bp_systolic === 'number') vitals.bp_systolic = value.bp_systolic;
        if (value.bp_diastolic && typeof value.bp_diastolic === 'number') vitals.bp_diastolic = value.bp_diastolic;
        if (value.pulse && typeof value.pulse === 'number') vitals.pulse = value.pulse;
        if (value.temperature && typeof value.temperature === 'number') vitals.temperature = value.temperature;
        if (value.spo2 && typeof value.spo2 === 'number') vitals.spo2 = value.spo2;
        if (value.weight && typeof value.weight === 'number') vitals.weight = value.weight;
        if (value.height && typeof value.height === 'number') vitals.height = value.height;
        onChange(vitals);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Vitals</CardTitle>
      </CardHeader>
      <CardContent>
        <Form form={form} onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Blood Pressure */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Blood Pressure</label>
              <div className="flex items-center gap-1">
                <FormField
                  control={form.control}
                  name="bp_systolic"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Sys"
                          className="text-center"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <span className="text-muted-foreground">/</span>
                <FormField
                  control={form.control}
                  name="bp_diastolic"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Dia"
                          className="text-center"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <span className="text-muted-foreground text-sm">mmHg</span>
              </div>
            </div>

            {/* Pulse */}
            <FormField
              control={form.control}
              name="pulse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pulse (bpm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="72"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Temperature */}
            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temp (°F)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="98.6"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SpO2 */}
            <FormField
              control={form.control}
              name="spo2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SpO2 (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="98"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Weight */}
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="70"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Height */}
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (cm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="170"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* BMI (calculated) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">BMI</label>
              <div className="flex h-9 items-center rounded-md border bg-muted px-3">
                <span className="text-muted-foreground">
                  {bmi || '-'}
                </span>
              </div>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
