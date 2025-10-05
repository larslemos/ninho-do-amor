-- Simple setup for wedding messages table
-- Run this in your Supabase SQL Editor

-- Create the messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert messages
CREATE POLICY "Allow public insert on messages" ON messages
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read messages
CREATE POLICY "Allow public read on messages" ON messages
  FOR SELECT USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Insert a test message
INSERT INTO messages (name, message) VALUES 
('Sistema', 'Banco de dados configurado com sucesso! 🎉');

-- Show the result
SELECT 'Table created successfully!' as status;
