'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VisitForm } from '@/features/visits/components/visit-form';
import { PrescriptionBuilder } from '@/features/prescriptions/components/prescription-builder';
import { toast } from 'sonner';
import type { VisitInput, VitalsInput, PrescriptionItemInput } from '@/types/database';

export default function NewVisitPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;

  const [activeTab, setActiveTab] = useState('notes');
  const [visitId, setVisitId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVisitSubmit = async (data: VisitInput, vitals?: VitalsInput) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const result = await createVisit(data, vitals);
      // if (result.error) throw new Error(result.error);
      // setVisitId(result.data.id);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setVisitId('new-visit-id');

      toast.success('Visit notes saved');
      setActiveTab('prescription');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save visit');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrescriptionSubmit = async (items: PrescriptionItemInput[]) => {
    if (!visitId) {
      toast.error('Please save visit notes first');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const result = await savePrescription(visitId, items);
      // if (result.error) throw new Error(result.error);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Prescription saved');
      router.push(`/dashboard/patients/${patientId}/visit/${visitId}/preview`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save prescription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <Heading
        title="New Visit"
        description="Create a new visit record and prescription"
      />
      <Separator className="my-4" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="notes">1. Visit Notes</TabsTrigger>
          <TabsTrigger value="prescription" disabled={!visitId}>
            2. Prescription
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes">
          <VisitForm
            patientId={patientId}
            onSubmit={handleVisitSubmit}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="prescription">
          <PrescriptionBuilder
            onSubmit={handlePrescriptionSubmit}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
