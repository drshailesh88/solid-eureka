'use server';

import { createServerSupabaseClient } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import type {
  Payment,
  PaymentInput,
  FeeSchedule,
  FeeScheduleInput,
  DailyCollection,
  ApiResponse
} from '@/types/database';

// Generate receipt number
function generateReceiptNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `RCP${year}${month}${day}${random}`;
}

// Create a new payment
export async function createPayment(
  input: PaymentInput
): Promise<ApiResponse<Payment>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();

  const paymentData: Record<string, unknown> = {
    ...input,
    owner_id: userId,
    receipt_number: generateReceiptNumber()
  };

  // If payment is being made (not pending), set paid_at
  if (input.status === 'paid' || input.status === 'waived') {
    paymentData.paid_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('payments')
    .insert(paymentData)
    .select()
    .single();

  if (error) return { error: error.message };
  return { data, message: 'Payment recorded successfully' };
}

// Get payments by date
export async function getPaymentsByDate(date: string): Promise<Payment[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const supabase = createServerSupabaseClient();

  // Get start and end of the day
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const { data } = await supabase
    .from('payments')
    .select(
      `
      *,
      patient:patients(id, uhid, first_name, last_name, phone)
    `
    )
    .eq('owner_id', userId)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .order('created_at', { ascending: false });

  return data || [];
}

// Get daily collection summary
export async function getDailyCollection(
  date: string
): Promise<DailyCollection> {
  const { userId } = await auth();
  if (!userId) {
    return { total: 0, cash: 0, upi: 0, card: 0, pending_count: 0 };
  }

  const supabase = createServerSupabaseClient();

  // Get start and end of the day
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const { data } = await supabase
    .from('payments')
    .select('amount, method, status')
    .eq('owner_id', userId)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (!data) {
    return { total: 0, cash: 0, upi: 0, card: 0, pending_count: 0 };
  }

  let total = 0;
  let cash = 0;
  let upi = 0;
  let card = 0;
  let pending_count = 0;

  for (const payment of data) {
    if (payment.status === 'paid') {
      total += Number(payment.amount) || 0;

      switch (payment.method) {
        case 'cash':
          cash += Number(payment.amount) || 0;
          break;
        case 'upi':
          upi += Number(payment.amount) || 0;
          break;
        case 'card':
          card += Number(payment.amount) || 0;
          break;
      }
    } else if (payment.status === 'pending') {
      pending_count++;
    }
  }

  return { total, cash, upi, card, pending_count };
}

// Update payment status
export async function updatePaymentStatus(
  id: string,
  status: 'pending' | 'paid' | 'waived',
  method?: 'cash' | 'upi' | 'card',
  upi_ref?: string
): Promise<ApiResponse<Payment>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();

  const updateData: Record<string, unknown> = { status };

  if (method) {
    updateData.method = method;
  }

  if (upi_ref) {
    updateData.upi_ref = upi_ref;
  }

  if (status === 'paid' || status === 'waived') {
    updateData.paid_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('payments')
    .update(updateData)
    .eq('id', id)
    .eq('owner_id', userId)
    .select()
    .single();

  if (error) return { error: error.message };
  return { data, message: 'Payment updated successfully' };
}

// Get a single payment
export async function getPayment(id: string): Promise<ApiResponse<Payment>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('payments')
    .select(
      `
      *,
      patient:patients(id, uhid, first_name, last_name, phone)
    `
    )
    .eq('id', id)
    .eq('owner_id', userId)
    .single();

  if (error) return { error: error.message };
  return { data };
}

// Get fee schedule
export async function getFeeSchedule(): Promise<FeeSchedule[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const supabase = createServerSupabaseClient();

  const { data } = await supabase
    .from('fee_schedule')
    .select('*')
    .eq('owner_id', userId)
    .or('valid_to.is.null,valid_to.gte.' + new Date().toISOString())
    .order('type', { ascending: true });

  return data || [];
}

// Update fee schedule
export async function updateFeeSchedule(
  input: FeeScheduleInput
): Promise<ApiResponse<FeeSchedule>> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const supabase = createServerSupabaseClient();

  // Check if a fee schedule of this type already exists
  const { data: existing } = await supabase
    .from('fee_schedule')
    .select('id')
    .eq('owner_id', userId)
    .eq('type', input.type)
    .is('valid_to', null)
    .single();

  if (existing) {
    // Update existing
    const { data, error } = await supabase
      .from('fee_schedule')
      .update({
        amount: input.amount,
        name: input.name,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) return { error: error.message };
    return { data, message: 'Fee schedule updated successfully' };
  } else {
    // Create new
    const { data, error } = await supabase
      .from('fee_schedule')
      .insert({
        ...input,
        owner_id: userId
      })
      .select()
      .single();

    if (error) return { error: error.message };
    return { data, message: 'Fee schedule created successfully' };
  }
}

// Get fee by type
export async function getFeeByType(
  type: 'new_consultation' | 'follow_up' | 'procedure'
): Promise<number> {
  const { userId } = await auth();
  if (!userId) return 0;

  const supabase = createServerSupabaseClient();

  const { data } = await supabase
    .from('fee_schedule')
    .select('amount')
    .eq('owner_id', userId)
    .eq('type', type)
    .or('valid_to.is.null,valid_to.gte.' + new Date().toISOString())
    .single();

  return data?.amount || 0;
}

// Get payments by patient
export async function getPaymentsByPatient(
  patientId: string
): Promise<Payment[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const supabase = createServerSupabaseClient();

  const { data } = await supabase
    .from('payments')
    .select('*')
    .eq('owner_id', userId)
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });

  return data || [];
}
