# Parallel Build Matrix (Async Agents)

This file defines the safe parallelization plan for async agents. It prevents broken dependencies and reduces debugging.

## Rule of Thumb
- Do NOT parallelize before Phase 0 is complete.
- Any task that touches schema, auth, or deployment must happen first.

---

## Phase 0 (Sequential – Must Complete First)
**Owner: Core Agent**

1) Repo bootstrap
- Clone and run base Kiranism app.
- Verify app runs locally and deploys on Railway.

2) Auth setup (Clerk)
- Clerk keys added to env.
- Login/Logout works.

3) Database setup (Supabase)
- Create project, apply schema and RLS.
- Confirm CRUD works for patients/visits.

**Phase 0 definition of done**
- App deploys.
- User can sign in.
- Database schema exists with RLS.

---

## Phase 1 (Parallel – Start After Phase 0)

### Stream A – Patient + Visit CRUD UI
- Patient list + search.
- Patient profile + history.
- Visit creation form.

### Stream B – Prescription Builder
- Rx form UI.
- Templates and specialty presets.
- Data saved into prescriptions and prescription_items.

### Stream C – PDF Generation + Preview
- @react-pdf/renderer layout.
- react-pdf preview component.
- Depends on prescription data shape.

### Stream D – Document Upload + Storage
- Upload UI (react-dropzone).
- Store PDFs in Supabase Storage.
- Store document metadata in documents table.

### Stream H – Hindi Instruction Templates
- Implement deterministic Hindi templates using i18next.
- Frequency and pattern mappings only.
- No AI translation.

**Phase 1 definition of done**
- CRUD works end-to-end.
- Rx builder saves data.
- PDF renders locally.
- Documents upload + metadata saved.
- Hindi templates produce correct outputs.

---

## Phase 2 (Parallel – Start After Document Upload)

### Stream E – OCR Pipeline
- Extract text with pdf-parse.
- If insufficient, trigger Azure Read OCR.
- Save OCR metadata.

### Stream F – AI Summary + Timeline
- AI summary of extracted/OCR text (vercel/ai).
- Timeline generation.
- Timeline UI (react-chrono).

**Phase 2 definition of done**
- OCR runs only when needed.
- AI summary + timeline works on uploaded docs.

---

## Phase 3 (Parallel – Start After PDF + Email Endpoint Ready)

### Stream G – Sharing
- WhatsApp share (react-share).
- Email share with Resend (PDF attachment).

**Phase 3 definition of done**
- WhatsApp share opens with PDF link.
- Resend email delivers PDF attachment.

---

## Final Integration QA
- End-to-end test of all three workflows:
  - New patient
  - Follow-up
  - Outside records
- Verify AI guardrails (no auto-finalize).
- Verify RLS isolation.
- Verify PDF correctness.
- Verify Hindi instructions correctness.

