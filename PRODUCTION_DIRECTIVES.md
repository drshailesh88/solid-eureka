# Production Directives (MANDATORY)

These are NON-NEGOTIABLE requirements that MUST be completed before any production deployment.

---

## Directive 1: Remove Baileys → Connect WhatsApp Official API

### Current State (MVP/Testing)
- MoltBot uses Baileys (unofficial WhatsApp Web reverse-engineering)
- Violates WhatsApp Terms of Service
- Risk: Number could be banned

### Production Requirement
```
BEFORE PRODUCTION:
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  1. REMOVE all Baileys code from the codebase                          │
│     └── extensions/whatsapp/ (MoltBot's Baileys integration)           │
│                                                                         │
│  2. REGISTER as WhatsApp Tech Provider                                 │
│     └── One-time Meta approval (2-4 weeks)                             │
│     └── Allows Embedded Signup for doctors                             │
│                                                                         │
│  3. IMPLEMENT Meta Cloud API integration                               │
│     └── Webhook endpoint for incoming messages                         │
│     └── API calls for outgoing messages                                │
│     └── Embedded Signup for doctor onboarding                          │
│                                                                         │
│  4. TEST thoroughly                                                     │
│     └── Message send/receive                                           │
│     └── Media (PDFs, images)                                           │
│     └── Template messages                                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Files to Remove
```
# From MoltBot fork:
extensions/whatsapp/          # Entire Baileys integration
src/whatsapp/                 # WhatsApp utilities (if any)
node_modules/@whiskeysockets/ # Baileys dependency
```

### Files to Add
```
# New official integration:
src/channels/whatsapp-official/
├── webhook.ts           # Receive messages from Meta
├── api.ts               # Send messages via Meta API
├── templates.ts         # Template message management
├── embedded-signup.ts   # Doctor onboarding flow
└── types.ts             # Meta API types
```

### Verification Checklist
- [ ] No Baileys code remains in codebase
- [ ] No `@whiskeysockets/baileys` in package.json
- [ ] Meta Cloud API webhook receives messages
- [ ] Meta Cloud API sends messages successfully
- [ ] Embedded Signup works for new doctors
- [ ] Template messages approved by Meta
- [ ] Media sending works (PDFs)

---

## Directive 2: Make MoltBot Safe

### Current State (MVP/Testing)
- MoltBot has dangerous capabilities:
  - Shell command execution (bash)
  - Browser automation (can browse web)
  - File system access
  - Terminal emulation
  - Code execution

### Production Requirement
```
BEFORE PRODUCTION:
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  REMOVE these modules completely:                                      │
│                                                                         │
│  □ src/browser/              # Chrome automation - CRITICAL            │
│  □ src/terminal/             # Terminal emulation                      │
│  □ src/canvas-host/          # A2UI agent workspace                    │
│  □ src/agents/bash-*         # Shell execution - CRITICAL              │
│  □ src/agents/pty-*          # PTY handling                            │
│  □ src/agents/shell-*        # Shell utilities                         │
│  □ vendor/a2ui/              # A2UI framework                          │
│  □ apps/                     # Mobile apps (not needed)                │
│  □ Swabble/                  # macOS app (not needed)                  │
│                                                                         │
│  REMOVE these extensions:                                              │
│                                                                         │
│  □ extensions/discord/                                                 │
│  □ extensions/slack/                                                   │
│  □ extensions/msteams/                                                 │
│  □ extensions/matrix/                                                  │
│  □ extensions/bluebubbles/                                             │
│  □ extensions/imessage/                                                │
│  □ extensions/googlechat/                                              │
│  □ extensions/line/                                                    │
│  □ extensions/nostr/                                                   │
│  □ extensions/twitch/                                                  │
│  □ extensions/zalo/                                                    │
│  □ extensions/tlon/                                                    │
│  □ extensions/mattermost/                                              │
│  □ extensions/nextcloud-talk/                                          │
│                                                                         │
│  REMOVE these dangerous skills:                                        │
│                                                                         │
│  □ skills/coding-agent/      # Code execution                          │
│  □ skills/tmux/              # Terminal multiplexer                    │
│  □ skills/camsnap/           # Camera access                           │
│  □ skills/peekaboo/          # Screen capture                          │
│  □ skills/github/            # GitHub API (not needed)                 │
│  □ skills/1password/         # Password manager                        │
│  □ skills/bitwarden/         # Password manager                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### KEEP these modules (essential)
```
# Core functionality:
src/gateway/           # API server
src/memory/            # Conversation memory
src/cron/              # Scheduling
src/sessions/          # Session management
src/agents/[core]      # Agent runtime (minus bash-*)
src/security/          # Audit, permissions

# Essential skills:
skills/summarize/      # Text summarization
skills/openai-whisper/ # Voice transcription
skills/weather/        # Harmless, useful for small talk
```

### Tool Policy (Medical Safety)

Create `config/medical-tool-policy.json`:
```json
{
  "allow": [
    "find_patient",
    "get_patient_snapshot",
    "list_today_queue",
    "list_overdue_tasks",
    "get_previous_prescriptions",
    "create_appointment",
    "create_task",
    "log_interaction",
    "draft_message",
    "record_vitals",
    "get_vitals_trend",
    "add_walk_in",
    "get_queue_status",
    "record_payment",
    "get_daily_collection",
    "order_lab_tests",
    "get_patient_documents",
    "check_drug_allergy",
    "transcribe_voice",
    "memory_search",
    "summarize"
  ],
  "deny": [
    "exec",
    "browser_*",
    "file_read",
    "file_write",
    "sessions_spawn",
    "gateway",
    "sign_prescription",
    "edit_signed_prescription",
    "modify_diagnosis",
    "send_message",
    "delete_patient",
    "delete_encounter",
    "modify_payment_history",
    "*"
  ]
}
```

### Verification Checklist
- [ ] No shell execution code remains
- [ ] No browser automation code remains
- [ ] No file system write access
- [ ] Tool policy denies all dangerous operations
- [ ] AI cannot sign prescriptions (doctor only)
- [ ] AI cannot send messages without approval
- [ ] All AI actions logged in audit table
- [ ] Security audit passed

---

## Directive 3: White-Label MoltBot (No Evidence of Copying)

### Current State
- Code is clearly a MoltBot fork
- MoltBot branding throughout
- License requires attribution (but we can white-label)

### Production Requirement
```
BEFORE PRODUCTION:
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  1. RENAME all MoltBot references                                      │
│                                                                         │
│     MoltBot        → ClinicalCoordinator (or your brand)              │
│     moltbot        → coordinator                                       │
│     Molt           → CC (or abbreviation)                              │
│                                                                         │
│  2. REMOVE all MoltBot branding                                        │
│                                                                         │
│     □ Logo files                                                       │
│     □ Splash screens                                                   │
│     □ About pages                                                      │
│     □ Documentation references                                         │
│     □ Package names (npm)                                              │
│     □ Docker image names                                               │
│     □ Environment variable prefixes                                    │
│                                                                         │
│  3. UPDATE configuration                                               │
│                                                                         │
│     □ config/identity.json - Change name, description                  │
│     □ package.json - Change name, author, repository                   │
│     □ docker-compose.yml - Change image names                          │
│     □ README.md - Write your own                                       │
│                                                                         │
│  4. CREATE new branding                                                │
│                                                                         │
│     □ Your logo                                                        │
│     □ Your color scheme                                                │
│     □ Your documentation                                               │
│     □ Your terms of service                                            │
│                                                                         │
│  5. LEGAL compliance                                                   │
│                                                                         │
│     □ Keep MIT license notice in source files (required)              │
│     □ Create your own LICENSE file for your additions                  │
│     □ Add attribution in About page (optional but good karma)         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Files to Rename/Modify
```
# Package identity:
package.json                    # name, author, description
docker-compose.yml              # service names, image names

# Configuration:
config/identity.json            # Agent name and role
config/moltbot.json → config/coordinator.json

# Source code (search & replace):
Find: "moltbot", "Moltbot", "MoltBot", "MOLTBOT"
Replace: "coordinator", "Coordinator", "ClinicalCoordinator", "COORDINATOR"

# Documentation:
README.md                       # Complete rewrite
docs/*                          # Your own documentation

# Branding assets:
public/logo.*                   # Your logo
public/favicon.*                # Your favicon
ui/components/Logo.tsx          # Your logo component
```

### New Identity Configuration

Create `config/identity.json`:
```json
{
  "name": "Clinical Coordinator",
  "shortName": "CC",
  "role": "I am a clinical coordinator assistant for Dr. [DoctorName]'s clinic. I help manage patient communications, appointments, and documentation. I never make clinical decisions - only doctors do that.",
  "greeting": "Namaste! [ClinicName] mein aapka swagat hai. Main Dr. [DoctorName] ki clinical coordinator hoon. Aapki kya madad kar sakti hoon?",
  "branding": {
    "companyName": "Your Company Name",
    "productName": "AI Clinical Coordinator",
    "website": "https://yourwebsite.com",
    "supportEmail": "support@yourwebsite.com"
  }
}
```

### Verification Checklist
- [ ] No "MoltBot" string appears in user-facing UI
- [ ] No "MoltBot" string appears in patient-facing messages
- [ ] No MoltBot logo appears anywhere
- [ ] Package names are changed
- [ ] Docker images are renamed
- [ ] Documentation is your own
- [ ] MIT license notice preserved in source files
- [ ] About page shows your branding (optional: "Powered by open source")

---

## Summary: Production Checklist

```
BEFORE GOING LIVE:
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  DIRECTIVE 1: WhatsApp Official API                                    │
│  □ Baileys code removed                                                │
│  □ Meta Tech Provider registered                                       │
│  □ Meta Cloud API integrated                                           │
│  □ Embedded Signup working                                             │
│  □ Template messages approved                                          │
│                                                                         │
│  DIRECTIVE 2: MoltBot Safety                                           │
│  □ Shell execution removed                                             │
│  □ Browser automation removed                                          │
│  □ Dangerous skills removed                                            │
│  □ Tool policy enforced                                                │
│  □ Security audit passed                                               │
│                                                                         │
│  DIRECTIVE 3: White-Label                                              │
│  □ All MoltBot branding removed                                        │
│  □ Your branding applied                                               │
│  □ Package/image names changed                                         │
│  □ Documentation is yours                                              │
│  □ MIT license preserved in source                                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## When to Execute These Directives

| Phase | Directive 1 (WhatsApp) | Directive 2 (Safety) | Directive 3 (White-Label) |
|-------|------------------------|----------------------|---------------------------|
| MVP/Testing | ❌ Keep Baileys | ❌ Keep everything | ❌ Keep MoltBot name |
| Beta with real doctors | ⚠️ Start transition | ⚠️ Strip dangerous | ⚠️ Start rebranding |
| Production | ✅ MANDATORY | ✅ MANDATORY | ✅ MANDATORY |

**Rationale:**
- For MVP, we want things to work first
- Strip and rebrand only after everything is tested
- Never deploy production with Baileys or unsafe code
