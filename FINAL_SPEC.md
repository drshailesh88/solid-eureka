# AI Clinical Coordinator - Final Specification
## Agentic Alternative to Practo/HealthPlix

---

## One-Line Summary

**A secretary that doctors and patients talk to via WhatsApp, Email, or App - powered by 220,000+ stars of proven open-source code.**

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                         MOLTBOT (Secretary Brain)                           │
│                              74,000 ⭐                                       │
│                                                                             │
│            Understands, remembers, drafts, reminds, coordinates             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
            ┌───────────────────────┼───────────────────────┐
            │                       │                       │
            ▼                       ▼                       ▼
     ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
     │  WhatsApp   │         │    Email    │         │   EMR App   │
     │  (Moltbot)  │         │ (AgentMail) │         │ (Kiranism+) │
     │             │         │             │         │             │
     │  • Patient  │         │  • Patient  │         │  • Doctor   │
     │  • Doctor   │         │  • Doctor   │         │    only     │
     └─────────────┘         └─────────────┘         └─────────────┘
            │                       │                       │
            └───────────────────────┼───────────────────────┘
                                    │
                                    ▼
                          ┌─────────────────┐
                          │    SUPABASE     │
                          │   (Database)    │
                          └─────────────────┘
```

---

## All Components (100% Proven)

### Core Infrastructure

| Component | Repo | Stars | What It Does |
|-----------|------|-------|--------------|
| **Secretary Brain** | [moltbot/moltbot](https://github.com/moltbot/moltbot) | 74,000 | Agent runtime, memory, cron, tool calling |
| **WhatsApp** | Moltbot built-in (Baileys) | - | Patient & doctor messaging |
| **Email** | [AgentMail](https://agentmail.to) | YC S25 | Send/receive emails for agent |
| **Database** | [Supabase](https://supabase.com) | 75,000 | Postgres + Auth + Storage + Realtime |

### UI Layer

| Component | Repo | Stars | What It Does |
|-----------|------|-------|--------------|
| **Dashboard Base** | [Kiranism/next-shadcn-dashboard-starter](https://github.com/Kiranism/next-shadcn-dashboard-starter) | 5,880 | Layout, sidebar, tables, auth (Clerk) |
| **Chat Panel** | [assistant-ui/assistant-ui](https://github.com/assistant-ui/assistant-ui) | 8,215 | Secretary chat interface |
| **Forms** | [react-hook-form](https://github.com/react-hook-form/react-hook-form) | 44,450 | Prescription form handling |

### Feature Components

| Component | Repo | Stars | What It Does |
|-----------|------|-------|--------------|
| **PDF Generation** | [diegomura/react-pdf](https://github.com/diegomura/react-pdf) | 16,341 | Create prescription PDFs |
| **File Upload** | [transloadit/uppy](https://github.com/transloadit/uppy) | 30,596 | Upload patient reports |
| **OCR** | [tesseract.js](https://github.com/naptha/tesseract.js) | 37,791 | Extract text from scans |
| **Timeline** | [react-chrono](https://github.com/prabhuignoto/react-chrono) | 4,161 | Patient visit history |

### Total: 220,000+ ⭐ of proven code

---

## Communication Channels

### 1. WhatsApp (Via Moltbot)

**For Patients:**
```
Patient: "Mujhe BP ki dawai chahiye"
Secretary: "Rajesh ji, aapka last prescription:
            Telmisartan 40mg - 14 din
            Kya same dawai chahiye?"
Patient: "Haan"
Secretary: "Doctor se approval leke bhejta hoon"
```

**For Doctors:**
```
Secretary: "3 pending approvals:
            1. Rajesh Kumar - Refill
            2. Shweta Singh - New Rx
            3. Abdul Khan - Follow-up"
Doctor: "Approve 1 and 3"
Secretary: "Done. Prescriptions sent."
```

**Capabilities:**
- Send/receive text
- Send PDFs (prescriptions)
- Send voice notes
- Receive images (reports)
- Receive voice (transcribe with Whisper)

### 2. Email (Via AgentMail)

**Setup:**
```
Agent email: secretary@yourclinic.agentmail.to
```

**Use Cases:**

| Use Case | Example |
|----------|---------|
| Send prescription | PDF attachment to patient |
| Daily digest to doctor | "5 pending, 3 overdue" |
| Appointment confirmation | Formal email with details |
| Receive patient queries | Forwarded to WhatsApp thread |

**Integration:**
```javascript
// AgentMail with Vercel AI SDK
import { AgentMail } from 'agentmail';

const mail = new AgentMail({ apiKey: process.env.AGENTMAIL_API_KEY });

// Send prescription
await mail.send({
  to: patient.email,
  subject: 'Your Prescription - Dr. XYZ',
  body: 'Please find attached...',
  attachments: [{ filename: 'prescription.pdf', content: pdfBuffer }]
});
```

### 3. EMR App (Web Interface)

**For Doctors at Desk:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  AI Clinical Coordinator                              Dr. XYZ    [Logout]   │
├─────────────────┬─────────────────────────────┬─────────────────────────────┤
│                 │                             │                             │
│  PATIENT QUEUE  │  PRESCRIPTION               │  SECRETARY                  │
│                 │                             │                             │
│  ┌───────────┐  │  Patient: Rajesh Kumar      │  ┌─────────────────────┐   │
│  │ 09:30     │  │  Age/Sex: 55/M              │  │ Secretary: Rajesh   │   │
│  │ Rajesh K  │  │  UHID: P-2024-001           │  │ sent BP readings.   │   │
│  │ Follow-up │  │                             │  │ 140/90 on 3 days.   │   │
│  │ [Arrived] │  │  ─────────────────────────  │  │                     │   │
│  ├───────────┤  │                             │  │ Suggesting:         │   │
│  │ 10:00     │  │  Rx:                        │  │ - Add Amlodipine    │   │
│  │ Shweta S  │  │  1. Telmisartan 40mg [OD▼]  │  │ - Review in 2 wks   │   │
│  │ New       │  │     [14 days▼]              │  │                     │   │
│  │ [Waiting] │  │     सुबह - 14 दिन            │  │ [Accept] [Edit]     │   │
│  ├───────────┤  │                             │  └─────────────────────┘   │
│  │ 10:30     │  │  2. [+ Add Medicine]        │                             │
│  │ Abdul K   │  │                             │  ┌─────────────────────┐   │
│  │ Post-PCI  │  │  ─────────────────────────  │  │                     │   │
│  │ [Done]    │  │                             │  │ Type a message...   │   │
│  └───────────┘  │  Follow-up: [14 days▼]      │  │                     │   │
│                 │  Advice: [Review BP log]    │  └─────────────────────┘   │
│  ───────────    │                             │                             │
│  DUE TODAY: 3   │  [Save Draft] [Sign & Send] │  PENDING: 2 approvals      │
│  OVERDUE: 2     │                             │                             │
│                 │                             │                             │
└─────────────────┴─────────────────────────────┴─────────────────────────────┘
```

---

## Database Schema (Supabase)

```sql
-- Patients
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  age INT,
  sex TEXT,
  uhid TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations (WhatsApp/Email threads)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel TEXT NOT NULL, -- 'whatsapp' | 'email'
  channel_id TEXT NOT NULL, -- phone or email
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link conversations to patients (families)
CREATE TABLE conversation_patients (
  conversation_id UUID REFERENCES conversations(id),
  patient_id UUID REFERENCES patients(id),
  is_primary BOOLEAN DEFAULT false,
  PRIMARY KEY (conversation_id, patient_id)
);

-- Appointments
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  date DATE NOT NULL,
  session TEXT, -- 'morning' | 'evening'
  status TEXT DEFAULT 'scheduled',
  source TEXT, -- 'whatsapp' | 'walk_in' | 'email'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Encounters (visits)
CREATE TABLE encounters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  appointment_id UUID REFERENCES appointments(id),
  chief_complaint TEXT,
  diagnosis TEXT,
  notes TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- Prescriptions
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encounter_id UUID REFERENCES encounters(id),
  status TEXT DEFAULT 'draft', -- 'draft' | 'signed' | 'sent'
  pdf_url TEXT,
  signed_at TIMESTAMPTZ,
  sent_via TEXT, -- 'whatsapp' | 'email' | 'both'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prescription items
CREATE TABLE prescription_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id UUID REFERENCES prescriptions(id),
  brand TEXT NOT NULL,
  salt TEXT,
  dose TEXT,
  frequency TEXT,
  pattern TEXT, -- '101' = morning-night
  duration TEXT,
  instructions TEXT,
  instructions_hindi TEXT,
  sort_order INT DEFAULT 0
);

-- Tasks (CRM/follow-ups)
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  type TEXT NOT NULL, -- 'follow_up' | 'lab_review' | 'call'
  due_date DATE NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Private doctor notes
CREATE TABLE private_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Message drafts (pending approval)
CREATE TABLE message_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  channel TEXT NOT NULL,
  content TEXT NOT NULL,
  purpose TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interaction log
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  channel TEXT NOT NULL,
  direction TEXT NOT NULL, -- 'inbound' | 'outbound'
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Secretary Tools (Moltbot)

### Read Tools (Safe)

```typescript
const readTools = {
  find_patient: {
    description: "Search patient by name or phone",
    parameters: { query: "string" },
    returns: "Patient[]"
  },

  get_patient_snapshot: {
    description: "Get patient summary, last visit, active meds",
    parameters: { patient_id: "uuid" },
    returns: "PatientSnapshot"
  },

  list_today_queue: {
    description: "Get today's appointments",
    parameters: { date: "date" },
    returns: "Appointment[]"
  },

  list_overdue_tasks: {
    description: "Get overdue follow-ups",
    parameters: {},
    returns: "Task[]"
  },

  get_previous_prescriptions: {
    description: "Get patient's past prescriptions",
    parameters: { patient_id: "uuid", limit: "number" },
    returns: "Prescription[]"
  }
};
```

### Write Tools (Admin - Auto-allowed)

```typescript
const adminWriteTools = {
  create_appointment: {
    description: "Book an appointment",
    parameters: {
      patient_id: "uuid",
      date: "date",
      session: "morning|evening",
      reason: "string"
    }
  },

  create_task: {
    description: "Create follow-up task",
    parameters: {
      patient_id: "uuid",
      due_date: "date",
      reason: "string",
      type: "follow_up|lab_review|call"
    }
  },

  log_interaction: {
    description: "Log a patient interaction",
    parameters: {
      patient_id: "uuid",
      channel: "whatsapp|email|call",
      direction: "inbound|outbound",
      content: "string"
    }
  },

  draft_message: {
    description: "Draft message for approval",
    parameters: {
      patient_id: "uuid",
      channel: "whatsapp|email",
      content: "string",
      purpose: "reminder|response|prescription"
    }
  }
};
```

### Write Tools (Clinical - Doctor Must Approve)

```typescript
const clinicalWriteTools = {
  create_prescription_draft: {
    description: "Draft prescription for doctor review",
    parameters: {
      encounter_id: "uuid",
      items: "PrescriptionItem[]",
      advice: "string"
    },
    returns: "PrescriptionDraft" // Doctor must sign
  },

  propose_followup: {
    description: "Suggest follow-up from conversation",
    parameters: {
      encounter_id: "uuid",
      due_date: "date",
      reason: "string"
    }
  }
};
```

### Forbidden (Do Not Exist)

```typescript
// These tools are NEVER created
const forbidden = [
  "sign_prescription",      // Doctor only
  "edit_signed_prescription", // Never
  "send_message",           // Only draft_message allowed
  "delete_patient",         // Never
  "exec",                   // No shell
  "browser_*",              // No browsing
];
```

---

## Hindi Templates (Deterministic)

```typescript
// Pattern to Hindi
const patterns: Record<string, string> = {
  '100': 'सुबह',
  '010': 'दोपहर',
  '001': 'रात',
  '110': 'सुबह-दोपहर',
  '101': 'सुबह-रात',
  '011': 'दोपहर-रात',
  '111': 'सुबह-दोपहर-रात'
};

// Frequency to Hindi
const frequency: Record<string, string> = {
  'once daily': 'दिन में एक बार',
  'twice daily': 'दिन में दो बार',
  'after meals': 'खाने के बाद',
  'before meals': 'खाने से पहले',
  'empty stomach': 'खाली पेट',
  'at bedtime': 'सोते समय'
};

// Duration to Hindi
const duration: Record<string, string> = {
  '3 days': '3 दिन',
  '5 days': '5 दिन',
  '7 days': '7 दिन',
  '14 days': '14 दिन',
  '1 month': '1 महीना'
};
```

---

## File Structure

```
clinic-coordinator/
├── moltbot/                          # Git submodule
│   └── (secretary brain)
│
├── ui/                               # Fork of Kiranism starter
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # 3-panel layout
│   │   │   └── api/
│   │   │       └── tools/            # Tool endpoints
│   │   │           ├── find-patient/route.ts
│   │   │           ├── create-appointment/route.ts
│   │   │           ├── draft-prescription/route.ts
│   │   │           └── ...
│   │   │
│   │   ├── components/
│   │   │   ├── queue-panel.tsx       # Uses Kiranism tables
│   │   │   ├── prescription-panel.tsx # react-hook-form + shadcn
│   │   │   ├── secretary-panel.tsx   # assistant-ui
│   │   │   └── prescription-pdf.tsx  # react-pdf template
│   │   │
│   │   ├── lib/
│   │   │   ├── hindi-templates.ts    # Pattern/freq/duration maps
│   │   │   ├── moltbot-client.ts     # WebSocket to Moltbot
│   │   │   └── supabase.ts           # DB client
│   │   │
│   │   └── features/
│   │       ├── patients/             # CRUD
│   │       ├── appointments/         # Queue management
│   │       └── prescriptions/        # Rx workflow
│   │
│   └── package.json
│
├── supabase/
│   └── migrations/
│       └── 001_initial.sql           # Schema above
│
├── config/
│   ├── moltbot.json                  # Tool allowlist
│   └── agentmail.json                # Email config
│
└── docker-compose.yml
```

---

## What You Write (~600 lines)

| File | Lines | Purpose |
|------|-------|---------|
| `dashboard/page.tsx` | ~50 | 3-panel layout |
| `queue-panel.tsx` | ~80 | Patient queue component |
| `prescription-panel.tsx` | ~150 | Prescription form |
| `prescription-pdf.tsx` | ~100 | PDF template |
| `secretary-panel.tsx` | ~30 | Embed assistant-ui |
| `hindi-templates.ts` | ~50 | Copy from Casefold |
| `api/tools/*.ts` | ~150 | Tool endpoints (6-8 files) |
| **TOTAL** | **~610** | |

---

## Deployment

```yaml
# docker-compose.yml
services:
  moltbot:
    image: moltbot/moltbot
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - AGENTMAIL_API_KEY=${AGENTMAIL_API_KEY}
    volumes:
      - ./config:/config
    ports:
      - "18789:18789"  # Gateway WebSocket

  ui:
    build: ./ui
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
    ports:
      - "3000:3000"
```

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Messages handled without doctor | 70%+ | Auto-resolved / Total |
| Follow-up compliance | +30% | Returned / Due |
| Time per prescription | -50% | Avg time with vs without |
| Doctor satisfaction | "Less mental load" | Subjective score |

---

## What Beats Practo/HealthPlix

| They Do | You Do |
|---------|--------|
| Doctor fills forms | Secretary drafts, doctor approves |
| Patient calls to book | Patient WhatsApps anytime |
| Manual follow-up | Automatic reminders |
| Dumb templates | Context-aware suggestions |
| Single channel | WhatsApp + Email + App |
| Works when used right | Works even when used badly |

---

## Timeline

| Week | Deliverable |
|------|-------------|
| 1 | Moltbot + WhatsApp working with medical tools |
| 2 | UI with 3 panels (Kiranism + assistant-ui) |
| 3 | Prescription flow end-to-end |
| 4 | Email (AgentMail) + testing in real clinic |

---

## Total Investment

| Item | Cost |
|------|------|
| Moltbot | Free (MIT) |
| Supabase | Free tier / $25/mo |
| Clerk | Free tier / $25/mo |
| AgentMail | Free tier / ~₹15/email |
| Anthropic API | ~$20/mo for Claude |
| **Total** | **~$50-70/mo** |

Compare to: Practo charges clinics ₹10,000-50,000/month

---

## Summary

**220,000+ stars of proven code, ~600 lines of glue, WhatsApp + Email + App.**

That's your agentic Practo killer.
