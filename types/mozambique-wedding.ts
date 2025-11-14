// Tipos base para o sistema de casamentos moçambicano
export interface Couple {
  id: string;
  groom: {
    fullName: string;
    traditionalName?: string;
    contact: ContactInfo;
    province: MozambiqueProvince;
    preferredLanguages: Language[];
    religiousTradition: ReligiousTradition;
  };
  bride: {
    fullName: string;
    maidenName: string;
    traditionalName?: string;
    contact: ContactInfo;
    province: MozambiqueProvince;
    preferredLanguages: Language[];
    religiousTradition: ReligiousTradition;
  };
  weddingId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
}

export type MozambiqueProvince =
  | 'Maputo'
  | 'Gaza'
  | 'Inhambane'
  | 'Sofala'
  | 'Manica'
  | 'Tete'
  | 'Zambézia'
  | 'Nampula'
  | 'Cabo Delgado'
  | 'Niassa';

export type Language =
  | 'Português'
  | 'Changana'
  | 'Sena'
  | 'Ndau'
  | 'Makhuwa'
  | 'Lomwe'
  | 'Tsonga'
  | 'Nyanja';

export type ReligiousTradition = 'Católica' | 'Protestante' | 'Islâmica' | 'Tradicional' | 'Outras';

export interface WeddingEvent {
  id: string;
  type: EventType;
  date: string;
  startTime: string;
  endTime?: string;
  location: EventLocation;
  capacity?: number;
  witnesses?: string[];
  officiant?: string;
  enabled: boolean;
}

export type EventType = 'copo-agua' | 'cerimonia-civil' | 'cerimonia-religiosa' | 'festa-casamento';

export interface EventLocation {
  name: string;
  address: string;
  googleMapsUrl?: string;
  reference?: string;
}

export interface SystemUser {
  id: string;
  name: string;
  contact: string;
  role: UserRole;
  permissions: Permission[];
  weddingId: string;
}

export type UserRole = 'mc' | 'decoradora' | 'motorista' | 'noivos';

export type Permission =
  | 'view-full-program'
  | 'view-guest-list'
  | 'view-table-organization'
  | 'view-timeline'
  | 'view-emergency-contacts'
  | 'view-vip-notes'
  | 'view-layout'
  | 'view-guest-count'
  | 'view-themes-colors'
  | 'view-setup-schedule'
  | 'contact-couple'
  | 'view-reference-photos'
  | 'view-complete-schedule'
  | 'view-all-addresses'
  | 'view-contact-info'
  | 'view-optimized-routes'
  | 'view-transport-list'
  | 'view-emergency-numbers';

export interface Guest {
  id: string;
  fullName: string;
  relationship: GuestRelationship;
  side: 'noiva' | 'noivo' | 'ambos';
  priority: GuestPriority;
  contact: {
    phone?: string;
    whatsapp?: string;
    email?: string;
    address?: string;
  };
  companions: number;
  dietaryRestrictions?: string;
  assignedTable?: string;
  status: RSVPStatus;
  events: EventType[];
  needsTransport: boolean;
  weddingId: string;
}

export type GuestRelationship = 'Família' | 'Amigo' | 'Trabalho' | 'Vizinho' | 'Igreja';

export type GuestPriority = 'VIP' | 'Família Próxima' | 'Família Alargada' | 'Amigos';

export type RSVPStatus = 'confirmado' | 'pendente' | 'recusado';

export interface Table {
  id: string;
  number: string;
  type: 'redonda' | 'rectangular';
  capacity: number;
  isVIP: boolean;
  isMainTable: boolean;
  guests: string[]; // guest IDs
  weddingId: string;
}

export interface WeddingDesign {
  id: string;
  style: DesignStyle;
  background: BackgroundOption;
  fonts: FontSelection;
  colors: ColorScheme;
  customText: string;
  weddingId: string;
}

export type DesignStyle =
  | 'tradicional-mocambicano'
  | 'moderno-minimalista'
  | 'romantico-classico'
  | 'cultural-regional';

export interface BackgroundOption {
  type: 'image' | 'pattern' | 'solid' | 'gradient';
  value: string;
}

export interface FontSelection {
  primary: string;
  secondary: string;
  accent: string;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface LandingPageConfig {
  id: string;
  sections: LandingPageSection[];
  customization: {
    colors: ColorScheme;
    backgroundMusic?: string;
    animations: boolean;
  };
  weddingId: string;
}

export interface LandingPageSection {
  type: SectionType;
  enabled: boolean;
  order: number;
  content: any;
}

export type SectionType =
  | 'header'
  | 'countdown'
  | 'our-story'
  | 'events'
  | 'gallery'
  | 'rsvp'
  | 'location'
  | 'gifts'
  | 'contacts';

export interface Beverage {
  id: string;
  name: string;
  category: BeverageCategory;
  subcategory: string;
  pricePerUnit: number;
  supplier: string;
  quantityNeeded: number;
  weddingId: string;
}

export type BeverageCategory = 'alcoholic' | 'non-alcoholic' | 'traditional' | 'hot-drinks';

export interface PhotoGallery {
  id: string;
  eventType: EventType;
  photos: Photo[];
  qrCode: string;
  moderationEnabled: boolean;
  weddingId: string;
}

export interface Photo {
  id: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  approved: boolean;
  tags: string[];
  likes: number;
}

export interface WaitingList {
  id: string;
  guests: WaitingListGuest[];
  autoInviteEnabled: boolean;
  weddingId: string;
}

export interface WaitingListGuest {
  guestId: string;
  priority: number;
  addedAt: string;
  notifiedAt?: string;
}
