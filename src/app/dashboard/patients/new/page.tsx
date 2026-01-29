'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { PatientForm } from '@/features/patients/components/patient-form';
import { toast } from 'sonner';
import type { PatientInput } from '@/types/database';

export default function NewPatientPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: PatientInput) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const result = await createPatient(data);
      // if (result.error) throw new Error(result.error);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Patient created successfully');
      router.push('/dashboard/patients');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create patient');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <Heading
        title="New Patient"
        description="Register a new patient"
      />
      <Separator className="my-4" />
      <div className="max-w-2xl">
        <PatientForm
          defaultUhid="P250004"
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </PageContainer>
  );
}
