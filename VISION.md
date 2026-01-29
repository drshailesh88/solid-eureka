# Vision: AI Clinical Coordinator for Indian Doctors

> A secretary that doctors and patients talk to via WhatsApp, Email, or App - powered by 220,000+ stars of proven open-source code.

---

## The Two-Phase Approach

### Phase 1: Casefold EMR (CURRENT FOCUS)
**Status:** 90% Built
**Location:** This directory

Doctor's prescription-writing interface:
- Patient management
- Visit documentation
- Prescription builder with Hindi instructions
- PDF generation
- Document upload + OCR
- Email sharing

**What's Missing (Building Now):**
- [ ] Patient safety fields (allergies, chronic conditions)
- [ ] Queue/Token system (60% of patients are walk-ins)
- [ ] Payment collection (UPI QR, receipts)

### Phase 2: AI Clinical Coordinator (NEXT)
**Status:** Spec Only (no code yet)
**Spec:** /tmp/solid-eureka-repo/FINAL_SPEC.md

WhatsApp-based AI secretary that:
- Talks to patients via WhatsApp
- Books appointments
- Sends follow-up reminders
- Drafts messages for doctor approval
- Uses same Supabase database as EMR

**Stack:** MoltBot (74k stars) + Meta WhatsApp API + AgentMail

---

## Core Principles (Locked)

From PROJECT_PLAN.md:

1. **Proven repos > custom code** - Use battle-tested libraries
2. **No autoprescribing** - AI drafts, doctor approves
3. **Single-doctor clinics first** - Keep it simple
4. **One app, one repo, one deploy** - Railway ($5/mo)
5. **AI is optional** - App must work without AI

---

## How They Connect

```
┌─────────────────────────────────────────────────────────────┐
│                    SHARED DATABASE                          │
│                    (Supabase)                               │
└─────────────────────────────────────────────────────────────┘
         ▲                                    ▲
         │                                    │
┌─────────────────────┐          ┌─────────────────────────┐
│   CASEFOLD EMR      │          │  AI CLINICAL COORDINATOR │
│   (Building Now)    │          │  (Phase 2)               │
│                     │          │                          │
│   • Doctor writes   │          │  • Patient talks via     │
│     prescriptions   │          │    WhatsApp              │
│   • Records visits  │          │  • AI books appointments │
│   • Views patients  │          │  • Sends reminders       │
└─────────────────────┘          └──────────────────────────┘
```

---

## Target Acceptance Criteria

- New patient visit + Rx in under **2 minutes**
- Follow-up Rx in under **60 seconds**
- Search works across name/phone/UHID
- AI never auto-finalizes prescriptions
- Works offline in tier-3 cities (PWA - future)

---

## Cost Structure (Target)

| Component | Cost |
|-----------|------|
| EMR (Railway) | $5/mo |
| AI Coordinator (Railway) | $5/mo |
| Supabase (shared) | Free → $25/mo |
| Clerk (shared) | Free up to 10k |
| **Total** | **$10-35/mo** |

---

## Repositories

| Repo | Purpose | Status |
|------|---------|--------|
| `drshailesh88/casefold` | EMR source code | Building |
| `drshailesh88/solid-eureka` | AI Coordinator specs | Spec only |

---

## Why Previous Attempts Failed

1. **Over-engineering** - Too many technologies
2. **Never tested** - Built features without validating
3. **Lost track** - Didn't remember what was built

This time:
- EMR built on proven repos (5.9k stars base)
- Single Next.js app (not microservices)
- Test before adding WhatsApp layer
- Spec-driven development with persistent plans
