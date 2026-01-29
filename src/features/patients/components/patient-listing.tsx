'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { getPatientColumns } from './patient-columns';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { Patient } from '@/types/database';
import { useDataTable } from '@/hooks/use-data-table';
import { parseAsInteger, useQueryState } from 'nuqs';

// Mock data for development (replace with actual API call)
const mockPatients: Patient[] = [
  {
    id: '1',
    owner_id: 'user_1',
    uhid: 'P250001',
    first_name: 'Rahul',
    last_name: 'Sharma',
    age: 45,
    sex: 'male',
    phone: '9876543210',
    address: '123 Main Street, Delhi',
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  },
  {
    id: '2',
    owner_id: 'user_1',
    uhid: 'P250002',
    first_name: 'Priya',
    last_name: 'Patel',
    age: 32,
    sex: 'female',
    phone: '9876543211',
    address: '456 Park Road, Mumbai',
    created_at: '2025-01-16T10:00:00Z',
    updated_at: '2025-01-16T10:00:00Z'
  },
  {
    id: '3',
    owner_id: 'user_1',
    uhid: 'P250003',
    first_name: 'Amit',
    last_name: 'Kumar',
    age: 28,
    sex: 'male',
    phone: '9876543212',
    address: '789 Lake View, Bangalore',
    created_at: '2025-01-17T10:00:00Z',
    updated_at: '2025-01-17T10:00:00Z'
  }
];

export function PatientListingPage() {
  const [patients] = useState<Patient[]>(mockPatients);
  const [search, setSearch] = useState('');
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  // Filter patients based on search
  const filteredPatients = patients.filter((patient) => {
    const searchLower = search.toLowerCase();
    return (
      patient.first_name.toLowerCase().includes(searchLower) ||
      (patient.last_name?.toLowerCase().includes(searchLower) ?? false) ||
      patient.uhid.toLowerCase().includes(searchLower) ||
      (patient.phone?.includes(search) ?? false)
    );
  });

  const handleDelete = async (patient: Patient) => {
    if (confirm(`Delete patient ${patient.first_name} ${patient.last_name}?`)) {
      // TODO: Call delete API
      console.log('Delete patient:', patient.id);
    }
  };

  const columns = getPatientColumns({ onDelete: handleDelete });
  const pageCount = Math.ceil(filteredPatients.length / pageSize);

  const { table } = useDataTable({
    data: filteredPatients,
    columns,
    pageCount,
    shallow: false,
    debounceMs: 500
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, UHID, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}
