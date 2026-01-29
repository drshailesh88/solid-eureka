# What Are We Building? - A Clear Explanation (CORRECTED)

## The Vision (In Simple Terms)

You want to build an **AI Secretary for Doctors** that:
1. Talks to patients on WhatsApp (books appointments, sends reminders)
2. Helps doctors write prescriptions quickly
3. Keeps all patient records organized
4. Runs 24/7 without you managing servers

Think of it as: **HealthPlix + WhatsApp Bot + AI Assistant**

---

## The Three Main Pieces

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           YOUR PRODUCT                                        │
│                    "AI Clinical Coordinator"                                  │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          │                         │                         │
          ▼                         ▼                         ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│                  │     │                  │     │                  │
│   MOLTBOT        │     │   CASEFOLD EMR   │     │   SUPABASE       │
│   (AI Brain)     │     │   (Doctor UI)    │     │   (Database)     │
│                  │     │                  │     │                  │
│   74,000 ⭐       │     │   5,900 ⭐ base   │     │   75,000 ⭐       │
│                  │     │                  │     │                  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
         │                        │                        │
         │                        │                        │
         └────────────────────────┴────────────────────────┘
                                  │
                                  ▼
                        SHARED DATABASE
                        (All three read/write here)
```

---

## Piece 1: MOLTBOT (The AI Brain) - 74,000 Stars

**What is MoltBot?**
An open-source AI agent framework. Think of it as a ready-made "brain" that can:
- **Talk on WhatsApp** (built-in via Baileys library)
- **Remember conversations** (memory system with embeddings)
- **Schedule tasks** (cron system for reminders)
- **Call tools** (look up patient, create task, draft message)
- **Use any LLM** (GPT, Claude, Kimi, DeepSeek)

**Why MoltBot instead of building from scratch?**

| If We Build From Scratch | If We Use MoltBot |
|--------------------------|-------------------|
| Write WhatsApp connection code | Already built |
| Build memory system | Already built (73KB manager) |
| Build scheduling/cron | Already built |
| Build tool calling framework | Already built |
| ~10,000 lines of code | ~500 lines of config |
| 3+ months work | 2-3 weeks work |

**What we do with MoltBot:**
1. **Fork it** (copy the code)
2. **Strip dangerous stuff** (shell commands, browser automation)
3. **Keep good stuff** (WhatsApp, memory, cron, tools)
4. **Add medical tools** (find_patient, draft_message, triage)
5. **Connect to Supabase** (our database)

**Files to REMOVE from MoltBot (dangerous):**
```
src/browser/           # Can browse web - REMOVE
src/terminal/          # Can run shell commands - REMOVE
src/agents/bash-*      # Can execute code - REMOVE
apps/                  # Mobile apps - REMOVE (not needed)
```

**Files to KEEP from MoltBot (useful):**
```
src/gateway/           # API server - KEEP
src/memory/            # Conversation memory - KEEP
src/cron/              # Scheduling - KEEP
extensions/whatsapp/   # WhatsApp via Baileys - KEEP
skills/summarize/      # Text summarization - KEEP
skills/openai-whisper/ # Voice transcription - KEEP
```

---

## Piece 2: CASEFOLD EMR (Doctor's Screen) - Built on 5,900 Star Starter

**What is it?**
A web app where the doctor:
- Sees patient list
- Writes prescriptions
- Generates PDFs
- Views patient history
- Talks to AI secretary (chat panel)

**Where does it come from?**

| Component | Source | Stars | Custom? |
|-----------|--------|-------|---------|
| Dashboard layout | Kiranism/next-shadcn-dashboard-starter | 5,900 | No |
| Buttons, forms | shadcn/ui | 80,000 | No |
| Login/signup | Clerk | SaaS | No |
| Data tables | TanStack Table | 25,000 | No |
| PDF generation | react-pdf | 15,000 | No |
| Timeline | react-chrono | 4,000 | No |
| Charts | Recharts | 24,000 | No |
| Rich text editor | Tiptap | 28,000 | No |
| Patient/Visit logic | Custom | - | **Yes** |
| Hindi templates | Custom | - | **Yes** |

**Status:** 90% BUILT. Code exists in `/home/user/casefold-analysis/emr-app/`

---

## Piece 3: SUPABASE (The Database) - 75,000 Stars

**What is it?**
A hosted PostgreSQL database with:
- Row-Level Security (each doctor sees only their patients)
- Realtime subscriptions (UI updates when data changes)
- Storage (for PDFs, images)
- Auth (backup to Clerk)

**Why not just use any database?**
- Security built-in (RLS)
- Scales automatically
- Mumbai region (fast for India)
- Free tier for testing

---

## How They Connect

```
PATIENT                          DOCTOR
   │                                │
   │ WhatsApp message               │ Opens browser
   │                                │
   ▼                                ▼
┌──────────────────┐         ┌──────────────────┐
│                  │         │                  │
│    MOLTBOT       │         │   CASEFOLD EMR   │
│    (AI Brain)    │         │   (Web UI)       │
│                  │         │                  │
│  • Receives msg  │         │  • Shows queue   │
│  • Looks up pt   │         │  • Write Rx      │
│  • Drafts reply  │         │  • Approve msgs  │
│  • Waits for OK  │         │  • Sign Rx       │
│                  │         │                  │
└────────┬─────────┘         └────────┬─────────┘
         │                            │
         │      ┌────────────┐        │
         └─────▶│  SUPABASE  │◀───────┘
                │ (Database) │
                │            │
                │ • patients │
                │ • visits   │
                │ • Rx       │
                │ • messages │
                │ • tasks    │
                └────────────┘
```

**Example Flow:**
1. Patient sends WhatsApp: "Doctor, I need BP medicine refill"
2. MoltBot receives message
3. MoltBot looks up patient in Supabase → finds last prescription
4. MoltBot drafts reply: "Rajesh ji, aapka last Rx: Telmisartan 40mg. Same chahiye?"
5. MoltBot saves draft to `message_drafts` table (status: pending)
6. Doctor sees pending message in Casefold EMR
7. Doctor clicks "Approve"
8. MoltBot sends the WhatsApp reply

**Key point:** AI drafts, Doctor approves. AI never sends clinical messages on its own.

---

## Where Each Piece Comes From (Complete Picture)

### PROVEN REPOS (We use as-is or with minor changes)

| Component | Repo | Stars | What It Does |
|-----------|------|-------|--------------|
| **AI Brain** | [moltbot/moltbot](https://github.com/moltbot/moltbot) | 74,000 | Agent runtime, memory, cron, WhatsApp |
| **Dashboard Base** | [Kiranism/next-shadcn-dashboard-starter](https://github.com/Kiranism/next-shadcn-dashboard-starter) | 5,900 | Layout, sidebar, tables, auth |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) | 80,000 | Buttons, forms, modals |
| **Database** | [Supabase](https://supabase.com/) | 75,000 | PostgreSQL + Auth + Storage |
| **Auth** | [Clerk](https://clerk.com/) | SaaS | Login, signup, SSO |
| **PDF** | [react-pdf](https://react-pdf.org/) | 15,000 | Prescription PDFs |
| **Timeline** | [react-chrono](https://github.com/prabhuignoto/react-chrono) | 4,000 | Patient history |
| **Charts** | [Recharts](https://recharts.org/) | 24,000 | Vitals graphs |
| **Tables** | [TanStack Table](https://tanstack.com/table) | 25,000 | Patient lists |
| **Rich Text** | [Tiptap](https://tiptap.dev/) | 28,000 | Notes editor |
| **Voice** | [Whisper](https://github.com/openai/whisper) | 75,000 | Voice to text |
| **OCR** | Azure Computer Vision | SaaS | Read old reports |

**Total proven code: ~360,000+ stars**

### CUSTOM CODE (What we write)

| Component | Lines | Risk |
|-----------|-------|------|
| Database schema (SQL) | ~200 | Low |
| Medical tools for MoltBot | ~500 | Medium |
| Glue code (API routes) | ~1000 | Low |
| Hindi Rx templates | ~300 | Low |
| AI prompts | ~200 | Medium |
| MoltBot config | ~100 | Low |

**Total custom code: ~2,300 lines (~5% of total)**

---

## The One Risk: WhatsApp ToS

**The Problem:**
MoltBot uses **Baileys** library for WhatsApp. Baileys is:
- Unofficial (reverse-engineered WhatsApp Web)
- Violates WhatsApp Terms of Service
- Risk: WhatsApp could ban the number

**Two Options:**

### Option A: Keep Baileys (MoltBot default)
- **Pro:** Already built, works today
- **Pro:** Free (no per-message cost)
- **Con:** ToS violation
- **Con:** Number could get banned
- **Risk Level:** MEDIUM-HIGH

### Option B: Replace with Meta Cloud API (Official)
- **Pro:** Official, ToS compliant
- **Pro:** Embedded Signup (easy onboarding)
- **Con:** Costs money (~₹0.50 per business message)
- **Con:** Need to modify MoltBot's WhatsApp module
- **Risk Level:** LOW

**Recommendation:** Start with Baileys for testing (it's built-in). If you get traction with real doctors, migrate to official API.

---

## What's Built vs What's Not

| Component | Status | Location |
|-----------|--------|----------|
| Casefold EMR (Doctor UI) | ✅ 90% Built | `/home/user/casefold-analysis/emr-app/` |
| Database Schema | ✅ Built | `emr-app/supabase/schema.sql` |
| MoltBot Fork | ❌ Not Started | Need to fork and strip |
| Medical Tools | ❌ Not Built | Need to add to MoltBot |
| MoltBot + Supabase Connection | ❌ Not Built | Glue code needed |
| Multi-tenant (many doctors) | ❌ Not Built | Architecture planned |

---

## Work Remaining

### Phase 1: Test EMR (Now)
- Install dependencies ✅ Done
- Set up Supabase
- Test patient/visit/prescription flow

### Phase 2: Fork MoltBot (Next)
- Fork the repo
- Delete dangerous modules
- Keep WhatsApp/memory/cron
- Test basic WhatsApp flow

### Phase 3: Add Medical Tools
- `find_patient` - look up patient by phone
- `get_patient_snapshot` - get summary
- `draft_message` - draft reply (doctor approves)
- `create_task` - schedule follow-up
- `triage_message` - classify urgency

### Phase 4: Connect Everything
- MoltBot reads/writes to Supabase
- EMR shows pending messages from MoltBot
- Doctor approves, MoltBot sends

### Phase 5: Multi-tenant
- Each doctor gets their own WhatsApp number
- Database isolation (RLS)
- Onboarding flow

---

## Summary

```
YOUR PRODUCT =

  MoltBot (74k ⭐)           ← AI brain, WhatsApp, memory, cron
+ Kiranism Starter (5.9k ⭐)  ← Doctor dashboard UI
+ shadcn/ui (80k ⭐)          ← UI components
+ Supabase (75k ⭐)           ← Database
+ Clerk (SaaS)               ← Authentication
+ react-pdf (15k ⭐)          ← PDF generation
+ TanStack Table (25k ⭐)     ← Data tables
+ Recharts (24k ⭐)           ← Charts
+ Tiptap (28k ⭐)             ← Rich text
+ Whisper (75k ⭐)            ← Voice transcription
─────────────────────────────────────────────
  ~400,000 stars of proven code
+ ~2,300 lines of custom glue code
```

**Proven: 95%**
**Custom: 5%**

The risk is low because we're stitching proven pieces, not building from scratch.

---

## Comparison to Your Previous Attempts

| Previous Attempts | This Attempt |
|-------------------|--------------|
| Built WhatsApp from scratch | Use MoltBot (74k stars) |
| Built dashboard from scratch | Use Kiranism (5.9k stars) |
| Too many moving parts | 3 main pieces (MoltBot + EMR + Supabase) |
| Never tested | EMR is testable NOW |
| Forgot what was built | This document explains everything |

---

## Questions?

The architecture is:
1. **MoltBot** = AI brain (WhatsApp, memory, cron)
2. **Casefold EMR** = Doctor's screen (prescriptions, patients)
3. **Supabase** = Shared database

All three are proven. We write ~5% glue code to connect them.
