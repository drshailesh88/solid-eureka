# What Are We Building? - A Clear Explanation

## The Vision (In Simple Terms)

You want to build an **AI Secretary for Doctors** that:
1. Talks to patients on WhatsApp (books appointments, sends reminders)
2. Helps doctors write prescriptions quickly
3. Keeps all patient records organized
4. Runs 24/7 without you managing servers

Think of it as: **HealthPlix + WhatsApp Bot + AI Assistant**

---

## The Two Apps

### App 1: Casefold EMR (The Doctor's Screen)
**What it does:** Doctor opens browser → sees patients → writes prescriptions → generates PDF

### App 2: AI Clinical Coordinator (The Patient's WhatsApp)
**What it does:** Patient sends WhatsApp → AI responds → books appointment → reminds for follow-up

**They share the same database.** When AI books an appointment, doctor sees it. When doctor writes prescription, AI can reference it.

---

## Where Each Piece Comes From

### PROVEN REPOS (High GitHub Stars = Battle-Tested)

| Component | Source | Stars | What It Gives Us |
|-----------|--------|-------|------------------|
| **Dashboard UI** | [Kiranism/next-shadcn-dashboard-starter](https://github.com/Kiranism/next-shadcn-dashboard-starter) | 5,900+ | Login, sidebar, tables, forms, charts - everything for doctor's screen |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) | 80,000+ | Buttons, modals, dropdowns - looks professional |
| **Authentication** | [Clerk](https://clerk.com/) | N/A (SaaS) | Login, signup, Google sign-in - no custom code |
| **Database** | [Supabase](https://supabase.com/) | 75,000+ | PostgreSQL with security built-in |
| **PDF Generation** | [@react-pdf/renderer](https://react-pdf.org/) | 15,000+ | Prescription PDFs |
| **Timeline View** | [react-chrono](https://github.com/prabhuignoto/react-chrono) | 4,000+ | Patient history timeline |
| **Rich Text Editor** | [Tiptap](https://tiptap.dev/) | 28,000+ | For notes and prescriptions |
| **Data Tables** | [TanStack Table](https://tanstack.com/table) | 25,000+ | Patient lists, search, sort |
| **Charts** | [Recharts](https://recharts.org/) | 24,000+ | Vitals graphs, analytics |

### CUSTOM CODE (What We Write)

| Component | Why Custom? | Risk Level |
|-----------|-------------|------------|
| **Database Schema** | Your specific tables (patients, visits, prescriptions) | Low - just SQL |
| **Hindi Templates** | Prescription templates in Hindi | Low - just text |
| **API Glue Code** | Connect Supabase to UI | Low - standard patterns |
| **WhatsApp Webhook** | Receive messages from Meta | Medium - needs testing |
| **AI Prompts** | How AI talks to patients | Medium - needs tuning |

### NOT YET DECIDED (WhatsApp Layer)

| Component | Options | Status |
|-----------|---------|--------|
| **WhatsApp API** | Meta Cloud API (Official) | Decided - safe, compliant |
| **WhatsApp Bot Framework** | Need to pick one | **NOT DECIDED** |
| **AI/LLM** | Kimi K2.5 / DeepSeek V3 | Decided - cheap, good enough |

---

## The Stitching Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         YOUR PRODUCT                                     │
│                   "AI Clinical Coordinator"                              │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
┌─────────────────────┐  ┌─────────────────┐  ┌─────────────────────┐
│   DOCTOR'S SCREEN   │  │    DATABASE     │  │  PATIENT WHATSAPP   │
│   (Casefold EMR)    │  │   (Supabase)    │  │  (AI Coordinator)   │
└─────────────────────┘  └─────────────────┘  └─────────────────────┘
         │                       │                      │
         │                       │                      │
    ┌────┴────┐            ┌─────┴─────┐          ┌────┴────┐
    │ PROVEN  │            │  PROVEN   │          │  MIXED  │
    └────┬────┘            └─────┬─────┘          └────┬────┘
         │                       │                      │
         ▼                       ▼                      ▼
┌─────────────────┐      ┌─────────────┐      ┌─────────────────┐
│ Kiranism Starter│      │  Supabase   │      │ Meta Cloud API  │ ← Proven
│ shadcn/ui       │      │  PostgreSQL │      │ (Official)      │
│ Clerk Auth      │      │  Row-Level  │      ├─────────────────┤
│ TanStack Table  │      │  Security   │      │ Bot Framework   │ ← NOT PICKED
│ Recharts        │      │             │      │ (TBD)           │
│ react-pdf       │      │             │      ├─────────────────┤
│ Tiptap          │      │             │      │ LLM (Kimi/      │ ← Proven API
│ react-chrono    │      │             │      │ DeepSeek)       │
└─────────────────┘      └─────────────┘      └─────────────────┘
     ALL PROVEN            ALL PROVEN           PARTIALLY PROVEN
```

---

## What's Built vs What's Not

### CASEFOLD EMR (Doctor's Screen) - 90% BUILT

| Feature | Status | Source |
|---------|--------|--------|
| Login/Signup | ✅ Built | Clerk (proven) |
| Dashboard Layout | ✅ Built | Kiranism starter (proven) |
| Patient List | ✅ Built | Custom + TanStack Table |
| Patient Create/Edit | ✅ Built | Custom + shadcn forms |
| Visit Recording | ✅ Built | Custom |
| Prescription Builder | ✅ Built | Custom + Tiptap |
| PDF Generation | ✅ Built | react-pdf (proven) |
| Document Upload | ✅ Built | Custom + Supabase storage |
| OCR (Read Documents) | ✅ Built | Azure API (proven) |
| Timeline View | ✅ Built | react-chrono (proven) |
| Vitals Charts | ✅ Built | Recharts (proven) |
| Database Schema | ✅ Built | Custom SQL |
| Hindi Templates | ✅ Built | Custom text |

**Custom Code in EMR:** ~20% (glue code, schemas, templates)
**Proven Repos in EMR:** ~80%

### AI CLINICAL COORDINATOR (WhatsApp) - 0% BUILT

| Feature | Status | Source |
|---------|--------|--------|
| WhatsApp Connection | ❌ Not Built | Meta Cloud API (proven) |
| Message Handling | ❌ Not Built | **NEED TO PICK FRAMEWORK** |
| AI Responses | ❌ Not Built | Kimi/DeepSeek API (proven) |
| Appointment Booking | ❌ Not Built | Custom logic |
| Reminder System | ❌ Not Built | Custom + cron jobs |
| Multi-tenant (many doctors) | ❌ Not Built | Custom architecture |

**This is 100% not built yet. Only specifications exist.**

---

## The Gap: WhatsApp Bot Framework

This is the **one piece we haven't decided**:

### Option A: Build from Scratch
- Use Meta's raw webhook API
- Write all message handling ourselves
- **Risk:** High - lots of custom code

### Option B: Use a Bot Framework
Candidates:
| Framework | Stars | Pros | Cons |
|-----------|-------|------|------|
| [Botpress](https://github.com/botpress/botpress) | 13,000+ | Visual builder, proven | Complex, might be overkill |
| [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) | 16,000+ | Popular | Unofficial API - **ToS RISK** |
| [Baileys](https://github.com/WhiskeySockets/Baileys) | 4,000+ | Lightweight | Unofficial API - **ToS RISK** |
| Custom on Meta API | N/A | Official, safe | More custom code |

### My Recommendation: Custom on Meta Cloud API
- Official = no ToS risk
- Embedded Signup = easy onboarding
- We write ~500 lines of webhook code
- **Risk:** Medium (but safe legally)

---

## Risk Assessment

| Component | Risk | Why |
|-----------|------|-----|
| Doctor's UI | LOW | 80% proven repos |
| Database | LOW | Supabase is battle-tested |
| Authentication | LOW | Clerk handles everything |
| PDF Generation | LOW | react-pdf is mature |
| WhatsApp Connection | MEDIUM | Official API but custom code |
| AI Responses | MEDIUM | Prompt engineering needed |
| Multi-tenant Scale | MEDIUM | Architecture is sound but untested |

### Why This Might Fail (Honest Assessment)

1. **WhatsApp AI quality** - If AI gives wrong responses, patients lose trust
2. **Onboarding friction** - If doctors can't connect WhatsApp easily, they leave
3. **Edge cases** - Hindi/regional languages, voice messages, images
4. **Scale testing** - We haven't tested with 1000 doctors yet

### Why This Might Succeed

1. **EMR is 90% proven code** - Less bugs
2. **Simple architecture** - One database, one API, no microservices
3. **Official APIs only** - No ToS violations
4. **Cheap LLMs** - Sustainable business model

---

## Summary: What You're Getting

```
YOUR PRODUCT =
    Kiranism Dashboard (proven)
  + shadcn/ui Components (proven)
  + Clerk Auth (proven)
  + Supabase Database (proven)
  + react-pdf (proven)
  + TanStack Table (proven)
  + Recharts (proven)
  + Meta WhatsApp API (proven)
  + Kimi/DeepSeek LLM (proven)
  + ~2000 lines of custom glue code (our risk)
```

**Proven repos: ~85%**
**Custom code: ~15%**

The custom code is:
- Database schema (low risk)
- API routes to connect things (low risk)
- WhatsApp webhook handler (medium risk)
- AI prompts and logic (medium risk)

---

## What Should We Do Next?

1. **Test the EMR** - Make sure doctor's screen works before adding WhatsApp
2. **Pick WhatsApp approach** - Confirm we go with Meta Cloud API
3. **Build WhatsApp layer** - This is the main work remaining
4. **Test with real patients** - Before scaling to many doctors

Does this make the architecture clear?
