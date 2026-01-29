# Gap Analysis Report: FINAL_SPEC vs Casefold EMR

## Executive Summary

| Category | FINAL_SPEC.md (What We Need) | Casefold EMR (What We Have) | Gap |
|----------|------------------------------|------------------------------|-----|
| **Core EMR** | Patients, Visits, Rx, Vitals | ✅ Yes | None |
| **AI Brain** | MoltBot (74k stars) | ❌ No | **MAJOR GAP** |
| **WhatsApp** | Baileys → Meta Official API | ❌ No | **MAJOR GAP** |
| **Queue/Tokens** | Walk-ins, token system | ❌ No | Missing |
| **Payments** | UPI/Cash, receipts | ❌ No | Missing |
| **Allergies** | Drug allergies array | ❌ No | Missing |
| **Lab Orders** | Order → Report linking | ❌ No | Missing |
| **Voice Dictation** | Whisper transcription | ❌ No | Missing |
| **Offline Mode** | PWA with Workbox | ❌ No | Missing |
| **Analytics** | Revenue, patient trends | ❌ No | Missing |
| **Doctor Availability** | Leave, blocked days | ❌ No | Missing |

---

## Database Schema Comparison

### Tables in FINAL_SPEC.md (Required)

| Table | In Casefold? | Notes |
|-------|--------------|-------|
| `patients` | ✅ Yes | Missing: `allergies`, `chronic_conditions`, `blood_group`, `emergency_contact` |
| `visits` (encounters) | ✅ Yes | Similar structure |
| `vitals` | ✅ Yes | Complete |
| `prescriptions` | ✅ Yes | Missing: `status`, `signed_at`, `sent_via` |
| `prescription_items` | ✅ Yes | Complete |
| `documents` | ✅ Yes | Similar (Casefold has `doc_type`) |
| `document_summaries` | ✅ Yes | Complete |
| `timeline_events` | ✅ Yes | Complete |
| `templates` | ✅ Yes | Complete |
| `audit_logs` | ✅ Yes | Missing: `user_type`, `resource_type`, `patient_id`, `user_agent` |
| `conversations` | ❌ **NO** | WhatsApp/Email threads |
| `conversation_patients` | ❌ **NO** | Family linking |
| `appointments` | ❌ **NO** | Scheduling |
| `tasks` | ❌ **NO** | Follow-ups, CRM |
| `private_notes` | ❌ **NO** | Doctor-only notes |
| `message_drafts` | ❌ **NO** | AI approval workflow |
| `interactions` | ❌ **NO** | Communication log |
| `payments` | ❌ **NO** | UPI/Cash collection |
| `patient_documents` | ❌ **NO** | (Casefold has `documents` but different) |
| `lab_orders` | ❌ **NO** | Order → Report |
| `doctor_availability` | ❌ **NO** | Leave management |
| `queue` | ❌ **NO** | Token system |
| `voice_notes` | ❌ **NO** | Dictation |
| `referrals` | ❌ **NO** | Specialist referral |
| `fee_schedule` | ❌ **NO** | Rate card |
| `sync_log` | ❌ **NO** | Offline sync |
| `deletion_requests` | ❌ **NO** | DPDP compliance |

### Casefold Has: 10 tables
### FINAL_SPEC Needs: 24+ tables
### Gap: 14+ tables missing

---

## Feature Comparison

### What Casefold EMR HAS (Built)

| Feature | Status | Components |
|---------|--------|------------|
| Patient CRUD | ✅ Built | List, create, edit, view |
| Visit Recording | ✅ Built | CC, HPI, findings, diagnosis, plan |
| Vitals | ✅ Built | BP, pulse, temp, SpO2, weight, height, BMI |
| Prescription Builder | ✅ Built | Brand, salt, dose, frequency, pattern |
| Hindi Templates | ✅ Built | Deterministic templates for instructions |
| PDF Generation | ✅ Built | @react-pdf/renderer |
| Document Upload | ✅ Built | react-dropzone |
| OCR | ✅ Built | Azure Computer Vision |
| AI Summarization | ✅ Built | OpenAI GPT-4o-mini |
| Timeline View | ✅ Built | react-chrono |
| Email Sharing | ✅ Built | Resend |
| Auth | ✅ Built | Clerk |
| RLS Security | ✅ Built | All tables have policies |

### What FINAL_SPEC Needs But Casefold DOESN'T HAVE

| Feature | Priority | Why Missing |
|---------|----------|-------------|
| **MoltBot AI Brain** | CRITICAL | WhatsApp/memory/cron/tools |
| **WhatsApp Integration** | CRITICAL | Patient communication |
| **Queue/Token System** | HIGH | Walk-ins are 60% of patients |
| **Payment Collection** | HIGH | Doctors need to get paid |
| **Allergies Field** | HIGH | Patient safety |
| **Lab Orders** | MEDIUM | Order → Report linking |
| **Doctor Availability** | MEDIUM | Leave management |
| **Voice Dictation** | MEDIUM | 5x faster for doctors |
| **Offline Mode (PWA)** | MEDIUM | Tier-3 internet issues |
| **Analytics Dashboard** | LOW | Revenue/patient trends |
| **Referrals** | LOW | Specialist referral |
| **Fee Schedule** | LOW | Rate card |

---

## FINAL_SPEC Components Not in Casefold

### 1. MoltBot (AI Brain) - NOT IN CASEFOLD

FINAL_SPEC says:
```
MoltBot (74,000 stars) provides:
- WhatsApp integration (via Baileys)
- Memory system (conversation history)
- Cron/scheduling (follow-up reminders)
- Tool calling (find_patient, draft_message, etc.)
```

**Casefold has NONE of this.** Casefold is just a traditional EMR with basic AI summarization.

### 2. WhatsApp Communication - NOT IN CASEFOLD

FINAL_SPEC says:
```
Patient → WhatsApp → MoltBot → Draft → Doctor Approves → Send
```

**Casefold has:** Email sharing only (via Resend)

### 3. Secretary Tools - NOT IN CASEFOLD

FINAL_SPEC defines 50+ tools:
- `find_patient`, `get_patient_snapshot`
- `create_appointment`, `create_task`
- `draft_message`, `log_interaction`
- `record_vitals`, `record_payment`
- `order_lab_tests`, `check_drug_allergy`
- etc.

**Casefold has:** 3 API routes (AI summarize, OCR, email)

### 4. Multi-Channel Communication - NOT IN CASEFOLD

FINAL_SPEC says:
- WhatsApp (via MoltBot)
- Email (via AgentMail)
- App (EMR)

**Casefold has:** App only + basic email sharing

---

## What Casefold IS vs What FINAL_SPEC Wants

```
┌────────────────────────────────────────────────────────────────────────┐
│  CASEFOLD EMR (What's Built)                                          │
│  ────────────────────────────────────────────────────────────────────  │
│                                                                        │
│  A traditional EMR web app for doctors:                               │
│  • Doctor logs in                                                      │
│  • Doctor searches/creates patients                                    │
│  • Doctor records visits and vitals                                    │
│  • Doctor writes prescriptions                                         │
│  • Doctor generates PDF                                                │
│  • Doctor emails PDF to patient                                        │
│                                                                        │
│  NO AI secretary. NO WhatsApp. NO automation.                         │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  FINAL_SPEC (What's Planned)                                          │
│  ────────────────────────────────────────────────────────────────────  │
│                                                                        │
│  An AI Clinical Coordinator:                                          │
│  • Patient sends WhatsApp → AI responds                               │
│  • AI drafts messages → Doctor approves                               │
│  • AI schedules follow-ups → Auto-reminders                           │
│  • AI handles routine queries → Doctor sees complex only              │
│  • Doctor uses EMR for prescriptions                                   │
│  • Everything automated except clinical decisions                      │
│                                                                        │
│  MoltBot is the BRAIN. Casefold is just the DOCTOR'S SCREEN.         │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## The Relationship

```
FINAL_SPEC Architecture:

┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                        MOLTBOT (AI BRAIN)                          │
│                        - NOT BUILT YET -                           │
│                                                                     │
│    WhatsApp + Memory + Cron + Tools + LLM                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                    CASEFOLD EMR (DOCTOR UI)                        │
│                    - 90% BUILT -                                   │
│                                                                     │
│    Patients + Visits + Rx + PDF + OCR                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                         SUPABASE (DB)                              │
│                    - SCHEMA PARTIAL -                              │
│                                                                     │
│    10 tables built, 14+ missing                                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Conclusion

### Casefold EMR is a COMPONENT, not the PRODUCT

- Casefold = Doctor's prescription-writing interface (90% done)
- MoltBot = AI secretary brain (0% done)
- WhatsApp = Patient communication (0% done)

### What Works Today
- Doctor can create patients
- Doctor can record visits
- Doctor can write prescriptions
- Doctor can generate PDFs
- Doctor can email PDFs

### What Doesn't Work Today
- Patient cannot WhatsApp the clinic
- AI cannot draft messages
- No appointment booking
- No payment collection
- No follow-up reminders
- No queue/token system
- No offline mode

---

## Recommendation

1. **Test Casefold EMR first** - Make sure the doctor's screen works
2. **Add missing database tables** - 14+ tables needed for full functionality
3. **Set up MoltBot** - Clone and configure (don't strip yet)
4. **Build WhatsApp flow** - Connect MoltBot to Meta Official API
5. **Connect MoltBot to Casefold** - Shared Supabase database

The gap is not in the EMR - it's in the AI/automation layer that doesn't exist yet.
