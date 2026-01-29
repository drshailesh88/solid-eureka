# EMR Prescriptions

## Overview
Prescription builder allows doctors to quickly create medication orders with Hindi instructions. Generates PDF for patient.

## Current State
- **Status:** 90% Built
- **Location:** `src/features/prescriptions/`
- **PDF:** Using @react-pdf/renderer

## Requirements

### Prescription Fields
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| encounter_id | UUID | FK to encounters |
| status | TEXT | draft/signed/sent |
| pdf_url | TEXT | Supabase storage URL |
| signed_at | TIMESTAMPTZ | When doctor signed |
| sent_via | TEXT | whatsapp/email/both |

### Prescription Item Fields
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| prescription_id | UUID | FK to prescriptions |
| brand | TEXT | Medicine brand name |
| salt | TEXT | Generic/salt name |
| dose | TEXT | 500mg, 10ml, etc. |
| frequency | TEXT | OD, BD, TDS, QID, SOS |
| pattern | TEXT | '101' = morning-night, '111' = morning-afternoon-night |
| duration | TEXT | 5 days, 2 weeks, 1 month |
| instructions | TEXT | English instructions |
| instructions_hindi | TEXT | Hindi instructions (auto-generated) |
| sort_order | INT | Display order |

### Features

#### Medicine Entry
- Autocomplete from drug database
- Quick frequency picker: OD, BD, TDS, QID, SOS
- Pattern picker with visual pills: ○●○ (morning-skip-night)
- Duration with unit: days/weeks/months
- Auto-generate Hindi instructions

#### Hindi Templates (Deterministic)
```
Pattern: 101 (morning-night)
→ "सुबह और रात को खाने के बाद"

Pattern: 111 (morning-afternoon-night)
→ "सुबह, दोपहर और रात को खाने के बाद"

Frequency: SOS
→ "जरूरत पड़ने पर"
```

#### PDF Generation
- Clinic header (logo, address, phone)
- Patient info (name, age, sex, UHID)
- Date and Rx number
- Medicines table with Hindi instructions
- Doctor signature
- Follow-up date
- QR code linking to digital copy

#### Signing & Sending
- Doctor clicks "Sign & Send"
- PDF generated and stored
- Status changes to 'signed'
- Options: Send via WhatsApp, Email, or Both

## Acceptance Criteria
- [ ] Can add multiple medicines to prescription
- [ ] Frequency/pattern picker works
- [ ] Hindi instructions auto-generate correctly
- [ ] PDF generates with all information
- [ ] PDF stored in Supabase storage
- [ ] Can send via email (WhatsApp is Phase 2)

## Database Schema
```sql
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encounter_id UUID REFERENCES encounters(id),
  status TEXT DEFAULT 'draft',
  pdf_url TEXT,
  signed_at TIMESTAMPTZ,
  sent_via TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE prescription_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id UUID REFERENCES prescriptions(id),
  brand TEXT NOT NULL,
  salt TEXT,
  dose TEXT,
  frequency TEXT,
  pattern TEXT,
  duration TEXT,
  instructions TEXT,
  instructions_hindi TEXT,
  sort_order INT DEFAULT 0
);
```

## UI Components
- `PrescriptionBuilder` - Main Rx form
- `MedicineRow` - Single medicine entry
- `FrequencyPicker` - OD/BD/TDS/QID/SOS buttons
- `PatternPicker` - Visual pill pattern selector
- `PrescriptionPDF` - @react-pdf/renderer document
- `PrescriptionPreview` - PDF preview before signing
