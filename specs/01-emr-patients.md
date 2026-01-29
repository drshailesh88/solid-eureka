# EMR Patients

## Overview
Patient management is the foundation of the EMR. Doctors need to create, search, view, and edit patient records.

## Current State
- **Status:** 90% Built
- **Location:** `src/features/patients/`

## Requirements

### Patient Fields (Required)
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Full name (required) |
| phone | TEXT | Mobile number (primary identifier for WhatsApp) |
| email | TEXT | Optional |
| age | INT | Age in years |
| sex | TEXT | Male/Female/Other |
| uhid | TEXT | Unique Hospital ID (auto-generated) |

### Patient Fields (To Add)
| Field | Type | Description | Priority |
|-------|------|-------------|----------|
| blood_group | TEXT | A+, B-, O+, etc. | MEDIUM |
| allergies | TEXT[] | **CRITICAL** - Drug allergies array | HIGH |
| chronic_conditions | TEXT[] | Diabetes, HTN, etc. | HIGH |
| emergency_contact | TEXT | Phone number | LOW |
| aadhaar_last4 | TEXT | Last 4 digits for identification | LOW |

### Features

#### Search Patient
- Search by name (partial match)
- Search by phone (exact match)
- Search by UHID (exact match)
- Results sorted by recent visits

#### Create Patient
- Minimal required fields: name, phone
- Auto-generate UHID: `P-{YEAR}-{SEQUENCE}`
- Validate phone format (10 digits, Indian)

#### View Patient
- Basic info at top
- **Allergy warning banner** (if allergies exist) - CRITICAL
- Chronic conditions badges
- Recent visits timeline
- Quick actions: New Visit, Send WhatsApp, View Documents

#### Edit Patient
- All fields editable
- Audit log of changes

## Acceptance Criteria
- [ ] Can create patient with minimal fields
- [ ] Can search patient by name/phone/UHID
- [ ] Allergies field exists and displays prominently
- [ ] Chronic conditions field exists
- [ ] UHID auto-generates correctly
- [ ] Patient list shows recent patients first

## Database Schema
```sql
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  age INT,
  sex TEXT,
  uhid TEXT UNIQUE,
  blood_group TEXT,
  allergies TEXT[],
  chronic_conditions TEXT[],
  emergency_contact TEXT,
  aadhaar_last4 TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policy
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own patients" ON patients
  FOR ALL USING (auth.uid() = user_id);
```

## UI Components
- `PatientList` - Table with search, pagination
- `PatientForm` - Create/Edit form
- `PatientCard` - Summary card with quick actions
- `AllergyBanner` - Red warning banner for allergies
