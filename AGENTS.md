# AGENTS.md - Operational Guide

## Build Commands
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript check
```

## Test Commands
```bash
npm run test         # Run tests (if configured)
npm run build        # Build validates TypeScript
```

## Database
```bash
# Supabase migrations in supabase/schema.sql
# Push schema changes via Supabase dashboard or CLI
```

## Key Directories
- `src/features/` - Feature modules (patients, visits, prescriptions)
- `src/components/ui/` - Shadcn UI components
- `src/lib/` - Utilities and Supabase client
- `specs/` - Source of truth specifications
- `.specify/` - Spec Kit working directory

## Proven Repos (USE THESE, NOT CUSTOM CODE)
- UPI QR: `upiqr` (npm) - MIT license
- Receipts: Reference `invoify` patterns
- Queue: Use Supabase real-time + custom hooks

## Completion Signal
When a task is fully done: `<promise>COMPLETE</promise>`
