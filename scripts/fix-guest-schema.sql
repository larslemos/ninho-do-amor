-- Add telefone column to guests table if it doesn't exist
ALTER TABLE guests ADD COLUMN IF NOT EXISTS telefone VARCHAR(255);

-- Update existing guests with sample phone numbers if they don't have them
UPDATE guests SET telefone = CASE 
  WHEN nome = 'João Silva' THEN '+258 84 123 4567'
  WHEN nome = 'Maria Santos' THEN '+258 84 987 6543'
  WHEN nome = 'Pedro Costa' THEN '+258 84 555 1234'
  ELSE '+258 84 000 0000'
END WHERE telefone IS NULL OR telefone = '';

-- Create index for telefone
CREATE INDEX IF NOT EXISTS idx_guests_telefone ON guests(telefone);
