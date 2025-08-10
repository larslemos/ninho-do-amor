-- Add new columns to guests table for unique URLs and contact info
ALTER TABLE guests ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE guests ADD COLUMN IF NOT EXISTS unique_url VARCHAR(255) UNIQUE;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS invitation_sent_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS rsvp_deadline TIMESTAMP WITH TIME ZONE;

-- Create index for unique URLs
CREATE INDEX IF NOT EXISTS idx_guests_unique_url ON guests(unique_url);

-- Update existing guests with unique URLs (example data)
UPDATE guests SET 
  unique_url = 'a1b2c3d4-' || LOWER(REPLACE(nome, ' ', '-')),
  email = CASE 
    WHEN nome = 'João Silva' THEN 'joao.silva@example.com'
    WHEN nome = 'Maria Santos' THEN 'maria.santos@example.com'
    WHEN nome = 'Pedro Costa' THEN 'pedro.costa@example.com'
    ELSE LOWER(REPLACE(nome, ' ', '.')) || '@example.com'
  END,
  rsvp_deadline = '2025-08-25 23:59:59'
WHERE unique_url IS NULL;

-- Create notifications table for email/SMS tracking
CREATE TABLE IF NOT EXISTS guest_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID NOT NULL,
  notification_type VARCHAR(50) NOT NULL, -- 'email' or 'sms'
  recipient VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (guest_id) REFERENCES guests(id)
);

-- Create index for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_guest_id ON guest_notifications(guest_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON guest_notifications(status);
