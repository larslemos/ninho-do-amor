// types/wedding.ts
export interface GuestData {
  id: string;
  nome: string;
  email?: string;
  status: string;
  mesa?: string;
  unique_url: string;
  token: string;
  rsvp_deadline?: string;
  wedding_id: string;
  invitation_sent_at?: string;
  telefone?: string;
  slug?: string;
}

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
  slug: string;
  date?: string; // Ensure optional
  time?: string; // Ensure optional
  theme?: string;
  design_elements?: {
    branding?: string;
  };
}
export interface WeddingData {
  id: string;
  slug?: string;
  bride: string;
  groom: string;
  date: string; // ISO string format
  time?: string;
  day_of_week: string;
  venue: string;
  theme?: WeddingTheme; // Add theme property
  rsvp_numbers: string[];
  invitation_text_portuguese: string;
  bible_verse: string;
  ceremony_types: { type: string; icon_description: string }[];
  wedding_program: { time: string; activity: string }[];
  design_elements: {
    floral_elements: string;
    branding?: string;
  };
  created_at: string;
  updated_at: string;
  wedding_id: string; // Optional, depending on your schema
}

export type WeddingTheme = 'branco-dourado' | 'other-theme'; // Define possible themes
