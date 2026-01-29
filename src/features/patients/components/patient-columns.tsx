'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Pencil, Trash2, FileText } from 'lucide-react';
import type { Patient } from '@/types/database';
import Link from 'next/link';

interface PatientColumnsProps {
  onDelete?: (patient: Patient) => void;
}

export function getPatientColumns({ onDelete }: PatientColumnsProps = {}): ColumnDef<Patient>[] {
  return [
    {
      accessorKey: 'uhid',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="UHID" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.getValue('uhid')}</span>
      )
    },
    {
      accessorKey: 'first_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const firstName = row.original.first_name;
        const lastName = row.original.last_name || '';
        return (
          <div className="flex flex-col">
            <span className="font-medium">{firstName} {lastName}</span>
          </div>
        );
      }
    },
    {
      accessorKey: 'age',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Age" />
      ),
      cell: ({ row }) => {
        const age = row.getValue('age') as number | undefined;
        const sex = row.original.sex;
        return (
          <div className="flex items-center gap-2">
            <span>{age ? `${age}y` : '-'}</span>
            {sex && (
              <Badge variant={sex === 'male' ? 'default' : 'secondary'}>
                {sex === 'male' ? 'M' : sex === 'female' ? 'F' : 'O'}
              </Badge>
            )}
          </div>
        );
      }
    },
    {
      accessorKey: 'phone',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.getValue('phone') || '-'}</span>
      )
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Registered" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue('created_at'));
        return (
          <span className="text-muted-foreground text-sm">
            {date.toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        );
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const patient = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/patients/${patient.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/patients/${patient.id}/visit/new`}>
                  <FileText className="mr-2 h-4 w-4" />
                  New Visit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/patients/${patient.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              {onDelete && (
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete(patient)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];
}
