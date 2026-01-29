# Queue & Token System Specification

## User Story
As a clinic receptionist, I need to manage a queue of patients (60% walk-ins) using token numbers, so doctors can see patients in order and patients know their position.

## Acceptance Criteria
- [ ] Can add walk-in patient to queue (auto-assign token)
- [ ] Can check-in scheduled appointment (assign token)
- [ ] Token numbers auto-increment per day (reset daily)
- [ ] Queue displays in order with status badges
- [ ] Doctor can call next patient
- [ ] Can mark patient as done / no-show
- [ ] Can reorder queue if needed
- [ ] Previous day's incomplete entries marked as no-show

## Data Model

### Queue Entry
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| date | DATE | Yes | Queue date (for daily reset) |
| patient_id | UUID | Yes | FK to patients |
| appointment_id | UUID | No | FK to appointments (null for walk-ins) |
| token_number | INT | Yes | Sequential per day (1, 2, 3...) |
| type | TEXT | Yes | scheduled / walk_in |
| status | TEXT | Yes | waiting / in_progress / done / no_show |
| check_in_at | TIMESTAMP | No | When patient checked in |
| called_at | TIMESTAMP | No | When called to room |
| completed_at | TIMESTAMP | No | When visit ended |
| position | INT | No | For manual reordering |

### Constraints
- UNIQUE(date, token_number) - No duplicate tokens per day

## Token Number Logic
```sql
CREATE OR REPLACE FUNCTION get_next_token(queue_date DATE)
RETURNS INT AS $$
  SELECT COALESCE(MAX(token_number), 0) + 1
  FROM queue WHERE date = queue_date;
$$ LANGUAGE SQL;
```

## Queue States
```
WAITING → IN_PROGRESS → DONE
    ↓
  NO_SHOW
```

## UI Components Required
1. `QueuePanel` - Main queue view (sidebar or page)
2. `QueueItem` - Single entry with token, name, status
3. `AddWalkInDialog` - Add walk-in patient
4. `CheckInDialog` - Check-in scheduled patient
5. `CallNextButton` - Doctor calls next waiting
6. `QueueStats` - Today: X seen, Y waiting

## Display Requirements
- Token number: Large, prominent
- Patient name: Visible
- Status badge: WAITING (yellow) / IN ROOM (blue) / DONE (green) / NO SHOW (gray)
- Type badge: SCHEDULED / WALK-IN
- Payment status: PAID (green) / PENDING (red)
- Vitals status: Done (check) / Not done (empty)

## Real-Time Updates
Use Supabase real-time subscriptions to update queue across devices.

## Non-Functional Requirements
- Queue must update in real-time across receptionist and doctor screens
- Token assignment must be atomic (no race conditions)
- Daily reset must happen automatically

[NEEDS CLARIFICATION]
- Should there be a separate waiting room display screen?
- Should we announce token numbers via text-to-speech?
