# Vitals Recording

## Overview
Vitals are recorded BEFORE doctor sees patient. Assistant/nurse records BP, pulse, temperature, weight, SpO2.

## Current State
- **Status:** Built
- **Location:** `src/features/visits/` (part of visits)

## Requirements

### Vitals Fields
| Field | Type | Description | Normal Range |
|-------|------|-------------|--------------|
| bp_systolic | INT | Systolic BP | 90-140 mmHg |
| bp_diastolic | INT | Diastolic BP | 60-90 mmHg |
| pulse | INT | Heart rate | 60-100 bpm |
| temperature | DECIMAL | Body temp | 97-99°F |
| weight | DECIMAL | Weight in kg | - |
| height | DECIMAL | Height in cm | - |
| spo2 | INT | Oxygen saturation | 95-100% |
| bmi | DECIMAL | Calculated from height/weight | 18.5-24.9 |
| recorded_by | TEXT | assistant/self/doctor | - |
| recorded_at | TIMESTAMPTZ | When recorded | - |

### Features

#### Record Vitals
- Quick entry form (all fields on one screen)
- Auto-calculate BMI from height/weight
- Highlight abnormal values in red
- Support for repeated readings (BP can be taken 2-3 times)

#### Display in Visit
- Show latest vitals prominently at top of visit screen
- Trend indicators: ↑ ↓ → compared to last visit
- Click to see vitals history chart

#### Vitals History
- Line chart of BP over time
- Weight tracking chart
- Useful for chronic disease monitoring (HTN, DM)

## Acceptance Criteria
- [ ] Can record all vital parameters
- [ ] BMI auto-calculates
- [ ] Abnormal values highlighted
- [ ] Vitals visible during visit consultation
- [ ] Vitals history accessible

## Database Schema
```sql
CREATE TABLE vitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encounter_id UUID REFERENCES encounters(id),
  patient_id UUID REFERENCES patients(id),
  bp_systolic INT,
  bp_diastolic INT,
  pulse INT,
  temperature DECIMAL(4,1),
  weight DECIMAL(5,1),
  height DECIMAL(5,1),
  spo2 INT,
  bmi DECIMAL(4,1),
  recorded_by TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);
```

## UI Components
- `VitalsForm` - Quick entry form
- `VitalsDisplay` - Compact display for visit screen
- `VitalsChart` - Recharts line chart for trends
- `AbnormalIndicator` - Red highlight for out-of-range values
