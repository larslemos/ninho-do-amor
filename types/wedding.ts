export interface Guest {
  id: string;
  nome: string;
  email?: string;
  status: string;
  mesa?: string;
  unique_url: string;
  token: string;
  rsvp_deadline?: string; // ISO string format
}

export interface WeddingData {
  wedding_details: {
    bride: string;
    groom: string;
    date: string;
    day_of_week: string;
    time: string;
    venue: string;
    rsvp_numbers: string[];
  };
  invitation_text: {
    portuguese: string;
  };
  ceremony_types: { type: string; icon_description: string }[];
  wedding_program: { time: string; activity: string }[];
  design_elements: {
    color_scheme: string[];
    floral_elements: string;
    background: string;
    rings: string;
    branding: string;
  };
}
