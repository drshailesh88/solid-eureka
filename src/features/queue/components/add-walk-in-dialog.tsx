'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Plus, Loader2, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Patient } from '@/types/database';
import { searchPatients } from '@/features/patients/api/patients';
import { addToQueue } from '../api/queue';
import { toast } from 'sonner';

interface AddWalkInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onCreatePatient: () => void;
}

// Helper to get patient display name
function getPatientName(patient: Partial<Patient>): string {
  return [patient.first_name, patient.last_name].filter(Boolean).join(' ');
}

export function AddWalkInDialog({
  open,
  onOpenChange,
  onSuccess,
  onCreatePatient,
}: AddWalkInDialogProps) {
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState<Partial<Patient>[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Partial<Patient> | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignedToken, setAssignedToken] = useState<number | null>(null);

  // Search patients when input changes
  useEffect(() => {
    const searchDebounced = async () => {
      if (search.length < 2) {
        setPatients([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchPatients(search);
        setPatients(results);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(searchDebounced, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setSearch('');
      setPatients([]);
      setSelectedPatient(null);
      setAssignedToken(null);
    }
  }, [open]);

  const handleSelectPatient = (patient: Partial<Patient>) => {
    setSelectedPatient(patient);
  };

  const handleSubmit = async () => {
    if (!selectedPatient?.id) return;

    setIsSubmitting(true);
    try {
      const result = await addToQueue(selectedPatient.id, 'walk_in');

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.data) {
        setAssignedToken(result.data.token_number);
        toast.success(result.message);

        // Wait a moment to show the token, then close
        setTimeout(() => {
          onSuccess();
          onOpenChange(false);
        }, 2000);
      }
    } catch (error) {
      toast.error('Failed to add patient to queue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateNew = () => {
    onOpenChange(false);
    onCreatePatient();
  };

  // Show token assigned view
  if (assignedToken !== null) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Token Assigned</h3>
            <div className="flex items-center justify-center bg-primary text-primary-foreground rounded-xl px-8 py-4 mb-4">
              <span className="text-5xl font-bold">{assignedToken}</span>
            </div>
            <p className="text-muted-foreground text-center">
              {selectedPatient && getPatientName(selectedPatient)} has been added to the queue
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Walk-in Patient</DialogTitle>
          <DialogDescription>
            Search for an existing patient or create a new one
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Patient Search */}
          <Command className="rounded-lg border shadow-md">
            <CommandInput
              placeholder="Search by name, phone, or UHID..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              {isSearching && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
              {!isSearching && search.length >= 2 && patients.length === 0 && (
                <CommandEmpty>No patients found</CommandEmpty>
              )}
              {!isSearching && patients.length > 0 && (
                <CommandGroup heading="Patients">
                  {patients.map((patient) => (
                    <CommandItem
                      key={patient.id}
                      value={patient.id}
                      onSelect={() => handleSelectPatient(patient)}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                          selectedPatient?.id === patient.id
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-muted'
                        )}
                      >
                        {selectedPatient?.id === patient.id && (
                          <Check className="h-3 w-3" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{getPatientName(patient)}</span>
                          {patient.uhid && (
                            <Badge variant="outline" className="text-xs">
                              {patient.uhid}
                            </Badge>
                          )}
                        </div>
                        {patient.phone && (
                          <span className="text-xs text-muted-foreground">
                            {patient.phone}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={handleCreateNew}
                  className="cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Create New Patient</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>

          {/* Selected Patient Preview */}
          {selectedPatient && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{getPatientName(selectedPatient)}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedPatient.uhid}
                    {selectedPatient.phone && ` | ${selectedPatient.phone}`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedPatient || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add to Queue'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
