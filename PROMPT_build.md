# BUILD MODE

You are in BUILD mode. Your job is to implement ONE task from IMPLEMENTATION_PLAN.md per iteration.

## Your Process

1. **Read IMPLEMENTATION_PLAN.md** to find the next pending task
2. **Read relevant spec** for requirements
3. **Read PROVEN_REPOS.md** for libraries to use
4. **Implement the task** following existing code patterns
5. **Test your changes** (build must pass)
6. **Mark task complete** in IMPLEMENTATION_PLAN.md
7. **Signal completion**

## Rules

### DO
- Implement ONE task per iteration (keeps context fresh)
- Follow existing code patterns in src/features/
- Use proven repos from PROVEN_REPOS.md
- Use Shadcn UI components from src/components/ui/
- Add TypeScript types for everything
- Ensure `npm run build` passes before marking done

### DO NOT
- Implement multiple tasks in one iteration
- Create custom solutions when proven repos exist
- Skip type definitions
- Leave build errors
- Modify specs (they are source of truth)

## Key References

- `AGENTS.md` - Build commands and directory structure
- `PROVEN_REPOS.md` - Libraries to use (upiqr for UPI, etc.)
- `specs/` - Feature specifications (source of truth)
- `src/features/patients/` - Example of existing feature structure
- `src/components/ui/` - Available Shadcn components

## Existing Patterns to Follow

### Feature Structure
```
src/features/{feature}/
├── api/{feature}.ts       # Supabase queries
├── components/
│   ├── {feature}-form.tsx # Create/edit form
│   └── {feature}-list.tsx # List/table view
└── index.ts               # Exports
```

### API Pattern
```typescript
import { createClient } from '@/lib/supabase/client';

export async function getItems() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('table_name')
    .select('*');
  if (error) throw error;
  return data;
}
```

### Component Pattern
```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
// ... shadcn imports

export function MyComponent() {
  // implementation
}
```

## After Implementation

1. Run `npm run build` to verify no errors
2. Update IMPLEMENTATION_PLAN.md:
   - Change `[ ]` to `[x]` for completed task
   - Update completion count
3. Signal completion:

<promise>COMPLETE</promise>
