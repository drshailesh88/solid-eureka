'use server';

import { createServerSupabaseClient } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import type { TimelineEvent, ApiResponse } from '@/types/database';

// Get timeline for a patient
export async function getPatientTimeline(patientId: string): Promise<TimelineEvent[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('timeline_events')
    .select('*')
    .eq('patient_id', patientId)
    .order('event_date', { ascending: false });

  // Filter by ownership through patient
  const { data: patient } = await supabase
    .from('patients')
    .select('id')
    .eq('id', patientId)
    .eq('owner_id', userId)
    .single();

  if (!patient) return [];

  return data || [];
}

// Create timeline event
export async function createTimelineEvent(
  patientId: string,
  eventType: string,
  eventTitle: string,
  eventDate: string,
  eventText?: string,
  documentId?: string,
  visitId?: string
): Promise<ApiResponse<TimelineEvent>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();

  // Verify patient ownership
  const { data: patient } = await supabase
    .from('patients')
    .select('id')
    .eq('id', patientId)
    .eq('owner_id', userId)
    .single();

  if (!patient) return { error: 'Patient not found' };

  const { data, error } = await supabase
    .from('timeline_events')
    .insert({
      patient_id: patientId,
      event_type: eventType,
      event_title: eventTitle,
      event_date: eventDate,
      event_text: eventText,
      document_id: documentId,
      visit_id: visitId
    })
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}

// Generate timeline events from AI summary
export async function generateTimelineFromSummary(
  patientId: string,
  documentId: string,
  events: Array<{
    date: string;
    type: string;
    title: string;
    text?: string;
  }>
): Promise<ApiResponse<TimelineEvent[]>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();

  // Verify patient ownership
  const { data: patient } = await supabase
    .from('patients')
    .select('id')
    .eq('id', patientId)
    .eq('owner_id', userId)
    .single();

  if (!patient) return { error: 'Patient not found' };

  // Insert all events
  const eventsToInsert = events.map((e) => ({
    patient_id: patientId,
    document_id: documentId,
    event_date: e.date,
    event_type: e.type,
    event_title: e.title,
    event_text: e.text
  }));

  const { data, error } = await supabase
    .from('timeline_events')
    .insert(eventsToInsert)
    .select();

  if (error) return { error: error.message };
  return { data: data || [] };
}

// Delete timeline event
export async function deleteTimelineEvent(id: string): Promise<ApiResponse<null>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();

  // Verify ownership through patient
  const { data: event } = await supabase
    .from('timeline_events')
    .select('patient_id')
    .eq('id', id)
    .single();

  if (!event) return { error: 'Event not found' };

  const { data: patient } = await supabase
    .from('patients')
    .select('id')
    .eq('id', event.patient_id)
    .eq('owner_id', userId)
    .single();

  if (!patient) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('timeline_events')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };
  return { message: 'Event deleted' };
}

// Format timeline for react-chrono
export function formatTimelineForChrono(events: TimelineEvent[]) {
  return events.map((event) => ({
    title: event.event_date,
    cardTitle: event.event_title,
    cardSubtitle: event.event_type,
    cardDetailedText: event.event_text || ''
  }));
}
