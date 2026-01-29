# IMPLEMENTATION PLAN

> This file is the persistent state for Ralph Wiggum autonomous coding.
> Updated after each iteration. Source of truth for what's done vs. pending.

## Status Legend
- [ ] Pending
- [~] In Progress
- [x] Complete

---

## P0: CRITICAL - Patient Safety (Allergies Can Kill)

### Task 1: Add Patient Safety Fields to Database
- [ ] Add migration: `allergies TEXT[]`, `chronic_conditions TEXT[]`, `blood_group TEXT` to patients table
- [ ] Update Supabase schema.sql
- [ ] Verify RLS policies still work

### Task 2: Update Patient Types
- [ ] Add new fields to `src/types/index.ts` Patient interface
- [ ] Update patient form schema (Zod)

### Task 3: Update Patient Form
- [ ] Add allergies input (tag/chip input for multiple)
- [ ] Add chronic conditions input (tag/chip input)
- [ ] Add blood group dropdown (A+, A-, B+, B-, AB+, AB-, O+, O-)

### Task 4: Create Allergy Warning Banner
- [ ] Create `AllergyBanner` component (red, prominent)
- [ ] Display on patient detail page
- [ ] Display on visit page when patient has allergies

### Task 5: Display Chronic Conditions
- [ ] Create badges for chronic conditions
- [ ] Display on patient card
- [ ] Display on visit page

---

## P1: HIGH - Payments System

### Task 6: Install UPI Library
- [ ] Run `npm install upiqr`
- [ ] Verify installation

### Task 7: Create Payment Database Schema
- [ ] Add `fee_schedule` table migration
- [ ] Add `payments` table migration
- [ ] Create get_next_receipt_number function
- [ ] Enable RLS on both tables

### Task 8: Create Payment Types
- [ ] Add Payment interface to types
- [ ] Add FeeSchedule interface
- [ ] Add PaymentMethod enum (cash, upi, card, pending)
- [ ] Add PaymentStatus enum (pending, paid, waived)

### Task 9: Create Payment API
- [ ] Create `src/features/payments/api/payments.ts`
- [ ] createPayment function
- [ ] getPaymentsByDate function
- [ ] getDailyCollection function
- [ ] updatePaymentStatus function

### Task 10: Create Fee Schedule Settings
- [ ] Create `FeeScheduleSettings` component
- [ ] Allow setting consultation fee (new patient)
- [ ] Allow setting follow-up fee
- [ ] Save to fee_schedule table

### Task 11: Create UPI QR Component
- [ ] Create `UPIQRCode` component using `upiqr`
- [ ] Accept amount, patient name, doctor UPI ID
- [ ] Display QR code with amount shown
- [ ] Copy UPI link button

### Task 12: Create Payment Form
- [ ] Create `PaymentForm` component
- [ ] Quick buttons: Cash, UPI, Waive
- [ ] Amount input (pre-filled from fee schedule)
- [ ] UPI reference input (when UPI selected)
- [ ] Show UPI QR when UPI selected
- [ ] Generate receipt number on save

### Task 13: Create Payment Badge
- [ ] Create `PaymentBadge` component
- [ ] Show PAID (green), PENDING (yellow), WAIVED (gray)

### Task 14: Create Daily Collection Card
- [ ] Create `DailyCollectionCard` component
- [ ] Show total collected today
- [ ] Breakdown: Cash / UPI / Card
- [ ] Count of pending payments
- [ ] Place in dashboard header

### Task 15: Add Payment to Visit Flow
- [ ] Add payment section to visit page
- [ ] Show payment status badge
- [ ] Quick collect button
- [ ] Link payment to encounter

---

## P2: HIGH - Queue & Token System

### Task 16: Create Queue Database Schema
- [ ] Add `queue` table migration
- [ ] Create `get_next_token` function
- [ ] Add unique constraint (date, token_number)
- [ ] Enable RLS

### Task 17: Create Queue Types
- [ ] Add QueueEntry interface
- [ ] Add QueueStatus enum (waiting, in_progress, done, no_show)
- [ ] Add QueueType enum (scheduled, walk_in)

### Task 18: Create Queue API
- [ ] Create `src/features/queue/api/queue.ts`
- [ ] addToQueue function (with auto token)
- [ ] getTodaysQueue function
- [ ] updateQueueStatus function
- [ ] callNextPatient function
- [ ] reorderQueue function

### Task 19: Create Queue Panel Component
- [ ] Create `QueuePanel` component
- [ ] List today's queue entries
- [ ] Show token number prominently
- [ ] Show patient name
- [ ] Show status badge (WAITING / IN ROOM / DONE)
- [ ] Show type badge (SCHEDULED / WALK-IN)

### Task 20: Create Queue Item Component
- [ ] Create `QueueItem` component
- [ ] Display token, name, status, type
- [ ] Payment status indicator
- [ ] Vitals status indicator
- [ ] Click to open patient

### Task 21: Create Add Walk-In Flow
- [ ] Create `AddWalkInDialog` component
- [ ] Patient search/select
- [ ] Create new patient option
- [ ] Assign next token automatically
- [ ] Add to queue

### Task 22: Create Check-In Flow
- [ ] Create `CheckInDialog` component
- [ ] For scheduled appointments
- [ ] Assign token on check-in
- [ ] Update queue status

### Task 23: Create Call Next Button
- [ ] Create `CallNextButton` component
- [ ] Get next waiting patient
- [ ] Update status to in_progress
- [ ] Show patient info

### Task 24: Create Queue Stats
- [ ] Create `QueueStats` component
- [ ] Today: X seen, Y waiting
- [ ] Average wait time (optional)

### Task 25: Add Queue to Dashboard
- [ ] Add QueuePanel to dashboard layout
- [ ] Left sidebar or dedicated page
- [ ] Real-time updates with Supabase

### Task 26: Daily Queue Reset
- [ ] Create function to mark yesterday's incomplete as no_show
- [ ] Run on first load of day
- [ ] Or scheduled job

---

## P3: MEDIUM - Enhancements

### Task 27: Receipt PDF Generation
- [ ] Create `ReceiptPDF` component using @react-pdf/renderer
- [ ] Include clinic header, patient info, amount, date
- [ ] Receipt number, payment method
- [ ] Download/print option

### Task 28: CSV Export for Collections
- [ ] Add export button to Daily Collection
- [ ] Generate CSV with date, patient, amount, method
- [ ] Download file

---

## Completion Tracking

| Phase | Total | Done | Remaining |
|-------|-------|------|-----------|
| P0 | 5 | 0 | 5 |
| P1 | 10 | 0 | 10 |
| P2 | 11 | 0 | 11 |
| P3 | 2 | 0 | 2 |
| **TOTAL** | **28** | **0** | **28** |

---

## Notes
- Use proven repos: `upiqr` for UPI QR
- Use existing: @react-pdf/renderer, Shadcn, Zustand
- Supabase real-time for queue updates
- All tables need RLS policies scoped by owner/clinic
