'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { PageContainer } from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Plus,
  Clock,
  Phone,
  MapPin,
  User,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { PatientTimelineList } from '@/features/timeline/components/patient-timeline';
import { DocumentUpload } from '@/features/documents/components/document-upload';
import type { Patient, Visit, TimelineEvent } from '@/types/database';

// Mock data
const mockPatient: Patient = {
  id: '1',
  owner_id: 'user_1',
  uhid: 'P250001',
  first_name: 'Rahul',
  last_name: 'Sharma',
  age: 45,
  sex: 'male',
  phone: '9876543210',
  address: '123 Main Street, Vasant Kunj, New Delhi - 110070',
  created_at: '2025-01-15T10:00:00Z',
  updated_at: '2025-01-15T10:00:00Z'
};

const mockVisits: Visit[] = [
  {
    id: '1',
    patient_id: '1',
    owner_id: 'user_1',
    visit_date: '2025-01-20',
    chief_complaints: 'Fever and cough for 3 days',
    diagnosis: 'Acute Upper Respiratory Tract Infection',
    created_at: '2025-01-20T10:00:00Z',
    updated_at: '2025-01-20T10:00:00Z'
  },
  {
    id: '2',
    patient_id: '1',
    owner_id: 'user_1',
    visit_date: '2025-01-10',
    chief_complaints: 'Routine checkup',
    diagnosis: 'No significant findings',
    created_at: '2025-01-10T10:00:00Z',
    updated_at: '2025-01-10T10:00:00Z'
  }
];

const mockTimeline: TimelineEvent[] = [
  {
    id: '1',
    patient_id: '1',
    visit_id: '1',
    event_date: '2025-01-20',
    event_type: 'visit',
    event_title: 'Acute URTI - Prescribed antibiotics',
    event_text: 'Fever 101°F, Productive cough. Started Amoxicillin 500mg TDS x 5 days.',
    created_at: '2025-01-20T10:00:00Z'
  },
  {
    id: '2',
    patient_id: '1',
    document_id: '1',
    event_date: '2025-01-18',
    event_type: 'lab',
    event_title: 'Blood Test - CBC',
    event_text: 'Hb: 13.5, WBC: 11,000 (slightly elevated), Platelets: 2.5 lakh',
    created_at: '2025-01-18T10:00:00Z'
  },
  {
    id: '3',
    patient_id: '1',
    visit_id: '2',
    event_date: '2025-01-10',
    event_type: 'visit',
    event_title: 'Routine Checkup',
    event_text: 'Annual health checkup. All vitals normal. Advised CBC and lipid profile.',
    created_at: '2025-01-10T10:00:00Z'
  }
];

export default function PatientProfilePage() {
  const params = useParams();
  const patientId = params.patientId as string;

  // In production, fetch patient data using patientId
  const patient = mockPatient;
  const visits = mockVisits;
  const timeline = mockTimeline;

  return (
    <PageContainer>
      <div className="flex items-start justify-between">
        <div>
          <Heading
            title={`${patient.first_name} ${patient.last_name || ''}`}
            description={`UHID: ${patient.uhid}`}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/patients/${patientId}/edit`}>
              Edit Profile
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/patients/${patientId}/visit/new`}>
              <Plus className="mr-2 h-4 w-4" />
              New Visit
            </Link>
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Patient Info Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Age / Sex</p>
                <p className="font-medium">
                  {patient.age ? `${patient.age} years` : '-'} / {patient.sex?.charAt(0).toUpperCase() || '-'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{patient.phone || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Registered</p>
                <p className="font-medium">
                  {new Date(patient.created_at).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium text-sm">{patient.address || '-'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="visits" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visits">
            <FileText className="mr-2 h-4 w-4" />
            Visits
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <Clock className="mr-2 h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="mr-2 h-4 w-4" />
            Documents
          </TabsTrigger>
        </TabsList>

        {/* Visits Tab */}
        <TabsContent value="visits" className="space-y-4">
          {visits.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No visits yet. Click "New Visit" to create one.
              </CardContent>
            </Card>
          ) : (
            visits.map((visit) => (
              <Card key={visit.id} className="hover:bg-muted/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {new Date(visit.visit_date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/patients/${patientId}/visit/${visit.id}`}>
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/patients/${patientId}/visit/new?repeat=${visit.id}`}>
                          Repeat Rx
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>CC:</strong> {visit.chief_complaints || '-'}
                  </p>
                  {visit.diagnosis && (
                    <Badge variant="secondary">{visit.diagnosis}</Badge>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Patient Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <PatientTimelineList events={timeline} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <DocumentUpload
            patientId={patientId}
            onUploadComplete={(id) => console.log('Uploaded:', id)}
          />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
