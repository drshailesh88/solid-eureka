-- =================================================================
-- EMR Database Schema for Supabase
-- =================================================================
-- Run this in Supabase SQL Editor to create all tables and RLS policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =================================================================
-- PATIENTS TABLE
-- =================================================================
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id TEXT NOT NULL,
  uhid TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT,
  age INTEGER,
  sex TEXT CHECK (sex IN ('male', 'female', 'other')),
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(owner_id, uhid)
);

-- RLS for patients
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own patients" ON patients
  FOR SELECT USING (owner_id = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can insert own patients" ON patients
  FOR INSERT WITH CHECK (owner_id = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can update own patients" ON patients
  FOR UPDATE USING (owner_id = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can delete own patients" ON patients
  FOR DELETE USING (owner_id = current_setting('request.jwt.claims')::json->>'sub');

-- =================================================================
-- VISITS TABLE
-- =================================================================
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  owner_id TEXT NOT NULL,
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  chief_complaints TEXT,
  hpi TEXT,
  investigations TEXT,
  findings TEXT,
  diagnosis TEXT,
  plan TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for visits
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own visits" ON visits
  FOR SELECT USING (owner_id = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can insert own visits" ON visits
  FOR INSERT WITH CHECK (owner_id = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can update own visits" ON visits
  FOR UPDATE USING (owner_id = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can delete own visits" ON visits
  FOR DELETE USING (owner_id = current_setting('request.jwt.claims')::json->>'sub');

-- =================================================================
-- VITALS TABLE
-- =================================================================
CREATE TABLE IF NOT EXISTS vitals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
  bp_systolic INTEGER,
  bp_diastolic INTEGER,
  pulse INTEGER,
  temperature DECIMAL(4,1),
  spo2 INTEGER,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  bmi DECIMAL(4,1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for vitals
ALTER TABLE vitals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage vitals through visits" ON vitals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM visits
      WHERE visits.id = vitals.visit_id
      AND visits.owner_id = current_setting('request.jwt.claims')::json->>'sub'
    )
  );

-- =================================================================
-- PRESCRIPTIONS TABLE
-- =================================================================
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
  owner_id TEXT NOT NULL,
  summary TEXT,
  language TEXT DEFAULT 'en',
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for prescriptions
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own prescriptions" ON prescriptions
  FOR SELECT USING (owner_id = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can insert own prescriptions" ON prescriptions
  FOR INSERT WITH CHECK (owner_id = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can update own prescriptions" ON prescriptions
  FOR UPDATE USING (owner_id = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can delete own prescriptions" ON prescriptions
  FOR DELETE USING (owner_id = current_setting('request.jwt.claims')::json->>'sub');

-- =================================================================
-- PRESCRIPTION ITEMS TABLE
-- =================================================================
CREATE TABLE IF NOT EXISTS prescription_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  salt TEXT,
  dose TEXT,
  frequency TEXT,
  pattern TEXT,
  duration TEXT,
  instructions TEXT,
  instructions_hindi TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for prescription_items
ALTER TABLE prescription_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage prescription items through prescriptions" ON prescription_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM prescriptions
      WHERE prescriptions.id = prescription_items.prescription_id
      AND prescriptions.owner_id = current_setting('request.jwt.claims')::json->>'sub'
    )
  );

-- =================================================================
-- DOCUMENTS TABLE
-- =================================================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  owner_id TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT,
  doc_type TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ocr_text TEXT,
  ocr_status TEXT CHECK (ocr_status IN ('pending', 'processing', 'success', 'failed', 'skipped')),
  ocr_engine TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for documents
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents" ON documents
  FOR SELECT USING (owner_id = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can insert own documents" ON documents
  FOR INSERT WITH CHECK (owner_id = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can update own documents" ON documents
  FOR UPDATE USING (owner_id = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can delete own documents" ON documents
  FOR DELETE USING (owner_id = current_setting('request.jwt.claims')::json->>'sub');

-- =================================================================
-- DOCUMENT SUMMARIES TABLE
-- =================================================================
CREATE TABLE IF NOT EXISTS document_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  summary_text TEXT NOT NULL,
  ai_model TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for document_summaries
ALTER TABLE document_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage summaries through documents" ON document_summaries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM documents
      WHERE documents.id = document_summaries.document_id
      AND documents.owner_id = current_setting('request.jwt.claims')::json->>'sub'
    )
  );

-- =================================================================
-- TIMELINE EVENTS TABLE
-- =================================================================
CREATE TABLE IF NOT EXISTS timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  visit_id UUID REFERENCES visits(id) ON DELETE SET NULL,
  event_date DATE NOT NULL,
  event_type TEXT NOT NULL,
  event_title TEXT NOT NULL,
  event_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for timeline_events
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage timeline through patients" ON timeline_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = timeline_events.patient_id
      AND patients.owner_id = current_setting('request.jwt.claims')::json->>'sub'
    )
  );

-- =================================================================
-- TEMPLATES TABLE
-- =================================================================
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('prescription', 'visit', 'specialty')),
  specialty TEXT,
  content JSONB NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for templates
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own and default templates" ON templates
  FOR SELECT USING (
    owner_id = current_setting('request.jwt.claims')::json->>'sub'
    OR is_default = TRUE
  );

CREATE POLICY "Users can insert own templates" ON templates
  FOR INSERT WITH CHECK (owner_id = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can update own templates" ON templates
  FOR UPDATE USING (owner_id = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can delete own templates" ON templates
  FOR DELETE USING (owner_id = current_setting('request.jwt.claims')::json->>'sub');

-- =================================================================
-- AUDIT LOGS TABLE
-- =================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for audit_logs (users can only view their own logs)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own audit logs" ON audit_logs
  FOR SELECT USING (owner_id = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can insert own audit logs" ON audit_logs
  FOR INSERT WITH CHECK (owner_id = current_setting('request.jwt.claims')::json->>'sub');

-- =================================================================
-- INDEXES FOR PERFORMANCE
-- =================================================================
CREATE INDEX IF NOT EXISTS idx_patients_owner ON patients(owner_id);
CREATE INDEX IF NOT EXISTS idx_patients_uhid ON patients(owner_id, uhid);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(owner_id, phone);
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(owner_id, first_name, last_name);

CREATE INDEX IF NOT EXISTS idx_visits_patient ON visits(patient_id);
CREATE INDEX IF NOT EXISTS idx_visits_owner ON visits(owner_id);
CREATE INDEX IF NOT EXISTS idx_visits_date ON visits(owner_id, visit_date);

CREATE INDEX IF NOT EXISTS idx_prescriptions_visit ON prescriptions(visit_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_owner ON prescriptions(owner_id);

CREATE INDEX IF NOT EXISTS idx_documents_patient ON documents(patient_id);
CREATE INDEX IF NOT EXISTS idx_documents_owner ON documents(owner_id);

CREATE INDEX IF NOT EXISTS idx_timeline_patient ON timeline_events(patient_id);
CREATE INDEX IF NOT EXISTS idx_timeline_date ON timeline_events(patient_id, event_date);

CREATE INDEX IF NOT EXISTS idx_templates_owner ON templates(owner_id);
CREATE INDEX IF NOT EXISTS idx_templates_type ON templates(owner_id, type);

CREATE INDEX IF NOT EXISTS idx_audit_owner ON audit_logs(owner_id);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity, entity_id);

-- =================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visits_updated_at
  BEFORE UPDATE ON visits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prescriptions_updated_at
  BEFORE UPDATE ON prescriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
