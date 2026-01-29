# EMR Visits (Encounters)

## Overview
Visits record each patient consultation. Doctor documents chief complaint, findings, diagnosis, and plan.

## Current State
- **Status:** 90% Built
- **Location:** `src/features/visits/`

## Requirements

### Visit Fields
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| patient_id | UUID | FK to patients |
| appointment_id | UUID | FK to appointments (optional for walk-ins) |
| chief_complaint | TEXT | Why patient came (CC) |
| history_present_illness | TEXT | HPI details |
| examination_findings | TEXT | Physical examination |
| diagnosis | TEXT | Doctor's diagnosis |
| plan | TEXT | Treatment plan |
| notes | TEXT | Additional notes |
| started_at | TIMESTAMPTZ | When visit started |
| ended_at | TIMESTAMPTZ | When visit ended |

### Features

#### Start Visit
- Select patient (or create new)
- Auto-fill from previous visit (if follow-up)
- Show patient summary: allergies, chronic conditions, last vitals

#### Record Visit
- Structured fields for CC, HPI, Findings, Diagnosis, Plan
- Free-text notes area
- Voice dictation button (future)
- Hindi/English toggle for templates

#### End Visit
- Mark visit complete
- Trigger prescription creation (if needed)
- Auto-create follow-up task (if scheduled)

### Workflow
```
Patient Arrives → Check-in (Queue) → Vitals Recorded → Doctor Starts Visit
→ Documents CC/HPI/Findings → Makes Diagnosis → Creates Prescription
→ Ends Visit → Patient Leaves
```

## Acceptance Criteria
- [ ] Can start visit for existing patient
- [ ] Can start visit for new patient (inline creation)
- [ ] All clinical fields (CC, HPI, Findings, Diagnosis, Plan) work
- [ ] Previous visit data accessible during current visit
- [ ] Visit duration tracked (started_at → ended_at)

## Database Schema
```sql
CREATE TABLE encounters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) NOT NULL,
  appointment_id UUID REFERENCES appointments(id),
  chief_complaint TEXT,
  history_present_illness TEXT,
  examination_findings TEXT,
  diagnosis TEXT,
  plan TEXT,
  notes TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policy
ALTER TABLE encounters ENABLE ROW LEVEL SECURITY;
```

## UI Components
- `VisitForm` - Main consultation form
- `VisitSummary` - Read-only view of past visit
- `PatientHistory` - Accordion of previous visits
