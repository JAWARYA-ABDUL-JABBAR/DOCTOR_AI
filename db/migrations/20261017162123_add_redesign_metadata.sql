ALTER TABLE projects ADD COLUMN IF NOT EXISTS redesign_source text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS redesigned_at timestamptz;
