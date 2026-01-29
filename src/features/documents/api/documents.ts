'use server';

import { createServerSupabaseClient } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import type { Document, DocumentSummary, ApiResponse } from '@/types/database';

// Get all documents for a patient
export async function getPatientDocuments(patientId: string): Promise<Document[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('documents')
    .select(`
      *,
      summary:document_summaries (*)
    `)
    .eq('patient_id', patientId)
    .eq('owner_id', userId)
    .order('uploaded_at', { ascending: false });

  return data || [];
}

// Get a single document
export async function getDocument(id: string): Promise<ApiResponse<Document>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      summary:document_summaries (*)
    `)
    .eq('id', id)
    .eq('owner_id', userId)
    .single();

  if (error) return { error: error.message };
  return { data };
}

// Create document metadata after upload
export async function createDocument(
  patientId: string,
  filePath: string,
  fileName: string,
  docType?: string
): Promise<ApiResponse<Document>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('documents')
    .insert({
      patient_id: patientId,
      owner_id: userId,
      file_path: filePath,
      file_name: fileName,
      doc_type: docType,
      ocr_status: 'pending'
    })
    .select()
    .single();

  if (error) return { error: error.message };
  return { data, message: 'Document uploaded successfully' };
}

// Update OCR status and text
export async function updateDocumentOcr(
  id: string,
  ocrText: string,
  ocrStatus: 'success' | 'failed' | 'skipped',
  ocrEngine?: string
): Promise<ApiResponse<null>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from('documents')
    .update({
      ocr_text: ocrText,
      ocr_status: ocrStatus,
      ocr_engine: ocrEngine
    })
    .eq('id', id)
    .eq('owner_id', userId);

  if (error) return { error: error.message };
  return { message: 'OCR status updated' };
}

// Save AI summary for a document
export async function saveDocumentSummary(
  documentId: string,
  summaryText: string,
  aiModel?: string
): Promise<ApiResponse<DocumentSummary>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();

  // Verify ownership
  const { data: doc } = await supabase
    .from('documents')
    .select('id')
    .eq('id', documentId)
    .eq('owner_id', userId)
    .single();

  if (!doc) return { error: 'Document not found' };

  // Delete existing summary if any
  await supabase
    .from('document_summaries')
    .delete()
    .eq('document_id', documentId);

  // Create new summary
  const { data, error } = await supabase
    .from('document_summaries')
    .insert({
      document_id: documentId,
      summary_text: summaryText,
      ai_model: aiModel
    })
    .select()
    .single();

  if (error) return { error: error.message };
  return { data, message: 'Summary saved' };
}

// Delete a document
export async function deleteDocument(id: string): Promise<ApiResponse<null>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();

  // Get file path for storage deletion
  const { data: doc } = await supabase
    .from('documents')
    .select('file_path')
    .eq('id', id)
    .eq('owner_id', userId)
    .single();

  if (!doc) return { error: 'Document not found' };

  // Delete from storage
  if (doc.file_path) {
    await supabase.storage.from('documents').remove([doc.file_path]);
  }

  // Delete from database (cascades to summaries)
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id)
    .eq('owner_id', userId);

  if (error) return { error: error.message };
  return { message: 'Document deleted successfully' };
}

// Get documents pending OCR
export async function getDocumentsPendingOcr(): Promise<Document[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('documents')
    .select('*')
    .eq('owner_id', userId)
    .eq('ocr_status', 'pending')
    .limit(10);

  return data || [];
}
