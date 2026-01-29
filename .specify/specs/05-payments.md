# Payments Specification

## User Story
As a doctor, I need to collect consultation fees from patients using cash or UPI, generate receipts, and track daily collections so I can manage my clinic finances.

## Acceptance Criteria
- [ ] Can set consultation fees (fee schedule: new patient, follow-up, procedure)
- [ ] Can record cash payment with amount
- [ ] Can record UPI payment with reference number
- [ ] Can waive payment for special cases
- [ ] Receipt number auto-generates (format: R-{YEAR}-{SEQUENCE})
- [ ] UPI QR code generates with correct format
- [ ] Daily collection summary visible (total, by method, pending)
- [ ] Can export collections to CSV

## Data Model

### Fee Schedule
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| type | TEXT | Yes | consultation_new / consultation_followup / procedure |
| amount | DECIMAL | Yes | Fee amount in INR |
| valid_from | DATE | Yes | Start date |
| valid_to | DATE | No | End date (null = current) |

### Payment
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| encounter_id | UUID | No | FK to visits/encounters |
| patient_id | UUID | Yes | FK to patients |
| amount | DECIMAL | Yes | Amount in INR |
| type | TEXT | Yes | consultation / procedure / medicine |
| method | TEXT | No | cash / upi / card |
| upi_ref | TEXT | No | UPI transaction reference |
| receipt_number | TEXT | Yes | Auto-generated |
| status | TEXT | Yes | pending / paid / waived |
| paid_at | TIMESTAMP | No | When payment was received |

## UPI Integration
**Library:** `upiqr` (MIT license)
**Format:** `upi://pay?pa={upi_id}&pn={doctor_name}&am={amount}&cu=INR&tn={note}`

## UI Components Required
1. `FeeScheduleSettings` - Configure fees
2. `PaymentForm` - Collect payment (cash/UPI/waive buttons)
3. `UPIQRCode` - Display QR with amount
4. `PaymentBadge` - Status indicator (PAID/PENDING/WAIVED)
5. `DailyCollectionCard` - Summary in dashboard

## Non-Functional Requirements
- Payment must be linked to patient
- Receipt numbers must be unique and sequential
- UPI QR must work with any UPI app (Google Pay, PhonePe, etc.)

[NEEDS CLARIFICATION]
- Does doctor have multiple UPI IDs or just one?
- Should we support partial payments?
