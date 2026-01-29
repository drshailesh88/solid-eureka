'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Loader2, AlertTriangle } from 'lucide-react';
import type { Patient, PatientInput, BloodGroup } from '@/types/database';
import { TagInput } from './tag-input';

// Blood group options
const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Common allergy suggestions
const ALLERGY_SUGGESTIONS = [
  'Penicillin',
  'Sulfa drugs',
  'Aspirin',
  'NSAIDs',
  'Codeine',
  'Latex',
  'Iodine',
  'Cephalosporins',
  'Amoxicillin',
  'Erythromycin',
];

// Common chronic condition suggestions
const CHRONIC_CONDITION_SUGGESTIONS = [
  'Diabetes Mellitus',
  'Hypertension',
  'Asthma',
  'COPD',
  'Coronary Artery Disease',
  'Chronic Kidney Disease',
  'Hypothyroidism',
  'Hyperthyroidism',
  'Heart Disease',
  'Epilepsy',
];

const patientSchema = z.object({
  uhid: z.string().min(1, 'UHID is required'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().optional(),
  age: z.number().min(0).max(150).optional(),
  sex: z.enum(['male', 'female', 'other']).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  blood_group: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  allergies: z.array(z.string()).optional(),
  chronic_conditions: z.array(z.string()).optional()
});

type PatientFormValues = z.infer<typeof patientSchema>;

interface PatientFormProps {
  patient?: Patient;
  defaultUhid?: string;
  onSubmit: (data: PatientInput) => Promise<void>;
  isLoading?: boolean;
}

export function PatientForm({
  patient,
  defaultUhid,
  onSubmit,
  isLoading
}: PatientFormProps) {
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      uhid: patient?.uhid || defaultUhid || '',
      first_name: patient?.first_name || '',
      last_name: patient?.last_name || '',
      age: patient?.age || undefined,
      sex: patient?.sex || undefined,
      phone: patient?.phone || '',
      address: patient?.address || '',
      blood_group: patient?.blood_group || undefined,
      allergies: patient?.allergies || [],
      chronic_conditions: patient?.chronic_conditions || []
    }
  });

  const handleSubmit = async (data: PatientFormValues) => {
    await onSubmit(data as PatientInput);
  };

  return (
    <Form form={form} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="uhid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UHID *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="P250001"
                      {...field}
                      disabled={!!patient}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="9876543210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Age in years"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sex</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sex" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Full address"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Medical Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Medical Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="blood_group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Group</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BLOOD_GROUPS.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Empty cell for grid alignment */}
            <div className="hidden md:block" />

            <FormField
              control={form.control}
              name="allergies"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    Allergies (CRITICAL)
                  </FormLabel>
                  <FormControl>
                    <TagInput
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder="Type allergy and press Enter..."
                      suggestions={ALLERGY_SUGGESTIONS}
                    />
                  </FormControl>
                  <FormDescription className="text-red-600">
                    Drug allergies are critical for patient safety. Please enter all known allergies.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chronic_conditions"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Chronic Conditions</FormLabel>
                  <FormControl>
                    <TagInput
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder="Type condition and press Enter..."
                      suggestions={CHRONIC_CONDITION_SUGGESTIONS}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter any chronic medical conditions (e.g., Diabetes, Hypertension).
                  </FormDescription>
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
            {patient ? 'Update Patient' : 'Create Patient'}
          </Button>
        </div>
    </Form>
  );
}
