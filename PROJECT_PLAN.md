# Project Plan (Primary Source of Truth)

Last updated: 2026-01-23
Owner: Dr. Shailesh Singh

This file is the primary source of truth for this EMR project. Any LLM, terminal session, or future work must follow this plan. It captures the full context, decisions, and constraints agreed so far.

---

## 1) Vision and Product Thesis
Build a web-first EMR for Indian doctors that is fast, beautiful, and safe. The core value is frictionless prescription writing with AI assistance. Autoprescribing is strictly forbidden. The system must be stable, minimal, and easy to maintain by a non-developer using LLMs.

---

## 2) Non-Negotiable Constraints
- Proven repos and managed services only. Avoid custom code unless it is glue.
- No autoprescribing. AI must never finalize meds or investigations.
- Single-doctor clinics first.
- Web-first (not desktop).
- One app, one repo, one deploy.
- Minimal debugging burden. Prefer simpler integrations even if accuracy is lower.

---

## 3) Locked Architecture (Final)
- Hosting: Single Next.js full-stack app on Railway ($5/mo).
- Frontend: Next.js App Router.
- Backend: Next.js API routes / server actions inside the same app.
- Database + Storage: Supabase.
- Auth: Clerk.
- Email: Resend.
- OCR: Azure Read OCR.

Rationale: One repo, one deploy, minimal moving parts. Heavy jobs can be offloaded later if needed, without rewriting core workflows.

---

## 4) UI Direction
- Base template: Kiranism/next-shadcn-dashboard-starter.
- Visual reference: Horizon UI design language.
- Premium look is mandatory; avoid cluttered or admin-looking layouts.

---

## 5) MVP Scope (Must-Have)
- Patient list + search (name/surname/phone/UHID).
- Patient profile: UHID (required), age, sex, phone, address.
- Visit note: chief complaints, HPI, investigations, findings, diagnosis, plan.
- Structured vitals + flexible physical exam.
- Prescription builder with brand + salt, frequency, duration, instructions.
- Templates + specialty presets (GP, pediatrics, OBGYN, cardiology, internal medicine).
- PDF generation + WhatsApp/email share.
- Document upload (PDF/labs).
- Outside records workflow with AI summary + timeline.
- Hindi patient instructions (template-based, deterministic).

---

## 6) Non-Goals (MVP)
- Autoprescribing.
- In-app appointment system (link out only).
- Billing/invoicing.
- Voice agent.
- Multi-doctor clinics.
- AI-based Hindi translation (template-only for MVP).

---

## 7) Core Workflows

### A) New Patient
1) Create patient.
2) Enter vitals and exam.
3) Write visit note (CC, HPI, investigations, findings, diagnosis, plan).
4) Build prescription.
5) Preview PDF.
6) Share via WhatsApp/email.

### B) Follow-up Patient
1) Open patient.
2) Review last visit snapshot.
3) Repeat Rx + edits.
4) Share.

### C) Outside Records (Critical Workflow)
1) Upload PDF or lab report.
2) Extract text using pdf-parse.
3) If text is insufficient, run Azure Read OCR.
4) Generate AI summary and timeline.
5) Doctor reviews + adds findings.
6) Build Rx.
7) Share.

---

## 8) AI Guardrails
- AI can summarize, format, draft diagnosis, translate instructions.
- AI cannot auto-add meds/investigations or auto-finalize prescriptions.
- All AI outputs are drafts requiring explicit doctor approval.
- AI actions are logged.
- AI is optional: the app must work without AI.

---

## 9) OCR Policy (Locked)
- OCR is required for the Outside Records workflow.
- OCR runs only when text extraction fails or is insufficient.
- Priority is easy integration and low debugging overhead.
- Accuracy is secondary to stability.
- Provider: Azure Read OCR.

---

## 10) Hindi Instructions Policy (Locked)
- Hindi patient instructions are template-based and deterministic.
- No AI translation in MVP.
- Use i18next key/value templates for frequency and timing.

---

## 11) Repo-First Stack Map
- Base UI: Kiranism/next-shadcn-dashboard-starter
- Supabase schema/RLS: Razikus/supabase-nextjs-template
- Notes editor: Tiptap
- PDF: @react-pdf/renderer + react-pdf + pdf-parse
- Uploads: react-dropzone
- Share: react-share + Resend
- Timeline: react-chrono
- AI: vercel/ai SDK
- Search: Fuse.js
- Drug DB: Indian-Medicine-Dataset
- i18n: i18next
- OCR: Azure Read OCR

---

## 12) Data Model (MVP Tables)

### patients
- id (uuid, PK)
- owner_id (text, Clerk user id)
- uhid (text, unique)
- first_name (text)
- last_name (text)
- age (int)
- sex (text)
- phone (text)
- address (text)
- created_at (timestamp)

### visits
- id (uuid, PK)
- patient_id (uuid, FK)
- owner_id (text)
- visit_date (date)
- chief_complaints (text)
- hpi (text)
- investigations (text)
- findings (text)
- diagnosis (text)
- plan (text)
- notes (text)
- created_at (timestamp)

### prescriptions
- id (uuid, PK)
- visit_id (uuid, FK)
- owner_id (text)
- summary (text)
- language (text)
- created_at (timestamp)

### documents
- id (uuid, PK)
- patient_id (uuid, FK)
- owner_id (text)
- file_path (text)
- doc_type (text)
- uploaded_at (timestamp)
- ocr_text (text, nullable)
- ocr_status (text, nullable)
- ocr_engine (text, nullable)

---

## 13) Stitching Order (Build Plan)
1) Bootstrap Kiranism app on Railway (Clerk works).
2) Add Supabase schema + RLS (Razikus).
3) Patient + Visit CRUD.
4) Prescription builder + templates + drug dataset.
5) PDF generation + preview.
6) Document upload + OCR (conditional) + AI summary + timeline.
7) Share via WhatsApp + Resend.
8) Add Hindi instruction templates.

---

## 14) Parallel Build Plan (Async Agents)
- Follow the parallelization rules in `PARALLEL_BUILD_MATRIX.md`.
- Phase 0 is sequential and must complete before parallel work.
- Phase 1/2/3 streams can run in parallel only after dependencies are met.

---

## 15) Acceptance Criteria
- New patient visit + Rx in under 2 minutes.
- Follow-up Rx in under 60 seconds.
- Outside record summary + timeline works reliably.
- AI never auto-finalizes or auto-adds meds.
- Search works across name/surname/phone/UHID.

---

## 16) Decision Log (Locked)
- Base UI: Kiranism starter (Horizon style reference).
- Auth: Clerk.
- DB/Storage: Supabase.
- Email: Resend.
- OCR: Azure Read OCR.
- Hosting: Railway.
- AI: vercel/ai SDK.
- No autoprescribing.
- Single doctor only.
- Hindi instructions: template-only, deterministic.

---

## 17) Companion App: Appointment Booking System

### Overview
After EMR MVP is complete, build a separate Appointment Booking App as a companion product. This app will share infrastructure with EMR to avoid data sync issues.

### Architecture Decision (Locked)
- **Hosting:** Separate Railway instance ($5/mo) – keeps EMR isolated
- **Database:** SAME Supabase instance as EMR (shared patients, doctors)
- **Auth:** SAME Clerk instance as EMR (shared user accounts)
- **UI Base:** Kiranism/next-shadcn-dashboard-starter (same as EMR) or lighter alternative

### Why Same Database?
- Patients who book appointments = patients who get prescriptions
- No data duplication or sync nightmares
- Appointment becomes a Visit in EMR automatically
- Single source of truth for patient data

### Shared Tables (EMR + Appointment)
- patients
- doctors/users

### New Tables (Appointment App Only)
- appointments (date, time, status, patient_id, doctor_id)
- slots (availability configuration)
- appointment_settings

### App Separation
```
EMR App (Railway #1)           → Doctor-facing
Appointment App (Railway #2)   → Patient-facing + Doctor calendar
Both connect to               → Same Supabase + Same Clerk
```

### Features (Appointment App MVP)
- Patient self-booking (public booking page)
- Doctor availability management
- Appointment confirmation/cancellation
- SMS/WhatsApp reminders (Twilio or react-share)
- Calendar view for doctor

### What NOT to Include (Appointment App MVP)
- Voice agent
- AI scheduling
- Complex multi-location support
- Billing integration

### Proven Repos to Consider
- react-big-calendar (calendar UI)
- Cal.com patterns (scheduling logic reference)
- Same stack: Next.js + Supabase + Clerk + shadcn

### Build Order
1. Complete EMR MVP first
2. Database schema already has patients table
3. Add appointments + slots tables to same Supabase
4. Build Appointment App UI in new repo
5. Deploy to separate Railway instance

### Cost Summary (Both Apps Running)
| Component | Cost |
|-----------|------|
| EMR (Railway) | $5/mo |
| Appointment (Railway) | $5/mo |
| Supabase (shared) | Free → $25/mo |
| Clerk (shared) | Free up to 10k |
| **Total** | **$10-35/mo** |

### Reference
- Previous over-engineered attempt: https://github.com/drshailesh88/appointment_system
- Do NOT use that codebase. Start fresh with proven repo philosophy.

---

## 18) Open Items (Future, Not MVP)
- Multi-doctor clinics.
- Billing/invoicing.
- Voice input.
- OCR accuracy improvements.
- AI-based Hindi translation.
- Appointment ↔ EMR deep integration (auto-create visit from appointment).

