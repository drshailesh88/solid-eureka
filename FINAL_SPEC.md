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

### NEW: Real-World Feature Components

| Component | Repo | Stars | What It Does |
|-----------|------|-------|--------------|
| **Payments** | [Razorpay Web SDK](https://razorpay.com/docs/) | - | UPI, Cards, Netbanking (India) |
| **Offline/PWA** | [Workbox](https://github.com/GoogleChrome/workbox) | 12,500 | Offline caching, background sync |
| **Voice Recording** | [RecordRTC](https://github.com/muaz-khan/RecordRTC) | 6,500 | Record audio in browser |
| **Voice Transcription** | Whisper (via Moltbot) | - | Speech-to-text for dictation |
| **Drug Database** | [OpenFDA API](https://open.fda.gov/) | Free API | Drug interactions, side effects |
| **Charts/Analytics** | [Recharts](https://github.com/recharts/recharts) | 24,000 | Revenue graphs, patient trends |
| **Print** | [react-to-print](https://github.com/gregnb/react-to-print) | 2,100 | Print prescriptions directly |
| **QR Code** | [react-qr-code](https://github.com/rosskhanas/react-qr-code) | 1,000 | UPI payment QR, prescription link |

### Total: 260,000+ ⭐ of proven code

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

**For Doctors at Desk - UPDATED with Vitals, Payments, Queue:**

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  AI Clinical Coordinator                    📅 28 Jan   💰 ₹4,200 today   Dr. XYZ  │
├────────────────────┬────────────────────────────────────┬───────────────────────────┤
│                    │                                    │                           │
│  TOKEN QUEUE       │  CURRENT PATIENT                   │  SECRETARY                │
│  ──────────────    │  ──────────────────                │  ─────────────────        │
│                    │                                    │                           │
│  #12 → IN NOW      │  Rajesh Kumar (55/M)               │  💬 Rajesh sent BP:       │
│  ┌──────────────┐  │  UHID: P-2024-001                  │  140/90, 138/88, 142/92   │
│  │ #12 Rajesh K │  │  ⚠️ Allergic: Sulfa               │  (last 3 days)            │
│  │ Follow-up    │  │  📋 HTN, DM-2                      │                           │
│  │ BP: 138/88   │  │                                    │  Suggesting:              │
│  │ ₹300 PAID ✓  │  │  ┌─ VITALS (just recorded) ─────┐ │  • Add Amlodipine 5mg     │
│  │ [IN ROOM]    │  │  │ BP: 138/88  Pulse: 78        │ │  • Review in 2 weeks      │
│  ├──────────────┤  │  │ SpO2: 98%   Wt: 72kg         │ │                           │
│  │ #13 Shweta S │  │  └──────────────────────────────┘ │  [Accept] [Modify]        │
│  │ New patient  │  │                                    │                           │
│  │ --/--        │  │  ┌─ PRESCRIPTION ───────────────┐ │  ─────────────────        │
│  │ ₹500 PENDING │  │  │ 1. Telmisartan 40mg  [OD▼]  │ │                           │
│  │ [WAITING]    │  │  │    सुबह - 14 दिन             │ │  📎 Pending:              │
│  ├──────────────┤  │  │                              │ │  • 2 Rx approvals         │
│  │ #14 Abdul K  │  │  │ 2. Metformin 500mg   [BD▼]  │ │  • 1 lab report           │
│  │ Post-PCI     │  │  │    सुबह-रात - 30 दिन         │ │  • 3 payment reminders    │
│  │ BP: 124/80   │  │  │                              │ │                           │
│  │ ₹300 PAID ✓  │  │  │ [+ Add Medicine]             │ │  ─────────────────        │
│  │ [WAITING]    │  │  └──────────────────────────────┘ │                           │
│  ├──────────────┤  │                                    │  🎤 [Voice Note]          │
│  │ #-- Walk-in  │  │  ┌─ LABS & ADVICE ──────────────┐ │                           │
│  │ [+ ADD]      │  │  │ Order: [ ] CBC  [ ] HbA1c   │ │  ┌───────────────────┐    │
│  └──────────────┘  │  │        [ ] Lipid [ ] KFT    │ │  │ Type message...   │    │
│                    │  │ Follow-up: [14 days▼]        │ │  └───────────────────┘    │
│  ──────────────    │  │ Advice: Control salt intake  │ │                           │
│  Today: 14 seen    │  └──────────────────────────────┘ │                           │
│  Waiting: 3        │                                    │                           │
│  ₹4,200 collected  │  [Save Draft]  [Sign & Send ₹300] │  [View Analytics]         │
│                    │                                    │                           │
└────────────────────┴────────────────────────────────────┴───────────────────────────┘
```

**Key UI Changes:**
- **Token numbers** instead of times (walk-ins don't have times)
- **Vitals visible** before prescription (BP/Pulse/SpO2/Weight)
- **Allergy warning** prominent (⚠️ Sulfa)
- **Payment status** on each patient (PAID ✓ / PENDING)
- **Daily collection** in header (₹4,200)
- **Walk-in button** at bottom of queue
- **Lab order checkboxes** for common tests
- **Voice note button** for dictation

---

## Missing Features Added (Real User Perspective)

### What Was Missing

| Feature | Why It's Critical |
|---------|-------------------|
| **Vitals** | BP/Pulse/Weight recorded BEFORE doctor sees patient |
| **Payments** | Doctor needs to get paid! Invoice, UPI, receipt |
| **Walk-ins** | 60% of patients don't book, they just show up |
| **Lab Orders** | "Get blood test done" is 30% of consultations |
| **Patient Documents** | Old reports, other doctor's prescriptions |
| **Allergies** | "Patient allergic to Penicillin" - CRITICAL |
| **Doctor Leave** | Block dates, auto-reply when unavailable |
| **Offline Mode** | Internet dies in tier-3 cities |
| **Voice Dictation** | Doctor speaks, AI types - 5x faster |
| **Analytics** | "How many patients this month?" |

---

## Database Schema (Supabase)

```sql
-- Patients (UPDATED with allergies)
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  age INT,
  sex TEXT,
  uhid TEXT UNIQUE,
  blood_group TEXT,
  allergies TEXT[],              -- CRITICAL: Drug allergies
  chronic_conditions TEXT[],     -- Diabetes, HTN, etc.
  emergency_contact TEXT,
  aadhaar_last4 TEXT,            -- For identification
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

-- VITALS (recorded before doctor sees patient)
CREATE TABLE vitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encounter_id UUID REFERENCES encounters(id),
  bp_systolic INT,
  bp_diastolic INT,
  pulse INT,
  temperature DECIMAL(4,1),      -- in Fahrenheit
  weight DECIMAL(5,1),           -- in kg
  spo2 INT,                      -- oxygen saturation %
  recorded_by TEXT,              -- 'assistant' | 'self' | 'doctor'
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- PAYMENTS (every consultation needs payment)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encounter_id UUID REFERENCES encounters(id),
  patient_id UUID REFERENCES patients(id),
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL,            -- 'consultation' | 'procedure' | 'medicine'
  method TEXT,                   -- 'cash' | 'upi' | 'card' | 'pending'
  upi_ref TEXT,                  -- UPI transaction ID
  receipt_number TEXT,
  status TEXT DEFAULT 'pending', -- 'pending' | 'paid' | 'waived'
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PATIENT DOCUMENTS (old reports, other prescriptions)
CREATE TABLE patient_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  type TEXT NOT NULL,            -- 'lab_report' | 'prescription' | 'scan' | 'discharge_summary' | 'insurance'
  title TEXT,
  file_url TEXT NOT NULL,        -- Supabase storage
  extracted_text TEXT,           -- OCR result from tesseract.js
  report_date DATE,              -- Date ON the document
  source TEXT,                   -- 'uploaded' | 'received_whatsapp' | 'lab_direct'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LAB ORDERS
CREATE TABLE lab_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encounter_id UUID REFERENCES encounters(id),
  patient_id UUID REFERENCES patients(id),
  tests TEXT[] NOT NULL,         -- ['CBC', 'LFT', 'Lipid Profile']
  lab_name TEXT,                 -- 'Lal PathLabs' | 'Thyrocare' | 'Local'
  status TEXT DEFAULT 'ordered', -- 'ordered' | 'collected' | 'reported'
  report_document_id UUID REFERENCES patient_documents(id),
  ordered_at TIMESTAMPTZ DEFAULT NOW(),
  reported_at TIMESTAMPTZ
);

-- DOCTOR AVAILABILITY (leave, blocked slots)
CREATE TABLE doctor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  session TEXT,                  -- NULL = full day, 'morning' | 'evening'
  status TEXT NOT NULL,          -- 'available' | 'leave' | 'limited'
  reason TEXT,                   -- 'vacation' | 'conference' | 'emergency'
  max_patients INT,              -- For 'limited' days
  auto_reply TEXT,               -- Custom message for patients
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- QUEUE (walk-ins + appointments, token system)
CREATE TABLE queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  patient_id UUID REFERENCES patients(id),
  appointment_id UUID REFERENCES appointments(id),  -- NULL for walk-ins
  token_number INT,
  type TEXT NOT NULL,            -- 'scheduled' | 'walk_in'
  status TEXT DEFAULT 'waiting', -- 'waiting' | 'in_progress' | 'done' | 'no_show'
  check_in_at TIMESTAMPTZ,
  called_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- VOICE NOTES (doctor dictation)
CREATE TABLE voice_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encounter_id UUID REFERENCES encounters(id),
  audio_url TEXT NOT NULL,       -- Supabase storage
  transcript TEXT,               -- Whisper transcription
  duration_seconds INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- REFERRALS
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encounter_id UUID REFERENCES encounters(id),
  patient_id UUID REFERENCES patients(id),
  to_doctor TEXT NOT NULL,       -- Name of specialist
  specialty TEXT,                -- 'Cardiologist' | 'Orthopedic' etc
  reason TEXT,
  letter_pdf_url TEXT,
  status TEXT DEFAULT 'referred', -- 'referred' | 'visited' | 'feedback_received'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONSULTATION FEES (doctor's rate card)
CREATE TABLE fee_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,            -- 'new_consultation' | 'follow_up' | 'procedure_X'
  amount DECIMAL(10,2) NOT NULL,
  valid_from DATE DEFAULT CURRENT_DATE,
  valid_to DATE
);

-- OFFLINE SYNC LOG (for tier-3 internet issues)
CREATE TABLE sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  operation TEXT NOT NULL,       -- 'insert' | 'update' | 'delete'
  data JSONB NOT NULL,
  synced BOOLEAN DEFAULT false,
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

### NEW: Vitals & Queue Tools

```typescript
const vitalsTools = {
  record_vitals: {
    description: "Record patient vitals before consultation",
    parameters: {
      encounter_id: "uuid",
      bp_systolic: "number",
      bp_diastolic: "number",
      pulse: "number",
      weight: "number",
      spo2: "number"
    }
  },

  get_vitals_trend: {
    description: "Get patient's vitals history (for BP monitoring)",
    parameters: { patient_id: "uuid", limit: "number" },
    returns: "Vitals[]"
  }
};

const queueTools = {
  add_walk_in: {
    description: "Add walk-in patient to today's queue",
    parameters: { patient_id: "uuid", reason: "string" },
    returns: "{ token_number: number, wait_estimate: string }"
  },

  get_queue_status: {
    description: "Get current queue with wait times",
    parameters: { date: "date" },
    returns: "QueueEntry[]"
  },

  call_next_patient: {
    description: "Mark next patient as in_progress",
    parameters: {},
    returns: "QueueEntry"
  },

  mark_patient_done: {
    description: "Mark current patient as completed",
    parameters: { queue_id: "uuid" }
  }
};
```

### NEW: Payment Tools

```typescript
const paymentTools = {
  record_payment: {
    description: "Record payment for consultation",
    parameters: {
      encounter_id: "uuid",
      amount: "number",
      method: "cash|upi|card",
      upi_ref: "string?"
    },
    returns: "{ receipt_number: string }"
  },

  get_pending_payments: {
    description: "List patients with unpaid consultations",
    parameters: { date_range: "string" },
    returns: "Payment[]"
  },

  get_daily_collection: {
    description: "Today's collection summary",
    parameters: { date: "date" },
    returns: "{ total: number, cash: number, upi: number, pending: number }"
  },

  send_payment_reminder: {
    description: "Draft payment reminder to patient",
    parameters: { patient_id: "uuid", amount: "number" }
  }
};
```

### NEW: Lab & Document Tools

```typescript
const labTools = {
  order_lab_tests: {
    description: "Create lab order for patient",
    parameters: {
      encounter_id: "uuid",
      tests: "string[]",
      lab_name: "string?"
    }
  },

  attach_lab_report: {
    description: "Link uploaded report to lab order",
    parameters: {
      lab_order_id: "uuid",
      document_id: "uuid"
    }
  },

  get_pending_lab_results: {
    description: "List ordered but unreported labs",
    parameters: {},
    returns: "LabOrder[]"
  }
};

const documentTools = {
  save_patient_document: {
    description: "Save uploaded document to patient record",
    parameters: {
      patient_id: "uuid",
      type: "lab_report|prescription|scan|insurance",
      file_url: "string",
      title: "string"
    }
  },

  ocr_document: {
    description: "Extract text from document image",
    parameters: { document_id: "uuid" },
    returns: "{ text: string }"
  },

  get_patient_documents: {
    description: "List all documents for patient",
    parameters: { patient_id: "uuid", type: "string?" },
    returns: "Document[]"
  }
};
```

### NEW: Availability Tools

```typescript
const availabilityTools = {
  block_date: {
    description: "Block date for leave/conference",
    parameters: {
      date: "date",
      session: "morning|evening|full_day",
      reason: "string",
      auto_reply: "string?"
    }
  },

  get_availability: {
    description: "Check if date is available for appointments",
    parameters: { date: "date" },
    returns: "AvailabilityStatus"
  },

  set_max_patients: {
    description: "Limit patients for a specific day",
    parameters: { date: "date", max: "number", reason: "string" }
  }
};
```

### NEW: Voice & Analytics Tools

```typescript
const voiceTools = {
  transcribe_voice: {
    description: "Transcribe doctor's voice note",
    parameters: { audio_url: "string" },
    returns: "{ transcript: string }"
    // Uses Whisper via Moltbot
  },

  save_voice_note: {
    description: "Save voice note with transcript to encounter",
    parameters: {
      encounter_id: "uuid",
      audio_url: "string",
      transcript: "string"
    }
  }
};

const analyticsTools = {
  get_patient_count: {
    description: "Patient count by period",
    parameters: { period: "day|week|month" },
    returns: "{ total: number, new: number, follow_up: number }"
  },

  get_revenue_summary: {
    description: "Revenue summary by period",
    parameters: { period: "day|week|month" },
    returns: "{ total: number, collected: number, pending: number }"
  },

  get_common_diagnoses: {
    description: "Top diagnoses in period",
    parameters: { period: "month", limit: "number" },
    returns: "{ diagnosis: string, count: number }[]"
  },

  get_followup_compliance: {
    description: "% of patients who came for follow-up",
    parameters: { period: "month" },
    returns: "{ due: number, returned: number, rate: number }"
  }
};
```

### NEW: Allergy Check (Safety Critical)

```typescript
const safetyTools = {
  check_drug_allergy: {
    description: "Check if patient is allergic to drug",
    parameters: { patient_id: "uuid", drug_name: "string" },
    returns: "{ allergic: boolean, allergy: string? }"
    // MUST be called before create_prescription_draft
  },

  add_allergy: {
    description: "Add allergy to patient record",
    parameters: { patient_id: "uuid", allergy: "string" }
  },

  get_drug_interactions: {
    description: "Check for dangerous drug combinations",
    parameters: { drugs: "string[]" },
    returns: "{ interactions: DrugInteraction[] }"
    // Uses open drug interaction database
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
  "modify_payment_history", // Audit trail required
  "delete_encounter",       // Medical records are permanent
];
```

---

## Offline Mode (Critical for Tier-3)

**Problem:** Internet drops in tier-3 cities. Doctor is mid-consultation. App must not freeze.

**Solution: PWA with Workbox + Local-first architecture**

```typescript
// Service worker strategy
const strategies = {
  // Static assets: Cache first
  '/static/*': 'CacheFirst',

  // API reads: Network first, fallback to cache
  '/api/patients/*': 'NetworkFirst',
  '/api/queue/*': 'NetworkFirst',

  // API writes: Background sync
  '/api/prescriptions': 'BackgroundSync',
  '/api/vitals': 'BackgroundSync',
  '/api/payments': 'BackgroundSync'
};
```

**What works offline:**
- ✅ View today's queue (cached)
- ✅ View patient records (cached on access)
- ✅ Write prescription (queued)
- ✅ Record vitals (queued)
- ✅ Record payment (queued)
- ✅ Generate PDF (client-side)
- ❌ Send WhatsApp (requires online)
- ❌ Secretary chat (requires Moltbot)

**Sync indicator in UI:**
```
┌──────────────────────────────────┐
│ 🟢 Online                        │  ← Green = synced
│ 🟡 3 pending changes...          │  ← Yellow = queued
│ 🔴 Offline - changes will sync   │  ← Red = no internet
└──────────────────────────────────┘
```

---

## Payment Flow (Razorpay UPI)

**India Reality:** 80% patients pay via UPI (PhonePe/GPay). Cash is declining.

### Payment Options

```
┌─────────────────────────────────────────────┐
│  COLLECT PAYMENT                            │
│  ────────────────                           │
│  Consultation Fee: ₹500                     │
│                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │   UPI   │  │  CASH   │  │  LATER  │     │
│  │  (QR)   │  │         │  │         │     │
│  └─────────┘  └─────────┘  └─────────┘     │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │          [QR CODE HERE]             │   │
│  │                                     │   │
│  │   Scan with any UPI app             │   │
│  │   clinic@razorpay                   │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  UPI Ref: ____________  [Confirm Payment]  │
│                                             │
└─────────────────────────────────────────────┘
```

### Secretary handles payment reminders:
```
Secretary → Patient (WhatsApp):
"Rajesh ji, aapka ₹500 consultation fee pending hai.
Pay karne ke liye yeh link use karein:
https://rzp.io/l/DrXYZ

Ya clinic mein cash de sakte hain."
```

### Revenue Dashboard:
```
┌─────────────────────────────────────────────┐
│  REVENUE - January 2025                     │
│  ────────────────────                       │
│                                             │
│  Total:     ₹1,24,500                       │
│  ├── UPI:   ₹89,200 (72%)                   │
│  ├── Cash:  ₹31,800 (25%)                   │
│  └── Pending: ₹3,500 (3%)                   │
│                                             │
│  Patients:  312  |  Avg: ₹399/visit         │
│                                             │
│  [Download Report]  [Send Reminders]        │
└─────────────────────────────────────────────┘
```

---

## Patient Notifications (Auto by Secretary)

| Event | Channel | Message |
|-------|---------|---------|
| Appointment booked | WhatsApp | "Aapka appointment 28 Jan 10:00 AM ko confirmed hai" |
| Reminder (1 day before) | WhatsApp | "Kal aapka appointment hai Dr. XYZ ke saath" |
| Queue position | WhatsApp | "Aapka token #14 hai. Approx 30 min wait" |
| Prescription ready | WhatsApp + Email | PDF attached |
| Payment reminder | WhatsApp | Link to pay |
| Lab report received | WhatsApp | "Aapki report aa gayi hai. Doctor review karenge" |
| Follow-up due | WhatsApp | "Aapka follow-up due hai. Book karein?" |
| Doctor on leave | WhatsApp | "Dr. XYZ 1-5 Feb ko available nahi hai" |

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

## File Structure (Updated)

```
clinic-coordinator/
├── moltbot/                          # Git submodule
│   └── (secretary brain)
│
├── ui/                               # Fork of Kiranism starter
│   ├── public/
│   │   ├── manifest.json             # PWA manifest
│   │   └── sw.js                     # Service worker (Workbox)
│   │
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # 3-panel layout
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx          # Revenue + patient charts
│   │   │   ├── settings/
│   │   │   │   ├── fees/page.tsx     # Fee schedule
│   │   │   │   └── availability/page.tsx  # Leave management
│   │   │   └── api/
│   │   │       └── tools/            # Tool endpoints
│   │   │           ├── find-patient/route.ts
│   │   │           ├── create-appointment/route.ts
│   │   │           ├── record-vitals/route.ts
│   │   │           ├── record-payment/route.ts
│   │   │           ├── order-labs/route.ts
│   │   │           ├── check-allergy/route.ts
│   │   │           └── ...
│   │   │
│   │   ├── components/
│   │   │   ├── queue-panel.tsx       # Token queue with walk-ins
│   │   │   ├── vitals-form.tsx       # BP/Pulse/SpO2/Weight
│   │   │   ├── prescription-panel.tsx # react-hook-form + shadcn
│   │   │   ├── secretary-panel.tsx   # assistant-ui
│   │   │   ├── prescription-pdf.tsx  # react-pdf template
│   │   │   ├── payment-modal.tsx     # UPI QR + cash
│   │   │   ├── lab-order-panel.tsx   # Test selection
│   │   │   ├── document-upload.tsx   # Uppy + OCR
│   │   │   ├── voice-recorder.tsx    # RecordRTC + Whisper
│   │   │   ├── allergy-badge.tsx     # Warning display
│   │   │   ├── sync-indicator.tsx    # Online/offline status
│   │   │   └── analytics-charts.tsx  # Recharts graphs
│   │   │
│   │   ├── lib/
│   │   │   ├── hindi-templates.ts    # Pattern/freq/duration maps
│   │   │   ├── moltbot-client.ts     # WebSocket to Moltbot
│   │   │   ├── supabase.ts           # DB client
│   │   │   ├── razorpay.ts           # Payment integration
│   │   │   ├── offline-sync.ts       # Background sync logic
│   │   │   └── drug-interactions.ts  # OpenFDA API wrapper
│   │   │
│   │   └── features/
│   │       ├── patients/             # CRUD + allergies
│   │       ├── queue/                # Token + walk-in management
│   │       ├── vitals/               # Recording + trends
│   │       ├── prescriptions/        # Rx workflow
│   │       ├── payments/             # Collection + receipts
│   │       ├── labs/                 # Orders + reports
│   │       ├── documents/            # Upload + OCR
│   │       └── analytics/            # Charts + export
│   │
│   └── package.json
│
├── supabase/
│   └── migrations/
│       ├── 001_initial.sql           # Core schema
│       ├── 002_vitals_payments.sql   # Vitals + payments
│       └── 003_labs_documents.sql    # Labs + documents
│
├── config/
│   ├── moltbot.json                  # Tool allowlist
│   ├── agentmail.json                # Email config
│   └── razorpay.json                 # Payment config
│
└── docker-compose.yml
```

---

## What You Write (~1200 lines)

| File | Lines | Purpose |
|------|-------|---------|
| `dashboard/page.tsx` | ~50 | 3-panel layout |
| `queue-panel.tsx` | ~100 | Token queue with walk-ins |
| `vitals-form.tsx` | ~80 | BP/Pulse/SpO2 entry |
| `prescription-panel.tsx` | ~150 | Prescription form |
| `prescription-pdf.tsx` | ~100 | PDF template |
| `secretary-panel.tsx` | ~30 | Embed assistant-ui |
| `payment-modal.tsx` | ~100 | UPI QR + cash flow |
| `lab-order-panel.tsx` | ~80 | Test selection |
| `voice-recorder.tsx` | ~60 | Record + transcribe |
| `allergy-badge.tsx` | ~30 | Warning component |
| `sync-indicator.tsx` | ~40 | Offline status |
| `analytics-charts.tsx` | ~100 | Recharts graphs |
| `hindi-templates.ts` | ~50 | Pattern/freq maps |
| `offline-sync.ts` | ~80 | Background sync |
| `api/tools/*.ts` | ~200 | Tool endpoints (15+ files) |
| **TOTAL** | **~1,250** | Still tiny vs building from scratch |

**Note:** 1,250 lines of glue code vs 50,000+ lines if built from scratch.

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

## Success Metrics (Updated)

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Messages handled without doctor | 70%+ | Auto-resolved / Total |
| Follow-up compliance | +30% | Returned / Due |
| Time per prescription | -50% | Avg time with vs without |
| Payment collection rate | 95%+ | Collected / Billed |
| Walk-in wait time | Show estimate | Patient satisfaction |
| Offline resilience | 100% | Works when internet drops |
| Lab report turnaround | <24hr | Order to attachment |
| Doctor satisfaction | "Less mental load" | Subjective score |

### Real Clinic KPIs

```
Before (Manual):
- 40 patients/day
- 3 staff (receptionist, nurse, billing)
- 20% follow-up compliance
- ₹15,000/month pending payments
- Doctor works 10 hours

After (AI Coordinator):
- 50 patients/day (25% more)
- 1 staff (nurse for vitals)
- 60% follow-up compliance
- ₹3,000/month pending payments
- Doctor works 8 hours
```

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

## Timeline (Updated)

| Week | Deliverable |
|------|-------------|
| 1 | Moltbot + WhatsApp with core tools (patient lookup, appointments) |
| 2 | UI foundation: Queue panel + Prescription panel + Secretary chat |
| 3 | Vitals recording + Payment collection (UPI/Cash) |
| 4 | Prescription flow: Form → PDF → WhatsApp/Email delivery |
| 5 | Labs: Order → Upload → OCR → Attach to patient |
| 6 | Offline mode (PWA) + Voice dictation |
| 7 | Analytics dashboard + Doctor availability/leave |
| 8 | Real clinic testing + bug fixes |

**MVP (Week 4):** Doctor can see queue, write prescription, collect payment, send via WhatsApp.
**Full (Week 8):** Everything works, even when internet dies.

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

## Data Privacy & Compliance (India + HIPAA-equivalent)

### Applicable Laws in India

| Law | What It Covers |
|-----|----------------|
| **DPDP Act 2023** | Digital Personal Data Protection (India's GDPR) |
| **IT Act 2000** | Electronic records, cyber security |
| **IMC Regulations** | Medical records retention (3 years minimum) |
| **Telemedicine Guidelines 2020** | Remote consultation requirements |

### Technical Implementation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SECURITY LAYERS                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. ENCRYPTION                                                              │
│     ├── At Rest: Supabase default (AES-256)                                │
│     ├── In Transit: HTTPS/TLS 1.3 everywhere                               │
│     └── WhatsApp: End-to-end (Baileys uses Signal protocol)                │
│                                                                             │
│  2. ACCESS CONTROL (Supabase RLS)                                          │
│     ├── Doctor sees: Only their clinic's patients                          │
│     ├── Patient sees: Only their own records (future patient portal)       │
│     └── Secretary: Read-only patient data, write to drafts only            │
│                                                                             │
│  3. AUDIT LOG (Every access recorded)                                      │
│     ├── Who accessed what record                                           │
│     ├── When (timestamp)                                                   │
│     ├── From where (IP, device)                                            │
│     └── What action (view, edit, download, share)                          │
│                                                                             │
│  4. CONSENT COLLECTION                                                     │
│     ├── First WhatsApp message: "Do you consent to..."                     │
│     ├── App registration: Checkbox with policy link                        │
│     └── Stored in patients.consent_given_at                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Database Additions for Compliance

```sql
-- Consent tracking
ALTER TABLE patients ADD COLUMN consent_given_at TIMESTAMPTZ;
ALTER TABLE patients ADD COLUMN consent_version TEXT;  -- 'v1.0', 'v1.1' etc

-- Audit log (CRITICAL - never delete)
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,           -- Doctor or staff
  user_type TEXT NOT NULL,         -- 'doctor' | 'staff' | 'system'
  action TEXT NOT NULL,            -- 'view' | 'edit' | 'download' | 'share' | 'delete'
  resource_type TEXT NOT NULL,     -- 'patient' | 'prescription' | 'document' | 'payment'
  resource_id UUID NOT NULL,
  patient_id UUID,                 -- Which patient's data
  ip_address INET,
  user_agent TEXT,
  details JSONB,                   -- Extra context
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for compliance queries
CREATE INDEX idx_audit_patient ON audit_log(patient_id, created_at);
CREATE INDEX idx_audit_user ON audit_log(user_id, created_at);

-- Data deletion requests (Right to Erasure)
CREATE TABLE deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  reason TEXT,
  status TEXT DEFAULT 'pending',   -- 'pending' | 'approved' | 'rejected' | 'completed'
  processed_at TIMESTAMPTZ,
  processed_by UUID,
  notes TEXT                       -- Why rejected (medical records exception)
);
```

### WhatsApp Message Safety

```typescript
// ❌ WRONG: PHI in message
"Rajesh ji, aapki diabetes ki dawai Metformin 500mg ready hai"

// ✅ RIGHT: Link to secure portal
"Rajesh ji, aapka prescription ready hai.
Dekhne ke liye: https://clinic.app/rx/abc123
(Link 24 ghante mein expire hoga)"

// Prescription PDF is behind authenticated link
// Patient must verify OTP to view
```

### Data Retention Policy

| Data Type | Retention | Reason |
|-----------|-----------|--------|
| Medical records | 3 years minimum | IMC requirement |
| Prescriptions | 3 years | Legal requirement |
| Audit logs | 7 years | Compliance |
| WhatsApp messages | 1 year | Storage optimization |
| Voice notes | 1 year | Storage optimization |
| Deleted patient data | Anonymized, kept | Research/analytics |

### Compliance Checklist

- [ ] HTTPS everywhere (Vercel/Supabase default)
- [ ] RLS policies on all patient tables
- [ ] Audit log on every data access
- [ ] Consent collection before storing data
- [ ] OTP verification for prescription links
- [ ] No PHI in plain WhatsApp messages
- [ ] Data export for patient (Right to Access)
- [ ] Deletion request workflow
- [ ] Staff access tied to clinic, not global
- [ ] Session timeout (30 min inactive)
- [ ] 2FA for doctor login (Clerk supports)

---

## Manual Record Browsing (Full EMR View)

### The Problem

The 3-panel AI workflow is great for consultations. But sometimes:
- Doctor wants to see patient's complete history
- Doctor wants to browse all lab reports
- Doctor wants to compare old prescriptions
- Doctor wants to read previous notes
- Doctor is researching before a complex case

**Solution: Add a "Patient Detail" page - classic EMR view**

### Patient Detail Page (New)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  ← Back to Queue                                     🔍 Search patients             │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  RAJESH KUMAR                                                          [Edit Info] │
│  ─────────────────────────────────────────────────────────────────────────────────  │
│  UHID: P-2024-001  |  Age: 55  |  Sex: M  |  Phone: +91 98765 43210               │
│  ⚠️ Allergies: Sulfa, Penicillin  |  📋 Conditions: HTN, DM-2, Hypothyroid        │
│                                                                                     │
├────────────────┬────────────────────────────────────────────────────────────────────┤
│                │                                                                    │
│  QUICK STATS   │  [Timeline]  [Prescriptions]  [Labs]  [Documents]  [Vitals]       │
│  ────────────  │  ─────────────────────────────────────────────────────────────     │
│                │                                                                    │
│  Total Visits  │  TIMELINE VIEW (react-chrono)                                     │
│  23            │  ┌──────────────────────────────────────────────────────────┐     │
│                │  │                                                          │     │
│  Last Visit    │  │  ● 28 Jan 2025 - Follow-up                              │     │
│  28 Jan 2025   │  │    Chief: BP monitoring                                 │     │
│                │  │    Dx: Uncontrolled HTN                                 │     │
│  Next Due      │  │    Rx: Added Amlodipine 5mg                             │     │
│  11 Feb 2025   │  │    [View Prescription] [View Vitals]                    │     │
│                │  │                                                          │     │
│  Outstanding   │  │  ● 14 Jan 2025 - Follow-up                              │     │
│  ₹0            │  │    Chief: Routine checkup                               │     │
│                │  │    Dx: HTN controlled, DM controlled                    │     │
│  ────────────  │  │    Rx: Continue same                                    │     │
│                │  │    Labs: HbA1c - 6.8%                                   │     │
│  VITALS TREND  │  │    [View Prescription] [View Lab Report]                │     │
│  ────────────  │  │                                                          │     │
│  BP (last 5)   │  │  ● 01 Dec 2024 - New consultation                       │     │
│  140/90        │  │    Chief: Headache, fatigue                             │     │
│  138/88        │  │    Dx: Newly diagnosed HTN                              │     │
│  142/92        │  │    Rx: Telmisartan 40mg started                         │     │
│  136/86        │  │    Labs: CBC, LFT, KFT, Lipid - all ordered             │     │
│  134/84 ↓      │  │                                                          │     │
│                │  │  ● 15 Nov 2024 - Walk-in                                │     │
│  Weight        │  │    Chief: Fever, cough                                  │     │
│  72 → 71 kg    │  │    Dx: Viral URTI                                       │     │
│                │  │    Rx: Symptomatic treatment                            │     │
│                │  │                                                          │     │
│                │  └──────────────────────────────────────────────────────────┘     │
│                │                                                                    │
│  ────────────  │  ─────────────────────────────────────────────────────────────     │
│  [+ New Visit] │  Showing 4 of 23 visits  [Load More]  [Export PDF]                │
│                │                                                                    │
└────────────────┴────────────────────────────────────────────────────────────────────┘
```

### Tab Views

**1. Timeline (default)** - Chronological visit history with react-chrono

**2. Prescriptions Tab**
```
┌────────────────────────────────────────────────────────────────────────────────────┐
│  PRESCRIPTIONS (23 total)                                    [Filter] [Export All] │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │ 28 Jan 2025                                                    [View PDF]   │  │
│  │ Telmisartan 40mg OD, Amlodipine 5mg OD, Metformin 500mg BD               │  │
│  │ Follow-up: 14 days                                                         │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │ 14 Jan 2025                                                    [View PDF]   │  │
│  │ Telmisartan 40mg OD, Metformin 500mg BD                                   │  │
│  │ Follow-up: 14 days                                                         │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │ 01 Dec 2024                                                    [View PDF]   │  │
│  │ Telmisartan 40mg OD, Metformin 500mg BD                                   │  │
│  │ Follow-up: 14 days  |  Labs ordered: CBC, LFT, KFT, Lipid                 │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

**3. Labs Tab**
```
┌────────────────────────────────────────────────────────────────────────────────────┐
│  LAB REPORTS (8 total)                                   [Filter by Test] [Trends] │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐                 │
│  │ 20 Jan 2025 - HbA1c                            [View Report] │                 │
│  │ Result: 6.8% (Good control)                                  │                 │
│  │ Lab: Lal PathLabs                                            │                 │
│  └──────────────────────────────────────────────────────────────┘                 │
│                                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐                 │
│  │ 05 Dec 2024 - Lipid Profile                    [View Report] │                 │
│  │ Total Cholesterol: 210  |  LDL: 140  |  HDL: 45              │                 │
│  │ Lab: Thyrocare                                               │                 │
│  └──────────────────────────────────────────────────────────────┘                 │
│                                                                                    │
│  HbA1c TREND:  8.2 → 7.5 → 6.8  📉 (Improving)                                    │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

**4. Documents Tab**
```
┌────────────────────────────────────────────────────────────────────────────────────┐
│  DOCUMENTS (12 total)                              [Upload New] [Filter by Type]   │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  📄 Lab Reports (8)    📋 Old Prescriptions (2)    🏥 Discharge (1)   📎 Other (1) │
│                                                                                    │
│  ┌────────────────────────────────────────────────────────────────────────────┐   │
│  │ 📄 HbA1c_Report_Jan2025.pdf                    20 Jan 2025   [View] [OCR]  │   │
│  │ 📄 Lipid_Profile_Dec2024.pdf                   05 Dec 2024   [View] [OCR]  │   │
│  │ 📋 Previous_Doctor_Prescription.jpg            15 Nov 2024   [View] [OCR]  │   │
│  │ 🏥 Discharge_Summary_Apollo.pdf                10 Oct 2024   [View] [OCR]  │   │
│  │ 📎 Insurance_Card.jpg                          01 Jan 2024   [View]        │   │
│  └────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                    │
│  ┌─ DROP FILES HERE ────────────────────────────────────────────────────────┐     │
│  │                         Drag & drop or click to upload                    │     │
│  │                         (PDF, JPG, PNG up to 10MB)                        │     │
│  └───────────────────────────────────────────────────────────────────────────┘     │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

**5. Vitals Tab**
```
┌────────────────────────────────────────────────────────────────────────────────────┐
│  VITALS HISTORY                                               [Last 30 days ▼]     │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  BLOOD PRESSURE TREND (Recharts graph)                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐   │
│  │    150 ┤                                                                   │   │
│  │    140 ┤  ●──●                                                             │   │
│  │    130 ┤       ╲●──●──●                                                    │   │
│  │    120 ┤              ╲●──●                                                │   │
│  │    110 ┤                                                                   │   │
│  │        └────────────────────────────────────────────────────────────────   │   │
│  │         Dec    Jan 1    Jan 14    Jan 21    Jan 28                         │   │
│  └────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                    │
│  WEIGHT TREND                                                                      │
│  ┌────────────────────────────────────────────────────────────────────────────┐   │
│  │    74 ┤  ●                                                                 │   │
│  │    73 ┤   ╲●                                                               │   │
│  │    72 ┤     ╲●──●                                                          │   │
│  │    71 ┤          ╲●                                                        │   │
│  │        └────────────────────────────────────────────────────────────────   │   │
│  └────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                    │
│  TABLE VIEW:                                                                       │
│  | Date       | BP      | Pulse | SpO2 | Weight | Recorded By |                  │
│  |------------|---------|-------|------|--------|-------------|                  │
│  | 28 Jan     | 138/88  | 78    | 98%  | 71 kg  | Nurse       |                  │
│  | 14 Jan     | 136/86  | 76    | 99%  | 72 kg  | Nurse       |                  │
│  | 01 Dec     | 142/92  | 82    | 97%  | 73 kg  | Self        |                  │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### Navigation Between Views

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  SIDEBAR                                                                       │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  📋 Dashboard (3-panel AI view)     ← For active consultations                │
│                                                                                │
│  👥 Patients                         ← Search, browse all patients            │
│     └─ Patient Detail               ← Full EMR view (Timeline, Labs, etc)    │
│                                                                                │
│  📊 Analytics                        ← Revenue, patient counts                │
│                                                                                │
│  ⚙️ Settings                                                                   │
│     ├─ Fees                                                                   │
│     ├─ Availability                                                           │
│     └─ Profile                                                                │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

### Search Patients Page

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│  PATIENTS                                                        [+ New Patient]   │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  🔍 [Search by name, phone, UHID...]                      [Filter ▼] [Sort ▼]      │
│                                                                                    │
│  ┌────────────────────────────────────────────────────────────────────────────┐   │
│  │ Rajesh Kumar         55/M    +91 98765 43210    Last: 28 Jan    [View →]   │   │
│  │ HTN, DM-2            P-2024-001                  Next: 11 Feb              │   │
│  ├────────────────────────────────────────────────────────────────────────────┤   │
│  │ Shweta Singh         32/F    +91 87654 32109    Last: 28 Jan    [View →]   │   │
│  │ New patient          P-2025-042                  Next: --                  │   │
│  ├────────────────────────────────────────────────────────────────────────────┤   │
│  │ Abdul Khan           48/M    +91 76543 21098    Last: 27 Jan    [View →]   │   │
│  │ Post-PCI, HTN        P-2023-156                  Next: 10 Feb              │   │
│  └────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                    │
│  Showing 1-25 of 847 patients                              [← Prev] [Next →]       │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### Updated File Structure

```
ui/src/app/
├── dashboard/page.tsx        # 3-panel AI workflow
├── patients/
│   ├── page.tsx              # Patient list/search (NEW)
│   └── [id]/
│       ├── page.tsx          # Patient detail - Timeline (NEW)
│       ├── prescriptions/page.tsx  # Rx history (NEW)
│       ├── labs/page.tsx     # Lab reports (NEW)
│       ├── documents/page.tsx # All documents (NEW)
│       └── vitals/page.tsx   # Vitals charts (NEW)
├── analytics/page.tsx
└── settings/...
```

---

## Summary

**260,000+ stars of proven code, ~1,250 lines of glue, WhatsApp + Email + App.**

### What This System Does (Complete List)

**For Patients:**
- ✅ Book/cancel via WhatsApp
- ✅ Get token number and wait estimate
- ✅ Receive prescription on WhatsApp
- ✅ Pay via UPI QR
- ✅ Get follow-up reminders
- ✅ Upload old reports

**For Doctors:**
- ✅ See token queue (walk-ins + scheduled)
- ✅ View vitals before seeing patient
- ✅ See allergy warnings
- ✅ Write prescription with Hindi preview
- ✅ Dictate via voice
- ✅ Order lab tests
- ✅ See lab reports when ready
- ✅ Track payments
- ✅ View analytics
- ✅ Block dates for leave
- ✅ Works offline

**For Secretary (AI):**
- ✅ Answer patient queries
- ✅ Book appointments
- ✅ Send reminders
- ✅ Draft prescriptions for approval
- ✅ Send payment reminders
- ✅ Handle follow-ups
- ✅ Attach lab reports
- ✅ Auto-reply when doctor on leave

---

That's your agentic Practo killer.

---

## How Each Piece Is Solved (Custom vs Proven)

### HIPAA/DPDP Compliance

| Requirement | Solution | Custom Code? |
|-------------|----------|--------------|
| **Encryption at rest** | Supabase default (AES-256) | ❌ No - built-in |
| **Encryption in transit** | Vercel/Supabase HTTPS | ❌ No - built-in |
| **Row Level Security** | Supabase RLS policies | ~20 lines SQL |
| **Audit logging** | DB triggers + table | ~50 lines SQL |
| **Consent collection** | UI checkbox + DB field | ~30 lines |
| **OTP for Rx links** | Supabase Auth magic links | ❌ No - built-in |
| **Session timeout** | Clerk configuration | ❌ No - config only |
| **2FA** | Clerk TOTP | ❌ No - built-in |
| **Data export (Right to Access)** | API endpoint + PDF | ~100 lines |
| **Deletion workflow** | UI + DB table | ~80 lines |

**Total custom code for compliance: ~280 lines**

### Manual EMR Browsing

| Component | Solution | Custom Code? |
|-----------|----------|--------------|
| **Patient search page** | Kiranism DataTable | ~50 lines (layout) |
| **Patient detail layout** | Kiranism layout + tabs | ~80 lines |
| **Timeline tab** | react-chrono (4k stars) | ~40 lines (data mapping) |
| **Prescriptions tab** | Kiranism DataTable | ~40 lines |
| **Labs tab** | Kiranism DataTable + Recharts | ~60 lines |
| **Documents tab** | Uppy (upload) + grid | ~80 lines |
| **Vitals tab** | Recharts graphs | ~60 lines |

**Total custom code for EMR browsing: ~410 lines**

### Summary: What's Custom vs Proven

```
┌─────────────────────────────────────────────────────────────────────────┐
│  TOTAL CODEBASE BREAKDOWN                                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Proven Open Source:     260,000+ lines (99.5%)                        │
│  ├── Moltbot              ~50,000 lines                                │
│  ├── Kiranism dashboard   ~15,000 lines                                │
│  ├── react-hook-form      ~10,000 lines                                │
│  ├── react-pdf            ~20,000 lines                                │
│  ├── Uppy                 ~30,000 lines                                │
│  ├── tesseract.js         ~15,000 lines                                │
│  ├── Recharts             ~25,000 lines                                │
│  └── Others               ~95,000 lines                                │
│                                                                         │
│  Custom Glue Code:       ~1,500 lines (0.5%)                           │
│  ├── UI layouts           ~400 lines                                   │
│  ├── API tool endpoints   ~300 lines                                   │
│  ├── Compliance           ~280 lines                                   │
│  ├── EMR browsing         ~410 lines                                   │
│  └── Configs/types        ~110 lines                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Licensing Analysis (CRITICAL)

### All Repos & Their Licenses

| Component | License | Commercial OK? | Notes |
|-----------|---------|----------------|-------|
| **Moltbot** | MIT | ✅ Yes | Free to use, modify, sell |
| **Kiranism starter** | MIT | ✅ Yes | Free to use, modify, sell |
| **assistant-ui** | MIT | ✅ Yes | Free to use, modify, sell |
| **react-hook-form** | MIT | ✅ Yes | Free to use, modify, sell |
| **react-pdf** | MIT | ✅ Yes | Free to use, modify, sell |
| **Uppy** | MIT | ✅ Yes | Free to use, modify, sell |
| **tesseract.js** | Apache 2.0 | ✅ Yes | Free, must include license |
| **react-chrono** | MIT | ✅ Yes | Free to use, modify, sell |
| **Workbox** | MIT | ✅ Yes | Google-maintained |
| **RecordRTC** | MIT | ✅ Yes | Free to use, modify, sell |
| **Recharts** | MIT | ✅ Yes | Free to use, modify, sell |
| **react-to-print** | MIT | ✅ Yes | Free to use, modify, sell |
| **react-qr-code** | MIT | ✅ Yes | Free to use, modify, sell |
| **Supabase** | Apache 2.0 | ✅ Yes | Self-host free, or use cloud |
| **Clerk** | Proprietary SaaS | ✅ Yes | Pay per user |
| **Razorpay** | Proprietary SaaS | ✅ Yes | Pay per transaction |
| **AgentMail** | Proprietary SaaS | ✅ Yes | Pay per email |
| **OpenFDA API** | Public Domain | ✅ Yes | Free US government API |

### ⚠️ CRITICAL LEGAL RISK: WhatsApp (Baileys)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ⚠️  WARNING: BAILEYS WHATSAPP LIBRARY                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  License: MIT ✅                                                        │
│  BUT: Violates WhatsApp Terms of Service ❌                            │
│                                                                         │
│  RISKS:                                                                 │
│  • WhatsApp can ban your phone number permanently                      │
│  • Meta has sent cease & desist letters to businesses                  │
│  • No legal recourse if banned                                         │
│  • Patient communication could be disrupted suddenly                   │
│                                                                         │
│  WHO USES BAILEYS ANYWAY:                                              │
│  • Small businesses (risk acceptable)                                  │
│  • Personal projects                                                   │
│  • Countries where Meta doesn't enforce strictly                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### WhatsApp Options Comparison

| Option | Cost | Legal Risk | Setup Difficulty |
|--------|------|------------|------------------|
| **Baileys (Moltbot default)** | Free | ⚠️ HIGH | Easy |
| **WhatsApp Business API (Official)** | ₹4-7 per conversation | ✅ None | Hard (Meta approval) |
| **Twilio for WhatsApp** | ₹0.4-4 per message | ✅ None | Medium |
| **Gupshup** | ₹0.5-3 per message | ✅ None | Medium |
| **Wati.io** | ₹2,500/mo + per message | ✅ None | Easy |

### Recommendation

```
┌─────────────────────────────────────────────────────────────────────────┐
│  RECOMMENDED APPROACH                                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  PHASE 1 (MVP/Testing): Use Baileys                                    │
│  • Faster to build                                                     │
│  • Free                                                                │
│  • Acceptable risk for testing with small patient base                 │
│  • Don't send >100 messages/day                                        │
│                                                                         │
│  PHASE 2 (Production): Migrate to Official API                         │
│  • Apply for WhatsApp Business API (takes 2-4 weeks)                  │
│  • Or use Twilio/Gupshup as intermediary                              │
│  • Cost: ~₹3,000-5,000/month for typical clinic                       │
│                                                                         │
│  MIGRATION PATH:                                                       │
│  • Moltbot can be configured to use different WhatsApp backends       │
│  • Your code stays the same, only config changes                      │
│  • Patient experience unchanged                                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Other Legal Considerations

| Area | Risk | Mitigation |
|------|------|------------|
| **Medical liability** | Doctor signs all Rx | AI only drafts, never signs |
| **Data breach** | Patient data exposed | Encryption + audit logs |
| **Prescription errors** | Wrong drug/dose | Drug interaction checks, doctor approval |
| **Record retention** | Legal requirement | 3-year auto-retention policy |
| **Patient consent** | DPDP violation | Explicit consent collection |

---

## Updated Cost Estimate (With Official WhatsApp)

| Item | Cost (Baileys) | Cost (Official WhatsApp) |
|------|----------------|--------------------------|
| Moltbot | Free | Free |
| Supabase | $25/mo | $25/mo |
| Clerk | $25/mo | $25/mo |
| AgentMail | ~₹500/mo | ~₹500/mo |
| Anthropic API | ~$20/mo | ~$20/mo |
| **WhatsApp** | **Free** | **₹3,000-5,000/mo** |
| Razorpay | 2% per txn | 2% per txn |
| **TOTAL** | **~₹4,000/mo** | **~₹8,000-10,000/mo** |

Still 5-10x cheaper than Practo (₹10,000-50,000/month)
