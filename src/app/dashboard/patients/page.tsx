import { Suspense } from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { PatientListingPage } from '@/features/patients/components/patient-listing';

export const metadata = {
  title: 'Patients | EMR'
};

export default function PatientsPage() {
  return (
    <PageContainer>
      <div className="flex items-start justify-between">
        <Heading
          title="Patients"
          description="Manage your patient records"
        />
        <Button asChild>
          <Link href="/dashboard/patients/new">
            <Plus className="mr-2 h-4 w-4" />
            New Patient
          </Link>
        </Button>
      </div>
      <Separator className="my-4" />
      <Suspense fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}>
        <PatientListingPage />
      </Suspense>
    </PageContainer>
  );
}
