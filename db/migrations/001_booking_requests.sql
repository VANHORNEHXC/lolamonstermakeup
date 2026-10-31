CREATE TABLE IF NOT EXISTS booking_requests (
  id uuid PRIMARY KEY,
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  email text NOT NULL CHECK (char_length(email) <= 254),
  phone text,
  service text NOT NULL CHECK (service IN ('Editorial', 'Social glam', 'Novias', 'Peinado', 'Clases', 'Otro / por definir')),
  requested_date date,
  location text NOT NULL CHECK (char_length(location) BETWEEN 2 AND 150),
  people integer NOT NULL CHECK (people BETWEEN 1 AND 100),
  message text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 3000),
  contact_consent boolean NOT NULL CHECK (contact_consent = true),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'confirmed', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS booking_requests_email_created_idx ON booking_requests (email, created_at DESC);
CREATE INDEX IF NOT EXISTS booking_requests_created_idx ON booking_requests (created_at DESC);
