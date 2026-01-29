# Payments

## Overview
Doctors need to collect consultation fees. Support cash and UPI payments. Track daily collections.

## Current State
- **Status:** NOT BUILT
- **Priority:** HIGH

## Requirements

### Payment Fields
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| encounter_id | UUID | FK to encounters |
| patient_id | UUID | FK to patients |
| amount | DECIMAL | Payment amount |
| type | TEXT | consultation/procedure/medicine |
| method | TEXT | cash/upi/card/pending |
| upi_ref | TEXT | UPI transaction ID |
| receipt_number | TEXT | Auto-generated receipt number |
| status | TEXT | pending/paid/waived |
| paid_at | TIMESTAMPTZ | When payment received |

### Features

#### Fee Schedule
- Doctor sets consultation fees
- Different rates: new patient vs follow-up
- Procedure-specific fees

#### Collect Payment
- Show amount due on visit screen
- Quick buttons: Cash, UPI, Waive
- For UPI: Show QR code with amount
- Enter UPI reference number
- Auto-generate receipt

#### Daily Collection Report
- Total collected today
- Breakdown by method (cash/UPI)
- Pending payments list
- Export to CSV

### UPI Integration
```
UPI ID: doctor@upi
Amount: ₹500
Note: Consultation - Rajesh Kumar

Generate QR code with:
upi://pay?pa=doctor@upi&pn=Dr.XYZ&am=500&cu=INR&tn=Consultation
```

## Acceptance Criteria
- [ ] Can set consultation fees (fee schedule)
- [ ] Can record cash payment
- [ ] Can record UPI payment with reference
- [ ] Can waive payment
- [ ] Receipt number auto-generates
- [ ] Daily collection summary visible
- [ ] UPI QR code generates correctly

## Database Schema
```sql
CREATE TABLE fee_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  valid_from DATE DEFAULT CURRENT_DATE,
  valid_to DATE
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encounter_id UUID REFERENCES encounters(id),
  patient_id UUID REFERENCES patients(id),
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL,
  method TEXT,
  upi_ref TEXT,
  receipt_number TEXT,
  status TEXT DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## UI Components
- `PaymentForm` - Payment collection dialog
- `UPIQRCode` - QR code generator (react-qr-code)
- `PaymentBadge` - PAID/PENDING status badge
- `DailyCollectionCard` - Summary in header
- `FeeScheduleSettings` - Fee configuration
