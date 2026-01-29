// =================================================================
// Database Types (matches Supabase schema)
// =================================================================

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Patient {
  id: string;
  owner_id: string;
  uhid: string;
  first_name: string;
  last_name?: string;
  age?: number;
  sex?: 'male' | 'female' | 'other';
  phone?: string;
  address?: string;
  blood_group?: BloodGroup;
  allergies?: string[];
  chronic_conditions?: string[];
  created_at: string;
  updated_at: string;
}

export interface Visit {
  id: string;
  patient_id: string;
  owner_id: string;
  visit_date: string;
  chief_complaints?: string;
  hpi?: string;
  investigations?: string;
  findings?: string;
  diagnosis?: string;
  plan?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Relations
  patient?: Patient;
  vitals?: Vitals;
  prescription?: Prescription;
}

export interface Vitals {
  id: string;
  visit_id: string;
  bp_systolic?: number;
  bp_diastolic?: number;
  pulse?: number;
  temperature?: number;
  spo2?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  created_at: string;
}

export interface Prescription {
  id: string;
  visit_id: string;
  owner_id: string;
  summary?: string;
  language: string;
  pdf_url?: string;
  created_at: string;
  updated_at: string;
  // Relations
  items?: PrescriptionItem[];
}

export interface PrescriptionItem {
  id: string;
  prescription_id: string;
  brand: string;
  salt?: string;
  dose?: string;
  frequency?: string;
  pattern?: string;
  duration?: string;
  instructions?: string;
  instructions_hindi?: string;
  sort_order: number;
  created_at: string;
}

export interface Document {
  id: string;
  patient_id: string;
  owner_id: string;
  file_path: string;
  file_name?: string;
  doc_type?: string;
  uploaded_at: string;
  ocr_text?: string;
  ocr_status?: 'pending' | 'processing' | 'success' | 'failed' | 'skipped';
  ocr_engine?: string;
  created_at: string;
  // Relations
  summary?: DocumentSummary;
}

export interface DocumentSummary {
  id: string;
  document_id: string;
  summary_text: string;
  ai_model?: string;
  created_at: string;
}

export interface TimelineEvent {
  id: string;
  patient_id: string;
  document_id?: string;
  visit_id?: string;
  event_date: string;
  event_type: string;
  event_title: string;
  event_text?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  owner_id: string;
  encounter_id?: string;
  patient_id?: string;
  amount: number;
  type: 'consultation' | 'procedure' | 'medicine' | 'follow_up';
  method?: 'cash' | 'upi' | 'card' | 'pending';
  upi_ref?: string;
  receipt_number?: string;
  status: 'pending' | 'paid' | 'waived';
  paid_at?: string;
  created_at: string;
  // Relations
  patient?: Patient;
}

export interface FeeSchedule {
  id: string;
  owner_id: string;
  type: 'new_consultation' | 'follow_up' | 'procedure';
  name?: string;
  amount: number;
  valid_from?: string;
  valid_to?: string;
  created_at: string;
  updated_at: string;
}

export interface DailyCollection {
  total: number;
  cash: number;
  upi: number;
  card: number;
  pending_count: number;
}

export interface Template {
  id: string;
  owner_id: string;
  name: string;
  type: 'prescription' | 'visit' | 'specialty';
  specialty?: string;
  content: Record<string, unknown>;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  owner_id: string;
  action: string;
  entity: string;
  entity_id?: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

// =================================================================
// Form Input Types
// =================================================================

export interface PatientInput {
  uhid: string;
  first_name: string;
  last_name?: string;
  age?: number;
  sex?: 'male' | 'female' | 'other';
  phone?: string;
  address?: string;
  blood_group?: BloodGroup;
  allergies?: string[];
  chronic_conditions?: string[];
}

export interface VisitInput {
  patient_id: string;
  visit_date?: string;
  chief_complaints?: string;
  hpi?: string;
  investigations?: string;
  findings?: string;
  diagnosis?: string;
  plan?: string;
  notes?: string;
}

export interface VitalsInput {
  bp_systolic?: number;
  bp_diastolic?: number;
  pulse?: number;
  temperature?: number;
  spo2?: number;
  weight?: number;
  height?: number;
}

export interface PrescriptionItemInput {
  brand: string;
  salt?: string;
  dose?: string;
  frequency?: string;
  pattern?: string;
  duration?: string;
  instructions?: string;
}

export interface PaymentInput {
  encounter_id?: string;
  patient_id?: string;
  amount: number;
  type: 'consultation' | 'procedure' | 'medicine' | 'follow_up';
  method?: 'cash' | 'upi' | 'card' | 'pending';
  upi_ref?: string;
  status?: 'pending' | 'paid' | 'waived';
}

export interface FeeScheduleInput {
  type: 'new_consultation' | 'follow_up' | 'procedure';
  name?: string;
  amount: number;
  valid_from?: string;
  valid_to?: string;
}

// =================================================================
// API Response Types
// =================================================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
