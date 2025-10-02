// types/wedding.ts

// types/wedding.ts
export interface Guest {
  id: string;
  nome: string;
  email?: string;
  status: string;
  mesa?: string;
  unique_url: string;
  token: string;
  rsvp_deadline?: string; // ISO string format
  wedding_id: string;
  // Add other fields as needed (e.g., telefone, companions)
}
export interface WeddingData {
  id: string;
  slug?: string;
  bride: string;
  groom: string;
  date: string; // ISO string format
  day_of_week: string;
  time: string;
  venue: string;
  theme?: WeddingTheme; // Add theme property
  rsvp_numbers: string[];
  invitation_text_portuguese: string;
  bible_verse: string;
  ceremony_types: { type: string; icon_description: string }[];
  wedding_program: { time: string; activity: string }[];
  design_elements: {
    floral_elements: string;
  };
  created_at: string;
  updated_at: string;
  wedding_id: string; // Optional, depending on your schema
}

export type WeddingTheme = 'branco-dourado' | 'other-theme'; // Define possible themes
