-- RizFlow Nurture Sequence Database Schema
-- Run this SQL against your Neon Postgres database
--
-- Setup: https://neon.tech → Create Project → Copy connection string → Add as DATABASE_URL env var
--
-- After creating the Neon project, run:
--   psql "postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require" -f scripts/setup-nurture-db.sql

CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  score INTEGER,
  level TEXT,
  estimated_savings TEXT,
  top_automations JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  industry TEXT DEFAULT '',
  team_size TEXT DEFAULT '',
  biggest_pain TEXT DEFAULT '',
  source TEXT DEFAULT 'ai-score-preview',
  unsubscribed BOOLEAN DEFAULT FALSE,
  registered_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nurture_emails (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
  email_day INTEGER NOT NULL,
  subject TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lead_id, email_day)
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_unsubscribed ON leads(unsubscribed);
CREATE INDEX IF NOT EXISTS idx_nurture_emails_lead_day ON nurture_emails(lead_id, email_day);