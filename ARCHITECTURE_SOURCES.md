# Architecture: What Comes From Where

## The Simple Answer

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   YOUR APP = MOLTBOT (brain) + CASEFOLD (UI) + SUPABASE (database)         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Visual Breakdown

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           WHAT YOU'RE BUILDING                               │
│                        "AI Clinical Coordinator"                             │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐
│                   │    │                   │    │                   │
│     MOLTBOT       │    │     CASEFOLD      │    │     SUPABASE      │
│   (The Brain)     │    │    (The Face)     │    │  (The Memory)     │
│                   │    │                   │    │                   │
│  Already built:   │    │  Already built:   │    │  You configure:   │
│  • WhatsApp       │    │  • Prescription   │    │  • patients       │
│  • Memory         │    │    builder        │    │  • visits         │
│  • Cron/Reminders │    │  • PDF generation │    │  • prescriptions  │
│  • Tool calling   │    │  • Hindi templates│    │  • appointments   │
│  • TTS            │    │  • Patient forms  │    │  • tasks          │
│  • Sessions       │    │  • Timeline view  │    │  • messages       │
│                   │    │  • Auth (Clerk)   │    │                   │
└─────────┬─────────┘    └─────────┬─────────┘    └─────────┬─────────┘
          │                        │                        │
          │                        │                        │
          └────────────────────────┼────────────────────────┘
                                   │
                                   ▼
                    ┌───────────────────────────┐
                    │                           │
                    │    GLUE CODE (You write)  │
                    │    ~500 lines total       │
                    │                           │
                    │  • Tool definitions       │
                    │  • API routes             │
                    │  • Event handlers         │
                    │                           │
                    └───────────────────────────┘
```

---

## Component by Component

### 1. MOLTBOT Provides (The Secretary's Brain)

```
FROM: github.com/moltbot/moltbot
WHAT: The "thinking" and "communication" layer

┌─────────────────────────────────────────────────────────────┐
│  MOLTBOT                                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📱 WhatsApp Integration (extensions/whatsapp/)             │
│     • Receive patient messages                              │
│     • Send replies, PDFs, voice notes                       │
│     • Handle media (images, voice, documents)               │
│                                                             │
│  🧠 Agent Runtime (src/agents/)                             │
│     • Process messages                                      │
│     • Call tools (YOUR tools)                               │
│     • Make decisions                                        │
│                                                             │
│  💾 Memory System (src/memory/)                             │
│     • Remember conversations                                │
│     • Search past interactions                              │
│     • Embeddings for semantic search                        │
│                                                             │
│  ⏰ Cron/Scheduling (src/cron/)                             │
│     • Follow-up reminders                                   │
│     • "Due today" notifications                             │
│     • Scheduled messages                                    │
│                                                             │
│  🔊 Voice (src/tts/, skills/whisper/)                       │
│     • Text-to-speech                                        │
│     • Speech-to-text                                        │
│                                                             │
│  🌐 Gateway (src/gateway/)                                  │
│     • WebSocket server                                      │
│     • Connects to your UI                                   │
│     • Handles all communication                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. CASEFOLD Provides (The Doctor's Interface)

```
FROM: github.com/drshailesh88/casefold
WHAT: The UI components doctors interact with

┌─────────────────────────────────────────────────────────────┐
│  CASEFOLD (emr-app/)                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📝 Prescription Builder                                    │
│     • Form with brand, dose, frequency, pattern             │
│     • Dropdowns for common values                           │
│     • Add/remove medications                                │
│     FILE: features/prescriptions/components/                │
│           prescription-builder.tsx                          │
│                                                             │
│  📄 PDF Generation                                          │
│     • @react-pdf/renderer                                   │
│     • A4 format with header, patient info, Rx table         │
│     • Signature area                                        │
│     FILE: features/prescriptions/components/                │
│           prescription-pdf.tsx                              │
│                                                             │
│  🇮🇳 Hindi Templates                                        │
│     • Pattern "101" → "सुबह-रात"                            │
│     • "after meals" → "खाने के बाद"                          │
│     • Deterministic, no AI needed                           │
│     FILE: lib/i18n/hindi-templates.ts                       │
│                                                             │
│  👤 Patient Components                                      │
│     • Patient forms                                         │
│     • Visit forms                                           │
│     • Timeline view                                         │
│     FILE: features/patients/, features/visits/,             │
│           features/timeline/                                │
│                                                             │
│  🎨 UI Components (Shadcn)                                  │
│     • Buttons, Forms, Cards, Tables                         │
│     • Already styled and working                            │
│     FILE: components/ui/                                    │
│                                                             │
│  🔐 Auth (Clerk)                                            │
│     • Doctor login                                          │
│     • Session management                                    │
│     FILE: Already configured                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3. SUPABASE Provides (The Database)

```
FROM: supabase.com (hosted service)
WHAT: Where all data lives

┌─────────────────────────────────────────────────────────────┐
│  SUPABASE                                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📊 Database Tables                                         │
│     • patients                                              │
│     • visits / encounters                                   │
│     • prescriptions                                         │
│     • prescription_items                                    │
│     • appointments                                          │
│     • tasks (follow-ups)                                    │
│     • messages / interactions                               │
│     • private_notes                                         │
│                                                             │
│  📁 File Storage                                            │
│     • Prescription PDFs                                     │
│     • Uploaded reports                                      │
│     • Voice notes                                           │
│                                                             │
│  🔄 Realtime                                                │
│     • Live updates to queue                                 │
│     • New message notifications                             │
│                                                             │
│  🔒 Row Level Security                                      │
│     • Doctor can only see their patients                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4. YOU BUILD (The Glue)

```
YOU WRITE: ~500 lines of glue code

┌─────────────────────────────────────────────────────────────┐
│  YOUR CODE                                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔧 Tool Definitions (~200 lines)                           │
│     Tell Moltbot what it can do:                            │
│     • find_patient()                                        │
│     • create_appointment()                                  │
│     • draft_prescription()                                  │
│     • send_reminder()                                       │
│                                                             │
│  🔌 API Routes (~150 lines)                                 │
│     Connect tools to Supabase:                              │
│     • POST /api/tools/find-patient                          │
│     • POST /api/tools/create-appointment                    │
│     • etc.                                                  │
│                                                             │
│  🎯 Event Handlers (~100 lines)                             │
│     React to events:                                        │
│     • New WhatsApp message → triage                         │
│     • Prescription signed → send PDF                        │
│     • Follow-up due → remind                                │
│                                                             │
│  🖼️ 3-Panel Layout (~50 lines)                              │
│     Arrange casefold components:                            │
│     • Left: Queue                                           │
│     • Middle: Prescription                                  │
│     • Right: Moltbot WebChat                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## How They Connect (Data Flow)

```
PATIENT                          DOCTOR
   │                                │
   │ WhatsApp                       │ Browser
   │                                │
   ▼                                ▼
┌──────────┐                 ┌─────────────┐
│          │                 │             │
│ MOLTBOT  │◄───WebSocket───►│  CASEFOLD   │
│          │                 │    UI       │
└────┬─────┘                 └──────┬──────┘
     │                              │
     │  Tool Calls                  │  API Calls
     │  (find_patient,              │  (save prescription,
     │   create_task, etc)          │   update patient, etc)
     │                              │
     └──────────────┬───────────────┘
                    │
                    ▼
             ┌─────────────┐
             │             │
             │  SUPABASE   │
             │  (Database) │
             │             │
             └─────────────┘
```

---

## Concrete Example: Patient Sends Message

```
1. PATIENT sends WhatsApp: "Mujhe BP ki dawai chahiye"
                │
                ▼
2. MOLTBOT (WhatsApp extension) receives message
                │
                ▼
3. MOLTBOT (Agent) processes:
   - Calls tool: find_patient(phone="+91...")
   - Tool queries SUPABASE → returns patient info
   - Calls tool: get_previous_prescriptions(patient_id)
   - Tool queries SUPABASE → returns last Rx
                │
                ▼
4. MOLTBOT drafts response:
   "Rajesh ji, aapka last prescription:
    Telmisartan 40mg - 14 din
    Kya same dawai chahiye?"
                │
                ▼
5. If patient confirms, MOLTBOT:
   - Calls tool: create_prescription_draft(...)
   - Tool writes to SUPABASE (status: "pending_approval")
                │
                ▼
6. DOCTOR sees in CASEFOLD UI:
   ┌─────────────────────────────────┐
   │ PENDING APPROVAL                │
   │ Rajesh Kumar - Refill Request   │
   │ Telmisartan 40mg OD x 14 days   │
   │ [Approve] [Edit] [Reject]       │
   └─────────────────────────────────┘
                │
                ▼
7. Doctor clicks [Approve]:
   - CASEFOLD calls API → SUPABASE marks as approved
   - CASEFOLD generates PDF using prescription-pdf.tsx
   - PDF uploaded to SUPABASE storage
                │
                ▼
8. MOLTBOT (via cron/webhook):
   - Detects prescription approved
   - Sends PDF to patient via WhatsApp
   - Logs interaction in SUPABASE
```

---

## What You DO NOT Build From Scratch

| Component | Source | Lines of Code You Write |
|-----------|--------|------------------------|
| WhatsApp integration | Moltbot | 0 |
| Message handling | Moltbot | 0 |
| Memory/search | Moltbot | 0 |
| Cron/scheduling | Moltbot | 0 |
| TTS/STT | Moltbot | 0 |
| Prescription form | Casefold | 0 |
| PDF generation | Casefold | 0 |
| Hindi translation | Casefold | 0 |
| Patient forms | Casefold | 0 |
| UI components | Casefold | 0 |
| Database | Supabase | 0 (just config) |
| Auth | Clerk (in Casefold) | 0 |
| **Tool definitions** | YOU | ~200 |
| **API routes** | YOU | ~150 |
| **Event handlers** | YOU | ~100 |
| **Layout arrangement** | YOU | ~50 |

**Total you write: ~500 lines**
**Total in final app: ~50,000+ lines** (from Moltbot + Casefold)

---

## Repository Structure (Final)

```
your-clinic-app/
├── moltbot/                    # Git submodule or fork
│   └── (74,000+ lines)         # You don't touch most of this
│
├── ui/                         # Fork of Casefold's emr-app
│   ├── src/
│   │   ├── features/           # From Casefold
│   │   │   ├── prescriptions/  # Keep as-is
│   │   │   ├── patients/       # Keep as-is
│   │   │   └── timeline/       # Keep as-is
│   │   │
│   │   ├── app/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx    # YOUR 3-panel layout
│   │   │   │
│   │   │   └── api/
│   │   │       └── tools/      # YOUR tool endpoints
│   │   │           ├── find-patient/route.ts
│   │   │           ├── create-task/route.ts
│   │   │           └── ...
│   │   │
│   │   └── lib/
│   │       └── moltbot/        # YOUR glue code
│   │           ├── tools.ts    # Tool definitions
│   │           └── handlers.ts # Event handlers
│   │
│   └── package.json
│
├── supabase/
│   └── migrations/             # Database schema
│
└── docker-compose.yml          # Runs everything together
```

---

## One Sentence Summary

**Moltbot is the brain that talks to patients, Casefold is the face that doctors use, Supabase is the memory that stores everything, and you write ~500 lines to connect them.**
