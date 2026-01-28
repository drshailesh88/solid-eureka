# Moltbot Medical Fork Specification
## AI Clinical Coordinator for Doctors

This document specifies how to fork Moltbot (74k+ stars) into a medical-safe clinical coordinator.

---

## Executive Summary

**Goal:** Transform Moltbot from a general-purpose AI assistant into a constrained clinical coordinator that:
- Handles patient WhatsApp communication
- Manages appointments and follow-ups
- Assists with prescription writing
- Never makes clinical decisions independently

**Key Insight:** Moltbot already has the hard parts built (WhatsApp, memory, cron, tool-calling). We strip dangerous capabilities and add medical UI.

---

## Moltbot Architecture Overview

```
/moltbot-analysis/
├── src/                    # Core source (52 subdirectories)
│   ├── agents/             # Agent runtime, tool execution, bash tools
│   ├── browser/            # Chrome/Chromium automation (DANGEROUS)
│   ├── canvas-host/        # A2UI agent-driven visual workspace
│   ├── channels/           # Channel abstraction layer
│   ├── cron/               # Scheduled tasks (KEEP)
│   ├── gateway/            # WebSocket control plane (KEEP)
│   ├── memory/             # Embeddings + SQLite memory (KEEP)
│   ├── security/           # Audit, permissions
│   ├── sessions/           # Session management (KEEP)
│   ├── terminal/           # Terminal emulation (REMOVE)
│   └── whatsapp/           # WhatsApp utilities
├── extensions/             # Channel plugins (31 total)
│   ├── whatsapp/           # WhatsApp via Baileys (KEEP)
│   ├── telegram/           # Telegram (OPTIONAL)
│   └── [others]/           # Discord, Slack, etc (REMOVE)
├── skills/                 # Tool plugins (55 total)
│   ├── summarize/          # Text summarization (KEEP)
│   ├── openai-whisper/     # Speech-to-text (KEEP)
│   ├── coding-agent/       # Code execution (REMOVE)
│   └── [others]/           # Various integrations
├── ui/                     # Web UI (REPLACE)
├── apps/                   # Native apps (REMOVE)
│   ├── ios/
│   ├── android/
│   └── macos/
└── vendor/                 # A2UI framework
```

---

## Modules to REMOVE (Dangerous)

### 1. Browser Automation (`src/browser/`)
**Risk Level:** CRITICAL
**Size:** 450KB+ of code
**What it does:** Full Chrome DevTools Protocol control - can browse web, fill forms, screenshot, download files

**Files to delete:**
```
src/browser/              # Entire directory (68 files)
```

### 2. Shell/Bash Execution (`src/agents/bash-tools*`)
**Risk Level:** CRITICAL
**Size:** 51KB main file alone
**What it does:** Executes arbitrary shell commands, PTY allocation, process management

**Files to delete:**
```
src/agents/bash-tools.exec.ts        # 51KB - shell execution
src/agents/bash-tools.process.ts     # Process management
src/agents/bash-tools.shared.ts      # Shared utilities
src/agents/bash-tools.ts             # Entry point
src/agents/bash-process-registry.ts  # Process tracking
src/agents/pty-*.ts                  # PTY handling
src/agents/shell-utils.ts            # Shell utilities
```

### 3. Terminal Emulation (`src/terminal/`)
**Risk Level:** HIGH
**What it does:** ANSI terminal rendering, interactive sessions

**Files to delete:**
```
src/terminal/             # Entire directory
```

### 4. Canvas/A2UI (`src/canvas-host/`, `vendor/a2ui/`)
**Risk Level:** MEDIUM
**What it does:** Agent-driven visual workspace, eval capabilities

**Files to delete:**
```
src/canvas-host/          # Canvas hosting
vendor/a2ui/              # A2UI framework
```

### 5. Native Apps (`apps/`)
**Risk Level:** MEDIUM (attack surface)
**What it does:** iOS, Android, macOS companion apps

**Files to delete:**
```
apps/                     # Entire directory
Swabble/                  # macOS Swift app
```

### 6. Dangerous Skills
**Files to delete:**
```
skills/coding-agent/      # Code execution
skills/tmux/              # Terminal multiplexer
skills/camsnap/           # Camera access
skills/peekaboo/          # Screen capture
skills/github/            # GitHub API access
skills/1password/         # Password manager
skills/bitwarden/         # Password manager
```

### 7. Unnecessary Extensions
**Files to delete:**
```
extensions/discord/
extensions/slack/
extensions/msteams/
extensions/matrix/
extensions/signal/        # Keep if needed
extensions/telegram/      # Keep if needed
extensions/bluebubbles/
extensions/imessage/
extensions/googlechat/
extensions/line/
extensions/nostr/
extensions/twitch/
extensions/zalo/
extensions/tlon/
extensions/mattermost/
extensions/nextcloud-talk/
```

---

## Modules to KEEP (Essential)

### 1. Gateway (`src/gateway/`)
**Why:** WebSocket control plane, session management, HTTP API
**Size:** ~150 files
**Key files:**
```
src/gateway/server.impl.ts           # Main server
src/gateway/server-chat.ts           # Chat handling
src/gateway/server-channels.ts       # Channel routing
src/gateway/server-cron.ts           # Cron integration
src/gateway/session-utils.ts         # Session management
```

### 2. Memory System (`src/memory/`)
**Why:** Patient narrative memory, search, embeddings
**Key files:**
```
src/memory/manager.ts                # 73KB - main memory manager
src/memory/embeddings.ts             # Embedding generation
src/memory/hybrid.ts                 # Hybrid search
src/memory/sqlite.ts                 # SQLite storage
src/memory/memory-schema.ts          # Schema definitions
```

### 3. Cron/Scheduling (`src/cron/`)
**Why:** Follow-up reminders, scheduled tasks
**Key files:**
```
src/cron/service.ts                  # Cron service
src/cron/schedule.ts                 # Scheduling logic
src/cron/store.ts                    # Job storage
```

### 4. WhatsApp Extension (`extensions/whatsapp/`)
**Why:** Patient communication channel
**Dependencies:** Baileys library
**Key files:**
```
extensions/whatsapp/index.ts
extensions/whatsapp/src/             # WhatsApp implementation
```

### 5. Sessions (`src/sessions/`)
**Why:** Conversation state management
**Key files:**
```
src/sessions/session-key-utils.ts
src/sessions/session-store.ts
```

### 6. Tool Policy System (`src/agents/pi-tools.policy.ts`)
**Why:** Allow/deny tool access - CRITICAL for safety
**How it works:**
```typescript
// Example: Restrict to only these tools
const policy = {
  allow: [
    "getPatient",
    "searchRecords",
    "createTask",
    "draftMessage",
    "triageMessage"
  ],
  deny: [
    "exec",           // No shell
    "browser_*",      // No browser
    "sessions_spawn", // No subagents
    "*"               // Deny everything else
  ]
};
```

### 7. Useful Skills to Keep
```
skills/summarize/         # Text summarization
skills/openai-whisper/    # Speech-to-text (for voice notes)
skills/openai-whisper-api/
skills/weather/           # Harmless, useful for small talk
```

---

## UI Replacement Strategy

### Current Moltbot UI (`ui/`)
- Generic chat interface
- Control panel for settings
- Channel management
- NOT suitable for clinical workflow

### Required: Medical UI (3-Panel Layout)

```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER: Dr. Name | Clinic Name | DND Toggle | Settings            │
├─────────────────┬─────────────────────────┬─────────────────────────┤
│                 │                         │                         │
│  PANEL 1:       │  PANEL 2:               │  PANEL 3:               │
│  PATIENT QUEUE  │  PRESCRIPTION           │  SECRETARY CHAT         │
│                 │                         │                         │
│  ┌───────────┐  │  Patient: [Name, Age]   │  [Chat Interface]       │
│  │ 9:30 AM   │  │  ─────────────────────  │                         │
│  │ Rajesh K  │  │  Last Visit Summary     │  Secretary: Patient     │
│  │ Follow-up │  │  (AI generated)         │  Ramesh sent reports.   │
│  │ [Arrived] │  │                         │  Should I summarize?    │
│  ├───────────┤  │  ─────────────────────  │                         │
│  │ 10:00 AM  │  │  Chief Complaint:       │  Doctor: Yes, and       │
│  │ Shweta S  │  │  [Free text input]      │  check if BP readings   │
│  │ New       │  │                         │  are included.          │
│  │ [Waiting] │  │  ─────────────────────  │                         │
│  ├───────────┤  │  Diagnosis:             │  Secretary: BP: 140/90  │
│  │ 10:30 AM  │  │  [Searchable dropdown]  │  on 3 occasions. HbA1c  │
│  │ Abdul K   │  │                         │  7.2%. Suggesting poor  │
│  │ Post-PCI  │  │  ─────────────────────  │  control...             │
│  │ [Done]    │  │  Medications:           │                         │
│  └───────────┘  │  [Drug] [Dose] [Freq]   │  [Input field]          │
│                 │  [+ Add medication]     │                         │
│  ─────────────  │                         │  ─────────────────────  │
│  DUE TODAY:     │  ─────────────────────  │  PENDING APPROVALS:     │
│  • 3 follow-ups │  Follow-up: [14 days]   │  • Reply to Ramesh      │
│  • 2 overdue    │                         │  • Reminder to Shweta   │
│                 │  [Finalize & Sign]      │  [Approve All]          │
│                 │                         │                         │
└─────────────────┴─────────────────────────┴─────────────────────────┘
```

### UI Technology Options

1. **Build custom Next.js UI** (connects to Moltbot gateway via WebSocket)
2. **Fork Ottehr UI components** (React, TypeScript, medical-focused)
3. **Use Moltbot's WebChat** as Panel 3 only, build Panels 1-2 separately

**Recommended:** Option 1 - Custom Next.js that:
- Embeds Moltbot WebChat for secretary panel
- Builds patient queue and prescription UI fresh
- Connects to same Supabase database

---

## Medical-Safe Tool API

### Tools the Secretary CAN Use

```typescript
// Read Operations (Safe)
const readTools = {
  // Patient lookup
  find_patient: {
    description: "Search for patient by name or phone",
    parameters: { query: "string" },
    returns: "Patient[]"
  },

  // Get patient context
  get_patient_snapshot: {
    description: "Get patient summary, last visit, active problems",
    parameters: { patient_id: "uuid" },
    returns: "PatientSnapshot"
  },

  // Queue management
  list_today_queue: {
    description: "List today's appointments",
    parameters: { date: "date" },
    returns: "Appointment[]"
  },

  // Task queries
  list_overdue_tasks: {
    description: "List overdue follow-ups and pending items",
    parameters: { severity: "low|medium|high" },
    returns: "Task[]"
  }
};

// Write Operations (Non-Clinical, Safe)
const writeTools = {
  // Task management
  create_task: {
    description: "Create a follow-up task",
    parameters: {
      patient_id: "uuid",
      due_date: "date",
      reason: "string",
      type: "follow_up|lab_review|call_patient"
    }
  },

  mark_task_done: {
    description: "Mark a task as completed",
    parameters: { task_id: "uuid" }
  },

  // Communication (drafts only)
  draft_message: {
    description: "Draft a message for doctor approval",
    parameters: {
      patient_id: "uuid",
      purpose: "reminder|instruction|response",
      language: "en|hi",
      content: "string"
    },
    returns: "MessageDraft"  // NOT sent automatically
  },

  // Interaction logging
  log_interaction: {
    description: "Log a patient interaction",
    parameters: {
      patient_id: "uuid",
      channel: "whatsapp|call|visit",
      direction: "inbound|outbound",
      content: "string"
    }
  },

  // Triage (classification only)
  triage_message: {
    description: "Classify message urgency",
    parameters: { message: "string" },
    returns: "emergency|urgent|routine|admin"
  }
};

// Write Operations (Clinical - Draft Only, Doctor Must Approve)
const clinicalDraftTools = {
  create_note_draft: {
    description: "Draft clinical note from conversation",
    parameters: {
      encounter_id: "uuid",
      text: "string",
      source: "assistant"  // Always marked as AI-generated
    },
    returns: "NoteDraft"  // Doctor must review and sign
  },

  propose_followup: {
    description: "Suggest follow-up based on conversation",
    parameters: {
      encounter_id: "uuid",
      due_date: "date",
      reason: "string"
    },
    returns: "FollowupProposal"  // Doctor must approve
  }
};
```

### Tools the Secretary CANNOT Use

```typescript
// FORBIDDEN - These do not exist in medical fork
const forbiddenTools = [
  "exec",                    // No shell commands
  "browser_*",               // No web browsing
  "file_read",               // No arbitrary file access
  "file_write",              // No file writing
  "sessions_spawn",          // No spawning subagents
  "gateway",                 // No gateway control
  "sign_prescription",       // NEVER - doctor only
  "edit_signed_prescription", // NEVER
  "modify_diagnosis",        // NEVER
  "send_message",            // Only draft_message allowed
];
```

---

## Configuration for Medical Safety

### moltbot.config.json
```json
{
  "identity": {
    "name": "Clinical Coordinator",
    "role": "I am a clinical coordinator assistant. I help manage patient communications, appointments, and documentation. I never make clinical decisions - only doctors do that."
  },

  "tools": {
    "allow": [
      "find_patient",
      "get_patient_snapshot",
      "list_today_queue",
      "list_overdue_tasks",
      "create_task",
      "mark_task_done",
      "draft_message",
      "log_interaction",
      "triage_message",
      "create_note_draft",
      "propose_followup",
      "memory_search",
      "summarize"
    ],
    "deny": [
      "exec",
      "browser_*",
      "file_*",
      "sessions_spawn",
      "gateway",
      "*"
    ]
  },

  "channels": {
    "whatsapp": {
      "enabled": true,
      "autoReply": {
        "emergency": true,
        "routine": false
      }
    }
  },

  "safety": {
    "requireApprovalFor": [
      "send_message",
      "clinical_*"
    ],
    "autoApproveTemplates": [
      "appointment_confirmation",
      "clinic_address",
      "wait_time",
      "medication_timing"
    ]
  }
}
```

---

## Database Schema (Supabase)

```sql
-- Core entities
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  age INT,
  sex TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WhatsApp number to patient mapping (families)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE conversation_patients (
  conversation_id UUID REFERENCES conversations(id),
  patient_id UUID REFERENCES patients(id),
  is_primary BOOLEAN DEFAULT false,
  PRIMARY KEY (conversation_id, patient_id)
);

-- Clinical encounters
CREATE TABLE encounters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  appointment_id UUID,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  status TEXT DEFAULT 'in_progress'
);

-- Notes (source of truth)
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encounter_id UUID REFERENCES encounters(id),
  content TEXT NOT NULL,
  source TEXT DEFAULT 'doctor', -- 'doctor' | 'assistant_draft'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prescriptions
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encounter_id UUID REFERENCES encounters(id),
  medications JSONB NOT NULL,
  pdf_url TEXT,
  signed_at TIMESTAMPTZ,
  signed_by UUID
);

-- Tasks (CRM)
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  encounter_id UUID REFERENCES encounters(id),
  type TEXT NOT NULL, -- 'follow_up' | 'lab_review' | 'call'
  due_date DATE NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Private doctor notes (not visible to patients)
CREATE TABLE private_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Message drafts (require approval)
CREATE TABLE message_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  content TEXT NOT NULL,
  purpose TEXT,
  status TEXT DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interaction log
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  channel TEXT NOT NULL,
  direction TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Implementation Phases

### Phase 1: Strip Moltbot (Week 1)
1. Fork moltbot/moltbot
2. Delete all REMOVE directories/files listed above
3. Update package.json to remove unused dependencies
4. Verify WhatsApp + Memory + Cron still work
5. Test with constrained tool policy

### Phase 2: Database + Tools (Week 2)
1. Set up Supabase with schema above
2. Implement medical tool API (read/write tools)
3. Connect tools to Moltbot via skills or direct integration
4. Test patient lookup, task creation, message drafting

### Phase 3: Medical UI (Week 3-4)
1. Create Next.js app with 3-panel layout
2. Panel 1: Patient queue (Supabase + realtime)
3. Panel 2: Prescription writing
4. Panel 3: Embed Moltbot WebChat or custom chat
5. Connect UI to Supabase and Moltbot gateway

### Phase 4: Integration (Week 5)
1. WhatsApp → Secretary → Doctor approval flow
2. Prescription → Follow-up task creation
3. DND modes and digest scheduling
4. Testing in real clinic environment

---

## Files Changed Summary

### Delete (~2500 files)
```
src/browser/           # 68 files
src/terminal/          # 12 files
src/canvas-host/       # 15 files
src/agents/bash-*      # 15 files
vendor/a2ui/           # 200+ files
apps/                  # 500+ files
Swabble/               # 100+ files
extensions/[17 dirs]/  # 400+ files
skills/[45 dirs]/      # 1000+ files
```

### Keep (~800 files)
```
src/gateway/           # 150 files
src/memory/            # 35 files
src/cron/              # 25 files
src/sessions/          # 20 files
src/agents/[core]      # 100 files (minus bash-*)
extensions/whatsapp/   # 10 files
skills/[3 dirs]/       # 30 files
ui/                    # 50 files (to be replaced)
```

### Add (new)
```
medical-ui/            # New Next.js app
skills/medical/        # Medical-specific tools
config/medical.json    # Medical safety config
```

---

## Risk Mitigation

1. **No shell access** - bash-tools completely removed
2. **No browser** - browser automation completely removed
3. **Tool allowlist** - Only medical tools exist
4. **Draft-only clinical** - AI drafts, doctor signs
5. **Audit trail** - All AI actions logged
6. **Message approval** - No auto-send without templates

---

## Next Steps

1. **Confirm this spec** with user
2. **Create stripped fork** of Moltbot
3. **Build medical UI** separately
4. **Test with real clinic workflow**
