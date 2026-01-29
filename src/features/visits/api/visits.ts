'use server';

import { createServerSupabaseClient } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import type { Visit, VisitInput, VitalsInput, ApiResponse } from '@/types/database';

// Get all visits for a patient
export async function getPatientVisits(patientId: string): Promise<Visit[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('visits')
    .select(`
      *,
      vitals (*),
      prescription:prescriptions (
        *,
        items:prescription_items (*)
      )
    `)
    .eq('patient_id', patientId)
    .eq('owner_id', userId)
    .order('visit_date', { ascending: false });

  return data || [];
}

// Get a single visit
export async function getVisit(id: string): Promise<ApiResponse<Visit>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('visits')
    .select(`
      *,
      patient:patients (*),
      vitals (*),
      prescription:prescriptions (
        *,
        items:prescription_items (*)
      )
    `)
    .eq('id', id)
    .eq('owner_id', userId)
    .single();

  if (error) return { error: error.message };
  return { data };
}

// Create a new visit with vitals
export async function createVisit(
  input: VisitInput,
  vitalsInput?: VitalsInput
): Promise<ApiResponse<Visit>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();

  // Create visit
  const { data: visit, error: visitError } = await supabase
    .from('visits')
    .insert({
      ...input,
      owner_id: userId,
      visit_date: input.visit_date || new Date().toISOString().split('T')[0]
    })
    .select()
    .single();

  if (visitError) return { error: visitError.message };

  // Create vitals if provided
  if (vitalsInput && visit) {
    const bmi = vitalsInput.weight && vitalsInput.height
      ? Number((vitalsInput.weight / ((vitalsInput.height / 100) ** 2)).toFixed(1))
      : undefined;

    await supabase.from('vitals').insert({
      visit_id: visit.id,
      ...vitalsInput,
      bmi
    });
  }

  return { data: visit, message: 'Visit created successfully' };
}

// Update a visit
export async function updateVisit(
  id: string,
  input: Partial<VisitInput>,
  vitalsInput?: VitalsInput
): Promise<ApiResponse<Visit>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();

  // Update visit
  const { data: visit, error: visitError } = await supabase
    .from('visits')
    .update(input)
    .eq('id', id)
    .eq('owner_id', userId)
    .select()
    .single();

  if (visitError) return { error: visitError.message };

  // Update or create vitals if provided
  if (vitalsInput && visit) {
    const bmi = vitalsInput.weight && vitalsInput.height
      ? Number((vitalsInput.weight / ((vitalsInput.height / 100) ** 2)).toFixed(1))
      : undefined;

    // Check if vitals exist
    const { data: existingVitals } = await supabase
      .from('vitals')
      .select('id')
      .eq('visit_id', id)
      .single();

    if (existingVitals) {
      await supabase
        .from('vitals')
        .update({ ...vitalsInput, bmi })
        .eq('visit_id', id);
    } else {
      await supabase.from('vitals').insert({
        visit_id: id,
        ...vitalsInput,
        bmi
      });
    }
  }

  return { data: visit, message: 'Visit updated successfully' };
}

// Delete a visit
export async function deleteVisit(id: string): Promise<ApiResponse<null>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from('visits')
    .delete()
    .eq('id', id)
    .eq('owner_id', userId);

  if (error) return { error: error.message };
  return { message: 'Visit deleted successfully' };
}

// Get last visit for quick repeat
export async function getLastVisit(patientId: string): Promise<ApiResponse<Visit>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('visits')
    .select(`
      *,
      vitals (*),
      prescription:prescriptions (
        *,
        items:prescription_items (*)
      )
    `)
    .eq('patient_id', patientId)
    .eq('owner_id', userId)
    .order('visit_date', { ascending: false })
    .limit(1)
    .single();

  if (error) return { error: error.message };
  return { data };
}

// Get recent visits for dashboard
export async function getRecentVisits(limit = 10): Promise<Visit[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('visits')
    .select(`
      *,
      patient:patients (id, uhid, first_name, last_name)
    `)
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  return data || [];
}
