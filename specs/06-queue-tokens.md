# Queue & Token System

## Overview
60% of patients are walk-ins (no appointment). Need a token system to manage the queue.

## Current State
- **Status:** NOT BUILT
- **Priority:** HIGH

## Requirements

### Queue Entry Fields
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| date | DATE | Today's date |
| patient_id | UUID | FK to patients |
| appointment_id | UUID | FK to appointments (null for walk-ins) |
| token_number | INT | Sequential token (1, 2, 3...) |
| type | TEXT | scheduled/walk_in |
| status | TEXT | waiting/in_progress/done/no_show |
| check_in_at | TIMESTAMPTZ | When patient checked in |
| called_at | TIMESTAMPTZ | When called to room |
| completed_at | TIMESTAMPTZ | When visit ended |

### Features

#### Add to Queue
- **Walk-in:** Select existing patient or create new → assign next token
- **Scheduled:** Patient arrives → check in → assign token

#### Queue Display
- Token number prominently displayed
- Patient name
- Type badge: SCHEDULED / WALK-IN
- Status badge: WAITING / IN ROOM / DONE
- Payment status: PAID / PENDING
- Vitals status: Recorded or not

#### Call Next Patient
- Doctor clicks "Call Next"
- Next waiting patient's status → in_progress
- Patient's token displayed on waiting room screen (future)

#### Queue Management
- Re-order queue (drag/drop or up/down arrows)
- Mark as no-show
- Move to end of queue

### Daily Reset
- Token numbers reset each day starting from 1
- Previous day's incomplete entries marked as no-show

## Acceptance Criteria
- [ ] Can add walk-in patient to queue
- [ ] Can check-in scheduled patient
- [ ] Token numbers auto-increment per day
- [ ] Queue shows in order
- [ ] Can call next patient
- [ ] Can mark patient as done/no-show
- [ ] Queue resets daily

## Database Schema
```sql
CREATE TABLE queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  patient_id UUID REFERENCES patients(id),
  appointment_id UUID REFERENCES appointments(id),
  token_number INT,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'waiting',
  check_in_at TIMESTAMPTZ,
  called_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(date, token_number)
);

-- Auto-increment token number per day
CREATE OR REPLACE FUNCTION get_next_token(queue_date DATE)
RETURNS INT AS $$
  SELECT COALESCE(MAX(token_number), 0) + 1
  FROM queue WHERE date = queue_date;
$$ LANGUAGE SQL;
```

## UI Components
- `QueuePanel` - Left sidebar showing today's queue
- `QueueItem` - Single patient in queue
- `AddWalkInButton` - Quick add walk-in
- `CheckInDialog` - Check in scheduled patient
- `CallNextButton` - Doctor calls next patient
- `QueueStats` - Today: X seen, Y waiting
