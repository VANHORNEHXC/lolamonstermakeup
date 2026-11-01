ALTER TABLE booking_requests ADD COLUMN IF NOT EXISTS quote_amount_cop integer CHECK (quote_amount_cop >= 0);
ALTER TABLE booking_requests ADD COLUMN IF NOT EXISTS revenue_amount_cop integer CHECK (revenue_amount_cop >= 0);
ALTER TABLE booking_requests ADD COLUMN IF NOT EXISTS internal_notes text NOT NULL DEFAULT '';
ALTER TABLE booking_requests ADD COLUMN IF NOT EXISTS archived_at timestamptz;
ALTER TABLE booking_requests ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
CREATE INDEX IF NOT EXISTS booking_requests_status_created_idx ON booking_requests (status, created_at DESC);
CREATE INDEX IF NOT EXISTS booking_requests_archived_idx ON booking_requests (archived_at) WHERE archived_at IS NOT NULL;

CREATE TABLE IF NOT EXISTS clients (
  email text PRIMARY KEY CHECK (char_length(email) <= 254),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  phone text,
  notes text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT ARRAY[]::text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO clients (email, name, phone, created_at)
SELECT DISTINCT ON (lower(email)) lower(email), name, phone, created_at
FROM booking_requests
ORDER BY lower(email), created_at DESC
ON CONFLICT (email) DO NOTHING;

CREATE TABLE IF NOT EXISTS booking_events (
  id bigserial PRIMARY KEY,
  booking_id uuid NOT NULL REFERENCES booking_requests(id) ON DELETE CASCADE,
  action text NOT NULL,
  detail text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS booking_events_booking_created_idx ON booking_events (booking_id, created_at DESC);

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS admin_sessions_expires_idx ON admin_sessions (expires_at);
CREATE TABLE IF NOT EXISTS admin_login_attempts (
  id bigserial PRIMARY KEY,
  username text NOT NULL,
  ip_hash text NOT NULL,
  success boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS admin_login_attempts_recent_idx ON admin_login_attempts (username, ip_hash, created_at DESC);

CREATE TABLE IF NOT EXISTS site_content (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS site_media (
  slot text PRIMARY KEY,
  object_key text NOT NULL,
  content_type text NOT NULL,
  size_bytes integer NOT NULL CHECK (size_bytes > 0),
  original_name text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
