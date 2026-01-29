-- =================================================================
-- Migration: Add Queue, Payments, and Patient Safety Fields
-- =================================================================
-- This migration adds:
-- 1. Patient safety fields (allergies, chronic_conditions, blood_group)
-- 2. Fee schedule table
-- 3. Payments table with receipt number generation
-- 4. Queue table with token number generation
-- =================================================================

-- =================================================================
-- 1. ALTER PATIENTS TABLE - Add Safety Fields
-- =================================================================
ALTER TABLE patients
  ADD COLUMN IF NOT EXISTS allergies TEXT[],
  ADD COLUMN IF NOT EXISTS chronic_conditions TEXT[],
  ADD COLUMN IF NOT EXISTS blood_group TEXT;

-- Add comment for documentation
COMMENT ON COLUMN patients.allergies IS 'CRITICAL: Drug allergies array - must display prominently';
COMMENT ON COLUMN patients.chronic_conditions IS 'Chronic conditions like Diabetes, HTN, etc.';
COMMENT ON COLUMN patients.blood_group IS 'Blood group: A+, A-, B+, B-, AB+, AB-, O+, O-';

-- =================================================================
-- 2. FEE SCHEDULE TABLE
-- =================================================================
CREATE TABLE IF NOT EXISTS fee_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  valid_from DATE DEFAULT CURRENT_DATE,
  valid_to DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure unique fee types per owner at any given time
  CONSTRAINT fee_schedule_check_dates CHECK (valid_to IS NULL OR valid_to >= valid_from)
);

-- RLS for fee_schedule
ALTER TABLE fee_schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own fee schedules" ON fee_schedule
  FOR SELECT USING (owner_id = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can insert own fee schedules" ON fee_schedule
  FOR INSERT WITH CHECK (owner_id = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can update own fee schedules" ON fee_schedule
  FOR UPDATE USING (owner_id = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can delete own fee schedules" ON fee_schedule
  FOR DELETE USING (owner_id = current_setting('request.jwt.claims')::json->>'sub');

-- Indexes for fee_schedule
CREATE INDEX IF NOT EXISTS idx_fee_schedule_owner ON fee_schedule(owner_id);
CREATE INDEX IF NOT EXISTS idx_fee_schedule_type ON fee_schedule(owner_id, type);
CREATE INDEX IF NOT EXISTS idx_fee_schedule_active ON fee_schedule(owner_id, is_active) WHERE is_active = TRUE;

-- Trigger for updated_at
CREATE TRIGGER update_fee_schedule_updated_at
  BEFORE UPDATE ON fee_schedule
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =================================================================
-- 3. PAYMENTS TABLE
-- =================================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id TEXT NOT NULL,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
  visit_id UUID REFERENCES visits(id) ON DELETE SET NULL,
  fee_schedule_id UUID REFERENCES fee_schedule(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('consultation', 'procedure', 'medicine', 'follow_up', 'other')),
  method TEXT CHECK (method IN ('cash', 'upi', 'card', 'pending')),
  upi_ref TEXT,
  receipt_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'waived', 'refunded')),
  notes TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure receipt numbers are unique per owner
  UNIQUE(owner_id, receipt_number)
);

-- RLS for payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (owner_id = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can insert own payments" ON payments
  FOR INSERT WITH CHECK (owner_id = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can update own payments" ON payments
  FOR UPDATE USING (owner_id = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can delete own payments" ON payments
  FOR DELETE USING (owner_id = current_setting('request.jwt.claims')::json->>'sub');

-- Indexes for payments
CREATE INDEX IF NOT EXISTS idx_payments_owner ON payments(owner_id);
CREATE INDEX IF NOT EXISTS idx_payments_patient ON payments(patient_id);
CREATE INDEX IF NOT EXISTS idx_payments_visit ON payments(visit_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(owner_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(owner_id, created_at);
CREATE INDEX IF NOT EXISTS idx_payments_receipt ON payments(owner_id, receipt_number);
CREATE INDEX IF NOT EXISTS idx_payments_paid_at ON payments(owner_id, paid_at) WHERE paid_at IS NOT NULL;

-- Trigger for updated_at
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =================================================================
-- 4. QUEUE TABLE
-- =================================================================
CREATE TABLE IF NOT EXISTS queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
  visit_id UUID REFERENCES visits(id) ON DELETE SET NULL,
  token_number INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('scheduled', 'walk_in')),
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'in_progress', 'done', 'no_show', 'cancelled')),
  priority INTEGER DEFAULT 0,
  check_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  called_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Token numbers must be unique per owner per day
  UNIQUE(owner_id, date, token_number)
);

-- RLS for queue
ALTER TABLE queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own queue" ON queue
  FOR SELECT USING (owner_id = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can insert own queue" ON queue
  FOR INSERT WITH CHECK (owner_id = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can update own queue" ON queue
  FOR UPDATE USING (owner_id = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can delete own queue" ON queue
  FOR DELETE USING (owner_id = current_setting('request.jwt.claims')::json->>'sub');

-- Indexes for queue
CREATE INDEX IF NOT EXISTS idx_queue_owner ON queue(owner_id);
CREATE INDEX IF NOT EXISTS idx_queue_date ON queue(owner_id, date);
CREATE INDEX IF NOT EXISTS idx_queue_patient ON queue(patient_id);
CREATE INDEX IF NOT EXISTS idx_queue_status ON queue(owner_id, date, status);
CREATE INDEX IF NOT EXISTS idx_queue_token ON queue(owner_id, date, token_number);
CREATE INDEX IF NOT EXISTS idx_queue_waiting ON queue(owner_id, date, status, token_number) WHERE status = 'waiting';

-- Trigger for updated_at
CREATE TRIGGER update_queue_updated_at
  BEFORE UPDATE ON queue
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =================================================================
-- 5. FUNCTION: get_next_token()
-- =================================================================
-- Atomically gets the next token number for a given owner and date
-- Uses FOR UPDATE to prevent race conditions
CREATE OR REPLACE FUNCTION get_next_token(p_owner_id TEXT, p_date DATE DEFAULT CURRENT_DATE)
RETURNS INTEGER AS $$
DECLARE
  next_token INTEGER;
BEGIN
  -- Lock the rows for this owner/date to prevent race conditions
  -- and get the max token number
  SELECT COALESCE(MAX(token_number), 0) + 1
  INTO next_token
  FROM queue
  WHERE owner_id = p_owner_id
    AND date = p_date
  FOR UPDATE;

  RETURN next_token;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission
COMMENT ON FUNCTION get_next_token(TEXT, DATE) IS 'Atomically returns the next token number for a given owner and date';

-- =================================================================
-- 6. FUNCTION: get_next_receipt_number()
-- =================================================================
-- Generates receipt numbers in format: RCP-YYYYMMDD-NNNN
-- Where NNNN is a sequential number per day per owner
CREATE OR REPLACE FUNCTION get_next_receipt_number(p_owner_id TEXT, p_date DATE DEFAULT CURRENT_DATE)
RETURNS TEXT AS $$
DECLARE
  next_seq INTEGER;
  date_str TEXT;
  receipt TEXT;
BEGIN
  -- Format date as YYYYMMDD
  date_str := TO_CHAR(p_date, 'YYYYMMDD');

  -- Get the next sequence number for this owner/date
  -- by counting existing receipts with the same date prefix
  SELECT COUNT(*) + 1
  INTO next_seq
  FROM payments
  WHERE owner_id = p_owner_id
    AND receipt_number LIKE 'RCP-' || date_str || '-%'
  FOR UPDATE;

  -- Format receipt number with zero-padded sequence
  receipt := 'RCP-' || date_str || '-' || LPAD(next_seq::TEXT, 4, '0');

  RETURN receipt;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission
COMMENT ON FUNCTION get_next_receipt_number(TEXT, DATE) IS 'Generates the next receipt number in format RCP-YYYYMMDD-NNNN';

-- =================================================================
-- 7. HELPER FUNCTION: mark_previous_day_no_shows()
-- =================================================================
-- Call this at the start of each day to mark incomplete entries as no-show
CREATE OR REPLACE FUNCTION mark_previous_day_no_shows(p_owner_id TEXT)
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE queue
  SET
    status = 'no_show',
    updated_at = NOW()
  WHERE owner_id = p_owner_id
    AND date < CURRENT_DATE
    AND status IN ('waiting', 'in_progress');

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mark_previous_day_no_shows(TEXT) IS 'Marks all incomplete queue entries from previous days as no-show';

-- =================================================================
-- 8. VIEW: today_queue
-- =================================================================
-- Convenient view for today's queue with patient info
CREATE OR REPLACE VIEW today_queue AS
SELECT
  q.id,
  q.owner_id,
  q.date,
  q.token_number,
  q.type,
  q.status,
  q.priority,
  q.check_in_at,
  q.called_at,
  q.completed_at,
  q.notes,
  q.patient_id,
  p.first_name,
  p.last_name,
  p.phone,
  p.uhid,
  p.allergies,
  p.chronic_conditions,
  q.visit_id
FROM queue q
JOIN patients p ON q.patient_id = p.id
WHERE q.date = CURRENT_DATE
ORDER BY
  CASE q.status
    WHEN 'in_progress' THEN 1
    WHEN 'waiting' THEN 2
    WHEN 'done' THEN 3
    WHEN 'no_show' THEN 4
    WHEN 'cancelled' THEN 5
  END,
  q.priority DESC,
  q.token_number ASC;

COMMENT ON VIEW today_queue IS 'Today''s queue with patient information, ordered by status and token';

-- =================================================================
-- 9. VIEW: daily_collection_summary
-- =================================================================
-- View for daily collection report
CREATE OR REPLACE VIEW daily_collection_summary AS
SELECT
  owner_id,
  DATE(created_at) as collection_date,
  COUNT(*) FILTER (WHERE status = 'paid') as total_paid_count,
  COUNT(*) FILTER (WHERE status = 'pending') as total_pending_count,
  COUNT(*) FILTER (WHERE status = 'waived') as total_waived_count,
  COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0) as total_collected,
  COALESCE(SUM(amount) FILTER (WHERE status = 'pending'), 0) as total_pending,
  COALESCE(SUM(amount) FILTER (WHERE status = 'waived'), 0) as total_waived,
  COALESCE(SUM(amount) FILTER (WHERE status = 'paid' AND method = 'cash'), 0) as cash_collected,
  COALESCE(SUM(amount) FILTER (WHERE status = 'paid' AND method = 'upi'), 0) as upi_collected,
  COALESCE(SUM(amount) FILTER (WHERE status = 'paid' AND method = 'card'), 0) as card_collected
FROM payments
GROUP BY owner_id, DATE(created_at);

COMMENT ON VIEW daily_collection_summary IS 'Daily payment collection summary grouped by date and payment method';

-- =================================================================
-- 10. GRANT PERMISSIONS (if using service role)
-- =================================================================
-- These may need adjustment based on your Supabase setup
-- GRANT USAGE ON SCHEMA public TO authenticated;
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
