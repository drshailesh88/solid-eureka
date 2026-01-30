'use server';

import { createServerSupabaseClient } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import type { QueueEntry, QueueStatus, QueueType } from '@/types';
import type { ApiResponse } from '@/types/database';

// Patient info for queue display (minimal fields needed)
export interface QueuePatient {
  id: string;
  name: string;
  phone: string | null;
  uhid: string | null;
}

// Types for queue entries with patient data
export interface QueueEntryWithPatient extends QueueEntry {
  patient: QueuePatient;
  has_vitals?: boolean;
  payment_status?: 'pending' | 'paid' | 'waived';
}

export interface QueueStats {
  total_today: number;
  waiting: number;
  in_progress: number;
  done: number;
  no_show: number;
}

// Add a patient to today's queue
export async function addToQueue(
  patientId: string,
  type: QueueType,
  appointmentId?: string
): Promise<ApiResponse<QueueEntry>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();
  const today = new Date().toISOString().split('T')[0];

  // Check if patient is already in today's queue
  const { data: existing } = await supabase
    .from('queue')
    .select('id')
    .eq('patient_id', patientId)
    .eq('date', today)
    .single();

  if (existing) {
    return { error: 'Patient is already in today\'s queue' };
  }

  // Get next token number using database function
  const { data: tokenData, error: tokenError } = await supabase
    .rpc('get_next_token', { queue_date: today });

  if (tokenError) {
    return { error: `Failed to get token: ${tokenError.message}` };
  }

  const tokenNumber = tokenData as number;

  // Insert queue entry
  const { data, error } = await supabase
    .from('queue')
    .insert({
      date: today,
      patient_id: patientId,
      appointment_id: appointmentId || null,
      token_number: tokenNumber,
      type,
      status: 'waiting',
      check_in_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data, message: `Token #${tokenNumber} assigned successfully` };
}

// Get today's queue with patient information
export async function getTodaysQueue(): Promise<QueueEntryWithPatient[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const supabase = createServerSupabaseClient();
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('queue')
    .select(`
      *,
      patient:patients!patient_id (
        id,
        name,
        phone,
        uhid
      )
    `)
    .eq('date', today)
    .order('token_number', { ascending: true });

  if (error || !data) {
    console.error('Error fetching queue:', error);
    return [];
  }

  // Get vitals and payment status for each queue entry
  const queueWithDetails = await Promise.all(
    data.map(async (entry) => {
      // Check for vitals in today's encounter
      const { count: vitalsCount } = await supabase
        .from('vitals')
        .select('*', { count: 'exact', head: true })
        .eq('patient_id', entry.patient_id)
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`);

      // Check payment status for today
      const { data: payment } = await supabase
        .from('payments')
        .select('status')
        .eq('patient_id', entry.patient_id)
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      return {
        ...entry,
        has_vitals: (vitalsCount || 0) > 0,
        payment_status: payment?.status || 'pending',
      } as QueueEntryWithPatient;
    })
  );

  return queueWithDetails;
}

// Update queue entry status
export async function updateQueueStatus(
  id: string,
  status: QueueStatus
): Promise<ApiResponse<QueueEntry>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();

  const updateData: Partial<QueueEntry> = { status };

  // Set timestamps based on status
  if (status === 'in_progress') {
    updateData.called_at = new Date().toISOString();
  } else if (status === 'done' || status === 'no_show') {
    updateData.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('queue')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data, message: `Status updated to ${status}` };
}

// Call the next patient in the queue
export async function callNextPatient(): Promise<ApiResponse<QueueEntryWithPatient | null>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();
  const today = new Date().toISOString().split('T')[0];

  // Get the next waiting patient (lowest token number with status 'waiting')
  const { data: nextPatient, error: fetchError } = await supabase
    .from('queue')
    .select(`
      *,
      patient:patients!patient_id (
        id,
        name,
        phone,
        uhid
      )
    `)
    .eq('date', today)
    .eq('status', 'waiting')
    .order('token_number', { ascending: true })
    .limit(1)
    .single();

  if (fetchError) {
    if (fetchError.code === 'PGRST116') {
      return { data: null, message: 'No patients waiting in queue' };
    }
    return { error: fetchError.message };
  }

  // Update the patient's status to in_progress
  const { error: updateError } = await supabase
    .from('queue')
    .update({
      status: 'in_progress',
      called_at: new Date().toISOString(),
    })
    .eq('id', nextPatient.id);

  if (updateError) {
    return { error: updateError.message };
  }

  return {
    data: {
      ...nextPatient,
      status: 'in_progress',
      called_at: new Date().toISOString(),
    } as QueueEntryWithPatient,
    message: `Called Token #${nextPatient.token_number}: ${nextPatient.patient.name}`,
  };
}

// Get queue statistics for today
export async function getQueueStats(): Promise<QueueStats> {
  const { userId } = await auth();
  if (!userId) {
    return { total_today: 0, waiting: 0, in_progress: 0, done: 0, no_show: 0 };
  }

  const supabase = createServerSupabaseClient();
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('queue')
    .select('status')
    .eq('date', today);

  if (error || !data) {
    return { total_today: 0, waiting: 0, in_progress: 0, done: 0, no_show: 0 };
  }

  const stats: QueueStats = {
    total_today: data.length,
    waiting: data.filter((e) => e.status === 'waiting').length,
    in_progress: data.filter((e) => e.status === 'in_progress').length,
    done: data.filter((e) => e.status === 'done').length,
    no_show: data.filter((e) => e.status === 'no_show').length,
  };

  return stats;
}

// Move patient to end of queue (reassign highest token number)
export async function moveToEndOfQueue(id: string): Promise<ApiResponse<QueueEntry>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();
  const today = new Date().toISOString().split('T')[0];

  // Get the current highest token number
  const { data: tokenData, error: tokenError } = await supabase
    .rpc('get_next_token', { queue_date: today });

  if (tokenError) {
    return { error: `Failed to get token: ${tokenError.message}` };
  }

  const newTokenNumber = tokenData as number;

  // Update the queue entry with new token number
  const { data, error } = await supabase
    .from('queue')
    .update({
      token_number: newTokenNumber,
      status: 'waiting',
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data, message: `Moved to Token #${newTokenNumber}` };
}

// Remove patient from queue
export async function removeFromQueue(id: string): Promise<ApiResponse<null>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from('queue').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }

  return { message: 'Removed from queue' };
}

// Daily queue reset - mark stale queue entries as no_show
// This function finds all queue entries from before today with status 'waiting' or 'in_progress'
// and updates their status to 'no_show'
export async function resetStaleQueueEntries(): Promise<ApiResponse<{ count: number }>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();
  const today = new Date().toISOString().split('T')[0];

  // Find all queue entries from before today that are still waiting or in_progress
  const { data: staleEntries, error: fetchError } = await supabase
    .from('queue')
    .select('id')
    .lt('date', today)
    .in('status', ['waiting', 'in_progress']);

  if (fetchError) {
    return { error: `Failed to fetch stale entries: ${fetchError.message}` };
  }

  if (!staleEntries || staleEntries.length === 0) {
    return { data: { count: 0 }, message: 'No stale queue entries found' };
  }

  const staleIds = staleEntries.map((entry) => entry.id);

  // Update all stale entries to no_show status
  const { error: updateError } = await supabase
    .from('queue')
    .update({
      status: 'no_show',
      completed_at: new Date().toISOString(),
    })
    .in('id', staleIds);

  if (updateError) {
    return { error: `Failed to update stale entries: ${updateError.message}` };
  }

  return {
    data: { count: staleEntries.length },
    message: `Marked ${staleEntries.length} stale queue entries as no_show`,
  };
}
