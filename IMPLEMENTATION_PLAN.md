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
- [x] Add migration: `allergies TEXT[]`, `chronic_conditions TEXT[]`, `blood_group TEXT` to patients table
- [x] Update Supabase schema.sql
- [x] Verify RLS policies still work

### Task 2: Update Patient Types
- [x] Add new fields to `src/types/index.ts` Patient interface
- [x] Update patient form schema (Zod)

### Task 3: Update Patient Form
- [x] Add allergies input (tag/chip input for multiple)
- [x] Add chronic conditions input (tag/chip input)
- [x] Add blood group dropdown (A+, A-, B+, B-, AB+, AB-, O+, O-)

### Task 4: Create Allergy Warning Banner
- [x] Create `AllergyBanner` component (red, prominent)
- [x] Display on patient detail page
- [x] Display on visit page when patient has allergies

### Task 5: Display Chronic Conditions
- [x] Create badges for chronic conditions
- [x] Display on patient card
- [x] Display on visit page

---

## P1: HIGH - Payments System

### Task 6: Install UPI Library
- [x] Run `npm install upiqr`
- [x] Verify installation

### Task 7: Create Payment Database Schema
- [x] Add `fee_schedule` table migration
- [x] Add `payments` table migration
- [x] Create get_next_receipt_number function
- [x] Enable RLS on both tables

### Task 8: Create Payment Types
- [x] Add Payment interface to types
- [x] Add FeeSchedule interface
- [x] Add PaymentMethod enum (cash, upi, card, pending)
- [x] Add PaymentStatus enum (pending, paid, waived)

### Task 9: Create Payment API
- [x] Create `src/features/payments/api/payments.ts`
- [x] createPayment function
- [x] getPaymentsByDate function
- [x] getDailyCollection function
- [x] updatePaymentStatus function

### Task 10: Create Fee Schedule Settings
- [x] Create `FeeScheduleSettings` component
- [x] Allow setting consultation fee (new patient)
- [x] Allow setting follow-up fee
- [x] Save to fee_schedule table

### Task 11: Create UPI QR Component
- [x] Create `UPIQRCode` component using `upiqr`
- [x] Accept amount, patient name, doctor UPI ID
- [x] Display QR code with amount shown
- [x] Copy UPI link button

### Task 12: Create Payment Form
- [x] Create `PaymentForm` component
- [x] Quick buttons: Cash, UPI, Waive
- [x] Amount input (pre-filled from fee schedule)
- [x] UPI reference input (when UPI selected)
- [x] Show UPI QR when UPI selected
- [x] Generate receipt number on save

### Task 13: Create Payment Badge
- [x] Create `PaymentBadge` component
- [x] Show PAID (green), PENDING (yellow), WAIVED (gray)

### Task 14: Create Daily Collection Card
- [x] Create `DailyCollectionCard` component
- [x] Show total collected today
- [x] Breakdown: Cash / UPI / Card
- [x] Count of pending payments
- [x] Place in dashboard header

### Task 15: Add Payment to Visit Flow
- [x] Add payment section to visit page
- [x] Show payment status badge
- [x] Quick collect button
- [x] Link payment to encounter

---

## P2: HIGH - Queue & Token System

### Task 16: Create Queue Database Schema
- [x] Add `queue` table migration
- [x] Create `get_next_token` function
- [x] Add unique constraint (date, token_number)
- [x] Enable RLS

### Task 17: Create Queue Types
- [x] Add QueueEntry interface
- [x] Add QueueStatus enum (waiting, in_progress, done, no_show)
- [x] Add QueueType enum (scheduled, walk_in)

### Task 18: Create Queue API
- [x] Create `src/features/queue/api/queue.ts`
- [x] addToQueue function (with auto token)
- [x] getTodaysQueue function
- [x] updateQueueStatus function
- [x] callNextPatient function
- [x] reorderQueue function

### Task 19: Create Queue Panel Component
- [x] Create `QueuePanel` component
- [x] List today's queue entries
- [x] Show token number prominently
- [x] Show patient name
- [x] Show status badge (WAITING / IN ROOM / DONE)
- [x] Show type badge (SCHEDULED / WALK-IN)

### Task 20: Create Queue Item Component
- [x] Create `QueueItem` component
- [x] Display token, name, status, type
- [x] Payment status indicator
- [x] Vitals status indicator
- [x] Click to open patient

### Task 21: Create Add Walk-In Flow
- [x] Create `AddWalkInDialog` component
- [x] Patient search/select
- [x] Create new patient option
- [x] Assign next token automatically
- [x] Add to queue

### Task 22: Create Check-In Flow
- [ ] Create `CheckInDialog` component
- [ ] For scheduled appointments
- [ ] Assign token on check-in
- [ ] Update queue status

### Task 23: Create Call Next Button
- [x] Create `CallNextButton` component
- [x] Get next waiting patient
- [x] Update status to in_progress
- [x] Show patient info

### Task 24: Create Queue Stats
- [x] Create `QueueStats` component
- [x] Today: X seen, Y waiting
- [x] Average wait time (optional)

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
| P0 | 5 | 5 | 0 |
| P1 | 10 | 10 | 0 |
| P2 | 11 | 8 | 3 |
| P3 | 2 | 0 | 2 |
| **TOTAL** | **28** | **23** | **5** |

---

## Notes
- Use proven repos: `upiqr` for UPI QR
- Use existing: @react-pdf/renderer, Shadcn, Zustand
- Supabase real-time for queue updates
- All tables need RLS policies scoped by owner/clinic
