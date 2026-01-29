import { Icons } from '@/components/icons';

export interface PermissionCheck {
  permission?: string;
  plan?: string;
  feature?: string;
  role?: string;
  requireOrg?: boolean;
}

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
  access?: PermissionCheck;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

// ============================================
// Patient Types
// ============================================

export interface Patient {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  age: number | null;
  sex: string | null;
  uhid: string | null;
  blood_group: string | null;
  allergies: string[] | null;
  chronic_conditions: string[] | null;
  emergency_contact: string | null;
  aadhaar_last4: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// Payment Types
// ============================================

export type PaymentMethod = 'cash' | 'upi' | 'card' | 'pending';

export type PaymentStatus = 'pending' | 'paid' | 'waived';

export type PaymentType = 'consultation' | 'procedure' | 'medicine';

export interface Payment {
  id: string;
  encounter_id: string | null;
  patient_id: string;
  amount: number;
  type: PaymentType;
  method: PaymentMethod | null;
  upi_ref: string | null;
  receipt_number: string | null;
  status: PaymentStatus;
  paid_at: string | null;
  created_at: string;
}

export interface FeeSchedule {
  id: string;
  type: string;
  amount: number;
  valid_from: string;
  valid_to: string | null;
}

// ============================================
// Queue & Token Types
// ============================================

export type QueueStatus = 'waiting' | 'in_progress' | 'done' | 'no_show';

export type QueueType = 'scheduled' | 'walk_in';

export interface QueueEntry {
  id: string;
  date: string;
  patient_id: string;
  appointment_id: string | null;
  token_number: number;
  type: QueueType;
  status: QueueStatus;
  check_in_at: string | null;
  called_at: string | null;
  completed_at: string | null;
  created_at?: string;
}
