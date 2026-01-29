# AI Clinical Coordinator - Complete Context Prompt

Copy this entire prompt when starting a new Claude session.

---

## WHO I AM

I am a doctor (not a developer) in India building an AI Clinical Coordinator to compete with Practo and HealthPlix. This is my 4th attempt at building this app. I use Claude Code, Codex, and Code Rabbit.

**My philosophy:**
- Use proven repos with high GitHub stars (not custom code)
- Stitch repos together with minimal glue code
- LLMs help build, but app must be simple enough to debug
- Money is NOT the constraint - use the BEST solutions

---

## WHAT I'M BUILDING

An **AI Secretary for Doctors** that:
1. Talks to patients on WhatsApp (books appointments, sends reminders)
2. Helps doctors write prescriptions quickly
3. Keeps all patient records organized
4. Runs 24/7 without me managing servers

**Think of it as:** HealthPlix + WhatsApp Bot + AI Assistant

---

## THE THREE MAIN PIECES

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           MY PRODUCT                                          │
│                    "AI Clinical Coordinator"                                  │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          │                         │                         │
          ▼                         ▼                         ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   MOLTBOT        │     │   CASEFOLD EMR   │     │   SUPABASE       │
│   (AI Brain)     │     │   (Doctor UI)    │     │   (Database)     │
│   74,000 ⭐       │     │   5,900 ⭐ base   │     │   75,000 ⭐       │
└──────────────────┘     └──────────────────┘     └──────────────────┘
          │                        │                        │
          └────────────────────────┴────────────────────────┘
                                  │
                                  ▼
                        SHARED SUPABASE DATABASE
```

### Piece 1: MoltBot (AI Brain) - 74,000 Stars
- WhatsApp integration (built-in via Baileys)
- Memory system (conversation history)
- Cron/scheduling (follow-up reminders)
- Tool calling (find_patient, draft_message, etc.)
- Uses cheap LLMs (Kimi K2.5 / DeepSeek V3) - NOT Claude/GPT

### Piece 2: Casefold EMR (Doctor UI) - 90% BUILT
- Location: `/home/user/casefold-analysis/emr-app/`
- Built on Kiranism/next-shadcn-dashboard-starter (5,900 stars)
- Has: Patients, Visits, Vitals, Prescriptions, PDF, OCR, Timeline
- Missing: WhatsApp, Queue, Payments, Allergies, Lab Orders

### Piece 3: Supabase (Database)
- Currently has 10 tables (EMR basics)
- Needs 24+ tables (full system with WhatsApp, payments, etc.)
- All tables have Row Level Security (RLS)

---

## WHATSAPP STRATEGY (DECIDED)

| Phase | WhatsApp Method | MoltBot |
|-------|-----------------|---------|
| MVP/Testing | Baileys (built-in) | Full (no stripping) |
| Production | **Meta Official API** | Stripped & safe |

**Key Decision:** Baileys is ONLY for testing. Production MUST use Meta Official API.

---

## 3 PRODUCTION DIRECTIVES (NON-NEGOTIABLE)

### Directive 1: Remove Baileys → Connect WhatsApp Official API
- Delete all Baileys code from codebase
- Register as WhatsApp Tech Provider (2-4 weeks)
- Implement Meta Cloud API + Embedded Signup
- Execute: ONLY before production deployment

### Directive 2: Make MoltBot Safe
- Remove: `src/browser/`, `src/terminal/`, `src/agents/bash-*`
- Remove: dangerous skills (coding-agent, tmux, etc.)
- Keep: gateway, memory, cron, sessions
- Enforce tool policy (allowlist only medical tools)
- Execute: ONLY after everything works

### Directive 3: White-Label MoltBot
- Remove all "MoltBot" branding
- Rename to "Clinical Coordinator" (or my brand)
- Keep MIT license in source files (required)
- No evidence of MoltBot in user-facing UI
- Execute: ONLY before production deployment

---

## PROVEN REPOS (ALREADY DECIDED)

| Component | Repo | Stars |
|-----------|------|-------|
| AI Brain | moltbot/moltbot | 74,000 |
| Dashboard Base | Kiranism/next-shadcn-dashboard-starter | 5,900 |
| UI Components | shadcn/ui | 80,000 |
| Database | Supabase | 75,000 |
| Auth | Clerk | SaaS |
| PDF | @react-pdf/renderer | 15,000 |
| Timeline | react-chrono | 4,000 |
| Charts | Recharts | 24,000 |
| Tables | TanStack Table | 25,000 |
| Rich Text | Tiptap | 28,000 |
| Voice | Whisper | 75,000 |
| OCR | Azure Computer Vision | SaaS |

**Total proven code: ~400,000 stars**
**Custom glue code: ~2,300 lines (~5%)**

---

## WHAT'S BUILT VS NOT BUILT

### BUILT (Casefold EMR - 90%)
- ✅ Patient CRUD (list, create, edit, view)
- ✅ Visit recording (CC, HPI, findings, diagnosis, plan)
- ✅ Vitals (BP, pulse, temp, SpO2, weight, height, BMI)
- ✅ Prescription builder (brand, salt, dose, frequency, pattern)
- ✅ Hindi templates (deterministic, not AI)
- ✅ PDF generation (@react-pdf/renderer)
- ✅ Document upload (react-dropzone)
- ✅ OCR (Azure Computer Vision)
- ✅ AI summarization (OpenAI GPT-4o-mini)
- ✅ Timeline view (react-chrono)
- ✅ Email sharing (Resend)
- ✅ Auth (Clerk)
- ✅ 10 database tables with RLS

### NOT BUILT (0%)
- ❌ MoltBot AI brain
- ❌ WhatsApp integration
- ❌ Queue/token system
- ❌ Payment collection (UPI/Cash)
- ❌ Allergies field in patients
- ❌ Lab orders
- ❌ Doctor availability/leave
- ❌ Voice dictation
- ❌ Offline mode (PWA)
- ❌ Analytics dashboard
- ❌ 14+ additional database tables

---

## KEY FILES IN THE CODEBASE

### solid-eureka repo (Specs)
```
/home/user/solid-eureka/
├── FINAL_SPEC.md              # Complete 121KB specification
├── ARCHITECTURE_EXPLAINED.md   # How pieces connect
├── GAP_ANALYSIS.md            # What's built vs missing
├── PRODUCTION_DIRECTIVES.md   # 3 mandatory pre-production tasks
├── STATUS_SUMMARY.md          # Current status overview
└── MOLTBOT_MEDICAL_FORK_SPEC.md # How to fork MoltBot safely
```

### Casefold EMR (Code)
```
/home/user/casefold-analysis/emr-app/
├── src/
│   ├── app/                   # Next.js App Router
│   ├── components/            # 95+ UI components
│   ├── features/              # patients, visits, prescriptions, etc.
│   ├── lib/                   # supabase.ts, etc.
│   └── types/                 # TypeScript types
├── supabase/
│   └── schema.sql             # 10 tables with RLS
└── package.json               # Dependencies
```

---

## WORK PHASES

### Phase 1: Test EMR (Current)
- Install dependencies ✅ Done
- Set up Supabase (need to create project)
- Test patient/visit/prescription flow

### Phase 2: Set Up MoltBot
- Clone MoltBot repo (DON'T strip yet)
- Configure WhatsApp with test number
- Test basic WhatsApp send/receive

### Phase 3: Add Medical Tools
- find_patient, get_patient_snapshot
- draft_message, create_task, triage_message
- record_vitals, record_payment

### Phase 4: Connect Everything
- MoltBot reads/writes to Supabase
- EMR shows pending messages from MoltBot
- Doctor approves, MoltBot sends

### Phase 5: Production Ready (Execute 3 Directives)
- Switch WhatsApp: Baileys → Meta Official API
- Strip MoltBot: Remove dangerous modules
- White-label: Remove MoltBot branding

---

## COMPLIANCE (Day 1)

- **India:** DPDP Act 2023, DISHA, ABDM, IMC Regulations
- **LLM Data:** Use cheap models (Kimi/DeepSeek), de-identify PHI
- **Audit:** All AI actions logged
- **Consent:** Collected before storing patient data

---

## KEY DECISIONS (LOCKED)

| Decision | Choice | Reason |
|----------|--------|--------|
| Hosting | Railway ($5/mo) | Fixed cost, not Vercel |
| Auth | Clerk | Already in Kiranism starter |
| Database | Supabase (Mumbai) | RLS, auto-scale |
| LLM | Kimi K2.5 / DeepSeek V3 | 90% cheaper than Claude |
| WhatsApp (MVP) | Baileys via MoltBot | Works today |
| WhatsApp (Prod) | Meta Official API | ToS compliant |
| PDF | @react-pdf/renderer | React components |
| OCR | Azure Computer Vision | Already built |

---

## WHAT I DON'T WANT

- ❌ Over-engineering (keep it simple)
- ❌ Building from scratch (use proven repos)
- ❌ Expensive LLMs (secretary ≠ doctor)
- ❌ Complex onboarding (doctors will leave)
- ❌ Microservices (one app + one MoltBot)
- ❌ Time estimates (just do the work)

---

## CRITICAL REMINDERS

1. **Casefold EMR is just the doctor's screen** - MoltBot is the AI brain
2. **Test before adding features** - Don't build on broken foundation
3. **Baileys is temporary** - Production MUST use Meta Official API
4. **Strip MoltBot LAST** - After everything works
5. **White-label before launch** - No MoltBot branding in production
6. **I am a doctor, not a developer** - Explain things simply

---

## START HERE

Read these files first:
1. `/home/user/solid-eureka/FINAL_SPEC.md` - Full specification
2. `/home/user/solid-eureka/GAP_ANALYSIS.md` - What's built vs missing
3. `/home/user/solid-eureka/PRODUCTION_DIRECTIVES.md` - 3 mandatory tasks

Then ask me what I want to work on today.
