-- Create guests table
CREATE TABLE IF NOT EXISTS guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  mesa VARCHAR(50),
  validade TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create felicitations table
CREATE TABLE IF NOT EXISTS felicitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_token VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (guest_token) REFERENCES guests(token)
);

-- Create wedding_data table
CREATE TABLE IF NOT EXISTS wedding_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bride VARCHAR(255) NOT NULL,
  groom VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  day_of_week VARCHAR(50) NOT NULL,
  time TIME NOT NULL,
  venue VARCHAR(255) NOT NULL,
  rsvp_numbers TEXT[] NOT NULL,
  invitation_text_portuguese TEXT NOT NULL,
  ceremony_types JSONB DEFAULT '[]',
  wedding_program JSONB DEFAULT '[]',
  design_elements JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample wedding data
INSERT INTO wedding_data (
  bride, 
  groom, 
  date, 
  day_of_week, 
  time, 
  venue, 
  rsvp_numbers, 
  invitation_text_portuguese,
  ceremony_types,
  wedding_program,
  design_elements
) VALUES (
  'Assa',
  'Eleutério',
  '2024-08-30',
  'Sábado',
  '13:00:00',
  'Hotel Polana',
  ARRAY['824790050', '879659501'],
  'É com imensa alegria que convidamos você para a celebração do nosso casamento',
  '[
    {"type": "civil", "icon_description": "Cerimônia Civil"},
    {"type": "religious", "icon_description": "Cerimônia Religiosa"}
  ]'::jsonb,
  '[
    {"time": "13:00", "activity": "Cerimônia Civil"},
    {"time": "14:30", "activity": "Cerimônia Religiosa"},
    {"time": "16:00", "activity": "Recepção"}
  ]'::jsonb,
  '{
    "color_scheme": ["#8B5A3C", "#D4A574", "#F5E6D3"],
    "floral_elements": "Rosas vermelhas e rosa",
    "background": "Gradiente rosa",
    "rings": "Dourado",
    "branding": "Elegante"
  }'::jsonb
) ON CONFLICT DO NOTHING;

-- Insert sample guests
INSERT INTO guests (nome, token, status, mesa, validade) VALUES 
  ('João Silva', 'guest-token-1', 'pending', 'Mesa 1', '2024-08-30 23:59:59'),
  ('Maria Santos', 'guest-token-2', 'confirmed', 'Mesa 2', '2024-08-30 23:59:59'),
  ('Pedro Costa', 'guest-token-3', 'pending', 'Mesa 1', '2024-08-30 23:59:59')
ON CONFLICT (token) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_guests_token ON guests(token);
CREATE INDEX IF NOT EXISTS idx_felicitations_guest_token ON felicitations(guest_token);
CREATE INDEX IF NOT EXISTS idx_felicitations_created_at ON felicitations(created_at DESC);
