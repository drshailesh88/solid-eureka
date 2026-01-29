# PLANNING MODE

You are in PLANNING mode. Your job is to analyze the specifications and existing code, then update the IMPLEMENTATION_PLAN.md with a prioritized task list.

## Your Tasks

1. **Read all specification files** in `specs/` directory
2. **Analyze existing code** in `src/features/` to understand what's already built
3. **Perform gap analysis** - what's specified but not built?
4. **Update IMPLEMENTATION_PLAN.md** with:
   - Prioritized tasks (P0 = critical, P1 = high, P2 = medium)
   - Clear, atomic tasks (one thing per task)
   - Dependencies noted (if task B needs task A first)
   - Status checkboxes for tracking

## Key Files to Read

- `specs/01-emr-patients.md` - Patient management (90% built, needs allergies)
- `specs/02-emr-visits.md` - Visit documentation (90% built)
- `specs/03-emr-prescriptions.md` - Prescriptions (90% built)
- `specs/04-vitals.md` - Vitals recording (built)
- `specs/05-payments.md` - Payment collection (NOT BUILT)
- `specs/06-queue-tokens.md` - Queue system (NOT BUILT)
- `PROVEN_REPOS.md` - Use these libraries, not custom code
- `AGENTS.md` - Build/test commands

## Existing Code Locations

- `src/features/patients/` - Patient CRUD
- `src/features/visits/` - Visit documentation
- `src/features/prescriptions/` - Prescription builder
- `src/types/` - TypeScript interfaces
- `supabase/schema.sql` - Database schema

## Rules

1. **DO NOT write any code** - planning only
2. **DO NOT modify any source files**
3. **ONLY update IMPLEMENTATION_PLAN.md**
4. Mark tasks with clear status: `[ ]` pending, `[x]` done
5. Group by priority (P0 > P1 > P2)
6. Include proven repos in task descriptions where applicable

## Output

Update IMPLEMENTATION_PLAN.md then signal completion:

<promise>COMPLETE</promise>
