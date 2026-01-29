'use server';

import { createServerSupabaseClient } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import type { Patient, PatientInput, ApiResponse, PaginatedResponse } from '@/types/database';

// Get all patients for the current user
export async function getPatients(
  page = 1,
  pageSize = 20,
  search?: string
): Promise<PaginatedResponse<Patient>> {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const supabase = createServerSupabaseClient();
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from('patients')
    .select('*', { count: 'exact' })
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  // Search by name, phone, or UHID
  if (search) {
    query = query.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%,phone.ilike.%${search}%,uhid.ilike.%${search}%`
    );
  }

  const { data, count, error } = await query;

  if (error) throw new Error(error.message);

  return {
    data: data || [],
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize)
  };
}

// Get a single patient by ID
export async function getPatient(id: string): Promise<ApiResponse<Patient>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .eq('owner_id', userId)
    .single();

  if (error) return { error: error.message };
  return { data };
}

// Create a new patient
export async function createPatient(input: PatientInput): Promise<ApiResponse<Patient>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('patients')
    .insert({
      ...input,
      owner_id: userId
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return { error: 'A patient with this UHID already exists' };
    }
    return { error: error.message };
  }

  return { data, message: 'Patient created successfully' };
}

// Update a patient
export async function updatePatient(
  id: string,
  input: Partial<PatientInput>
): Promise<ApiResponse<Patient>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('patients')
    .update(input)
    .eq('id', id)
    .eq('owner_id', userId)
    .select()
    .single();

  if (error) return { error: error.message };
  return { data, message: 'Patient updated successfully' };
}

// Delete a patient
export async function deletePatient(id: string): Promise<ApiResponse<null>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from('patients')
    .delete()
    .eq('id', id)
    .eq('owner_id', userId);

  if (error) return { error: error.message };
  return { message: 'Patient deleted successfully' };
}

// Search patients (for autocomplete)
export async function searchPatients(query: string, limit = 10): Promise<Patient[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('patients')
    .select('*')
    .eq('owner_id', userId)
    .or(
      `first_name.ilike.%${query}%,last_name.ilike.%${query}%,phone.ilike.%${query}%,uhid.ilike.%${query}%`
    )
    .limit(limit);

  return (data as Patient[]) || [];
}

// Generate next UHID
export async function generateUHID(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const supabase = createServerSupabaseClient();
  const { count } = await supabase
    .from('patients')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', userId);

  const nextNumber = (count || 0) + 1;
  const year = new Date().getFullYear().toString().slice(-2);
  return `P${year}${nextNumber.toString().padStart(5, '0')}`;
}
