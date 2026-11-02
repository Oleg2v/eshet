-- Persistent enquiries for the Workers deployment. This migration is additive
-- and never deletes or overwrites an existing enquiry.
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY NOT NULL,
  created_at TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('new', 'reviewed')),
  brief_json TEXT NOT NULL,
  webhook TEXT NOT NULL CHECK (webhook IN ('not-configured', 'delivered', 'failed'))
);

CREATE INDEX IF NOT EXISTS leads_created_at
  ON leads (created_at DESC, id DESC);
