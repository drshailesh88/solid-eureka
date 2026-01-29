'use server';

import { createServerSupabaseClient } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import { generateHindiInstruction } from '@/lib/i18n/hindi-templates';
import type { Prescription, PrescriptionItem, PrescriptionItemInput, ApiResponse } from '@/types/database';

// Get prescription for a visit
export async function getVisitPrescription(visitId: string): Promise<ApiResponse<Prescription>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('prescriptions')
    .select(`
      *,
      items:prescription_items (*)
    `)
    .eq('visit_id', visitId)
    .eq('owner_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') return { error: error.message };
  return { data };
}

// Create or update prescription with items
export async function savePrescription(
  visitId: string,
  items: PrescriptionItemInput[],
  language: string = 'en'
): Promise<ApiResponse<Prescription>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();

  // Check if prescription exists
  const { data: existing } = await supabase
    .from('prescriptions')
    .select('id')
    .eq('visit_id', visitId)
    .eq('owner_id', userId)
    .single();

  let prescriptionId: string;

  if (existing) {
    prescriptionId = existing.id;
    // Update prescription
    await supabase
      .from('prescriptions')
      .update({ language, updated_at: new Date().toISOString() })
      .eq('id', prescriptionId);

    // Delete existing items
    await supabase
      .from('prescription_items')
      .delete()
      .eq('prescription_id', prescriptionId);
  } else {
    // Create new prescription
    const { data: newPrescription, error } = await supabase
      .from('prescriptions')
      .insert({
        visit_id: visitId,
        owner_id: userId,
        language
      })
      .select()
      .single();

    if (error) return { error: error.message };
    prescriptionId = newPrescription.id;
  }

  // Insert items with Hindi translations
  const itemsWithHindi = items.map((item, index) => ({
    prescription_id: prescriptionId,
    ...item,
    instructions_hindi: generateHindiInstruction(
      item.frequency,
      item.pattern,
      item.duration,
      item.instructions
    ),
    sort_order: index
  }));

  if (itemsWithHindi.length > 0) {
    const { error: itemsError } = await supabase
      .from('prescription_items')
      .insert(itemsWithHindi);

    if (itemsError) return { error: itemsError.message };
  }

  // Return updated prescription
  const { data: prescription } = await supabase
    .from('prescriptions')
    .select(`
      *,
      items:prescription_items (*)
    `)
    .eq('id', prescriptionId)
    .single();

  return { data: prescription, message: 'Prescription saved successfully' };
}

// Add single item to prescription
export async function addPrescriptionItem(
  prescriptionId: string,
  item: PrescriptionItemInput
): Promise<ApiResponse<PrescriptionItem>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();

  // Verify ownership
  const { data: prescription } = await supabase
    .from('prescriptions')
    .select('id')
    .eq('id', prescriptionId)
    .eq('owner_id', userId)
    .single();

  if (!prescription) return { error: 'Prescription not found' };

  // Get current max sort order
  const { data: maxOrder } = await supabase
    .from('prescription_items')
    .select('sort_order')
    .eq('prescription_id', prescriptionId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single();

  const sortOrder = (maxOrder?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from('prescription_items')
    .insert({
      prescription_id: prescriptionId,
      ...item,
      instructions_hindi: generateHindiInstruction(
        item.frequency,
        item.pattern,
        item.duration,
        item.instructions
      ),
      sort_order: sortOrder
    })
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}

// Remove item from prescription
export async function removePrescriptionItem(itemId: string): Promise<ApiResponse<null>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();

  // Verify ownership through prescription
  const { data: item } = await supabase
    .from('prescription_items')
    .select('prescription_id')
    .eq('id', itemId)
    .single();

  if (!item) return { error: 'Item not found' };

  const { data: prescription } = await supabase
    .from('prescriptions')
    .select('id')
    .eq('id', item.prescription_id)
    .eq('owner_id', userId)
    .single();

  if (!prescription) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('prescription_items')
    .delete()
    .eq('id', itemId);

  if (error) return { error: error.message };
  return { message: 'Item removed' };
}

// Update PDF URL after generation
export async function updatePrescriptionPdfUrl(
  prescriptionId: string,
  pdfUrl: string
): Promise<ApiResponse<null>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from('prescriptions')
    .update({ pdf_url: pdfUrl })
    .eq('id', prescriptionId)
    .eq('owner_id', userId);

  if (error) return { error: error.message };
  return { message: 'PDF URL updated' };
}
