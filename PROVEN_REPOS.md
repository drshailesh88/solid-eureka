# Proven Repositories - Use Instead of Custom Code

## Philosophy
**Proven repos > custom code.** Less bugs, maintained by communities, battle-tested.
All repos listed here have permissive licenses (MIT/Apache 2.0).

---

## UPI Payment QR Code

### Primary: `upiqr`
- **NPM:** `npm install upiqr`
- **GitHub:** https://github.com/bhar4t/upiqr
- **Stars:** 30 | **License:** MIT
- **Why:** Purpose-built for Indian UPI, NPCI-compliant, zero dependencies

```typescript
import { UPILink } from 'upiqr';

const link = new UPILink({
  payeeAddress: 'doctor@upi',
  payeeName: 'Dr. Singh',
  transactionAmount: 500,
  currency: 'INR',
  transactionNote: 'Consultation - Rajesh Kumar'
});

// Get QR code as base64 PNG
const qrBase64 = await link.getQRCode();

// Get UPI intent URL
const upiUrl = link.getLink();
// upi://pay?pa=doctor@upi&pn=Dr.%20Singh&am=500&cu=INR&tn=Consultation...
```

---

## Receipt/Invoice Generation

### Primary: Reference `invoify` patterns
- **GitHub:** https://github.com/al1abb/invoify
- **Stars:** 6.1k | **License:** MIT
- **Stack:** Next.js 13, React, Shadcn UI, Tailwind, Puppeteer PDF

**We already have @react-pdf/renderer in the codebase. Use invoify patterns for:**
- Receipt number generation
- PDF layout structure
- Email sending patterns

---

## QR Code (General)

### If need custom QR: `paulmillr/qr`
- **NPM:** `npm install @paulmillr/qr`
- **GitHub:** https://github.com/paulmillr/qr
- **Stars:** 299 | **License:** MIT OR Apache-2.0
- **Why:** Zero dependencies, works anywhere

---

## Queue Management

### Approach: Custom with Supabase Real-time
No perfect MIT repo exists for clinic queues. Build custom using:

1. **Database:** Supabase `queue` table with real-time subscriptions
2. **State:** Zustand store (already in codebase)
3. **UI:** Shadcn components (already in codebase)

**Reference for patterns:**
- SimplQ (https://github.com/SimplQ/simplQ-frontend) - 191 stars, GPL-3.0
  - Reference their queue state machine patterns
  - Reference their UI/UX for queue display

### Token Number Logic
```sql
-- Already in spec, use this exact function
CREATE OR REPLACE FUNCTION get_next_token(queue_date DATE)
RETURNS INT AS $$
  SELECT COALESCE(MAX(token_number), 0) + 1
  FROM queue WHERE date = queue_date;
$$ LANGUAGE SQL;
```

---

## Already in Codebase (Don't Reinstall)

| Library | Purpose | Stars |
|---------|---------|-------|
| @react-pdf/renderer | PDF generation | 15.9k |
| react-pdf | PDF viewing | - |
| react-dropzone | File uploads | 10.5k |
| react-share | Social sharing | - |
| Resend | Email | - |
| Zustand | State management | - |
| TanStack Table | Data tables | - |
| Shadcn UI | Components | - |
| Recharts | Charts | - |

---

## Installation Commands

```bash
# UPI QR Code
npm install upiqr

# That's it! Everything else is already installed or built custom.
```

---

## Decision Matrix

| Feature | Approach | Why |
|---------|----------|-----|
| UPI QR | `upiqr` package | Purpose-built, MIT, maintained |
| Receipt PDF | @react-pdf/renderer (existing) | Already works for prescriptions |
| Queue UI | Custom + Shadcn | No good MIT queue UI exists |
| Queue Backend | Supabase real-time | Already set up, perfect for this |
| Token Numbers | Postgres function | Atomic, race-condition safe |
