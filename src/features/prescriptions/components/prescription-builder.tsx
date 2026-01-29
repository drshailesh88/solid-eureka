'use client';

import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Trash2, GripVertical } from 'lucide-react';
import { getFrequencyOptions, getPatternOptions, getDurationOptions, generateHindiInstruction } from '@/lib/i18n/hindi-templates';
import type { PrescriptionItemInput } from '@/types/database';

const prescriptionItemSchema = z.object({
  brand: z.string().min(1, 'Brand name is required'),
  salt: z.string().optional(),
  dose: z.string().optional(),
  frequency: z.string().optional(),
  pattern: z.string().optional(),
  duration: z.string().optional(),
  instructions: z.string().optional()
});

const prescriptionSchema = z.object({
  items: z.array(prescriptionItemSchema)
});

type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

interface PrescriptionBuilderProps {
  defaultItems?: PrescriptionItemInput[];
  onSubmit: (items: PrescriptionItemInput[]) => Promise<void>;
  isLoading?: boolean;
}

const frequencyOptions = getFrequencyOptions();
const patternOptions = getPatternOptions();
const durationOptions = getDurationOptions();

export function PrescriptionBuilder({
  defaultItems = [],
  onSubmit,
  isLoading
}: PrescriptionBuilderProps) {
  const [showHindi, setShowHindi] = useState(true);

  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      items: defaultItems.length > 0 ? defaultItems : [
        { brand: '', salt: '', dose: '', frequency: '', pattern: '', duration: '', instructions: '' }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items'
  });

  const handleSubmit = async (data: PrescriptionFormValues) => {
    await onSubmit(data.items);
  };

  const addMedication = () => {
    append({ brand: '', salt: '', dose: '', frequency: '', pattern: '', duration: '', instructions: '' });
  };

  // Watch for Hindi preview
  const watchedItems = form.watch('items');

  return (
    <Form form={form} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Prescription</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowHindi(!showHindi)}
              >
                {showHindi ? 'Hide Hindi' : 'Show Hindi'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMedication}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Medicine
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-lg border p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <Badge variant="outline">{index + 1}</Badge>
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Brand Name */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.brand`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Crocin 500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Salt / Composition */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.salt`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salt / Composition</FormLabel>
                        <FormControl>
                          <Input placeholder="Paracetamol 500mg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Dose */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.dose`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dose</FormLabel>
                        <FormControl>
                          <Input placeholder="1 tablet" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Frequency */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.frequency`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequency</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {frequencyOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.labelEn}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Pattern (111/100/001) */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.pattern`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pattern</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select pattern" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {patternOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.value} ({opt.labelHi})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Duration */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.duration`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {durationOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.labelEn}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Instructions */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.instructions`}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Instructions</FormLabel>
                        <FormControl>
                          <Input placeholder="Take after meals" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Hindi Preview */}
                {showHindi && watchedItems[index] && (
                  <div className="mt-2 rounded bg-muted p-2">
                    <span className="text-sm text-muted-foreground">Hindi: </span>
                    <span className="text-sm">
                      {generateHindiInstruction(
                        watchedItems[index].frequency,
                        watchedItems[index].pattern,
                        watchedItems[index].duration,
                        watchedItems[index].instructions
                      ) || 'Enter frequency/pattern to see Hindi'}
                    </span>
                  </div>
                )}
              </div>
            ))}

            {fields.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No medications added. Click "Add Medicine" to start.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Save as Template
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate PDF
          </Button>
        </div>
    </Form>
  );
}
